import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { createUserClient, verifyAdminFromToken } from '@/lib/supabase-server'
import type { NotificationTipo } from '@/lib/admin-types'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()

    if (!token) {
      return NextResponse.json({ error: 'Sessão inválida. Inicie sessão novamente.' }, { status: 401 })
    }

    const admin = await verifyAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: 'Sem permissão de administrador.' }, { status: 403 })
    }

    const body = await request.json()
    const { perfilId, tipo, titulo, descricao, metadata } = body as {
      perfilId: string
      tipo: NotificationTipo
      titulo: string
      descricao: string
      metadata?: Record<string, unknown>
    }

    if (!perfilId || !tipo || !titulo || !descricao) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 })
    }

    const row = {
      perfil_id: perfilId,
      tipo,
      titulo,
      descricao,
      lida: false,
      metadata: metadata ?? {},
    }

    let supabaseAdmin
    try {
      supabaseAdmin = getSupabaseAdmin()
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Service role em falta' },
        { status: 503 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('notificacoes')
      .insert(row)
      .select('id, criado_em')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data.id, criado_em: data.criado_em })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
