'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, Play, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Course } from '@/lib/hygraph'

interface CoursesGridProps {
  courses: Course[]
  categories: string[]
}

export function CoursesGrid({ courses, categories }: CoursesGridProps) {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Todos')

  const getTrainerInfo = (courseId: string) => {
    const trainersList = [
      { name: "Dr. António Banza", avatar: "/images/trainers/trainer4.png", price: "Kz 45.000" },
      { name: "Dra. Isabel Santos", avatar: "/images/trainers/trainer2.png", price: "Kz 35.000" },
      { name: "Dr. Francisco Manuel", avatar: "/images/trainers/trainer5.png", price: "Kz 40.000" },
      { name: "Dra. Maria Antónia", avatar: "/images/trainers/trainer1.png", price: "Kz 55.000" },
      { name: "Dra. Patrícia Costa", avatar: "/images/trainers/trainer6.png", price: "Grátis" },
      { name: "Dra. Ana Paula Silva", avatar: "/images/trainers/trainer3.png", price: "Kz 50.000" },
      { name: "Dr. Manuel Santos", avatar: "/images/trainers/trainer7.png", price: "Kz 60.000" },
      { name: "Dr. Carlos Mendes", avatar: "/images/trainers/trainer8.png", price: "Kz 42.000" },
    ]
    const index = (parseInt(courseId) - 1) % trainersList.length
    return trainersList[index >= 0 ? index : 0]
  }

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory
    const matchesType =
      selectedType === 'Todos' ||
      (selectedType === 'online' && course.online) ||
      (selectedType === 'presencial' && !course.online)
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesType && matchesSearch
  })

  const featuredCourse = courses.find((c) => c.id === '5') || courses[0]
  const featuredTrainer = featuredCourse ? getTrainerInfo(featuredCourse.id) : null

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

          {/* Barra de pesquisa Glassmorphic integrada na Hero */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/[0.06] backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.25)] w-full max-w-4xl mx-auto text-left"
          >
            <div className="flex items-center gap-2 flex-1 w-full px-4 py-1.5">
              <Search className="h-4 w-4 text-[#8a66a8] shrink-0" />
              <input
                type="text"
                placeholder="Pesquisar por palavra-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full text-sm font-medium focus:ring-0"
              />
            </div>

            <div className="hidden md:block h-6 w-px bg-white/10" />
            <div className="w-full md:w-auto px-4 py-1.5">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent border-none outline-none text-white/95 font-semibold text-sm w-full md:w-48 cursor-pointer focus:ring-0 py-1"
              >
                <option value="Todos" className="bg-[#312455] text-white">Todas as Categorias</option>
                {categories.filter((c) => c !== 'Todos').map((cat) => (
                  <option key={cat} value={cat} className="bg-[#312455] text-white">{cat}</option>
                ))}
              </select>
            </div>

            <div className="hidden md:block h-6 w-px bg-white/10" />
            <div className="w-full md:w-auto px-4 py-1.5">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent border-none outline-none text-white/95 font-semibold text-sm w-full md:w-40 cursor-pointer focus:ring-0 py-1"
              >
                <option value="Todos" className="bg-[#312455] text-white">Todos Formatos</option>
                <option value="online" className="bg-[#312455] text-white">Online</option>
                <option value="presencial" className="bg-[#312455] text-white">Presencial</option>
              </select>
            </div>

            <button className="w-full md:w-auto bg-[#8a66a8] hover:bg-[#a882c5] text-white font-bold text-xs tracking-widest uppercase px-8 py-3.5 rounded-xl md:rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(138,102,168,0.2)] shrink-0 cursor-pointer">
              Pesquisar
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="container mx-auto px-4 max-w-screen-xl pb-20">

        {/* Título da secção + underline */}
        <div className="text-center mb-8 flex flex-col items-center">
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
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm ${
                activeCategory === category
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
              const trainer = getTrainerInfo(course.id)
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
                      <Image
                        src={course.image}
                        alt={course.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute top-3 left-3 bg-white/95 text-slate-800 font-bold text-[10px] tracking-wide uppercase py-1 px-2.5 rounded-full shadow-sm">
                        {course.category}
                      </span>
                      <span className="absolute top-3 right-3 bg-[#8a66a8] text-white font-bold text-[10px] tracking-wide uppercase py-1 px-2.5 rounded-full shadow-sm">
                        {course.online ? 'Online' : 'Presencial'}
                      </span>
                    </div>

                    {/* Formador + Preço */}
                    <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <img
                          src={trainer.avatar}
                          alt={trainer.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <span className="text-xs font-bold text-slate-700 leading-tight line-clamp-1">
                          {trainer.name}
                        </span>
                      </div>
                      <span className="text-sm font-black text-[#8a66a8] shrink-0 ml-2">
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
                    <div className="px-4 pb-4">
                      <Button asChild className="w-full bg-[#312455] hover:bg-[#8a66a8] text-white rounded-xl h-10 text-xs font-bold shadow-md cursor-pointer transition-all duration-300">
                        <Link href={`/courses/${course.id}`}>
                          <Play className="mr-1.5 h-3 w-3 fill-white" />
                          Saber Mais
                        </Link>
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
    </div>
  )
}
