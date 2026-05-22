'use client'

import { motion } from 'framer-motion'

export function LoginRightPanel() {
  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#312455]">
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105 filter blur-[1px] opacity-25"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#312455]/98 via-[#4b3684]/95 to-[#1c1333]/98" />
      
      {/* Dynamic Abstract Glowing Orbs */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#8a66a8]/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#312455]/40 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col justify-center p-16 text-white max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a66a8] bg-[#8a66a8]/10 px-3.5 py-1.5 rounded-full border border-[#8a66a8]/25 w-fit block">
              Educação do Futuro
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white tracking-tight">
              Transforme a sua carreira com a Prime Academy
            </h2>
            <p className="text-base text-slate-300 font-light leading-relaxed">
              Aceda a cursos certificados de alta qualidade, aprenda ao seu ritmo e impulsione o seu crescimento profissional com mentores de referência.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] p-4 rounded-[1.25rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8a66a8] to-[#9c7cb8] flex items-center justify-center shrink-0 shadow-md">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Formação Executiva Flexível</h4>
                <p className="text-slate-300 text-xs mt-0.5">Mais de 50 cursos estruturados 100% online.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] p-4 rounded-[1.25rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8a66a8] to-[#9c7cb8] flex items-center justify-center shrink-0 shadow-md">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Certificação Reconhecida</h4>
                <p className="text-slate-300 text-xs mt-0.5">Adicione valor curricular com diplomas certificados.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] p-4 rounded-[1.25rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8a66a8] to-[#9c7cb8] flex items-center justify-center shrink-0 shadow-md">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Tutores e Mentoria de Elite</h4>
                <p className="text-slate-300 text-xs mt-0.5">Apoio contínuo e orientação de especialistas de topo.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
