'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
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
  { href: '/about', label: 'Sobre Nós' },
  { href: '/courses', label: 'Cursos' },
  { href: '/gallery', label: 'Galeria' },
  { href: '/contact', label: 'Contacto' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300">
      <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-full w-full max-w-7xl mx-auto px-6 py-1.5 shadow-lg">
        <div className="flex items-center justify-between h-10 md:h-12 relative">

          {/* Left Side: Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="transition-transform group-hover:scale-105">
              <Image src="/logo.svg" alt="Prime Academy Logo" width={200} height={54} className="h-7 md:h-8 w-auto" priority />
            </div>
          </Link>

          {/* Center Side: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative z-10 px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-full ${isActive ? 'text-primary' : 'text-primary/70 hover:text-primary hover:bg-slate-100/30'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-secondary/10 border border-secondary/20 rounded-full -z-10 shadow-[0_2px_8px_rgba(138,102,168,0.06)]"
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
              {!isLoading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="ml-2 gap-2 hover:bg-primary-foreground/10 rounded-xl"
                        >
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-2">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Meu Painel
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
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
                        className="ml-2 text-slate-700 hover:text-primary hover:bg-slate-100/50 rounded-full"
                      >
                        <Link href="/login">Entrar</Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full shadow-md ml-2"
                      >
                        <Link href="/signup">Criar Conta</Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100/50 transition-colors"
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
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-2xl mt-4 shadow-xl border border-gray-100 max-w-5xl mx-auto"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between ${isActive ? 'bg-primary/5 text-primary' : 'text-gray-800 hover:bg-primary/5'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-secondary" />}
                  </Link>
                )
              })}

              {/* Mobile Auth */}
              {!isLoading && (
                <div className="border-t border-gray-100 mt-2 pt-4 space-y-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg font-bold text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-primary-foreground/70">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-800 rounded-lg transition-colors hover:bg-primary/5"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Meu Painel
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-800 rounded-lg transition-colors hover:bg-primary/5 text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start text-gray-800 hover:bg-primary/5 rounded-xl"
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Entrar
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
                      >
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          Criar Conta Gratuita
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
