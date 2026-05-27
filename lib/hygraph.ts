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
  syllabus?: { title: string; topics: string[] }[]
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

// Mock Data
const coursesData: Course[] = [
  // 1. Gestão Administrativa Digital
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
    pdfUrl: '/pdf/ferramentas_produtividade_avancada.pdf',
    syllabus: [
      { title: 'Módulo 1: Colaboração em Tempo Real (Google Workspace / M365)', topics: ['Gestão avançada de documentos partilhados', 'Configuração de acessos e permissões', 'Co-autoria e versionamento de ficheiros'] },
      { title: 'Módulo 2: Gestão Avançada de Correio e Agendas', topics: ['Filtros, regras e categorias no Outlook/Gmail', 'Delegar acesso a caixas de correio e calendários', 'Organização de reuniões corporativas complexas'] },
      { title: 'Módulo 3: Ferramentas de Comunicação Integrada', topics: ['Configuração de canais no MS Teams e Google Chat', 'Integração de aplicações externas', 'Boas práticas de reuniões online e gravação'] },
      { title: 'Módulo 4: Produtividade e Planeamento de Tarefas', topics: ['Planeamento ágil com MS Planner/To-Do', 'Notas digitais estruturadas no OneNote/Keep', 'Criação de fluxos básicos de trabalho'] }
    ],
    highlights: [
      'Acesso prático às ferramentas corporativas em nuvem',
      'Melhores práticas de produtividade corporativa em Angola',
      'Certificação oficial de aproveitamento de nível avançado',
      'Inclui modelos práticos de controlo de tarefas diárias'
    ]
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
    pdfUrl: '/pdf/gestao_documentos_arquivos.pdf',
    syllabus: [
      { title: 'Módulo 1: Fundamentos de Arquivo e Legislação', topics: ['Legislação aplicável sobre desmaterialização em Angola', 'Teoria das 3 idades dos arquivos', 'Normas internacionais de descrição arquivística'] },
      { title: 'Módulo 2: Classificação e Tabelas de Temporalidade', topics: ['Desenho de planos de classificação documental', 'Definição de tempos de conservação e eliminação', 'Estruturação de metadados padrão'] },
      { title: 'Módulo 3: Digitalização e Indexação Prática', topics: ['Tipos de scanners e optimização de imagem', 'Tecnologias de OCR (Reconhecimento Óptico de Caracteres)', 'Sistemas GED (Gestão Electrónica de Documentos)'] },
      { title: 'Módulo 4: Segurança e Políticas de Acesso', topics: ['Criptografia e assinaturas digitais', 'Controlo de perfis de utilizador e auditoria', 'Planos de contingência e salvaguarda (Backups)'] }
    ],
    highlights: [
      'Focado em auditoria e conformidade de arquivos corporativos',
      'Práticas com softwares modernos de gestão documental',
      'Certificado de aproveitamento reconhecido pelo mercado',
      'Acesso a e-books e guias práticos de arquivística'
    ]
  },
  {
    id: '3',
    name: 'Gestão do Tempo, Processos e Produtividade',
    description: 'Desenvolva estratégias para otimização do tempo, priorização de tarefas, mapeamento de processos e maximização de produtividade.',
    category: 'Gestão Administrativa Digital',
    duration: '25 horas',
    lessons: 6,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&q=80',
    rating: 4.7,
    online: true,
    level: 'Intermédio',
    syllabus: [
      { title: 'Módulo 1: Psicologia do Tempo e Diagnóstico', topics: ['Identificação de desperdiçadores de tempo', 'Cálculo do valor-hora e produtividade pessoal', 'Gestão do stress e procrastinação corporativa'] },
      { title: 'Módulo 2: Metodologias de Organização e Foco', topics: ['Método Pomodoro e blocos de tempo', 'Metodologia GTD (Getting Things Done)', 'A Matriz de Urgência e Importância de Eisenhower'] },
      { title: 'Módulo 3: Mapeamento e Optimização de Processos', topics: ['Introdução ao desenho de fluxos de trabalho', 'Eliminação de redundâncias e gargalos em equipa', 'Automação básica de tarefas rotineiras'] },
      { title: 'Módulo 4: Ferramentas Digitais de Produtividade', topics: ['Uso prático do Trello e Notion para gestão pessoal', 'Configuração de alarmes e calendários unificados', 'Sincronização entre múltiplos dispositivos'] }
    ],
    highlights: [
      'Aplicação prática imediata no ambiente profissional',
      'Modelos de planeamento semanal e diário personalizáveis',
      'Aulas interativas online com dinâmicas de grupo',
      'Certificado de conclusão imediato'
    ]
  },
  // 2. Liderança e Comunicação
  {
    id: '4',
    name: 'Comunicação Institucional',
    description: 'Desenvolva estratégias de comunicação institucional de excelência, alinhamento de mensagens e posicionamento de imagem pública corporativa.',
    category: 'Liderança e Comunicação',
    duration: '35 horas',
    lessons: 8,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    rating: 4.8,
    online: false,
    level: 'Avançado',
    syllabus: [
      { title: 'Módulo 1: Fundamentos da Comunicação Corporativa', topics: ['Diferença entre comunicação interna e externa', 'Identidade, imagem e reputação institucional', 'Stakeholders e mapeamento de públicos-alvo'] },
      { title: 'Módulo 2: Planeamento de Comunicação Estratégica', topics: ['Desenho de planos de comunicação anual', 'Alinhamento de mensagens e tom de voz da marca', 'KPIs e métricas de eficácia em comunicação'] },
      { title: 'Módulo 3: Assessoria de Imprensa e Relações Públicas', topics: ['Redacção e distribuição de press releases', 'Organização de conferências de imprensa e press kits', 'Treino de porta-vozes (Media Training)'] },
      { title: 'Módulo 4: Gestão de Crise Institucional', topics: ['Elaboração de manuais de gestão de crise', 'Simulação de respostas a incidentes públicos', 'Comunicação interna em momentos delicados'] }
    ],
    highlights: [
      'Estudos de caso reais de crises corporativas em Angola',
      'Simulações práticas de interviews e notas de imprensa',
      'Direcionado a assessores, diretores e consultores de imagem',
      'Certificação oficial de excelência corporativa'
    ]
  },
  {
    id: '5',
    name: 'Redacção Oficial',
    description: 'Domine a escrita de documentos governamentais, pareceres, ofícios e correspondência oficial segundo o protocolo e normas oficiais vigentes.',
    category: 'Liderança e Comunicação',
    duration: '30 horas',
    lessons: 8,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    rating: 4.9,
    online: true,
    level: 'Intermédio',
    syllabus: [
      { title: 'Módulo 1: Princípios da Redacção Administrativa', topics: ['Clareza, concisão, impessoalidade e formalidade', 'O acordo ortográfico aplicado à administração', 'Erros linguísticos comuns no contexto corporativo'] },
      { title: 'Módulo 2: Tipologia de Documentos Oficiais', topics: ['Estrutura e redação de Ofícios e Memorandos', 'Elaboração de Circulares, Despachos e Editais', 'Estruturação formal de Decretos e Regulamentos'] },
      { title: 'Módulo 3: Actas, Pareceres e Relatórios Técnicos', topics: ['Como elaborar actas de reuniões sem ambiguidades', 'Formatação lógica de pareceres técnicos', 'Desenho de relatórios de atividades corporativos'] },
      { title: 'Módulo 4: Protocolo e Endereçamento de Autoridades', topics: ['Fórmulas de cortesia e tratamento adequado', 'Vocativos oficiais (Excelências, Magnificências, etc.)', 'Assinaturas, carimbos e chancelas institucionais'] }
    ],
    highlights: [
      'Focado na administração pública e grandes empresas privadas',
      'Caderno de exercícios práticos com modelos oficiais editáveis',
      'Correção personalizada de produções escritas dos formandos',
      'Certificado de competência em escrita oficial corporativa'
    ]
  },
  {
    id: '6',
    name: 'Procedimentos Administrativos',
    description: 'Otimize a rotina administrativa com a correta padronização de procedimentos, atendimento, fluxos documentais e apoio executivo eficaz.',
    category: 'Liderança e Comunicação',
    duration: '40 horas',
    lessons: 10,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    rating: 4.6,
    online: false,
    level: 'Iniciante',
    syllabus: [
      { title: 'Módulo 1: Estrutura Organizacional e Rotinas', topics: ['Organigramas e fluxogramas básicos', 'Funções e responsabilidades do assistente administrativo', 'Organização física e digital do posto de trabalho'] },
      { title: 'Módulo 2: Gestão de Expediente e Arquivo Básico', topics: ['Triagem, registo e encaminhamento de correio', 'Controlo de correspondência recebida e expedida', 'Classificação primária de documentos de arquivo'] },
      { title: 'Módulo 3: Atendimento e Relações Interpessoais', topics: ['Atendimento presencial e telefónico de alta qualidade', 'Comunicação verbal e não-verbal no escritório', 'Gestão de reclamações e situações difíceis'] },
      { title: 'Módulo 4: Apoio Logístico a Reuniões e Viagens', topics: ['Reserva de salas e coordenação de agendas', 'Preparação de coffee-breaks e materiais de apoio', 'Organização de itinerários, hotéis e transportes'] }
    ],
    highlights: [
      'Formação operacional de inserção rápida no mercado',
      'Simulação prática de rotinas diárias de secretariado e apoio',
      'Abordagem comportamental e de atendimento ao cliente',
      'Certificado de aproveitamento profissional reconhecido'
    ]
  },
  {
    id: '7',
    name: 'Liderança e Gestão de RH',
    description: 'Desenvolva competências de liderança inspiradora, gestão estratégica de recursos humanos, motivação de equipas e resolução de conflitos.',
    category: 'Liderança e Comunicação',
    duration: '45 horas',
    lessons: 12,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    rating: 4.8,
    online: true,
    level: 'Avançado',
    syllabus: [
      { title: 'Módulo 1: Liderança Inspiradora e Equipas', topics: ['Auto-liderança e inteligência emocional', 'Delegação de tarefas e empoderamento (Empowerment)', 'Criação de uma cultura de feedback construtivo'] },
      { title: 'Módulo 2: Atração, Seleção e Retenção de Talentos', topics: ['Perfil de competências e anúncios de recrutamento', 'Técnicas de entrevista de seleção estruturadas', 'Processo de integração (Onboarding) de novos colaboradores'] },
      { title: 'Módulo 3: Gestão de Desempenho e Carreiras', topics: ['Avaliação de desempenho por competências e metas', 'Planos de desenvolvimento individual (PDI)', 'Planos de sucessão e políticas de remuneração'] },
      { title: 'Módulo 4: Clima, Motivação e Resolução de Conflitos', topics: ['Teorias de motivação organizacional aplicadas', 'Mediação e negociação de conflitos interpessoais', 'Legislação laboral básica (Lei Geral do Trabalho em Angola)'] }
    ],
    highlights: [
      'Orientado para líderes, coordenadores e profissionais de RH',
      'Uso de ferramentas de avaliação de perfil comportamental (DISC)',
      'Aulas gravadas com encontros síncronos de mentoria',
      'Certificado de especialização em Liderança e RH'
    ]
  },
  {
    id: '8',
    name: 'Oratória e Persuasão',
    description: 'Perca o medo de falar em público, aprenda a estruturar discursos impactantes e domine técnicas de argumentação e persuasão de alto nível.',
    category: 'Liderança e Comunicação',
    duration: '30 horas',
    lessons: 6,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
    rating: 4.9,
    online: false,
    level: 'Intermédio',
    syllabus: [
      { title: 'Módulo 1: Domínio Emocional e Fisiologia', topics: ['Técnicas respiratórias e relaxamento muscular', 'Fisiologia da voz: projecção, dicção e entoação', 'A importância do olhar e contacto visual com a plateia'] },
      { title: 'Módulo 2: Linguagem Corporal e Presença de Palco', topics: ['Gesticulação assertiva e postura corporal', 'Utilização do espaço físico no palco/sala', 'Uso adequado de suportes visuais (Slides, quadros)'] },
      { title: 'Módulo 3: Estrutura do Discurso e Storytelling', topics: ['Estruturação clássica: Exórdio, Narração, Prova e Epílogo', 'Técnicas de Storytelling para conectar emocionalmente', 'Como iniciar e encerrar uma apresentação de forma memorável'] },
      { title: 'Módulo 4: Argumentação, Persuasão e Objeções', topics: ['Gatilhos mentais de persuasão (Cialdini)', 'Técnicas de debate e contra-argumentação', 'Gestão de perguntas e respostas em sessões difíceis'] }
    ],
    highlights: [
      'Aulas totalmente práticas com gravação e feedback individual',
      'Melhoria notável na autoconfiança e imagem profissional',
      'Ideal para palestras, reuniões de direcção e negociações comerciais',
      'Certificado em Oratória e Comunicação Persuasiva'
    ]
  },
  // 3. Secretariado Estratégico
  {
    id: '9',
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
    pdfUrl: '/pdf/secretariado_alta_direccao.pdf',
    syllabus: [
      { title: 'Módulo 1: Assessoria Executiva de Alta Performance', topics: ['O perfil do secretário como parceiro de gestão', 'Confidencialidade, ética e discrição de gabinete', 'Tomada de decisões autónomas autorizadas'] },
      { title: 'Módulo 2: Gestão Avançada de Gabinete', topics: ['Coordenação de agendas de múltiplos gestores', 'Filtro e triagem de telefonemas e visitas estratégicas', 'Organização de reuniões do Conselho de Administração'] },
      { title: 'Módulo 3: Protocolo do Estado e Relações Públicas', topics: ['Precedências protocolares e recepção de autoridades', 'Organização de jantares e almoços oficiais de negócios', 'Diplomacia e regras internacionais de cortesia'] },
      { title: 'Módulo 4: Gestão de Documentos Confidenciais', topics: ['Classificação e arquivo seguro de atas e relatórios', 'Segurança física e digital da informação sensível', 'Redação de correspondência executiva avançada'] }
    ],
    highlights: [
      'O curso mais prestigiado para assessoria executiva em Angola',
      'Simulações práticas de crises operacionais de gabinete',
      'Foco em imagem profissional e comunicação corporativa',
      'Certificado executivo reconhecido internacionalmente'
    ]
  },
  {
    id: '10',
    name: 'Gestão de Gabinete de Altos Gestores',
    description: 'Otimize o funcionamento do gabinete com as melhores técnicas de triagem de informação, facilitação de fluxos e atendimento a parceiros estratégicos.',
    category: 'Secretariado Estratégico',
    duration: '40 horas',
    lessons: 10,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    rating: 4.7,
    online: true,
    level: 'Avançado',
    syllabus: [
      { title: 'Módulo 1: Estruturação Operacional do Gabinete', topics: ['Mapeamento do fluxo de tarefas do gestor', 'Estabelecimento de prioridades diárias e semanais', 'Gestão logistics do espaço físico do gabinete'] },
      { title: 'Módulo 2: Processamento Eficiente de Informação', topics: ['Gestão de e-mails do gestor e caixas partilhadas', 'Resumo de relatórios longos para apoio à decisão', 'Preparação de pastas e dossiers de reuniões'] },
      { title: 'Módulo 3: Relacionamento Institucional e Diplomacia', topics: ['Filtro assertivo de contatos e pedidos de audiência', 'Atendimento protocolar de clientes e investidores VIP', 'Mediação de comunicação entre o gestor e a equipa'] },
      { title: 'Módulo 4: Controlo de Pendentes e Seguimento', topics: ['Criação de matrizes de acompanhamento de decisões', 'Follow-up de tarefas delegadas pelo gestor', 'Gestão de arquivos de segurança pessoal do gestor'] }
    ],
    highlights: [
      'Orientado a libertar tempo produtivo do gestor assistido',
      'Estudo de ferramentas digitais de acompanhamento e controlo',
      'Certificado de especialização em Gestão Operacional de Gabinetes',
      'Acesso a materiais exclusivos and templates de relatórios de apoio'
    ]
  },
  {
    id: '11',
    name: 'Protocolo e Etiqueta Empresarial',
    description: 'Domine as regras de protocolo nacional e internacional, etiqueta de negócios, vestuário corporativo e organização de eventos corporativos.',
    category: 'Secretariado Estratégico',
    duration: '30 horas',
    lessons: 8,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80',
    rating: 4.8,
    online: false,
    level: 'Intermédio',
    syllabus: [
      { title: 'Módulo 1: Introdução ao Protocolo e Etiqueta', topics: ['História e evolução das regras de cortesia no trabalho', 'Apresentações, saudações, beijamão e cartões de visita', 'Etiqueta na comunicação escrita e digital (Netiqueta)'] },
      { title: 'Módulo 2: Protocolo Institucional Angolano', topics: ['Lei das Precedências do Estado em Angola', 'Disposição de bandeiras e símbolos nacionais', 'Organização de comitivas e recepção de autoridades públicas'] },
      { title: 'Módulo 3: Imagem Pessoal e Marketing Profissional', topics: ['Dress Code corporativo: formal, semi-formal e casual', 'A importância da postura e comunicação não-verbal', 'Higiene de imagem corporativa e marketing pessoal'] },
      { title: 'Módulo 4: Eventos e Almoços de Negócios', topics: ['Organização de mesas e precedência de convidados', 'Regras de comportamento em almoços e jantares formais', 'Protocolo em eventos corporativos: inaugurações, galas e assinaturas'] }
    ],
    highlights: [
      'Inclui workshop prático de comportamento em refeições de negócios',
      'Ideal para relações públicas, secretários executivos e diplomatas',
      'Foco em etiqueta corporativa angolana e internacional',
      'Certificado de Etiqueta e Protocolo Empresarial'
    ]
  },
  {
    id: '12',
    name: 'Práticas de Secretariado Executivo',
    description: 'Formação essencial nas competências operacionais e organizativas indispensáveis para o sucesso diário no Secretariado Executivo.',
    category: 'Secretariado Estratégico',
    duration: '45 horas',
    lessons: 10,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    rating: 4.5,
    online: true,
    level: 'Iniciante',
    syllabus: [
      { title: 'Módulo 1: Introdução ao Secretariado Moderno', topics: ['Funções e novos desafios do secretário no escritório 4.0', 'Competências emocionais e organização do trabalho', 'Multitasking controlado e foco operacional'] },
      { title: 'Módulo 2: Comunicação e Redacção de Expediente', topics: ['Redação de e-mails corporativos formais e informais', 'Técnicas de atendimento telefónico e registo de mensagens', 'Envio e receção de correspondência e pacotes'] },
      { title: 'Módulo 3: Ferramentas Digitais do Secretariado', topics: ['Uso básico de folhas de cálculo (Excel) para controlo', 'Criação de apresentações limpas em PowerPoint/Canva', 'Gestão de pastas partilhadas em nuvem (Drive/Dropbox)'] },
      { title: 'Módulo 4: Logística e Apoio ao Escritório', topics: ['Encomenda e controlo de stock de material de escritório', 'Gestão de caixa de despesas correntes (Fundo de Maneio)', 'Preparação de salas de reunião e apoio a visitantes'] }
    ],
    highlights: [
      'Ideal para transição de carreira ou novos profissionais',
      'Focado nas tarefas mais solicitadas no mercado de trabalho em Angola',
      'Exercícios 100% baseados em simulações reais',
      'Certificado profissional básico de secretariado executivo'
    ]
  },
  // 4. Tecnologias Inovadoras
  {
    id: '13',
    name: 'Inteligencia Artificial para automação de tarefas administrativas',
    description: 'Utilização prática de ferramentas de IA (como ChatGPT e Copilot) para automatizar e otimizar tarefas administrativas diárias.',
    category: 'Tecnologias Inovadoras',
    duration: '30 horas',
    lessons: 8,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    rating: 4.9,
    online: true,
    level: 'Intermédio',
    pdfUrl: '/pdf/ia_automacao_tarefas.pdf',
    syllabus: [
      { title: 'Módulo 1: Introdução à IA Generativa', topics: ['Como funcionam os Grandes Modelos de Linguagem (LLMs)', 'Principais ferramentas: ChatGPT, Claude, Microsoft Copilot e Gemini', 'Limitações da IA e cuidados com privacidade e segurança de dados'] },
      { title: 'Módulo 2: Técnicas de Prompt Engineering', topics: ['Princípios básicos de construção de prompts eficazes', 'Prompts de contexto, papel e restrições para bons outputs', 'Criação de prompts para escrita de e-mails, atas e relatórios'] },
      { title: 'Módulo 3: IA na Prática Administrativa', topics: ['Pesquisa rápida e síntese automática de documentos longos', 'Criação automática de roteiros e ideias de apresentações', 'Tradução automática de correspondência internacional'] },
      { title: 'Módulo 4: Excel e Produtividade com IA', topics: ['Como escrever folhas de cálculo (Excel) complexas usando o ChatGPT', 'Análise rápida de dados em tabelas com auxílio do Copilot', 'Introdução à criação de imagens e gráficos com IA'] }
    ],
    highlights: [
      'Aulas práticas focadas em ganhos imediatos de tempo de trabalho',
      'Caderno de prompts de utilidade administrative prontos para usar',
      'Não necessita de competências em programação ou TI avançada',
      'Certificado de competência em Inteligência Artificial Administrativa'
    ]
  },
  {
    id: '14',
    name: 'Tecnologias de Comunicação e Gestão de Informação',
    description: 'Domine as novas ferramentas de comunicação e plataformas digitais colaborativas essenciais para gerir informações e liderar equipas.',
    category: 'Tecnologias Inovadoras',
    duration: '35 horas',
    lessons: 8,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    rating: 4.7,
    online: true,
    level: 'Intermédio',
    syllabus: [
      { title: 'Módulo 1: Colaboração em Nuvem e Organização', topics: ['Estruturação de ficheiros na nuvem de forma lógica', 'Versionamento de arquivos e resolução de conflitos de edição', 'Ferramentas de desenho colaborativo (Miro/Whiteboard)'] },
      { title: 'Módulo 2: Plataformas de Gestão de Conhecimento', topics: ['Introdução à criação de bases de dados de equipa no Notion', 'Configuração de Wikis corporativas internas', 'Substituição de pastas complexas por painéis limpos'] },
      { title: 'Módulo 3: Ferramentas Ágeis de Comunicação', topics: ['Redução de e-mails internos usando canais do Slack e Teams', 'Integração de notificações automáticas', 'Boas práticas na comunicação assíncrona'] },
      { title: 'Módulo 4: Gestão e Acompanhamento de Tarefas Cloud', topics: ['Painéis Kanban em equipa com Trello e Monday.com', 'Atribuição de responsabilidades e datas limite automáticas', 'Relatórios visuais de progresso de projetos'] }
    ],
    highlights: [
      'Indispensável para equipas modernas que trabalham em regime remoto ou híbrido',
      'Aulas práticas em laboratório com licenças de demonstração',
      'Certificação reconhecida de competências digitais corporativas',
      'Criação de um painel de controlo personalizado para a sua empresa'
    ]
  },
  {
    id: '15',
    name: 'Cibersegurança para gestores',
    description: 'Compreenda os riscos digitais modernos, aprenda a proteger os dados da sua empresa e lidere uma cultura de cibersegurança.',
    category: 'Tecnologias Inovadoras',
    duration: '25 horas',
    lessons: 6,
    price: 'Sob consulta',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    rating: 4.8,
    online: true,
    level: 'Avançado',
    syllabus: [
      { title: 'Módulo 1: Vetores de Ataque Comuns nas Empresas', topics: ['Compreender Phishing, Malware e Engenharia Social', 'Os riscos das redes Wi-Fi públicas e computadores BYOD', 'A anatomia de um roubo de identidade corporativo'] },
      { title: 'Módulo 2: Práticas Fundamentais de Defesa', topics: ['Criação e gestão segura de passwords corporativas', 'Configuração e importância da Autenticação de Dois Fatores (2FA)', 'Uso adequado de VPNs no acesso remoto'] },
      { title: 'Módulo 3: Legislação e Privacidade em Angola', topics: ['Conformidade com a Lei de Protecção de Dados Pessoais', 'O papel do gestor perante fugas de informação corporativa', 'Diretrizes de recolha e armazenamento seguro de dados de clientes'] },
      { title: 'Módulo 4: Plano de Resposta a Incidentes', topics: ['Passos essenciais perante suspeita de comprometimento digital', 'Configuração de rotinas de Backups resilientes', 'Criação de uma cultura de cibersegurança nos colaboradores'] }
    ],
    highlights: [
      'Foco de negócios, sem necessidade de termos informáticos ultra-técnicos',
      'Checklist executiva de auditoria rápida de segurança para gabinetes',
      'Ministrado por auditores e peritos seniores em segurança da informação',
      'Certificado Executivo em Cibersegurança Corporativa'
    ]
  }
]

const galleryImagesData: GalleryImage[] = [
  {
    id: 'g1',
    imageUrl: '/Galeria/Cerimonia/cer (5).jpeg',
    caption: 'Momento de excelência: Graduação de profissionais qualificados em 2025',
    category: 'Destaque'
  },
  {
    id: 'g2',
    imageUrl: '/Galeria/Aulas/A (1).jpeg',
    caption: 'Formação Avançada de Secretariado Executivo',
    category: 'Aulas'
  },
  {
    id: 'g3',
    imageUrl: '/Galeria/W. Gestao de viagens/g3.jpeg',
    caption: 'Workshop intensivo de desenvolvimento profissional',
    category: 'Workshops'
  },
  {
    id: 'g4',
    imageUrl: '/Galeria/Cerimonia/cer (12).jpeg',
    caption: 'Cerimónia de Liderança Executiva em Luanda',
    category: 'Cerimónia'
  },
  {
    id: 'g5',
    imageUrl: '/Galeria/Aulas/A (2).jpeg',
    caption: 'Sessão de Mentoria Executiva Individualizada',
    category: 'Aulas'
  },
  {
    id: 'g6',
    imageUrl: '/Galeria/Aulas/A (3).jpeg',
    caption: 'Aula Prática de Tecnologias de Gestão',
    category: 'Aulas'
  },
  {
    id: 'g7',
    imageUrl: '/Galeria/Aulas/A (4).jpeg',
    caption: 'Sessão Prática de Gestão Administrativa Digital',
    category: 'Aulas'
  },
  {
    id: 'g8',
    imageUrl: '/Galeria/W. Gestao de viagens/g1.jpeg',
    caption: 'Workshop de Gestão de Viagens Corporativas',
    category: 'Workshops'
  },
  {
    id: 'g9',
    imageUrl: '/Galeria/W. Gestao de viagens/g2.jpeg',
    caption: 'Sessão Prática de Planeamento de Itinerários',
    category: 'Workshops'
  },
  {
    id: 'g10',
    imageUrl: '/Galeria/W. Gestao de viagens/g4.jpeg',
    caption: 'Workshop Avançado de Gestão de Eventos',
    category: 'Workshops'
  },
  {
    id: 'g11',
    imageUrl: '/Galeria/W. Gestao de viagens/g5.jpeg',
    caption: 'Treinamento em Logística e Coordenação',
    category: 'Workshops'
  },
  {
    id: 'g12',
    imageUrl: '/Galeria/W. Gestao de viagens/g6.jpeg',
    caption: 'Aula Prática de Orçamentação de Viagens',
    category: 'Workshops'
  },
  {
    id: 'g13',
    imageUrl: '/Galeria/W. Gestao de viagens/g7.jpeg',
    caption: 'Encerramento do Workshop de Gestão de Viagens',
    category: 'Workshops'
  },
  {
    id: 'g14',
    imageUrl: '/Galeria/Cerimonia/cer (1).jpeg',
    caption: 'Cerimónia de Abertura - Turma 2025',
    category: 'Cerimónia'
  },
  {
    id: 'g15',
    imageUrl: '/Galeria/Cerimonia/cer (2).jpeg',
    caption: 'Palestra de Abertura com Convidado Especial',
    category: 'Cerimónia'
  },
  {
    id: 'g16',
    imageUrl: '/Galeria/Cerimonia/cer (3).jpeg',
    caption: 'Apresentação de Certificados - Bloco 1',
    category: 'Cerimónia'
  },
  {
    id: 'g17',
    imageUrl: '/Galeria/Cerimonia/cer (4).jpeg',
    caption: 'Momento de Celebração com Participantes',
    category: 'Cerimónia'
  },
  {
    id: 'g18',
    imageUrl: '/Galeria/Cerimonia/cer (6).jpeg',
    caption: 'Foto de Grupo - Turma Formada',
    category: 'Cerimónia'
  },
  {
    id: 'g19',
    imageUrl: '/Galeria/Cerimonia/cer (7).jpeg',
    caption: 'Discurso de Encerramento',
    category: 'Cerimónia'
  },
  {
    id: 'g20',
    imageUrl: '/Galeria/Cerimonia/cer (8).jpeg',
    caption: 'Entrega de Certificados - Bloco 2',
    category: 'Cerimónia'
  },
  {
    id: 'g21',
    imageUrl: '/Galeria/Cerimonia/cer (9).jpeg',
    caption: 'Abraços e Despedidas na Cerimónia',
    category: 'Cerimónia'
  },
  {
    id: 'g22',
    imageUrl: '/Galeria/Cerimonia/cer (10).jpeg',
    caption: 'Coquetel de Encerramento',
    category: 'Cerimónia'
  },
  {
    id: 'g23',
    imageUrl: '/Galeria/Cerimonia/cer (11).jpeg',
    caption: 'Momento Solene de Apresentação de Honras',
    category: 'Cerimónia'
  },
  {
    id: 'g24',
    imageUrl: '/Galeria/Formacao/f1.jpeg',
    caption: 'Aprendizagem prática e colaborativa em sala de aula',
    category: 'Formações'
  },
  {
    id: 'g25',
    imageUrl: '/Galeria/Formacao/f2.jpeg',
    caption: 'Sessão de Formação Intensiva',
    category: 'Formações'
  },
  {
    id: 'g26',
    imageUrl: '/Galeria/Formacao/f3.jpeg',
    caption: 'Aula Teórica e Prática Integrada',
    category: 'Formações'
  },
  {
    id: 'g27',
    imageUrl: '/Galeria/Formacao/f4.jpeg',
    caption: 'Dinâmica de Grupo na Formação',
    category: 'Formações'
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
    text: 'A formação em Inteligencia Artificial para automação de tarefas administrativas superou todas as minhas expectativas. O professor tinha imensa experiência prática.',
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
