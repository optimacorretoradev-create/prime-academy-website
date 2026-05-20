export interface Course {
  id: string
  name: string
  description: string
  category: string
  duration: string
  lessons: number
  price: string
  image: string
  rating: number
  online: boolean
  level: string
  pdfUrl?: string
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

// Mock Data
const coursesData: Course[] = [
  {
    id: '1',
    name: 'Ferramentas de Produtividade Avançada (Office 365/Google Workspace)',
    description: 'Aprenda a dominar o ecossistema digital corporativo com Office 365 e Google Workspace para otimizar processos.',
    category: 'Gestão Administrativa Digital',
    duration: '40 horas',
    lessons: 10,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    rating: 4.8,
    online: true,
    level: 'Avançado',
    pdfUrl: '/pdf/ferramentas_produtividade_avancada.pdf'
  },
  {
    id: '2',
    name: 'Gestão de Documentos e Arquivos Electrónicos',
    description: 'Domine a organização, classificação, segurança e digitalização de documentos e arquivos eletrónicos corporativos.',
    category: 'Gestão Administrativa Digital',
    duration: '30 horas',
    lessons: 8,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    rating: 4.9,
    online: false,
    level: 'Intermédio',
    pdfUrl: '/pdf/gestao_documentos_arquivos.pdf'
  },
  {
    id: '3',
    name: 'Comunicação Institucional e Redacção Oficial',
    description: 'Técnicas de redação de documentos oficiais, pareceres e relatórios com clareza, objetividade e alinhamento institucional.',
    category: 'Liderança e Comunicação',
    duration: '45 horas',
    lessons: 12,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    rating: 4.7,
    online: true,
    level: 'Avançado',
    pdfUrl: '/pdf/comunicacao_institucional_redaccao.pdf'
  },
  {
    id: '4',
    name: 'Secretariado para Alta Direcção',
    description: 'Capacitação executiva focada em assessoria estratégica, organização de gabinetes de alta direção, protocolo e etiqueta empresarial.',
    category: 'Secretariado Estratégico',
    duration: '60 horas',
    lessons: 15,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    rating: 4.9,
    online: false,
    level: 'Avançado',
    pdfUrl: '/pdf/secretariado_alta_direccao.pdf'
  },
  {
    id: '5',
    name: 'Inteligência Artificial para Automação de Tarefas Administrativas',
    description: 'Utilização prática de ferramentas de IA (como ChatGPT e Copilot) para automatizar e otimizar tarefas administrativas diárias.',
    category: 'Tecnologias Inovadoras',
    duration: '30 horas',
    lessons: 8,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    rating: 4.9,
    online: true,
    level: 'Intermédio',
    pdfUrl: '/pdf/ia_automacao_tarefas.pdf'
  }
]

const galleryImagesData: GalleryImage[] = [
  {
    id: 'g1',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    caption: 'Cerimónia de entrega de certificados 2025',
    category: 'Eventos'
  },
  {
    id: 'g2',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    caption: 'Aula prática de Gestão de Projectos',
    category: 'Aulas'
  },
  {
    id: 'g3',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    caption: 'Workshop de Excel Avançado',
    category: 'Workshops'
  },
  {
    id: 'g4',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    caption: 'Seminário de Liderança em Angola',
    category: 'Eventos'
  },
  {
    id: 'g5',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    caption: 'Formação Avançada de Secretariado Executivo',
    category: 'Aulas'
  },
  {
    id: 'g6',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    caption: 'Sessão de Mentoria Executiva Individualizada',
    category: 'Workshops'
  },
  {
    id: 'g7',
    imageUrl: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&q=80',
    caption: 'Aula Prática de Tecnologias de Gestão',
    category: 'Aulas'
  },
  {
    id: 'g8',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80',
    caption: 'Encerramento de Bootcamp Executivo',
    category: 'Eventos'
  },
  {
    id: 'g9',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    caption: 'Palestra Geral sobre Gestão Estratégica',
    category: 'Workshops'
  }
]

const testimonialsData: Testimonial[] = [
  {
    id: 't1',
    name: 'Ana Silva',
    text: 'A formação de Secretariado para Alta Direcção da Prime Academy transformou completamente a minha forma de trabalhar. Consegui uma promoção logo a seguir.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80'
  },
  {
    id: 't2',
    name: 'Mateus Manuel',
    text: 'A formação em Inteligência Artificial para Automação Administrativa superou todas as minhas expectativas. O professor tinha imensa experiência prática.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80'
  },
  {
    id: 't3',
    name: 'Bela de Sousa',
    text: 'Recomendo vivamente a Prime Academy. As aulas online são super interativas e o material de estudo é excelente.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80'
  }
]

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

export async function getCourses(featured?: boolean): Promise<Course[]> {
  return coursesData
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return galleryImagesData
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonialsData
}

export async function getContactInfo(): Promise<ContactInfo> {
  return contactInfoData
}
