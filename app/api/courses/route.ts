import { NextResponse } from 'next/server'
import { getCourses } from '@/lib/hygraph'

/**
 * GET /api/courses
 * Server-side proxy: fetches courses from Hygraph using the server-only
 * HYGRAPH_API_TOKEN (not available in the browser) and returns the result
 * as JSON. Client components (e.g. dashboard) should call this endpoint
 * instead of calling getCourses() directly.
 */
export async function GET() {
  try {
    const courses = await getCourses()
    return NextResponse.json(courses)
  } catch (error) {

    return NextResponse.json([], { status: 500 })
  }
}
