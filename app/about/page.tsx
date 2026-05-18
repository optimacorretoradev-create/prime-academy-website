import type { Metadata } from 'next'
import Image from 'next/image'
import { 
  Award, Users, Target, Shield, CheckCircle2, TrendingUp, 
  Briefcase, Heart, Cpu, FileText, Landmark, GraduationCap 
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Sobre Nós - Prime Academy',
  description: 'Saiba mais sobre a Prime Academy. Novas Tecnologias de Gestão e Secretariado Executivo de alto nível em Angola.',
}

export default function AboutPage() {
  const metrics = [
    { 
      value: '+10.353', 
      label: 'Profissionais Capacitados', 
      desc: 'Formados em Angola desde o início do projeto em 2018.' 
    },
    { 
      value: '2018', 
      label: 'Início do Projeto', 
      desc: 'Evolução estratégica focada em profissionais que já decidem e lideram.' 
    },
    { 
      value: '80%', 
      label: 'Prática Aplicada', 
      desc: 'Metodologia prática focada em desafios reais das organizações (e 20% de teoria).' 
    }
  ]

  const differentials = [
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: 'Certificações Reconhecidas',
      desc: 'Diplomas e certificados com validade nacional e reconhecimento institucional.'
    },
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: 'Conteúdos Reais para Problemas Reais',
      desc: 'Programas de capacitação desenvolvidos com base em desafios organizacionais concretos.'
    },
    {
      icon: <Cpu className="h-8 w-8 text-accent" />,
      title: 'Metodologia Prática',
      desc: 'Estruturação baseada em 80% de prática aplicada e 20% de teoria relevante.'
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: 'Formadores de Excelência',
      desc: 'Corpo docente composto por especialistas nacionais e internacionais de experiência comprovada.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-accent" />,
      title: 'Impacto Organizacional',
      desc: 'Medimos o nosso sucesso pela transformação real e imediata nas organizações dos nossos formandos.'
    }
  ]

  const targetAudience = [
    'Gestores administrativos',
    'Secretários executivos e assessores de direção',
    'Chefias intermédias',
    'Diretores de Gabinetes e Departamentos',
    'Técnicos superiores da Administração Pública',
    'Quadros estratégicos de empresas públicas e privadas'
  ]

  const segments = [
    'Instituições públicas e governamentais',
    'Empresas privadas nacionais e multinacionais',
    'Bancos e seguradoras',
    'Universidades e centros de investigação',
    'ONGs e organismos internacionais'
  ]

  const specialPrograms = [
    'Agenciamento de formadores e gestão de formações estratégicas',
    'Atualização de competências e habilidades de altos gestores',
    'Briefing sobre ética e deontologia profissional'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <Badge className="bg-accent text-accent-foreground border border-white/20 uppercase tracking-widest px-4 py-1.5 rounded-full text-xs">
            PRIME ACADEMY
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl mx-auto">
            Novas Tecnologias de Gestão e Secretariado Executivo
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl text-pretty font-light leading-relaxed">
            Formação Executiva Avançada em Novas Tecnologias de Gestão Administrativa, Secretarial e Liderança Corporativa em Angola.
          </p>
        </div>
      </section>

      {/* Trajectory / Manifesto */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-accent font-bold text-xs uppercase tracking-wider">QUEM SOMOS</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-primary">A Nossa Trajetória</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-pretty text-base">
                A <strong>Prime Academy</strong> é uma academia de formação profissional avançada, resultado de um projeto iniciado em 2018, que já capacitou mais de <strong>10.353 profissionais em Angola</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed text-pretty text-base">
                Atuamos no desenvolvimento de competências estratégicas, técnicas e tecnológicas, apoiando organizações e líderes na modernização dos seus modelos de gestão e na adaptação às exigências da era digital.
              </p>
              <p className="text-muted-foreground leading-relaxed text-pretty text-base">
                Trabalhamos diretamente com profissionais que lideram, decidem e influenciam, contribuindo ativamente para a construção de organizações mais eficientes, competitivas e sustentáveis no mercado nacional e internacional.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl">
                <p className="text-xs text-primary font-bold uppercase mb-1">Manifesto Institucional</p>
                <p className="text-sm text-primary font-medium italic">
                  "Nascemos da necessidade de modernizar competências organizacionais através da formação profissional avançada."
                </p>
              </div>
            </div>
            
            <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-border group">
              <Image 
                src="https://images.unsplash.com/photo-152202176988-66273c2fd55f?w=1000&q=80" 
                alt="Formação Executiva Prime Academy" 
                fill 
                className="object-cover group-hover:scale-102 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="py-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            {metrics.map((m, i) => (
              <div key={i} className="pt-6 md:pt-0 md:px-6 space-y-2">
                <p className="text-4xl md:text-5xl font-extrabold text-accent">{m.value}</p>
                <p className="text-sm font-bold uppercase tracking-wider text-white">{m.label}</p>
                <p className="text-xs text-white/70 max-w-xs mx-auto">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-border shadow-md rounded-3xl overflow-hidden hover:shadow-lg transition-all bg-card">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-primary">A Nossa Missão</h3>
                <p className="text-muted-foreground leading-relaxed text-sm text-pretty">
                  Capacitar profissionais para liderar, decidir e transformar organizações, por meio da aplicação de tecnologias, metodologias inovadoras e boas práticas internacionais, promovendo resultados sustentáveis e excelência organizacional.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-md rounded-3xl overflow-hidden hover:shadow-lg transition-all bg-card">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-primary">A Nossa Visão</h3>
                <p className="text-muted-foreground leading-relaxed text-sm text-pretty">
                  Ser uma academia de referência nacional e regional na formação de quadros estratégicos em gestão administrativa moderna e secretariado executivo de alto nível, reconhecida pela excelência, inovação e impacto no desenvolvimento organizacional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Differentials - "Não competimos por preço. Competimos por valor" */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-accent font-bold text-xs uppercase tracking-widest">NOSSOS DIFERENCIAIS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
              Não competimos por preço. Competimos por valor.
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Desenvolvemos programas sob medida focados no aumento real da produtividade corporativa e eficiência institucional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentials.map((diff, index) => (
              <div key={index} className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                  {diff.icon}
                </div>
                <h3 className="font-bold text-lg text-primary">{diff.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                  {diff.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience & Segments */}
      <section className="py-16 md:py-24 bg-muted/20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Target Audience */}
            <div className="space-y-6 bg-card p-8 rounded-3xl border border-border/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">Público-Alvo (Profissionais de Alto Nível)</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nossos cursos são rigorosamente projetados para qualificar profissionais que já exercem funções de decisão, assessoria ou gestão:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {targetAudience.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Segments */}
            <div className="space-y-6 bg-card p-8 rounded-3xl border border-border/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Landmark className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">Segmentação de Clientes e Parceiros</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Atendemos de forma integrada às demandas específicas dos seguintes segmentos corporativos e institucionais em Angola:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {segments.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Special Programs & Corporate Consulting */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Consultation and In Company */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-accent font-bold text-xs uppercase tracking-wider">SERVIÇOS DE CONSULTORIA</span>
                <h2 className="text-3xl font-extrabold text-primary">Consultoria Especializada & Formação In Company</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Além de nosso portfólio acadêmico, oferecemos soluções corporativas integradas sob medida para apoiar as organizações no alcance de patamares elevados de excelência organizacional.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-primary/5 p-2 rounded-lg text-primary flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-bold text-sm text-primary">Consultoria Estratégica Especializada</h4>
                    <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1 space-y-1">
                      <li>Consultoria em Gestão e Organização de Gabinetes de Altos Gestores</li>
                      <li>Consultoria em Comunicação Institucional e Assessoria de Imprensa</li>
                      <li>Construção de planos de formação sob medida para as necessidades da sua organização</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-primary/5 p-2 rounded-lg text-primary flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-bold text-sm text-primary">Formação In Company</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Programas totalmente adaptados à realidade, rotinas e desafios específicos da sua instituição, com forte implementação prática e acompanhamento pós-formação.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Badge className="bg-accent text-accent-foreground py-1 px-3 border-none">PRESENCIAL</Badge>
                <Badge className="bg-accent text-accent-foreground py-1 px-3 border-none ml-2">ONLINE</Badge>
                <Badge className="bg-accent text-accent-foreground py-1 px-3 border-none ml-2">HÍBRIDO</Badge>
                <Badge className="bg-accent text-accent-foreground py-1 px-3 border-none ml-2">IN COMPANY</Badge>
              </div>
            </div>

            {/* Special Programs */}
            <div className="space-y-6 bg-primary/5 border border-primary/10 p-8 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">Programas Especiais Executivos</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Desenvolvemos ações especiais para atualização e agenciamento executivo corporativo:
              </p>
              <div className="space-y-4 pt-2">
                {specialPrograms.map((item, index) => (
                  <div key={index} className="flex gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground font-semibold leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Teacher Body / Docents */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <Badge className="bg-primary text-white border border-white/20 uppercase tracking-widest px-3 py-1.5 rounded-full text-xs">
            CORPO DOCENTE
          </Badge>
          <h2 className="text-3xl font-extrabold text-primary">Formadores de Excelência Nacional e Internacional</h2>
          <p className="text-muted-foreground text-base leading-relaxed text-pretty">
            "A Prime Academy possui um corpo docente de excelência, composto por formadores nacionais e internacionais, com certificação qualificada e experiência comprovada nas suas áreas de actuação. Esta combinação de conhecimento técnico, vivência prática e competência pedagógica assegura uma formação de elevada qualidade, alinhada com padrões nacionais e internacionais, orientada para resultados concretos e impacto profissional."
          </p>
        </div>
      </section>
    </div>
  )
}
