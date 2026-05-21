'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, GraduationCap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Erro ao fazer login. Verifique as suas credenciais.')
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
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Left Side - Form Pane */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#312455] to-[#8a66a8] rounded-2xl mb-4 shadow-md shadow-purple-950/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#312455] mb-2 tracking-tight">Bem-vindo de volta</h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Entre na sua conta para continuar a sua formação
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Email
              </Label>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Senha
                </Label>
                <Link href="#" className="text-xs font-semibold text-[#8a66a8] hover:text-[#735191] transition-colors hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
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
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#312455] hover:bg-[#402f6e] text-white rounded-2xl text-base font-semibold shadow-lg shadow-purple-950/15 hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  A entrar...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                  Novo na Prime Academy?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-2xl text-base border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-all font-semibold"
              onClick={() => router.push('/signup')}
            >
              Criar conta gratuita
            </Button>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding Info */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#312455]">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 filter blur-[1px] opacity-25"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#312455]/98 via-[#4b3684]/95 to-[#1c1333]/98" />
        
        {/* Dynamic Abstract Glowing Orbs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#8a66a8]/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#312455]/40 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-16 text-white max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a66a8] bg-[#8a66a8]/10 px-3.5 py-1.5 rounded-full border border-[#8a66a8]/25 w-fit block">
                Educação do Futuro
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white tracking-tight">
                Transforme a sua carreira com a Prime Academy
              </h2>
              <p className="text-base text-slate-300 font-light leading-relaxed">
                Aceda a cursos certificados de alta qualidade, aprenda ao seu ritmo e impulsione o seu crescimento profissional com mentores de referência.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] p-4 rounded-[1.25rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8a66a8] to-[#9c7cb8] flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Formação Executiva Flexível</h4>
                  <p className="text-slate-300 text-xs mt-0.5">Mais de 50 cursos estruturados 100% online.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] p-4 rounded-[1.25rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8a66a8] to-[#9c7cb8] flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Certificação Reconhecida</h4>
                  <p className="text-slate-300 text-xs mt-0.5">Adicione valor curricular com diplomas certificados.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] p-4 rounded-[1.25rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8a66a8] to-[#9c7cb8] flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Tutores e Mentoria de Elite</h4>
                  <p className="text-slate-300 text-xs mt-0.5">Apoio contínuo e orientação de especialistas de topo.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
