# 🚀 Guia Completo: Hygraph Webhooks + Vercel Deploy Hooks

## ✅ Status de Implementação

**Código**: Otimizado para webhooks ✓
- Cache aumentado para 1 hora (`revalidate: 3600`)
- Todas as queries usam `gcms-stage: PUBLISHED`
- Infraestrutura pronta para production

---

## 📋 O que vai Acontecer

```
1. Você publica conteúdo no Hygraph
   ↓
2. Webhook do Hygraph dispara → Vercel Deploy Hook
   ↓
3. Vercel reconstrói o projeto automaticamente
   ↓
4. Novo cache gerado com conteúdo fresco
   ↓
5. Visitantes veem conteúdo instantaneamente
```

**Resultado**: Updates verdadeiramente instantâneos sem ação manual!

---

## 🔧 PASSO 1: Obter Deploy Hook da Vercel

### 1.1 Aceda ao Dashboard Vercel
- URL: https://vercel.com/dashboard
- Selecione projeto: **prime-academy-website**

### 1.2 Vá para Settings
- Clique em **Settings**
- Selecione **Git** no menu esquerdo
- Procure por **Deploy Hooks** (ou **Webhooks**)

### 1.3 Crie um Novo Deploy Hook
- Clique em **+ Add Deploy Hook**
- **Nome**: `Hygraph Content Update`
- **Branch**: `main` (ou a branch de produção)
- **Clique Create Deploy Hook**

### 1.4 Copie a URL
Vercel vai gerar algo como:
```
https://api.vercel.com/v1/integrations/deploy/PROJETO_ID/WEBHOOK_TOKEN
```

**⚠️ IMPORTANTE**: Guarde esta URL com segurança! Qualquer pessoa com ela pode forçar redeploys.

---

## 🔗 PASSO 2: Configurar Webhook no Hygraph

### 2.1 Aceda ao Hygraph
- URL: https://hygraph.com
- Selecione projeto: **Prime Academy**

### 2.2 Vá para Webhooks
- **Settings** → **Webhooks**

### 2.3 Crie um Novo Webhook
- Clique em **+ New Webhook** ou **+ Create Webhook**

### 2.4 Configure os Detalhes

**Nome:**
```
Vercel Production Rebuild
```

**URL:**
```
https://api.vercel.com/v1/integrations/deploy/PROJETO_ID/WEBHOOK_TOKEN
```
*(Cole a URL que copiou do Vercel)*

**Eventos a Disparar:**
Marque todos os seguintes:
- ✅ **galleryImage.publish**
- ✅ **galleryImage.unpublish**
- ✅ **galleryImage.update**
- ✅ **curso.publish**
- ✅ **curso.unpublish**
- ✅ **curso.update**

**Método HTTP:**
```
POST
```

### 2.5 Headers Customizados (Opcional)
Deixar em branco (não necessário)

### 2.6 Salve o Webhook
- Clique em **Save** ou **Create**

### 2.7 Teste o Webhook (Importante!)
- Verá um botão **"Send Test Event"** ou similar
- Clique para enviar um evento de teste
- Verifique na Vercel se reconheceu (deve aparecer um novo deployment)

---

## ✨ Resultado da Configuração

Após configurar corretamente:

| Ação | Resultado | Tempo |
|------|-----------|-------|
| Publica novo curso | Vercel reconstrói | ~30-60 segundos |
| Edita descrição | Vercel reconstrói | ~30-60 segundos |
| Adiciona imagem galeria | Vercel reconstrói | ~30-60 segundos |
| Muda status para draft | Vercel reconstrói | ~30-60 segundos |

**Site sempre tem conteúdo fresco, sem ação manual!**

---

## 🧪 Como Testar a Configuração

### Teste 1: Publicar Novo Curso
1. Vá a Hygraph → Cursos → Novo Curso
2. Preencha detalhes básicos
3. Clique em **PUBLISH**
4. Observe a Vercel (deve mostrar novo deployment)
5. Visite `primeacademy.ao/courses` → novo curso deve aparecer

### Teste 2: Atualizar Galeria
1. Vá a Hygraph → Galeria → Nova Imagem
2. Upload de imagem
3. Adicione título/categoria
4. Clique em **PUBLISH**
5. Observe a Vercel (deployment automático)
6. Visite `primeacademy.ao/gallery` → nova imagem deve aparecer

### Teste 3: Monitorizar Deployments
1. Vercel Dashboard → Deployments
2. Deve ver novos deployments acionados pelos webhooks
3. Tempo total: ~2-3 minutos do publish até live

---

## 🛡️ Segurança

### ✅ Deploy Hook URL
- É privada (contém token)
- NÃO partilhar publicamente
- Se comprometida, regenerar em Vercel Settings

### ✅ Staging vs Production
- Webhooks só disparam em PUBLISHED
- Draft content NÃO dispara webhooks
- Seguro para editar conteúdo em privado

---

## 🚨 Troubleshooting

### Problema: "Webhook não dispara"
**Solução:**
1. Verifique a URL do Vercel está correta (com token)
2. Teste com **Send Test Event** no Hygraph
3. Verifique Vercel Deployments para erros
4. Confirme que conteúdo foi PUBLICADO (não draft)

### Problema: "Deployment falha"
**Solução:**
1. Verifique Vercel Build Logs
2. Pode haver erro no código ou variáveis de ambiente
3. Contacte RC Media se persistir

### Problema: "Conteúdo demora muito a aparecer"
**Solução:**
1. Rebuild tipicamente leva 1-3 minutos
2. Se > 5 minutos, verifique Vercel Deployments
3. Cache do browser pode estar antigo (Ctrl+Shift+Delete)

---

## 📊 Comparação: Antes vs Depois

### ❌ Antes (Sem Webhooks)
- Revalidação a cada 5-60 minutos
- Conteúdo novo demora até 1 hora
- Precisa de ação manual com `/api/revalidate`

### ✅ Depois (Com Webhooks)
- Revalidação automática quando publica
- Conteúdo novo em ~2-3 minutos
- Completamente automático
- Sem ação manual necessária

---

## 📝 Código Atualizado

**Arquivo**: `lib/hygraph.ts`

```typescript
next: { 
  // Cache strategy with Vercel Deploy Hooks:
  // - Dev/Preview: 1 hora (webhook força rebuild se precisar)
  // - Production: Webhook reconstrói automaticamente
  revalidate: 3600 // 1 hour - webhook handles production updates
}
```

Todas as queries usam:
```typescript
'gcms-stage': 'PUBLISHED' // ✅ Apenas conteúdo publicado
```

---

## ✅ Checklist Final

- [ ] Deploy Hook criado em Vercel
- [ ] URL do Deploy Hook copiada
- [ ] Webhook criado em Hygraph
- [ ] URL do Deploy Hook inserida no webhook
- [ ] Eventos corretos selecionados (publish, unpublish, update)
- [ ] Teste com "Send Test Event" bem-sucedido
- [ ] Novo deployment apareceu em Vercel
- [ ] Conteúdo de teste aparece no site

---

## 🎯 Resultado Final

**"Clico em PUBLISH no Hygraph → Vercel reconstrói → Site atualizado instantaneamente"**

Sem caches manualmente, sem delays, sem complicações!

---

**Dúvidas?** Verifique os logs em Hygraph Webhooks e Vercel Deployments.

