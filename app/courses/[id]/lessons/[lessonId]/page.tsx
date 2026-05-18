'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Play, ChevronLeft, ChevronRight, CheckCircle2, 
  Clock, BookOpen, Download, MessageSquare, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

// Mock lesson data
const mockLessons: Record<string, {
  id: string
  title: string
  duration: string
  videoUrl: string
  description: string
  courseId: string
  courseName: string
  moduleTitle: string
  completed: boolean
  nextLesson?: { id: string; title: string }
  prevLesson?: { id: string; title: string }
  resources: { name: string; url: string }[]
}> = {
  'l1': {
    id: 'l1',
    title: 'O que é Gestão de Projectos',
    duration: '15 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Nesta aula introdutória, você vai aprender os conceitos fundamentais da gestão de projectos, sua importância no mundo empresarial e como ela pode transformar a forma como você trabalha.',
    courseId: '1',
    courseName: 'Gestão de Projectos',
    moduleTitle: 'Introdução à Gestão de Projectos',
    completed: true,
    nextLesson: { id: 'l2', title: 'Ciclo de Vida do Projecto' },
    resources: [
      { name: 'Slides da Aula', url: '#' },
      { name: 'Material Complementar', url: '#' },
    ]
  },
  'l2': {
    id: 'l2',
    title: 'Ciclo de Vida do Projecto',
    duration: '20 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Entenda as diferentes fases de um projecto, desde a iniciação até o encerramento, e como gerenciar cada etapa de forma eficiente.',
    courseId: '1',
    courseName: 'Gestão de Projectos',
    moduleTitle: 'Introdução à Gestão de Projectos',
    completed: true,
    prevLesson: { id: 'l1', title: 'O que é Gestão de Projectos' },
    nextLesson: { id: 'l3', title: 'Papéis e Responsabilidades' },
    resources: [
      { name: 'Slides da Aula', url: '#' },
      { name: 'Template de Ciclo de Vida', url: '#' },
    ]
  },
  'l3': {
    id: 'l3',
    title: 'Papéis e Responsabilidades',
    duration: '18 min',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Conheça os diferentes papéis em uma equipe de projecto e suas responsabilidades específicas.',
    courseId: '1',
    courseName: 'Gestão de Projectos',
    moduleTitle: 'Introdução à Gestão de Projectos',
    completed: false,
    prevLesson: { id: 'l2', title: 'Ciclo de Vida do Projecto' },
    nextLesson: { id: 'l4', title: 'Waterfall: Conceitos e Aplicações' },
    resources: [
      { name: 'Slides da Aula', url: '#' },
      { name: 'Matriz RACI', url: '#' },
    ]
  },
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [isCompleted, setIsCompleted] = useState(false)
  
  const courseId = params.id as string
  const lessonId = params.lessonId as string
  const lesson = mockLessons[lessonId]

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/courses/${courseId}/lessons/${lessonId}`)
    }
  }, [user, authLoading, router, courseId, lessonId])

  useEffect(() => {
    if (lesson) {
      setIsCompleted(lesson.completed)
    }
  }, [lesson])

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Conteúdo Exclusivo</h2>
            <p className="text-muted-foreground mb-6">
              Faça login para acessar as aulas do curso.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 rounded-xl">
              <Link href={`/login?redirect=/courses/${courseId}/lessons/${lessonId}`}>
                Fazer Login
              </Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Não tem conta?{' '}
              <Link href="/signup" className="text-accent hover:underline">
                Criar conta gratuita
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aula não encontrada</h1>
          <Button asChild>
            <Link href={`/courses/${courseId}`}>Voltar ao Curso</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleMarkComplete = () => {
    setIsCompleted(!isCompleted)
    // In a real app, this would make an API call
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-muted/30">
      {/* Video Section */}
      <div className="bg-black">
        <div className="container mx-auto">
          <div className="aspect-video max-h-[70vh]">
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/courses" className="hover:text-foreground transition-colors">
                Cursos
              </Link>
              <span>/</span>
              <Link href={`/courses/${courseId}`} className="hover:text-foreground transition-colors">
                {lesson.courseName}
              </Link>
              <span>/</span>
              <span className="text-foreground">{lesson.title}</span>
            </div>

            {/* Title & Meta */}
            <div>
              <p className="text-accent font-medium mb-2">{lesson.moduleTitle}</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{lesson.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {lesson.duration}
                </span>
              </div>
            </div>

            {/* Description */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Sobre esta aula</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {lesson.description}
                </p>
              </CardContent>
            </Card>

            {/* Mark Complete Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={handleMarkComplete}
                variant={isCompleted ? 'secondary' : 'default'}
                className={`w-full h-12 rounded-xl ${
                  isCompleted 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Aula Concluída
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Marcar como Concluída
                  </>
                )}
              </Button>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              {lesson.prevLesson ? (
                <Button
                  variant="ghost"
                  asChild
                  className="rounded-xl"
                >
                  <Link href={`/courses/${courseId}/lessons/${lesson.prevLesson.id}`}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">Anterior</p>
                      <p className="text-sm font-medium">{lesson.prevLesson.title}</p>
                    </div>
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              
              {lesson.nextLesson ? (
                <Button
                  variant="ghost"
                  asChild
                  className="rounded-xl"
                >
                  <Link href={`/courses/${courseId}/lessons/${lesson.nextLesson.id}`}>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Próxima</p>
                      <p className="text-sm font-medium">{lesson.nextLesson.title}</p>
                    </div>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="default"
                  asChild
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
                >
                  <Link href={`/courses/${courseId}`}>
                    Voltar ao Curso
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resources */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Recursos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lesson.resources.map((resource, index) => (
                    <li key={index}>
                      <Link
                        href={resource.url}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <BookOpen className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium">{resource.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Course Progress */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Progresso do Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ width: '25%' }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    3 de 12 aulas concluídas
                  </p>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-xl"
                  >
                    <Link href={`/courses/${courseId}`}>
                      Ver todo o conteúdo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="border-none shadow-sm bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <MessageSquare className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
                <p className="text-sm text-primary-foreground/80 mb-4">
                  Entre em contacto com o nosso suporte para esclarecer dúvidas.
                </p>
                <Button
                  variant="secondary"
                  asChild
                  className="w-full rounded-xl"
                >
                  <Link href="/contact">
                    Contactar Suporte
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
