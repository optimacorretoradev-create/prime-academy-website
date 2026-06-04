'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function CtaSection() {
  return (
    <section className="py-10 md:py-14 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-primary text-primary-foreground px-6 py-8 md:px-10 md:py-8 shadow-xl border border-white/10"
        >
          {/* Subtle glowing gradients using Prime Academy brand accent colors */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Left side secondary lilac glow */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#8a66a8]/25 rounded-full blur-[100px] mix-blend-screen" />
            {/* Right side secondary purple glow */}
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#8a66a8]/20 rounded-full blur-[100px] mix-blend-screen" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
            {/* Text block left */}
            <div className="text-center lg:text-left flex-1">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-2 leading-tight">
                Pronto para atualizar os seus conhecimentos?
              </h2>
              <p className="text-white/80 text-xs md:text-sm max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Dê o próximo passo estratégico e capacite-se com formadores de elite na Prime Academy. A sua jornada começa hoje.
              </p>
            </div>

            {/* Actions block right - Compact horizontal structure matching reference layout */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-5 sm:gap-6 shrink-0 w-full lg:w-auto">
              <Button
                asChild
                className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-[#312455] rounded-xl px-7 py-5 text-xs md:text-sm font-bold tracking-wide transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-lg border-0"
              >
                <Link href="/enroll">
                  Começar Agora
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
