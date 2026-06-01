import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCourses } from '@/lib/hygraph'
import { CourseDetailPublicGate } from '@/components/courses/course-detail-public-gate'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const courses = await getCourses()
  const course = courses.find((c) => c.id === resolvedParams.id || c.slug === resolvedParams.id)

  if (!course) {
    return {
      title: 'Curso Não Encontrado - Prime Academy',
    }
  }

  return {
    title: `${course.name} - Prime Academy`,
    description: course.description,
  }
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const resolvedParams = await params
  const courses = await getCourses()
  const course = courses.find((c) => c.id === resolvedParams.id || c.slug === resolvedParams.id)

  if (!course) {
    notFound()
  }

  const syllabus = course.syllabus || ''

  const highlights = course.highlights || [
    'Acesso vitalício ao material de estudo do curso',
    'Exercícios práticos focados no mercado profissional',
    'Certificado de conclusão reconhecido nacionalmente',
    'Acompanhamento e suporte com formadores experientes',
  ]

  return (
    <CourseDetailPublicGate course={course} syllabus={syllabus} highlights={highlights} />
  )
}
