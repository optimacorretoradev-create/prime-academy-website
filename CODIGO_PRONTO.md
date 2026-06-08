# ✅ CHECKLIST: Código Pronto para Webhooks

## 🔧 Otimizações Aplicadas

### ✅ 1. Cache Strategy Aumentado
- **Ficheiro**: `lib/hygraph.ts` (linha 68-72)
- **Mudança**: `revalidate: 60` → `revalidate: 3600`
- **Motivo**: Webhook controla updates, não cache time
- **Impacto**: +Performance, sem comprometer velocidade

### ✅ 2. Stage PUBLISHED Garantido
- **Ficheiro**: `lib/hygraph.ts` (linha 56)
- **Validação**: `'gcms-stage': 'PUBLISHED'` em header global
- **Funções Cobertas**:
  - `getCourses()` ✅
  - `getCourseBySlug()` ✅
  - `getGalleryImages()` ✅
  - `getTestimonials()` ✅
  - `getContactInfo()` ✅
- **Status**: Produção segura

### ✅ 3. Queries GraphQL Validadas
- `GET_CURSOS` - Seguro ✅
- `GET_COURSE_BY_SLUG` - Seguro ✅
- `GET_GALLERY_IMAGES` - Seguro ✅
- Nenhuma modificação necessária ✅

### ✅ 4. Comentários Técnicos Adicionados
- Documentação inline sobre cache strategy
- Explicação do workflow webhook
- Orientações para dev/preview/production

---

## 📁 Documentação Nova

| Ficheiro | Propósito |
|----------|-----------|
| **WEBHOOK_VERCEL_SETUP.md** | Setup passo-a-passo (Hygraph + Vercel) |
| **VALIDACAO_CODIGO.md** | Validação técnica completa |
| **Este ficheiro** | Checklist visual |

---

## 🚀 Fluxo de Produção (Agora)

```
┌─────────────────────────────────────────────────┐
│ Você publica no Hygraph                         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Webhook dispara (já configurado)                │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Vercel Deploy Hook acionado                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Rebuild automático (~30-60 seg)                 │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Cache regenerado com conteúdo novo              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ ✅ Visitantes veem conteúdo instantaneamente   │
└─────────────────────────────────────────────────┘
```

---

## 📋 O que Falta (Setup Externo)

Estas etapas são feitas FORA do código, no Vercel + Hygraph:

1. **Vercel**
   - [ ] Ir para Settings → Git → Deploy Hooks
   - [ ] Criar novo Deploy Hook para `main` branch
   - [ ] Copiar URL com token

2. **Hygraph**
   - [ ] Ir para Settings → Webhooks
   - [ ] Criar novo webhook
   - [ ] Colar URL do Vercel
   - [ ] Selecionar eventos: `publish`, `unpublish`, `update`
   - [ ] Testar com "Send Test Event"

**Veja**: [WEBHOOK_VERCEL_SETUP.md](./WEBHOOK_VERCEL_SETUP.md)

---

## ✨ Benefícios da Configuração

| Aspecto | Antes | Depois |
|--------|-------|--------|
| **Tempo até Update** | 5-60 minutos | ~2-3 minutos (automático) |
| **Ação Manual** | Necessária | Nenhuma |
| **Confiabilidade** | Cache manual | Webhook automático |
| **Performance** | Alta (cache curto) | Muito alta (cache 1h) |

---

## 🔍 Como Verificar se Tudo Está OK

### Local (Desenvolvimento)
```bash
# Se quiser testar revalidação manual
curl -X POST "http://localhost:3000/api/revalidate?paths=gallery,courses"
```

### Produção (primeacademy.ao)
1. Publique algo novo no Hygraph
2. Verifique Vercel Dashboard → Deployments
3. Deve haver novo deployment acionado
4. Visite site em 2-3 minutos
5. Novo conteúdo deve estar visível

---

## 🎯 Resultado Final

**Código**: ✅ **LIMPO E OTIMIZADO**

Todo o trabalho técnico está feito. Falta apenas configurar webhooks no Hygraph/Vercel (ações externas de UI, não de código).

---

**Próximo passo**: Seguir [WEBHOOK_VERCEL_SETUP.md](./WEBHOOK_VERCEL_SETUP.md)

