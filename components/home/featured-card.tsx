import { Star, BadgeCheck, ArrowRight } from 'lucide-react'

interface FeaturedCardProps {
  title: string
  duration: string
  level: string
  regime: string
  vagasLimitadas?: boolean
  whatsappNumber?: string
}

export function FeaturedCard({
  title,
  duration,
  level,
  regime,
  vagasLimitadas = false,
  whatsappNumber = '+244921394946',
}: FeaturedCardProps) {
  const phone = whatsappNumber.replace(/[^0-9]/g, '')
  const message = encodeURIComponent(
    `Olá, Prime Academy! 👋 Desejo reservar o meu lugar no curso em destaque: *${title}*. Podem ajudar-me com as informações para inscrição?`
  )
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`

  return (
    <div className="flex flex-col p-5 space-y-4 text-white">
      {/* Header Badge & Title */}
      <div>
        <span className="text-[10px] tracking-wider bg-white/10 border border-white/15 px-2.5 py-1 rounded-full uppercase inline-flex items-center gap-1 font-bold text-slate-200 mb-2">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          EM DESTAQUE
        </span>
        <h3 className="text-base font-bold text-white leading-snug">{title}</h3>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs">
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Carga Horária</p>
          <p className="font-semibold text-white mt-0.5">{duration}</p>
        </div>
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Modalidade</p>
          <p className="font-semibold text-white mt-0.5">{regime}</p>
        </div>
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Nível</p>
          <p className="font-semibold text-white mt-0.5">{level}</p>
        </div>
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Certificado</p>
          <p className="font-semibold text-green-400 mt-0.5 flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0" /> Incluído
          </p>
        </div>
      </div>

      {/* Card Footer — Vagas Text Above Button + Full Width Pill CTA */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <span className="h-2 w-2 rounded-full bg-[#8a66a8] shrink-0 animate-pulse" />
          <span>Vagas Limitadas</span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-secondary hover:bg-secondary/90 text-white text-xs md:text-sm font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Reservar O Meu Lugar</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
