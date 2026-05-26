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
  Monitor
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'

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

const initialClasses: OnlineClass[] = [
  {
    id: '1',
    courseId: 'excel-avancado',
    courseName: 'Excel Avançado',
    title: 'Módulo 3: Fórmulas Dinâmicas & ProcX Avançado',
    instructor: 'Prof. Carlos Santos',
    date: '2026-05-26',
    time: '19:30 - 21:00',
    type: 'live',
    meetingUrl: 'https://zoom.us/j/123456789',
    tags: ['Online'],
    duration: '1h 30m de duração'
  },
  {
    id: '3',
    courseId: 'gestao-de-projectos',
    courseName: 'Gestão de Projectos',
    title: 'Módulo 2: Planeamento de Âmbito & Cronogramas',
    instructor: 'Dr. António Mateus',
    date: '2026-05-27',
    time: '18:30 - 20:30',
    type: 'presencial',
    room: 'Sala 204',
    address: 'Edifício Prime, Av. Lenine, Luanda',
    tags: ['Presencial'],
    duration: '2h de aula presencial'
  },
  {
    id: '4',
    courseId: 'gestao-de-projectos',
    courseName: 'Gestão de Projectos',
    title: 'Módulo 3: Gestão de Custos e EVM Avançado',
    instructor: 'Dr. António Mateus',
    date: '2026-05-29',
    time: '18:30 - 20:30',
    type: 'presencial',
    room: 'Sala 204',
    address: 'Edifício Prime, Av. Lenine, Luanda',
    tags: ['Presencial'],
    duration: '2h de aula presencial'
  }
]

/** Format an ISO date string (YYYY-MM-DD) to a readable Portuguese date */
function formatDate(iso: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-AO', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

interface VirtualRoomsTabProps {
  isInstructor: boolean
  availableCourses: { id: string; name: string; online: boolean }[]
}

/** Returns today's date in YYYY-MM-DD format for the min attribute of the date input */
function todayISO(): string {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

const LOCAL_STORAGE_KEY = 'prime_academy_virtual_rooms_data'

export function VirtualRoomsTab({ isInstructor, availableCourses }: VirtualRoomsTabProps) {
  const { user } = useAuth()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Load and save state to LocalStorage for full real-time sync between instructor and student views
  const [classes, setClasses] = useState<OnlineClass[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Erro ao ler localStorage:', e)
        }
      }
    }
    return initialClasses
  })

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(classes))
  }, [classes])

  const [activeTab, setActiveTab] = useState<'live' | 'presencial'>('live')
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  // Form states for scheduling - manual inputs
  const [formCourseName, setFormCourseName] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formInstructor, setFormInstructor] = useState('')
  const [formDate, setFormDate] = useState(todayISO())
  const [formTime, setFormTime] = useState('')
  const [formType, setFormType] = useState<'live' | 'presencial'>('live')
  const [formUrl, setFormUrl] = useState('')
  const [formRoom, setFormRoom] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formDuration, setFormDuration] = useState('')

  // Set formInstructor to logged-in user name automatically
  useEffect(() => {
    if (user?.name) {
      setFormInstructor(user.name)
    }
  }, [user])

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault()
    const instructorName = user?.name || formInstructor || 'Professor'
    if (!formTitle || !formDate || !formTime || !instructorName || !formCourseName) {
      toast.error('Preencha os campos obrigatórios.')
      return
    }

    // Generate tags based on type (only 'Online' or 'Presencial')
    const tagsList = formType === 'live' ? ['Online'] : ['Presencial']
    const generatedId = Math.random().toString(36).substr(2, 9)
    const courseId = formCourseName.toLowerCase().replace(/\s+/g, '-')

    const newClass: OnlineClass = {
      id: generatedId,
      courseId: courseId,
      courseName: formCourseName,
      title: formTitle,
      instructor: instructorName,
      date: formDate,
      time: formTime,
      type: formType,
      meetingUrl: formType === 'live' ? formUrl || 'https://zoom.us/j/mock' : undefined,
      room: formType === 'presencial' ? formRoom || 'Sala Geral' : undefined,
      address: formType === 'presencial' ? formAddress || 'Edifício Prime, Luanda' : undefined,
      tags: tagsList,
      duration: formDuration || (formType === 'presencial' ? '2h de aula presencial' : '1h 30m de duração')
    }

    setClasses([newClass, ...classes])
    toast.success('Aula agendada!')
    setShowScheduleForm(false)

    // Reset fields
    setFormCourseName('')
    setFormTitle('')
    setFormDate(todayISO())
    setFormTime('')
    setFormUrl('')
    setFormRoom('')
    setFormAddress('')
    setFormDuration('')
  }

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id))
    toast.success('Aula removida.')
  }

  const filteredClasses = classes.filter(c => {
    if (activeTab === 'live') {
      return c.type === 'live'
    } else {
      return c.type === 'presencial'
    }
  })

  return (
    <div className="space-y-6">
      {/* HEADER SECTION - Minimalist top bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('live')
                setShowScheduleForm(false)
              }}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'live' ? 'text-[#312455] font-black' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Ao Vivo
              {activeTab === 'live' && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#312455]"
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('presencial')
                setShowScheduleForm(false)
              }}
              className={`relative py-1.5 transition-colors cursor-pointer ${
                activeTab === 'presencial' ? 'text-[#312455] font-black' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Presencial
              {activeTab === 'presencial' && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#312455]"
                />
              )}
            </button>
          </div>
        </div>

        {isInstructor && (
          <Button
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            variant="ghost"
            className="text-xs font-bold text-slate-500 hover:text-[#312455] flex items-center gap-1 cursor-pointer h-8 px-2.5 rounded-lg border border-slate-200/50 hover:bg-slate-50 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
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
            <Card className="border border-slate-100 bg-white shadow-xs rounded-2xl p-5 mb-4 max-w-2xl text-xs">
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    {/* Real Course Input - Manual fill in */}
                    <Label htmlFor="form-course" className="font-semibold text-slate-500">Curso *</Label>
                    <Input
                      id="form-course"
                      placeholder="Ex: Excel Avançado"
                      value={formCourseName}
                      onChange={(e) => setFormCourseName(e.target.value)}
                      className="h-8 rounded-lg border-slate-200"
                      required
                    />
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
                    <Label htmlFor="form-instructor" className="font-semibold text-slate-500">Professor *</Label>
                    <Input
                      id="form-instructor"
                      placeholder="Nome do Professor"
                      value={formInstructor || user?.name || ''}
                      onChange={(e) => setFormInstructor(e.target.value)}
                      className="h-8 rounded-lg border-slate-200 bg-slate-50/50"
                      disabled
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
                    <Label htmlFor="form-time" className="font-semibold text-slate-500">Horário *</Label>
                    <Input
                      id="form-time"
                      placeholder="18:30 - 20:30"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="h-8 rounded-lg border-slate-200"
                      required
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
                      <option value="live">Ao Vivo (Online)</option>
                      <option value="presencial">Presencial (Sala Física)</option>
                    </select>
                  </div>

                  {formType === 'presencial' ? (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="form-room" className="font-semibold text-slate-500">Sala *</Label>
                        <Input
                          id="form-room"
                          placeholder="Sala 204"
                          value={formRoom}
                          onChange={(e) => setFormRoom(e.target.value)}
                          className="h-8 rounded-lg border-slate-200"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="form-address" className="font-semibold text-slate-500">Campus / Localização *</Label>
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
                      <Label htmlFor="form-url" className="font-semibold text-slate-500">Link da Sala Virtual</Label>
                      <Input
                        id="form-url"
                        placeholder="https://link-da-aula.com/..."
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        className="h-8 rounded-lg border-slate-200"
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

      {/* REFERENCED CONSULTANT CARD GRID LAYOUT */}
      <AnimatePresence mode="popLayout">
        {filteredClasses.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <p className="text-xs font-semibold text-slate-400 tracking-wide animate-pulse">
              Não tens nenhuma aula agendada para este momento.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
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
                  {/* Highly polished consultant-style card with deep rounded corners and absolute pure white layout */}
                  <Card className="relative overflow-hidden border border-slate-100/80 shadow-xs hover:shadow-md transition-all duration-300 rounded-[2rem] bg-white flex flex-col h-full p-6 space-y-5 justify-between">
                    
                    {/* Top Row: Initials Avatar + stacked title/subtitle */}
                    <div className="flex gap-4 items-start">
                      {/* Initials-based avatar using brand gradient — no photos */}
                      <div className="w-12 h-12 rounded-full shrink-0 bg-gradient-to-br from-[#312455] to-[#8a66a8] flex items-center justify-center shadow-sm">
                        <span className="text-white text-xs font-black tracking-tight select-none">
                          {getInitials(c.instructor)}
                        </span>
                      </div>

                      {/* Stacked title / instructor name */}
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h3 className="font-extrabold text-[#312455] text-xs leading-snug tracking-tight line-clamp-2 pr-4">
                          {c.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold truncate">
                          {c.instructor}
                        </p>
                      </div>

                      {/* Instructor Action - Top Right Trash Button with 2-step confirmation */}
                      {isInstructor && (
                        <div className="absolute top-5 right-5 flex items-center gap-1.5 z-10">
                          <AnimatePresence>
                            {deleteConfirmId === c.id ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-1 bg-red-50 border border-red-200/50 rounded-lg p-1 shadow-xs"
                              >
                                <span className="text-[9px] text-red-600 font-extrabold px-1">Eliminar?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteClass(c.id)
                                    setDeleteConfirmId(null)
                                  }}
                                  className="text-[9px] bg-red-600 hover:bg-red-700 text-white font-black px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                >
                                  Sim
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="text-[9px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-black px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                >
                                  Não
                                </button>
                              </motion.div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(c.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
                                title="Eliminar Aula"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* Section 1: rating-like badge + Location Pin */}
                    <div className="flex items-center gap-3">
                      {/* Brand-colored status badge */}
                      {isLiveNow ? (
                        <Badge className="bg-red-500 text-white font-extrabold text-[8px] tracking-widest uppercase border-none px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          AO VIVO
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500 text-white font-bold text-[8px] tracking-widest uppercase border-none px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                          PRESENCIAL
                        </Badge>
                      )}

                      {/* Location details (pin + text) - simplified, generic Virtual Room naming */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold truncate">
                        {isPresencial ? (
                          <>
                            <MapPin className="h-3 w-3 text-amber-500 shrink-0" />
                            <span className="truncate">{c.room}, {c.address}</span>
                          </>
                        ) : (
                          <>
                            <Monitor className="h-3 w-3 text-[#8a66a8] shrink-0" />
                            <span>Sala Virtual</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Section 2: Info lines */}
                    <div className="space-y-1 text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-50">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-[#8a66a8]/70" />
                        <span>Curso: <strong className="text-[#312455] font-bold">{c.courseName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#8a66a8]/70" />
                        <span>{c.duration || (isPresencial ? '2h de aula' : '1h 30m de aula')}</span>
                      </div>
                    </div>

                    {/* Section 3: Pills / Tags - just 'Online' or 'Presencial', no others */}
                    <div className="flex gap-1.5 flex-wrap">
                      {c.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.8 rounded-full text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-200/30 tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer Row (Split) */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100/80 gap-3">
                      {/* Left: Schedule stack — date formatted in Portuguese */}
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#312455] tracking-tight leading-none mb-1">
                          {c.time}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                          {formatDate(c.date)}
                        </span>
                      </div>

                      {/* Right: Rounded Brand Action button - no icons at all, simplified copy */}
                      {isInstructor ? (
                        <Button
                          asChild
                          className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-2xl h-9.5 text-[10px] font-black uppercase tracking-wider px-5 shadow-xs cursor-pointer transition-all duration-300"
                        >
                          <a href={c.meetingUrl || '#'} target="_blank" rel="noopener noreferrer">
                            Iniciar Aula
                          </a>
                        </Button>
                      ) : (
                        <>
                          {isLiveNow ? (
                            <Button
                              asChild
                              className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-2xl h-9.5 text-[10px] font-black uppercase tracking-wider px-5 shadow-xs cursor-pointer transition-all duration-300"
                            >
                              <a href={c.meetingUrl} target="_blank" rel="noopener noreferrer">
                                Assistir Aula
                              </a>
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                toast.info(`Local das aulas presenciais: ${c.room} - ${c.address}`)
                              }}
                              className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-2xl h-9.5 text-[10px] font-black uppercase tracking-wider px-5 shadow-xs cursor-pointer transition-all duration-300"
                            >
                              Ver Direções
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
    </div>
  )
}
