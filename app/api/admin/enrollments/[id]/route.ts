import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminFromToken } from '@/lib/supabase-server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: inscricaoId } = await params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()

    if (!token) {
      return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 })
    }

    const adminUser = await verifyAdminFromToken(token)
    if (!adminUser) {
      return NextResponse.json({ error: 'Sem permissão de administrador.' }, { status: 403 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Erro de configuração: Chaves do Supabase não encontradas no servidor." }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const body = await request.json()
    const { estado } = body as {
      estado: 'aceite' | 'rejeitado'
    }

    if (!estado || !['aceite', 'rejeitado'].includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido.' }, { status: 400 })
    }

    // Atualizar estado da inscrição (A trigger cuidará do resto)
    const { error: updateError } = await supabaseAdmin
      .from('inscricoes')
      .update({ estado, atualizado_em: new Date().toISOString() })
      .eq('id', inscricaoId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    const detailedError = e && typeof e === 'object' ? JSON.stringify(e, Object.getOwnPropertyNames(e)) : String(e);
    console.error("[PATCH Enrollment Error]:", detailedError);
    
    return NextResponse.json({ error: detailedError }, { status: 500 });
  }
}
