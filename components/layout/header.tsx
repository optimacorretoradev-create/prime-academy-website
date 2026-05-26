'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/about', label: 'Sobre' },
  { href: '/courses', label: 'Cursos' },
  { href: '/gallery', label: 'Galeria' },
  { href: '/contact', label: 'Contacto' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const isTransparent = !scrolled

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      isTransparent 
        ? 'bg-transparent py-5 border-b border-white/5' 
        : 'bg-[#312455]/95 backdrop-blur-md border-b border-[#312455]/20 py-3.5 shadow-md'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-10 md:h-12 relative">

          {/* Left Side: Logo with white filter */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="transition-transform group-hover:scale-105">
              <Image 
                src="/logo.svg" 
                alt="Prime Academy Logo" 
                width={200} 
                height={54} 
                className="h-7 md:h-8 w-auto transition-all" 
                style={{ filter: 'brightness(0) invert(1)' }}
                priority 
              />
            </div>
          </Link>

          {/* Center Side: Desktop Navigation (white links with improved contrast & hover) */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative z-10 px-4 py-2 text-sm font-bold transition-all duration-300 rounded-full hover:scale-105 flex items-center justify-center ${
                    isActive ? 'text-white' : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#8a66a8]/25 border border-[#8a66a8]/40 rounded-full -z-10 shadow-[0_2px_8px_rgba(138,102,168,0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side: Auth & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center">
              {!isLoading && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="ml-2 gap-2 text-white hover:bg-white/10 rounded-xl cursor-pointer hover:scale-105 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#8a66a8] flex items-center justify-center text-sm font-bold text-white shadow-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:inline font-bold">{user.name.split(' ')[0]}</span>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2">
                      <p className="font-medium text-[#312455]">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4 text-[#8a66a8]" />
                        Meu Painel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4 text-[#8a66a8]" />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="ml-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-full font-bold cursor-pointer text-sm hover:scale-105 transition-all"
                  >
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-[#8a66a8] text-white hover:bg-[#8a66a8]/90 rounded-full shadow-md ml-2 font-bold px-5 text-sm cursor-pointer border border-[#8a66a8]/20 hover:scale-105 transition-all"
                  >
                    <Link href="/signup">Criar Conta</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button (White text) */}
            <button
              className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#312455]/98 backdrop-blur-xl rounded-2xl mt-4 shadow-2xl border border-white/10 max-w-5xl mx-auto"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${
                      isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#8a66a8]" />}
                  </Link>
                )
              })}

              {/* Mobile Auth */}
              <div className="border-t border-white/10 mt-2 pt-4 space-y-2">
                {!isLoading && user ? (
                  <>
                    <div className="px-4 py-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8a66a8] flex items-center justify-center text-lg font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-white/60">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white/80 rounded-lg transition-colors hover:bg-white/5 hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#8a66a8]" />
                      Meu Painel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white/80 rounded-lg transition-colors hover:bg-white/5 hover:text-white text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-red-400" />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-white/90 hover:bg-white/5 rounded-xl hover:text-white cursor-pointer"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4 text-[#8a66a8]" />
                        Entrar
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-[#8a66a8] text-white hover:bg-[#8a66a8]/90 rounded-full font-bold cursor-pointer transition-all"
                    >
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Criar Conta Gratuita
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
