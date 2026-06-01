import type { Metadata } from 'next'
import { getContactInfo } from '@/lib/hygraph'
import { ContactForm } from '@/components/contact/contact-form'
import { HowToReachUs } from '@/components/contact/how-to-reach-us'
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
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* LEFT COLUMN: CONTACT DETAILS */}
            <div className="lg:col-span-7 space-y-10">
              <div>
                <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">Get In Touch</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#312455] mt-2 leading-tight">
                  Não Hesite em<br />Contactar-nos
                </h2>
                <p className="text-slate-500 text-sm mt-4 font-light leading-relaxed max-w-xl">
                  Estamos sempre disponíveis para o ajudar a alcançar o sucesso profissional. Fale connosco para esclarecer as suas dúvidas sobre os nossos cursos, inscrições ou parcerias.
                </p>
              </div>

              {/* Grid of 4 Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                {/* 1. Location */}
                <div className="flex gap-4">
                  <div className="bg-[#312455]/5 text-[#312455] p-3 rounded-2xl h-fit">
                    <MapPin className="h-6 w-6 text-[#312455]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#312455] text-base">Localização</h4>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">{contactInfo.address}</p>
                  </div>
                </div>

                {/* 2. Phone */}
                <div className="flex gap-4">
                  <div className="bg-[#312455]/5 text-[#312455] p-3 rounded-2xl h-fit">
                    <Phone className="h-6 w-6 text-[#312455]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#312455] text-base">Telefone</h4>
                    <a href={`tel:${contactInfo.phone}`} className="block text-slate-500 text-xs hover:text-[#8a66a8] transition-colors">{contactInfo.phone}</a>
                  </div>
                </div>

                {/* 3. Email */}
                <div className="flex gap-4">
                  <div className="bg-[#312455]/5 text-[#312455] p-3 rounded-2xl h-fit">
                    <Mail className="h-6 w-6 text-[#312455]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#312455] text-base">Email</h4>
                    <a href={`mailto:${contactInfo.email}`} className="block text-slate-500 text-xs hover:text-[#8a66a8] transition-colors break-all">{contactInfo.email}</a>
                  </div>
                </div>

                {/* 4. Social networks */}
                <div className="flex gap-4">
                  <div className="bg-[#312455]/5 text-[#312455] p-3 rounded-2xl h-fit">
                    <MessageCircle className="h-6 w-6 text-[#312455]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-[#312455] text-base">Redes Sociais</h4>
                    <div className="flex gap-2">
                      {contactInfo.socialLinks.facebook && (
                        <a
                          href={contactInfo.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-50 hover:bg-[#312455] text-slate-700 hover:text-white p-2 rounded-xl transition-all duration-300 border border-slate-100 shadow-sm"
                          aria-label="Facebook"
                        >
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                      {contactInfo.socialLinks.instagram && (
                        <a
                          href={contactInfo.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-50 hover:bg-[#312455] text-slate-700 hover:text-white p-2 rounded-xl transition-all duration-300 border border-slate-100 shadow-sm"
                          aria-label="Instagram"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nice Wide Image at the bottom left */}
              <div className="relative aspect-[21/9] sm:aspect-[21/10] w-full overflow-hidden rounded-3xl shadow-sm border border-slate-100 mt-6">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: 'url(/images/contact.jpg)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#312455]/40 via-transparent to-transparent" />
              </div>
            </div>

            {/* RIGHT COLUMN: CARD & FORM */}
            <div className="lg:col-span-5 h-full">
              <div className="bg-[#fafaf8] border border-slate-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm h-full flex flex-col">
                <h3 className="text-xl sm:text-2xl font-black text-[#312455] mb-2 leading-tight">
                  Envie-nos uma Mensagem
                </h3>
                <p className="text-slate-400 text-xs font-light mb-6">
                  Preencha o formulário abaixo e a nossa equipa entrará em contacto direto.
                </p>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW TO REACH US — Route Planner + Satellite Map */}
      <HowToReachUs />
    </div>
  )
}
