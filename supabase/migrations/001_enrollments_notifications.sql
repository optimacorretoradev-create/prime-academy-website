-- =============================================================================
-- PRIME ACADEMY — Migração v2 (compatível com perfis.id e matriculas existente)
-- Copie TUDO e execute uma vez no SQL Editor do Supabase.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Funções auxiliares
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.perfis p
    WHERE p.id = auth.uid()
      AND p.cargo IN ('admin', 'instrutor')
  );
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.atualizado_em := now();
  RETURN NEW;
END;
$$;

-- Cargo 'admin' opcional em perfis
ALTER TABLE public.perfis DROP CONSTRAINT IF EXISTS perfis_cargo_check;

ALTER TABLE public.perfis
  ADD CONSTRAINT perfis_cargo_check
  CHECK (cargo IN ('aluno', 'instrutor', 'admin'));

-- -----------------------------------------------------------------------------
-- 1. INSCRIÇÕES (nova tabela — perfil_id → perfis.id)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.inscricoes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id     UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  nome          TEXT NOT NULL,
  email         TEXT NOT NULL,
  telefone      TEXT,
  curso_id      TEXT NOT NULL,
  curso_nome    TEXT NOT NULL,
  mensagem      TEXT,
  estado        TEXT NOT NULL DEFAULT 'pendente'
                CHECK (estado IN ('pendente', 'aceite', 'rejeitado')),
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inscricoes_estado ON public.inscricoes (estado);
CREATE INDEX IF NOT EXISTS idx_inscricoes_email  ON public.inscricoes (lower(email));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'inscricoes' AND column_name = 'perfil_id'
  ) THEN
    ALTER TABLE public.inscricoes
      ADD COLUMN perfil_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_inscricoes_perfil ON public.inscricoes (perfil_id);

-- -----------------------------------------------------------------------------
-- 2. NOTIFICAÇÕES (nova tabela — perfil_id → perfis.id)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notificacoes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id  UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  tipo       TEXT NOT NULL,
  titulo     TEXT NOT NULL,
  descricao  TEXT NOT NULL,
  lida       BOOLEAN NOT NULL DEFAULT false,
  metadata   JSONB NOT NULL DEFAULT '{}'::jsonb,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notificacoes' AND column_name = 'perfil_id'
  ) THEN
    ALTER TABLE public.notificacoes
      ADD COLUMN perfil_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_notificacoes_perfil_lida
  ON public.notificacoes (perfil_id, lida);

CREATE INDEX IF NOT EXISTS idx_notificacoes_criado
  ON public.notificacoes (perfil_id, criado_em DESC);

-- -----------------------------------------------------------------------------
-- 3. CURSO_INSTRUTORES (vários instrutores por curso)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.curso_instrutores (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id       TEXT NOT NULL,
  curso_nome     TEXT NOT NULL,
  instrutor_id   UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  designado_por  UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (curso_id, instrutor_id)
);

ALTER TABLE public.curso_instrutores
  DROP CONSTRAINT IF EXISTS curso_instrutores_curso_id_key;

CREATE INDEX IF NOT EXISTS idx_curso_instrutores_curso
  ON public.curso_instrutores (curso_id);

CREATE INDEX IF NOT EXISTS idx_curso_instrutores_instrutor
  ON public.curso_instrutores (instrutor_id);

-- -----------------------------------------------------------------------------
-- 4. MATRÍCULAS (tabela JÁ EXISTE — apenas ALTER seguro)
-- -----------------------------------------------------------------------------
-- Não fazemos CREATE TABLE. Adicionamos só colunas em falta.
-- curso_id_catalogo = ID textual do catálogo/Hygraph (formulário /enroll).
-- perfil_id         = FK explícita para perfis.id (auth.uid()).
-- -----------------------------------------------------------------------------

DO $$
BEGIN
  -- Ligação ao utilizador (perfis.id)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'matriculas' AND column_name = 'perfil_id'
  ) THEN
    ALTER TABLE public.matriculas
      ADD COLUMN perfil_id UUID REFERENCES public.perfis(id) ON DELETE CASCADE;
  END IF;

  -- Migrar dados se a coluna antiga aluno_id existir
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'matriculas' AND column_name = 'aluno_id'
  ) THEN
    EXECUTE $sql$
      UPDATE public.matriculas
      SET perfil_id = aluno_id
      WHERE perfil_id IS NULL AND aluno_id IS NOT NULL
    $sql$;
  END IF;

  -- Referência ao pedido de inscrição aceite
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'matriculas' AND column_name = 'inscricao_id'
  ) THEN
    ALTER TABLE public.matriculas
      ADD COLUMN inscricao_id UUID REFERENCES public.inscricoes(id) ON DELETE SET NULL;
  END IF;

  -- Nome do curso (exibição no painel)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'matriculas' AND column_name = 'curso_nome'
  ) THEN
    ALTER TABLE public.matriculas ADD COLUMN curso_nome TEXT;
  END IF;

  -- ID textual do curso (catálogo / Hygraph) — não conflita com curso_id UUID em cursos
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'matriculas' AND column_name = 'curso_id_catalogo'
  ) THEN
    ALTER TABLE public.matriculas ADD COLUMN curso_id_catalogo TEXT;
  END IF;
END $$;

-- Índice só depois da coluna existir
CREATE INDEX IF NOT EXISTS idx_matriculas_perfil
  ON public.matriculas (perfil_id);

CREATE INDEX IF NOT EXISTS idx_matriculas_inscricao
  ON public.matriculas (inscricao_id);

-- Unique para upsert do trigger (perfil + curso catálogo)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'matriculas_perfil_curso_catalogo_unique'
  ) THEN
    ALTER TABLE public.matriculas
      ADD CONSTRAINT matriculas_perfil_curso_catalogo_unique
      UNIQUE (perfil_id, curso_id_catalogo);
  END IF;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Constraint matriculas_perfil_curso_catalogo_unique não criada: %', SQLERRM;
END $$;

-- -----------------------------------------------------------------------------
-- 5. Trigger: ao aceitar inscrição → matricula em public.matriculas
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.trg_inscricao_aceite_criar_matricula()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_perfil_id UUID;
BEGIN
  IF NEW.estado IS DISTINCT FROM 'aceite' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.estado = 'aceite' AND NEW.estado = 'aceite' THEN
    RETURN NEW;
  END IF;

  v_perfil_id := NEW.perfil_id;

  IF v_perfil_id IS NULL THEN
    SELECT p.id INTO v_perfil_id
    FROM public.perfis p
    WHERE lower(p.email) = lower(NEW.email)
    LIMIT 1;
  END IF;

  IF v_perfil_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- INSERT respeitando colunas da matriculas existente + novas colunas
  INSERT INTO public.matriculas (
    perfil_id,
    curso_id_catalogo,
    curso_nome,
    inscricao_id
  )
  VALUES (
    v_perfil_id,
    NEW.curso_id,
    NEW.curso_nome,
    NEW.id
  )
  ON CONFLICT (perfil_id, curso_id_catalogo) DO UPDATE
    SET curso_nome    = EXCLUDED.curso_nome,
        inscricao_id  = EXCLUDED.inscricao_id;

  RETURN NEW;
EXCEPTION
  WHEN undefined_column THEN
    -- Fallback: tabela sem curso_id_catalogo (apenas perfil_id + curso_nome)
    INSERT INTO public.matriculas (perfil_id, curso_nome, inscricao_id)
    VALUES (v_perfil_id, NEW.curso_nome, NEW.id);
    RETURN NEW;
  WHEN others THEN
    RAISE WARNING 'trg_inscricao_aceite_criar_matricula: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_inscricoes_set_updated_at ON public.inscricoes;
CREATE TRIGGER trg_inscricoes_set_updated_at
  BEFORE UPDATE ON public.inscricoes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_inscricoes_aceite_matricula_update ON public.inscricoes;
CREATE TRIGGER trg_inscricoes_aceite_matricula_update
  AFTER UPDATE OF estado ON public.inscricoes
  FOR EACH ROW
  WHEN (NEW.estado = 'aceite')
  EXECUTE FUNCTION public.trg_inscricao_aceite_criar_matricula();

DROP TRIGGER IF EXISTS trg_inscricoes_aceite_matricula_insert ON public.inscricoes;
CREATE TRIGGER trg_inscricoes_aceite_matricula_insert
  AFTER INSERT ON public.inscricoes
  FOR EACH ROW
  WHEN (NEW.estado = 'aceite')
  EXECUTE FUNCTION public.trg_inscricao_aceite_criar_matricula();

DROP TRIGGER IF EXISTS trg_curso_instrutores_set_updated_at ON public.curso_instrutores;
CREATE TRIGGER trg_curso_instrutores_set_updated_at
  BEFORE UPDATE ON public.curso_instrutores
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 6. RLS
-- -----------------------------------------------------------------------------

ALTER TABLE public.inscricoes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curso_instrutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriculas        ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inscricoes_insert_public"        ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_select_admin"         ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_select_own"           ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_update_admin"         ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_delete_admin"         ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_select_instrutor"     ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_update_instrutor"     ON public.inscricoes;

DROP POLICY IF EXISTS "notificacoes_select_own"         ON public.notificacoes;
DROP POLICY IF EXISTS "notificacoes_update_own"         ON public.notificacoes;
DROP POLICY IF EXISTS "notificacoes_insert_admin"       ON public.notificacoes;
DROP POLICY IF EXISTS "notificacoes_insert_instrutor"   ON public.notificacoes;
DROP POLICY IF EXISTS "notificacoes_delete_admin"       ON public.notificacoes;

DROP POLICY IF EXISTS "curso_instrutores_select_auth"   ON public.curso_instrutores;
DROP POLICY IF EXISTS "curso_instrutores_insert_admin"  ON public.curso_instrutores;
DROP POLICY IF EXISTS "curso_instrutores_update_admin"  ON public.curso_instrutores;
DROP POLICY IF EXISTS "curso_instrutores_delete_admin"  ON public.curso_instrutores;
DROP POLICY IF EXISTS "curso_instrutores_all_instrutor" ON public.curso_instrutores;

DROP POLICY IF EXISTS "matriculas_select_own"           ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_select_admin"         ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_all_instrutor"        ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_insert_admin"         ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_update_admin"         ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_delete_admin"         ON public.matriculas;

-- INSCRIÇÕES
CREATE POLICY "inscricoes_insert_public"
  ON public.inscricoes FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "inscricoes_select_admin"
  ON public.inscricoes FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "inscricoes_select_own"
  ON public.inscricoes FOR SELECT TO authenticated
  USING (
    perfil_id = auth.uid()
    OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

CREATE POLICY "inscricoes_update_admin"
  ON public.inscricoes FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "inscricoes_delete_admin"
  ON public.inscricoes FOR DELETE TO authenticated USING (public.is_admin());

-- NOTIFICAÇÕES (perfil_id = perfis.id = auth.uid())
CREATE POLICY "notificacoes_select_own"
  ON public.notificacoes FOR SELECT TO authenticated
  USING (perfil_id = auth.uid());

CREATE POLICY "notificacoes_update_own"
  ON public.notificacoes FOR UPDATE TO authenticated
  USING (perfil_id = auth.uid()) WITH CHECK (perfil_id = auth.uid());

CREATE POLICY "notificacoes_insert_admin"
  ON public.notificacoes FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "notificacoes_delete_admin"
  ON public.notificacoes FOR DELETE TO authenticated USING (public.is_admin());

-- CURSO_INSTRUTORES
CREATE POLICY "curso_instrutores_select_auth"
  ON public.curso_instrutores FOR SELECT TO authenticated USING (true);

CREATE POLICY "curso_instrutores_insert_admin"
  ON public.curso_instrutores FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "curso_instrutores_update_admin"
  ON public.curso_instrutores FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "curso_instrutores_delete_admin"
  ON public.curso_instrutores FOR DELETE TO authenticated USING (public.is_admin());

-- MATRÍCULAS (perfil_id → perfis.id = auth.uid())
CREATE POLICY "matriculas_select_own"
  ON public.matriculas FOR SELECT TO authenticated
  USING (perfil_id = auth.uid());

CREATE POLICY "matriculas_select_admin"
  ON public.matriculas FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "matriculas_insert_admin"
  ON public.matriculas FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "matriculas_update_admin"
  ON public.matriculas FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "matriculas_delete_admin"
  ON public.matriculas FOR DELETE TO authenticated USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. Grants
-- -----------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.inscricoes TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.inscricoes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notificacoes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.curso_instrutores TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matriculas TO authenticated;

-- =============================================================================
-- Verificação rápida (opcional):
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'matriculas' ORDER BY ordinal_position;
-- =============================================================================
