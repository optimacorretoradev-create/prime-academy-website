'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/about', label: 'Sobre a Prime' },
  { href: '/courses', label: 'Soluções' },
  { href: '/gallery', label: 'Galeria de Projectos' },
  { href: '/contact', label: 'Contacto' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHeaderVisible = useScrollDirection()
  const { user, logout, isLoading } = useAuth()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  useEffect(() => {
    // Definir estado inicial com base na posição do scroll
    setScrolled(window.scrollY > 20)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bloquear scroll quando a drawer estiver aberta
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  const isTransparent = !scrolled

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full bg-[#312455] border-b border-[#312455]/20 py-4 shadow-md transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Desktop Logo (Far Left Edge) */}
      <Link href="/" className="hidden lg:flex items-center group shrink-0 absolute left-6 xl:left-10 inset-y-0 z-20">
        <div className="transition-transform group-hover:scale-105">
          <Image 
            src="/logo.svg" 
            alt="Prime Academy Logo" 
            width={200} 
            height={54} 
            className="w-auto h-45 md:h-60 transition-all" 
            style={{ filter: 'brightness(0) invert(1)' }}
            priority 
          />
        </div>
      </Link>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between min-h-[50px] md:h-20 relative">
          
          {/* Mobile Logo (Visible only on mobile and tablet) */}
          <Link href="/" className="lg:hidden shrink-0">
             <Image 
                src="/logo.svg" 
                alt="Prime Academy Logo" 
                width={207}
                height={56} 
                className="h-30 w-auto object-contain" 
                style={{ filter: 'brightness(0) invert(1)' }}
              />
          </Link>

          {/* Center Side: Desktop Navigation (white links with improved contrast & hover) */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative z-10 px-4 py-2 text-sm font-bold transition-all duration-300 rounded-xl hover:scale-105 flex items-center justify-center ${
                    isActive ? 'text-white' : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#8a66a8]/25 border border-[#8a66a8]/40 rounded-xl -z-10 shadow-[0_2px_8px_rgba(138,102,168,0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side: Auth & Mobile Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center">
              {!isLoading && user ? (
                <Button
                  asChild
                  className="bg-[#8a66a8] text-white hover:bg-[#8a66a8]/90 rounded-full shadow-md ml-2 font-bold px-5 text-sm cursor-pointer border border-[#8a66a8]/20 hover:scale-105 transition-all"
                >
                  <Link href="/dashboard">Meu Painel</Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="ml-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl font-bold cursor-pointer text-sm hover:scale-105 transition-all"
                  >
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-[#8a66a8] text-white hover:bg-[#8a66a8]/90 rounded-xl shadow-md ml-2 font-bold px-5 text-sm cursor-pointer border border-[#8a66a8]/20 hover:scale-105 transition-all"
                  >
                    <Link href="/signup">Inscrever-me</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button (White text) */}
            <button
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            {/* Drawer (Glassmorphism Premium) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-0 z-[60] w-full h-screen bg-[#13072e]/70 backdrop-blur-3xl backdrop-brightness-75 p-6 flex flex-col pt-24"
            >
              {/* Close button at the top */}
              <button
                className="absolute top-5 right-4 p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-8 w-8" />
              </button>
              
              <motion.nav 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="flex flex-col gap-2"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      variants={{ hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    >
                      <Link
                        href={link.href}
                        className={`px-4 py-4 text-lg font-semibold rounded-xl transition-all flex items-center justify-between drop-shadow-sm ${
                          isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white hover:translate-x-2'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                        {isActive && <div className="w-2 h-2 rounded-full bg-[#8a66a8]" />}
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Mobile Auth */}
                <motion.div 
                  variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                  className="border-t border-white/10 mt-6 pt-6 space-y-4"
                >
                  {!isLoading && user ? (
                    <>
                      <div className="px-4 py-2 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#8a66a8] flex items-center justify-center text-xl font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white text-lg">{user.name}</p>
                          <p className="text-sm text-white/60">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-3 text-lg font-semibold text-white/80 rounded-xl transition-all hover:bg-white/5 hover:text-white hover:translate-x-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-5 w-5 text-[#8a66a8]" />
                        Meu Painel
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-lg font-semibold text-white/80 rounded-xl transition-all hover:bg-white/5 hover:text-white hover:translate-x-2 text-left cursor-pointer"
                      >
                        <LogOut className="h-5 w-5 text-red-400" />
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start text-white/90 text-lg hover:bg-white/5 rounded-xl hover:text-white cursor-pointer py-6"
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-5 w-5 text-[#8a66a8]" />
                          Entrar
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-[#8a66a8] text-white hover:bg-[#8a66a8]/90 rounded-xl font-bold cursor-pointer transition-all py-6 text-lg hover:scale-[1.02]"
                      >
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          Inscrever-me
                        </Link>
                      </Button>
                    </>
                  )}
                </motion.div>
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
