'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, ShieldCheck, Search, ArrowUpRight, LogOut,
  BookOpen, GraduationCap, UserCheck, UserX, RefreshCw,
  ChevronDown, AlertTriangle, LayoutDashboard
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Perfil {
  id: string
  nome: string
  email: string
  cargo: 'aluno' | 'instrutor'
  foto_url: string | null
  criado_em: string
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()

  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCargo, setFilterCargo] = useState<'todos' | 'aluno' | 'instrutor'>('todos')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    perfil: Perfil | null
    novoCargo: 'aluno' | 'instrutor'
  }>({ open: false, perfil: null, novoCargo: 'aluno' })

  // Only instrutores can access admin
  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
    if (!isLoading && user && user.role !== 'instrutor') router.push('/dashboard')
  }, [user, isLoading, router])

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

  useEffect(() => {
    if (user?.role === 'instrutor') fetchPerfis()
  }, [user, fetchPerfis])

  const promoverCargo = async () => {
    if (!confirmModal.perfil) return
    setUpdatingId(confirmModal.perfil.id)
    setConfirmModal({ open: false, perfil: null, novoCargo: 'aluno' })

    const { error } = await supabase
      .from('perfis')
      .update({ cargo: confirmModal.novoCargo, atualizado_em: new Date().toISOString() })
      .eq('id', confirmModal.perfil.id)

    if (error) {
      toast.error('Erro ao atualizar cargo: ' + error.message)
    } else {
      setPerfis(prev =>
        prev.map(p =>
          p.id === confirmModal.perfil!.id
            ? { ...p, cargo: confirmModal.novoCargo }
            : p
        )
      )
      toast.success(
        confirmModal.novoCargo === 'instrutor'
          ? `✅ ${confirmModal.perfil.nome} promovido(a) a Instrutor!`
          : `↩️ ${confirmModal.perfil.nome} revertido(a) para Aluno.`
      )
    }
    setUpdatingId(null)
  }

  // Filtered list
  const filteredPerfis = perfis.filter(p => {
    const matchSearch =
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    const matchCargo = filterCargo === 'todos' || p.cargo === filterCargo
    return matchSearch && matchCargo
  })

  const totalAlunos = perfis.filter(p => p.cargo === 'aluno').length
  const totalInstrutores = perfis.filter(p => p.cargo === 'instrutor').length

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0816]">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#8a66a8] border-t-transparent" />
      </div>
    )
  }

  if (user.role !== 'instrutor') return null

  return (
    <div className="min-h-screen bg-[#0b0816] text-white">

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal.open && confirmModal.perfil && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1030] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#8a66a8]/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#8a66a8]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Confirmar Alteração</h3>
                  <p className="text-sm text-white/50">Esta ação será aplicada imediatamente.</p>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                {confirmModal.novoCargo === 'instrutor' ? (
                  <>Tem a certeza que deseja promover <strong className="text-white">{confirmModal.perfil.nome}</strong> ao cargo de <strong className="text-[#8a66a8]">Instrutor</strong>? O utilizador terá acesso a funcionalidades de gestão de cursos.</>
                ) : (
                  <>Tem a certeza que deseja revogar o cargo de instrutor de <strong className="text-white">{confirmModal.perfil.nome}</strong>? Será revertido para <strong className="text-amber-400">Aluno</strong>.</>
                )}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1 rounded-xl border border-white/10 text-white/70 hover:bg-white/5"
                  onClick={() => setConfirmModal({ open: false, perfil: null, novoCargo: 'aluno' })}
                >
                  Cancelar
                </Button>
                <Button
                  className={`flex-1 rounded-xl font-bold ${confirmModal.novoCargo === 'instrutor' ? 'bg-[#8a66a8] hover:bg-[#a882c5] text-white' : 'bg-amber-500 hover:bg-amber-400 text-black'}`}
                  onClick={promoverCargo}
                >
                  {confirmModal.novoCargo === 'instrutor' ? 'Promover' : 'Revogar'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <header className="border-b border-white/5 bg-[#0b0816]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#312455] to-[#8a66a8] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white text-sm tracking-tight">Prime <span className="text-[#8a66a8]">Admin</span></span>
            <span className="hidden sm:inline-block text-white/20 text-sm">|</span>
            <span className="hidden sm:inline-block text-white/40 text-xs">Painel de Gestão</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white/60 hover:text-white hover:bg-white/5 rounded-xl text-xs"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/5 rounded-xl text-xs"
              onClick={() => { logout(); router.push('/') }}
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            Gestão de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8a66a8] to-[#c2a8db]">Utilizadores</span>
          </h1>
          <p className="text-white/50 text-sm">
            Gerencie todos os utilizadores registados, promova alunos a instrutores ou revogue cargos.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            { label: 'Total de Utilizadores', value: perfis.length, icon: Users, color: 'from-[#312455] to-[#8a66a8]', textColor: 'text-[#c2a8db]' },
            { label: 'Alunos Registados', value: totalAlunos, icon: GraduationCap, color: 'from-blue-900/60 to-blue-800/40', textColor: 'text-blue-300' },
            { label: 'Instrutores Ativos', value: totalInstrutores, icon: ShieldCheck, color: 'from-emerald-900/60 to-emerald-800/40', textColor: 'text-emerald-300' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${stat.color} border border-white/5 rounded-2xl p-5 flex items-center gap-4`}
            >
              <stat.icon className={`w-8 h-8 ${stat.textColor} shrink-0`} />
              <div>
                <div className={`text-3xl font-black ${stat.textColor}`}>
                  {loadingData ? <span className="text-xl animate-pulse">...</span> : stat.value}
                </div>
                <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Pesquisar por nome ou email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-11 bg-white/5 border-white/10 text-white placeholder-white/30 rounded-xl h-11 focus:border-[#8a66a8] focus:ring-[#8a66a8]"
            />
          </div>

          <div className="flex gap-2">
            {(['todos', 'aluno', 'instrutor'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterCargo(f)}
                className={`px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filterCargo === f
                    ? 'bg-[#8a66a8] text-white shadow-lg shadow-[#8a66a8]/25'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                }`}
              >
                {f === 'todos' ? 'Todos' : f === 'aluno' ? 'Alunos' : 'Instrutores'}
              </button>
            ))}

            <button
              onClick={fetchPerfis}
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Recarregar"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-[#8a66a8]">Utilizador</th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-[#8a66a8]">Email</th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-[#8a66a8]">Cargo Atual</th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-[#8a66a8]">Registado em</th>
                  <th className="text-right p-4 text-xs font-bold uppercase tracking-widest text-[#8a66a8]">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loadingData ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="p-4">
                          <div className="h-4 bg-white/5 rounded-lg" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredPerfis.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-white/30">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-semibold">Nenhum utilizador encontrado</p>
                      <p className="text-xs mt-1">Tente ajustar os filtros de pesquisa</p>
                    </td>
                  </tr>
                ) : (
                  filteredPerfis.map(perfil => (
                    <tr
                      key={perfil.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Avatar + Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#312455] to-[#8a66a8] flex items-center justify-center text-sm font-black text-white shrink-0">
                            {perfil.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white/90 text-sm">{perfil.nome}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 text-white/40 text-xs font-mono">{perfil.email}</td>

                      {/* Cargo Badge */}
                      <td className="p-4">
                        {perfil.cargo === 'instrutor' ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            Instrutor
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-[#8a66a8]/10 text-[#c2a8db] border border-[#8a66a8]/20 px-2.5 py-1 rounded-full">
                            <GraduationCap className="w-3 h-3" />
                            Aluno
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-white/30 text-xs">
                        {new Date(perfil.criado_em).toLocaleDateString('pt-AO', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>

                      {/* Action Button */}
                      <td className="p-4 text-right">
                        {updatingId === perfil.id ? (
                          <div className="inline-flex items-center gap-2 text-xs text-white/40">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            A atualizar...
                          </div>
                        ) : perfil.email === user.email ? (
                          <span className="text-xs text-white/20 italic">Conta própria</span>
                        ) : perfil.cargo === 'aluno' ? (
                          <button
                            onClick={() => setConfirmModal({ open: true, perfil, novoCargo: 'instrutor' })}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Promover a Instrutor
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmModal({ open: true, perfil, novoCargo: 'aluno' })}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            Revogar Cargo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {!loadingData && filteredPerfis.length > 0 && (
            <div className="border-t border-white/5 px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-white/30">
                A mostrar <strong className="text-white/50">{filteredPerfis.length}</strong> de <strong className="text-white/50">{perfis.length}</strong> utilizadores
              </span>
              <span className="text-xs text-[#8a66a8]/60 font-semibold">Prime Academy · Painel Admin</span>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
