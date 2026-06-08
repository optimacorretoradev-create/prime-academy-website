# ENTREGA OFICIAL DO WEBSITE — PRIME ACADEMY

## 1. Identificação do Projeto

| Item | Descrição |
|------|-----------|
| **Projeto** | Website Institucional e Plataforma de Gestão — Prime Academy |
| **Cliente** | Prime Academy |
| **Desenvolvedor / Empresa** | RC Media — Marketing e Resultados |
| **Data de Entrega** | 08/06/2026 |
| **Tipo de Website** | Institucional, Web App com Área Restrita e Painel Administrativo |
| **Hospedagem** | Vercel (Deploy Contínuo via Git) |
| **Domínio Oficial** | primeacademy.ao |
| **Stack Tecnológico** | Next.js 14, React, TypeScript, Tailwind CSS, Supabase, Hygraph CMS, EmailJS |

---

## 2. Descrição e Estética do Projeto

O novo website da Prime Academy foi desenvolvido sob os mais altos padrões de design digital da atualidade. A interface foi construída utilizando uma estética **Premium e Moderna**, com transições fluidas e elementos visuais de vanguarda que transmitem **autoridade, inovação e credibilidade** no mercado angolano.

O ecossistema é totalmente **responsivo** (otimizado para computadores, tablets e telemóveis) e foi arquitetado com foco na **experiência do utilizador (UI/UX)**, facilitando tanto a captação de novos leads como a navegação dos estudantes.

### Características Visuais:
- **Gradientes e Overlays Estratégicos**: Garantem legibilidade de conteúdo sem comprometer a estética
- **Animações Suaves e Transições Fluidas**: Utilizando Framer Motion para experiências dinâmicas
- **Enquadramento Otimizado de Imagens**: Foco em rostos e elementos-chave para maior impacto visual
- **Botões de Call-to-Action (CTA)**: Estrategicamente posicionados com design intuitivo

---

## 3. Estrutura da Plataforma

O mapa do website divide-se de forma clara entre a experiência pública e o ecossistema privado dos utilizadores:

### 3.1 Páginas Públicas

| Página | Descrição | Funcionalidades |
|--------|-----------|-----------------|
| **Início (Home)** | Landing page estratégica com proposta de valor | Hero dinâmico, destaques de formações, estatísticas, testemunhas, partnerships |
| **Sobre a Prime Academy** | Apresentação da instituição, missão, valores e posicionamento | Breve histórico e valores da empresa |
| **Cursos / Formações** | Catálogo dinâmico com listagem de todas as qualificações oferecidas | Grid responsivo, pré-inscrição modal integrada, detalhes do curso |
| **Detalhes do Curso** | Página individual com informações completas de cada formação | Descrição completa, Trainer info, pré-inscrição com validação |
| **Galeria / Portfólio** | Espaço visual dedicado a exibir imagens de eventos e formações anteriores | Grid de imagens otimizadas, filtros por categoria |
| **Contacto** | Página oficial contendo mapas, links diretos de comunicação e formulário integrado | Formulário de suporte, canais de comunicação (email, telefone, localização) |
| **Inscrição (Enroll)** | Portal dedicado ao processo completo de matrícula e checkout | Formulário de inscrição com validação, integração de pagamento |

### 3.2 Áreas Restritas e Autenticação

| Área | Descrição | Acesso |
|------|-----------|--------|
| **Autenticação (Login & Sign Up)** | Portal seguro de acesso para utilizadores registados | Login com Google, criação de conta, recuperação de senha |
| **Dashboard do Formando** | Espaço seguro e dinâmico dedicado ao percurso do estudante | Visualização de cursos inscritos, salas virtuais, progresso |
| **Painel Administrativo (Admin)** | Painel de controlo central para monitorização e gestão da plataforma | Gestão de utilizadores, inscrições, enrollments, relatórios |

---

## 4. Funcionalidades e Infraestrutura Técnica

### 4.1 Gestão de Conteúdo e Comunicação

| Funcionalidade | Descrição | Tecnologia |
|-----------------|-----------|-----------|
| **Formulário de Contacto Geral** | Envio direto de mensagens de suporte via EmailJS para a caixa institucional | EmailJS + Notificações |
| **Formulário de Pré-Inscrição** | Captação ativa de novos alunos diretamente na página de listagem de cursos | Modal integrado com validação |
| **Formulário de Inscrição Avançado** | Processo completo de matrícula com dados pessoais e informações de pagamento | Supabase + Validação TypeScript |
| **Gestão de Conteúdo Dinâmico (CMS - Hygraph)** | Atualização em tempo real de cursos, detalhes, imagens e conteúdo sem alterar código | Hygraph API + Revalidação ISR |

### 4.2 Infraestrutura de Dados e Segurança

| Componente | Descrição | Função |
|------------|-----------|--------|
| **Banco de Dados (Supabase)** | Armazenamento encriptado e seguro de dados de utilizadores | PostgreSQL + RLS (Row Level Security) |
| **Autenticação Social** | Login unificado via Google para simplicidade e segurança | Google OAuth 2.0 |
| **Proteção de Rotas Privadas** | Validação de sessão e redirecionamento automático de utilizadores não autorizados | Middleware + Context API |

### 4.3 Experiência do Utilizador

| Funcionalidade | Descrição | Benefício |
|-----------------|-----------|-----------|
| **Botão Social Flutuante** | Link direto ao Facebook integrado em todas as páginas públicas (mobile e desktop) | Aumento de engagement e followers |
| **Sistema de Notificações em Tempo Real** | Alertas automáticos para utilizadores e administradores sobre novas inscrições, updates de cursos e comunicações | Comunicação efetiva e imediata |
| **Responsividade Total** | Interface otimizada para computadores, tablets e telemóveis | Experiência consistente em todos os dispositivos |
| **SEO Integrado** | Otimização técnica estrutural para melhorar o posicionamento orgânico nos motores de busca | Melhor visibilidade no Google |

### 4.4 Painel Administrativo Avançado

O Admin Dashboard permite:
- ✅ Visualizar e gerenciar utilizadores registados
- ✅ Acompanhar inscrições e enrollments em tempo real
- ✅ Monitorizar dados de contacto e pré-inscrições
- ✅ Visualizar relatórios e estatísticas de desempenho
- ✅ Enviar notificações aos formandos
- ✅ Gerenciar conteúdo dinâmico via Hygraph

---

## 5. Acessos e Credenciais (Aviso de Segurança)

Para facilitar a gestão técnica por parte do departamento da Prime Academy, foi implementado o **Login Social unificado via Google**. Isto significa que todas as plataformas de infraestrutura estão associadas à mesma conta central.

### 5.1 Conta Google Principal (Base de Infraestrutura)

**E-mail:** `comercialprimeacademy@gmail.com`  
**Finalidade:** Acesso centralizado ao GitHub, Vercel, Supabase, Hygraph e EmailJS.

### 5.2 Canais de Acesso Direto

| Plataforma | URL | Função |
|------------|-----|--------|
| **CMS (Gestão de Cursos e Galeria)** | [hygraph.com](https://hygraph.com) | Atualização de conteúdo dinâmico |
| **Hospedagem e Monitorização** | [vercel.com](https://vercel.com) | Deploy contínuo e monitorização |
| **Base de Dados** | [supabase.com](https://supabase.com) | Gestão de dados e utilizadores |
| **Sistema de E-mail** | [emailjs.com](https://emailjs.com) | Monitorização de templates e envios |
| **Repositório de Código-Fonte** | [github.com](https://github.com) | Versionamento e salvaguarda |

### 5.3 Instruções de Acesso

1. **Aceder a hygraph.com** → Selecionar "Sign In with Google"
2. **Aceder a vercel.com** → Selecionar "Log In with Google"
3. **Aceder a supabase.com** → Efetuar o login associado à conta
4. **Aceder a emailjs.com** → Monitorizar templates de contacto e inscrições
5. **Aceder a github.com** → Visualizar e gerenciar código-fonte

---

## 6. Suporte Técnico e Manutenção

Após a entrega, o website encontra-se pronto para operação total. Recomenda-se:

- **Backups Regulares**: Supabase realiza backups automáticos diários
- **Monitorização de Desempenho**: Vercel fornece métricas em tempo real
- **Atualizações de Segurança**: Manter dependências atualizadas via GitHub
- **Suporte Contínuo**: RC Media disponível para consultoria e ajustes técnicos

---

## 7. Checklist de Entrega

- ✅ Website totalmente responsivo (desktop, tablet, mobile)
- ✅ Todas as páginas públicas funcionais
- ✅ Áreas restritas com autenticação segura
- ✅ Painel administrativo operacional
- ✅ CMS Hygraph integrado e configurado
- ✅ Supabase com dados de utilizadores
- ✅ EmailJS para envios automáticos
- ✅ Botão social (Facebook) integrado em todas as páginas públicas
- ✅ Sistema de notificações em tempo real
- ✅ SEO básico implementado
- ✅ Deploy em produção na Vercel
- ✅ Domínio primeacademy.ao apontado corretamente
- ✅ Documentação técnica completa

---

## 8. Termo de Aceitação

Declaro que o website e a plataforma de gestão da Prime Academy foram entregues em conformidade com o escopo técnico e estético acordado, encontrando-se em pleno funcionamento na internet e prontidão para operação comercial.

### Dados de Aceitação

| Campo | Valor |
|-------|-------|
| **Nome do Cliente** | ______________________________________ |
| **Cargo/Responsável** | ______________________________________ |
| **Assinatura** | ______________________________________ |
| **Data de Aceitação** | _____ / _____ / 2026 |

---

## 9. Informações de Contacto para Suporte

**RC MEDIA — MARKETING E RESULTADOS**

- 📧 Email: [comercialprimeacademy@gmail.com](mailto:comercialprimeacademy@gmail.com)
- 📱 Telefone: +244 921 394 946
- 🌐 Website: [primeacademy.ao](https://primeacademy.ao)

---

**Documento Preparado em:** 08/06/2026  
**Versão:** 1.0 (Final)  
**Status:** Pronto para Entrega Oficial
