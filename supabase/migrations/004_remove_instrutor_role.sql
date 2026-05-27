-- =============================================================================
-- PRIME ACADEMY — Simplificação de Roles (v4)
-- Remover o role 'instrutor'. Passa a haver apenas 'aluno' e 'admin'.
-- =============================================================================

-- 1. Promover todos os atuais instrutores a admin para não perderem acesso
UPDATE public.perfis
SET cargo = 'admin', atualizado_em = NOW()
WHERE cargo = 'instrutor';

-- 2. Atualizar a restrição CHECK na tabela de perfis
ALTER TABLE public.perfis DROP CONSTRAINT IF EXISTS perfis_cargo_check;
ALTER TABLE public.perfis
  ADD CONSTRAINT perfis_cargo_check
  CHECK (cargo IN ('aluno', 'admin'));

-- 3. Atualizar a função is_admin() para apenas aceitar 'admin'
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
      AND p.cargo = 'admin'
  );
$$;

-- 4. Remover a tabela curso_instrutores (pois a gestão de cursos agora é apenas via admin geral)
DROP TABLE IF EXISTS public.curso_instrutores CASCADE;
