import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourses } from '@/lib/hygraph'
import { Clock, BookOpen, ChevronRight, CheckCircle2, Award, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const courses = await getCourses()
  const course = courses.find((c) => c.id === resolvedParams.id)
  
  if (!course) {
    return {
      title: 'Curso Não Encontrado - Prime Academy',
    }
  }

  return {
    title: `${course.name} - Prime Academy`,
    description: course.description,
  }
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const resolvedParams = await params
  const courses = await getCourses()
  const course = courses.find((c) => c.id === resolvedParams.id)

  if (!course) {
    notFound()
  }

  // Syllabus mock data depending on course
  const syllabus = course.id === '1' ? [
    { title: 'Módulo 1: Fundamentos da Gestão de Projectos', topics: ['Ciclo de vida do projecto', 'Estrutura organizacional', 'Definição de objectivos e escopo'] },
    { title: 'Módulo 2: Metodologias Ágeis vs Tradicionais', topics: ['Introdução ao Scrum e Kanban', 'O papel do Project Manager', 'Processos de planeamento preditivo'] },
    { title: 'Módulo 3: Planeamento, Cronograma e Orçamento', topics: ['WBS / EAP estruturada', 'Estimativas de custos e margens', 'Cálculo de caminho crítico (CPM)'] },
    { title: 'Módulo 4: Monitoria, Riscos e Encerramento', topics: ['Matriz de probabilidade e impacto', 'Análise de valor ganho (EVM)', 'Reuniões de retrospectiva'] }
  ] : [
    { title: 'Módulo 1: Fórmulas Avançadas e Lógicas', topics: ['SE, E, OU aninhados', 'PROCV, PROCH, ÍNDICE e CORRESP', 'Fórmulas financeiras avançadas'] },
    { title: 'Módulo 2: Manipulação e Validação de Dados', topics: ['Remoção de duplicados estruturada', 'Formatação condicional dinâmica', 'Filtros avançados e subtotais'] },
    { title: 'Módulo 3: Tabelas Dinâmicas de Performance', topics: ['Agrupamentos especiais', 'Gráficos dinâmicos com filtros (Slicers)', 'Campos e itens calculados'] },
    { title: 'Módulo 4: Automatizações Básicas e Macros', topics: ['Gravador de Macros', 'Introdução à linguagem VBA', 'Desenho de botões interactivos'] }
  ]

  const highlights = course.id === '1' ? [
    'Acesso ilimitado ao material de estudo telemático',
    'Matriz de controlo de riscos e planeamento real inclusa',
    'Orientado aos exames oficiais de certificação PMI',
    'Ideal para líderes e gestores de equipas em Angola'
  ] : [
    'Exercícios práticos focados em dados de finanças reais',
    'Acesso a planilhas prontas de alto rendimento corporativo',
    'Material didático de apoio em vídeo e manuais digitais',
    'Certificação oficial atestando competência avançada'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header breadcrumbs navigation */}
      <div className="bg-muted/30 py-4 border-b border-border">
        <div className="container mx-auto px-4 flex items-center gap-2 text-sm">
          <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Cursos
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-semibold line-clamp-1">{course.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-accent text-accent-foreground font-semibold text-xs py-1 px-2.5 rounded-full border border-white/20">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="border-primary/20 text-primary">
                  {course.online ? 'Online' : 'Presencial'}
                </Badge>
                <Badge variant="secondary">
                  Nível {course.level}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 leading-tight">
                {course.name}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
                {course.description}
              </p>
            </div>

            {/* Course Features / Badges */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duração</p>
                  <p className="font-semibold text-sm">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Grade de Aula</p>
                  <p className="font-semibold text-sm">{course.lessons} aulas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Certificação</p>
                  <p className="font-semibold text-sm">Reconhecida</p>
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Conteúdo Programático</h2>
              <div className="space-y-4">
                {syllabus.map((module, i) => (
                  <Card key={i} className="border border-border/80 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-muted/40 p-4 border-b border-border">
                      <h3 className="font-bold text-base text-primary">{module.title}</h3>
                    </div>
                    <CardContent className="p-5">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {module.topics.map((topic, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar checkout widget */}
          <div className="lg:col-span-1">
            <Card className="border border-border shadow-lg rounded-3xl sticky top-28 overflow-hidden bg-card">
              <div className="relative aspect-video">
                <Image
                  src={course.image}
                  alt={course.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-primary/20" />
              </div>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Investimento</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-primary mt-1">{course.price}</p>
                </div>

                <div className="space-y-3">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground leading-normal">{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border flex flex-col gap-3">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-sm font-semibold shadow-md cursor-pointer">
                    <Link href={`/enroll?course=${course.id}`}>
                      Inscrever-se Agora
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full rounded-xl h-12 text-sm font-semibold border-primary text-primary hover:bg-primary/5 cursor-pointer">
                    <Link href="/contact">
                      Pedir Orçamento Especial
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
