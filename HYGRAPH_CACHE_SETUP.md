# 🔄 Guia de Configuração: Revalidação de Cache Hygraph

## Problema Identificado
Quando você adiciona conteúdo no Hygraph (galeria ou cursos), o site não mostra o novo conteúdo imediatamente. O cache estava configurado para **1 hora**, agora está em **1 minuto**, mas para atualizações **verdadeiramente instantâneas** (< 1 segundo) é necessário usar webhooks.

---

## ✅ Solução 1: Revalidação Manual (Imediata)

### Para Desenvolvimento Local
```bash
# Revalidar galeria e cursos
curl -X POST "http://localhost:3000/api/revalidate?paths=gallery,courses"

# Revalidar tudo
curl -X POST "http://localhost:3000/api/revalidate?paths=gallery,courses,dashboard"
```

### Para Produção (primeacademy.ao)
```bash
# Defina a variável de ambiente REVALIDATION_SECRET_TOKEN no Vercel
curl -X POST "https://primeacademy.ao/api/revalidate?paths=gallery,courses&token=SEU_TOKEN_SECRETO"
```

---

## ✅ Solução 2: Configurar Webhooks no Hygraph (RECOMENDADO)

Webhooks permitem que o Hygraph **notifique automaticamente** o site quando conteúdo é publicado, acionando revalidação imediata.

### Passo 1: Adicionar Variável de Ambiente no Vercel

1. Aceda a [vercel.com](https://vercel.com)
2. Selecione o projeto **prime-academy-website**
3. Vá para **Settings → Environment Variables**
4. Adicione:
   - **Nome**: `REVALIDATION_SECRET_TOKEN`
   - **Valor**: Escolha um token seguro (ex: `abc123xyz789securetoken`)
   - **Ambientes**: Production, Preview, Development

### Passo 2: Configurar Webhook no Hygraph

1. Aceda a [hygraph.com](https://hygraph.com)
2. Selecione o projeto **Prime Academy**
3. Vá para **Settings → Webhooks**
4. Clique em **+ Create Webhook**
5. Configure:
   - **Name**: `Prime Academy Website Revalidate`
   - **URL**: `https://primeacademy.ao/api/revalidate?paths=gallery,courses&token=ABC123XYZ789SECURETOKEN`
     - *(Substitua `ABC123XYZ789SECURETOKEN` pelo seu token)*
   - **Events to trigger**: Selecione:
     - ✓ **galleryImage.publish**
     - ✓ **galleryImage.unpublish**
     - ✓ **curso.publish**
     - ✓ **curso.unpublish**
     - ✓ **curso.update**
   - **Request Method**: `POST`
   - **Custom Headers**: (Deixar em branco)

6. Clique em **Save**
7. Teste o webhook clicando em **Send test event**

### Passo 3: Testar

1. Publique um novo curso ou imagem no Hygraph
2. Dentro de **2-3 segundos**, visite o site e verá o novo conteúdo
3. Se não aparecer, verifique os logs do webhook em Hygraph

---

## 📊 Comparação de Métodos

| Método | Tempo | Setup | Automático |
|--------|-------|-------|-----------|
| **Cache Automático** | 1 minuto | 0 | ✅ |
| **API Revalidate** | < 1 segundo | Manual | ❌ |
| **Webhooks** (✨ MELHOR) | < 1 segundo | 5 min | ✅ |

---

## 🔧 Configuração Técnica Atual

**Arquivo**: `lib/hygraph.ts`

```typescript
// Antes (1 hora de cache):
next: { revalidate: 3600 }

// Agora (1 minuto de cache):
next: { revalidate: 60 }

// Para instantâneo absoluto (sem cache):
next: { revalidate: 0 }
```

**API Endpoint**: `POST /api/revalidate`
- Revalida páginas especificadas instantaneamente
- Requer token em produção
- Retorna status de cada revalidação

---

## 🚨 Troubleshooting

### Problema: "Conteúdo ainda não aparece após revalidação"
**Solução:**
- Limpe o cache do browser: `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
- Visite em modo incógnito
- Verifique se a página usa `next: { revalidate }` com valor baixo
- Use `/api/revalidate` para força imediata

### Problema: "Webhook retorna erro 401"
**Solução:**
- Verifique se o token no webhook matches a variável `REVALIDATION_SECRET_TOKEN` no Vercel
- Verifique se o URL está correto

### Problema: "Imagens não carregam mesmo após revalidação"
**Solução:**
- Verifique se as URLs das imagens estão corretas no Hygraph
- Confirme que as imagens estão publicadas (status = PUBLISHED)

---

## 📝 Próximos Passos

1. **Imediato**: Novo cache de 1 minuto já está ativo - conteúdo será visto muito mais rápido
2. **Para instantâneo**: Use `/api/revalidate` após adicionar conteúdo (< 1 segundo)
3. **Ideal**: Configure webhooks para automação completa (veja acima)
4. **Verificação**: Teste em `primeacademy.ao/gallery` e `primeacademy.ao/courses`

---

**Documentação oficial:**
- [Hygraph Webhooks](https://hygraph.com/docs/webhooks)
- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
