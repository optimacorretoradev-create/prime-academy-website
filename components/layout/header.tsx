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

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="transition-transform group-hover:scale-105">
              <Image src="/logo.svg" alt="Prime Academy Logo" width={320} height={86} className="h-[72px] md:h-[86px] w-auto invert brightness-0" priority />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-primary-foreground/10"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Buttons */}
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
                      className="ml-2 hover:bg-primary-foreground/10 rounded-xl"
                    >
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl shadow-md"
                    >
                      <Link href="/signup">Criar Conta</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
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
            className="md:hidden overflow-hidden bg-primary border-t border-primary-foreground/10"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-primary-foreground/10"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              {!isLoading && (
                <div className="border-t border-primary-foreground/10 mt-2 pt-4 space-y-2">
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
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-primary-foreground/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Meu Painel
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-primary-foreground/10 text-left"
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
                        className="w-full justify-start hover:bg-primary-foreground/10 rounded-xl"
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Entrar
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
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
