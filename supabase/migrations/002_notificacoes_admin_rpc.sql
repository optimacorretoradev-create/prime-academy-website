-- Opcional: função para criar notificações sem falhar por RLS
-- Execute se não usar SUPABASE_SERVICE_ROLE_KEY na app

CREATE OR REPLACE FUNCTION public.criar_notificacao_admin(
  p_perfil_id UUID,
  p_tipo TEXT,
  p_titulo TEXT,
  p_descricao TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem criar notificações';
  END IF;

  INSERT INTO public.notificacoes (perfil_id, tipo, titulo, descricao, metadata)
  VALUES (p_perfil_id, p_tipo, p_titulo, p_descricao, COALESCE(p_metadata, '{}'::jsonb))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.criar_notificacao_admin TO authenticated;
