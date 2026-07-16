import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Award, Users, Target, Shield, CheckCircle2, TrendingUp,
  Briefcase, Heart, Cpu, Landmark, GraduationCap,
  BookOpen, BadgeCheck, Gem, Lightbulb, Building2, Globe, HeartHandshake
} from 'lucide-react'
import { CtaSection } from '@/components/home/cta-section'

const TEAM_SECTIONS = [
  {
    department: "Direção Geral",
    gridClass: "grid grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto gap-8",
    members: [
      { name: "Júlia Indira Simões", role: "Directora Geral", img: "/images/Equipe/dg1.jpeg" },
      { name: "Santos Egas Moniz", role: "Director Pedagógico", img: "/images/trainers/SantosEgasMoniz.png" }
    ]
  },
  {
    department: "Gestão Administrativa",
    gridClass: "grid grid-cols-2 lg:grid-cols-4 gap-6",
    members: [
      { name: "Analtina Damião", role: "Secretária", img: "/images/Equipe/ga1.jpeg" },
      { name: "Tito Dange", role: "Responsável de Relações Públicas", img: "/images/Equipe/ga2.jpeg" },
      { name: "Daniel Kangala", role: "Coordenador de Administração", img: "/images/Equipe/ga3.jpeg" },
      { name: "Nuno Daniel", role: "Coordenador de Formações", img: "/images/Equipe/ga4.jpeg" }
    ]
  },
  {
    department: "Gestão Técnica",
    gridClass: "grid grid-cols-2 lg:grid-cols-4 gap-6",
    members: [
      { name: "Cristina Alberto", role: "Comercial", img: "/images/Equipe/et2.jpeg" },
      { name: "Dulce Victor", role: "Gestora de Eventos", img: "/images/Equipe/et3.jpeg" },
      { name: "Danilson André", role: "Gestor de Redes Sociais", img: "/images/Equipe/et4.jpeg" },
      { name: "Silvestre Jorge", role: "Coordenador de TIC’s", img: "/images/Equipe/et1.jpeg" }
    ]
  }
];

export const metadata: Metadata = {
  title: 'Sobre Nós - Prime Academy',
  description: 'Saiba mais sobre a Prime Academy. Novas Tecnologias de Gestão e Secretariado Executivo de alto nível em Angola.',
}

export default function AboutPage() {

  const differentials = [
    { icon: Award, title: 'Certificações Reconhecidas', desc: 'Diplomas e certificados com validade nacional e reconhecimento institucional.' },
    { icon: Heart, title: 'Conteúdos para Problemas Reais', desc: 'Programas desenvolvidos com base em desafios organizacionais concretos.' },
    { icon: Cpu, title: 'Metodologia Prática', desc: '80% de prática aplicada e 20% de teoria relevante.' },
    { icon: Users, title: 'Formadores de Excelência', desc: 'Especialistas nacionais e internacionais de experiência comprovada.' },
    { icon: TrendingUp, title: 'Impacto Organizacional', desc: 'Medimos o sucesso pela transformação real nas organizações.' },
    { icon: Target, title: 'Formação Sob Medida', desc: 'Programas In Company adaptados à realidade da sua instituição.' },
  ]

  const trainers = [
    { name: 'Cláudia Chaffer', role: 'Secretariado e Eventos', bio: 'Especialista em Novas Tecnologias de Secretariado e Organização de Eventos Corporativos', avatar: '/images/trainers/CláudiaChaffer.png' },
    { name: 'Lourença Ricardo', role: 'Gestão e Administração', bio: 'Especialista em Gestão e Administração Pública', avatar: '/images/trainers/LourençaRicardo.jpeg' },
    { name: 'Isabel Gaspar', role: 'Jurista e Compliance', bio: 'Jurista (Advogada), Especialista em Compliance', avatar: '/images/trainers/IsabelGaspar.jpeg' },
    { name: 'Francisco Domingos', role: 'Comunicação', bio: 'Especialista em Técnicas de Expressão Oral e Escrita em Língua Portuguesa', avatar: '/images/trainers/FranciscoDomingos.jpeg' },
    { name: 'Hossana Inglês', role: 'Comunicação', bio: 'Especialista em Comunicação e Persuasão', avatar: '/images/trainers/HossanaInglês.png' },
    { name: 'Santos Egas Moniz', role: 'Gestão e Inovação', bio: 'Especialista em Gestão Empreendedorismo e Inovação, Comunicação Institucional.', avatar: '/images/trainers/SantosEgasMoniz.png' },
    { name: 'Valéria Serra', role: 'Secretariado', bio: 'Especialista em Secretariado para Alta Gestão', avatar: '/images/trainers/ValériaSerra.png' },
    { name: 'Eduardo Chiloya', role: 'Recursos Humanos', bio: 'Especialista em Gestão Estratégica de Recursos Humanos.', avatar: '/images/trainers/EduardoChiloya.jpeg' },
    { name: 'Jacira Pimental', role: 'Gestão de Projectos', bio: 'Especialista em Gestão de Projectos de Desenvolvimento Institucional.', avatar: '/images/trainers/JaciraPimental.jpeg' },
    { name: 'Regina Mestre', role: 'Jurista e Advogada', bio: 'Especialista nas Áreas Jurídicas e de Gestão.', avatar: '/images/trainers/Regina Mestre2.jpeg' },
    { name: 'Silvestre Jorge Pascoal', role: 'Tecnologias Inovadoras e IA', bio: 'Especialista em Transformação Digital, Automação de Processos com Inteligência Artificial e Infraestrutura de TI.', avatar: '/images/trainers/Silvestre Jorge Pascoal.jpeg' },
    { name: 'Fábio Sebastião', role: 'Comunicação e Análise Financeira', bio: 'Especialista em Estruturação de Apresentações Estratégicas, Comunicação de Alto Impacto e Análise Financeira.', avatar: '/images/trainers/Fábio Sebastião.jpeg' },
  ]

  const targetAudience = [
    'Gestores administrativos',
    'Secretários executivos e assessores de direção',
    'Chefias intermédias',
    'Diretores de Gabinetes e Departamentos',
    'Técnicos superiores da Administração Pública',
    'Quadros estratégicos de empresas públicas e privadas',
  ]

  const segments = [
    'Instituições públicas e governamentais',
    'Empresas privadas nacionais e multinacionais',
    'Bancos e seguradoras',
    'Universidades e centros de investigação',
    'ONGs e organismos internacionais',
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO BANNER (Top) ── */}
      <section className="relative pt-48 pb-16 lg:pt-48 lg:pb-28 overflow-hidden bg-[#312455]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#312455]/95 via-[#312455]/85 to-[#312455]/75 lg:bg-gradient-to-r lg:from-[#312455]/95 lg:via-[#312455]/90 lg:to-[#312455]/80" />
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a66a8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#8a66a8]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4 max-w-3xl mx-auto">
            ESTAMOS JUNTOS
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed mt-4 text-pretty">
            Desde 2018 a fomentar o desenvolvimento e a melhoria contínua das habilidades técnicas e humanas em gestão secretarial
          </p>
        </div>
      </section>


      {/* ── SECÇÃO 1 — Colagem de fotos + Apresentação (Fundo Branco, conforme referência) ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT — Photo Collage (exactly like reference) */}
            <div className="relative h-[420px] md:h-[500px] hidden md:block">
              {/* Main large photo */}
              <div className="absolute top-0 left-0 w-[58%] h-[70%] rounded-3xl overflow-hidden shadow-2xl">
                <img src="/images/4.jpeg" alt="Equipa Prime Academy" className="w-full h-full object-cover" />
              </div>
              {/* Top-right photo */}
              <div className="absolute top-0 right-0 w-[38%] h-[45%] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img src="/images/5.jpeg" alt="Profissionais Prime Academy" className="w-full h-full object-cover" />
              </div>
              {/* Bottom-right photo */}
              <div className="absolute bottom-0 right-0 w-[55%] h-[50%] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img src="/images/6.jpeg" alt="Sala de formação executiva" className="w-full h-full object-cover" />
              </div>
              {/* Floating experience badge */}
              <div className="absolute bottom-6 left-4 bg-[#8a66a8] text-white px-5 py-3 rounded-2xl shadow-2xl z-20 text-center min-w-[110px] border border-white/20">
                <p className="text-3xl font-black text-white leading-none">2018</p>
                <p className="text-[10px] font-bold uppercase tracking-wider leading-tight mt-1 text-white/80">Início do<br />Projeto</p>
              </div>
              {/* Decorative dashed circle */}
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full border-2 border-dashed border-[#8a66a8]/25 z-0" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#8a66a8] rounded-full opacity-50 z-10" />
            </div>

            {/* RIGHT — Text + feature list + CTA */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#312455] mt-3 leading-tight">
                  CONHEÇA-NOS
                </h2>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed">
                Somos a Prime Academy, um centro de formação corporativa avançada, resultado de um projeto iniciado em 2018, que já capacitou mais de <strong className="text-[#312455] font-black">10.353 profissionais</strong>, de norte a sul de Angola.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Actuamos no desenvolvimento de competências estratégicas, técnicas e tecnológicas, apoiando organizações e líderes na modernização dos seus modelos de gestão e na adaptação às exigências da era digital.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Trabalhamos com profissionais que lideram, decidem e influenciam, contribuindo para a construção de organizações mais eficientes, competitivas e sustentáveis.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Em 2026 lançamos o <strong className="text-[#312455] font-black">Manual de Gestão e Redacção de Documentos Oficiais e Pareceres Técnicos</strong> para complementar esta jornada e contribuir na uniformização da apresentação das correspondências oficiais das instituições públicas e privadas de Angola.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Muito mais está por vir.
              </p>

              {/* Feature checkpoints */}
              <div className="grid grid-cols-2 gap-4 py-2">
                {[
                  { color: 'bg-rose-500', label: 'Formadores' },
                  { color: 'bg-[#8a66a8]', label: 'A formação online e presencial' },
                  { color: 'bg-amber-500', label: 'Acesso Vitalício' },
                  { color: 'bg-teal-500', label: 'Resultados Reais' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full ${feat.color} flex items-center justify-center shrink-0`}>
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{feat.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/gallery"
                  className="inline-block bg-[#312455] hover:bg-[#8a66a8] text-white font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Conheça o nosso trabalho
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO 5 — Nossa Identidade (Missão & Visão + Público)
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#312455]">Nossa Identidade</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#8a66a8]/10 flex items-center justify-center">
                <Target className="h-7 w-7 text-[#8a66a8]" />
              </div>
              <h3 className="text-xl font-black text-[#312455]">A Nossa Missão</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Capacitar profissionais para liderar, decidir e transformar organizações, por meio da aplicação de tecnologias, metodologias inovadoras e boas práticas internacionais, promovendo resultados sustentáveis e excelência organizacional.
              </p>
            </div>

            <div className="bg-[#312455] rounded-3xl p-8 flex flex-col gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                <Shield className="h-7 w-7 text-[#c4a9e0]" />
              </div>
              <h3 className="text-xl font-black text-white">A Nossa Visão</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Ser uma academia de referência nacional e regional na formação de quadros estratégicos em gestão administrativa moderna e secretariado executivo de alto nível, reconhecida pela excelência, inovação e impacto no desenvolvimento organizacional.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#8a66a8]/10 flex items-center justify-center">
                <Gem className="h-7 w-7 text-[#8a66a8]" />
              </div>
              <h3 className="text-xl font-black text-[#312455]">Os Nossos Valores</h3>
              <ul className="space-y-2">
                {['Excelência', 'Especificidade', 'Cooperação', 'Rigor', 'Inovação'].map((valor) => (
                  <li key={valor} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#8a66a8] shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{valor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO PÚBLICO-ALVO
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#312455]">PÚBLICO-ALVO</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-[#8a66a8]" />
                </div>
                <h3 className="text-xl font-black text-[#312455]">Público-Alvo</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {targetAudience.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#8a66a8] mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-600 font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center">
                  <Landmark className="h-5 w-5 text-[#8a66a8]" />
                </div>
                <h3 className="text-xl font-black text-[#312455]">Clientes e Parceiros</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {segments.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#8a66a8] mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-600 font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO 2 — Diferenciais
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">NOSSOS DIFERENCIAIS</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#312455] mt-2 leading-tight max-w-xs">
                Não competimos por preço. Competimos por valor.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentials.map((diff, i) => {
              const Icon = diff.icon
              return (
                <div key={i} className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-[0_16px_40px_rgba(138,102,168,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center group-hover:bg-[#312455] transition-colors duration-300">
                    <Icon className="h-6 w-6 text-[#8a66a8] group-hover:text-[#c4a9e0] transition-colors duration-300" />
                  </div>
                  <h3 className="font-black text-sm text-[#312455]">{diff.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{diff.desc}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-semibold text-slate-600">
              <span className="text-[#312455] font-black">+10.353</span> profissionais já transformaram a sua carreira connosco
            </p>
            <Link
              href="/enroll"
              className="bg-[#312455] hover:bg-[#8a66a8] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap shadow-md"
            >
              Inscreva-se Já
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          O QUE NOS DEFINE — Pilares
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">O QUE NOS DEFINE</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#312455] mt-3 leading-tight">
              Os Pilares que sustentam a Prime
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-2xl mx-auto">
              A Prime Academy não existe por acaso. Existe porque acreditamos que o secretariado executivo e a gestão administrativa são profissões estratégicas — e que Angola merece uma academia à altura dessa convicção.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: 'Formação de Excelência',
                desc: 'Programas desenhados por especialistas com experiência real de mercado. Cada curso é uma ferramenta de transformação profissional e organizacional.'
              },
              {
                icon: Lightbulb,
                title: 'Inovação e Metodologia',
                desc: 'Combinamos o que há de mais moderno em tecnologia educativa com a tradição do rigor académico. 80% de prática aplicada, 20% de teoria relevante.'
              },
              {
                icon: TrendingUp,
                title: 'Impacto e Resultados',
                desc: 'O nosso sucesso mede-se pelo impacto real nas organizações. Cada profissional formado representa uma equipa mais preparada e uma instituição mais forte.'
              }
            ].map((pilar, i) => {
              const Icon = pilar.icon
              return (
                <div key={i} className="group bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#8a66a8]/10 flex items-center justify-center mx-auto group-hover:bg-[#312455] transition-colors duration-300">
                    <Icon className="h-7 w-7 text-[#8a66a8] group-hover:text-[#c4a9e0] transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-black text-[#312455]">{pilar.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{pilar.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO 4 — Equipa e Formadores
      ══════════════════════════════════════════════ */}
      <section id="formadores" className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">A EXCELÊNCIA QUE NÃO SE NEGOCEIA</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#312455] mt-3 leading-tight">
              As Pessoas por Detrás da Prime
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-2xl mx-auto">
              A qualidade de uma academia mede-se pelas pessoas que a compõem. As nossas pessoas são de referência, desde os formadores à equipa interna. Porque dirigimos o que conhecemos e conhecemos o que ensinamos.
            </p>
          </div>

          {/* Corpo Docente */}
          <div className="mb-16">
            {/* Row 1: 4 trainers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-10">
              {trainers.slice(0, 4).map((trainer, i) => (
                <div key={i} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#8a66a8]/20 group-hover:border-[#8a66a8] transition-all duration-300 shadow-md">
                    <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <p className="font-black text-lg text-[#312455] leading-tight">{trainer.name}</p>
                    <p className="text-xs text-[#8a66a8] font-bold mt-1 uppercase tracking-wider">{trainer.role}</p>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{trainer.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: 4 trainers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-10">
              {trainers.slice(4, 8).map((trainer, i) => (
                <div key={i} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#8a66a8]/20 group-hover:border-[#8a66a8] transition-all duration-300 shadow-md">
                    <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <p className="font-black text-lg text-[#312455] leading-tight">{trainer.name}</p>
                    <p className="text-xs text-[#8a66a8] font-bold mt-1 uppercase tracking-wider">{trainer.role}</p>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{trainer.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3: remaining trainers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              {trainers.slice(8).map((trainer, i) => (
                <div key={i} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#8a66a8]/20 group-hover:border-[#8a66a8] transition-all duration-300 shadow-md">
                    <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <p className="font-black text-lg text-[#312455] leading-tight">{trainer.name}</p>
                    <p className="text-xs text-[#8a66a8] font-bold mt-1 uppercase tracking-wider">{trainer.role}</p>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{trainer.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 4.5 — Equipa Interna (Fundo Branco para contraste) ── */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-16">
            <div className="text-center mb-10">
              <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">EQUIPA INTERNA</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#312455] mt-3">
                Quem faz acontecer
              </h2>
            </div>
            {TEAM_SECTIONS.map((section, idx) => (
              <div key={idx} className="my-12">
                <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest text-center mt-12 mb-6">{section.department}</h3>
                <div className={section.gridClass}>
                  {section.members.map((member, mIdx) => (
                    <div 
                      key={mIdx} 
                      className={`group flex flex-col items-center bg-white p-2.5 md:p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-300 ${idx === 0 ? 'max-w-[240px] md:scale-105 mx-auto' : 'max-w-[190px] mx-auto'}`}
                    >
                      <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 relative">
                        <img
                          src={member.img}
                          alt={member.name || 'Membro da Equipa'}
                          className="object-cover object-center w-full h-full group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        />
                      </div>
                      {(member.name || member.role) && (
                        <div className="mt-3 text-center w-full">
                          {member.name && (
                            <p className="font-black text-sm text-[#312455] leading-tight">{member.name}</p>
                          )}
                          {member.role && (
                            <p className="text-[11px] md:text-xs font-semibold text-[#8a66a8] mt-1 tracking-wide uppercase">
                              {member.role}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO — Linha do Tempo
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">ORIGENS</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#312455] mt-3 leading-tight">
              Um caminho construído com trabalho e determinação
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-2xl mx-auto">
              Academia de referência em Angola para secretariado executivo, gestão administrativa e tecnologias digitais. A formar os melhores profissionais desde 2018.
            </p>
          </div>

          <div className="relative">
            {/* Linha horizontal */}
            <div className="hidden md:block absolute left-0 right-0 top-8 h-0.5 bg-[#8a66a8]/20" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
              {[
                { year: '2014', title: 'Identificação da Oportunidade', desc: 'Ausência de formação especializada em gestão secretarial.' },
                { year: '2018', title: 'Início do Projecto', desc: 'Fundação com apoio da Universidade Agostinho Neto em Luanda.' },
                { year: '2026', title: '+10.353 Profissionais Capacitados', desc: 'Estado, Forças Armadas, Governo e Ensino Superior.' },
                { year: '2026', title: 'Atualização e Contextualização de Profissionais & Lançamento do Manual', desc: 'Contextualização e Publicação do Manual.' },
              ].map((marco, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  {/* Ponto na linha */}
                  <div className="hidden md:flex w-5 h-5 rounded-full bg-[#8a66a8] border-4 border-white shadow z-10 mb-6 shrink-0" />

                  {/* Seta de progressão */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-2.5 left-[60%] text-[#8a66a8]/30">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}

                  {/* Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-full flex flex-col">
                    <span className="text-[#8a66a8] font-black text-lg">{marco.year}</span>
                    <h3 className="text-sm font-black text-[#312455] mt-1">{marco.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed flex-1">{marco.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link
              href="/gallery"
              className="inline-block bg-[#312455] hover:bg-[#8a66a8] text-white font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Ir para Galeria de Projectos
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO — Faixa Métrica de Impacto
      ══════════════════════════════════════════════ */}
      <section className="bg-[#312455] py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-white">
            {[
              { icon: BookOpen, label: 'Formação Contextualizada', sub: 'Com metodologia prática' },
              { icon: Award, label: 'Formadores', sub: 'Com experiência comprovada' },
              { icon: TrendingUp, label: 'Impacto Organizacional', sub: 'E de carreira' },
              { icon: Target, label: 'Formação Sob Medida', sub: 'Para cada formando' },
              { icon: BadgeCheck, label: 'Certificação Reconhecida', sub: 'Validade nacional' },
            ].map((feat, i) => {
              const Icon = feat.icon
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-[#8a66a8]/40 bg-[#8a66a8]/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#c4a9e0]" />
                  </div>
                  <div>
                    <p className="font-black text-sm leading-tight">{feat.label}</p>
                    <p className="text-white/55 text-[11px] mt-0.5">{feat.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO — Organizações que Confiam
      ══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-muted/20 border-y border-border/40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-8 space-y-2">
            <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest block">
              ONDE A PRIME ACTUA
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[#312455] leading-tight">
              Uma Academia. Vários Sectores. Um Único Padrão de Excelência.
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
              Da Administração Pública às maiores empresas privadas de Angola — a Prime Academy forma profissionais e equipas em todos os sectores onde a gestão secretarial e administrativa faz a diferença.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10">
            {[
              { icon: Landmark, name: 'Bancos e Seguradoras' },
              { icon: Building2, name: 'Instituições Públicas' },
              { icon: Globe, name: 'Multinacionais' },
              { icon: HeartHandshake, name: 'ONGs Internacionais' },
              { icon: GraduationCap, name: 'Universidades' },
            ].map((p, i) => {
              const PartnerIcon = p.icon
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 bg-card px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl border border-border/80 shadow-sm hover:border-accent/40 hover:shadow-md transition-all duration-300"
                >
                  <PartnerIcon className="h-4 w-4 text-accent" />
                  <span className="text-[10px] sm:text-xs font-bold text-primary">{p.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <CtaSection
        eyebrow="COMECE HOJE"
        title="Vamos dar o próximo passo?"
        subtitle="Explore o nosso catálogo de formação ou fale connosco — encontramos o programa certo para si ou para a sua equipa."
        cta1Label="Ver Formação"
        cta1Href="/courses"
        cta2Label="Falar com a Prime"
        cta2Href="/contact"
      />
    </div>
  )
}
