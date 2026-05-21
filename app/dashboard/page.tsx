'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Clock, Award, ArrowRight, Play, User, LogOut, 
  Download, Upload, Plus, CheckCircle2, Globe, Users, FileText, 
  ChevronRight, ShieldCheck, Menu, X, Bell, Calendar, Search, 
  BookOpenCheck, LayoutDashboard, Settings, Compass, Eye, EyeOff,
  Lock, UserCircle, Mail, Tag, Star, Zap
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

// Explore catalog courses
const exploreCourses = [
  {
    id: 'e1',
    name: 'Liderança e Gestão de Equipas',
    description: 'Desenvolva competências de liderança transformacional e gestão de alta performance.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    category: 'Gestão',
    duration: '24h',
    modality: 'Online',
    rating: 4.9,
    enrolled: 312,
  },
  {
    id: 'e2',
    name: 'Marketing Digital & Redes Sociais',
    description: 'Estratégias de marketing digital, SEO, conteúdo e gestão de redes sociais.',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
    category: 'Marketing',
    duration: '16h',
    modality: 'Híbrido',
    rating: 4.7,
    enrolled: 541,
  },
  {
    id: 'e3',
    name: 'Power BI & Análise de Dados',
    description: 'Crie dashboards interativos e relatórios de business intelligence com Power BI.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    category: 'Informática',
    duration: '20h',
    modality: 'Online',
    rating: 4.8,
    enrolled: 228,
  },
  {
    id: 'e4',
    name: 'Comunicação Institucional',
    description: 'Técnicas de comunicação corporativa, oratória e assessoria de imprensa.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    category: 'Soft Skills',
    duration: '12h',
    modality: 'Presencial',
    rating: 4.6,
    enrolled: 187,
  },
  {
    id: 'e5',
    name: 'Finanças Empresariais',
    description: 'Gestão financeira, análise de indicadores e planeamento orçamental empresarial.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    category: 'Gestão',
    duration: '28h',
    modality: 'Híbrido',
    rating: 4.9,
    enrolled: 405,
  },
  {
    id: 'e6',
    name: 'Inteligência Emocional Aplicada',
    description: 'Desenvolva autoconhecimento, empatia e gestão emocional no ambiente profissional.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    category: 'Soft Skills',
    duration: '10h',
    modality: 'Online',
    rating: 4.7,
    enrolled: 298,
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

const EXPLORE_CATEGORIES = ['Todos', 'Gestão', 'Informática', 'Marketing', 'Soft Skills']

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'courses' | 'pdfs' | 'students' | 'explore' | 'settings'>('courses')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  
  // PDF Materials state
  const [pdfMaterials, setPdfMaterials] = useState<PDFMaterial[]>([])
  
  // Form state for PDF upload
  const [newPdfTitle, setNewPdfTitle] = useState('')
  const [newPdfDesc, setNewPdfDesc] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('1')
  const [newPdfFileName, setNewPdfFileName] = useState('')

  // Explore tab state
  const [exploreSearch, setExploreSearch] = useState('')
  const [exploreCategory, setExploreCategory] = useState('Todos')
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])

  // Settings tab state
  const [settingsName, setSettingsName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  // Load date in Portuguese
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    const today = new Date().toLocaleDateString('pt-AO', options)
    setCurrentDate(today.charAt(0).toUpperCase() + today.slice(1))
  }, [])

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
          uploadedAt: new Date().toLocaleDateString('pt-AO'),
        },
        {
          id: 'pdf2',
          title: 'Guia Prático de Fórmulas e Atalhos Excel',
          courseId: '2',
          courseName: 'Excel Avançado',
          description: 'Lista completa de atalhos e fórmulas essenciais de finanças no Excel.',
          fileName: 'Guia_Atalhos_Excel_Avançado.pdf',
          uploadedAt: new Date().toLocaleDateString('pt-AO'),
        }
      ]
      setPdfMaterials(initialPDFs)
      localStorage.setItem('prime_academy_pdfs', JSON.stringify(initialPDFs))
    }
  }, [])

  // Prefill settings name from user
  useEffect(() => {
    if (user?.name) setSettingsName(user.name)
  }, [user])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f0f9]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#312455]"></div>
          <p className="text-sm font-semibold text-slate-500 animate-pulse">A carregar o seu painel...</p>
        </div>
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
      uploadedAt: new Date().toLocaleDateString('pt-AO'),
    }

    const updatedList = [...pdfMaterials, newMaterial]
    setPdfMaterials(updatedList)
    localStorage.setItem('prime_academy_pdfs', JSON.stringify(updatedList))
    
    setNewPdfTitle('')
    setNewPdfDesc('')
    setNewPdfFileName('')
    
    toast.success('Material PDF publicado com sucesso!')
  }

  // Handle enroll in explore course
  const handleEnroll = (courseId: string, courseName: string) => {
    if (enrolledCourses.includes(courseId)) {
      toast.info(`Já está inscrito em "${courseName}"`)
      return
    }
    setEnrolledCourses(prev => [...prev, courseId])
    toast.success(`Inscrição em "${courseName}" efectuada com sucesso!`)
  }

  // Handle save settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem. Verifique e tente novamente.')
      return
    }
    if (newPassword && newPassword.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }
    toast.success('Definições guardadas com sucesso!')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const isInstructor = user.role === 'instrutor'

  // Filtered explore courses
  const filteredExploreCourses = exploreCourses.filter(c => {
    const matchesCategory = exploreCategory === 'Todos' || c.category === exploreCategory
    const matchesSearch = c.name.toLowerCase().includes(exploreSearch.toLowerCase()) ||
                          c.description.toLowerCase().includes(exploreSearch.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sidebarLinks = [
    {
      id: 'courses' as const,
      label: isInstructor ? 'Minhas Turmas' : 'Meus Cursos',
      icon: BookOpen,
    },
    {
      id: 'pdfs' as const,
      label: isInstructor ? 'Gerir PDFs' : 'Biblioteca PDF',
      icon: FileText,
    },
    ...(isInstructor ? [{
      id: 'students' as const,
      label: 'Lista de Alunos',
      icon: Users,
    }] : []),
    {
      id: 'explore' as const,
      label: 'Explorar Cursos',
      icon: Compass,
    },
    {
      id: 'settings' as const,
      label: 'Definições',
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f4f0f9] flex text-slate-800">
      
      {/* 1. SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#312455] text-white fixed h-screen z-30 shadow-none border-none rounded-r-[2.5rem]">
        {/* Profile/Avatar Premium Header */}
        <div className="pt-8 pb-6 px-6 border-b border-white/10 flex flex-col items-center text-center">
          {/* Avatar Ring with subtle glow */}
          <div className="relative mb-3 group cursor-pointer">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8a66a8] to-white/40 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-20 h-20 rounded-full p-1 bg-white/10 ring-2 ring-white/20 ring-offset-2 ring-offset-[#312455] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8a66a8] to-[#4a347c] flex items-center justify-center text-xl font-black text-white shadow-inner">
                {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>
            {/* Online Status Badge */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#312455] ring-1 ring-white/10" />
          </div>
          {/* Name & Email */}
          <h2 className="font-extrabold text-sm tracking-tight text-white line-clamp-1">{user.name}</h2>
          <p className="text-[10px] text-white/50 font-semibold truncate max-w-full mt-0.5">{user.email}</p>
          <Badge className="mt-2 bg-[#8a66a8]/20 hover:bg-[#8a66a8]/35 text-[#c1a7d6] border border-[#8a66a8]/30 uppercase text-[8px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full">
            {isInstructor ? 'Instrutor' : 'Estudante'}
          </Badge>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 pl-4 pr-0 py-6 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
            Área de Formação
          </div>
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = activeTab === link.id
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-l-2xl rounded-r-none text-sm font-semibold transition-all duration-300 w-full ${
                  isActive 
                    ? 'bg-[#f4f0f9] text-[#312455]' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-[#312455]' : 'text-white/60'}`} />
                {link.label}
              </button>
            )
          })}

          {isInstructor && (
            <div className="pt-4 pr-4">
              <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
                Administração
              </div>
              <Link
                href="/admin"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-white/60" />
                Painel Geral Admin
              </Link>
            </div>
          )}
        </nav>

        {/* Logout Section at bottom */}
        <div className="p-4 border-t border-white/10 bg-black/10 mt-auto rounded-br-[2.5rem]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-red-300 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 text-white/60" />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* 2. SIDEBAR MOBILE DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-[#312455] text-white z-50 flex flex-col lg:hidden shadow-2xl rounded-r-[2.5rem]"
            >
              {/* Mobile Profile/Avatar Premium Header */}
              <div className="pt-8 pb-6 px-6 border-b border-white/10 flex flex-col items-center text-center relative">
                {/* Close Button absolute inside header */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 text-white/70 hover:bg-white/5 hover:text-white rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Avatar Ring */}
                <div className="relative mb-3 cursor-pointer">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8a66a8] to-white/40 blur-sm opacity-70" />
                  <div className="relative w-20 h-20 rounded-full p-1 bg-white/10 ring-2 ring-white/20 ring-offset-2 ring-offset-[#312455] flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8a66a8] to-[#4a347c] flex items-center justify-center text-xl font-black text-white shadow-inner">
                      {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#312455] ring-1 ring-white/10" />
                </div>
                {/* Name & Email */}
                <h2 className="font-extrabold text-sm tracking-tight text-white line-clamp-1">{user.name}</h2>
                <p className="text-[10px] text-white/50 font-semibold truncate max-w-full mt-0.5">{user.email}</p>
                <Badge className="mt-2 bg-[#8a66a8]/20 text-[#c1a7d6] border border-[#8a66a8]/30 uppercase text-[8px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full">
                  {isInstructor ? 'Instrutor' : 'Estudante'}
                </Badge>
              </div>

              <nav className="flex-1 pl-4 pr-0 py-6 space-y-1 overflow-y-auto">
                <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
                  Área de Formação
                </div>
                {sidebarLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = activeTab === link.id
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActiveTab(link.id)
                        setSidebarOpen(false)
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-l-2xl rounded-r-none text-sm font-semibold transition-all duration-300 w-full ${
                        isActive 
                          ? 'bg-[#f4f0f9] text-[#312455]' 
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-[#312455]' : 'text-white/60'}`} />
                      {link.label}
                    </button>
                  )
                })}

                {isInstructor && (
                  <div className="pt-4 pr-4">
                    <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
                      Administração
                    </div>
                    <Link
                      href="/admin"
                      onClick={() => setSidebarOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300"
                    >
                      <ShieldCheck className="h-4.5 w-4.5 text-white/60" />
                      Painel Geral Admin
                    </Link>
                  </div>
                )}
              </nav>

              {/* Mobile Logout Section at bottom */}
              <div className="p-4 border-t border-white/10 bg-black/10 mt-auto rounded-br-[2.5rem]">
                <button 
                  onClick={() => {
                    setSidebarOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-red-300 transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-white/60" />
                  Terminar Sessão
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        
        {/* Workspace Top Navbar */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-6 z-20 shadow-sm rounded-bl-[2rem]">
          {/* Left side: hamburger + date */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-700 hover:bg-slate-100/50 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Date display — left side, replacing breadcrumbs */}
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-[#8a66a8]" />
              <span className="text-[#312455] font-semibold">{currentDate}</span>
            </div>
          </div>

          {/* Right: Notification Bell + Avatar */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-500 hover:text-[#312455] hover:bg-slate-100 rounded-full"
              title="Notificações"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-ping" />
            </Button>

            <div className="h-8 w-8 rounded-full bg-[#312455] text-white flex items-center justify-center text-xs font-bold border border-slate-200 shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Content Workspace Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* A. Dynamic Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#312455] via-[#4a347c] to-[#312455] p-8 text-white shadow-lg"
          >
            {/* Visual background lights */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#8a66a8]/25 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute left-0 bottom-0 w-60 h-60 bg-white/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10">
                    Prime Academy Angola
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                  {isInstructor ? `Olá, Prof. ${user.name.split(' ')[0]}!` : `Olá, Aluno ${user.name.split(' ')[0]}!`}
                </h1>
                <p className="text-white/70 text-sm max-w-xl">
                  {isInstructor 
                    ? 'Bem-vindo ao seu painel docente. Aqui pode gerir os seus materiais de apoio e acompanhar o progresso pedagógico de cada aluno.'
                    : 'Pronto para expandir o seu conhecimento hoje? Continue o seu percurso de aprendizagem de onde parou.'}
                </p>
              </div>

              {!isInstructor && (
                <Button 
                  onClick={() => setActiveTab('explore')}
                  className="bg-[#8a66a8] hover:bg-[#a582c3] text-white rounded-2xl h-12 px-6 font-semibold shadow-md flex-shrink-0 cursor-pointer self-start md:self-auto transition-transform hover:scale-102 active:scale-98"
                >
                  Explorar Novos Cursos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>

          {/* B. Domain Advisory Alert */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-[#8a66a8]/10 border border-[#8a66a8]/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-[#8a66a8] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#312455]">Portal de Formação Homologado em Angola</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Para aceder a todos os fluxos de inscrição, e-learning e validação imediata de certificados, recomendamos a utilização permanente do nosso domínio institucional **primeacademy.co.ao**.
                </p>
              </div>
            </div>
            <Badge className="bg-[#312455] text-white border-none uppercase text-[10px] py-1 px-3 rounded-full flex-shrink-0 font-bold tracking-wider">
              primeacademy.co.ao
            </Badge>
          </motion.div>

          {/* C. Interactive Statistics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isInstructor ? (
              <>
                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cursos Lecionados</CardTitle>
                    <div className="bg-[#312455]/5 p-2 rounded-xl text-[#312455] group-hover:bg-[#312455] group-hover:text-white transition-all duration-300">
                      <BookOpen className="h-4.5 w-4.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-3xl font-black text-[#312455]">2</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Turmas ativas este semestre</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alunos Ativos</CardTitle>
                    <div className="bg-[#8a66a8]/5 p-2 rounded-xl text-[#8a66a8] group-hover:bg-[#8a66a8] group-hover:text-white transition-all duration-300">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-3xl font-black text-[#312455]">{mockStudents.length}</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Estudantes sob supervisão</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arquivos Publicados</CardTitle>
                    <div className="bg-[#8a66a8]/5 p-2 rounded-xl text-[#8a66a8] group-hover:bg-[#8a66a8] group-hover:text-white transition-all duration-300">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-3xl font-black text-[#312455]">{pdfMaterials.length}</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Manuais pedagógicos em PDF</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Horas Lecionadas</CardTitle>
                    <div className="bg-[#312455]/5 p-2 rounded-xl text-[#312455] group-hover:bg-[#312455] group-hover:text-white transition-all duration-300">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-3xl font-black text-[#312455]">85h</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Tempo letivo acumulado</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cursos Inscritos</CardTitle>
                    <div className="bg-[#312455]/5 p-2 rounded-xl text-[#312455] group-hover:bg-[#312455] group-hover:text-white transition-all duration-300">
                      <BookOpen className="h-4.5 w-4.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-3xl font-black text-[#312455]">{defaultCourses.length}</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Programas de especialização</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aulas Concluídas</CardTitle>
                    <div className="bg-[#8a66a8]/5 p-2 rounded-xl text-[#8a66a8] group-hover:bg-[#8a66a8] group-hover:text-white transition-all duration-300">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-3xl font-black text-[#312455]">
                      {defaultCourses.reduce((acc, c) => acc + c.completedLessons, 0)}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Aulas assistidas até hoje</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">PDFs Disponíveis</CardTitle>
                    <div className="bg-[#8a66a8]/5 p-2 rounded-xl text-[#8a66a8] group-hover:bg-[#8a66a8] group-hover:text-white transition-all duration-300">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-3xl font-black text-[#312455]">{pdfMaterials.length}</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Materiais didáticos ativos</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificados</CardTitle>
                    <div className="bg-[#312455]/5 p-2 rounded-xl text-[#312455] group-hover:bg-[#312455] group-hover:text-white transition-all duration-300">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="text-3xl font-black text-[#312455]">0</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Diplomas oficiais homologados</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* D. Tab Content Panel */}
          <AnimatePresence mode="wait">
            
            {/* D1. COURSES TAB */}
            {activeTab === 'courses' && (
              <motion.div
                key="courses-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#312455]">
                      {isInstructor ? 'Formações em Docência' : 'Os Meus Programas Activos'}
                    </h2>
                    <p className="text-xs text-slate-500">Acompanhamento e evolução do seu desenvolvimento.</p>
                  </div>
                  {!isInstructor && (
                    <button
                      onClick={() => setActiveTab('explore')}
                      className="text-[#8a66a8] hover:text-[#312455] transition-colors flex items-center gap-1 text-xs font-bold hover:underline"
                    >
                      Explorar mais cursos <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {defaultCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl bg-white flex flex-col group">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={course.image}
                          alt={course.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <Badge className="bg-[#8a66a8] text-white border-none uppercase text-[9px] font-bold tracking-widest px-3 py-1 rounded-full">
                            {course.category}
                          </Badge>
                          <Badge className={`border-none uppercase text-[9px] font-bold tracking-widest px-3 py-1 rounded-full ${course.online ? 'bg-emerald-500/90 text-white' : 'bg-white/90 text-[#312455]'}`}>
                            {course.online ? 'Online' : 'Presencial'}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="flex flex-col flex-1 p-6 space-y-4">
                        <div>
                          <h3 className="font-black text-[#312455] text-base leading-snug">{course.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{course.description}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-500">Progresso</span>
                            <span className="font-black text-[#312455]">{course.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#312455] to-[#8a66a8] rounded-full transition-all duration-700"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{course.completedLessons} de {course.totalLessons} aulas</span>
                            <span>{course.totalLessons - course.completedLessons} restantes</span>
                          </div>
                        </div>

                        <Button
                          asChild
                          className="w-full bg-[#312455] hover:bg-[#8a66a8] text-white rounded-2xl h-11 font-bold text-xs shadow-sm cursor-pointer transition-all duration-300 mt-auto"
                        >
                          <Link href="/courses">
                            <Play className="mr-2 h-4 w-4" />
                            {course.progress > 0 ? 'Continuar Curso' : 'Iniciar Curso'}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* D2. PDFs TAB */}
            {activeTab === 'pdfs' && (
              <motion.div
                key="pdfs-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#312455]">
                      {isInstructor ? 'Gestão de Materiais PDF' : 'Biblioteca de Materiais'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isInstructor ? 'Publique e gira os materiais de apoio para os seus alunos.' : 'Aceda e faça download dos seus materiais de estudo.'}
                    </p>
                  </div>
                  <Badge className="bg-[#312455]/10 text-[#312455] border-none font-bold text-xs py-1 px-3.5 rounded-full">
                    {pdfMaterials.length} Ficheiros
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {pdfMaterials.map((pdf) => (
                    <Card key={pdf.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white overflow-hidden group">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors duration-300">
                            <FileText className="h-6 w-6 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-black text-[#312455] text-sm truncate">{pdf.title}</h3>
                              <Badge className="bg-[#8a66a8]/10 text-[#8a66a8] border-none text-[9px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full flex-shrink-0">
                                {pdf.courseName}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{pdf.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                {pdf.uploadedAt}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{pdf.fileName}</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 text-[#8a66a8] hover:bg-[#8a66a8]/10 rounded-xl transition-all"
                            onClick={() => toast.success(`A iniciar download de "${pdf.fileName}"...`)}
                          >
                            <Download className="h-4.5 w-4.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Instructor Upload Form */}
                {isInstructor && (
                  <Card className="border border-[#8a66a8]/20 shadow-sm rounded-2xl bg-gradient-to-br from-white to-[#8a66a8]/5 overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center">
                          <Upload className="h-4.5 w-4.5 text-[#8a66a8]" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-black text-[#312455]">Publicar Novo Material</CardTitle>
                          <CardDescription className="text-[10px] text-slate-400">Adicione materiais de estudo para os seus alunos</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePdfUpload} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="pdfTitle" className="text-xs font-bold text-slate-600">Título do Material</Label>
                            <Input
                              id="pdfTitle"
                              placeholder="Ex: Manual de Boas Práticas PMBOK"
                              value={newPdfTitle}
                              onChange={(e) => setNewPdfTitle(e.target.value)}
                              className="rounded-xl h-10 text-xs text-[#312455] border-slate-200"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="pdfCourse" className="text-xs font-bold text-slate-600">Curso Associado</Label>
                            <select
                              id="pdfCourse"
                              value={selectedCourseId}
                              onChange={(e) => setSelectedCourseId(e.target.value)}
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs text-[#312455] px-3 focus:outline-none focus:ring-2 focus:ring-[#8a66a8] transition-all"
                            >
                              {defaultCourses.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="pdfDesc" className="text-xs font-bold text-slate-600">Descrição do Conteúdo</Label>
                          <textarea
                            id="pdfDesc"
                            placeholder="Descreva resumidamente o que o estudante aprenderá neste manual..."
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs h-20 focus:outline-none focus:ring-2 focus:ring-[#8a66a8] resize-none transition-all"
                            value={newPdfDesc}
                            onChange={(e) => setNewPdfDesc(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="pdfName" className="text-xs font-bold text-slate-600">Nome do Arquivo (.pdf)</Label>
                          <Input
                            id="pdfName"
                            placeholder="Ex: manual_pmbok_prime.pdf"
                            value={newPdfFileName}
                            onChange={(e) => setNewPdfFileName(e.target.value)}
                            className="rounded-xl h-10 text-xs font-mono text-[#312455] border-slate-200"
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full bg-[#8a66a8] text-white hover:bg-[#312455] rounded-2xl h-11 text-xs font-bold shadow-md mt-4 cursor-pointer transition-transform duration-300 hover:scale-101">
                          <Plus className="mr-1.5 h-4 w-4" />
                          Publicar PDF
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* D3. STUDENTS TABLE TAB */}
            {isInstructor && activeTab === 'students' && (
              <motion.div
                key="students-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#312455]">Estudantes sob Minha Tutoria</h2>
                    <p className="text-xs text-slate-500">Gestão de desempenho e progresso dos estudantes ativos.</p>
                  </div>
                  <Badge className="bg-[#312455]/10 text-[#312455] border-none font-bold text-xs py-1 px-3.5 rounded-full">
                    {mockStudents.length} Alunos Inscritos
                  </Badge>
                </div>

                <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
                          <th className="p-4 font-bold text-[#312455]">Nome Completo</th>
                          <th className="p-4 font-bold text-[#312455]">E-mail</th>
                          <th className="p-4 font-bold text-[#312455]">Curso Vinculado</th>
                          <th className="p-4 font-bold text-[#312455] text-center">Progresso Geral</th>
                          <th className="p-4 font-bold text-[#312455]">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                        {mockStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#8a66a8]/10 text-[#8a66a8] font-bold flex items-center justify-center text-[10px] shadow-sm">
                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-extrabold text-slate-800 text-sm">{student.name}</span>
                            </td>
                            <td className="p-4 text-slate-400 font-semibold">{student.email}</td>
                            <td className="p-4">
                              <Badge className="bg-[#312455]/5 text-[#312455] border-none text-[9px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full">
                                {student.course}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-3 max-w-[130px] mx-auto">
                                <span className="font-bold text-[#312455] w-8 text-right">{student.progress}%</span>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-[#312455] to-[#8a66a8] rounded-full"
                                    style={{ width: `${student.progress}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`text-[9px] font-bold uppercase tracking-wider py-1 px-3 rounded-full border ${
                                student.status === 'Concluído'
                                  ? 'bg-green-50 text-green-600 border-green-500/20'
                                  : 'bg-amber-50 text-amber-600 border-amber-500/20'
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

            {/* D4. EXPLORE COURSES TAB */}
            {activeTab === 'explore' && (
              <motion.div
                key="explore-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#312455]">Catálogo de Formações</h2>
                    <p className="text-xs text-slate-500">Descubra novos programas e expanda as suas competências profissionais.</p>
                  </div>
                  <Badge className="bg-[#8a66a8]/10 text-[#8a66a8] border-none font-bold text-xs py-1.5 px-4 rounded-full self-start md:self-auto">
                    {exploreCourses.length} Formações Disponíveis
                  </Badge>
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Pesquisar formações..."
                      value={exploreSearch}
                      onChange={(e) => setExploreSearch(e.target.value)}
                      className="pl-10 rounded-2xl h-11 text-sm border-slate-200 bg-white shadow-sm focus-visible:ring-[#8a66a8]"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {EXPLORE_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setExploreCategory(cat)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border ${
                          exploreCategory === cat
                            ? 'bg-[#312455] text-white border-[#312455] shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#8a66a8] hover:text-[#8a66a8]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Course Grid */}
                {filteredExploreCourses.length === 0 ? (
                  <div className="text-center py-16">
                    <Compass className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold text-sm">Nenhuma formação encontrada</p>
                    <p className="text-slate-400 text-xs mt-1">Tente outro termo de pesquisa ou categoria</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredExploreCourses.map((course) => {
                      const isEnrolled = enrolledCourses.includes(course.id)
                      return (
                        <motion.div
                          key={course.id}
                          layout
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Card className="overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl bg-white flex flex-col group h-full">
                            <div className="relative h-40 w-full overflow-hidden">
                              <Image
                                src={course.image}
                                alt={course.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <Badge className="bg-[#8a66a8] text-white border-none uppercase text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                                  {course.category}
                                </Badge>
                                <Badge className={`border-none text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                                  course.modality === 'Online' ? 'bg-emerald-500/90 text-white' :
                                  course.modality === 'Presencial' ? 'bg-white/90 text-[#312455]' :
                                  'bg-amber-400/90 text-white'
                                }`}>
                                  {course.modality}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="flex flex-col flex-1 p-5 space-y-3">
                              <div>
                                <h3 className="font-black text-[#312455] text-sm leading-snug">{course.name}</h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{course.description}</p>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />{course.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{course.rating}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />{course.enrolled.toLocaleString('pt-AO')} inscritos
                                </span>
                              </div>
                              <Button
                                onClick={() => handleEnroll(course.id, course.name)}
                                className={`w-full rounded-2xl h-10 font-bold text-xs mt-auto transition-all duration-300 cursor-pointer ${
                                  isEnrolled
                                    ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                                    : 'bg-[#312455] hover:bg-[#8a66a8] text-white shadow-sm'
                                }`}
                              >
                                {isEnrolled ? (
                                  <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Inscrito</>
                                ) : (
                                  <><Zap className="mr-1.5 h-3.5 w-3.5" />Inscrever-me</>
                                )}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* D5. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-2xl"
              >
                <div>
                  <h2 className="text-xl font-black text-[#312455]">Definições da Conta</h2>
                  <p className="text-xs text-slate-500">Gerencie as suas informações pessoais e segurança da conta.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Profile Section */}
                  <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="pb-4 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#312455]/5 flex items-center justify-center">
                          <UserCircle className="h-5 w-5 text-[#312455]" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-black text-[#312455]">Informações do Perfil</CardTitle>
                          <CardDescription className="text-[10px] text-slate-400">Atualize os seus dados pessoais</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                      {/* Avatar preview */}
                      <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#312455] to-[#8a66a8] flex items-center justify-center text-white text-xl font-black shadow-md">
                          {settingsName.charAt(0).toUpperCase() || user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#312455]">{settingsName || user.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                            {isInstructor ? 'Instrutor' : 'Estudante'} · Prime Academy
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-[#8a66a8]" />Nome Completo
                          </Label>
                          <Input
                            value={settingsName}
                            onChange={(e) => setSettingsName(e.target.value)}
                            placeholder="O seu nome completo"
                            className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-[#8a66a8]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-[#8a66a8]" />Endereço de E-mail
                          </Label>
                          <Input
                            value={user.email || ''}
                            disabled
                            className="rounded-xl h-10 text-sm border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5 text-[#8a66a8]" />Tipo de Conta
                          </Label>
                          <Input
                            value={isInstructor ? 'Instrutor / Docente' : 'Estudante / Formando'}
                            disabled
                            className="rounded-xl h-10 text-sm border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-[#8a66a8]" />Idioma
                          </Label>
                          <select
                            className="w-full h-10 rounded-xl border border-slate-200 bg-white text-sm text-[#312455] px-3 focus:outline-none focus:ring-2 focus:ring-[#8a66a8] transition-all"
                            defaultValue="pt-AO"
                          >
                            <option value="pt-AO">Português (Angola)</option>
                            <option value="pt-PT">Português (Portugal)</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Section */}
                  <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="pb-4 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#8a66a8]/5 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-[#8a66a8]" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-black text-[#312455]">Segurança da Conta</CardTitle>
                          <CardDescription className="text-[10px] text-slate-400">Altere a sua senha de acesso</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Senha Atual</Label>
                        <div className="relative">
                          <Input
                            type={showCurrentPw ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-[#8a66a8] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPw(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#8a66a8] transition-colors"
                          >
                            {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Nova Senha</Label>
                          <div className="relative">
                            <Input
                              type={showNewPw ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Mínimo 6 caracteres"
                              className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-[#8a66a8] pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPw(v => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#8a66a8] transition-colors"
                            >
                              {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Confirmar Nova Senha</Label>
                          <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repita a nova senha"
                            className={`rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-[#8a66a8] ${
                              confirmPassword && confirmPassword !== newPassword ? 'border-red-300 focus-visible:ring-red-400' : ''
                            }`}
                          />
                          {confirmPassword && confirmPassword !== newPassword && (
                            <p className="text-[10px] text-red-500 font-semibold">As senhas não coincidem</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setSettingsName(user.name)
                        setCurrentPassword('')
                        setNewPassword('')
                        setConfirmPassword('')
                      }}
                      className="rounded-2xl h-11 px-6 text-sm font-bold text-slate-500 hover:bg-slate-100"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-2xl h-11 px-8 text-sm font-bold shadow-md cursor-pointer transition-all duration-300"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Guardar Alterações
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
      
    </div>
  )
}
