import { supabase } from '@/lib/supabase'
import type { Inscricao, InscricaoEstado } from '@/lib/admin-types'
import { createNotification, findPerfilIdByEmail } from '@/lib/notifications-service'

/**
 * Notifica todos os admins sobre uma inscrição
 */
async function notifyAdminsAboutInscricao(params: {
  tipo: 'nova_inscricao' | 'inscricao_processada'
  titulo: string
  descricao: string
  inscricao_id: string
  curso_id: string
  curso_nome: string
}) {
  try {
    const { data: admins } = await supabase
      .from('perfis')
      .select('id')
      .eq('cargo', 'admin')

    if (admins && admins.length > 0) {
      for (const admin of admins) {
        await createNotification({
          perfilId: admin.id,
          tipo: params.tipo,
          titulo: params.titulo,
          descricao: params.descricao,
          metadata: {
            inscricao_id: params.inscricao_id,
            curso_id: params.curso_id,
            curso_nome: params.curso_nome,
          },
        })
      }
    }
  } catch (e) {
    console.warn('[inscricoes] Erro ao notificar admins:', e)
  }
}

export async function createInscricao(input: {
  nome: string
  email: string
  telefone?: string
  curso_id: string
  curso_nome: string
  mensagem?: string
  comprovativo_enviado?: boolean
}): Promise<{ ok: boolean; error?: string; inscricao?: Inscricao }> {
  const email = input.email.toLowerCase().trim()
  const perfilId = await findPerfilIdByEmail(email)

  const row = {
    perfil_id: perfilId,
    nome: input.nome,
    email,
    telefone: input.telefone ?? null,
    curso_id: input.curso_id,
    curso_nome: input.curso_nome,
    mensagem: input.mensagem ?? null,
    estado: 'pendente' as InscricaoEstado,
  }

  const { data, error } = await supabase
    .from('inscricoes')
    .insert(row)
    .select('*')
    .single()

  if (!error && data) {
    if (perfilId) {
      await createNotification({
        perfilId,
        tipo: 'inscricao_recebida',
        titulo: 'Pedido de inscrição enviado',
        descricao: `O seu pedido para "${input.curso_nome}" foi recebido e aguarda aprovação.`,
        metadata: { curso_id: input.curso_id, inscricao_id: data.id },
      })
    }    
    // Notificar admins sobre nova inscricao
    await notifyAdminsAboutInscricao({
      tipo: 'nova_inscricao',
      titulo: 'Nova inscricao pendente',
      descricao: `${input.nome} solicitou inscricao no curso "${input.curso_nome}"`,
      inscricao_id: data.id,
      curso_id: input.curso_id,
      curso_nome: input.curso_nome,
    })
        return { ok: true, inscricao: data as Inscricao }
  }

  // Sem fallback local — falha se Supabase falhar
  return { ok: false, error: error?.message || 'Erro ao criar inscrição' }
}

export async function fetchInscricoes(estado?: InscricaoEstado): Promise<Inscricao[]> {
  try {
    let query = supabase.from('inscricoes').select('*').order('criado_em', { ascending: false })

    if (estado) {
      query = query.eq('estado', estado)
    }

    const { data, error } = await query

    if (!error && data) {
      return data as Inscricao[]
    }

    console.warn('[inscricoes] Erro ao carregar:', error?.message)
    return []
  } catch (e) {
    console.error('[inscricoes] Falha ao carregar:', e)
    return []
  }
}

export async function updateInscricaoEstado(
  inscricao: Inscricao,
  estado: 'aceite' | 'rejeitado',
  adminPerfilId?: string
): Promise<{ ok: boolean; error?: string }> {
  const now = new Date().toISOString()

  const { error } = await supabase
    .from('inscricoes')
    .update({ estado, atualizado_em: now })
    .eq('id', inscricao.id)

  if (error) {
    return { ok: false, error: error.message }
  }

  let perfilId = inscricao.perfil_id ?? (await findPerfilIdByEmail(inscricao.email))

  if (estado === 'aceite' && perfilId) {
    await supabase.from('matriculas').upsert(
      {
        perfil_id: perfilId,
        curso_id_catalogo: inscricao.curso_id,
        curso_nome: inscricao.curso_nome,
        inscricao_id: inscricao.id,
      },
      { onConflict: 'perfil_id,curso_id_catalogo' }
    )
  }

  if (perfilId) {
    await createNotification({
      perfilId,
      tipo: estado === 'aceite' ? 'inscricao_aceite' : 'inscricao_rejeitado',
      titulo:
        estado === 'aceite'
          ? 'Inscrição aprovada!'
          : 'Inscrição não aprovada',
      descricao:
        estado === 'aceite'
          ? `A sua inscrição no curso "${inscricao.curso_nome}" foi aceite. Já pode aceder ao conteúdo no painel.`
          : `O pedido de inscrição em "${inscricao.curso_nome}" foi revisto e não foi aprovado neste momento.`,
      metadata: {
        curso_id: inscricao.curso_id,
        inscricao_id: inscricao.id,
        admin_id: adminPerfilId,
      },
    })
  }

  // Notificar admins sobre processamento de inscrição
  await notifyAdminsAboutInscricao({
    tipo: 'inscricao_processada',
    titulo: estado === 'aceite' ? 'Inscrição aceite' : 'Inscrição rejeitada',
    descricao: `Inscrição de ${inscricao.nome} no curso "${inscricao.curso_nome}" foi ${estado === 'aceite' ? 'aceite' : 'rejeitada'}.`,
    inscricao_id: inscricao.id,
    curso_id: inscricao.curso_id,
    curso_nome: inscricao.curso_nome,
  })

  return { ok: true }
}
