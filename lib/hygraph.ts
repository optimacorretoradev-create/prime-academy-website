export interface Course {
  id: string
  name: string
  description: string
  category: string
  duration: string
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
  title: string
  categoria: string
  destaque: boolean
  image: string
  createdAt: string
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
    // Força o Hygraph a devolver apenas assets no stage Published (evita URLs vazias)
    'gcms-stage': 'PUBLISHED',
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
    name: c.name,
    description: c.description || '',
    category,
    duration: c.duration || '',
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
 * Helper mapper to convert Hygraph Gallery Image schema to frontend GalleryImage interface
 */
function mapGalleryImage(item: any): GalleryImage {
  // Se a URL do asset estiver vazia mas o handle existir, reconstrói o link estático da CDN do Hygraph.
  // O handle é o identificador único do asset no Hygraph CDN: https://media.graphassets.com/{handle}
  const fallbackAssetUrl = item.imageUrl?.handle
    ? `https://media.graphassets.com/${item.imageUrl.handle}`
    : '/placeholder.jpg'

  return {
    id: item.id,
    title: item.caption || item.title || '',
    categoria: item.category || item.categoria || 'Geral',
    destaque: Boolean(item.destaque),
    image: item.imageUrl?.url || item.imageUrl?.handle && `https://media.graphassets.com/${item.imageUrl.handle}` || '/placeholder.jpg',
    createdAt: item.createdAt || ''
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

// ─── Queries GraphQL — extraídas como constantes para reutilização e clareza ──

const GET_CURSOS = `
  query GetCursos {
    cursos {
      id
      name
      description
      duration
      price
      level
      highlights
      categoria
      syllabus {
        html
      }
      image {
        url
      }
    }
  }
`

const GET_COURSE_BY_SLUG = `
  query GetCourseById($id: ID!) {
    curso(where: { id: $id }) {
      id
      name
      description
      duration
      price
      level
      highlights
      categoria
      syllabus {
        html
      }
      # Requisita id, url e stage para diagnóstico — confirma que o asset está Published
      image(locales: [pt, en, pt_BR]) {
        id
        url
        stage
      }
    }
  }
`

/**
 * Fetch all courses (GraphQL)
 */
export async function getCourses(featured?: boolean): Promise<Course[]> {
  if (!endpoint) {
    console.warn('[Hygraph] NEXT_PUBLIC_HYGRAPH_ENDPOINT não configurado.')
    return []
  }

  try {
    const data = await hygraphFetch<{ cursos: any[] }>(GET_CURSOS)

    // 🔍 DIAGNÓSTICO SERVIDOR — imprime o raw image do 1º curso antes do mapper
    if (data?.cursos?.length) {
      console.log('[Hygraph RAW] Primeiro curso recebido:', {
        name: data.cursos[0].name,
        imageRaw: data.cursos[0].image,
        categoria: data.cursos[0].categoria,
      })
    } else {
      console.warn('[Hygraph RAW] Array cursos vazio ou null — verifique se os cursos estão Published no CMS.')
    }

    // Retorna cursos reais mapeados, ou array vazio se o Hygraph não devolver dados
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
    const data = await hygraphFetch<{ curso: any }>(GET_COURSE_BY_SLUG, { id })
    // Retorna o curso real mapeado, ou null se não existir no CMS
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
  email: 'geral@primeacademy.ao',
  address: 'Rua 28 de Maio, Edifício 30, 6º Andar Lado Esquerdo, Maianga, Luanda, Angola',
  socialLinks: {
    facebook: 'https://facebook.com/primeacademy',
    instagram: 'https://instagram.com/primeacademy'
  }
}

/**
 * Fetch all gallery images (GraphQL)
 */
// Query completa com campo destaque — sem orderBy para evitar erros de enum no schema
// A ordenação é feita em JS após o fetch (destaque: true vem primeiro)
const GET_GALLERY_IMAGES_WITH_DESTAQUE = `
  query GetGalleryImages {
    galleryImages {
      id
      imageUrl {
        url
        handle
      }
      caption
      category
      destaque
      createdAt
    }
  }
`

// Query de fallback sem campo destaque — compatível com schemas onde o campo ainda não existe
const GET_GALLERY_IMAGES_FALLBACK = `
  query GetGalleryImages {
    galleryImages {
      id
      imageUrl {
        url
        handle
      }
      caption
      category
      createdAt
    }
  }
`

/** Ordena o array colocando os itens com destaque=true no topo, e desempatando pelo mais recente */
function sortByDestaque(images: GalleryImage[]): GalleryImage[] {
  return [...images].sort((a, b) => {
    if (a.destaque && !b.destaque) return -1
    if (!a.destaque && b.destaque) return 1
    
    // Critério de desempate: mais recente primeiro (createdAt decrescente)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA
  })
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!endpoint) {
    console.warn('[Gallery] NEXT_PUBLIC_HYGRAPH_ENDPOINT não configurado.')
    return []
  }

  try {
    // Tenta a query completa com o campo destaque
    const data = await hygraphFetch<{ galleryImages: any[] }>(GET_GALLERY_IMAGES_WITH_DESTAQUE)

    // ── DIAGNÓSTICO RAW ──────────────────────────────────────────────────────
    console.log('[Gallery RAW] data recebida:', JSON.stringify(data)?.slice(0, 500))
    // ────────────────────────────────────────────────────────────────────────

    if (data?.galleryImages?.length) {
      console.log(`[Gallery] ✅ ${data.galleryImages.length} imagens recebidas. Primeiro item:`, data.galleryImages[0])
      // Ordena em memória: itens com destaque=true primeiro
      return sortByDestaque(data.galleryImages.map(mapGalleryImage))
    }

    console.warn('[Gallery] galleryImages vazio ou ausente — verifique se os itens estão Published no Hygraph.')
    return []
  } catch (primaryError) {
    // Campo destaque pode ainda não existir no schema — tenta query de fallback sem ele
    console.warn('[Gallery] Query com campo destaque falhou. A tentar fallback sem destaque...', primaryError)

    try {
      const fallbackData = await hygraphFetch<{ galleryImages: any[] }>(GET_GALLERY_IMAGES_FALLBACK)

      if (fallbackData?.galleryImages?.length) {
        console.log(`[Gallery] ⚠️ Fallback OK — ${fallbackData.galleryImages.length} imagens (sem campo destaque).`)
        return fallbackData.galleryImages.map(mapGalleryImage)
      }

      console.warn('[Gallery] Fallback também devolveu vazio — verifique se os itens estão Published no Hygraph.')
      return []
    } catch (fallbackError) {
      console.error('[Gallery] Erro crítico em ambas as queries:', fallbackError)
      return []
    }
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
