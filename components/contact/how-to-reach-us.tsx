'use client'

import { useState } from 'react'
import { Car, Bike, PersonStanding, Navigation, MapPin, Map, Layers } from 'lucide-react'

// ── Prime Academy Location ──────────────────────────────────────────────────
// t=m → Padrão (roadmap)  |  t=k → Satélite  |  t=p → Relevo (terrain)
const PRIME_Q     = 'Rua+28+de+Maio+Maianga+Luanda+Angola'
const PRIME_DADDR = 'Rua+28+de+Maio,+Maianga,+Luanda,+Angola'
const PRIME_LABEL = 'Rua 28 de Maio, Edifício 30, 6.º Andar Esq., Maianga, Luanda'

type MapType    = 'm' | 'k' | 'p'
type TravelMode = 'driving' | 'bicycling' | 'walking'

function buildMapSrc(mapType: MapType): string {
  return `https://maps.google.com/maps?q=${PRIME_Q}&output=embed&z=17&t=${mapType}&hl=pt`
}

function buildRouteSrc(origin: string, mode: TravelMode, mapType: MapType): string {
  const enc = encodeURIComponent(origin)
  return `https://maps.google.com/maps?saddr=${enc}&daddr=${PRIME_DADDR}&output=embed&travelmode=${mode}&t=${mapType}&hl=pt`
}

export function HowToReachUs() {
  const [origin, setOrigin]         = useState('')
  const [travelMode, setTravelMode] = useState<TravelMode>('driving')
  const [mapType, setMapType]       = useState<MapType>('k')       // default: Satélite
  const [iframeSrc, setIframeSrc]   = useState(buildMapSrc('k'))
  const [showRoute, setShowRoute]   = useState(false)

  // ── Switch map type (keeps route if active) ──────────────────────────────
  const handleMapType = (type: MapType) => {
    setMapType(type)
    setIframeSrc(
      showRoute && origin.trim()
        ? buildRouteSrc(origin, travelMode, type)
        : buildMapSrc(type)
    )
  }

  // ── Traçar Rota — updates iframe internally ──────────────────────────────
  const handleTracarRota = () => {
    if (!origin.trim()) return
    setShowRoute(true)
    setIframeSrc(buildRouteSrc(origin, travelMode, mapType))
  }

  // ── Reset to location view ───────────────────────────────────────────────
  const handleReset = () => {
    setShowRoute(false)
    setOrigin('')
    setIframeSrc(buildMapSrc(mapType))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleTracarRota()
  }

  const mapTypeButtons: { value: MapType; label: string; icon: React.ReactNode }[] = [
    { value: 'm', label: 'Padrão',   icon: <Map className="h-3.5 w-3.5" /> },
    { value: 'k', label: 'Satélite', icon: <Layers className="h-3.5 w-3.5" /> },
    { value: 'p', label: 'Relevo',   icon: <Layers className="h-3.5 w-3.5 rotate-45" /> },
  ]

  return (
    <section className="py-10 md:py-16 bg-[#f8f7fb]">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Section Title ─────────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">
            Localização
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#312455] mt-2">
            Como Chegar até Nós
          </h2>
          <div className="mx-auto mt-3 w-16 h-1 rounded-full bg-[#8a66a8]" />
          <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Utilize o planeador de rota para obter as melhores indicações até às nossas instalações em Luanda.
          </p>
        </div>

        {/* ── Route Planner Bar ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-2.5 sm:p-3 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">

          {/* Label */}
          <div className="flex items-center gap-3 shrink-0 px-1">
            <div className="bg-[#312455]/10 p-2.5 rounded-xl">
              <Navigation className="h-5 w-5 text-[#312455]" />
            </div>
            <span className="font-bold text-[#312455] text-sm whitespace-nowrap">
              Planeador de Rota
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch bg-slate-200 mx-1" />

          {/* Origin Input */}
          <input
            id="route-origin-input"
            type="text"
            value={origin}
            onChange={(e) => { setOrigin(e.target.value); if (showRoute) handleReset() }}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Largo do Kinaxxi, Luanda"
            className="flex-1 text-sm text-slate-700 placeholder-slate-300 outline-none border border-slate-100 sm:border-none bg-slate-50 sm:bg-transparent rounded-xl px-4 py-2.5 sm:py-0 sm:px-2 min-w-0"
          />

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch bg-slate-200 mx-1" />

          {/* Travel Mode Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 self-center">
            {(
              [
                { mode: 'driving'   as TravelMode, icon: <Car className="h-4 w-4" />,            label: 'Carro' },
                { mode: 'bicycling' as TravelMode, icon: <Bike className="h-4 w-4" />,           label: 'Bicicleta' },
                { mode: 'walking'   as TravelMode, icon: <PersonStanding className="h-4 w-4" />, label: 'A pé' },
              ]
            ).map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setTravelMode(mode)}
                title={label}
                aria-label={label}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  travelMode === mode
                    ? 'bg-[#312455] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            id="tracar-rota-btn"
            onClick={handleTracarRota}
            disabled={!origin.trim()}
            className="shrink-0 bg-[#312455] hover:bg-[#8a66a8] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Traçar Rota</span>
            <Navigation className="h-4 w-4" />
          </button>
        </div>

        {/* ── Map Container ─────────────────────────────────────────────── */}
        <div className="relative w-full h-[360px] md:h-[430px] overflow-hidden rounded-2xl shadow-lg border border-slate-100">

          {/* iframe */}
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Prime Academy"
            className="absolute inset-0"
          />

          {/* ── Location Card (top-right overlay) ───────────────────────── */}
          {!showRoute && (
            <div className="absolute top-4 right-4 z-10 bg-[#1e1735]/95 backdrop-blur-sm text-white rounded-2xl shadow-xl px-5 py-4 max-w-[220px] border border-white/10">
              <div className="flex items-start gap-2.5 mb-2">
                <MapPin className="h-4 w-4 text-[#8a66a8] shrink-0 mt-0.5" />
                <p className="font-bold text-sm leading-tight text-white">
                  Prime Academy
                </p>
              </div>
              <p className="text-white/70 text-xs leading-relaxed pl-6">
                {PRIME_LABEL}
              </p>
            </div>
          )}

          {/* ── Reset Route Button ───────────────────────────────────────── */}
          {showRoute && (
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm text-[#312455] font-bold text-xs px-4 py-2.5 rounded-xl shadow-md border border-slate-200 hover:bg-white transition-all flex items-center gap-2"
            >
              <MapPin className="h-3.5 w-3.5" />
              Ver Localização
            </button>
          )}

          {/* ── Map Type Switcher (bottom-left overlay) ──────────────────── */}
          <div className="absolute bottom-5 left-5 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-slate-200 p-1">
            {mapTypeButtons.map(({ value, label, icon }) => (
              <button
                key={value}
                id={`map-type-${value}`}
                onClick={() => handleMapType(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  mapType === value
                    ? 'bg-[#312455] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
