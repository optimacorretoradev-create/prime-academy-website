export interface CourseTrainer {
  name: string
  avatar: string
  role: string
}

const trainersByCourseId: Record<string, CourseTrainer> = {
  '1': { name: 'Isabel Gaspar', avatar: '/images/trainers/trainer4.jpeg', role: 'Sistemas & Tecnologias de Gestão' },
  '2': { name: 'Hosana Inglês', avatar: '/images/trainers/trainer2.png', role: 'Gestão de Processos & Inovação' },
  '3': { name: 'Claúdia Roceth', avatar: '/images/trainers/trainer3.png', role: 'Comunicação & Protocolo Institucional' },
  '4': { name: 'Lourença Ricardo', avatar: '/images/trainers/trainer1.jpeg', role: 'Protocolo & Secretariado de Direção' },
  '5': { name: 'Valéria Serra', avatar: '/images/trainers/trainer6.png', role: 'Gestão de Pessoas & Cultura Organizacional' },
  '6': { name: 'Claúdia Roceth', avatar: '/images/trainers/trainer3.png', role: 'Liderança & Desenvolvimento Executivo' },
  '7': { name: 'Santos Egas Moniz', avatar: '/images/trainers/trainer7.png', role: 'Liderança & Gestão de Recursos Humanos' },
  '8': { name: 'Eduardo Chilowa', avatar: '/images/trainers/trainer8.png', role: 'Oratória & Comunicação Persuasiva' },
  '9': { name: 'Lourença Ricardo', avatar: '/images/trainers/trainer1.jpeg', role: 'Secretariado Executivo de Alta Direção' },
  '10': { name: 'Isabel Gaspar', avatar: '/images/trainers/trainer4.jpeg', role: 'Gestão de Gabinete & Protocolo' },
  '11': { name: 'Hosana Inglês', avatar: '/images/trainers/trainer2.png', role: 'Protocolo & Etiqueta Empresarial' },
  '12': { name: 'Valéria Serra', avatar: '/images/trainers/trainer6.png', role: 'Secretariado & Apoio Executivo' },
  '13': { name: 'Eduardo Chilowa', avatar: '/images/trainers/trainer8.png', role: 'Tecnologias Inovadoras & IA' },
  '14': { name: 'Santos Egas Moniz', avatar: '/images/trainers/trainer7.png', role: 'Gestão de Informação & Comunicação Digital' },
  '15': { name: 'Claúdia Roceth', avatar: '/images/trainers/trainer3.png', role: 'Cibersegurança Corporativa' },
}

const trainersList = Object.values(trainersByCourseId)

const defaultTrainer: CourseTrainer = {
  name: 'Lourença Ricardo',
  avatar: '/images/trainers/trainer1.jpeg',
  role: 'Formadora Prime Academy',
}

export function getTrainerForCourse(courseId: string): CourseTrainer {
  if (trainersByCourseId[courseId]) {
    return trainersByCourseId[courseId]
  }
  const parsed = parseInt(courseId, 10)
  if (!Number.isNaN(parsed) && parsed > 0) {
    const index = (parsed - 1) % trainersList.length
    return trainersList[index]
  }
  const hash = courseId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return trainersList[hash % trainersList.length] ?? defaultTrainer
}
