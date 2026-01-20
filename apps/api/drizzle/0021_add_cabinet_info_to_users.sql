-- Migration: Ajout informations cabinet pour les praticiens
-- Date: 2026-01-20

-- Ajouter champs adresse cabinet
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cabinet_address" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cabinet_postal_code" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cabinet_city" text;

-- Commentaires sur les colonnes
COMMENT ON COLUMN "users"."cabinet_address" IS 'Adresse du cabinet du praticien';
COMMENT ON COLUMN "users"."cabinet_postal_code" IS 'Code postal du cabinet';
COMMENT ON COLUMN "users"."cabinet_city" IS 'Ville du cabinet';
