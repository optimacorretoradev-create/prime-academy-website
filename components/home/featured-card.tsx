import { Star, BadgeCheck } from 'lucide-react'
import Link from 'next/link'

interface FeaturedCardProps {
  title: string
  duration: string
  level: string
  regime: string
  vagasLimitadas?: boolean
}

export function FeaturedCard({ title, duration, level, regime, vagasLimitadas = false }: FeaturedCardProps) {
  return (
    <>
      {/* Card Header */}
      <div className="bg-[#312455]/80 px-4 pt-4 pb-3">
        <span className="text-[10px] tracking-wider bg-white/20 px-2 py-0.5 rounded-xl uppercase inline-block font-bold text-white">
          <Star className="h-3 w-3 inline-block mr-1 fill-secondary text-secondary" />
          EM DESTAQUE
        </span>
        <h3 className="text-base font-bold text-white mt-2 leading-snug">{title}</h3>
      </div>

      {/* Card Body - Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <div>
          <p className="text-xs font-semibold text-white">{duration}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Carga Horária</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{regime}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Modalidade</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{level}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Nível do Programa</p>
        </div>
        <div className="flex items-start gap-1">
          <BadgeCheck className="h-3 w-3 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-white">Incluído</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Certificado</p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-white/10 pt-2 flex items-center justify-between gap-1 px-3 pb-3">
        {vagasLimitadas ? (
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold text-purple-300">Vagas Limitadas</span>
          </div>
        ) : <div />}
        <Link
          href="/enroll"
          className="bg-secondary hover:bg-secondary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
        >
          Inscrever-me
        </Link>
      </div>
    </>
  )
}
