'use client'

import { motion } from 'framer-motion'

export function StatsStrip() {
  const stats = [
    {
      number: '+10,351',
      title: 'Profissionais Capacitados'
    },
    {
      number: '2,018',
      title: 'Início do Projeto'
    },
    {
      number: '80%',
      title: 'Prática Aplicada'
    }
  ]

  return (
    <div className="relative z-30 bg-gradient-to-r from-[#8a66a8] to-[#735191] text-white overflow-hidden shadow-lg border-y border-purple-400/20">
      <div className="container mx-auto px-4 max-w-6xl py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-y-0 items-center justify-center text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center px-6 border-white/10 md:border-r last:border-r-0"
            >
              {/* Big Number */}
              <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-1.5 drop-shadow-[0_2px_8px_rgba(49,36,85,0.15)] font-sans">
                {stat.number}
              </span>

              {/* Title */}
              <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.15em] uppercase text-purple-100/90 font-sans">
                {stat.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
