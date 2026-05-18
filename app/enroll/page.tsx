import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getCourses } from '@/lib/hygraph'
import { EnrollForm } from '@/components/enroll/enroll-form'

export const metadata: Metadata = {
  title: 'Inscrição - Prime Academy',
  description: 'Faça a sua pré-matrícula na Prime Academy. Inscreva-se nos nossos cursos de gestão, informática e idiomas.',
}

export default async function EnrollPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#312455] to-[#1d1533]" />
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(245, 158, 11, 0.2) 0%, transparent 40%), radial-gradient(ellipse at 60% 80%, rgba(10, 38, 71, 0.5) 0%, transparent 50%)' }} />
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-accent/20 rounded-full" />
        <div className="absolute top-20 left-20 w-48 h-48 border border-accent/10 rounded-full" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border border-white/10 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Pré-matrícula
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg md:text-xl text-pretty">
            Inscreva-se agora e dê o primeiro passo para transformar a sua carreira.
            A nossa equipa entrará em contacto em breve.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card p-6 md:p-10 rounded-2xl border border-border shadow-sm">
            <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-lg" />}>
              <EnrollForm courses={courses} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
