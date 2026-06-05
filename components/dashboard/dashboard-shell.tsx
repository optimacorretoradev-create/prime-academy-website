'use client'

import { useEffect, useState, Fragment, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  LogOut,
  FileText,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Calendar,
  Compass,
  Settings,
  Users,
  Video,
  Loader2,
  CheckCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useNotifications } from '@/contexts/notifications-context'

export type DashboardNavId = 'courses' | 'online-classes' | 'pdfs' | 'students' | 'explore' | 'settings' | 'admin'

interface DashboardShellProps {
  children: ReactNode
  activeNav?: DashboardNavId
  /** Painel com altura fixa: scroll interno (detalhe do curso) */
  lockScrollLayout?: boolean
}

export function DashboardShell({
  children,
  activeNav = 'courses',
  lockScrollLayout = false,
}: DashboardShellProps) {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  const handleNotificationClick = async (notif: any) => {
    if (markingId) return
    setMarkingId(notif.id)
    await markRead(notif.id)
    setMarkingId(null)
    setShowNotifications(false)

    // Smart routing based on notification type
    const tipo = notif.tipo as string
    if (tipo === 'material') {
      router.push('/dashboard?tab=pdfs')
    } else if (tipo === 'aula' || tipo === 'transmissao') {
      router.push('/dashboard?tab=online-classes')
    } else if (tipo === 'nova_inscricao' || tipo === 'promovido_admin') {
      // Admin notifications → painel admin
      router.push('/admin')
    } else if (
      tipo === 'inscricao_aceite' ||
      tipo === 'inscricao_recebida' ||
      tipo === 'inscricao_em_analise' ||
      tipo === 'inscricao_processada' ||
      tipo === 'inscricao_pendente_pagamento'
    ) {
      // Enrollment status notifications → Meus Cursos
      router.push('/dashboard?tab=courses')
    } else if (tipo === 'inscricao_rejeitada') {
      // Rejected → suggest exploring other courses
      router.push('/dashboard?tab=explore')
    } else if (tipo === 'cargo_revogado') {
      // Role revoked → dashboard principal
      router.push('/dashboard')
    }
  }

  const handleMarkAllRead = async () => {
    if (markingAll) return
    setMarkingAll(true)
    await markAllRead()
    setMarkingAll(false)
  }

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const today = new Date().toLocaleDateString('pt-AO', options)
    setCurrentDate(today.charAt(0).toUpperCase() + today.slice(1))
  }, [])

  useEffect(() => {
    if (user) {
      const savedAvatar = localStorage.getItem(`prime_academy_avatar_${user.email}`)
      if (savedAvatar) setAvatarUrl(savedAvatar)
      const savedName = localStorage.getItem(`prime_academy_username_${user.email}`)
      setDisplayName(savedName || user.name)
    }
  }, [user])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#312455]" />
          <p className="text-sm font-semibold text-slate-500 animate-pulse">A carregar o seu painel...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const isInstructor = user.role === 'admin'

  const navLinks: { id: DashboardNavId; label: string; href: string; icon: typeof BookOpen }[] = [
    {
      id: 'courses',
      label: isInstructor ? 'Minhas Turmas' : 'Meus Cursos',
      href: '/dashboard',
      icon: BookOpen,
    },
    {
      id: 'online-classes',
      label: 'Aulas Online',
      href: '/dashboard?tab=online-classes',
      icon: Video,
    },
    {
      id: 'pdfs',
      label: isInstructor ? 'Gerir PDFs' : 'Biblioteca PDF',
      href: '/dashboard?tab=pdfs',
      icon: FileText,
    },
    ...(isInstructor
      ? [{ id: 'students' as const, label: 'Lista de Formandos', href: '/dashboard?tab=students', icon: Users }]
      : []),
    { id: 'explore', label: 'Explorar Cursos', href: '/dashboard?tab=explore', icon: Compass },
    { id: 'settings', label: 'Definições', href: '/dashboard?tab=settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const renderNavItem = (link: (typeof navLinks)[0], onNavigate?: () => void) => {
    const Icon = link.icon
    const isActive = activeNav === link.id
    const isSettings = link.id === 'settings'
    return (
      <Fragment key={link.id}>
        {isSettings && <div className="h-px bg-white/10 my-3 mr-4 ml-3" />}
        <Link
          href={link.href}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-4 py-3 rounded-l-[2rem] rounded-r-none text-sm font-semibold transition-all duration-300 w-full relative ${
            isActive
              ? 'bg-[#f8fafc] text-[#312455] z-10 shadow-sm'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-[#312455]' : 'text-white/60'}`} />
          <span className="relative z-10">{link.label}</span>
          {isActive && (
            <>
              <div className="absolute bottom-full right-0 w-8 h-8 bg-[#f8fafc] pointer-events-none translate-y-[1px]">
                <div className="w-full h-full bg-[#312455] rounded-br-[2rem]" />
              </div>
              <div className="absolute top-full right-0 w-8 h-8 bg-[#f8fafc] pointer-events-none -translate-y-[1px]">
                <div className="w-full h-full bg-[#312455] rounded-tr-[2rem]" />
              </div>
            </>
          )}
        </Link>
      </Fragment>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800">
      <aside className="hidden lg:flex flex-col w-64 bg-[#312455] text-white fixed h-screen z-30 rounded-r-[2.5rem]">
        <div className="pt-8 pb-6 px-6 border-b border-white/10 flex flex-col items-center text-center">
          <div className="relative w-20 h-20 rounded-full p-1 bg-white/10 ring-2 ring-white/20 ring-offset-2 ring-offset-[#312455] flex items-center justify-center overflow-hidden mb-3">
            {avatarUrl ? (
              <img src={avatarUrl} className="w-full h-full rounded-full object-cover" alt="Avatar" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8a66a8] to-[#4a347c] flex items-center justify-center text-xl font-black text-white">
                {(displayName || user.name)
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="font-extrabold text-sm tracking-tight text-white line-clamp-1">
            {displayName || user.name}
          </h2>
          <p className="text-[10px] text-white/50 font-semibold truncate max-w-full mt-0.5">{user.email}</p>
          <Badge className="mt-2 bg-[#8a66a8]/20 text-[#c1a7d6] border border-[#8a66a8]/30 uppercase text-[8px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full">
            {isInstructor ? 'Administrador' : 'Formando'}
          </Badge>
        </div>

        <nav className="flex-1 pl-4 pr-0 py-6 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
            Área de Formação
          </div>
          {navLinks.map((link) => renderNavItem(link))}
          {isInstructor && (
            <div className="pt-4">
              {renderNavItem({
                id: 'admin',
                label: 'Base de Dados',
                href: '/admin',
                icon: ShieldCheck,
              })}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/10 mt-auto rounded-br-[2.5rem]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 text-white/60" />
            Terminar Sessão
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-[#312455] text-white z-50 flex flex-col lg:hidden rounded-r-[2.5rem]"
            >
              {/* Profile Section */}
              <div className="pt-6 pb-4 px-6 border-b border-white/10 flex flex-col items-center justify-between">
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-white/70 -mr-2">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative w-16 h-16 rounded-full p-1 bg-white/10 ring-2 ring-white/20 ring-offset-2 ring-offset-[#312455] flex items-center justify-center overflow-hidden mb-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} className="w-full h-full rounded-full object-cover" alt="Avatar" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8a66a8] to-[#4a347c] flex items-center justify-center text-lg font-black text-white">
                      {(displayName || user.name)
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="font-extrabold text-[11px] tracking-tight text-white text-center line-clamp-2 px-1 leading-snug">
                  {displayName || user.name}
                </h2>
                <p className="text-[8px] text-white/50 font-semibold text-center line-clamp-2 px-1 mt-1 leading-tight">{user.email}</p>
                <Badge className="mt-3 bg-[#8a66a8]/20 text-[#c1a7d6] border border-[#8a66a8]/30 uppercase text-[7px] font-extrabold tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap">
                  {isInstructor ? 'Admin' : 'Formando'}
                </Badge>
              </div>
              <nav className="flex-1 pl-4 py-6 space-y-1 overflow-y-auto">
                {navLinks.map((link) => renderNavItem(link, () => setSidebarOpen(false)))}
                {isInstructor &&
                  renderNavItem(
                    { id: 'admin', label: 'Base de Dados', href: '/admin', icon: ShieldCheck },
                    () => setSidebarOpen(false)
                  )}
              </nav>
              <div className="p-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-red-300 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Terminar Sessão
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div
        className={`flex-1 flex flex-col lg:pl-64 min-w-0 ${
          lockScrollLayout ? 'h-screen min-h-0 overflow-hidden' : 'min-h-screen overflow-x-hidden'
        }`}
      >
        <header
          className={`bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-6 z-20 shadow-sm rounded-bl-[2rem] ${
            lockScrollLayout ? 'shrink-0' : 'sticky top-0'
          }`}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-700 hover:bg-slate-100/50 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-slate-100/80 px-3.5 py-2 rounded-full border border-slate-200/50 shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-[#8a66a8] flex-shrink-0 mt-0.5" />
              <div className="text-center">
                <div className="text-[#312455] font-semibold leading-tight">
                  {currentDate.slice(0, currentDate.lastIndexOf(' '))}
                </div>
                <div className="text-[#312455] font-semibold leading-tight">
                  {currentDate.slice(currentDate.lastIndexOf(' ') + 1)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative text-slate-500 hover:text-[#312455] rounded-full ${
                  showNotifications ? 'bg-slate-100 text-[#312455]' : ''
                }`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Overlay — fecha ao clicar fora */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />

                    {/* Painel de notificações */}
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="
                        fixed z-50 overflow-hidden
                        bg-white border border-slate-100 shadow-2xl
                        rounded-[2rem]
                        top-[4.5rem] right-4 left-4
                        sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2
                        sm:w-[360px]
                      "
                    >
                      {/* Cabeçalho */}
                      <div className="flex items-center justify-between px-5 py-4 bg-[#312455]">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-white/70" />
                          <span className="text-white text-sm font-extrabold tracking-tight">Notificações</span>
                          {unreadCount > 0 && (
                            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowNotifications(false)}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                          aria-label="Fechar notificações"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Lista de notificações */}
                      <div className="divide-y divide-slate-100 max-h-[55vh] sm:max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-10 text-center">
                            <Bell className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                            <p className="text-xs text-slate-400 font-medium">Sem notificações de momento.</p>
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            const isMarking = markingId === notif.id
                            const isDisabled = markingId !== null || markingAll
                            return (
                              <button
                                key={notif.id}
                                type="button"
                                onClick={() => handleNotificationClick(notif)}
                                disabled={isDisabled}
                                className={`w-full px-5 py-4 text-left transition-colors flex items-start gap-3 group
                                  ${!notif.lida ? 'bg-[#312455]/[0.03]' : 'bg-white'}
                                  ${isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-slate-50 cursor-pointer'}
                                `}
                              >
                                {/* Indicador não lido */}
                                <span
                                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 transition-all ${
                                    !notif.lida ? 'bg-[#8a66a8]' : 'bg-transparent'
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-bold leading-snug ${
                                    !notif.lida ? 'text-[#312455]' : 'text-slate-600'
                                  }`}>
                                    {notif.titulo}
                                  </p>
                                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                                    {notif.descricao}
                                  </p>
                                  {notif.time && (
                                    <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{notif.time}</p>
                                  )}
                                </div>
                                {/* Spinner de loading */}
                                {isMarking && (
                                  <Loader2 className="w-3.5 h-3.5 text-[#8a66a8] animate-spin shrink-0 mt-0.5" />
                                )}
                              </button>
                            )
                          })
                        )}
                      </div>

                      {/* Rodapé: marcar todas como lidas */}
                      {notifications.some((n) => !n.lida) && (
                        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60">
                          <button
                            type="button"
                            onClick={handleMarkAllRead}
                            disabled={markingAll || markingId !== null}
                            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#8a66a8] hover:text-[#312455] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer py-1 transition-colors"
                          >
                            {markingAll ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCheck className="w-3 h-3" />
                            )}
                            {markingAll ? 'A marcar...' : 'Marcar todas como lidas'}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <Link
              href="/dashboard?tab=settings"
              className="h-9 w-9 rounded-full bg-[#312455] text-white flex items-center justify-center text-xs font-bold border border-slate-200 shadow-sm overflow-hidden"
            >
              {avatarUrl ? (
                <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
              ) : (
                (displayName || user.name).charAt(0).toUpperCase()
              )}
            </Link>
          </div>
        </header>

        <main
          className={
            lockScrollLayout
              ? 'flex-1 min-h-0 overflow-hidden p-6 flex flex-col'
              : 'flex-1 p-6 overflow-y-auto'
          }
        >
          {children}
        </main>
      </div>
    </div>
  )
}
