import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/revalidate?paths=gallery,courses
 * 
 * Revalidates specific pages to refresh content from Hygraph immediately
 * 
 * Usage:
 * - curl -X POST "http://localhost:3000/api/revalidate?paths=gallery,courses"
 * - curl -X POST "https://primeacademy.ao/api/revalidate?paths=gallery,courses&token=YOUR_SECRET_TOKEN"
 * 
 * Query params:
 * - paths: comma-separated list of paths to revalidate (gallery, courses, dashboard)
 * - token: optional security token to prevent unauthorized revalidation
 */

const REVALIDATION_TOKEN = process.env.REVALIDATION_SECRET_TOKEN || 'dev-token'

export async function POST(request: NextRequest) {
  try {
    // Check authentication token if in production
    const token = request.nextUrl.searchParams.get('token')
    
    if (process.env.NODE_ENV === 'production' && token !== REVALIDATION_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid token' },
        { status: 401 }
      )
    }

    // Get paths to revalidate
    const pathsParam = request.nextUrl.searchParams.get('paths') || 'gallery,courses,dashboard'
    const paths = pathsParam.split(',').map(p => `/${p.trim()}`)

    // Revalidate each path
    const results = []
    for (const path of paths) {
      try {
        revalidatePath(path)
        results.push({ path, status: 'revalidated' })
        console.log(`✓ Revalidated: ${path}`)
      } catch (error) {
        results.push({ 
          path, 
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
        console.error(`✗ Failed to revalidate ${path}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${results.filter(r => r.status === 'revalidated').length} paths`,
      results
    })

  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { 
        error: 'Revalidation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint info
 */
export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to revalidate content',
    usage: '/api/revalidate?paths=gallery,courses&token=YOUR_TOKEN',
    environment: process.env.NODE_ENV,
    availablePaths: ['gallery', 'courses', 'dashboard', 'home']
  })
}
