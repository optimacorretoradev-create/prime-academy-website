'use client'

import { useEffect, useState, Fragment, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Clock, Award, ArrowRight, Play, User, LogOut, 
  Download, Upload, Plus, CheckCircle2, Globe, Users, FileText, 
  ChevronRight, ShieldCheck, Menu, X, Bell, Calendar, Search, 
  BookOpenCheck, LayoutDashboard, Settings, Compass, Eye, EyeOff,
  Lock, UserCircle, Mail, Tag, Star, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { getCourses, type Course } from '@/lib/hygraph'

// Active programs in "Meus Cursos" — catalogId links to Hygraph when listed in Explorar
const defaultCourses: ActiveProgram[] = [
  {
    id: '1',
    catalogId: '1',
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
    catalogId: '2',
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

function isAttendingCatalogCourse(
  course: Course,
  activePrograms: ActiveProgram[],
  enrolledIds: string[]
): { attending: boolean; label: 'A Frequentar' | 'Em Formação' } {
  const activeMatch = activePrograms.find(
    p => p.catalogId === course.id || p.name === course.name
  )
  if (activeMatch) {
    return {
      attending: true,
      label: activeMatch.progress > 0 ? 'Em Formação' : 'A Frequentar',
    }
  }
  if (enrolledIds.includes(course.id)) {
    return { attending: true, label: 'A Frequentar' }
  }
  return { attending: false, label: 'A Frequentar' }
}

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

interface ActiveProgram {
  id: string
  name: string
  description: string
  image: string
  progress: number
  totalLessons: number
  completedLessons: number
  category: string
  online: boolean
  /** Hygraph catalog id when this program exists in the public course list */
  catalogId?: string
}

function CourseSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
          style={{ animation: 'shimmer 1.5s infinite' }}
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="relative h-4 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ animation: 'shimmer 1.5s infinite' }}
          />
        </div>
        <div className="relative h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ animation: 'shimmer 1.5s infinite 0.15s' }}
          />
        </div>
        <div className="relative h-3 w-5/6 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ animation: 'shimmer 1.5s infinite 0.3s' }}
          />
        </div>
        <div className="flex gap-3 pt-1">
          <div className="relative h-3 w-14 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
              style={{ animation: 'shimmer 1.5s infinite' }}
            />
          </div>
          <div className="relative h-3 w-10 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
              style={{ animation: 'shimmer 1.5s infinite 0.1s' }}
            />
          </div>
        </div>
        <div className="relative h-10 rounded-2xl bg-slate-100 overflow-hidden mt-2">
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ animation: 'shimmer 1.5s infinite 0.2s' }}
          />
        </div>
      </div>
    </div>
  )
}

const DASHBOARD_TABS = ['courses', 'pdfs', 'students', 'explore', 'settings'] as const
type DashboardTab = (typeof DASHBOARD_TABS)[number]

function isDashboardTab(value: string | null): value is DashboardTab {
  return value !== null && (DASHBOARD_TABS as readonly string[]).includes(value)
}

function DashboardPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading, logout } = useAuth()
  
  const [activeTab, setActiveTab] = useState<DashboardTab>('courses')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Nova publicação de material',
      description: 'O Prof. Marcos adicionou "Guia de Atalhos Excel Avançado" na sua biblioteca.',
      time: 'Há 5 min',
      read: false,
    },
    {
      id: 'n2',
      title: 'Inscrição confirmada!',
      description: 'A sua inscrição no curso "Gestão de Projectos" foi efetuada com sucesso.',
      time: 'Há 1 hora',
      read: false,
    },
    {
      id: 'n3',
      title: 'Certificado de Excel disponível',
      description: 'O seu certificado oficial homologado de Excel Avançado já está pronto para download.',
      time: 'Há 2 dias',
      read: true,
    }
  ])
  
  // User profile extensions state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')

  // Loading states
  const [isTabChanging, setIsTabChanging] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)

  // Load avatar and overridden display name on user load
  useEffect(() => {
    if (user) {
      const savedAvatar = localStorage.getItem(`prime_academy_avatar_${user.email}`)
      if (savedAvatar) {
        setAvatarUrl(savedAvatar)
      }
      const savedName = localStorage.getItem(`prime_academy_username_${user.email}`)
      setDisplayName(savedName || user.name)
      setSettingsName(savedName || user.name) // Initialize settingsName in form
    }
  }, [user])

  const handleTabChange = (tabId: DashboardTab) => {
    if (tabId === activeTab) return
    setIsTabChanging(true)
    const href = tabId === 'courses' ? '/dashboard' : `/dashboard?tab=${tabId}`
    router.replace(href, { scroll: false })
    setTimeout(() => {
      setActiveTab(tabId)
      setIsTabChanging(false)
    }, 450)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 2MB.')
        return
      }
      setIsUploadingAvatar(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setTimeout(() => {
          setAvatarUrl(base64)
          if (user?.email) {
            localStorage.setItem(`prime_academy_avatar_${user.email}`, base64)
            toast.success('Foto de perfil atualizada!')
          }
          setIsUploadingAvatar(false)
        }, 900)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setIsRemovingAvatar(true)
    setTimeout(() => {
      setAvatarUrl(null)
      if (user?.email) {
        localStorage.removeItem(`prime_academy_avatar_${user.email}`)
        toast.success('Foto de perfil removida.')
      }
      setIsRemovingAvatar(false)
    }, 700)
  }
  
  // PDF Materials state
  const [pdfMaterials, setPdfMaterials] = useState<PDFMaterial[]>([])
  
  // Form state for PDF upload
  const [newPdfTitle, setNewPdfTitle] = useState('')
  const [newPdfDesc, setNewPdfDesc] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('1')
  const [newPdfFileName, setNewPdfFileName] = useState('')

  // Explore tab state
  const [exploreCourses, setExploreCourses] = useState<Course[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null)
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null)
  const [exploreSearch, setExploreSearch] = useState('')
  const [exploreCategory, setExploreCategory] = useState('Todos')
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])

  // Load explore courses on mount
  useEffect(() => {
    async function loadCourses() {
      try {
        const courses = await getCourses()
        setExploreCourses(courses)
      } catch (err) {
        console.error('Error fetching courses:', err)
      }
    }
    loadCourses()
  }, [])

  // Load enrolled courses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('prime_academy_enrolled_courses')
    if (saved) {
      try {
        setEnrolledCourses(JSON.parse(saved))
      } catch (err) {
        console.error('Error loading enrolled courses:', err)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (searchTimer) clearTimeout(searchTimer)
    }
  }, [searchTimer])

  // Settings tab state
  const [settingsName, setSettingsName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (isDashboardTab(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

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
    if (displayName) setSettingsName(displayName)
    else if (user?.name) setSettingsName(user.name)
  }, [user, displayName])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
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
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      router.push('/')
    }, 900)
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

  // Handle save settings — always works (localStorage-first), Supabase in background
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

    setIsSavingSettings(true)

    setTimeout(() => {
      // 1. Save to localStorage
      if (settingsName && settingsName.trim()) {
        localStorage.setItem(`prime_academy_username_${user.email}`, settingsName.trim())
        setDisplayName(settingsName.trim())
      }
      if (newPassword) {
        localStorage.setItem(`prime_academy_password_${user.email}`, newPassword)
      }

      // 2. Show success toast and reset form
      toast.success('Definições guardadas com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setIsSavingSettings(false)
      
      // 3. Sync to Supabase in background
      const syncToSupabase = async () => {
        try {
          const { supabase } = await import('@/lib/supabase')
          const { data: sessionData } = await supabase.auth.getSession()
          const session = sessionData?.session
          if (!session) return

          if (settingsName && settingsName.trim() && settingsName.trim() !== user.name) {
            await supabase.from('perfis').update({ nome: settingsName.trim() }).eq('id', session.user.id)
            await supabase.auth.updateUser({ data: { name: settingsName.trim() } })
          }

          if (newPassword) {
            await supabase.auth.updateUser({ password: newPassword })
          }
        } catch {
          // Silent background sync failure
        }
      }
      syncToSupabase()
    }, 850)
  }

  const isInstructor = user.role === 'instrutor'

  // Dynamic categories from loaded courses
  const exploreCategories = ['Todos', ...Array.from(new Set(exploreCourses.map(c => c.category)))]

  // Handle search — spinner nos resultados (debounce 400ms)
  const handleExploreSearchChange = (value: string) => {
    setExploreSearch(value)
    if (searchTimer) clearTimeout(searchTimer)
    if (!value.trim()) {
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const timer = setTimeout(() => setIsSearching(false), 400)
    setSearchTimer(timer)
  }

  // Handle category filter with brief loading shimmer
  const handleExploreCategoryChange = (cat: string) => {
    if (cat === exploreCategory) return
    setLoadingCategory(cat)
    setIsFiltering(true)
    setTimeout(() => {
      setExploreCategory(cat)
      setIsFiltering(false)
      setLoadingCategory(null)
    }, 500)
  }

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
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800">
      
      {/* Hidden file input for avatar uploading */}
      <input 
        type="file" 
        id="sidebar-avatar-upload" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarChange} 
      />

      {/* 1. SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#312455] text-white fixed h-screen z-30 shadow-none border-none rounded-r-[2.5rem]">
        {/* Profile/Avatar Premium Header */}
        <div className="pt-8 pb-6 px-6 border-b border-white/10 flex flex-col items-center text-center">
          {/* Avatar Ring with subtle glow */}
          <div 
            onClick={() => document.getElementById('sidebar-avatar-upload')?.click()}
            className="relative mb-3 group cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8a66a8] to-white/40 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-20 h-20 rounded-full p-1 bg-white/10 ring-2 ring-white/20 ring-offset-2 ring-offset-[#312455] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} className="w-full h-full rounded-full object-cover shadow-inner" alt="Avatar" />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8a66a8] to-[#4a347c] flex items-center justify-center text-xl font-black text-white shadow-inner">
                  {(displayName || user.name).split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              {/* Premium Upload Overlay */}
              <div className="absolute inset-1 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-[9px] font-extrabold gap-0.5">
                <Upload className="h-3.5 w-3.5" />
                <span>Alterar</span>
              </div>
            </div>
          </div>
          {/* Name & Email */}
          <h2 className="font-extrabold text-sm tracking-tight text-white line-clamp-1">{displayName || user.name}</h2>
          <p className="text-[10px] text-white/50 font-semibold truncate max-w-full mt-0.5">{user.email}</p>
          <Badge className="mt-2 bg-[#8a66a8]/20 hover:bg-[#8a66a8]/35 text-[#c1a7d6] border border-[#8a66a8]/30 uppercase text-[8px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full">
            {isInstructor ? 'Instrutor' : 'Estudante'}
          </Badge>
        </div>

        <nav className="flex-1 pl-4 pr-0 py-6 space-y-1 lg:overflow-visible overflow-y-auto">
          <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
            Área de Formação
          </div>
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = activeTab === link.id
            const isSettings = link.id === 'settings'
            return (
              <Fragment key={link.id}>
                {isSettings && <div className="h-px bg-white/10 my-3 mr-4 ml-3" />}
                <button
                  onClick={() => handleTabChange(link.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-l-[2rem] rounded-r-none text-sm font-semibold transition-all duration-300 w-full relative ${
                    isActive 
                      ? 'bg-[#f8fafc] text-[#312455] z-10 shadow-sm' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-[#312455]' : 'text-white/60'}`} />
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <>
                      {/* Top scoop (pontinha superior) */}
                      <div className="absolute bottom-full right-0 w-8 h-8 bg-[#f8fafc] pointer-events-none translate-y-[1px]">
                        <div className="w-full h-full bg-[#312455] rounded-br-[2rem]" />
                      </div>
                      {/* Bottom scoop (pontinha inferior) */}
                      <div className="absolute top-full right-0 w-8 h-8 bg-[#f8fafc] pointer-events-none -translate-y-[1px]">
                        <div className="w-full h-full bg-[#312455] rounded-tr-[2rem]" />
                      </div>
                    </>
                  )}
                </button>
              </Fragment>
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
                <div 
                  onClick={() => {
                    document.getElementById('sidebar-avatar-upload')?.click()
                  }}
                  className="relative mb-3 group cursor-pointer"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8a66a8] to-white/40 blur-sm opacity-70" />
                  <div className="relative w-20 h-20 rounded-full p-1 bg-white/10 ring-2 ring-white/20 ring-offset-2 ring-offset-[#312455] flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} className="w-full h-full rounded-full object-cover shadow-inner" alt="Avatar" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8a66a8] to-[#4a347c] flex items-center justify-center text-xl font-black text-white shadow-inner">
                        {(displayName || user.name).split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    {/* Premium Upload Overlay */}
                    <div className="absolute inset-1 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-[9px] font-extrabold gap-0.5">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Alterar</span>
                    </div>
                  </div>
                </div>
                {/* Name & Email */}
                <h2 className="font-extrabold text-sm tracking-tight text-white line-clamp-1">{displayName || user.name}</h2>
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
                  const isSettings = link.id === 'settings'
                  return (
                    <Fragment key={link.id}>
                      {isSettings && <div className="h-px bg-white/10 my-3 mr-4 ml-3" />}
                      <button
                        onClick={() => {
                          handleTabChange(link.id)
                          setSidebarOpen(false)
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-l-[2rem] rounded-r-none text-sm font-semibold transition-all duration-300 w-full relative ${
                          isActive 
                            ? 'bg-[#f8fafc] text-[#312455] z-10 shadow-sm' 
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-[#312455]' : 'text-white/60'}`} />
                        <span className="relative z-10">{link.label}</span>
                        {isActive && (
                          <>
                            {/* Top scoop (pontinha superior) */}
                            <div className="absolute bottom-full right-0 w-8 h-8 bg-[#f8fafc] pointer-events-none translate-y-[1px]">
                              <div className="w-full h-full bg-[#312455] rounded-br-[2rem]" />
                            </div>
                            {/* Bottom scoop (pontinha inferior) */}
                            <div className="absolute top-full right-0 w-8 h-8 bg-[#f8fafc] pointer-events-none -translate-y-[1px]">
                              <div className="w-full h-full bg-[#312455] rounded-tr-[2rem]" />
                            </div>
                          </>
                        )}
                      </button>
                    </Fragment>
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
          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative text-slate-500 hover:text-[#312455] hover:bg-slate-100 rounded-full transition-all ${
                  showNotifications ? 'bg-slate-100 text-[#312455]' : ''
                }`}
                title="Notificações"
              >
                <Bell className="h-5 w-5" />
                <AnimatePresence>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 ring-2 ring-white leading-none shadow-sm shadow-red-950/20"
                    >
                      {notifications.filter(n => !n.read).length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              {/* Elegant Notifications Popup */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Backdrop overlay for closing */}
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setShowNotifications(false)}
                    />
                    
                    {/* Popup Container */}
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-100 rounded-[2rem] shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 bg-[#312455] text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-[#c1a7d6]" />
                          <h3 className="font-extrabold text-xs tracking-tight">Notificações</h3>
                        </div>
                        <span className="bg-white/20 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          {notifications.filter(n => !n.read).length} Novas
                        </span>
                      </div>
                      
                      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            Sem notificações de momento.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              onClick={() => {
                                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))
                              }}
                              className={`p-4 text-left transition-colors duration-200 cursor-pointer hover:bg-slate-50 flex gap-3 ${
                                !notif.read ? 'bg-[#f8fafc]/40' : ''
                              }`}
                            >
                              <div className="mt-0.5">
                                <div className={`w-2 h-2 rounded-full ${!notif.read ? 'bg-[#8a66a8]' : 'bg-transparent'}`} />
                              </div>
                              <div className="flex-1 space-y-0.5">
                                <p className="font-black text-xs text-[#312455]">{notif.title}</p>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{notif.description}</p>
                                <span className="text-[9px] text-[#8a66a8] font-bold block pt-1">{notif.time}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {notifications.some(n => !n.read) && (
                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                          <button 
                            onClick={() => {
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                              toast.success('Todas as notificações foram marcadas como lidas!')
                            }}
                            className="text-[10px] font-extrabold text-[#312455] hover:text-[#8a66a8] uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Marcar todas como lidas
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div 
              onClick={() => handleTabChange('settings')}
              className="h-9 w-9 rounded-full bg-[#312455] text-white flex items-center justify-center text-xs font-bold border border-slate-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-[#8a66a8] transition-all overflow-hidden"
              title="Ir para Definições"
            >
              {avatarUrl ? (
                <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
              ) : (
                (displayName || user.name).charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">

        {/* A. Dynamic Banner */}
          {activeTab === 'courses' && (
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
                    {isInstructor ? `Olá, Prof. ${(displayName || user.name).split(' ')[0]}!` : `Olá, Aluno ${(displayName || user.name).split(' ')[0]}!`}
                  </h1>
                  <p className="text-white/70 text-sm max-w-xl">
                    {isInstructor 
                      ? 'Bem-vindo ao seu painel docente. Aqui pode gerir os seus materiais de apoio e acompanhar o progresso pedagógico de cada aluno.'
                      : 'Pronto para expandir o seu conhecimento hoje? Continue o seu percurso de aprendizagem de onde parou.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* C. Interactive Statistics Row */}
          {activeTab === 'courses' && (
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
          )}

          {/* D. Tab Content Panel */}
          <AnimatePresence mode="wait">
            {isTabChanging && (
              <motion.div
                key="tab-loader"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full bg-white/60 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center min-h-[400px] text-center shadow-lg shadow-purple-950/5"
              >
                <div className="relative mb-6">
                  {/* Outer glowing pulsing orb */}
                  <div className="absolute inset-0 rounded-full bg-[#8a66a8]/20 blur-md animate-pulse" />
                  {/* Premium Spinner */}
                  <div className="relative w-14 h-14 rounded-full border-[3px] border-slate-100 border-t-[#8a66a8] border-r-[#312455] animate-spin" />
                </div>
                <h3 className="text-base font-extrabold text-[#312455] tracking-tight">A carregar conteúdo...</h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
                  A preparar a sua área de aprendizagem personalizada
                </p>
              </motion.div>
            )}
            
            {/* D1. COURSES TAB */}
            {!isTabChanging && activeTab === 'courses' && (
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
                      onClick={() => handleTabChange('explore')}
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
            {!isTabChanging && activeTab === 'pdfs' && (
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
            {!isTabChanging && isInstructor && activeTab === 'students' && (
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
            {!isTabChanging && activeTab === 'explore' && (
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
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      placeholder="Pesquisar formações..."
                      value={exploreSearch}
                      onChange={(e) => handleExploreSearchChange(e.target.value)}
                      className="pl-10 rounded-2xl h-11 text-sm border-slate-200 bg-white shadow-sm focus-visible:ring-[#8a66a8] transition-all duration-200"
                    />
                  </div>
                  {/* Category filter buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {exploreCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleExploreCategoryChange(cat)}
                        disabled={isFiltering}
                        className={`relative px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border flex items-center gap-1.5 ${
                          (exploreCategory === cat || loadingCategory === cat)
                            ? 'bg-[#312455] text-white border-[#312455] shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#8a66a8] hover:text-[#8a66a8]'
                        } disabled:opacity-80 disabled:cursor-default`}
                      >
                        {loadingCategory === cat ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : null}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resultados — spinner na pesquisa, skeletons no filtro */}
                {isSearching ? (
                  <motion.div
                    key="search-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center py-24 min-h-[360px] rounded-[2.5rem] bg-white/60 border border-slate-100 shadow-sm"
                  >
                    <div className="relative mb-5">
                      <div className="absolute inset-0 rounded-full bg-[#8a66a8]/20 blur-md animate-pulse" />
                      <Loader2 className="relative h-12 w-12 text-[#8a66a8] animate-spin" />
                    </div>
                    <p className="text-sm font-extrabold text-[#312455] tracking-tight">A pesquisar formações...</p>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">A filtrar o catálogo com o seu termo</p>
                  </motion.div>
                ) : isFiltering ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CourseSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredExploreCourses.length === 0 && exploreCourses.length === 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CourseSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredExploreCourses.length === 0 ? (
                  <div className="text-center py-16">
                    <Compass className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold text-sm">Nenhuma formação encontrada</p>
                    <p className="text-slate-400 text-xs mt-1">Tente outro termo de pesquisa ou categoria</p>
                  </div>
                ) : (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                    {filteredExploreCourses.map((course) => {
                      const { attending: isAttending, label: attendanceLabel } =
                        isAttendingCatalogCourse(course, defaultCourses, enrolledCourses)
                      return (
                        <motion.div
                          key={course.id}
                          layout
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
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
                                  course.online ? 'bg-emerald-500/90 text-white' : 'bg-white/90 text-[#312455]'
                                }`}>
                                  {course.online ? 'Online' : 'Presencial'}
                                </Badge>
                              </div>
                              {/* "A Frequentar" ribbon for active courses */}
                              {isAttending && (
                                <div className="absolute top-3 right-3">
                                  <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                    {attendanceLabel}
                                  </span>
                                </div>
                              )}
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
                                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{course.rating.toFixed(1)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />{course.lessons} aulas
                                </span>
                              </div>
                              {isAttending ? (
                                <div className="w-full rounded-2xl h-10 font-black text-xs mt-auto flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  {attendanceLabel}
                                </div>
                              ) : (
                                <Button
                                  asChild
                                  className="w-full rounded-2xl h-10 font-bold text-xs mt-auto bg-[#312455] hover:bg-[#8a66a8] text-white shadow-sm transition-all duration-300 cursor-pointer"
                                >
                                  <Link href={`/dashboard/courses/${course.id}`}>
                                    <Play className="mr-1.5 h-3.5 w-3.5 fill-white" />
                                    Saber Mais
                                  </Link>
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* D5. SETTINGS TAB */}
            {!isTabChanging && activeTab === 'settings' && (
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
                      {/* Avatar premium interactive preview */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#312455] to-[#8a66a8] flex items-center justify-center text-white text-xl font-black shadow-md overflow-hidden border-2 border-white ring-4 ring-[#312455]/5">
                            {avatarUrl ? (
                              <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                            ) : (
                              (settingsName || user.name).charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#312455]">{settingsName || user.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                              {isInstructor ? 'Instrutor / Docente' : 'Estudante / Formando'} · Prime Academy
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            onClick={() => document.getElementById('sidebar-avatar-upload')?.click()}
                            className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-xl h-9 px-4 text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isUploadingAvatar || isRemovingAvatar}
                          >
                            {isUploadingAvatar ? (
                              <>
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                A carregar...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-1.5 h-3.5 w-3.5" />
                                Carregar Foto
                              </>
                            )}
                          </Button>
                          {avatarUrl && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={handleRemoveAvatar}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 px-4 text-xs font-bold transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                              disabled={isUploadingAvatar || isRemovingAvatar}
                            >
                              {isRemovingAvatar ? (
                                <>
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-red-500" />
                                  A remover...
                                </>
                              ) : (
                                'Remover'
                              )}
                            </Button>
                          )}
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
                      disabled={isSavingSettings}
                      className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-2xl h-11 px-8 text-sm font-bold shadow-md cursor-pointer transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSavingSettings ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          A guardar...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Guardar Alterações
                        </>
                      )}
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

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#312455]" />
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  )
}
