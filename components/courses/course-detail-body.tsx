'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, BookOpen, ChevronRight, CheckCircle2, Award, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Course } from '@/lib/hygraph'
import { getCoursePriceDisplay } from '@/lib/format-price'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'


interface CourseDetailBodyProps {
  course: Course
  syllabus: string
  highlights: string[]
  variant: 'public' | 'dashboard'
}

export function CourseDetailBody({ course, syllabus, highlights, variant }: CourseDetailBodyProps) {
  const { user } = useAuth()
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null)
  
  useEffect(() => {
    async function checkEnrollment() {
      if (!user) {
        setIsEnrolled(false)
        return
      }
      
      const { data, error } = await supabase
        .from('inscricoes')
        .select('id')
        .eq('perfil_id', user.id)
        .eq('curso_id', course.id)
        .in('estado', ['pendente', 'aceite'])
        .maybeSingle()
        
      if (!error && data) {
        setIsEnrolled(true)
      } else {
        setIsEnrolled(false)
      }
    }
    checkEnrollment()
  }, [user, course.id])

  const isDashboard = variant === 'dashboard'
  const backHref = isDashboard ? '/dashboard?tab=explore' : '/courses'
  const backLabel = isDashboard ? 'Explorar Cursos' : 'Cursos'
  const priceDisplay = getCoursePriceDisplay(course.id, course.price)

  // Breadcrumb usado apenas no Dashboard
  const dashboardBreadcrumb = isDashboard ? (
    <div className="shrink-0 mb-4 flex items-center gap-2 text-sm">
      <Link href={backHref} className="text-slate-500 hover:text-[#312455] transition-colors flex items-center gap-1 font-semibold">
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>
      <ChevronRight className="h-4 w-4 text-slate-300" />
      <span className="text-[#312455] font-bold line-clamp-1">{course.name}</span>
    </div>
  ) : null

  const heroHeader = !isDashboard ? (
    <section className="relative bg-[#312455] pt-24 pb-12 overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a66a8]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      
      <div className="relative z-10 container mx-auto px-4">
        {/* Conteúdo da Hero */}
        <div className="mt-2 pt-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-[#8a66a8] text-white font-bold text-xs tracking-wider uppercase py-2 px-5 rounded-full shadow-lg">
              {course.category}
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white/90 font-semibold text-xs tracking-wider uppercase py-2 px-5 rounded-full border border-white/10">
              {course.online ? 'Online' : 'Presencial'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl">
            {course.name}
          </h1>
        </div>

        {/* Breadcrumb integrado e compacto (movido para baixo do título) */}
        <div className="mt-8 flex items-center gap-2 text-sm text-white/70 pt-6">
          <Link href={backHref} className="hover:text-white transition-colors flex items-center gap-1 font-medium z-20">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          <ChevronRight className="h-4 w-4 text-white/50" />
          <span className="text-white font-semibold truncate">{course.name}</span>
        </div>
      </div>
    </section>
  ) : null

  const mainContent = (
    <div className="space-y-8">
      {/* Renderiza o dashboard breadcrumb se estiver no dashboard */}
      {isDashboard && dashboardBreadcrumb}
      
      <div>
        {isDashboard && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-[#8a66a8] text-white font-semibold text-xs py-1 px-2.5 rounded-full border-none">
              {course.category}
            </Badge>
            <Badge variant="outline" className="border-[#312455]/20 text-[#312455] rounded-full">
              {course.online ? 'Online' : 'Presencial'}
            </Badge>
          </div>
        )}
        
        <p className={isDashboard ? 'text-slate-600 text-base leading-relaxed text-pretty' : 'text-slate-600 text-lg leading-relaxed text-pretty'}>
          {course.description}
        </p>
      </div>

      <div
        className={`grid grid-cols-2 gap-4 py-6 border-y ${
          isDashboard ? 'border-slate-100' : 'border-border'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={
              isDashboard
                ? 'bg-[#312455]/5 p-3 rounded-xl border border-[#312455]/10'
                : 'bg-primary/5 p-3 rounded-xl border border-primary/10'
            }
          >
            <Clock className={`h-5 w-5 ${isDashboard ? 'text-[#312455]' : 'text-primary'}`} />
          </div>
          <div>
            <p className={`text-xs ${isDashboard ? 'text-slate-500' : 'text-muted-foreground'}`}>Duração</p>
            <p className={`font-semibold text-sm ${isDashboard ? 'text-[#312455]' : ''}`}>{course.duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={
              isDashboard
                ? 'bg-[#312455]/5 p-3 rounded-xl border border-[#312455]/10'
                : 'bg-primary/5 p-3 rounded-xl border border-primary/10'
            }
          >
            <Award className={`h-5 w-5 ${isDashboard ? 'text-[#312455]' : 'text-primary'}`} />
          </div>
          <div>
            <p className={`text-xs ${isDashboard ? 'text-slate-500' : 'text-muted-foreground'}`}>Certificação</p>
            <p className={`font-semibold text-sm ${isDashboard ? 'text-[#312455]' : ''}`}>Reconhecida</p>
          </div>
        </div>
      </div>

      <div>
        <h2
          className={
            isDashboard
              ? 'text-xl font-black text-[#312455] mb-6'
              : 'text-2xl font-bold text-primary mb-6'
          }
        >
          Conteúdo Programático
        </h2>
        <div className="pb-4">
          {syllabus ? (
            <div
              className={`syllabus-richtext leading-relaxed text-sm ${
                isDashboard ? 'text-slate-600' : 'text-muted-foreground'
              }`}
              dangerouslySetInnerHTML={{ __html: syllabus as string }}
            />
          ) : (
            <p className={`text-sm italic ${isDashboard ? 'text-slate-400' : 'text-muted-foreground'}`}>
              Programa do curso em breve.
            </p>
          )}
        </div>
      </div>
    </div>
  )

  const investmentCard = (
    <Card
      className={`border shadow-lg rounded-3xl overflow-hidden ${
        isDashboard ? 'border-slate-100 bg-white shadow-md' : 'border-border bg-card'
      }`}
    >
      <div className="relative aspect-[16/10]">
        {/* Sanitização da URL — garante URL válida antes de passar ao Next.js Image */}
        <Image
          src={course.image?.startsWith('http') ? course.image : '/placeholder.jpg'}
          alt={course.name}
          fill
          unoptimized
          className="object-cover"
          sizes="320px"
          priority
        />
        <div className={`absolute inset-0 ${isDashboard ? 'bg-[#312455]/25' : 'bg-primary/20'}`} />
      </div>
      <CardContent className="p-5 md:p-6 space-y-5">
        <div
          className={`rounded-2xl px-4 py-3 border ${
            isDashboard ? 'bg-[#312455]/5 border-[#312455]/10' : 'bg-primary/5 border-primary/10'
          }`}
        >
          <p
            className={`text-xs uppercase font-semibold tracking-wider ${
              isDashboard ? 'text-slate-500' : 'text-muted-foreground'
            }`}
          >
            Investimento
          </p>
          <p
            className={`text-2xl md:text-3xl font-extrabold mt-1 ${
              isDashboard ? 'text-[#312455]' : 'text-primary'
            }`}
          >
            {priceDisplay}
          </p>
        </div>

        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <CheckCircle2
                className={`h-4.5 w-4.5 mt-0.5 flex-shrink-0 ${
                  isDashboard ? 'text-[#8a66a8]' : 'text-accent'
                }`}
              />
              <span
                className={`text-xs leading-normal ${
                  isDashboard ? 'text-slate-600' : 'text-muted-foreground'
                }`}
              >
                {highlight}
              </span>
            </div>
          ))}
        </div>

        <div className={isDashboard ? 'pt-2' : 'pt-4 border-t border-border'}>
          {isEnrolled === null ? (
            <Button disabled className="w-full h-12 rounded-2xl">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : isEnrolled ? (
            <Button
              disabled
              onClick={() => toast.info('Você já se inscreveu neste curso.')}
              className={
                isDashboard
                  ? 'w-full bg-slate-200 text-slate-500 rounded-2xl h-12 text-sm font-bold cursor-not-allowed'
                  : 'w-full bg-muted text-muted-foreground rounded-xl h-12 text-sm font-semibold cursor-not-allowed'
              }
            >
              Inscrito
            </Button>
          ) : (
            <Button
              asChild
              className={
                isDashboard
                  ? 'w-full bg-[#312455] hover:bg-[#8a66a8] text-white rounded-2xl h-12 text-sm font-bold shadow-md cursor-pointer'
                  : 'w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-sm font-semibold shadow-md cursor-pointer'
              }
            >
              <Link href={`/enroll?course=${course.id}`}>Inscrever-se Agora</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const desktopSplitLayout = (
    <div className="hidden lg:flex flex-1 min-h-0 gap-8">
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain pr-2">
        {mainContent}
      </div>
      <aside className="w-80 xl:w-[22rem] shrink-0">{investmentCard}</aside>
    </div>
  )

  const mobileStackLayout = (
    <div
      className={
        isDashboard
          ? 'lg:hidden flex-1 min-h-0 overflow-y-auto overscroll-contain'
          : 'lg:hidden'
      }
    >
      <div className="space-y-8 pb-8">
        {mainContent}
        {investmentCard}
      </div>
    </div>
  )

  if (isDashboard) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        {dashboardBreadcrumb}
        {desktopSplitLayout}
        {mobileStackLayout}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {heroHeader}
      <div className="container mx-auto px-4 py-8 lg:py-10 flex flex-col flex-1 min-h-0 lg:min-h-[calc(100dvh-11rem)]">
        {desktopSplitLayout}
        {mobileStackLayout}
      </div>
    </div>
  )
}
