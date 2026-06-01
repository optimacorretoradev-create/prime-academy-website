'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, BookOpen, ChevronRight, CheckCircle2, Award, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Course, SyllabusModule } from '@/lib/hygraph'
import { getCoursePriceDisplay } from '@/lib/format-price'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

// Parse a Markdown string (RichText from Hygraph) into structured syllabus modules.
// Supports ## headings as module titles and - / * list items as topics.
function parseSyllabus(syllabus: string | SyllabusModule[] | undefined): SyllabusModule[] {
  if (!syllabus) return []
  if (Array.isArray(syllabus)) return syllabus
  
  const modules: SyllabusModule[] = []
  let current: SyllabusModule | null = null

  for (const raw of syllabus.split('\n')) {
    const line = raw.trim()
    if (!line) continue

    if (line.startsWith('## ') || line.startsWith('# ')) {
      if (current) modules.push(current)
      current = { title: line.replace(/^#+\s*/, ''), topics: [] }
    } else if ((line.startsWith('- ') || line.startsWith('* ')) && current) {
      current.topics.push(line.replace(/^[-*]\s*/, ''))
    } else if (line.startsWith('**') && line.endsWith('**') && current === null) {
      // Bold-only line treated as module title when no heading found
      current = { title: line.replace(/\*\*/g, ''), topics: [] }
    }
  }
  if (current) modules.push(current)
  return modules
}

interface CourseDetailBodyProps {
  course: Course
  syllabus: string | SyllabusModule[]
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
  const syllabusModules = parseSyllabus(syllabus)

  const breadcrumb = (
    <div
      className={
        isDashboard
          ? 'shrink-0 mb-4 flex items-center gap-2 text-sm'
          : 'bg-muted/30 py-4 border-b border-border -mx-0'
      }
    >
      <div className={isDashboard ? 'flex items-center gap-2' : 'container mx-auto px-4 flex items-center gap-2'}>
        <Link
          href={backHref}
          className={
            isDashboard
              ? 'text-slate-500 hover:text-[#312455] transition-colors flex items-center gap-1 font-semibold'
              : 'text-muted-foreground hover:text-primary transition-colors flex items-center gap-1'
          }
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
        <ChevronRight className={`h-4 w-4 ${isDashboard ? 'text-slate-300' : 'text-muted-foreground'}`} />
        <span
          className={
            isDashboard
              ? 'text-[#312455] font-bold line-clamp-1'
              : 'text-foreground font-semibold line-clamp-1'
          }
        >
          {course.name}
        </span>
      </div>
    </div>
  )

  const mainContent = (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge
            className={
              isDashboard
                ? 'bg-[#8a66a8] text-white font-semibold text-xs py-1 px-2.5 rounded-full border-none'
                : 'bg-accent text-accent-foreground font-semibold text-xs py-1 px-2.5 rounded-full border border-white/20'
            }
          >
            {course.category}
          </Badge>
          <Badge
            variant="outline"
            className={
              isDashboard
                ? 'border-[#312455]/20 text-[#312455] rounded-full'
                : 'border-primary/20 text-primary'
            }
          >
            {course.online ? 'Online' : 'Presencial'}
          </Badge>
          <Badge variant="secondary" className={isDashboard ? 'rounded-full' : ''}>
            Nível {course.level}
          </Badge>
        </div>
        <h1
          className={
            isDashboard
              ? 'text-2xl md:text-3xl font-black text-[#312455] mb-4 leading-tight'
              : 'text-3xl md:text-4xl font-extrabold text-primary mb-4 leading-tight'
          }
        >
          {course.name}
        </h1>
        <p
          className={
            isDashboard
              ? 'text-slate-600 text-base leading-relaxed text-pretty'
              : 'text-muted-foreground text-lg leading-relaxed text-pretty'
          }
        >
          {course.description}
        </p>
      </div>

      <div
        className={`grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y ${
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
            <BookOpen className={`h-5 w-5 ${isDashboard ? 'text-[#312455]' : 'text-primary'}`} />
          </div>
          <div>
            <p className={`text-xs ${isDashboard ? 'text-slate-500' : 'text-muted-foreground'}`}>Grade de Aula</p>
            <p className={`font-semibold text-sm ${isDashboard ? 'text-[#312455]' : ''}`}>
              {course.lessons} aulas
            </p>
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
        <div className="space-y-4 pb-4">
          {syllabusModules.length > 0 ? syllabusModules.map((module, i) => (
            <Card
              key={i}
              className={`border rounded-2xl overflow-hidden shadow-sm ${
                isDashboard ? 'border-slate-100 bg-white' : 'border-border/80'
              }`}
            >
              <div
                className={`p-4 border-b ${
                  isDashboard ? 'bg-[#f8fafc] border-slate-100' : 'bg-muted/40 border-border'
                }`}
              >
                <h3 className={`font-bold text-base ${isDashboard ? 'text-[#312455]' : 'text-primary'}`}>
                  {module.title}
                </h3>
              </div>
              <CardContent className="p-5">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {module.topics.map((topic, j) => (
                    <li
                      key={j}
                      className={`flex items-start gap-2.5 text-sm ${
                        isDashboard ? 'text-slate-600' : 'text-muted-foreground'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                          isDashboard ? 'bg-[#8a66a8]' : 'bg-accent'
                        }`}
                      />
                      {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )) : (
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
        <Image src={course.image} alt={course.name} fill className="object-cover" sizes="320px" priority />
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
        {breadcrumb}
        {desktopSplitLayout}
        {mobileStackLayout}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {breadcrumb}
      <div className="container mx-auto px-4 py-8 lg:py-10 flex flex-col flex-1 min-h-0 lg:min-h-[calc(100dvh-11rem)]">
        {desktopSplitLayout}
        {mobileStackLayout}
      </div>
    </div>
  )
}
