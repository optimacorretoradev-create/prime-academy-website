'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin, ChevronUp } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  const navLinksCol1 = [
    { href: '/', label: 'Início' },
    { href: '/courses', label: 'Cursos' },
    { href: '/enroll', label: 'Inscrição' },
  ]
  
  const navLinksCol2 = [
    { href: '/about', label: 'Sobre Nós' },
    { href: '/gallery', label: 'Galeria' },
    { href: '/contact', label: 'Contacto' },
  ]
  
  const contactDetails = [
    { icon: Phone, text: '(+244) 921 394 946', href: 'tel:+244921394946' },
    { icon: Mail, text: 'geral@primeacademy.ao', href: 'mailto:geral@primeacademy.ao' },
    { icon: Mail, text: 'comercialprimeacademy@gmail.com', href: 'mailto:comercialprimeacademy@gmail.com' },
  ]

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-primary text-primary-foreground border-t border-primary-foreground/10 py-8 md:py-12 overflow-hidden">
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
        
        {/* Unified Grid: Logo + Desc | Menu | Contacts | Socials */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start mb-8">
          
          {/* Column 1: Logo and Brand Description */}
          <div className="space-y-1 md:space-y-0">
            <Link href="/" className="inline-block group md:-mt-4">
              <Image 
                src="/logo.svg" 
                alt="Prime Academy Logo" 
                width={200} 
                height={54} 
                className="h-14 md:h-46 w-auto invert brightness-0" 
              />
            </Link>
            <p className="text-xs text-primary-foreground/70 leading-relaxed font-light max-w-xs md:-mt-2">
              Capacitação e desenvolvimento profissional de excelência em Angola.
            </p>
          </div>

          {/* Column 2: Navigation - Split into 2 visual columns */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
              Navegação Rápida
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2 text-xs text-primary-foreground/80">
                {navLinksCol1.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition-colors duration-200 font-light flex items-center gap-1 group">
                      <span className="w-1 h-1 rounded-full bg-[#8a66a8]/40 group-hover:bg-white transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2 text-xs text-primary-foreground/80">
                {navLinksCol2.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition-colors duration-200 font-light flex items-center gap-1 group">
                      <span className="w-1 h-1 rounded-full bg-[#8a66a8]/40 group-hover:bg-white transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Contacts */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
              Contactos
            </h3>
            <ul className="space-y-2 text-xs text-primary-foreground/80 font-light">
              {contactDetails.map((item, idx) => {
                const Icon = item.icon
                return (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon className="h-4 w-4 text-[#8a66a8] mt-0.5 flex-shrink-0" />
                    <a href={item.href} className="hover:text-white transition-colors">{item.text}</a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
              Redes Sociais
            </h3>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61590607380114" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#8a66a8] text-white p-2 rounded-lg transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com/primeacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#8a66a8] text-white p-2 rounded-lg transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://wa.me/244921394946" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#25D366] text-white p-2 rounded-lg transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-primary-foreground/10 flex flex-col items-center gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Prime Academy. Todos os direitos reservados. By RC MEDIA</p>
          
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
