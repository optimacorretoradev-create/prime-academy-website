'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EnrollBackButton() {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/courses')
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleBack}
      className="absolute top-6 left-4 md:top-8 md:left-8 z-20 gap-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl h-10 px-4 text-sm font-semibold cursor-pointer"
      aria-label="Voltar à página anterior"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </Button>
  )
}
