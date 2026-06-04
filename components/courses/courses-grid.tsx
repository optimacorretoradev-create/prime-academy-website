'use client'

import { useState } from 'react'
import { SafeImage } from '@/components/ui/safe-image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, Play, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Course } from '@/lib/hygraph'
import { getTrainerForCourse } from '@/lib/course-trainers'
import { getCoursePriceDisplay } from '@/lib/format-price'
import { PreEnrollmentModal } from './pre-enrollment-modal'

interface CoursesGridProps {
  courses: Course[]
  categories: string[]
}

/**
 * Normaliza uma string para comparação robusta:
 * remove acentos (NFD), colapsa espaços e converte para minúsculas.
 * Garante que "GESTÃO ADMINISTRATIVA DIGITAL" == "gestao administrativa digital"
 * mesmo que o CMS grave sem acento ou com espaços extra.
 */
const normalizeStr = (str: string): string =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas (acentos)
    .trim()
    .replace(/\s+/g, '')             // Colapsa todos os espaços em branco

export function CoursesGrid({ courses, categories }: CoursesGridProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  // activeFilter default 'TODOS' — matches the first entry in OFFICIAL_CATEGORIES
  const [activeFilter, setActiveFilter] = useState(categoryParam || 'TODOS')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null)

  useEffect(() => {
    if (categoryParam) {
      setActiveFilter(categoryParam)
    }
  }, [categoryParam])

  const openPreEnrollment = (course: Course) => {
    setSelectedCourseForModal(course)
    setIsModalOpen(true)
  }

  const getTrainerInfo = (courseId: string, coursePrice: string) => {
    const trainer = getTrainerForCourse(courseId)
    return {
      name: trainer.name,
      avatar: trainer.avatar,
      price: getCoursePriceDisplay(courseId, coursePrice),
    }
  }

  const filteredCourses = courses.filter((course) => {
    // Normalização avançada: ignora acentos, espaços e capitalização em ambos os lados
    const matchesCategory =
      activeFilter === 'TODOS' ||
      normalizeStr(course.category) === normalizeStr(activeFilter)
    const matchesType =
      selectedType === 'Todos' ||
      (selectedType === 'online' && course.online) ||
      (selectedType === 'presencial' && !course.online)
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesType && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO (Restaurado para cor original, com barra de pesquisa glassmorphic integrada) ── */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-[#312455]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#312455]/95 via-[#312455]/90 to-[#312455]/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a66a8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#8a66a8]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Nossos Cursos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/90 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-10 text-pretty"
          >
            Descubra a formação ideal para impulsionar a sua carreira. Oferecemos cursos práticos
            com certificação reconhecida pelo mercado angolano.
          </motion.p>

          {/* Barra de pesquisa Glassmorphic integrada na Hero - REMOVIDA conforme solicitado */}
        </div>
      </section>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="container mx-auto px-4 max-w-screen-xl pb-20">

        {/* Título da secção + underline */}
        <div className="text-center pt-15 mb-16 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#312455] uppercase tracking-wider mb-2">
            Os Nossos Cursos
          </h2>
          <div className="w-14 h-1 bg-[#8a66a8] rounded-full" />
        </div>

        {/* Filtros por categoria (tabs pílula) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm ${
                activeFilter.trim().toUpperCase() === category.trim().toUpperCase()
                  ? 'bg-[#8a66a8] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid – 1 col mobile / 2 md / 3 lg / 4 xl — preenche todo o espaço horizontal */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, index) => {
              const trainer = getTrainerInfo(course.id, course.price)
              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="flex"
                >
                  <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(138,102,168,0.12)] transition-all duration-500 flex flex-col group w-full">

                    {/* Imagem de capa */}
                    <div className="relative h-44 overflow-hidden bg-slate-200">
                      <SafeImage
                        src={course.image}
                        alt={course.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Preço */}
                    <div className="px-4 pt-4 pb-3 flex items-center justify-end border-b border-slate-100">
                      <span className="text-sm font-black text-[#8a66a8]">
                        {trainer.price}
                      </span>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <div>
                        <h3 className="text-sm font-black text-[#312455] leading-snug mb-1.5 group-hover:text-[#8a66a8] transition-colors duration-200 line-clamp-2">
                          {course.name}
                        </h3>
                        <p className="text-slate-500 text-xs font-light leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Metadados */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium mt-auto">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8a66a8]" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-[#312455]" />
                          {course.lessons} Aulas
                        </span>
                        <span className="bg-[#8a66a8]/8 text-[#8a66a8] font-bold px-2 py-0.5 rounded-md text-[10px]">
                          {course.level}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="px-4 pb-4 flex gap-2">
                      <Button asChild variant="outline" className="w-1/2 rounded-xl h-10 text-xs font-bold border-slate-200 text-slate-600 hover:border-[#312455] hover:text-[#312455] hover:bg-transparent cursor-pointer transition-colors duration-300">
                        <Link href={`/courses/${course.id}`}>
                          Saber Mais
                        </Link>
                      </Button>
                      <Button 
                        onClick={() => openPreEnrollment(course)}
                        className="w-1/2 bg-[#312455] hover:bg-[#8a66a8] text-white rounded-xl h-10 text-xs font-bold shadow-md cursor-pointer transition-all duration-300"
                      >
                        Pré-inscrição
                      </Button>
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>

        {/* Estado vazio */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-lg mx-auto"
          >
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhum curso encontrado</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto font-light leading-relaxed">
              Não encontrámos nenhum curso correspondente aos seus filtros. Tente termos mais genéricos.
            </p>
          </motion.div>
        )}

      </div>

      <PreEnrollmentModal 
        course={selectedCourseForModal} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
