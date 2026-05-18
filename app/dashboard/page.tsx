'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Clock, Award, ArrowRight, Play, User, LogOut, 
  Download, Upload, Plus, CheckCircle2, Globe, Users, FileText, ChevronRight 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// Default mock courses
const defaultCourses = [
  {
    id: '1',
    name: 'Gestão de Projectos',
    description: 'Aprenda a gerir projectos de forma eficiente com metodologias ágeis e tradicionais.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    progress: 45,
    totalLessons: 12,
    completedLessons: 5,
    category: 'Gestão',
    online: false,
  },
  {
    id: '2',
    name: 'Excel Avançado',
    description: 'Domine o Excel com fórmulas avançadas, tabelas dinâmicas e dashboards.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    progress: 20,
    totalLessons: 10,
    completedLessons: 2,
    category: 'Informática',
    online: true,
  },
]

// Mock students for instructor view
const mockStudents = [
  { id: 's1', name: 'António Mateus', email: 'antonio@gmail.com', course: 'Gestão de Projectos', progress: 75, status: 'Ativo' },
  { id: 's2', name: 'Bela de Sousa', email: 'bela.sousa@gmail.com', course: 'Excel Avançado', progress: 40, status: 'Ativo' },
  { id: 's3', name: 'Carlos Manuel', email: 'carlos.m@gmail.com', course: 'Gestão de Projectos', progress: 15, status: 'Ativo' },
  { id: 's4', name: 'Daniela Simão', email: 'daniela.s@gmail.com', course: 'Excel Avançado', progress: 90, status: 'Concluído' },
]

interface PDFMaterial {
  id: string
  title: string
  courseId: string
  courseName: string
  description: string
  fileName: string
  uploadedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'courses' | 'pdfs' | 'students'>('courses')
  
  // PDF Materials state
  const [pdfMaterials, setPdfMaterials] = useState<PDFMaterial[]>([])
  
  // Form state for PDF upload
  const [newPdfTitle, setNewPdfTitle] = useState('')
  const [newPdfDesc, setNewPdfDesc] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('1')
  const [newPdfFileName, setNewPdfFileName] = useState('')

  // Load PDFs from localStorage or default ones
  useEffect(() => {
    const savedPDFs = localStorage.getItem('prime_academy_pdfs')
    if (savedPDFs) {
      setPdfMaterials(JSON.parse(savedPDFs))
    } else {
      const initialPDFs: PDFMaterial[] = [
        {
          id: 'pdf1',
          title: 'Manual de Iniciação ao PMBOK v7',
          courseId: '1',
          courseName: 'Gestão de Projectos',
          description: 'Material teórico complementar cobrindo a sétima edição do guia PMBOK.',
          fileName: 'Manual_PMBOK_v7_Prime.pdf',
          uploadedAt: new Date().toLocaleDateString(),
        },
        {
          id: 'pdf2',
          title: 'Guia Prático de Fórmulas e Atalhos Excel',
          courseId: '2',
          courseName: 'Excel Avançado',
          description: 'Lista completa de atalhos e fórmulas essenciais de finanças no Excel.',
          fileName: 'Guia_Atalhos_Excel_Avançado.pdf',
          uploadedAt: new Date().toLocaleDateString(),
        }
      ]
      setPdfMaterials(initialPDFs)
      localStorage.setItem('prime_academy_pdfs', JSON.stringify(initialPDFs))
    }
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Handle mock PDF file upload
  const handlePdfUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPdfTitle || !newPdfDesc || !newPdfFileName) {
      toast.error('Preencha todos os campos do material!')
      return
    }

    const targetCourse = selectedCourseId === '1' ? 'Gestão de Projectos' : 'Excel Avançado'
    
    const newMaterial: PDFMaterial = {
      id: crypto.randomUUID(),
      title: newPdfTitle,
      courseId: selectedCourseId,
      courseName: targetCourse,
      description: newPdfDesc,
      fileName: newPdfFileName.endsWith('.pdf') ? newPdfFileName : `${newPdfFileName}.pdf`,
      uploadedAt: new Date().toLocaleDateString(),
    }

    const updatedList = [...pdfMaterials, newMaterial]
    setPdfMaterials(updatedList)
    localStorage.setItem('prime_academy_pdfs', JSON.stringify(updatedList))
    
    // Clear inputs
    setNewPdfTitle('')
    setNewPdfDesc('')
    setNewPdfFileName('')
    
    toast.success('Material PDF publicado com sucesso!')
  }

  const isInstructor = user.role === 'instrutor'

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-muted/20 pb-16">
      {/* Header */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#48377a] to-primary" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-2xl font-bold text-primary shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                    Olá, {user.name.split(' ')[0]}!
                  </h1>
                  <Badge className={isInstructor ? "bg-accent text-accent-foreground uppercase font-semibold text-xs border border-white/20" : "bg-primary-foreground/20 text-white uppercase font-semibold text-xs"}>
                    {isInstructor ? 'Instrutor Oficial' : 'Aluno'}
                  </Badge>
                </div>
                <p className="text-primary-foreground/70 text-sm mt-0.5">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" asChild className="rounded-xl shadow-md cursor-pointer">
                <Link href="/courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Ver Cursos
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                className="text-primary-foreground hover:bg-primary-foreground/10 rounded-xl cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Terminar Sessão
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Advisory Banner */}
      <div className="container mx-auto px-4 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">Portal Digital da Prime Academy em Angola</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Para reforçar a nossa renovação institucional, sugerimos o registo e utilização do domínio oficial **primeacademy.co.ao** para todos os fluxos de inscrição, e-learning e certificados.
              </p>
            </div>
          </div>
          <Badge className="bg-primary text-white border border-primary/30 uppercase text-[10px] py-1 px-2.5 flex-shrink-0">
            primeacademy.co.ao
          </Badge>
        </motion.div>
      </div>

      {/* Main Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {isInstructor ? (
              <>
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Meus Cursos Lecionados</CardTitle>
                    <BookOpen className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2</div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Alunos Ativos</CardTitle>
                    <Users className="h-5 w-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{mockStudents.length}</div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">PDFs Publicados</CardTitle>
                    <FileText className="h-5 w-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{pdfMaterials.length}</div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Horas Lecionadas</CardTitle>
                    <Clock className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">85h</div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Cursos Inscritos</CardTitle>
                    <BookOpen className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{defaultCourses.length}</div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Aulas Concluídas</CardTitle>
                    <Clock className="h-5 w-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {defaultCourses.reduce((acc, c) => acc + c.completedLessons, 0)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">PDFs Disponibilizados</CardTitle>
                    <FileText className="h-5 w-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{pdfMaterials.length}</div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Certificados Conquistados</CardTitle>
                    <Award className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Segmented Navigation Tab */}
          <div className="flex border-b border-border mb-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'courses'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Meus Cursos
            </button>
            <button
              onClick={() => setActiveTab('pdfs')}
              className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                activeTab === 'pdfs'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {isInstructor ? 'Gerir Materiais PDF' : 'Materiais em PDF'}
            </button>
            {isInstructor && (
              <button
                onClick={() => setActiveTab('students')}
                className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
                  activeTab === 'students'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Lista de Alunos
              </button>
            )}
          </div>

          {/* Dynamic Render Tab Contents */}
          <AnimatePresence mode="wait">
            
            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <motion.div
                key="courses-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    {isInstructor ? 'Formações Sob Minha Docência' : 'Meus Cursos em Curso'}
                  </h2>
                  {!isInstructor && (
                    <Link href="/courses" className="text-accent hover:underline flex items-center gap-1 text-sm font-semibold">
                      Explorar outros cursos <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {defaultCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden border border-border/80 shadow-md hover:shadow-lg transition-all h-full flex flex-col rounded-2xl group">
                      <div className="relative h-44">
                        <Image
                          src={course.image}
                          alt={course.name}
                          fill
                          className="object-cover group-hover:scale-101 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-semibold text-xs py-1 px-2.5 rounded-full border border-white/20">
                          {course.category}
                        </Badge>
                        <Badge className={`absolute top-3 right-3 font-semibold text-xs py-1 px-2.5 rounded-full ${
                          course.online ? 'bg-primary text-white border border-accent/20' : 'bg-card text-foreground'
                        }`}>
                          {course.online ? 'Online' : 'Presencial'}
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-primary">{course.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto">
                        {!isInstructor ? (
                          <>
                            {/* Student Course Progress */}
                            <div className="mb-5">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground text-xs">Progresso da Formação</span>
                                <span className="font-semibold text-xs text-primary">{course.progress}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-accent rounded-full transition-all duration-700"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1.5">
                                {course.completedLessons} de {course.totalLessons} aulas assistidas
                              </p>
                            </div>
                            
                            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 text-sm shadow-md cursor-pointer">
                              <Link href={`/courses/${course.id}`}>
                                <Play className="mr-2 h-4 w-4 fill-white" />
                                Continuar Estudo
                              </Link>
                            </Button>
                          </>
                        ) : (
                          <>
                            {/* Instructor details view */}
                            <div className="pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-accent" />
                                {mockStudents.filter(s => s.course === course.name).length} Alunos Matriculados
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />
                                {pdfMaterials.filter(p => p.courseId === course.id).length} Materiais PDF
                              </span>
                            </div>
                            <Button asChild variant="outline" className="w-full mt-4 rounded-xl border-primary text-primary hover:bg-primary/5 cursor-pointer">
                              <Link href={`/courses/${course.id}`}>
                                Ver Grade de Aula
                              </Link>
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PDF Materials Management / Download Tab */}
            {activeTab === 'pdfs' && (
              <motion.div
                key="pdfs-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                
                {/* Aluno View (List only) or Instructor View (Form + List) */}
                <div className={isInstructor ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      {isInstructor ? 'Materiais PDF Disponibilizados' : 'Materiais Académicos em PDF'}
                    </h2>
                    <Badge variant="outline" className="border-primary/20 text-primary">
                      {pdfMaterials.length} Arquivos
                    </Badge>
                  </div>

                  {pdfMaterials.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {pdfMaterials.map((pdf) => (
                        <Card key={pdf.id} className="border border-border/80 shadow-sm hover:shadow-md transition-all rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className="bg-primary/10 text-primary text-[10px] py-0.5 px-2 rounded-full font-semibold border-none">
                                {pdf.courseName}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{pdf.uploadedAt}</span>
                            </div>
                            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                              <FileText className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                              {pdf.title}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                              {pdf.description}
                            </p>
                            <p className="text-[10px] font-mono text-primary/60 bg-primary/5 px-2 py-0.5 rounded w-fit">
                              {pdf.fileName}
                            </p>
                          </div>
                          
                          <Button 
                            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-4 py-2 text-xs flex items-center gap-1.5 shadow-md flex-shrink-0 cursor-pointer w-full sm:w-auto"
                            onClick={() => {
                              toast.info(`Descarregando arquivo: ${pdf.fileName}`)
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Descarregar
                          </Button>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border border-dashed border-border p-12 text-center rounded-2xl bg-card">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-bold text-lg mb-1">Nenhum material publicado</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Ainda não existem arquivos em PDF para download neste painel.
                      </p>
                    </Card>
                  )}
                </div>

                {/* Instructor Exclusive - Upload PDF Form */}
                {isInstructor && (
                  <div className="lg:col-span-1">
                    <Card className="border border-border/80 shadow-md rounded-2xl bg-card">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg text-primary flex items-center gap-2">
                          <Upload className="h-5 w-5 text-accent" />
                          Publicar PDF
                        </CardTitle>
                        <CardDescription>
                          Disponibilize novos materiais teóricos para as suas turmas.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handlePdfUpload} className="space-y-4">
                          
                          <div className="space-y-1">
                            <Label htmlFor="courseSelect" className="text-xs">Selecione o Curso</Label>
                            <select
                              id="courseSelect"
                              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                              value={selectedCourseId}
                              onChange={(e) => setSelectedCourseId(e.target.value)}
                            >
                              <option value="1">Gestão de Projectos</option>
                              <option value="2">Excel Avançado</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="pdfTitle" className="text-xs">Título do Material</Label>
                            <Input
                              id="pdfTitle"
                              placeholder="Ex: Manual de Scrum Avançado"
                              value={newPdfTitle}
                              onChange={(e) => setNewPdfTitle(e.target.value)}
                              className="rounded-lg h-10 text-sm"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="pdfDesc" className="text-xs">Descrição Resumida</Label>
                            <textarea
                              id="pdfDesc"
                              placeholder="Explique resumidamente o que o estudante aprenderá neste PDF..."
                              className="w-full p-3 rounded-lg border border-input bg-background text-sm h-20 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                              value={newPdfDesc}
                              onChange={(e) => setNewPdfDesc(e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="pdfName" className="text-xs">Nome do Arquivo Físico (.pdf)</Label>
                            <Input
                              id="pdfName"
                              placeholder="Ex: manual_scrum_prime.pdf"
                              value={newPdfFileName}
                              onChange={(e) => setNewPdfFileName(e.target.value)}
                              className="rounded-lg h-10 text-sm font-mono text-primary"
                              required
                            />
                          </div>

                          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-11 text-xs font-semibold shadow-md mt-4 cursor-pointer">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Publicar Material PDF
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            )}

            {/* Instructor Exclusive - Students List Tab */}
            {isInstructor && activeTab === 'students' && (
              <motion.div
                key="students-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Estudantes sob Minha Tutoria</h2>
                  <Badge variant="outline" className="border-accent/20 text-accent font-semibold">
                    {mockStudents.length} Alunos Inscritos
                  </Badge>
                </div>

                <Card className="border border-border/80 shadow-md rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                          <th className="p-4 font-semibold text-xs uppercase text-primary">Nome</th>
                          <th className="p-4 font-semibold text-xs uppercase text-primary">Email</th>
                          <th className="p-4 font-semibold text-xs uppercase text-primary">Curso Vinculado</th>
                          <th className="p-4 font-semibold text-xs uppercase text-primary text-center">Progresso Geral</th>
                          <th className="p-4 font-semibold text-xs uppercase text-primary">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {mockStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-4 font-bold text-foreground">{student.name}</td>
                            <td className="p-4 text-muted-foreground text-xs">{student.email}</td>
                            <td className="p-4">
                              <Badge className="bg-primary/5 text-primary text-[10px] font-semibold border-none py-0.5 px-2 rounded-full">
                                {student.course}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-3 max-w-[120px] mx-auto">
                                <span className="font-semibold text-xs text-primary">{student.progress}%</span>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-accent rounded-full"
                                    style={{ width: `${student.progress}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full border ${
                                student.status === 'Concluído'
                                  ? 'bg-green-500/10 text-green-600 border-green-500/20'
                                  : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                              }`}>
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
