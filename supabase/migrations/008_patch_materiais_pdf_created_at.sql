-- Patch: Add created_at column to materiais_pdf if it was created without it
-- Safe to run multiple times (IF NOT EXISTS guard via DO block)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'materiais_pdf'
      AND column_name  = 'created_at'
  ) THEN
    ALTER TABLE public.materiais_pdf
      ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;
