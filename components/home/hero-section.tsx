'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, TrendingUp, Zap, Shield, Cpu, Coins, Globe, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  {
    title: "Prime Academy",
    subtitle: "Centro de Excelência em Formação Profissional",
    description: "Formação corporativa de referência para executivos e profissionais de elevado desempenho. Desenvolva competências críticas com prestígio, inovação e rigor.",
    image: "/images/hero/hero1.jpeg"
  },
  {
    title: "Excelência e Prestígio",
    subtitle: "Capacitação de Alto Nível para o Mercado",
    description: "Elevamos o padrão do desenvolvimento profissional. Soluções de formação estratégica para organizações públicas e privadas comprometidas com o sucesso.",
    image: "/images/hero/hero2.jpeg"
  },
  {
    title: "Liderança Inovadora",
    subtitle: "Gestão e Estratégia Corporativa",
    description: "Prepare-se para os desafios atuais. Potenciamos líderes e equipas com metodologias de ponta focadas na eficácia, na inovação e na excelência operacional.",
    image: "/images/hero/hero3.jpeg"
  },
  {
    title: "Parceiro de Sucesso",
    subtitle: "Formação Executiva de Elite",
    description: "O parceiro ideal para empresas que procuram excelência. Certificação reconhecida, metodologia prática e mentoria especializada para um desenvolvimento de topo.",
    image: "/images/hero/hero4.jpeg"
  }
]

const partnerBrands = [
  { icon: Shield, name: 'ARSEG' },
  { icon: Zap, name: 'ZAP' },
  { icon: Cpu, name: 'PRODEL' },
  { icon: Coins, name: 'RECREDIT' },
  { icon: Globe, name: 'ENBI' },
  { icon: Lightbulb, name: 'ENDE' },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const slidePositions = [
    'object-center',                  // hero1
    'object-center md:object-[25%]',  // hero2
    'object-center md:object-[25%]',  // hero3
    'object-center'                   // hero4
  ]

  return (
    <section className="relative min-h-screen w-full flex items-stretch overflow-hidden pt-16 md:pt-0">
      {/* Background Images Slideshow - Spans full screen with fallback brand dark background to avoid white flashes */}
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
              className={`object-cover ${slidePositions[currentSlide]}`}
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Smooth brand gradient vignette - deep brand purple `#312455` concentrated on the left for text readability, fading quickly to reveal the full image on the right */}
        <div 
          className="absolute inset-0 z-10" 
          style={{
            background: 'linear-gradient(to right, #312455 0%, rgba(49, 36, 85, 0.95) 20%, rgba(49, 36, 85, 0.6) 38%, rgba(49, 36, 85, 0.15) 55%, transparent 75%)'
          }}
        />
      </div>

      {/* Left Typography Container - positioned cleanly over the fading gradient without cutting the image */}
      <div className="relative z-20 w-full md:w-[50%] flex flex-col justify-center px-6 sm:px-12 md:pl-16 lg:pl-24 md:pr-8 py-20 md:py-32 transition-all duration-500">
        
        {/* Trust Badges - Moved to the very top for mobile */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-xs border border-white/10">
            <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
            <span className="font-semibold">+10.353 Profissionais Capacitados</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-xs border border-white/10">
            <TrendingUp className="h-3.5 w-3.5 text-secondary" />
            <span className="font-semibold">Metodologia 80% Prática</span>
          </div>
        </div>

        <div className="max-w-xl text-left my-auto min-h-[350px] md:min-h-[450px] flex flex-col justify-center">
          {/* Dynamic Content Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-[280px] md:h-[280px] overflow-hidden"
            >
              {/* Dynamic Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight uppercase">
                {slides[currentSlide].title}
                <span className="block text-secondary mt-3 text-lg sm:text-2xl lg:text-3xl font-semibold normal-case tracking-normal text-white/90">
                  {slides[currentSlide].subtitle}
                </span>
              </h1>

              {/* Dynamic Subtitle */}
              <p className="text-base sm:text-lg text-white/80 mb-8 max-w-lg font-light leading-relaxed text-pretty">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTAs */}
          <div className="flex flex-row items-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-secondary text-white hover:bg-secondary/90 rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base px-8 py-5 sm:py-6 font-semibold"
            >
              <Link href="/enroll">Inscreva-se Já</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-secondary/60 text-secondary hover:bg-secondary hover:text-white rounded-full text-sm sm:text-base px-8 py-5 sm:py-6 font-semibold transition-all"
            >
              <Link href="/courses">Ver Cursos</Link>
            </Button>
          </div>
        </div>

        {/* Partners Infinite Horizontal Scroll Carousel (Below CTAs, inside slanted panel) */}
        <div className="max-w-xl w-full border-t border-white/10 pt-6 mt-8 shrink-0">
          <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest mb-4 font-semibold">
            Confiança e Prestígio com Grandes Marcas
          </p>

          {/* Infinite Marquee Container */}
          <div className="relative w-full overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div className="inline-flex animate-marquee gap-10 items-center py-1">
              {/* Slide 1 */}
              <div className="flex items-center gap-10 shrink-0">
                {partnerBrands.map((brand, idx) => {
                  const Icon = brand.icon
                  return (
                    <div
                      key={`hero-brand-1-${idx}`}
                      className="flex items-center gap-2 text-white/50 hover:text-white hover:scale-105 transition-all duration-300 pointer-events-none select-none"
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                      <span className="text-sm sm:text-base font-semibold tracking-wide">{brand.name}</span>
                    </div>
                  )
                })}
              </div>

              {/* Duplicate Slide 2 for seamless loop animation */}
              <div className="flex items-center gap-10 shrink-0">
                {partnerBrands.map((brand, idx) => {
                  const Icon = brand.icon
                  return (
                    <div
                      key={`hero-brand-2-${idx}`}
                      className="flex items-center gap-2 text-white/50 hover:text-white hover:scale-105 transition-all duration-300 pointer-events-none select-none"
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                      <span className="text-sm sm:text-base font-semibold tracking-wide">{brand.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Injecting CSS Keyframes inline dynamically */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
          `}} />
        </div>
      </div>

      {/* Sleek Dynamic Slide Pagination Dots */}
      <div className="absolute bottom-10 right-12 md:right-24 z-20 flex gap-2.5 items-center bg-black/35 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-xl">
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
