'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.round(eased * target)
      setCount(start)
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [isInView, target, duration])

  return { count, ref }
}

const stats = [
  { target: 10353, prefix: '+', suffix: '', label: 'Profissionais Capacitados', format: 'dot' as const },
  { target: 8, prefix: '+', suffix: '', label: 'Anos de Impacto em Angola', format: 'plain' as const },
  { target: 10, prefix: '+', suffix: '', label: 'Sectores Cobertos', format: 'plain' as const },
  { target: 80, prefix: '', suffix: '%', label: 'Prática Aplicada', format: 'plain' as const },
]

function formatNumber(value: number, format: 'dot' | 'plain') {
  if (format === 'dot') return value.toLocaleString('pt-PT').replace(/,/g, '.')
  return String(value)
}

function StatItem({ stat, idx }: { stat: (typeof stats)[number]; idx: number }) {
  const { count, ref } = useCountUp(stat.target)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: idx * 0.15 }}
      className="flex flex-col items-center justify-center px-2 sm:px-4 md:px-6 border-white/10 md:border-r md:last:border-r-0"
    >
      <span className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-0.5 font-sans whitespace-nowrap">
        {stat.prefix}{formatNumber(count, stat.format)}{stat.suffix}
      </span>
      <span className="text-[8px] sm:text-xs font-medium tracking-wider uppercase opacity-80 font-sans whitespace-nowrap">
        {stat.label}
      </span>
    </motion.div>
  )
}

export function StatsStrip() {
  return (
    <div className="relative z-30 bg-gradient-to-r from-[#8a66a8] to-[#735191] text-white overflow-hidden shadow-lg border-y border-purple-400/20">
      <div className="container mx-auto px-4 max-w-6xl py-2 sm:py-3 md:py-4">
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:items-center md:justify-between md:gap-0">
          {stats.map((stat, idx) => (
            <StatItem key={idx} stat={stat} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}
