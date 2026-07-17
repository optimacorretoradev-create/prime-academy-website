'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, BadgeCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Course } from '@/lib/hygraph'

const slides = [
  { image: "/images/hero/hero1.jpeg" },
  { image: "/images/hero/hero5 (1).jpeg" },
  { image: "/images/hero/hero3.jpeg" },
]

interface FeaturedBoard {
  id: string
  title: string
  duration: string
  level: string
  regime: string
  vagasLimitadas: boolean
}

// Fallback used only when Hygraph returns no courses
const FALLBACK_COURSES: FeaturedBoard[] = [
  {
    id: 'f1',
    title: "Secretariado Executivo Digital e Novas Tecnologias",
    duration: "2 Dias / 16 Horas",
    level: "Avançado",
    regime: "Híbrido",
    vagasLimitadas: true,
  },
  {
    id: 'f2',
    title: "Gestão de Documentos e Arquivos Eletrónicos",
    duration: "2 Dias / 14 Horas",
    level: "Intermédio",
    regime: "Híbrido",
    vagasLimitadas: true,
  },
  {
    id: 'f3',
    title: "Oratória, Persuasão e Comunicação de Impacto",
    duration: "1 Dia / 8 Horas",
    level: "Executivo",
    regime: "Híbrido",
    vagasLimitadas: true,
  },
]

interface FeaturedCardProps {
  title: string
  duration: string
  level: string
  regime: string
  vagasLimitadas?: boolean
}

function FeaturedCard({ title, duration, level, regime, vagasLimitadas = false }: FeaturedCardProps) {
  return (
    <>
      {/* Card Header */}
      <div className="bg-[#312455]/80 px-4 pt-4 pb-3">
        <span className="text-[10px] tracking-wider bg-white/20 px-2 py-0.5 rounded-full uppercase inline-block font-bold text-white">
          <Star className="h-3 w-3 inline-block mr-1 fill-secondary text-secondary" />
          EM DESTAQUE
        </span>
        <h3 className="text-base font-bold text-white mt-2 leading-snug">{title}</h3>
      </div>

      {/* Card Body - Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <div>
          <p className="text-xs font-semibold text-white">{duration}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Carga Horária</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{regime}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Modalidade</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{level}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Nível do Programa</p>
        </div>
        <div className="flex items-start gap-1">
          <BadgeCheck className="h-3 w-3 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-white">Incluído</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Certificado</p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-white/10 pt-2 flex items-center justify-between gap-1 px-3 pb-3">
        {vagasLimitadas ? (
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold text-purple-300">Vagas Limitadas</span>
          </div>
        ) : <div />}
        <Link
          href="/enroll"
          className="bg-secondary hover:bg-secondary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
        >
          Inscrever-me
        </Link>
      </div>
    </>
  )
}

interface FeaturedBoard {
  id: string
  title: string
  duration: string
  level: string
  regime: string
  vagasLimitadas: boolean
}

interface HeroSectionProps {
  featuredCourses?: Course[]
  featuredBoards?: FeaturedBoard[]
}

export function HeroSection({ featuredCourses = [], featuredBoards = [] }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [contentToggle, setContentToggle] = useState(true)

  // Derive the featured item from Hygraph featured board, real courses, or fallback
  const coursePool: FeaturedBoard[] = featuredBoards.length > 0
    ? featuredBoards
    : featuredCourses.length > 0
      ? featuredCourses.map(c => ({
          id: c.id,
          title: c.name,
          duration: c.duration || '—',
          level: c.level || '—',
          regime: c.online ? 'Online' : 'Híbrido',
          vagasLimitadas: true,
        }))
      : FALLBACK_COURSES

  const activeCourse = coursePool[currentSlide % coursePool.length]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setContentToggle((prev) => !prev)
    }, 6000)
    return () => clearInterval(timer)
  }, [])


  const imageObjectPosition = 'object-cover object-top'

  return (
    <section className="relative pt-28 md:pt-32 pb-12 lg:pt-0 lg:pb-0 mt-[82px] md:mt-[112px] min-h-[500px] md:h-[calc(100vh-112px)] md:min-h-[600px] w-full flex items-stretch overflow-hidden">
      {/* Background Images Slideshow */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-primary">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slides[currentSlide].image}
              alt="Prime Academy Background"
              fill
              className={imageObjectPosition}
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#312455]/90 via-[#312455]/60 to-transparent" />
      </div>

      {/* Grid Layout */}
      <div className="relative z-20 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-6 sm:px-12 lg:px-16 pb-2 lg:pb-8">

        {/* Left Column - Text Content */}
        <div className="lg:col-span-7 flex flex-col justify-end items-start text-left h-full pb-2 pt-32 px-3 lg:justify-end lg:pt-0 lg:pb-12 lg:px-0 lg:pl-8 space-y-4 md:space-y-6 lg:space-y-8">

          {/* DESKTOP CONTENT (Always visible on desktop, hidden on mobile) */}
          <div className="hidden lg:flex lg:flex-col lg:items-start lg:space-y-8 w-full">
            {/* Badge */}
            <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-10">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] tracking-wider border border-white/10 uppercase">
                <Star className="h-3 w-3 text-secondary fill-secondary" />
                <span className="font-semibold">FORMAÇÃO EXECUTIVA EM ANGOLA</span>
              </div>
            </div>

            <div className="max-w-xl text-left flex flex-col items-start justify-start">
              <div className="overflow-hidden">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight uppercase">
                  Da Competência à Excelência
                  <span className="block text-secondary mt-1 lg:mt-2 text-sm sm:text-base md:text-lg lg:text-xl font-medium normal-case tracking-normal text-white/90">
                    em Novas Tecnologias de Gestão Secretarial
                  </span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-lg font-light leading-relaxed text-pretty mt-3 lg:mt-4">
                  Oferecemos formação corporativa especializada em secretariado executivo, gestão administrativa e tecnologias digitais em Angola. Programas práticos, formadores com experiência real — para profissionais ativos no alcance dos objetivos organizacionais.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-row items-center justify-start gap-3 lg:gap-4 mt-5 md:mt-10 lg:mt-12 w-full relative z-10">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-secondary/60 text-secondary hover:bg-secondary hover:text-white rounded-full text-xs md:text-base px-4 py-2.5 md:px-8 md:py-5 font-semibold transition-all w-fit"
                >
                  <Link href="/gallery">Explorar o Portfólio</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary text-white hover:bg-secondary/90 rounded-full shadow-lg hover:shadow-xl transition-all text-xs md:text-base px-4 py-2.5 md:px-8 md:py-5 font-semibold w-fit"
                >
                  <Link href="/enroll">Inscreve-se Agora</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* MOBILE CONTENT (Alternates on mobile, hidden on desktop) */}
          <div className="lg:hidden w-full">
            <AnimatePresence mode="wait">
              {contentToggle ? (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="flex flex-col items-start w-full space-y-4"
                >
                  {/* Badge */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] tracking-wider border border-white/10 uppercase">
                      <Star className="h-3 w-3 text-secondary fill-secondary" />
                      <span className="font-semibold">FORMAÇÃO EXECUTIVA EM ANGOLA</span>
                    </div>
                  </div>

                  <div className="max-w-[90%] md:max-w-[540px] text-left flex flex-col items-start justify-start">
                    <div className="overflow-hidden">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight uppercase">
                        Da Competência à Excelência
                        <span className="block text-secondary mt-1 text-sm sm:text-base md:text-lg font-medium normal-case tracking-normal text-white/90">
                          em Novas Tecnologias de Gestão Secretarial
                        </span>
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-lg font-light leading-relaxed text-pretty mt-3">
                        Oferecemos formação corporativa especializada em secretariado executivo, gestão administrativa e tecnologias digitais em Angola. Programas práticos, formadores com experiência real — para profissionais ativos no alcance dos objetivos organizacionais.
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-row flex-wrap items-center justify-start gap-2 mt-4 w-full relative z-10">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-secondary/60 text-secondary hover:bg-secondary hover:text-white rounded-full text-[10px] md:text-sm px-3 py-2 md:px-8 md:py-5 font-semibold transition-all w-fit"
                      >
                        <Link href="/gallery">Explorar o Portfólio</Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="bg-secondary text-white hover:bg-secondary/90 rounded-full shadow-lg hover:shadow-xl transition-all text-[10px] md:text-sm px-3 py-2 md:px-8 md:py-5 font-semibold w-fit"
                      >
                        <Link href="/enroll">Inscreve-se Agora</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="w-full flex flex-col items-start"
                >
                  {/* Mobile Featured Card */}
                  <div className="w-full max-w-[360px] mb-4 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                    <FeaturedCard
                      title={activeCourse.title}
                      duration={activeCourse.duration}
                      level={activeCourse.level}
                      regime={activeCourse.regime}
                      vagasLimitadas={activeCourse.vagasLimitadas}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>

        {/* Right Column - Featured Card */}
        <div className="hidden lg:flex lg:col-span-5 lg:items-end lg:justify-start">
          <div className="w-full max-w-[360px] mb-24 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <FeaturedCard
              title={activeCourse.title}
              duration={activeCourse.duration}
              level={activeCourse.level}
              regime={activeCourse.regime}
              vagasLimitadas={activeCourse.vagasLimitadas}
            />
          </div>
        </div>
      </div>

      {/* Slide Pagination Dots */}
      <div className="hidden sm:flex absolute bottom-10 right-12 md:right-24 z-20 gap-2.5 items-center bg-black/35 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-xl">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${index === currentSlide
              ? "w-7 bg-secondary shadow-[0_0_8px_rgba(138,102,168,0.7)]"
              : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
