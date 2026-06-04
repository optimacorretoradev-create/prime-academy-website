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
  modalidade: 'online' | 'presencial'
  comprovativo_url?: string | null
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
    modalidade: input.modalidade,
    comprovativo_url: input.comprovativo_url ?? null,
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
    let query = supabase.from('inscricoes').select('*').order('criado_em', { ascending: false })

    if (estado) {
      query = query.eq('estado', estado)
    }

    const { data, error } = await query

    if (error) {
      console.error('[Supabase Error] fetchInscricoes:', error)
      throw error // Propaga o erro para o componente tratar
    }

    return (data as Inscricao[]) || []
}

import { getAccessToken } from '@/lib/admin-api'

export async function updateInscricaoEstado(
  inscricao: Inscricao,
  estado: 'aceite' | 'rejeitado',
  adminPerfilId?: string
): Promise<{ ok: boolean; error?: string }> {
  const token = await getAccessToken()
  if (!token) {
    return { ok: false, error: 'Sessão inválida.' }
  }

  const res = await fetch(`/api/admin/enrollments/${inscricao.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado, inscricao }),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: json.error || 'Erro ao atualizar inscrição' }
  }
  return { ok: true }
}

export async function deleteInscricao(id: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('inscricoes')
    .delete()
    .eq('id', id)

  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
