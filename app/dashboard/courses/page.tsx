import { redirect } from 'next/navigation'

export default function DashboardCoursesPage() {
  redirect('/dashboard?tab=explore')
}
