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
    <footer className="relative bg-primary text-primary-foreground border-t border-primary-foreground/10 pt-12 pb-6 overflow-hidden">
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
        
        {/* Main Section */}
        <div className="flex flex-col gap-10 mb-8">
          
          {/* Logo and About - Centered on Mobile */}
          <div className="flex flex-col items-center text-center gap-4">
            <Link href="/" className="inline-block group">
              <Image 
                src="/logo.svg" 
                alt="Prime Academy Logo" 
                width={150} 
                height={40} 
                className="h-10 w-auto invert brightness-0" 
              />
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed font-light max-w-xs">
              Capacitação e desenvolvimento profissional de excelência em Angola.
            </p>
          </div>

          {/* Columns Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Nav Links */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
                Menu
              </h3>
              <ul className="grid grid-cols-2 gap-y-2 text-sm text-primary-foreground/80">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition-colors duration-200 font-light flex items-center gap-1 group">
                      <span className="w-1 h-1 rounded-full bg-[#8a66a8]/40 group-hover:bg-white transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
                Contactos
              </h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80 font-light">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#8a66a8]" />
                  <a href="tel:+244921394946" className="hover:text-white transition-colors">(+244) 921 394 946</a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-[#8a66a8] mt-0.5" />
                  <div className="flex flex-col">
                    <a href="mailto:geral@primeacademy.ao" className="hover:text-white transition-colors">geral@primeacademy.ao</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Socials */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
                Redes Sociais
              </h3>
              <div className="flex gap-4">
                <a 
                  href="https://facebook.com/primeacademy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#8a66a8] text-white p-3 rounded-xl transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com/primeacademy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#8a66a8] text-white p-3 rounded-xl transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-primary-foreground/10 flex flex-col items-center gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Prime Academy. Todos os direitos reservados.</p>
          
          {/* Scroll to Top Arrow Button */}
          <button 
            onClick={scrollToTop}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-primary-foreground/65 hover:text-white hover:border-white/40 bg-transparent transition-all duration-300"
            aria-label="Voltar ao Topo"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

      </div>
    </footer>
  )
}
