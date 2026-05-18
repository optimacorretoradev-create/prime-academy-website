'use client'

import { motion } from 'framer-motion'
import { Award, BookOpen, HeadphonesIcon, ClipboardList, Laptop, ShieldCheck, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const benefits = [
  {
    icon: BookOpen,
    title: 'Metodologia Prática',
    description: 'Foco em 80% de prática aplicada e 20% de teoria relevante para resolver desafios reais do mercado angolano.',
  },
  {
    icon: Award,
    title: 'Certificação de Valor',
    description: 'Diplomas e certificados emitidos com validade nacional e reconhecimento institucional por empresas líderes.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Suporte Personalizado',
    description: 'Acompanhamento qualificado e suporte humano contínuo durante todo o seu percurso formativo.',
  },
]

const steps = [
  {
    icon: ClipboardList,
    title: '1. Inscreva-se',
    description: 'Escolha o seu curso ou workshop e preencha a ficha de inscrição online em poucos segundos.',
  },
  {
    icon: Laptop,
    title: '2. Estude e Aplique',
    description: 'Participe em aulas interativas com formadores especialistas de referência nacional e internacional.',
  },
  {
    icon: ShieldCheck,
    title: '3. Receba o Certificado',
    description: 'Obtenha a sua certificação reconhecida para acelerar a sua carreira ou modernizar o seu gabinete.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/40 relative overflow-hidden">
      {/* Visual accents */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10 space-y-20">
        
        {/* Parte 1: Benefícios */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <Badge className="bg-accent text-accent-foreground border-none px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
              BENEFÍCIOS ÚNICOS
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary">
              Porque estudar connosco?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Mais do que teoria, fornecemos competências de impacto imediato na produtividade e gestão administrativa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="bg-card p-8 rounded-3xl border border-border/80 hover:border-accent/40 hover:shadow-xl transition-all duration-300 h-full space-y-5">
                  <div className="bg-primary/5 w-14 h-14 rounded-2xl flex items-center justify-center border border-primary/10 group-hover:bg-accent/15 group-hover:border-accent/20 transition-colors">
                    <item.icon className="h-7 w-7 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-xs">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Separador Divisor */}
        <hr className="border-t border-border/60 max-w-4xl mx-auto" />

        {/* Parte 2: Como Funciona */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <Badge className="bg-primary text-white border-none px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
              FLUXO ESTRUTURADO
            </Badge>
            <h3 className="text-2xl md:text-3xl font-extrabold text-primary">
              Como funciona a sua jornada?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Um processo simples e direto, desenhado para respeitar o seu tempo e maximizar a sua aprendizagem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative bg-card/60 p-8 rounded-3xl border border-border/50 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="bg-accent/10 w-11 h-11 rounded-xl flex items-center justify-center text-accent">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-extrabold text-lg text-primary">{step.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
                </div>

                {/* Seta indicativa no desktop (oculta no último elemento) */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 bg-card border border-border/80 p-1.5 rounded-full shadow-md">
                    <ArrowRight className="h-4 w-4 text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
