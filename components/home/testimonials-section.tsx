import { Landmark, GraduationCap, Building2, Globe, HeartHandshake } from 'lucide-react'
import { getTestimonials } from '@/lib/hygraph'
import { Badge } from '@/components/ui/badge'
import { TestimonialsCarousel } from './testimonials-carousel'

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
  },
  {
    id: 't4',
    name: 'Sofia Bento',
    text: 'A metodologia é fantástica. Aprendi técnicas que aplicarei no meu dia-a-dia profissional.',
    avatarUrl: null
  },
  {
    id: 't5',
    name: 'Ricardo Silva',
    text: 'Uma experiência enriquecedora que transformou a minha forma de gerir processos.',
    avatarUrl: null
  }
]

export async function TestimonialsSection() {
  const testimonialsFromHygraph = await getTestimonials()
  const testimonials = testimonialsFromHygraph.length > 0 ? testimonialsFromHygraph : mockTestimonials

  return (
    <section className="py-20 md:py-28 bg-secondary/10 relative overflow-hidden border-t border-border">
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10 space-y-20">
        
        {/* PARTE 1: PARCEIROS CORPORATIVOS */}
        <div className="space-y-8">
          <div className="text-center">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest block mb-1">
              ORGANIZAÇÕES QUE CONFIAM NO NOSSO VALOR
            </span>
            <p className="text-xs text-muted-foreground">Parceiros e clientes dos principais segmentos do mercado angolano</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10">
            {partners.map((p, idx) => {
              const PartnerIcon = p.icon
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 bg-card px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl border border-border/80 shadow-sm hover:border-accent/40 hover:shadow-md transition-all duration-300 w-auto sm:w-auto"
                >
                  <PartnerIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-accent" />
                  <span className="text-[10px] sm:text-xs font-bold text-primary">{p.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* PARTE 3: TESTEMUNHOS */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <Badge className="bg-accent text-accent-foreground border-none px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
              TESTEMUNHOS COMPROVADOS
            </Badge>
            <h3 className="text-2xl md:text-3xl font-extrabold text-primary">
              Os nossos formandos recomendam
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
              Porque o investimento tem impacto real nas suas organizações e carreiras.
            </p>
          </div>

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  )
}
