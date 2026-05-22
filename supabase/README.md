# Supabase — Prime Academy (migração v2)

## Executar

1. SQL Editor → New query
2. Colar **todo** `migrations/001_enrollments_notifications.sql`
3. Run

## O que mudou na v2

- **`perfis`**: PK continua `id` (não renomeamos nada).
- **`matriculas`**: **não** é recriada; só `ALTER TABLE` adiciona:
  - `perfil_id` → `REFERENCES perfis(id)`
  - `inscricao_id` → `REFERENCES inscricoes(id)`
  - `curso_nome`, `curso_id_catalogo` (ID Hygraph, separado de `curso_id` UUID se já existir)
- Se existir `aluno_id`, os dados são copiados para `perfil_id`.

## Variáveis na app (`.env.local`)

```env
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

Necessária para **notificações fiáveis** (admin → utilizador) e **remover utilizadores**.

Obtenha em: Supabase → Settings → API → `service_role` (secret).

## Promover admin

```sql
UPDATE public.perfis SET cargo = 'instrutor' WHERE email = 'seu@email.com';
-- ou
UPDATE public.perfis SET cargo = 'admin' WHERE email = 'seu@email.com';
```

## Notificações (opcional SQL)

Se não usar service role, execute também `migrations/002_notificacoes_admin_rpc.sql`.

## Ver colunas de matriculas

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'matriculas'
ORDER BY ordinal_position;
```
