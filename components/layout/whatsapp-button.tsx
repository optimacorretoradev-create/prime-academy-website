'use client'

import { Facebook } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface FacebookButtonProps {
  facebookUrl?: string
}

export function WhatsAppButton({ facebookUrl = 'https://www.facebook.com/profile.php?id=61590607380114' }: FacebookButtonProps) {
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  return (
    <motion.a
      href={facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#1877F2] text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow flex"
      aria-label="Seguir no Facebook"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Facebook className="h-5 w-5 md:h-6 md:w-6" />
      <span className="sr-only">Siga-nos no Facebook</span>
    </motion.a>
  )
}
