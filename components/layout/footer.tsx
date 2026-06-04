'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Phone, Mail, MapPin, ChevronUp } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  const quickLinks = [
    { href: '/', label: 'Início' },
    { href: '/about', label: 'Sobre Nós' },
    { href: '/courses', label: 'Cursos' },
    { href: '/gallery', label: 'Galeria' },
    { href: '/enroll', label: 'Inscrição' },
    { href: '/contact', label: 'Contacto' },
  ]

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-primary text-primary-foreground border-t border-primary-foreground/10 pt-16 pb-8 overflow-hidden">
      {/* Background Image Layer - Preserves the royal purple brand color while introducing a stunning abstract tech texture */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Decorative Glow Effects inspired by the reference footer's bokeh and dark ambient lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Pinkish/Purple glow on the bottom-left corner to recreate the bokeh circles */}
        <div className="absolute -left-20 bottom-0 w-[450px] h-[450px] bg-[#8a66a8]/25 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Middle Section: Columns matching the structure of reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="transition-transform group-hover:scale-105 -translate-y-31">
                <Image 
                  src="/logo.svg" 
                  alt="Prime Academy Logo" 
                  width={180} 
                  height={48} 
                  className="h-85 md:h-58 w-auto invert brightness-0 transition-transform" 
                />
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed font-light -translate-y-45">
              Capacitação e desenvolvimento profissional de excelência em Angola.
            </p>
          </div>

          {/* Column 2: Navigation Links (arranged as in the reference image) */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
              Navegação Rápida
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-primary-foreground/80">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors duration-200 font-light flex items-center gap-1 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8a66a8]/40 group-hover:bg-white transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
              Contactos
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80 font-light">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-[#8a66a8] flex-shrink-0" />
                <a href="tel:+244921394946" className="hover:text-white transition-colors duration-200">(+244) 921 394 946</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4.5 w-4.5 text-[#8a66a8] mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href="mailto:geral@primeacademy.ao" className="hover:text-white transition-colors duration-200 break-all">geral@primeacademy.ao</a>
                  <a href="mailto:comercialprimeacademy@gmail.com" className="hover:text-white transition-colors duration-200 break-all">comercialprimeacademy@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
              Redes Sociais
            </h3>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/primeacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#8a66a8] hover:text-white text-white p-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-md"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com/primeacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#8a66a8] hover:text-white text-white p-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Footer Bottom with scroll-to-top button */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-primary-foreground/60 relative">
          <p>© {new Date().getFullYear()} Prime Academy. Desenvolvido em Angola.</p>
          
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors duration-200 font-light">Política de Privacidade</Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-200 font-light">Termos de Uso</Link>
          </div>

          {/* Scroll to Top Arrow Button - Styled exactly like the bottom-right chevron in reference image */}
          <button 
            onClick={scrollToTop}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-primary-foreground/65 hover:text-white hover:border-white/40 bg-transparent transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 animate-bounce-subtle"
            aria-label="Voltar ao Topo"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

      </div>
    </footer>
  )
}
