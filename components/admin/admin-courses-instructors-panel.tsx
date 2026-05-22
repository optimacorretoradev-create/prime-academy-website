'use client'

import { useCallback, useEffect, useState } from 'react'
import { BookOpen, RefreshCw, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Course } from '@/lib/hygraph'
import type { AdminPerfil } from '@/components/admin/admin-user-detail-panel'
import type { CursoInstrutor } from '@/lib/admin-types'
import { assignCursoInstrutor, fetchCursoInstrutores } from '@/lib/enrollments-service'

interface AdminCoursesInstructorsPanelProps {
  courses: Course[]
  instrutores: AdminPerfil[]
  adminPerfilId?: string
}

export function AdminCoursesInstructorsPanel({
  courses,
  instrutores,
  adminPerfilId,
}: AdminCoursesInstructorsPanelProps) {
  const [assignments, setAssignments] = useState<CursoInstrutor[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedInstrutorId, setSelectedInstrutorId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setAssignments(await fetchCursoInstrutores())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  const handleAssign = async () => {
    if (!selectedCourseId || !selectedInstrutorId || !selectedCourse) {
      toast.error('Selecione o curso e o instrutor.')
      return
    }
    if (!adminPerfilId) {
      toast.error('Sessão inválida. Volte a iniciar sessão.')
      return
    }

    setSaving(true)
    const instrutor = instrutores.find((i) => i.id === selectedInstrutorId)
    const { ok, error } = await assignCursoInstrutor({
      curso_id: selectedCourse.id,
      curso_nome: selectedCourse.name,
      instrutor_id: selectedInstrutorId,
      designado_por: adminPerfilId,
    })
    setSaving(false)

    if (!ok) {
      toast.error(error || 'Erro ao designar instrutor')
      return
    }

    toast.success(
      `${instrutor?.nome ?? 'Instrutor'} designado para "${selectedCourse.name}". Notificação enviada.`
    )
    await load()
  }

  const assignmentMap = new Map(assignments.map((a) => [a.curso_id, a]))

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#312455]" />
          <h2 className="text-lg font-black text-[#312455]">Designar Instrutor por Curso</h2>
          <button
            type="button"
            onClick={load}
            className="ml-auto w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#312455] cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Curso</label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger className="rounded-lg h-10">
                <SelectValue placeholder="Escolha o curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Instrutor
            </label>
            <Select value={selectedInstrutorId} onValueChange={setSelectedInstrutorId}>
              <SelectTrigger className="rounded-lg h-10">
                <SelectValue placeholder="Escolha o instrutor" />
              </SelectTrigger>
              <SelectContent>
                {instrutores.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    Nenhum instrutor registado
                  </SelectItem>
                ) : (
                  instrutores.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.nome} ({i.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="mt-4 rounded-lg bg-[#312455] hover:bg-[#3d2d6b] text-white font-semibold"
          disabled={saving || !selectedCourseId || !selectedInstrutorId}
          onClick={handleAssign}
        >
          <UserCog className="w-4 h-4 mr-2" />
          {saving ? 'A guardar…' : 'Designar instrutor'}
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3 pl-5 text-xs font-bold text-slate-500">Curso</th>
              <th className="text-left p-3 text-xs font-bold text-slate-500">Instrutor</th>
              <th className="text-left p-3 pr-5 text-xs font-bold text-slate-500 hidden md:table-cell">
                Atualizado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">
                  A carregar…
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">
                  Sem cursos no catálogo
                </td>
              </tr>
            ) : (
              courses.map((course, index) => {
                const a = assignmentMap.get(course.id)
                const instrutorNome =
                  a?.instrutor?.nome ??
                  instrutores.find((i) => i.id === a?.instrutor_id)?.nome
                return (
                  <tr
                    key={course.id}
                    className={
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }
                  >
                    <td className="p-3 pl-5 font-medium text-slate-800">{course.name}</td>
                    <td className="p-3 text-slate-600">
                      {instrutorNome ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <UserCog className="w-3.5 h-3.5" />
                          {instrutorNome}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Não designado</span>
                      )}
                    </td>
                    <td className="p-3 pr-5 text-xs text-slate-400 hidden md:table-cell">
                      {a?.atualizado_em
                        ? new Date(a.atualizado_em).toLocaleDateString('pt-AO')
                        : '—'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
