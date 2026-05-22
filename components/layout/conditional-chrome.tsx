'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboardArea = pathname?.startsWith('/dashboard')

  return (
    <>
      {!isDashboardArea && <Header />}
      <main className={isDashboardArea ? 'flex-1 min-h-0' : 'flex-1'}>{children}</main>
      {!isDashboardArea && <Footer />}
      {!isDashboardArea && <WhatsAppButton />}
    </>
  )
}
