import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCourses } from '@/lib/hygraph'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { CourseDetailBody } from '@/components/courses/course-detail-body'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const courses = await getCourses()
  const course = courses.find((c) => c.id === resolvedParams.id)

  if (!course) {
    return { title: 'Curso Não Encontrado - Prime Academy' }
  }

  return {
    title: `${course.name} - Painel | Prime Academy`,
    description: course.description,
  }
}

export default async function DashboardCourseDetailsPage({ params }: PageProps) {
  const resolvedParams = await params
  const courses = await getCourses()
  const course = courses.find((c) => c.id === resolvedParams.id)

  if (!course) {
    redirect('/dashboard?tab=explore')
  }

  const syllabus = course.syllabus || ''

  const highlights = course.highlights || [
    'Acesso vitalício ao material de estudo do curso',
    'Exercícios práticos focados no mercado profissional',
    'Certificado de conclusão reconhecido nacionalmente',
    'Acompanhamento e suporte com formadores experientes',
  ]

  return (
    <DashboardShell activeNav="explore" lockScrollLayout>
      <CourseDetailBody course={course} syllabus={syllabus} highlights={highlights} variant="dashboard" />
    </DashboardShell>
  )
}
