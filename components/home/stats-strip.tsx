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
      <div className="container mx-auto px-4 max-w-6xl py-2 sm:py-3 md:py-4">
        <div className="flex flex-row items-center justify-between">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center px-2 sm:px-4 md:px-6 border-white/10 border-r last:border-r-0"
            >
              {/* Big Number */}
              <span className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-0.5 font-sans whitespace-nowrap">
                {stat.number}
              </span>

              {/* Title */}
              <span className="text-[8px] sm:text-xs font-medium tracking-wider uppercase opacity-80 font-sans whitespace-nowrap">
                {stat.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
