export interface CourseTrainer {
  name: string
  avatar: string
  role: string
}

const trainersByCourseId: Record<string, CourseTrainer> = {
  '1': { name: 'Dr. António Banza', avatar: '/images/trainers/trainer4.png', role: 'Sistemas & Tecnologias de Gestão' },
  '2': { name: 'Dra. Isabel Santos', avatar: '/images/trainers/trainer2.png', role: 'Gestão de Processos & Inovação' },
  '3': { name: 'Dr. Francisco Manuel', avatar: '/images/trainers/trainer5.png', role: 'Comunicação & Protocolo Institucional' },
  '4': { name: 'Dra. Maria Antónia', avatar: '/images/trainers/trainer1.png', role: 'Protocolo & Secretariado de Direção' },
  '5': { name: 'Dra. Patrícia Costa', avatar: '/images/trainers/trainer6.png', role: 'Gestão de Pessoas & Cultura Organizacional' },
  '6': { name: 'Dra. Ana Paula Silva', avatar: '/images/trainers/trainer3.png', role: 'Liderança & Desenvolvimento Executivo' },
  '7': { name: 'Dr. Manuel Santos', avatar: '/images/trainers/trainer7.png', role: 'Finanças Corporativas & Auditoria' },
  '8': { name: 'Dr. Carlos Mendes', avatar: '/images/trainers/trainer8.png', role: 'Logística & Cadeia de Abastecimento' },
}

const trainersList = Object.values(trainersByCourseId)

const defaultTrainer: CourseTrainer = {
  name: 'Dra. Maria Antónia',
  avatar: '/images/trainers/trainer1.png',
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
