import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const quickLinks = [
    { href: '/', label: 'Início' },
    { href: '/about', label: 'Sobre Nós' },
    { href: '/courses', label: 'Cursos' },
    { href: '/gallery', label: 'Galeria' },
    { href: '/enroll', label: 'Inscrição' },
    { href: '/contact', label: 'Contacto' },
  ]

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <Image 
                src="/logo.svg" 
                alt="Prime Academy Logo" 
                width={180} 
                height={48} 
                className="h-10 w-auto invert brightness-0 transition-transform group-hover:scale-105" 
              />
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed text-balance">
              Líderes em capacitação e desenvolvimento profissional em Angola. Oferecemos as melhores formações teóricas e práticas com certificação de excelência.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-accent">Navegação Rápida</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-primary-foreground/80">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-accent">Contactos</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-accent mt-0.5 flex-shrink-0" />
                <span className="leading-snug">Rua 28 de Maio, Edifício 30, 6º Andar Lado Esquerdo, Maianga, Luanda, Angola</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-accent flex-shrink-0" />
                <a href="tel:+244921394946" className="hover:text-accent transition-colors">(+244) 921 394 946</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4.5 w-4.5 text-accent mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href="mailto:geralprimeacademy@gmail.com" className="hover:text-accent transition-colors">geralprimeacademy@gmail.com</a>
                  <a href="mailto:comercialprimeacademy@gmail.com" className="hover:text-accent transition-colors">comercialprimeacademy@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Institutional Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-accent">Oficialização Digital</h3>
            <p className="text-xs text-primary-foreground/70 leading-relaxed">
              Portal institucional operado pela Prime Academy. Todos os direitos reservados. Certificados autenticados digitalmente e rastreáveis.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/primeacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2.5 rounded-xl transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com/primeacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2.5 rounded-xl transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Prime Academy. Desenvolvido em Angola.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent transition-colors">Política de Privacidade</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
