# ⚡ 3 Níveis de Velocidade de Atualização de Conteúdo

Escolha o nível que melhor se adequa ao seu uso:

---

## 🟢 NÍVEL 1: RÁPIDO (Padrão - 1 minuto)

**Como funciona**: O site recarrega dados do Hygraph automaticamente a cada 1 minuto.

**Tempo até ver conteúdo novo**: ~ 1 minuto

**Vantagem**: Melhor performance do site

**Desvantagem**: Tem que esperar até 1 minuto

**Quando usar**: Uso casual, quando não importa esperar alguns segundos

### Implementar
```typescript
// Já está configurado em lib/hygraph.ts
next: { revalidate: 60 } // 1 minuto
```

---

## 🟡 NÍVEL 2: MUITO RÁPIDO (< 1 segundo - Manual)

**Como funciona**: Você clica um botão/comando após adicionar conteúdo, e vê instantaneamente.

**Tempo até ver conteúdo novo**: < 1 segundo (se você disparar a revalidação)

**Vantagem**: Controle total, instantâneo quando você quer

**Desvantagem**: Tem que fazer manualmente cada vez

**Quando usar**: Quando está testando ou precisa de feedback rápido

### Implementar (Windows)
```bash
# Duplo clique em:
revalidate.bat

# Ou no PowerShell:
curl -X POST "http://localhost:3000/api/revalidate?paths=gallery,courses"
```

### Implementar (Mac/Linux)
```bash
# Ou no terminal:
bash revalidate.sh

# Ou diretamente:
curl -X POST "http://localhost:3000/api/revalidate?paths=gallery,courses"
```

### Implementar (Produção)
```bash
# No servidor Vercel:
curl -X POST "https://primeacademy.ao/api/revalidate?paths=gallery,courses&token=SEU_TOKEN"
```

---

## 🔴 NÍVEL 3: INSTANTÂNEO (< 1 segundo - Automático) ⭐ RECOMENDADO

**Como funciona**: Assim que você publica no Hygraph, o webhook notifica o site e atualiza **automaticamente**.

**Tempo até ver conteúdo novo**: < 1 segundo (automático!)

**Vantagem**: Verdadeiramente instantâneo, sem ação manual

**Desvantagem**: Requer setup inicial (5 minutos)

**Quando usar**: Uso profissional, ambientes de produção, streaming de conteúdo em tempo real

### Implementar

Veja: [HYGRAPH_CACHE_SETUP.md](./HYGRAPH_CACHE_SETUP.md) - Seção "Solução 2: Configurar Webhooks"

---

## 📊 Comparação Rápida

```
┌─────────────────┬──────────────┬───────────┬───────────┐
│ Nível           │ Velocidade   │ Setup     │ Automático│
├─────────────────┼──────────────┼───────────┼───────────┤
│ Nível 1 (Padrão)│ 1 minuto     │ ✅ Pronto │ ✅ Sim    │
│ Nível 2 (Manual)│ < 1 segundo  │ ✅ Pronto │ ❌ Não    │
│ Nível 3 (Ideal) │ < 1 segundo  │ 5 min     │ ✅ Sim    │
└─────────────────┴──────────────┴───────────┴───────────┘
```

---

## 🎯 Minha Recomendação

### Para Desenvolvimento:
Use **NÍVEL 2** (Manual) - Execute `revalidate.bat` quando testar novo conteúdo

### Para Produção:
Use **NÍVEL 3** (Webhooks) - Configure uma vez e esqueça, tudo é automático

### Se Não Quiser Fazer Nada:
Use **NÍVEL 1** (Padrão) - Já está ativo, apenas espere 1 minuto

---

## 🚀 Próximos Passos Imediatos

1. **Agora**: Cache está em 1 minuto (NÍVEL 1 ✅)
2. **Teste**: Adicione um curso/imagem no Hygraph e aguarde 1 minuto
3. **Mais rápido?**: Execute `revalidate.bat` (NÍVEL 2)
4. **Automático?**: Configure webhooks no Hygraph (NÍVEL 3 - veja HYGRAPH_CACHE_SETUP.md)

---

## 🔗 Arquivos Relacionados

- [HYGRAPH_CACHE_SETUP.md](./HYGRAPH_CACHE_SETUP.md) - Guia completo de configuração
- [revalidate.bat](./revalidate.bat) - Script para Windows (NÍVEL 2)
- [revalidate.sh](./revalidate.sh) - Script para Mac/Linux (NÍVEL 2)
- [app/api/revalidate/route.ts](./app/api/revalidate/route.ts) - Código do endpoint

---

**Qual nível você vai usar? Configure agora! 🚀**
