import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getCourses } from '@/lib/hygraph'
import { CoursesGrid } from '@/components/courses/courses-grid'

export const metadata: Metadata = {
  title: 'Cursos - Prime Academy',
  description: 'Explore os nossos cursos de gestão, informática e idiomas. Formação prática com certificação reconhecida em Angola.',
}

/**
 * Áreas oficiais da Prime Academy — ordem e ortografia canónicas.
 * Devem corresponder (case-insensitive) ao campo `categoria` no Hygraph.
 */
const OFFICIAL_CATEGORIES = [
  'TODOS',
  'GESTÃO ADMINISTRATIVA DIGITAL',
  'LIDERANÇA E COMUNICAÇÃO',
  'SECRETARIADO ESTRATÉGICO',
  'TECNOLOGIAS INOVADORAS',
] as const


export default async function CoursesPage() {
  // Cursos reais vindos do Hygraph — nenhum dado mockado permitido aqui
  const courses = await getCourses()

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando cursos...</div>}>
      <CoursesGrid courses={courses} categories={[...OFFICIAL_CATEGORIES]} />
    </Suspense>
  )
}
