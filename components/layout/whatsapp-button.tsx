'use client'

import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface WhatsAppButtonProps {
  phoneNumber?: string
}

export function WhatsAppButton({ phoneNumber = '+244923456789' }: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow md:hidden"
      aria-label="Contactar via WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Fale connosco no WhatsApp</span>
    </motion.a>
  )
}
