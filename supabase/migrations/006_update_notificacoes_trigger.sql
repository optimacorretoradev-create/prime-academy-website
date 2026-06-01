-- SQL para automação de notificações (Admin e Aluno)

-- 1. Função atualizada para notificar administradores
CREATE OR REPLACE FUNCTION public.trg_notify_new_enrollment_to_admins()
RETURNS TRIGGER AS $$
DECLARE
  r_admin RECORD;
BEGIN
  FOR r_admin IN
    SELECT id FROM public.perfis WHERE cargo = 'admin'
  LOOP
    INSERT INTO public.notificacoes (perfil_id, tipo, titulo, descricao, metadata)
    VALUES (
      r_admin.id,
      'nova_inscricao',
      'Nova Inscrição',
      'Nova inscrição de ' || NEW.nome || ' para ' || NEW.curso_nome || '. Consulte a Base de Dados para Validar.',
      jsonb_build_object('inscricao_id', NEW.id)
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger que chama a função de notificação admin
DROP TRIGGER IF EXISTS trg_inscricoes_notify_admin ON public.inscricoes;
CREATE TRIGGER trg_inscricoes_notify_admin
AFTER INSERT ON public.inscricoes
FOR EACH ROW
EXECUTE FUNCTION public.trg_notify_new_enrollment_to_admins();

-- 3. Função para notificar alunos sobre mudança de estado
CREATE OR REPLACE FUNCTION public.trg_inscricoes_status_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.estado IS DISTINCT FROM NEW.estado THEN
    IF NEW.estado = 'aceite' THEN
      INSERT INTO public.notificacoes (perfil_id, tipo, titulo, descricao, metadata)
      VALUES (
        NEW.perfil_id,
        'inscricao_aceite',
        'Inscrição Aceite! 🎉',
        'A sua inscrição no curso ' || NEW.curso_nome || ' foi aceite. Consulte a sua aba Meus Cursos.',
        jsonb_build_object('inscricao_id', NEW.id)
      );
    ELSIF NEW.estado = 'rejeitado' THEN
      INSERT INTO public.notificacoes (perfil_id, tipo, titulo, descricao, metadata)
      VALUES (
        NEW.perfil_id,
        'inscricao_rejeitada',
        'Inscrição Rejeitada',
        'A sua inscrição no curso ' || NEW.curso_nome || ' foi rejeitada porque não cumpriu os requisitos. Por favor, preencha todos os requisitos.',
        jsonb_build_object('inscricao_id', NEW.id)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger para monitorar atualizações na inscrição
DROP TRIGGER IF EXISTS trg_inscricoes_status_changed ON public.inscricoes;
CREATE TRIGGER trg_inscricoes_status_changed
AFTER UPDATE ON public.inscricoes
FOR EACH ROW
EXECUTE FUNCTION public.trg_inscricoes_status_changed();
