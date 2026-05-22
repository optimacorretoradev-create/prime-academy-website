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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useNotifications } from '@/contexts/notifications-context'

export type DashboardNavId = 'courses' | 'pdfs' | 'students' | 'explore' | 'settings' | 'admin'

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
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

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

  const isInstructor = user.role === 'instrutor' || user.role === 'admin'

  const navLinks: { id: DashboardNavId; label: string; href: string; icon: typeof BookOpen }[] = [
    {
      id: 'courses',
      label: isInstructor ? 'Minhas Turmas' : 'Meus Cursos',
      href: '/dashboard',
      icon: BookOpen,
    },
    {
      id: 'pdfs',
      label: isInstructor ? 'Gerir PDFs' : 'Biblioteca PDF',
      href: '/dashboard?tab=pdfs',
      icon: FileText,
    },
    ...(isInstructor
      ? [{ id: 'students' as const, label: 'Lista de Alunos', href: '/dashboard?tab=students', icon: Users }]
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
            {isInstructor ? 'Instrutor' : 'Estudante'}
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
              <div className="pt-8 pb-4 px-6 border-b border-white/10 flex justify-end">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-white/70">
                  <X className="h-5 w-5" />
                </Button>
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
        className={`flex-1 flex flex-col lg:pl-64 ${
          lockScrollLayout ? 'h-screen min-h-0 overflow-hidden' : 'min-h-screen'
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
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-[#8a66a8]" />
              <span className="text-[#312455] font-semibold">{currentDate}</span>
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
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-[2rem] shadow-xl z-50 overflow-hidden">
                    <div className="p-4 bg-[#312455] text-white text-xs font-extrabold">Notificações</div>
                    <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-slate-400 text-center">
                          Sem notificações de momento.
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            type="button"
                            onClick={() => markRead(notif.id)}
                            className={`w-full p-4 text-left hover:bg-slate-50 ${!notif.lida ? 'bg-[#f8fafc]/40' : ''}`}
                          >
                            <p className="font-black text-xs text-[#312455]">{notif.titulo}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{notif.descricao}</p>
                            {notif.time && (
                              <p className="text-[9px] text-slate-400 mt-1">{notif.time}</p>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                    {notifications.some((n) => !n.lida) && (
                      <div className="p-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => markAllRead()}
                          className="w-full text-[10px] font-bold text-[#8a66a8] hover:underline cursor-pointer py-2"
                        >
                          Marcar todas como lidas
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
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
