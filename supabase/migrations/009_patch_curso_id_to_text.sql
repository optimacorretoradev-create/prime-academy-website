-- Patch: Convert curso_id columns from UUID to TEXT in both tables
-- Required because Hygraph CMS IDs are alphanumeric strings (e.g. "cmppmtf3mvv0407l6wiplz3sg"),
-- not valid UUIDs. This is safe to run on empty or populated tables.

-- 1. materiais_pdf.curso_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'materiais_pdf'
      AND column_name  = 'curso_id'
      AND data_type    = 'uuid'
  ) THEN
    ALTER TABLE public.materiais_pdf
      ALTER COLUMN curso_id TYPE TEXT USING curso_id::TEXT;
  END IF;
END $$;

-- 2. aulas_online.course_id (column is named course_id in this table)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'aulas_online'
      AND column_name  = 'course_id'
      AND data_type    = 'uuid'
  ) THEN
    ALTER TABLE public.aulas_online
      ALTER COLUMN course_id TYPE TEXT USING course_id::TEXT;
  END IF;
END $$;

-- Safety net: also patch curso_id if it exists under that name in aulas_online
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'aulas_online'
      AND column_name  = 'curso_id'
      AND data_type    = 'uuid'
  ) THEN
    ALTER TABLE public.aulas_online
      ALTER COLUMN curso_id TYPE TEXT USING curso_id::TEXT;
  END IF;
END $$;
