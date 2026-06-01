'use client'

import { motion } from 'framer-motion'

export function FloatingGlow() {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10],
        x: [-5, 5, -5],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl -translate-y-1/2 pointer-events-none z-0"
    />
  )
}
