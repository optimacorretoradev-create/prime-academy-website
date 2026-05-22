import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { NotificationsProvider } from '@/contexts/notifications-context'
import { ConditionalChrome } from '@/components/layout/conditional-chrome'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Prime Academy - Formação que transforma',
  description: 'Prime Academy é a academia líder de formação e consultoria em Angola. Oferecemos cursos de gestão, informática e idiomas com certificação reconhecida.',
  keywords: ['formação', 'cursos', 'Angola', 'academy', 'gestão', 'informática', 'idiomas', 'certificação'],
  authors: [{ name: 'Prime Academy' }],
  openGraph: {
    title: 'Prime Academy - Formação que transforma',
    description: 'Academia líder de formação e consultoria em Angola',
    type: 'website',
    locale: 'pt_AO',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" className={`${inter.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <NotificationsProvider>
            <ConditionalChrome>{children}</ConditionalChrome>
          </NotificationsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
