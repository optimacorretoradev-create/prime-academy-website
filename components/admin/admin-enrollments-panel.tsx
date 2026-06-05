'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ClipboardList,
  Clock,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Inscricao } from '@/lib/admin-types'
import { fetchInscricoes, updateInscricaoEstado, deleteInscricao } from '@/lib/enrollments-service'
import { useNotifications } from '@/contexts/notifications-context'

interface AdminEnrollmentsPanelProps {
  adminPerfilId?: string
  onUpdated?: () => void
}

export function AdminEnrollmentsPanel({ adminPerfilId, onUpdated }: AdminEnrollmentsPanelProps) {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'pendente' | 'aceite' | 'rejeitado' | 'todos'>('pendente')
  const [actingId, setActingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Inscricao | null>(null)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const { refresh: refreshNotifications } = useNotifications()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data =
        filter === 'todos' ? await fetchInscricoes() : await fetchInscricoes(filter)
      setInscricoes(data)
    } catch (e: any) {

      setError(e.message || 'Erro desconhecido ao carregar inscrições.')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const handleEstado = async (inscricao: Inscricao, estado: 'aceite' | 'rejeitado') => {
    setActingId(inscricao.id)
    // Atualização Otimista
    setInscricoes((prev) => prev.filter((i) => i.id !== inscricao.id))

    const { ok, error } = await updateInscricaoEstado(inscricao, estado, adminPerfilId)

    if (!ok) {
      toast.error(error || 'Erro ao atualizar inscrição')
      // Rollback se falhar
      setInscricoes((prev) =>
        [inscricao, ...prev].sort(
          (a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
        )
      )
    } else {
      toast.success(
        estado === 'aceite'
          ? `Inscrição de ${inscricao.nome} aceite.`
          : `Inscrição de ${inscricao.nome} rejeitada.`
      )
      await refreshNotifications()
      onUpdated?.()
    }
    setActingId(null)
  }

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirm) return
    const ins = deleteConfirm
    setIsConfirmingDelete(true)
    setDeletingId(ins.id)

    // Optimistic removal
    setInscricoes((prev) => prev.filter((i) => i.id !== ins.id))

    const { ok, error } = await deleteInscricao(ins.id)

    if (!ok) {
      toast.error(error || 'Erro ao eliminar inscrição')
      // Rollback
      setInscricoes((prev) =>
        [ins, ...prev].sort(
          (a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
        )
      )
    } else {
      toast.success(`Registo de ${ins.nome} eliminado.`)
      onUpdated?.()
    }

    setDeletingId(null)
    setIsConfirmingDelete(false)
    setDeleteConfirm(null)
  }

  const pendingCount = inscricoes.filter((i) => i.estado === 'pendente').length
  const showDeleteButton = filter !== 'pendente'

  const TABS = [
    { id: 'pendente' as const, label: 'Pendentes' },
    { id: 'aceite' as const, label: 'Aceites' },
    { id: 'rejeitado' as const, label: 'Rejeitadas' },
    { id: 'todos' as const, label: 'Todas' },
  ]

  return (
    <>
      {/* ── Modal de confirmação de eliminação ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#312455]">Eliminar registo</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Esta ação não pode ser desfeita.</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Tem a certeza que quer eliminar o registo de inscrição de{' '}
                <strong className="text-[#312455]">{deleteConfirm.nome}</strong> no curso{' '}
                <strong className="text-[#312455]">{deleteConfirm.curso_nome}</strong>?
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  disabled={isConfirmingDelete}
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
                  disabled={isConfirmingDelete}
                  onClick={handleDeleteConfirmed}
                >
                  {isConfirmingDelete ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      A eliminar…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Painel principal ── */}
      <div className="flex-1 min-w-0 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#312455]" />
            <h2 className="text-lg font-black text-[#312455]">Inscrições</h2>
            {filter === 'pendente' && pendingCount > 0 && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={load}
            title="Atualizar lista"
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#312455] cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-2 sm:px-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                filter === tab.id
                  ? 'border-[#312455] text-[#312455]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">A carregar…</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">
              <p className="font-semibold">Erro ao carregar inscrições:</p>
              <p className="text-sm">{error}</p>
              <Button variant="outline" className="mt-4" onClick={load}>
                Tentar novamente
              </Button>
            </div>
          ) : inscricoes.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-slate-600">Sem inscrições nesta categoria</p>
            </div>
          ) : (
            inscricoes.map((ins) => (
              <div
                key={ins.id}
                className="px-4 sm:px-5 py-4 hover:bg-slate-50/80 transition-colors"
              >
                {/* Layout responsivo: info + acções */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#312455] text-sm leading-snug">{ins.nome}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{ins.email}</p>
                    <p className="text-sm text-slate-700 mt-2 font-medium leading-snug">{ins.curso_nome}</p>
                    {ins.telefone && (
                      <p className="text-xs text-slate-400 mt-1">{ins.telefone}</p>
                    )}
                    {ins.modalidade && (
                      <p className="text-xs font-semibold text-[#8a66a8] mt-1">
                        📚 Formato: <span className="capitalize">{ins.modalidade}</span>
                      </p>
                    )}
                    {ins.comprovativo_url && (
                      <a
                        href={ins.comprovativo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        📎 Ver Comprovativo Bancário
                      </a>
                    )}
                    {ins.mensagem && (
                      <p className="text-xs text-slate-500 mt-2 italic line-clamp-2">{ins.mensagem}</p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(ins.criado_em).toLocaleString('pt-AO')}
                    </p>
                  </div>

                  {/* Acções */}
                  <div className="flex flex-row flex-wrap items-center gap-2 shrink-0 self-start">
                    <EstadoBadge estado={ins.estado} />

                    {ins.estado === 'pendente' && (
                      <>
                        <Button
                          size="sm"
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs"
                          disabled={actingId !== null}
                          onClick={() => handleEstado(ins, 'aceite')}
                        >
                          {actingId === ins.id ? (
                            <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          )}
                          {actingId === ins.id ? 'A processar…' : 'Aceitar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 h-9 text-xs"
                          disabled={actingId !== null}
                          onClick={() => handleEstado(ins, 'rejeitado')}
                        >
                          {actingId === ins.id ? (
                            <RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                          )}
                          {actingId === ins.id ? 'A processar…' : 'Rejeitar'}
                        </Button>
                      </>
                    )}

                    {showDeleteButton && (
                      <button
                        type="button"
                        title="Eliminar registo"
                        disabled={deletingId === ins.id}
                        onClick={() => setDeleteConfirm(ins)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {deletingId === ins.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

function EstadoBadge({ estado }: { estado: Inscricao['estado'] }) {
  const styles = {
    pendente: 'bg-amber-50 text-amber-700 border-amber-200',
    aceite: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejeitado: 'bg-red-50 text-red-600 border-red-200',
  }
  const labels = {
    pendente: 'Pendente',
    aceite: 'Aceite',
    rejeitado: 'Rejeitado',
  }
  return (
    <span
      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border whitespace-nowrap ${styles[estado]}`}
    >
      {labels[estado]}
    </span>
  )
}
