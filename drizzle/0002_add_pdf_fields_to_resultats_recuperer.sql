-- Add PDF fields to resultats_a_recuperer table
ALTER TABLE resultats_a_recuperer
ADD COLUMN IF NOT EXISTS fichier_url TEXT,
ADD COLUMN IF NOT EXISTS fichier_nom TEXT;
