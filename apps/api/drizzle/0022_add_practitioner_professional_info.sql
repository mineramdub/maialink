-- Migration: Ajout informations professionnelles pour les praticiens
-- Date: 2026-01-22

-- Ajouter numéro Assurance Maladie à la table users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "numero_am" text;

-- Ajouter informations professionnelles à practitioner_settings
ALTER TABLE "practitioner_settings" ADD COLUMN IF NOT EXISTS "specialite" text;
ALTER TABLE "practitioner_settings" ADD COLUMN IF NOT EXISTS "type_structure" text;
ALTER TABLE "practitioner_settings" ADD COLUMN IF NOT EXISTS "nom_structure" text;

-- Commentaires sur les colonnes
COMMENT ON COLUMN "users"."numero_am" IS 'Numéro Assurance Maladie du praticien';
COMMENT ON COLUMN "practitioner_settings"."specialite" IS 'Spécialité/activité du praticien (ex: Suivi de grossesse et post-partum)';
COMMENT ON COLUMN "practitioner_settings"."type_structure" IS 'Type de structure (ex: MAISON DE SANTE, CABINET LIBERAL)';
COMMENT ON COLUMN "practitioner_settings"."nom_structure" IS 'Nom de la structure (ex: Maison de Santé de...)';
