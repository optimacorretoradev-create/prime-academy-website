'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ClipboardList,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Inscricao } from '@/lib/admin-types'
import { fetchInscricoes, updateInscricaoEstado } from '@/lib/enrollments-service'
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
  const { refresh: refreshNotifications } = useNotifications()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data =
        filter === 'todos' ? await fetchInscricoes() : await fetchInscricoes(filter)
      setInscricoes(data)
    } catch (e: any) {
      console.error('[AdminEnrollmentsPanel] Erro ao carregar:', e)
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
      setInscricoes((prev) => [inscricao, ...prev].sort((a,b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()))
    } else {
      toast.success(
        estado === 'aceite'
          ? `Inscrição de ${inscricao.nome} aceite.`
          : `Inscrição de ${inscricao.nome} rejeitada.`
      )
      // Atualizar sino de notificações
      await refreshNotifications()
      onUpdated?.()
    }
    setActingId(null)
  }

  const pendingCount = inscricoes.filter((i) => i.estado === 'pendente').length

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
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
          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#312455] cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex border-b border-slate-200 px-4">
        {(
          [
            { id: 'pendente' as const, label: 'Pendentes' },
            { id: 'aceite' as const, label: 'Aceites' },
            { id: 'rejeitado' as const, label: 'Rejeitadas' },
            { id: 'todos' as const, label: 'Todas' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 cursor-pointer ${
              filter === tab.id
                ? 'border-[#312455] text-[#312455]'
                : 'border-transparent text-slate-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
              className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#312455]">{ins.nome}</p>
                <p className="text-xs text-slate-500 mt-0.5">{ins.email}</p>
                <p className="text-sm text-slate-700 mt-2 font-medium">{ins.curso_nome}</p>
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
                    className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
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

              <div className="flex items-center gap-2 shrink-0">
                <EstadoBadge estado={ins.estado} />
                {ins.estado === 'pendente' && (
                  <>
                    <Button
                      size="sm"
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white h-9"
                      disabled={actingId !== null}
                      onClick={() => handleEstado(ins, 'aceite')}
                    >
                      {actingId === ins.id ? (
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {actingId === ins.id ? 'A processar...' : 'Aceitar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 h-9"
                      disabled={actingId !== null}
                      onClick={() => handleEstado(ins, 'rejeitado')}
                    >
                      {actingId === ins.id ? (
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {actingId === ins.id ? 'A processar...' : 'Rejeitar'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
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
      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${styles[estado]}`}
    >
      {labels[estado]}
    </span>
  )
}
