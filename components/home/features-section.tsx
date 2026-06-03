'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Award, BookOpen, MessageSquare, Check, Sparkles, Star, Laptop, ArrowRight, ShieldCheck, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      id: 0,
      icon: BookOpen,
      badge: "80% PRÁTICA",
      title: "Metodologia 80% Prática",
      description: "Aprenda fazendo através de simulações e casos práticos desenhados para a realidade executiva angolana."
    },
    {
      id: 1,
      icon: Award,
      badge: "VALIDADE NACIONAL",
      title: "Certificação de Prestígio",
      description: "Diplomas emitidos em conformidade com as diretivas de formação profissional de Angola, altamente valorizados."
    },
    {
      id: 2,
      icon: MessageSquare,
      badge: "RESPOSTA IMEDIATA",
      title: "Suporte Mentorado Direto",
      description: "Diga adeus a dúvidas sem resposta. Aceda a um canal de suporte individual direto com formadores especialistas."
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Inscrição Digital",
      description: "Preencha a ficha de inscrição online em poucos segundos. O processo é 100% digital e prático."
    },
    {
      number: "02",
      title: "Estudo Aplicado",
      description: "Participe em aulas interativas e resolva desafios laboratoriais baseados em casos de estudo reais."
    },
    {
      number: "03",
      title: "Diploma Executivo",
      description: "Receba a sua certificação executiva homologada com total validade corporativa em Angola."
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background grids and glowing blobs to match the Hero */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(49,36,85,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(49,36,85,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl space-y-20">

        {/* PARTE 1: BENEFÍCIOS ÚNICOS (SYMMETRICAL DUAL-CARD INTERACTIVE SHOWCASE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* LEFT COLUMN: Cinematic Morphing Glass Canvas Screen (Symmetrical in height and size, aligned with Hero's left purple panel) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, x: -20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 bg-gradient-to-br from-primary via-primary/95 to-[#241a40] rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl border border-primary/20 min-h-[420px] flex flex-col justify-between group"
          >
            {/* Ambient glows behind the dashboard */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary/15 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

            {/* Mock Screen Header (Nav Bar) */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 relative z-10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-extrabold text-secondary tracking-widest">PA</div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">PRIME STUDIO HUBS</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-white/60 tracking-wider">PREVISÃO EM TEMPO REAL</span>
              </div>
            </div>

            {/* Morphing Workspace Screen Container with AnimatePresence */}
            <div className="flex-1 flex items-center justify-center py-6 relative z-10 overflow-hidden">
              <AnimatePresence mode="wait">

                {/* INTERACTIVE STATE 0: METODOLOGIA PRÁTICA GRAPH & WIDGETS */}
                {activeTab === 0 && (
                  <motion.div
                    key="tab-metodologia"
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch"
                  >
                    {/* circular progress chart */}
                    <div className="sm:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <span className="text-[8px] text-white/40 uppercase tracking-widest">Saber Fazer</span>
                        <h5 className="text-xs font-bold">Casos de Sucesso</h5>
                      </div>

                      {/* circular loader */}
                      <div className="relative w-20 h-20 mx-auto flex items-center justify-center my-1">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="40" cy="40" r="34" className="stroke-white/10 stroke-[6] fill-none" />
                          <motion.circle
                            cx="40" cy="40" r="34"
                            className="stroke-secondary stroke-[6] fill-none"
                            strokeDasharray="213"
                            initial={{ strokeDashoffset: 213 }}
                            animate={{ strokeDashoffset: 42.6 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <span className="absolute text-xs font-black text-secondary">80%</span>
                      </div>

                      <p className="text-[9px] text-center text-white/50 leading-relaxed font-light">Casos reais resolvidos em ambiente corporativo.</p>
                    </div>

                    {/* interactive task validation console */}
                    <div className="sm:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[8px] text-white/40 uppercase tracking-widest">Exercícios e Dinâmicas</span>
                        <h5 className="text-xs font-bold pt-0.5">Metodologia Laboratorial</h5>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] bg-white/5 px-2.5 py-2 rounded-xl border border-white/5">
                          <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <span className="truncate">Dinâmica: Redação Oficial</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] bg-white/5 px-2.5 py-2 rounded-xl border border-white/5">
                          <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <span className="truncate">Simulação: Gestão de Fluxos</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] bg-white/5 px-2.5 py-2 rounded-xl border border-white/5 opacity-50">
                          <div className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0" />
                          <span className="truncate">Exame: Secretariado Avançado</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* INTERACTIVE STATE 1: CERTIFICAÇÃO EXECUTIVE ACCREDITATION BADGE */}
                {activeTab === 1 && (
                  <motion.div
                    key="tab-certificacao"
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full flex items-center justify-center"
                  >
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-sm w-full flex flex-col items-center text-center space-y-4 shadow-xl">
                      {/* Gold Badge */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg relative group-hover:rotate-12 transition-transform duration-500">
                        <div className="absolute inset-1 rounded-full border border-white/20 border-dashed" />
                        <Star className="w-8 h-8 text-white fill-white" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] text-secondary font-black tracking-widest uppercase">REGISTO CERTIFICADO</span>
                        <h5 className="text-sm font-extrabold text-white">Diploma Profissional Executivo</h5>
                        <p className="text-[10px] text-white/50 max-w-xs font-light leading-relaxed">
                          Acreditado em inteira conformidade com o Sistema Nacional de Formação Profissional e chancelado pelas maiores marcas nacionais.
                        </p>
                      </div>

                      <div className="border-t border-white/10 w-full pt-3 flex items-center justify-between text-[9px] text-white/60 px-2">
                        <span>Acreditação: VÁLIDO</span>
                        <span className="bg-secondary/20 text-secondary px-2 py-0.5 rounded border border-secondary/30 text-[8px] font-bold">100% REGISTADO</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* INTERACTIVE STATE 2: SUPORTE PERSONALIZADO CHAT THREAD */}
                {activeTab === 2 && (
                  <motion.div
                    key="tab-suporte"
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">T</div>
                        <div>
                          <p className="text-[9px] font-bold">Tutor Prime</p>
                          <p className="text-[7px] text-emerald-400">Ativo para mentoria</p>
                        </div>
                      </div>
                      <span className="text-[8px] text-white/40">SLA: &lt; 15 MINUTOS</span>
                    </div>

                    <div className="space-y-3 pt-1">
                      {/* message 1 */}
                      <div className="flex gap-2 items-start">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold shrink-0">E</div>
                        <div className="bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-r-lg rounded-bl-lg max-w-[85%]">
                          <p className="text-[8px] leading-tight text-white/80 font-light">Tenho uma dúvida na Aula 4: como preencher a grelha de fluxos?</p>
                        </div>
                      </div>
                      {/* message 2 */}
                      <div className="flex gap-2 items-start justify-end">
                        <div className="bg-secondary/20 border border-secondary/30 px-2.5 py-1.5 rounded-l-lg rounded-br-lg max-w-[85%] text-right">
                          <p className="text-[8px] leading-tight text-secondary font-bold">Olá! Podes fazer o download do Modelo Executivo de Fluxos que partilhei no Portal, já tem a estrutura de simulação validada!</p>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[8px] font-bold text-white shrink-0">T</div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Mock Screen Footer */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between text-white/40 text-[8px] tracking-wider relative z-10 shrink-0">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-secondary animate-pulse" />
                <span>+10.000 PROFISSIONAIS E LÍDERES NO ECOSSISTEMA</span>
              </div>
              <span>PRIME ACADEMY © 2026</span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Text Content & Morphing Tab Selectors (Symmetrical, wrapped in a beautiful light box border) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 bg-slate-50/70 border border-slate-100/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[420px] shadow-sm relative"
          >
            <div className="space-y-5">
              <div className="space-y-2 text-left">
                <Badge className="bg-secondary/15 text-secondary border border-secondary/20 px-4 py-1 uppercase tracking-widest text-[9px] font-bold rounded-full">
                  PORQUE NÓS?
                </Badge>
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary leading-tight uppercase tracking-tight">
                  A Excelência em Formação Executiva
                </h2>
                <p className="text-muted-foreground text-xs font-light leading-relaxed">
                  Clique nas vantagens abaixo para inspecionar em tempo real o funcionamento do nosso ecossistema de elite no painel oposto:
                </p>
              </div>

              {/* Clickable Morphing Tab Selectors */}
              <div className="space-y-2.5">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="w-full text-left flex gap-3.5 items-start p-3 rounded-2xl border transition-all duration-300 relative group"
                    >
                      {/* Active Sliding Tab Background Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabHighlight"
                          className="absolute inset-0 bg-white border border-slate-200/50 rounded-2xl -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}

                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${isActive
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-secondary/10 text-secondary border-secondary/20 group-hover:bg-secondary/20'
                        }`}>
                        <tab.icon className="w-4.5 h-4.5" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold transition-colors ${isActive ? 'text-primary' : 'text-primary/70 group-hover:text-primary'}`}>
                            {tab.title}
                          </h4>
                          {isActive && (
                            <span className="text-[7px] font-extrabold text-secondary bg-secondary/10 px-1 py-0.5 rounded-full border border-secondary/20">
                              {tab.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-light leading-relaxed">
                          {tab.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>

        </div>


      </div>
    </section>
  )
}
