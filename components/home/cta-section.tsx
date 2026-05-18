'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-6 text-balance leading-tight">
            Pronto para transformar a sua carreira?
          </h2>
          <p className="text-primary-foreground/85 text-base md:text-lg mb-10 max-w-xl mx-auto text-pretty font-light">
            Dê o próximo passo estratégico e capacite-se com formadores de elite na Prime Academy. A sua jornada começa hoje.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base px-8 font-bold h-13"
          >
            <Link href="/enroll" className="flex items-center gap-2">
              Começar Agora
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
