export type InscricaoEstado = 'pendente' | 'aceite' | 'rejeitado'

export type NotificationTipo =
  | 'inscricao_aceite'
  | 'inscricao_rejeitada'
  | 'nova_inscricao'
  | 'inscricao_recebida'
  | 'inscricao_em_analise'
  | 'inscricao_processada'
  | 'inscricao_pendente_pagamento'
  | 'promovido_admin'
  | 'cargo_revogado'

export interface Inscricao {
  id: string
  perfil_id: string | null
  nome: string
  email: string
  telefone: string | null
  curso_id: string
  curso_nome: string
  mensagem: string | null
  modalidade?: 'online' | 'presencial'
  comprovativo_url?: string | null
  estado: InscricaoEstado
  criado_em: string
  atualizado_em: string
}

export interface AppNotification {
  id: string
  perfil_id: string
  tipo: NotificationTipo
  titulo: string
  descricao: string
  lida: boolean
  metadata?: Record<string, unknown>
  criado_em: string
  time?: string
}

