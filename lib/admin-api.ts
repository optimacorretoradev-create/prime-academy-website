import { supabase } from '@/lib/supabase'
import type { NotificationTipo } from '@/lib/admin-types'

export async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

export async function createNotificationViaApi(params: {
  perfilId: string
  tipo: NotificationTipo
  titulo: string
  descricao: string
  metadata?: Record<string, unknown>
}): Promise<{ ok: boolean; error?: string }> {
  const token = await getAccessToken()
  if (!token) {
    return {
      ok: false,
      error: 'Sem sessão Supabase ativa. Peça ao utilizador para iniciar sessão com email e senha.',
    }
  }

  const res = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      perfilId: params.perfilId,
      tipo: params.tipo,
      titulo: params.titulo,
      descricao: params.descricao,
      metadata: params.metadata,
    }),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: json.error || json.hint || 'Falha ao criar notificação' }
  }
  return { ok: true }
}

export async function removeUserViaApi(
  perfilId: string
): Promise<{ ok: boolean; error?: string; message?: string }> {
  const token = await getAccessToken()
  if (!token) {
    return { ok: false, error: 'Sessão inválida. Inicie sessão novamente.' }
  }

  const res = await fetch(`/api/admin/users/${perfilId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: json.error || 'Falha ao remover utilizador' }
  }
  return { ok: true, message: json.message }
}
