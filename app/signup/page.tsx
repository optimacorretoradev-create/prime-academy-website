'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Loader2, CheckCircle2 } from 'lucide-react'
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
  const [role, setRole] = useState<'aluno' | 'instrutor'>('aluno')

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard')
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

    const result = await signup(name, email, password, role)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Erro ao criar conta')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/95 via-primary/90 to-[#1d1533]/95" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-balance">
              Comece a sua jornada de aprendizagem hoje
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Junte-se a milhares de profissionais que já transformaram as suas carreiras connosco.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                <span>Acesso imediato a todos os conteúdos</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                <span>Progresso sincronizado em todos dispositivos</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                <span>Comunidade exclusiva de alunos</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                <span>Certificados digitais verificáveis</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Criar conta</h1>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para começar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Profile Selection Card Selector */}
            <div className="space-y-2">
              <Label>Escolha o seu perfil</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('aluno')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    role === 'aluno'
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <GraduationCap className={`h-5 w-5 ${role === 'aluno' ? 'text-primary' : ''}`} />
                  <div className="font-semibold text-sm">Aluno</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('instrutor')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    role === 'instrutor'
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <User className={`h-5 w-5 ${role === 'instrutor' ? 'text-primary' : ''}`} />
                  <div className="font-semibold text-sm">Instrutor</div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              <div className="grid grid-cols-1 gap-1 mt-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500' : 'bg-muted'}`}>
                      {req.met && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">As senhas não coincidem</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-accent font-medium hover:underline">
                Fazer login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
