'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Play,
  User,
  GraduationCap,
  BookOpen,
  Monitor,
  Car,
  Bike,
  PersonStanding,
  Navigation,
  Map,
  Layers,
  X
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { getCourses } from '@/lib/hygraph'

export interface OnlineClass {
  id: string
  courseId: string
  courseName: string
  title: string
  instructor: string
  date: string
  time: string
  type: 'live' | 'presencial'
  meetingUrl?: string
  room?: string
  address?: string
  tags: string[]
  duration?: string
}

/** Returns up to 2 uppercase initials from a full name string, ignoring academic/professional titles */
const TITLE_PREFIXES = new Set(['prof', 'dr', 'dra', 'eng', 'msc', 'phd', 'sr', 'sra', 'prof.', 'dr.', 'dra.', 'eng.'])

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .filter((part) => !TITLE_PREFIXES.has(part.toLowerCase().replace('.', '')))
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const initialClasses: OnlineClass[] = []

/** Format an ISO date string (YYYY-MM-DD) to a readable Portuguese date */
function formatDate(iso: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-AO', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

// ── Prime Academy fixed location constants (mirrors how-to-reach-us.tsx) ─────
const PRIME_Q     = 'Rua+28+de+Maio+Maianga+Luanda+Angola'
const PRIME_DADDR = 'Rua+28+de+Maio,+Maianga,+Luanda,+Angola'
const PRIME_LABEL = 'Rua 28 de Maio, Edifício 30, 6.º Andar Esq., Maianga, Luanda'

type MapType    = 'm' | 'k' | 'p'
type TravelMode = 'driving' | 'bicycling' | 'walking'

/** Static location pin — same URL used in the public Contact page */
function buildMapSrc(mapType: MapType): string {
  return `https://maps.google.com/maps?q=${PRIME_Q}&output=embed&z=17&t=${mapType}&hl=pt`
}

/** Directions URL — drives the route inside the iframe natively */
function buildRouteSrc(origin: string, mode: TravelMode, mapType: MapType): string {
  const originQuery = origin.toLowerCase().includes('angola') ? origin.trim() : `${origin.trim()}, Luanda, Angola`
  const enc = encodeURIComponent(originQuery)
  return `https://maps.google.com/maps?saddr=${enc}&daddr=${PRIME_DADDR}&output=embed&travelmode=${mode}&t=${mapType}&hl=pt`
}

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  destination: string
  title: string
}

export function MapModal({ isOpen, onClose, title }: MapModalProps) {
  const [origin, setOrigin]         = useState('')
  const [travelMode, setTravelMode] = useState<TravelMode>('driving')
  const [mapType, setMapType]       = useState<MapType>('k')
  const [iframeSrc, setIframeSrc]   = useState(() => buildMapSrc('k'))
  const [showRoute, setShowRoute]   = useState(false)

  if (!isOpen) return null

  // ── Switch map type while respecting current mode (pin vs route) ──────────
  const handleMapType = (type: MapType) => {
    setMapType(type)
    setIframeSrc(
      showRoute && origin.trim()
        ? buildRouteSrc(origin, travelMode, type)
        : buildMapSrc(type)
    )
  }

  // ── Traçar Rota — updates iframe src reactively inside the modal ──────────
  const handleTracarRota = () => {
    if (!origin.trim()) return
    setShowRoute(true)
    setIframeSrc(buildRouteSrc(origin, travelMode, mapType))
  }

  // ── Reset to static pin view ──────────────────────────────────────────────
  const handleReset = () => {
    setShowRoute(false)
    setOrigin('')
    setIframeSrc(buildMapSrc(mapType))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-[#312455]/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Content Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[85vh] z-10 animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="p-6 bg-[#312455] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-xl">
              <Navigation className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">Planeador de Rota</h3>
              <p className="text-[10px] text-white/60 font-semibold">{title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Route Planner Inputs */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-3 text-xs">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-slate-200/60 px-3 py-1.5 shadow-xs">
            <MapPin className="h-4 w-4 text-[#8a66a8] shrink-0" />
            <input
              type="text"
              placeholder="Digite o seu ponto de partida (Ex: Largo do Kinaxxi)"
              value={origin}
              onChange={(e) => { setOrigin(e.target.value); if (showRoute) handleReset() }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleTracarRota() }}
              className="w-full bg-transparent outline-none text-slate-700 font-semibold placeholder-slate-300"
            />
          </div>

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
                className={`p-2 rounded-xl transition-all ${
                  travelMode === mode
                    ? 'bg-[#312455] text-white shadow-xs'
                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/50'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          <button
            onClick={handleTracarRota}
            disabled={!origin.trim()}
            className="bg-[#312455] hover:bg-[#8a66a8] disabled:opacity-40 text-white font-black text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Traçar Rota</span>
            <Navigation className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative overflow-hidden bg-slate-50">
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa Prime Academy"
            className="absolute inset-0 w-full h-full"
          />

          {/* Static pin overlay — hidden when route is active */}
          {!showRoute && (
            <div className="absolute top-4 right-4 bg-[#312455]/95 backdrop-blur-xs text-white rounded-2xl shadow-lg border border-white/10 p-4 max-w-[240px]">
              <div className="flex items-start gap-2 mb-1.5">
                <MapPin className="h-4 w-4 text-[#8a66a8] shrink-0 mt-0.5" />
                <p className="font-extrabold text-xs text-white leading-tight">Local da Aula</p>
              </div>
              <p className="text-[10px] text-white/70 leading-relaxed font-semibold pl-6">{PRIME_LABEL}</p>
            </div>
          )}

          {/* Reset button — visible only when route is displayed */}
          {showRoute && (
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-xs text-[#312455] font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-md border border-slate-200 hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5" />
              Ver Localização
            </button>
          )}

          {/* Map Type Switcher */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-slate-200/80 p-1">
            {(
              [
                { value: 'm' as MapType, label: 'Padrão',   icon: <Map className="h-3.5 w-3.5" /> },
                { value: 'k' as MapType, label: 'Satélite', icon: <Layers className="h-3.5 w-3.5" /> },
                { value: 'p' as MapType, label: 'Relevo',   icon: <Layers className="h-3.5 w-3.5 rotate-45" /> },
              ]
            ).map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => handleMapType(value)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  mapType === value
                    ? 'bg-[#312455] text-white shadow-xs'
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
    </div>
  )
}

interface VirtualRoomsTabProps {
  isInstructor: boolean
  availableCourses: { id: string; name: string; online: boolean }[]
  activeTab?: 'live' | 'presencial'
  setActiveTab?: (tab: 'live' | 'presencial') => void
  showScheduleForm?: boolean
  setShowScheduleForm?: (show: boolean) => void
}

/** Returns today's date in YYYY-MM-DD format for the min attribute of the date input */
function todayISO(): string {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

const LOCAL_STORAGE_KEY = 'prime_academy_virtual_rooms_data'

export function VirtualRoomsTab({ isInstructor, availableCourses, activeTab: externalActiveTab, setActiveTab: externalSetActiveTab, showScheduleForm: externalShowScheduleForm, setShowScheduleForm: externalSetShowScheduleForm }: VirtualRoomsTabProps) {
  const { user } = useAuth()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [selectedMapClass, setSelectedMapClass] = useState<OnlineClass | null>(null)

  // Load and save state to LocalStorage for full real-time sync between instructor and student views
  const [classes, setClasses] = useState<OnlineClass[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {

        }
      }
    }
    return initialClasses
  })

  // Load and cache all Hygraph courses for Admin Course selection select dropdown
  const [catalogCourses, setCatalogCourses] = useState<{ id: string; name: string }[]>([])
  const [formCourseId, setFormCourseId] = useState('')

  useEffect(() => {
    async function loadCatalog() {
      try {
        const all = await getCourses()
        if (all) {
          setCatalogCourses(all.map(c => ({ id: c.id, name: c.name })))
        }
      } catch (err) {

      }
    }
    if (isInstructor) {
      loadCatalog()
    }
  }, [isInstructor])

  // Function to load classes from Supabase - reusable for refresh
  const loadOnlineClasses = async () => {
    try {
      const { data: dbClasses, error } = await supabase
        .from('aulas_online')
        .select('*')
        .order('date', { ascending: true })

      if (error) {

        return
      }

      if (dbClasses && dbClasses.length > 0) {
        const mapped: OnlineClass[] = dbClasses.map((item: any) => ({
          id: item.id,
          courseId: item.course_id,
          courseName: item.course_name,
          title: item.title,
          instructor: item.instructor,
          date: item.date,
          time: item.time,
          type: item.type as 'live' | 'presencial',
          meetingUrl: item.meeting_url || undefined,
          room: item.room || undefined,
          address: item.address || undefined,
          tags: item.tags || [],
          duration: item.duration || undefined
        }))
        setClasses(mapped)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped))
      }
    } catch (err) {

    }
  }

  // Load classes from Supabase on component mount
  useEffect(() => {
    loadOnlineClasses()
  }, [])

  const [internalActiveTab, setInternalActiveTab] = useState<'live' | 'presencial'>('live')
  const [internalShowScheduleForm, setInternalShowScheduleForm] = useState(false)
  
  // Use external state if provided, otherwise use internal state
  const activeTab = externalActiveTab ?? internalActiveTab
  const setActiveTab = externalSetActiveTab ?? setInternalActiveTab
  const showScheduleForm = externalShowScheduleForm ?? internalShowScheduleForm
  const setShowScheduleForm = externalSetShowScheduleForm ?? setInternalShowScheduleForm

  // Form states for scheduling - manual inputs
  const [formCourseName, setFormCourseName] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formInstructor, setFormInstructor] = useState('')
  const [formDate, setFormDate] = useState(todayISO())
  const [formTime, setFormTime] = useState('')
  const [formType, setFormType] = useState<'live' | 'presencial'>('live')
  const [formUrl, setFormUrl] = useState('')
  const [formRoom, setFormRoom] = useState('')
  const [formAddress, setFormAddress] = useState('Prime Academy (Sede)')
  const [formDuration, setFormDuration] = useState('')

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    const instructorName = formInstructor || 'A definir'
    
    if (!formCourseId || !formCourseName || !formTitle || !formDate || !formInstructor) {
      toast.error('Preencha os campos obrigatórios (Curso, Título, Dia da Aula, Formador).')
      return
    }

    if (formType === 'live' && !formUrl) {
      toast.error('Link da Sala Virtual é obrigatório para aulas Online.')
      return
    }

    // Generate tags based on type (only 'Online' or 'Presencial')
    const tagsList = formType === 'live' ? ['Online'] : ['Presencial']
    const generatedId = Math.random().toString(36).substr(2, 9)
    const courseId = formCourseId

    const newClass: OnlineClass = {
      id: generatedId,
      courseId: courseId,
      courseName: formCourseName,
      title: formTitle,
      instructor: instructorName,
      date: formDate,
      time: formTime || '',
      type: formType,
      meetingUrl: formType === 'live' ? formUrl : undefined,
      room: formType === 'presencial' ? formRoom || 'Sala Geral' : undefined,
      address: formType === 'presencial' ? formAddress || 'Edifício Prime, Luanda' : undefined,
      tags: tagsList,
      duration: formDuration || undefined
    }

    try {
      const { data, error } = await supabase
        .from('aulas_online')
        .insert([{
          course_id: courseId,
          course_name: formCourseName,
          title: formTitle,
          instructor: instructorName,
          date: formDate,
          time: formTime || '',
          type: formType,
          meeting_url: formType === 'live' ? formUrl : null,
          room: formType === 'presencial' ? formRoom || 'Sala Geral' : null,
          address: formType === 'presencial' ? formAddress || 'Edifício Prime, Luanda' : null,
          tags: tagsList,
          duration: formDuration || null
        }])
        .select()

      if (!error && data && data.length > 0) {
        newClass.id = data[0].id

        // Dispatch notification broadcast to all active enrolled students of this course
        try {
          const { data: matriculados, error: enrollError } = await supabase
            .from('matriculas')
            .select('perfil_id')
            .eq('curso_id_catalogo', courseId)

          if (!enrollError && matriculados && matriculados.length > 0) {
            const notifs = matriculados.map(student => ({
              perfil_id: student.perfil_id,
              tipo: 'aula',
              titulo: 'Nova Aula Agendada',
              descricao: `A aula "${formTitle}" foi agendada para o dia ${formDate}.`,
              lida: false
            }))

            const { error: notifInsertError } = await supabase
              .from('notificacoes')
              .insert(notifs)
            
            if (notifInsertError) {

            }
          }
        } catch (notifErr) {

        }
      } else if (error) {

      }
    } catch (err) {

    }

    const updated = [newClass, ...classes]
    setClasses(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    toast.success('Aula agendada com sucesso!')
    setShowScheduleForm(false)

    // Reload from database to sync with other users/tabs
    loadOnlineClasses()

    // Reset fields
    setFormCourseId('')
    setFormCourseName('')
    setFormTitle('')
    setFormInstructor('')
    setFormDate(todayISO())
    setFormTime('')
    setFormUrl('')
    setFormRoom('')
    setFormAddress('')
    setFormDuration('')
  }

  const handleDeleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('aulas_online')
        .delete()
        .eq('id', id)

      if (error) {

      }
    } catch (err) {

    }

    const updated = classes.filter(c => c.id !== id)
    setClasses(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    toast.success('Aula removida.')

    // Reload from database to sync with other users/tabs
    loadOnlineClasses()
  }

  const filteredClasses = classes.filter(c => {
    // 1. Filter by format (Online vs Presencial)
    const matchesFormat = activeTab === 'live' ? c.type === 'live' : c.type === 'presencial'
    if (!matchesFormat) return false

    // 2. If student, only show classes for courses they are active in (availableCourses)
    if (!isInstructor) {
      return availableCourses.some(ac => 
        ac.id === c.courseId || 
        ac.name.toLowerCase() === c.courseName.toLowerCase() || 
        c.courseId.includes(ac.id) || 
        ac.id.includes(c.courseId)
      )
    }

    return true
  })

  return (
    <div className="space-y-6 pt-[160px] md:pt-0">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[#312455]">Aulas Agendadas</h2>
        <p className="text-sm text-slate-500 font-medium">Tens {filteredClasses.length} aulas programadas.</p>
      </div>

      {/* HEADER SECTION - Minimalist top bar (hidden on mobile, visible on desktop) */}
      <div className="hidden md:flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-6">
          <div className="flex gap-3 text-sm font-semibold">
            <button
              onClick={() => {
                setActiveTab('live')
                setShowScheduleForm(false)
              }}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'live'
                  ? 'bg-[#312455] text-white shadow-sm font-black'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <Play className="h-4 w-4" />
              Online
            </button>
            <button
              onClick={() => {
                setActiveTab('presencial')
                setShowScheduleForm(false)
              }}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'presencial'
                  ? 'bg-[#312455] text-white shadow-sm font-black'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <MapPin className="h-4 w-4" />
              Presencial
            </button>
          </div>
        </div>

        {isInstructor && (
          <Button
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className={`text-xs font-bold text-white flex items-center gap-2 h-10 px-3 rounded-lg transition-all ${
              showScheduleForm ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-[#312455] to-[#8a66a8] hover:from-[#4a347c] hover:to-[#9f7bbd]'
            }`}
          >
            <Plus className="h-4 w-4" />
            {showScheduleForm ? 'Cancelar' : 'Agendar Aula'}
          </Button>
        )}
      </div>

      {/* COMPACT SCHEDULING FORM */}
      <AnimatePresence>
        {isInstructor && showScheduleForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="overflow-hidden"
          >
            <Card className="border border-slate-100 bg-white shadow-xs rounded-2xl p-5 mb-2 max-w-2xl text-xs">
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="form-course" className="font-semibold text-slate-500">Curso *</Label>
                    <select
                      id="form-course"
                      value={formCourseId}
                      onChange={(e) => {
                        const cid = e.target.value
                        setFormCourseId(cid)
                        const matched = (catalogCourses.length > 0 ? catalogCourses : availableCourses).find(c => c.id === cid)
                        if (matched) {
                          setFormCourseName(matched.name)
                        } else {
                          setFormCourseName('')
                        }
                      }}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#8a66a8] transition-all cursor-pointer"
                      required
                    >
                      <option value="">Selecione um curso...</option>
                      {(catalogCourses.length > 0 ? catalogCourses : availableCourses).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="form-title" className="font-semibold text-slate-500">Título da Aula *</Label>
                    <Input
                      id="form-title"
                      placeholder="Ex: Módulo 3: Fórmulas Dinâmicas"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="h-8 rounded-lg border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="form-instructor" className="font-semibold text-slate-500">Formador *</Label>
                    <Input
                      id="form-instructor"
                      placeholder="Ex: João Silva"
                      value={formInstructor}
                      onChange={(e) => setFormInstructor(e.target.value)}
                      className="h-8 rounded-lg border-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="form-date" className="font-semibold text-slate-500">Dia da Aula *</Label>
                    <input
                      id="form-date"
                      type="date"
                      value={formDate}
                      min={todayISO()}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#8a66a8] transition-all cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="form-time" className="font-semibold text-slate-500">Horário</Label>
                    <Input
                      id="form-time"
                      placeholder="18:30 - 20:30 (Opcional)"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="h-8 rounded-lg border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="form-duration" className="font-semibold text-slate-500">Duração</Label>
                    <Input
                      id="form-duration"
                      placeholder="Ex: 1h 30m ou 2h"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      className="h-8 rounded-lg border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="form-type" className="font-semibold text-slate-500">Formato</Label>
                    <select
                      id="form-type"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:ring-1 focus:ring-[#8a66a8] transition-all"
                    >
                      <option value="live">Online</option>
                      <option value="presencial">Presencial (Sala Física)</option>
                    </select>
                  </div>

                  {formType === 'presencial' ? (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="form-room" className="font-semibold text-slate-500">Sala</Label>
                        <Input
                          id="form-room"
                          placeholder="Sala 204"
                          value={formRoom}
                          onChange={(e) => setFormRoom(e.target.value)}
                          className="h-8 rounded-lg border-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="form-address" className="font-semibold text-slate-500">Localização *</Label>
                        <Input
                          id="form-address"
                          placeholder="Edifício Prime, Luanda"
                          value={formAddress}
                          onChange={(e) => setFormAddress(e.target.value)}
                          className="h-8 rounded-lg border-slate-200"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="form-url" className="font-semibold text-slate-500">Link da Sala Virtual *</Label>
                      <Input
                        id="form-url"
                        placeholder="https://link-da-aula.com/..."
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        className="h-8 rounded-lg border-slate-200"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="submit"
                    className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-lg h-8 text-[11px] font-black px-4 cursor-pointer shadow-xs"
                  >
                    Publicar Agenda
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REFERENCED CONSULTANT CARD GRID LAYOUT - Hidden on mobile when form is open */}
      {!(showScheduleForm && isInstructor) && (
        <AnimatePresence mode="popLayout">
          {filteredClasses.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20 min-h-[36vh]"
            >
              <div className="text-center">
                <p className="text-sm font-extrabold text-[#312455] mb-2">
                  {activeTab === 'live' ? 'Nenhuma aula online agendada' : 'Nenhuma aula presencial agendada'}
                </p>
                <p className="text-xs font-semibold text-slate-400 tracking-wide mb-4">
                  {activeTab === 'live'
                    ? 'No momento não existem aulas online para os seus cursos ativos.'
                    : 'No momento não existem aulas presenciais agendadas para os seus cursos ativos.'}
                </p>
                {/* no CTA buttons here by design; keep message concise */}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
            {filteredClasses.map((c) => {
              const isLiveNow = c.type === 'live'
              const isPresencial = c.type === 'presencial'

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <Card className="relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-md border border-white/20 shadow-xl flex flex-col h-full group transition-all duration-300">
                    
                    {/* Header: Avatar, Name, Trash (discrete) */}
                    <div className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full shrink-0 bg-gradient-to-br from-[#312455] to-[#8a66a8] flex items-center justify-center shadow-sm">
                        <span className="text-white text-xs font-black tracking-tight select-none">
                          {getInitials(c.instructor)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">{c.title}</h3>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{c.instructor}</p>
                      </div>
                      
                      {/* Discrete trash button */}
                      {isInstructor && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {deleteConfirmId === c.id ? (
                            <div className="flex items-center gap-1 bg-red-50 border border-red-200/50 rounded-lg p-1 shadow-xs">
                              <span className="text-[9px] text-red-600 font-extrabold px-1">Eliminar?</span>
                              <button
                                type="button"
                                onClick={() => { handleDeleteClass(c.id); setDeleteConfirmId(null) }}
                                className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded cursor-pointer"
                              >Sim</button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-[9px] bg-slate-200 text-slate-700 font-black px-1.5 py-0.5 rounded cursor-pointer"
                              >Não</button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(c.id)}
                              className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                              title="Eliminar Aula"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content: Course, Duration, Status (with pulsing dot) */}
                    <div className="px-6 pb-2 space-y-3">
                      <div className="flex items-center gap-2">
                        {isLiveNow ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold text-[10px] uppercase tracking-wide px-3 py-1 rounded-full flex items-center gap-1.5 relative">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute" />
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Online
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold text-[10px] uppercase tracking-wide px-3 py-1 rounded-full">
                            Presencial
                          </Badge>
                        )}
                      </div>
                      <div className="text-[12px] text-slate-600 font-semibold">
                        {c.courseName} | {c.duration || '60 min'}
                      </div>
                    </div>

                    {/* Schedule Highlight */}
                    <div className="mx-6 my-4 bg-purple-50 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-purple-900 font-bold text-lg leading-none">{c.time}</span>
                        <span className="text-purple-700 text-xs font-semibold uppercase tracking-wider mt-1">{formatDate(c.date)}</span>
                      </div>
                    </div>

                    {/* Footer: Action button gradient */}
                    <div className="p-6 pt-0 mt-auto">
                      {isInstructor ? (
                        <Button
                          onClick={() => {
                            if (c.type === 'presencial') {
                              toast.info('Funcionalidade de gestão de presenças em breve.')
                            } else if (c.meetingUrl) {
                              window.open(c.meetingUrl, '_blank')
                            }
                          }}
                          className="w-full bg-gradient-to-r from-[#312455] to-[#8a66a8] hover:from-[#4a347c] hover:to-[#9f7bbd] text-white rounded-2xl h-12 font-bold text-sm shadow-md shadow-purple-950/20"
                        >
                          {c.type === 'presencial' ? 'GERIR PRESENÇAS' : 'INICIAR AULA'}
                        </Button>
                      ) : (
                        <>
                          {isLiveNow ? (
                            <Button asChild className="w-full bg-gradient-to-r from-[#312455] to-[#8a66a8] hover:from-[#4a347c] hover:to-[#9f7bbd] text-white rounded-2xl h-12 font-bold text-sm shadow-md shadow-purple-950/20">
                              <a href={c.meetingUrl} target="_blank" rel="noopener noreferrer">ASSISTIR AULA</a>
                            </Button>
                          ) : (
                            <Button onClick={() => setSelectedMapClass(c)} className="w-full bg-gradient-to-r from-[#312455] to-[#8a66a8] hover:from-[#4a347c] hover:to-[#9f7bbd] text-white rounded-2xl h-12 font-bold text-sm shadow-md shadow-purple-950/20">
                              VER DIREÇÕES
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
      )}

      <MapModal
        isOpen={!!selectedMapClass}
        onClose={() => setSelectedMapClass(null)}
        destination={selectedMapClass?.address || 'Rua 28 de Maio, Maianga, Luanda, Angola'}
        title={selectedMapClass?.title || 'Aula Presencial'}
      />
    </div>
  )
}
