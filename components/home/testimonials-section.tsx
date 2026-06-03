import Image from 'next/image'
import { Quote, Landmark, GraduationCap, Building2, Globe, HeartHandshake, CheckCircle2 } from 'lucide-react'
import { getTestimonials } from '@/lib/hygraph'
import { AnimatedCard } from '@/components/ui/animated-card'
import { Badge } from '@/components/ui/badge'

const stats = [
  {
    value: '+10.353',
    label: 'Profissionais Formados',
    desc: 'Profissionais qualificados em Angola desde o início do projeto em 2018.'
  },
  {
    value: '80%',
    label: 'Prática Aplicada',
    desc: 'Foco na resolução de problemas práticos e desafios organizacionais.'
  },
  {
    value: '2018',
    label: 'Início do Projeto',
    desc: 'Trajetória com foco em quem lidera, assessora e decide.'
  }
]

const partners = [
  { icon: Landmark, name: 'Bancos e Seguradoras' },
  { icon: Building2, name: 'Instituições Públicas' },
  { icon: Globe, name: 'Multinacionais' },
  { icon: HeartHandshake, name: 'ONGs Internacionais' },
  { icon: GraduationCap, name: 'Universidades' }
]

const mockTestimonials = [
  {
    id: 't1',
    name: 'Maria Silva',
    text: 'A formação superou as minhas expectativas. Ferramentas práticas e imediatas.',
    avatarUrl: null
  },
  {
    id: 't2',
    name: 'João Pedro',
    text: 'Excelente abordagem metodológica. Sinto-me muito mais preparado para os desafios da minha liderança.',
    avatarUrl: null
  },
  {
    id: 't3',
    name: 'Ana Costa',
    text: 'Formadores de alto nível e conteúdos extremamente pertinentes para a nossa realidade.',
    avatarUrl: null
  }
]

export async function TestimonialsSection() {
  const testimonialsFromHygraph = await getTestimonials()
  const testimonials = testimonialsFromHygraph.length > 0 ? testimonialsFromHygraph : mockTestimonials

  return (
    <section className="py-20 md:py-28 bg-secondary/10 relative overflow-hidden border-t border-border">
      {/* Decorative vector points */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10 space-y-20">
        
        {/* PARTE 1: ESTATÍSTICAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <Badge className="bg-primary text-white border-none px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
              PROVA DE IMPACTO
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight">
              A Nossa Credibilidade e Trajetória Educacional
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Trabalhamos com profissionais de alta performance administrativa, secretarial e liderança. O nosso sucesso é medido pela melhoria real das organizações de Angola.
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s, idx) => (
              <div key={idx} className="bg-card p-6 rounded-3xl border border-border/80 shadow-sm flex flex-col justify-between space-y-3">
                <p className="text-3xl md:text-4xl font-extrabold text-accent">{s.value}</p>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs text-primary uppercase tracking-wide">{s.label}</h4>
                  <p className="text-[10px] text-muted-foreground leading-normal">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARTE 2: PARCEIROS CORPORATIVOS */}
        <div className="space-y-8">
          <div className="text-center">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest block mb-1">
              ORGANIZAÇÕES QUE CONFIAM NO NOSSO VALOR
            </span>
            <p className="text-xs text-muted-foreground">Parceiros e clientes dos principais segmentos do mercado angolano</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {partners.map((p, idx) => {
              const PartnerIcon = p.icon
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 bg-card px-5 py-3 rounded-2xl border border-border/80 shadow-sm hover:border-accent/40 hover:shadow-md transition-all duration-300"
                >
                  <PartnerIcon className="h-4.5 w-4.5 text-accent" />
                  <span className="text-xs font-bold text-primary">{p.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* PARTE 3: TESTEMUNHOS */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <Badge className="bg-accent text-accent-foreground border-none px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
              OPINIÃO DO FORMANDO
            </Badge>
            <h3 className="text-2xl md:text-3xl font-extrabold text-primary">
              O que dizem os nossos formandos?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <AnimatedCard key={testimonial.id} delay={index * 0.1}>
                <div className="bg-card p-8 rounded-3xl border border-border/80 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between space-y-6 relative group">
                  <div className="absolute top-6 right-6">
                    <Quote className="h-8 w-8 text-accent/15 group-hover:text-accent/30 transition-colors" />
                  </div>
                  
                  <p className="text-foreground text-xs leading-relaxed italic pr-4">
                    &quot;{testimonial.text}&quot;
                  </p>

                  <div className="flex items-center gap-3.5 pt-4 border-t border-border/50">
                    {testimonial.avatarUrl ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border/80">
                        <Image
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-primary font-bold text-sm">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-extrabold text-sm text-primary leading-tight">{testimonial.name}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold">Formando Prime Academy</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
