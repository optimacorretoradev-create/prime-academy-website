import { useQuery } from '@tanstack/react-query'
import type { Course } from '@/lib/hygraph'

async function fetchCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses')
  if (!res.ok) return []
  return res.json()
}

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000,
  })
}
