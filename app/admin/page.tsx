'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Users,
  ClipboardList,
  BookOpen,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { AdminUsersPanel } from '@/components/admin/admin-users-panel'
import { AdminEnrollmentsPanel } from '@/components/admin/admin-enrollments-panel'
import { AdminCoursesInstructorsPanel } from '@/components/admin/admin-courses-instructors-panel'
import type { AdminPerfil } from '@/components/admin/admin-user-detail-panel'
import { AdminUserDetailPanel } from '@/components/admin/admin-user-detail-panel'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createNotification } from '@/lib/notifications-service'
import { removeUserViaApi } from '@/lib/admin-api'
import { getCourses } from '@/lib/hygraph'
import type { Course } from '@/lib/hygraph'
import { fetchInscricoes } from '@/lib/enrollments-service'

type AdminSection = 'utilizadores' | 'inscricoes' | 'cursos'
type TabId = 'todos' | 'aluno' | 'instrutor'
type SortKey = 'nome' | 'criado_em'

const SECTIONS: { id: AdminSection; label: string; icon: typeof Users }[] = [
  { id: 'utilizadores', label: 'Utilizadores', icon: Users },
  { id: 'inscricoes', label: 'Inscrições', icon: ClipboardList },
  { id: 'cursos', label: 'Cursos & Instrutores', icon: BookOpen },
]

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()

  const [section, setSection] = useState<AdminSection>('utilizadores')
  const [adminPerfilId, setAdminPerfilId] = useState<string | undefined>()
  const [perfis, setPerfis] = useState<AdminPerfil[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [loadingData, setLoadingData] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCargo, setFilterCargo] = useState<TabId>('todos')
  const [sortKey, setSortKey] = useState<SortKey>('nome')
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    perfil: AdminPerfil | null
    action: 'promover' | 'revogar' | 'remover'
  }>({ open: false, perfil: null, action: 'promover' })

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
    if (!isLoading && user && user.role !== 'instrutor' && user.role !== 'admin')
      router.push('/dashboard')
  }, [user, isLoading, router])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminPerfilId(session?.user?.id)
    })
  }, [])

  useEffect(() => {
    getCourses().then(setCourses)
  }, [])

  const fetchPerfis = useCallback(async () => {
    setLoadingData(true)
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar utilizadores: ' + error.message)
    } else {
      setPerfis(data || [])
    }
    setLoadingData(false)
  }, [])

  const refreshPending = useCallback(async () => {
    const pending = await fetchInscricoes('pendente')
    setPendingCount(pending.length)
  }, [])

  useEffect(() => {
    if (user?.role === 'instrutor' || user?.role === 'admin') {
      fetchPerfis()
      refreshPending()
    }
  }, [user, fetchPerfis, refreshPending])

  const closeConfirm = () =>
    setConfirmModal({ open: false, perfil: null, action: 'promover' })

  const handleConfirmAction = async () => {
    if (!confirmModal.perfil) return
    const perfil = confirmModal.perfil
    const { action } = confirmModal
    setUpdatingId(perfil.id)
    closeConfirm()

    if (action === 'remover') {
      const { ok, error, message } = await removeUserViaApi(perfil.id)
      if (!ok) {
        toast.error(error || 'Erro ao remover utilizador')
        setUpdatingId(null)
      } else {
        setPerfis((prev) => prev.filter((p) => p.id !== perfil.id))
        if (selectedId === perfil.id) setSelectedId(null)
        toast.success(message || `${perfil.nome} removido.`)

        // Se for o próprio utilizador logado, fazer logout imediatamente
        if (user && user.email === perfil.email) {
          setTimeout(async () => {
            await logout()
            router.push('/login')
          }, 800)
        } else {
          setUpdatingId(null)
        }
      }
      return
    }

    const novoCargo = action === 'promover' ? 'instrutor' : 'aluno'
    const { error } = await supabase
      .from('perfis')
      .update({ cargo: novoCargo, atualizado_em: new Date().toISOString() })
      .eq('id', perfil.id)

    if (error) {
      toast.error('Erro ao atualizar cargo: ' + error.message)
      setUpdatingId(null)
      return
    }

    setPerfis((prev) =>
      prev.map((p) => (p.id === perfil.id ? { ...p, cargo: novoCargo } : p))
    )

    if (action === 'promover') {
      const notif = await createNotification({
        perfilId: perfil.id,
        tipo: 'promovido_instrutor',
        titulo: 'Promovido a Instrutor',
        descricao:
          'Foi promovido ao cargo de Instrutor na Prime Academy. Já pode aceder às ferramentas de gestão e ao painel admin.',
      })
      if (notif.ok) {
        toast.success(`${perfil.nome} promovido(a) a Instrutor! Notificação enviada.`)
      } else {
        toast.warning(
          `${perfil.nome} promovido(a), mas a notificação falhou: ${notif.error}`
        )
      }
    } else {
      const notif = await createNotification({
        perfilId: perfil.id,
        tipo: 'cargo_revogado',
        titulo: 'Cargo atualizado',
        descricao:
          'O seu cargo na Prime Academy foi alterado para Aluno. O acesso de instrutor foi revogado.',
      })
      if (notif.ok) {
        toast.success(`${perfil.nome} revertido(a) para Aluno. Notificação enviada.`)
      } else {
        toast.success(`${perfil.nome} revertido(a) para Aluno.`)
      }
    }
    setUpdatingId(null)
  }

  const instrutores = perfis.filter((p) => p.cargo === 'instrutor')

  const handleExport = () => {
    const filtered = perfis.filter((p) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.nome.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      const matchCargo = filterCargo === 'todos' || p.cargo === filterCargo
      return matchSearch && matchCargo
    })
    if (filtered.length === 0) {
      toast.info('Não há dados para exportar.')
      return
    }
    const header = 'Nome,Email,Cargo,Registado em\n'
    const rows = filtered
      .map((p) =>
        [
          `"${p.nome.replace(/"/g, '""')}"`,
          p.email,
          p.cargo,
          new Date(p.criado_em).toLocaleDateString('pt-AO'),
        ].join(',')
      )
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'utilizadores-prime-academy.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Lista exportada.')
  }

  const selectedPerfil = perfis.find((p) => p.id === selectedId) ?? null

  if (isLoading || !user || (user.role !== 'instrutor' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#312455]" />
      </div>
    )
  }

  return (
    <DashboardShell activeNav="admin" lockScrollLayout>
      <AnimatePresence>
        {confirmModal.open && confirmModal.perfil && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#312455]">
                    {confirmModal.action === 'remover'
                      ? 'Remover utilizador'
                      : 'Confirmar alteração'}
                  </h3>
                  <p className="text-sm text-slate-500">Esta ação será aplicada imediatamente.</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {confirmModal.action === 'promover' && (
                  <>
                    Promover <strong className="text-[#312455]">{confirmModal.perfil.nome}</strong>{' '}
                    a Instrutor? Será notificado no painel (sino).
                  </>
                )}
                {confirmModal.action === 'revogar' && (
                  <>
                    Revogar cargo de instrutor de{' '}
                    <strong className="text-[#312455]">{confirmModal.perfil.nome}</strong>?
                    Será notificado da alteração.
                  </>
                )}
                {confirmModal.action === 'remover' && (
                  <>
                    Remover permanentemente{' '}
                    <strong className="text-[#312455]">{confirmModal.perfil.nome}</strong> (
                    {confirmModal.perfil.email})? A conta de autenticação e o perfil serão
                    apagados. Esta ação não pode ser desfeita.
                  </>
                )}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-lg" onClick={closeConfirm}>
                  Cancelar
                </Button>
                <Button
                  className={`flex-1 rounded-lg font-semibold text-white ${
                    confirmModal.action === 'remover'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#312455] hover:bg-[#3d2d6b]'
                  }`}
                  onClick={handleConfirmAction}
                >
                  {confirmModal.action === 'remover' ? 'Remover' : 'Confirmar'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-h-0 gap-4">
        {/* Secções admin */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            const isActive = section === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#312455] text-white border-[#312455] shadow-md shadow-[#312455]/15'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#312455]/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {s.label}
                {s.id === 'inscricoes' && pendingCount > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {section === 'utilizadores' && (
          <>
            <AdminUsersPanel
              perfis={perfis}
              loadingData={loadingData}
              search={search}
              onSearchChange={setSearch}
              filterCargo={filterCargo}
              onFilterCargoChange={setFilterCargo}
              sortKey={sortKey}
              sortAsc={sortAsc}
              onToggleSort={() => {
                if (sortKey === 'nome') setSortAsc((p) => !p)
                else {
                  setSortKey('nome')
                  setSortAsc(true)
                }
              }}
              onToggleSortKey={() =>
                setSortKey((k) => (k === 'nome' ? 'criado_em' : 'nome'))
              }
              onRefresh={fetchPerfis}
              onExport={handleExport}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              currentUserEmail={user.email}
              updatingId={updatingId}
              onPromover={(p) =>
                setConfirmModal({ open: true, perfil: p, action: 'promover' })
              }
              onRevogar={(p) =>
                setConfirmModal({ open: true, perfil: p, action: 'revogar' })
              }
              onRemover={(p) =>
                setConfirmModal({ open: true, perfil: p, action: 'remover' })
              }
            />
            {selectedPerfil && (
              <div className="xl:hidden shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden max-h-[42vh]">
                <AdminUserDetailPanel
                  perfil={selectedPerfil}
                  currentUserEmail={user.email}
                  updatingId={updatingId}
                  onPromover={(p) =>
                    setConfirmModal({ open: true, perfil: p, action: 'promover' })
                  }
                  onRevogar={(p) =>
                    setConfirmModal({ open: true, perfil: p, action: 'revogar' })
                  }
                  onRemover={(p) =>
                    setConfirmModal({ open: true, perfil: p, action: 'remover' })
                  }
                />
              </div>
            )}
          </>
        )}

        {section === 'inscricoes' && (
          <AdminEnrollmentsPanel
            adminPerfilId={adminPerfilId}
            onUpdated={refreshPending}
          />
        )}

        {section === 'cursos' && (
          <AdminCoursesInstructorsPanel
            courses={courses}
            instrutores={instrutores}
            adminPerfilId={adminPerfilId}
          />
        )}
      </div>
    </DashboardShell>
  )
}
