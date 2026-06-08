'use client'

import { useState, useEffect } from 'react'

/**
 * Hook para detectar a direção do scroll
 * Retorna `true` quando scrollando para cima ou no topo
 * Retorna `false` quando scrollando para baixo
 */
export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Se está no topo, sempre mostrar
      if (currentScrollY < 50) {
        setIsVisible(true)
      }
      // Se scrollou para baixo, esconder
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      }
      // Se scrollou para cima, mostrar
      else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return isVisible
}
