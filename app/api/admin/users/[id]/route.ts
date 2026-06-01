import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { deleteUserCascade } from '@/lib/delete-user-cascade'
import { verifyAdminFromToken } from '@/lib/supabase-server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetId } = await params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()

    if (!token) {
      return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 })
    }

    const adminUser = await verifyAdminFromToken(token)
    if (!adminUser) {
      return NextResponse.json({ error: 'Sem permissão de administrador.' }, { status: 403 })
    }

    if (adminUser.id === targetId) {
      return NextResponse.json({ error: 'Não pode remover a sua própria conta.' }, { status: 400 })
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

    const { data: target, error: fetchError } = await supabaseAdmin
      .from('perfis')
      .select('id, email, nome')
      .eq('id', targetId)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!target) {
      return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 })
    }

    const result = await deleteUserCascade(supabaseAdmin, targetId)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: `Utilizador ${target.nome} removido com sucesso.`,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
