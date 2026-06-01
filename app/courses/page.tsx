import type { Metadata } from 'next'
import { getCourses } from '@/lib/hygraph'
import { CoursesGrid } from '@/components/courses/courses-grid'

export const metadata: Metadata = {
  title: 'Cursos - Prime Academy',
  description: 'Explore os nossos cursos de gestão, informática e idiomas. Formação prática com certificação reconhecida em Angola.',
}

export default async function CoursesPage() {
  const courses = await getCourses()
  const categories = ['Todos', ...new Set(courses.map((c) => c.category))]

  return <CoursesGrid courses={courses} categories={categories} />
}
