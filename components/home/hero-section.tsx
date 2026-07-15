'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  { image: "/images/hero/hero1.jpeg" },
  { image: "/images/hero/hero5 (1).jpeg" },
  { image: "/images/hero/hero3.jpeg" },
]

const featuredCourse = {
  title: "Secretariado Executivo Digital e Novas Tecnologias",
  metadata: [
    { value: "2 Dias / 16 Horas", label: "Carga Horária" },
    { value: "Avançado", label: "Nível do Programa" },
    { value: "Presencial", label: "Regime de Aulas" },
  ],
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [contentToggle, setContentToggle] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setContentToggle((prev) => !prev)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const imageObjectPosition = 'object-cover object-top'

  return (
    <section className="relative pt-28 md:pt-32 pb-12 lg:pt-0 lg:pb-0 mt-[82px] md:mt-[112px] h-[calc(100vh-82px)] md:h-[calc(100vh-112px)] min-h-[500px] md:min-h-[600px] w-full flex items-stretch overflow-hidden">
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
                  Oferecemos formação corporativa especializada em secretariado executivo, gestão administrativa e tecnologias digitais em Angola. Programas práticos, formadores com experiência real — para profissionais activos no alcance dos objetivos organizacionais.
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
                  <Link href="/courses">Explorar o Portfólio</Link>
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
                        Oferecemos formação corporativa especializada em secretariado executivo, gestão administrativa e tecnologias digitais em Angola. Programas práticos, formadores com experiência real — para profissionais activos no alcance dos objetivos organizacionais.
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-row items-center justify-start gap-3 mt-5 w-full relative z-10">
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-secondary/60 text-secondary hover:bg-secondary hover:text-white rounded-full text-xs md:text-base px-4 py-2.5 md:px-8 md:py-5 font-semibold transition-all w-fit"
                      >
                        <Link href="/courses">Explorar o Portfólio</Link>
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
                  <div className="w-full max-w-[360px] mb-4 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col flex">
                    {/* Card Header */}
                    <div className="bg-[#312455]/80 px-4 pt-4 pb-3">
                      <span className="text-[10px] tracking-wider bg-white/20 px-2 py-0.5 rounded-full uppercase inline-block font-bold text-white">
                        <Star className="h-3 w-3 inline-block mr-1 fill-secondary text-secondary" />
                        EM DESTAQUE
                      </span>
                      <h3 className="text-base font-bold text-white mt-2 leading-snug">
                        {featuredCourse.title}
                      </h3>
                    </div>

                    {/* Card Body - Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 p-4">
                      {featuredCourse.metadata.map((item, idx) => (
                        <div key={idx}>
                          <p className="text-sm font-semibold text-white">{item.value}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Card Footer */}
                    <div className="border-t border-white/10 pt-3 flex items-center justify-between gap-2 px-4 pb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                        <span className="text-xs font-semibold text-purple-300">Vagas Limitadas</span>
                      </div>
                      <Link
                        href="/enroll"
                        className="bg-secondary hover:bg-secondary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                      >
                        Inscrever-me
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>

        {/* Right Column - Featured Card */}
        <div className="hidden lg:flex lg:col-span-5 lg:items-end lg:justify-start">
          <div className="w-full max-w-[360px] mb-24 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-[#312455]/80 px-4 pt-4 pb-3">
              <span className="text-[10px] tracking-wider bg-white/20 px-2 py-0.5 rounded-full uppercase inline-block font-bold text-white">
                <Star className="h-3 w-3 inline-block mr-1 fill-secondary text-secondary" />
                EM DESTAQUE
              </span>
              <h3 className="text-base font-bold text-white mt-2 leading-snug">
                {featuredCourse.title}
              </h3>
            </div>

            {/* Card Body - Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 p-4">
              {featuredCourse.metadata.map((item, idx) => (
                <div key={idx}>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Card Footer */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between gap-2 px-4 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-xs font-semibold text-purple-300">Vagas Limitadas</span>
              </div>
              <Link
                href="/enroll"
                className="bg-secondary hover:bg-secondary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
              >
                Inscrever-me
              </Link>
            </div>
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
