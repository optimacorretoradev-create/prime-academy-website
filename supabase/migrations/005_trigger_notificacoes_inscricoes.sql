-- SQL para ativar notificações automáticas no painel de administração

-- 1. Função que insere notificações para todos os administradores
CREATE OR REPLACE FUNCTION public.trg_notify_new_enrollment_to_admins()
RETURNS TRIGGER AS $$
DECLARE
  r_admin RECORD;
BEGIN
  -- Insert para cada administrador encontrado
  FOR r_admin IN
    SELECT id FROM public.perfis WHERE cargo = 'admin'
  LOOP
    INSERT INTO public.notificacoes (perfil_id, tipo, titulo, descricao, metadata)
    VALUES (
      r_admin.id,
      'nova_inscricao',
      'Nova Inscrição',
      'Nova inscrição de ' || NEW.nome || ' para ' || NEW.curso_nome,
      jsonb_build_object('inscricao_id', NEW.id)
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger que chama a função após cada nova inscrição
DROP TRIGGER IF EXISTS trg_inscricoes_notify_admin ON public.inscricoes;
CREATE TRIGGER trg_inscricoes_notify_admin
AFTER INSERT ON public.inscricoes
FOR EACH ROW
EXECUTE FUNCTION public.trg_notify_new_enrollment_to_admins();
