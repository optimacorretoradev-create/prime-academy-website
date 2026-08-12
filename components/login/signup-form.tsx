'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Loader2, CheckCircle2, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { useEffect } from 'react'

export function SignupForm() {
  const router = useRouter()
  const { signup, user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

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
      setShowSuccessModal(true)
    } else {
      setError(result.error || 'Erro ao criar conta. Verifique os seus dados.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-10 shadow-xl"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#312455] to-[#8a66a8] rounded-xl mb-4 shadow-md shadow-purple-950/20">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#312455] mb-2 tracking-tight">Criar conta</h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Preencha os dados abaixo para começar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
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
                className="pl-12 h-12 rounded-xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
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
                className="pl-12 h-12 rounded-xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
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
                className="pl-12 pr-12 h-12 rounded-xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
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
            
            <div className="grid grid-cols-1 gap-1.5 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${req.met ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {req.met && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className={req.met ? 'text-emerald-700 font-medium' : 'text-slate-400 font-normal'}>{req.label}</span>
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
                className="pl-12 h-12 rounded-xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
                required
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive mt-1 font-medium">As senhas não coincidem</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#8a66a8] hover:bg-[#735191] text-white rounded-xl text-base font-semibold shadow-lg shadow-purple-950/15 hover:shadow-xl transition-all duration-300 mt-2"
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

      <motion.div
        initial={false}
        animate={showSuccessModal ? { opacity: 1, pointerEvents: 'auto' } : { opacity: 0, pointerEvents: 'none' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={showSuccessModal ? { opacity: 1 } : { opacity: 0 }}
          onClick={() => {
            setShowSuccessModal(false)
            router.push('/login')
          }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={showSuccessModal ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl z-10 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full mb-6 text-emerald-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-black text-[#312455] mb-4 tracking-tight">
            Verifique o seu e-mail
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Enviámos um link de activação para o endereço <strong className="text-slate-900">{email}</strong>. Por favor, consulte a sua caixa de entrada e confirme a sua conta para poder aceder à plataforma.
          </p>
          
          <Button
            onClick={() => {
              setShowSuccessModal(false)
              router.push('/login')
            }}
            className="w-full h-12 bg-[#8a66a8] hover:bg-[#735191] text-white rounded-xl text-base font-semibold shadow-lg shadow-purple-950/15 hover:shadow-xl transition-all duration-300"
          >
            Ir para o Login
          </Button>
        </motion.div>
      </motion.div>
    </>
  )
}
