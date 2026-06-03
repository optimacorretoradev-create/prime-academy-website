import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Award, Users, Target, Shield, CheckCircle2, TrendingUp,
  Briefcase, Heart, Cpu, Landmark, GraduationCap,
  MonitorPlay, BookOpen, Star, BadgeCheck
} from 'lucide-react'

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

  const stripFeatures = [
    { icon: MonitorPlay, label: 'Formação Online', sub: 'Plataforma 24/7' },
    { icon: GraduationCap, label: 'Formadores de Topo', sub: 'Nacionais e Internacionais' },
    { icon: BookOpen, label: 'Cursos Ilimitados', sub: 'Portfólio em expansão' },
    { icon: BadgeCheck, label: 'Membros Certificados', sub: '+10.353 Profissionais' },
  ]

  const trainers = [
    { name: 'Lourença Ricardo', role: 'Protocolo & Secretariado', bio: 'Especialista em protocolo com vasta experiência.', avatar: '/images/trainers/trainer1.jpeg' },
    { name: 'Hosana Inglês', role: 'Gestão de Processos', bio: 'Consultora de gestão focada em eficiência.', avatar: '/images/trainers/trainer2.png' },
    { name: 'Claúdia Roceth', role: 'Liderança Executiva', bio: 'Mentora de líderes de alto desempenho.', avatar: '/images/trainers/trainer3.png' },
    { name: 'Isabel Gaspar', role: 'Tecnologias de Gestão', bio: 'Expert em transformação digital.', avatar: '/images/trainers/trainer4.jpeg' },
    { name: 'Valéria Serra', role: 'Gestão de Pessoas', bio: 'Especialista em desenvolvimento de RH.', avatar: '/images/trainers/trainer6.png' },
    { name: 'Santos Egas Moniz', role: 'Finanças Corporativas', bio: 'Analista sénior com foco estratégico.', avatar: '/images/trainers/trainer7.png' },
    { name: 'Eduardo Chilowa', role: 'Logística & Supply Chain', bio: 'Líder em operações e cadeia de suprimentos.', avatar: '/images/trainers/trainer8.png' },
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
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#312455]">
        {/* Background Image with elegant overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#312455]/95 via-[#312455]/90 to-[#312455]/80" />
        
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a66a8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#8a66a8]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Sobre Nós
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed text-pretty">
            Formação Executiva Avançada em Novas Tecnologias de Gestão Administrativa, Secretarial e Liderança Corporativa em Angola.
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
                <img
                  src="/images/1.jpeg"
                  alt="Equipa Prime Academy"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Top-right photo */}
              <div className="absolute top-0 right-0 w-[38%] h-[45%] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/images/2.jpeg"
                  alt="Profissionais Prime Academy"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom-right photo */}
              <div className="absolute bottom-0 right-0 w-[55%] h-[50%] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/images/3.jpeg"
                  alt="Sala de formação executiva"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating experience badge (exactly like reference image) */}
              <div className="absolute bottom-6 left-4 bg-[#8a66a8] text-white px-5 py-3 rounded-2xl shadow-2xl z-20 text-center min-w-[110px] border border-white/20">
                <p className="text-3xl font-black text-white leading-none">2018</p>
                <p className="text-[10px] font-bold uppercase tracking-wider leading-tight mt-1 text-white/80">Início do<br />Projeto</p>
              </div>
              {/* Decorative dashed circle (matches reference style) */}
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
                A <strong className="text-[#312455]">Prime Academy</strong> é uma academia de formação profissional avançada, resultado de um projeto iniciado em 2018, que já capacitou mais de <strong className="text-[#312455] font-black">10.353 profissionais em Angola</strong>. Atuamos no desenvolvimento de competências estratégicas, técnicas e tecnológicas, apoiando organizações e líderes na modernização dos seus modelos de gestão e na adaptação às exigências da era digital. Trabalhamos com profissionais que lideram, decidem e influenciam, contribuindo para a construção de organizações mais eficientes, competitivas e sustentáveis.
              </p>

              {/* Feature checkpoints (colored exactly matching brand visual ID) */}
              <div className="grid grid-cols-2 gap-4 py-2">
                {[
                  { color: 'bg-rose-500', label: 'Formadores de Elite' },
                  { color: 'bg-[#8a66a8]', label: 'Formação Online' },
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
                  href="/courses"
                  className="inline-block bg-[#312455] hover:bg-[#8a66a8] text-white font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Descobrir Cursos
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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
          SECÇÃO 2 — Diferenciais (Grid de cards como 
          a secção "Popular Courses" da referência)
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

          {/* Explore CTA strip (matching reference "23.000+ more" bar) */}
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
          SECÇÃO 3 — Faixa full-width com ícones
          (exactamente como a faixa roxa da referência)
      ══════════════════════════════════════════════ */}
      <section className="bg-[#312455] py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stripFeatures.map((feat, i) => {
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
          SECÇÃO 4 — Corpo Docente
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">CORPO DOCENTE</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#312455] mt-3 leading-tight">
              Formadores de Excelência Nacional e Internacional
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-2xl mx-auto">
              A Prime Academy possui um corpo docente de excelência, composto por especialistas com certificação qualificada e experiência comprovada. Esta combinação de conhecimento técnico, vivência prática e competência pedagógica assegura uma formação de elevada qualidade, orientada para resultados concretos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {trainers.map((trainer, i) => (
              <div key={i} className="group bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#8a66a8]/20 group-hover:border-[#8a66a8] transition-all duration-300 shadow-md">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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
      </section>

    </div>
  )
}
