import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/lib/hygraph'

interface ActiveProgram {
  id: string
  name: string
  description: string
  image: string
  progress: number
  totalLessons: number
  completedLessons: number
  category: string
  online: boolean
  catalogId?: string
}

async function fetchActivePrograms(
  userId: string,
  userRole: string
): Promise<ActiveProgram[]> {
  const isInstructor = userRole === 'admin'

  let matriculas: any[] = []
  if (isInstructor) {
    const { data, error } = await supabase
      .from('matriculas')
      .select('id, curso_id_catalogo, progresso_percentagem')
    if (error) return []
    matriculas = data || []
  } else {
    const { data, error } = await supabase
      .from('matriculas')
      .select('id, curso_id_catalogo, progresso_percentagem')
      .eq('perfil_id', userId)
    if (error) return []
    matriculas = data || []
  }

  if (!matriculas || matriculas.length === 0) return []

  const coursesRes = await fetch('/api/courses')
  const allCatalogCourses: Course[] = coursesRes.ok ? await coursesRes.json() : []

  let coursesWithDetails: (ActiveProgram | null)[] = []

  if (isInstructor) {
    const uniqueCoursesMap: Record<
      string,
      { catalogId: string; progresso_total: number; count: number }
    > = {}
    matriculas.forEach((item) => {
      if (!item.curso_id_catalogo) return
      if (!uniqueCoursesMap[item.curso_id_catalogo]) {
        uniqueCoursesMap[item.curso_id_catalogo] = {
          catalogId: item.curso_id_catalogo,
          progresso_total: item.progresso_percentagem || 0,
          count: 1,
        }
      } else {
        uniqueCoursesMap[item.curso_id_catalogo].progresso_total +=
          item.progresso_percentagem || 0
        uniqueCoursesMap[item.curso_id_catalogo].count += 1
      }
    })

    coursesWithDetails = Object.values(uniqueCoursesMap).map((item) => {
      const matchedCourse = allCatalogCourses.find((c) => c.id === item.catalogId)
      if (!matchedCourse) return null

      const totalAulas = 12
      const avgProgress = Math.round(item.progresso_total / item.count)

      return {
        id: matchedCourse.id,
        name: matchedCourse.name,
        description: matchedCourse.description,
        image: matchedCourse.image,
        category: matchedCourse.category,
        progress: avgProgress,
        totalLessons: totalAulas,
        completedLessons: Math.floor((avgProgress * totalAulas) / 100),
        online: matchedCourse.online || false,
        catalogId: matchedCourse.id,
      }
    })
  } else {
    coursesWithDetails = matriculas.map((item) => {
      if (!item.curso_id_catalogo) return null

      const matchedCourse = allCatalogCourses.find(
        (c) => c.id === item.curso_id_catalogo
      )
      if (!matchedCourse) return null

      const totalAulas = 12

      return {
        id: matchedCourse.id,
        name: matchedCourse.name,
        description: matchedCourse.description,
        image: matchedCourse.image,
        category: matchedCourse.category,
        progress: item.progresso_percentagem || 0,
        totalLessons: totalAulas,
        completedLessons: Math.floor(
          ((item.progresso_percentagem || 0) * totalAulas) / 100
        ),
        online: matchedCourse.online || false,
        catalogId: matchedCourse.id,
      }
    })
  }

  return coursesWithDetails.filter(Boolean) as ActiveProgram[]
}

export function useActivePrograms(
  userId: string | undefined,
  userRole: string | undefined
) {
  return useQuery<ActiveProgram[]>({
    queryKey: ['active-programs', userId, userRole],
    queryFn: () => fetchActivePrograms(userId!, userRole!),
    enabled:
      !!userId &&
      userId !== 'undefined' &&
      typeof userId === 'string' &&
      !!userRole,
    staleTime: 2 * 60 * 1000,
  })
}
