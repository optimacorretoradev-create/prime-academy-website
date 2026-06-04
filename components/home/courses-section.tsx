'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Clock, Award, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

const categories = [
  {
    title: 'GESTÃO ADMINISTRATIVA DIGITAL',
    image: '/images/courses/gestao.jpeg',
    items: ['Ferramentas de Produtividade Avançada (Office 365/Google Workspace)', 'Gestão de Documentos e Arquivos Eletrónicos', 'Gestão do Tempo, Processos e Produtividade']
  },
  {
    title: 'LIDERANÇA E COMUNICAÇÃO',
    image: '/images/courses/lideranca.jpeg',
    items: ['Comunicação Institucional', 'Redação Oficial', 'Procedimentos Administrativos', 'Liderança e Gestão de RH', 'Oratória e Persuasão']
  },
  {
    title: 'SECRETARIADO ESTRATÉGICO',
    image: '/images/courses/secretariado.jpeg',
    items: ['Secretariado para Alta Direção', 'Gestão de Gabinete de Altos Gestores', 'Protocolo e Etiqueta Empresarial', 'Práticas de Secretariado Executivo']
  },
  {
    title: 'TECNOLOGIAS INOVADORAS',
    image: '/images/courses/tecnologia.jpeg',
    items: ['Inteligência Artificial para automação de tarefas administrativas', 'Tecnologias de Comunicação e Gestão de Informação', 'Cibersegurança para gestores']
  }
]

export function CoursesSection() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1600px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <Badge className="bg-[#312455] text-white border-none px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold rounded-full">
              FORMAÇÃO DE EXCELÊNCIA
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#312455] tracking-tight uppercase">
              CURSOS EM DESTAQUE
            </h2>
            <p className="text-slate-500 text-sm">
              Selecione uma das nossas especialidades de alta conversão empresarial e acelere a sua carreira.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full font-bold px-8 text-[#312455] hover:bg-[#312455] hover:text-white transition-all h-12 shadow-sm">
            <Link href="/courses" className="flex items-center gap-2">
              Ver Todos os Cursos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* 4 Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full flex flex-col border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white">
                <div className="h-56 overflow-hidden">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                <CardFooter className="flex flex-col gap-3 pt-2 pb-6 px-6 border-t border-border/50 mt-4 bg-muted/10">
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-bold h-11 shadow-sm group-hover:shadow-md transition-all active:scale-[0.98]">
                    <Link href={`/enroll?course=${encodeURIComponent(course.name)}`}>
                      Inscrever-me
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
