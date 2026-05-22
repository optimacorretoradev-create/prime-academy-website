import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createUserClient } from '@/lib/supabase-server'
import type { AppNotification, NotificationTipo } from '@/lib/admin-types'

async function isAdminUser(token: string) {
  const userClient = createUserClient(token)
  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser()

  if (authError || !user) return false

  const { data: perfil, error: perfilError } = await userClient
    .from('perfis')
    .select('cargo')
    .eq('id', user.id)
    .maybeSingle()

  if (perfilError || !perfil?.cargo) return false
  return ['admin', 'instrutor'].includes(perfil.cargo)
}

async function notifyAllAdmins(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  tipo: NotificationTipo,
  titulo: string,
  descricao: string,
  metadata: Record<string, unknown> | null
) {
  const { data: admins, error: adminsError } = await supabaseAdmin
    .from('perfis')
    .select('id')
    .in('cargo', ['admin', 'instrutor'])

  if (adminsError) {
    throw new Error(adminsError.message)
  }

  const inserts = (admins ?? []).map((admin) => ({
    perfil_id: admin.id,
    tipo,
    titulo,
    descricao,
    metadata: metadata ?? {},
  }))

  const { error } = await supabaseAdmin.from('notificacoes').insert(inserts)
  if (error) {
    throw new Error(error.message)
  }
}

function formatNotifications(rows: Record<string, unknown>[]): AppNotification[] {
  return rows.map((n) => {
    const criado = String(n.criado_em ?? new Date().toISOString())
    const diff = Date.now() - new Date(criado).getTime()
    const mins = Math.floor(diff / 60000)
    let time = 'Agora'
    if (mins >= 1 && mins < 60) time = `Há ${mins} min`
    else if (mins >= 60) {
      const h = Math.floor(mins / 60)
      if (h < 24) time = `Há ${h} h`
      else time = `Há ${Math.floor(h / 24)} dia(s)`
    }

    return {
      id: String(n.id),
      perfil_id: String(n.perfil_id),
      tipo: n.tipo as NotificationTipo,
      titulo: String(n.titulo),
      descricao: String(n.descricao),
      lida: Boolean(n.lida),
      metadata: (n.metadata as Record<string, unknown>) ?? {},
      criado_em: criado,
      time,
    }
  })
}

/** GET — notificações do utilizador autenticado (via service role, filtro por perfil_id) */
export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const userClient = createUserClient(token)
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('notificacoes')
      .select('*')
      .eq('perfil_id', user.id)
      .order('criado_em', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      notifications: formatNotifications(data ?? []),
      perfilId: user.id,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro interno' },
      { status: 500 }
    )
  }
}

/** PATCH — marcar uma ou todas como lidas */
export async function PATCH(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const userClient = createUserClient(token)
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { id, all } = body as { id?: string; all?: boolean }

    const supabaseAdmin = getSupabaseAdmin()

    if (all) {
      const { error } = await supabaseAdmin
        .from('notificacoes')
        .update({ lida: true })
        .eq('perfil_id', user.id)
        .eq('lida', false)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (!id) {
      return NextResponse.json({ error: 'id ou all=true obrigatório' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('notificacoes')
      .update({ lida: true })
      .eq('id', id)
      .eq('perfil_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
