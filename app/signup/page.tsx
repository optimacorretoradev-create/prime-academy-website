'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User as UserIcon, GraduationCap, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'

export default function SignupPage() {
  const router = useRouter()
  const { signup, user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) {
    return null
  }

  const passwordRequirements = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Contém número', met: /\d/.test(password) },
    { label: 'Contém letra maiúscula', met: /[A-Z]/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (!passwordRequirements.every(r => r.met)) {
      setError('A senha não atende aos requisitos mínimos')
      return
    }

    setIsLoading(true)

    const result = await signup(name, email, password, 'aluno')
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Erro ao criar conta. Verifique os seus dados.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-[#fafaf8] relative overflow-hidden">
      {/* Floating Back to Home button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-200/60 shadow-sm hover:shadow-md active:scale-95"
      >
        ← Voltar ao início
      </Link>

      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Background blobs for premium glassmorphism vibe */}
      <div className="absolute top-1/4 right-1/10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/10 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Left Side - Image/Branding Info */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#312455]">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 filter blur-[1px] opacity-25"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-[#312455]/98 via-[#4b3684]/95 to-[#1c1333]/98" />
        
        {/* Dynamic Abstract Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#8a66a8]/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#312455]/40 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-16 text-white max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a66a8] bg-[#8a66a8]/10 px-3.5 py-1.5 rounded-full border border-[#8a66a8]/25 w-fit block">
                Educação do Futuro
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white tracking-tight">
                Comece a sua jornada de aprendizagem hoje
              </h2>
              <p className="text-base text-slate-300 font-light leading-relaxed">
                Junte-se a milhares de profissionais que já transformaram as suas carreiras connosco. Aceda a tudo instantaneamente.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] p-4 rounded-[1.25rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
                <CheckCircle2 className="w-6 h-6 text-[#8a66a8] shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Acesso imediato e irrestrito</h4>
                  <p className="text-slate-300 text-xs mt-0.5">Explore materiais e videoaulas de excelência no e-learning.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] p-4 rounded-[1.25rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
                <CheckCircle2 className="w-6 h-6 text-[#8a66a8] shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Sincronização na Nuvem</h4>
                  <p className="text-slate-300 text-xs mt-0.5">Retome os estudos de onde parou em qualquer dispositivo.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] p-4 rounded-[1.25rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
                <CheckCircle2 className="w-6 h-6 text-[#8a66a8] shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Comunidade Exclusiva</h4>
                  <p className="text-slate-300 text-xs mt-0.5">Faça networking com outros profissionais de destaque.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form Pane */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#312455] to-[#8a66a8] rounded-2xl mb-4 shadow-md shadow-purple-950/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#312455] mb-2 tracking-tight">Criar conta</h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Preencha os dados abaixo para começar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}



            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nome completo</Label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12 h-12 rounded-2xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 rounded-2xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 rounded-2xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Requirements Container */}
              <div className="grid grid-cols-1 gap-1.5 mt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${req.met ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      {req.met && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={req.met ? 'text-emerald-700 font-medium animate-pulse' : 'text-slate-400 font-normal'}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirmar senha</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-12 h-12 rounded-2xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive mt-1 font-medium">As senhas não coincidem</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#312455] hover:bg-[#402f6e] text-white rounded-2xl text-base font-semibold shadow-lg shadow-purple-950/15 hover:shadow-xl transition-all duration-300 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  A criar conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>

            <p className="text-center text-sm text-slate-500 pt-1">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-[#8a66a8] font-semibold hover:text-[#735191] hover:underline transition-colors">
                Fazer login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
