import Link from 'next/link'
import { Suspense } from 'react'
import { LoginForm } from '@/components/login/login-form'
import { LoginRightPanel } from '@/components/login/login-right-panel'

export const metadata = {
  title: 'Login - Prime Academy',
  description: 'Entre na sua conta Prime Academy para acessar seus cursos e continuar sua jornada de aprendizado.',
}

function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-slate-200/50 animate-pulse">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-200 rounded-2xl mb-4" />
        <div className="h-8 bg-slate-200 rounded w-3/4 mx-auto mb-2" />
        <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-12 bg-slate-100 rounded-2xl" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-12 bg-slate-100 rounded-2xl" />
        </div>
        <div className="h-12 bg-slate-300 rounded-2xl" />
      </div>
    </div>
  )
}

export default function LoginPage() {
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
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right Side - Image/Branding Info */}
      <LoginRightPanel />
    </div>
  )
}
