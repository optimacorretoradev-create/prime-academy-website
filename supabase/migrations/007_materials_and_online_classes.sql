-- 1. Tabela para Aulas Online / Presenciais
CREATE TABLE IF NOT EXISTS public.aulas_online (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('live', 'presencial')),
  meeting_url TEXT,
  room TEXT,
  address TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para aulas_online
ALTER TABLE public.aulas_online ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura publica de aulas" ON public.aulas_online;
CREATE POLICY "Permitir leitura publica de aulas" ON public.aulas_online
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Permitir tudo para admin em aulas" ON public.aulas_online;
CREATE POLICY "Permitir tudo para admin em aulas" ON public.aulas_online
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 2. Tabela para Materiais PDF
CREATE TABLE IF NOT EXISTS public.materiais_pdf (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  nome_arquivo TEXT NOT NULL,
  url_arquivo TEXT NOT NULL,
  curso_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para materiais_pdf
ALTER TABLE public.materiais_pdf ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura publica de materiais" ON public.materiais_pdf;
CREATE POLICY "Permitir leitura publica de materiais" ON public.materiais_pdf
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Permitir tudo para admin em materiais" ON public.materiais_pdf;
CREATE POLICY "Permitir tudo para admin em materiais" ON public.materiais_pdf
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 3. Configuração do Bucket de Storage do Supabase para materiais
INSERT INTO storage.buckets (id, name, public)
VALUES ('materiais', 'materiais', true)
ON CONFLICT (id) DO NOTHING;

-- RLS e Políticas para o bucket 'materiais'
DROP POLICY IF EXISTS "Permitir download publico de materiais" ON storage.objects;
CREATE POLICY "Permitir download publico de materiais" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'materiais');

DROP POLICY IF EXISTS "Permitir upload de materiais para admin" ON storage.objects;
CREATE POLICY "Permitir upload de materiais para admin" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'materiais');

DROP POLICY IF EXISTS "Permitir delete de materiais para admin" ON storage.objects;
CREATE POLICY "Permitir delete de materiais para admin" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'materiais');
