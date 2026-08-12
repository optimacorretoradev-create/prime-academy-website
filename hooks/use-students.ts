import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/lib/hygraph'

interface Student {
  id: string
  name: string
  email: string
  course: string
  progress: number
  status: string
}

async function fetchStudents(): Promise<Student[]> {
  const { data: matriculas, error: matriculasError } = await supabase
    .from('matriculas')
    .select('id, perfil_id, curso_id_catalogo, curso_nome, progresso_percentagem')

  if (matriculasError) return []
  if (!matriculas || matriculas.length === 0) return []

  const perfilIds = Array.from(
    new Set(matriculas.map((m) => m.perfil_id).filter(Boolean))
  )
  let profilesMap: Record<string, { nome: string; email: string }> = {}

  if (perfilIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from('perfis')
      .select('id, nome, email')
      .in('id', perfilIds)

    if (!profilesError && profilesData) {
      profilesData.forEach((p) => {
        profilesMap[p.id] = { nome: p.nome, email: p.email }
      })
    }
  }

  const coursesRes = await fetch('/api/courses')
  const allCatalogCourses: Course[] = coursesRes.ok ? await coursesRes.json() : []

  return matriculas.map((m) => {
    const profile = m.perfil_id ? profilesMap[m.perfil_id] : null
    const matchedCourse = allCatalogCourses.find((c) => c.id === m.curso_id_catalogo)
    const progressVal = m.progresso_percentagem || 0
    const statusText = progressVal >= 100 ? 'Concluído' : 'Ativo'

    return {
      id: m.id || Math.random().toString(),
      name: profile?.nome || 'Utilizador Inativo',
      email: profile?.email || 'N/A',
      course: matchedCourse?.name || m.curso_nome || 'Curso Sem Nome',
      progress: progressVal,
      status: statusText,
    }
  })
}

export function useStudents(isAdmin: boolean) {
  return useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: fetchStudents,
    enabled: isAdmin,
    staleTime: 2 * 60 * 1000,
  })
}
