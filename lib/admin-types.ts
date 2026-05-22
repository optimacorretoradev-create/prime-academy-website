export type InscricaoEstado = 'pendente' | 'aceite' | 'rejeitado'

export type NotificationTipo =
  | 'inscricao_aceite'
  | 'inscricao_rejeitado'
  | 'inscricao_recebida'
  | 'inscricao_em_analise'
  | 'nova_inscricao'
  | 'inscricao_processada'
  | 'inscricao_pendente_pagamento'
  | 'promovido_instrutor'
  | 'cargo_revogado'
  | 'designado_instrutor_curso'

export interface Inscricao {
  id: string
  perfil_id: string | null
  nome: string
  email: string
  telefone: string | null
  curso_id: string
  curso_nome: string
  mensagem: string | null
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

export interface CursoInstrutor {
  id: string
  curso_id: string
  curso_nome: string
  instrutor_id: string
  designado_por: string | null
  criado_em: string
  atualizado_em: string
  instrutor?: { nome: string; email: string }
}
