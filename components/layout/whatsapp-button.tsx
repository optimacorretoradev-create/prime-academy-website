'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface FacebookButtonProps {
  whatsappUrl?: string
}

export function WhatsAppButton({ whatsappUrl = 'https://wa.me/244921394946' }: FacebookButtonProps) {
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow flex"
      aria-label="Contactar no WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6 fill-current" aria-hidden="true">
        <path d="M12.04 2.5A9.53 9.53 0 0 0 2.5 12.04c0 1.67.44 3.3 1.28 4.73L2.5 21.5l4.82-1.26A9.53 9.53 0 1 0 12.04 2.5Zm0 17.3a7.78 7.78 0 0 1-3.95-1.09l-.28-.17-2.86.75.77-2.79-.18-.29a7.78 7.78 0 1 1 6.5 3.59Zm4.39-5.83c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.13 3.55.58.24 1.03.38 1.38.49.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
      </svg>
      <span className="sr-only">Contacte-nos no WhatsApp</span>
    </motion.a>
  )
}
