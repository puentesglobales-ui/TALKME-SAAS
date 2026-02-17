-- Migration: Add Profile Fields for Parameterized Learning
-- Adds age, goal, level, interests, urgency, and onboarding status.

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS goal text, -- enum: viajar, trabajo_remoto, migrar, estudio_examen
ADD COLUMN IF NOT EXISTS level text, -- enum: principiante, intermedio, avanzado
ADD COLUMN IF NOT EXISTS interests text[], -- array of strings
ADD COLUMN IF NOT EXISTS urgency text, -- enum: baja, media, alta
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Add comment to document the columns
COMMENT ON COLUMN public.profiles.goal IS 'Primary objective: viajar, trabajo_remoto, migrar, estudio_examen';
COMMENT ON COLUMN public.profiles.level IS 'Current proficiency: principiante, intermedio, avanzado';
