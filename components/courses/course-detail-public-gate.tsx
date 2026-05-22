'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { CourseDetailBody, type SyllabusModule } from '@/components/courses/course-detail-body'
import type { Course } from '@/lib/hygraph'

interface CourseDetailPublicGateProps {
  course: Course
  syllabus: SyllabusModule[]
  highlights: string[]
}

export function CourseDetailPublicGate({ course, syllabus, highlights }: CourseDetailPublicGateProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(`/dashboard/courses/${course.id}`)
    }
  }, [user, isLoading, router, course.id])

  if (isLoading || user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground font-medium">A carregar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CourseDetailBody course={course} syllabus={syllabus} highlights={highlights} variant="public" />
    </div>
  )
}
