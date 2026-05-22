-- =============================================================================
-- PRIME ACADEMY — Ajuste RLS e Segurança (v3)
-- Execute no SQL Editor APÓS a migração 001.
-- Corrige: sino vazio (SELECT bloqueado) e reforça políticas admin.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Função is_admin (garantir que existe e está correta)
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

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- -----------------------------------------------------------------------------
-- 2. PERFIS — cada utilizador pode ler o próprio perfil (auth.uid = id)
-- -----------------------------------------------------------------------------

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "perfis_select_own" ON public.perfis;
DROP POLICY IF EXISTS "perfis_select_admin" ON public.perfis;
DROP POLICY IF EXISTS "perfis_update_own" ON public.perfis;

CREATE POLICY "perfis_select_own"
  ON public.perfis
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "perfis_select_admin"
  ON public.perfis
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "perfis_update_own"
  ON public.perfis
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin pode atualizar qualquer perfil (promover/revogar cargo)
DROP POLICY IF EXISTS "perfis_update_admin" ON public.perfis;
CREATE POLICY "perfis_update_admin"
  ON public.perfis
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin pode remover perfis (complemento à API service_role)
DROP POLICY IF EXISTS "perfis_delete_admin" ON public.perfis;
CREATE POLICY "perfis_delete_admin"
  ON public.perfis
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

GRANT SELECT, UPDATE ON public.perfis TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. NOTIFICAÇÕES — leitura e marcação pelo destinatário
-- -----------------------------------------------------------------------------

ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notificacoes_select_own" ON public.notificacoes;
DROP POLICY IF EXISTS "notificacoes_update_own" ON public.notificacoes;
DROP POLICY IF EXISTS "notificacoes_insert_admin" ON public.notificacoes;
DROP POLICY IF EXISTS "notificacoes_insert_instrutor" ON public.notificacoes;
DROP POLICY IF EXISTS "notificacoes_delete_admin" ON public.notificacoes;

-- Destinatário lê apenas as suas (perfil_id = auth.uid() = perfis.id)
CREATE POLICY "notificacoes_select_own"
  ON public.notificacoes
  FOR SELECT
  TO authenticated
  USING (perfil_id = auth.uid());

CREATE POLICY "notificacoes_update_own"
  ON public.notificacoes
  FOR UPDATE
  TO authenticated
  USING (perfil_id = auth.uid())
  WITH CHECK (perfil_id = auth.uid());

-- Admin cria notificações para qualquer perfil_id
CREATE POLICY "notificacoes_insert_admin"
  ON public.notificacoes
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "notificacoes_delete_admin"
  ON public.notificacoes
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notificacoes TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. INSCRIÇÕES — reafirmar políticas
-- -----------------------------------------------------------------------------

ALTER TABLE public.inscricoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inscricoes_insert_public" ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_select_admin" ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_select_own" ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_update_admin" ON public.inscricoes;
DROP POLICY IF EXISTS "inscricoes_delete_admin" ON public.inscricoes;

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

GRANT SELECT, INSERT ON public.inscricoes TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.inscricoes TO authenticated;

-- -----------------------------------------------------------------------------
-- 5. MATRÍCULAS — FK perfil_id com CASCADE (limpeza ao remover perfil)
-- -----------------------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'matriculas' AND column_name = 'perfil_id'
  ) THEN
    ALTER TABLE public.matriculas DROP CONSTRAINT IF EXISTS matriculas_perfil_id_fkey;
    ALTER TABLE public.matriculas
      ADD CONSTRAINT matriculas_perfil_id_fkey
      FOREIGN KEY (perfil_id) REFERENCES public.perfis(id) ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'matriculas FK CASCADE: %', SQLERRM;
END $$;

ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "matriculas_select_own" ON public.matriculas;
DROP POLICY IF EXISTS "matriculas_select_admin" ON public.matriculas;

CREATE POLICY "matriculas_select_own"
  ON public.matriculas FOR SELECT TO authenticated
  USING (perfil_id = auth.uid());

CREATE POLICY "matriculas_select_admin"
  ON public.matriculas FOR SELECT TO authenticated
  USING (public.is_admin());

GRANT SELECT ON public.matriculas TO authenticated;

-- -----------------------------------------------------------------------------
-- 6. NOTIFICAÇÕES — FK CASCADE ao apagar perfil
-- -----------------------------------------------------------------------------

ALTER TABLE public.notificacoes DROP CONSTRAINT IF EXISTS notificacoes_perfil_id_fkey;
ALTER TABLE public.notificacoes
  ADD CONSTRAINT notificacoes_perfil_id_fkey
  FOREIGN KEY (perfil_id) REFERENCES public.perfis(id) ON DELETE CASCADE;

-- -----------------------------------------------------------------------------
-- 7. Realtime (opcional — sino atualiza ao inserir notificação)
-- -----------------------------------------------------------------------------

ALTER TABLE public.notificacoes REPLICA IDENTITY FULL;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notificacoes;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN others THEN
    RAISE NOTICE 'Realtime notificacoes: %', SQLERRM;
END $$;

-- -----------------------------------------------------------------------------
-- 8. Verificação (execute separadamente se quiser)
-- -----------------------------------------------------------------------------
-- SELECT tablename, policyname, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public' AND tablename IN ('notificacoes', 'perfis')
-- ORDER BY tablename, policyname;

-- =============================================================================
-- FIM — Reinicie pnpm dev e confirme SUPABASE_SERVICE_ROLE_KEY no .env.local
-- =============================================================================
