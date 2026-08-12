import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/lib/hygraph'

interface PDFMaterial {
  id: string
  title: string
  courseId: string
  courseName: string
  description: string
  fileName: string
  uploadedAt: string
  fileUrl?: string
}

const FALLBACK_PDFS: PDFMaterial[] = [
  {
    id: 'pdf1',
    title: 'Manual de Iniciação ao PMBOK v7',
    courseId: '1',
    courseName: 'Gestão de Projectos',
    description: 'Material teórico complementar cobrindo a sétima edição do guia PMBOK.',
    fileName: 'Manual_PMBOK_v7_Prime.pdf',
    uploadedAt: new Date().toLocaleDateString('pt-AO'),
  },
  {
    id: 'pdf2',
    title: 'Guia Prático de Fórmulas e Atalhos Excel',
    courseId: '2',
    courseName: 'Excel Avançado',
    description: 'Lista completa de atalhos e fórmulas essenciais de finanças no Excel.',
    fileName: 'Guia_Atalhos_Excel_Avançado.pdf',
    uploadedAt: new Date().toLocaleDateString('pt-AO'),
  },
]

async function fetchPdfMaterials(): Promise<PDFMaterial[]> {
  const { data: databasePDFs, error: pdfError } = await supabase
    .from('materiais_pdf')
    .select('*')
    .order('id', { ascending: false })

  if (pdfError) {
    // Fallback to localStorage or mock
    if (typeof window !== 'undefined') {
      const savedPDFs = localStorage.getItem('prime_academy_pdfs')
      if (savedPDFs) {
        try {
          return JSON.parse(savedPDFs)
        } catch {
          // ignore parse errors
        }
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('prime_academy_pdfs', JSON.stringify(FALLBACK_PDFS))
    }
    return FALLBACK_PDFS
  }

  if (!databasePDFs || databasePDFs.length === 0) return []

  const coursesRes = await fetch('/api/courses')
  const allCatalogCourses: Course[] = coursesRes.ok ? await coursesRes.json() : []

  const mappedPDFs: PDFMaterial[] = databasePDFs.map((pdf: any) => {
    const matchedCourse = allCatalogCourses.find((c) => c.id === pdf.curso_id)
    return {
      id: pdf.id,
      title: pdf.titulo,
      courseId: pdf.curso_id,
      courseName: matchedCourse?.name || 'Curso Geral',
      description: pdf.descricao,
      fileName: pdf.nome_arquivo,
      uploadedAt: pdf.created_at
        ? new Date(pdf.created_at).toLocaleDateString('pt-AO')
        : new Date().toLocaleDateString('pt-AO'),
      fileUrl: pdf.url_arquivo,
    }
  })

  if (typeof window !== 'undefined') {
    localStorage.setItem('prime_academy_pdfs', JSON.stringify(mappedPDFs))
  }
  return mappedPDFs
}

export function usePdfMaterials() {
  return useQuery<PDFMaterial[]>({
    queryKey: ['pdf-materials'],
    queryFn: fetchPdfMaterials,
    staleTime: 2 * 60 * 1000,
  })
}
