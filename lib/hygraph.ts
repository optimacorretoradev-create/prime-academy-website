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
  /** HTML gerado pelo Hygraph Rich Text (campo syllabus ou programaDoCurso) */
  syllabus?: string
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
    const errorText = await response.text()
    console.error(`[Hygraph] API returned status ${response.status}. Body:`, errorText)
    throw new Error(`Hygraph API returned status ${response.status}: ${errorText}`)
  }

  const json = await response.json()

  if (json.errors) {
    // Erros parciais (ex: campo sem permissão 403) — regista aviso mas não aborta
    // se o Hygraph devolveu data na mesma (partial success).
    if (json.data) {
      console.warn('[Hygraph] Erros parciais na query (campos sem permissão?):', JSON.stringify(json.errors))
    } else {
      // Sem data alguma — erro fatal
      throw new Error(`Hygraph GraphQL errors: ${JSON.stringify(json.errors)}`)
    }
  }

  return json.data
}

/**
 * Helper mapper to convert Hygraph Course schema to frontend Course interface
 */
/**
 * Helper mapper to convert Hygraph Course schema to frontend Course interface
 */
function mapCourse(c: any): Course {
  // Normalise category: prefer `categoria` (Hygraph field), trim whitespace and uppercase for safe comparison
  const rawCategory = c.categoria ?? c.category ?? ''
  const category = rawCategory.toString().trim().toUpperCase() || 'GERAL'

  return {
    id: c.id,
    slug: c.id, // Fallback para o ID
    name: c.name,
    description: c.description || '',
    category,
    duration: c.duration || '',
    lessons: 0, // Campo não existe no schema atual
    price: c.price || 'Sob consulta',
    // c.image é um Asset Picker do Hygraph — extrai .url de forma resiliente
    image: c.image?.url || '/placeholder.jpg',
    rating: 4.8, // Fallback rating
    level: c.level || 'Todos',
    online: false, // Campo não existe
    // Lê HTML do Rich Text do campo syllabus
    syllabus: c.syllabus?.html || '',
    highlights: Array.isArray(c.highlights) ? c.highlights : []
  }
}

/**
 * Fetch all courses (GraphQL)
 */
export async function getCourses(featured?: boolean): Promise<Course[]> {
  if (!endpoint) {
    console.warn('[Hygraph] NEXT_PUBLIC_HYGRAPH_ENDPOINT não configurado.')
    return []
  }

  try {
    const query = `
      query GetCursos {
        cursos {
          id
          name
          description
          duration
          price
          level
          syllabus { html }
          highlights
          categoria
          image { url }
        }
      }
    `

    const data = await hygraphFetch<{ cursos: any[] }>(query)
    return data?.cursos?.map(mapCourse) ?? []
  } catch (error) {
    console.error('[Hygraph] Erro ao obter cursos:', error)
    return []
  }
}

/**
 * Fetch a single course by ID (GraphQL)
 */
export async function getCourseBySlug(id: string): Promise<Course | null> {
  if (!endpoint) {
    console.warn('[Hygraph] NEXT_PUBLIC_HYGRAPH_ENDPOINT não configurado.')
    return null
  }

  try {
    const query = `
      query GetCourseById($id: ID!) {
        curso(where: { id: $id }) {
          id
          name
          description
          duration
          price
          level
          syllabus { html }
          highlights
          categoria
          image { url }
        }
      }
    `

    const data = await hygraphFetch<{ curso: any }>(query, { id })
    return data?.curso ? mapCourse(data.curso) : null
  } catch (error) {
    console.error(`[Hygraph] Erro ao obter curso "${id}":`, error)
    return null
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

// ⛔ fallbackCourses ELIMINADO — a aplicação exibe APENAS dados reais do Hygraph CMS.

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
 * Fetch all gallery images (GraphQL)
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    if (!endpoint) {
      return []
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
    console.warn('Error fetching gallery images from Hygraph (returning empty array):', error)
    return []
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
