export interface SyllabusModule {
  title: string
  topics: string[]
}

export interface Course {
  id: string
  slug?: string
  name: string
  description: string
  category: string
  duration: string
  lessons: number
  price: string
  image: string
  rating: number
  level: string
  online: boolean
  pdfUrl?: string
  syllabus?: string | SyllabusModule[]
  highlights?: string[]
}

export interface GalleryImage {
  id: string
  imageUrl: string
  caption: string
  category: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  avatarUrl: string | null
}

export interface ContactInfo {
  phone: string
  whatsappNumber: string
  email: string
  address: string
  socialLinks: {
    facebook?: string
    instagram?: string
  }
}

// Environment variables configuration
const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT
const token = process.env.HYGRAPH_API_TOKEN || process.env.HYGRAPH_PROD_AUTH_TOKEN

/**
 * Generic fetcher for Hygraph GraphQL API with caching and error handling
 */
async function hygraphFetch<T>(query: string, variables?: Record<string, any>): Promise<T | null> {
  if (!endpoint) {
    return null
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    // If the token already has the 'Bearer ' prefix, use it directly; otherwise, prepend it.
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    headers['Authorization'] = formattedToken
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 } // Cache results for 1 hour
  })

  if (!response.ok) {
    throw new Error(`Hygraph API returned status ${response.status}`)
  }

  const json = await response.json()
  if (json.errors) {
    throw new Error(`Hygraph GraphQL errors: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

/**
 * Helper mapper to convert Hygraph Course schema to frontend Course interface
 */
function mapCourse(c: any): Course {
  return {
    id: c.id,
    slug: c.slug || c.id,
    name: c.name,
    description: c.description || '',
    category: c.category || 'Geral', // Fallback if category is missing in Hygraph
    duration: c.duration || '',
    lessons: Number(c.lessons) || 0,
    price: c.price || 'Sob consulta',
    image: c.image?.url || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    rating: 4.8, // Fallback rating
    level: c.level || 'Todos',
    online: c.online || false,
    pdfUrl: c.pdfUrl?.url || undefined,
    syllabus: c.syllabus?.markdown || '',
    highlights: Array.isArray(c.highlights) ? c.highlights : []
  }
}

/**
 * Helper mapper to convert Hygraph Gallery Image schema to frontend GalleryImage interface
 */
function mapGalleryImage(img: any): GalleryImage {
  return {
    id: img.id,
    imageUrl: img.imageUrl?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    caption: img.caption || '',
    category: img.category || 'Geral'
  }
}

const contactInfoData: ContactInfo = {
  phone: '(+244) 921 394 946',
  whatsappNumber: '+244921394946',
  email: 'geralprimeacademy@gmail.com',
  address: 'Rua 28 de Maio, Edifício 30, 6º Andar Lado Esquerdo, Maianga, Luanda, Angola',
  socialLinks: {
    facebook: 'https://facebook.com/primeacademy',
    instagram: 'https://instagram.com/primeacademy'
  }
}

/**
 * Fetch all courses (GraphQL)
 */
export async function getCourses(featured?: boolean): Promise<Course[]> {
  try {
    if (!endpoint) {
      throw new Error('NEXT_PUBLIC_HYGRAPH_ENDPOINT is not configured.')
    }

    const query = `
      query GetCursos {
        cursos {
          id
          name
          slug
          description
          duration
          lessons
          price
          image { url }
          level
          pdfUrl { url }
          syllabus { markdown }
          highlights
        }
      }
    `

    const data = await hygraphFetch<{ cursos: any[] }>(query)
    if (data && data.cursos) {
      return data.cursos.map(mapCourse)
    }
    return []
  } catch (error) {
    console.error('Error fetching courses from Hygraph:', error)
    throw error
  }
}

/**
 * Fetch a single course by slug (GraphQL)
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    if (!endpoint) {
      throw new Error('NEXT_PUBLIC_HYGRAPH_ENDPOINT is not configured.')
    }

    const query = `
      query GetCourseBySlug($slug: String!) {
        curso(where: { slug: $slug }) {
          id
          name
          slug
          description
          duration
          lessons
          price
          image { url }
          level
          pdfUrl { url }
          syllabus { markdown }
          highlights
        }
      }
    `

    const data = await hygraphFetch<{ curso: any }>(query, { slug })
    if (data && data.curso) {
      return mapCourse(data.curso)
    }
    return null
  } catch (error) {
    console.error(`Error fetching course "${slug}" from Hygraph:`, error)
    throw error
  }
}

/**
 * Fetch all gallery images (GraphQL)
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    if (!endpoint) {
      throw new Error('NEXT_PUBLIC_HYGRAPH_ENDPOINT is not configured.')
    }

    const query = `
      query GetGalleryImages {
        galleryImages {
          id
          imageUrl { url }
          caption
          category
        }
      }
    `

    const data = await hygraphFetch<{ galleryImages: any[] }>(query)
    if (data && data.galleryImages) {
      return data.galleryImages.map(mapGalleryImage)
    }
    return []
  } catch (error) {
    console.error('Error fetching gallery images from Hygraph:', error)
    throw error
  }
}

/**
 * Fetch testimonials (empty array - no mock data allowed)
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  return []
}

/**
 * Fetch contact info
 */
export async function getContactInfo(): Promise<ContactInfo> {
  return contactInfoData
}
