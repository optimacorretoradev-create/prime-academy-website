import { supabase } from '@/lib/supabase'
import type { AppNotification, NotificationTipo } from '@/lib/admin-types'
import { getAccessToken } from '@/lib/admin-api'

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Agora'
  if (mins < 60) return `Há ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Há ${hours} h`
  const days = Math.floor(hours / 24)
  return `Há ${days} dia${days > 1 ? 's' : ''}`
}

/** Leitura via API (service role no servidor) — não depende de RLS no cliente */
export async function fetchNotifications(perfilId: string): Promise<AppNotification[]> {
  try {
    const token = await getAccessToken()
    if (token) {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok && Array.isArray(json.notifications)) {
        return json.notifications as AppNotification[]
      }
      if (!res.ok && json.error) {

      }
    }
  } catch (e) {

  }

  // Fallback: tentar com cliente anon (respeita RLS)
  try {
    const { data, error } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('perfil_id', perfilId)
      .order('criado_em', { ascending: false })
      .limit(50)

    if (!error && data && data.length > 0) {
      return data.map((n) => ({
        id: n.id,
        perfil_id: n.perfil_id,
        tipo: n.tipo as NotificationTipo,
        titulo: n.titulo,
        descricao: n.descricao,
        lida: n.lida,
        metadata: n.metadata ?? {},
        criado_em: n.criado_em,
        time: formatTime(n.criado_em),
      }))
    }
  } catch (e) {

  }

  // Se tudo falhar, retornar vazio (não há cache local)
  return []
}

export async function createNotification(params: {
  perfilId: string
  tipo: NotificationTipo
  titulo: string
  descricao: string
  metadata?: Record<string, unknown>
}): Promise<{ ok: boolean; error?: string; warned?: boolean }> {
  try {
    const { data, error } = await supabase
      .from('notificacoes')
      .insert([
        {
          perfil_id: params.perfilId,
          tipo: params.tipo,
          titulo: params.titulo,
          descricao: params.descricao,
          metadata: params.metadata || {},
          lida: false
        }
      ]);

    if (error) {

      // Retorna ok: true para não travar o fluxo principal de inscrição (ex: enrollments-service)
      return { ok: true, warned: true };
    }

    return { ok: true };
  } catch (err) {

    return { ok: false, error: 'Erro inesperado ao criar notificação.' };
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const token = await getAccessToken()
  if (token) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    })
  } else {
    // Fallback: tentar com cliente anon (respeita RLS)
    try {
      await supabase.from('notificacoes').update({ lida: true }).eq('id', id)
    } catch (e) {

    }
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  const token = await getAccessToken()
  if (token) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ all: true }),
    })
  } else {
    // Fallback: tentar com cliente anon (respeita RLS)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('notificacoes')
          .update({ lida: true })
          .eq('perfil_id', user.id)
          .eq('lida', false)
      }
    } catch (e) {

    }
  }
}

export async function findPerfilIdByEmail(email: string): Promise<string | null> {
  const { data } = await supabase
    .from('perfis')
    .select('id')
    .ilike('email', email.trim())
    .maybeSingle()

  return data?.id ?? null
}
