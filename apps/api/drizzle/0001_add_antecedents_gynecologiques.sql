-- Migration: Ajout des antécédents gynécologiques détaillés
-- Date: 2025-12-31

ALTER TABLE "patients" ADD COLUMN "antecedents_gynecologiques" jsonb;

-- Commentaire sur la colonne
COMMENT ON COLUMN "patients"."antecedents_gynecologiques" IS 'Antécédents gynécologiques détaillés : ménarches, cycle, dysménorrhées, dyspareunies, contraception, frottis, etc.';
