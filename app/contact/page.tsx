import type { Metadata } from 'next'
import { getContactInfo } from '@/lib/hygraph'
import { ContactForm } from '@/components/contact/contact-form'
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto - Prime Academy',
  description: 'Entre em contacto com a Prime Academy. Estamos disponíveis para esclarecer todas as suas dúvidas sobre os nossos cursos e serviços.',
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/85 to-[#1d1533]/95" />
        {/* Decorative Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
        {/* Floating Elements */}
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent rounded-full animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-accent/50 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-500" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Contacto
          </h1>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg md:text-xl text-pretty">
            Estamos aqui para ajudar. Entre em contacto connosco para saber mais sobre os nossos cursos ou para esclarecer qualquer dúvida.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Informações de contacto
                </h2>
                <div className="space-y-4">
                  <a
                    href={`https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-accent/50 hover:shadow-md transition-all group"
                  >
                    <div className="bg-[#25D366]/10 p-3 rounded-lg group-hover:bg-[#25D366]/20 transition-colors">
                      <MessageCircle className="h-6 w-6 text-[#25D366]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-medium text-foreground">{contactInfo.phone}</p>
                    </div>
                  </a>

                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-accent/50 hover:shadow-md transition-all group"
                  >
                    <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium text-foreground">{contactInfo.phone}</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-accent/50 hover:shadow-md transition-all group"
                  >
                    <div className="bg-accent/10 p-3 rounded-lg group-hover:bg-accent/20 transition-colors">
                      <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{contactInfo.email}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                    <div className="bg-muted p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-medium text-foreground">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Redes Sociais</h3>
                <div className="flex gap-3">
                  {contactInfo.socialLinks.facebook && (
                    <a
                      href={contactInfo.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card p-3 rounded-xl border border-border hover:border-accent hover:bg-accent/10 transition-all"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5 text-foreground" />
                    </a>
                  )}
                  {contactInfo.socialLinks.instagram && (
                    <a
                      href={contactInfo.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card p-3 rounded-xl border border-border hover:border-accent hover:bg-accent/10 transition-all"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5 text-foreground" />
                    </a>
                  )}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-muted rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125454.08896689972!2d13.165465866406256!3d-8.838980099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f3b5e17e2d2d%3A0x8f2b6e1dff9c9c9a!2sLuanda%2C%20Angola!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Prime Academy"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-6 md:p-10 rounded-2xl border border-border shadow-sm h-fit">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Envie-nos uma mensagem
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
