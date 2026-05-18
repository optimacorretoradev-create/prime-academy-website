'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80"
      >
        <source
          src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/60 to-primary/80" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-8"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span>+10.353 Profissionais Capacitados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span>Metodologia 80% Prática</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance uppercase tracking-wide"
          >
            Prime Academy
            <span className="block text-accent mt-2 text-2xl md:text-3xl lg:text-4xl font-semibold capitalize tracking-normal">
              Novas Tecnologias de Gestão e Secretariado Executivo
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-white/95 mb-10 max-w-3xl mx-auto text-pretty font-light"
          >
            Formação Executiva Avançada em Novas Tecnologias de Gestão Administrativa e Secretarial. Capacitando organizações e líderes desde 2018 para o sucesso organizacional sustentável.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl shadow-lg hover:shadow-xl transition-all text-base px-8"
            >
              <Link href="/courses">Ver cursos</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary rounded-xl text-base px-8"
            >
              <Link href="/enroll">Inscreva-se já</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-2.5 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
