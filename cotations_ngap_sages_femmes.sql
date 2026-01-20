-- Cotations NGAP pour Sages-Femmes
-- Mise à jour 2026

-- Nettoyage table
TRUNCATE TABLE cotations_ngap;

-- ===================================
-- CONSULTATIONS ET VISITES
-- ===================================

-- Consultations au cabinet
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('CS', 'Consultation au cabinet ou à domicile', 1.00, 'CS', 25.00, 'Consultation', true),
('CSC', 'Consultation complexe (consultation initiale de contraception et de suivi gynécologique de prévention)', 1.00, 'CSC', 30.00, 'Consultation', true);

-- Visites à domicile
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('VD', 'Visite à domicile', 1.00, 'VD', 25.00, 'Visite', true),
('VL', 'Visite longue à domicile', 1.00, 'VL', 35.00, 'Visite', true);

-- Majorations de déplacement
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('IFD', 'Indemnité forfaitaire de déplacement', 1.00, 'IFD', 2.50, 'Deplacement', true),
('IK', 'Indemnité kilométrique', 0.30, 'IK', 0.30, 'Deplacement', true);

-- Majorations temporelles
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('MN', 'Majoration de nuit (20h-8h)', 1.00, 'MN', 35.00, 'Majoration', true),
('MD', 'Majoration dimanche et jours fériés', 1.00, 'MD', 25.00, 'Majoration', true),
('MNP', 'Majoration de nuit profonde (0h-6h)', 1.00, 'MNP', 40.00, 'Majoration', true);

-- ===================================
-- SURVEILLANCE GROSSESSE
-- ===================================

INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('SF', 'Surveillance clinique et psychologique de la femme enceinte à compter du 1er jour du 4e mois de grossesse', 1.00, 'SF', 28.50, 'Grossesse', true),
('SFI', 'Surveillance clinique et psychologique de la femme enceinte à compter du 1er jour du 4e mois de grossesse (jusqu''à 5 séances) - Entretien individuel ou en groupe', 1.00, 'SFI', 28.50, 'Grossesse', true),
('MAF', 'Majoration forfaitaire pour actes pratiqués par la sage-femme au cours du 8e mois de grossesse', 1.00, 'MAF', 15.00, 'Grossesse', true),
('DECI', 'Déclaration de grossesse et premier examen prénatal', 1.00, 'DECI', 46.00, 'Grossesse', true);

-- Préparation à la naissance
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('SFP', 'Séance de préparation à la naissance et à la parentalité (8 séances)', 1.00, 'SFP', 43.40, 'Grossesse', true),
('SEPR', 'Séance d''information en groupe sur l''allaitement maternel', 1.00, 'SEPR', 43.40, 'Grossesse', true);

-- ===================================
-- ACCOUCHEMENT
-- ===================================

INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('ACC', 'Surveillance du travail et accouchement eutocique', 1.00, 'ACC', 315.00, 'Accouchement', true),
('ACCS', 'Surveillance du travail et accouchement eutocique (à domicile)', 1.00, 'ACCS', 420.00, 'Accouchement', true);

-- Soins au nouveau-né
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('DEI', 'Premier examen clinique du nouveau-né', 1.00, 'DEI', 43.00, 'Nouveau-ne', true),
('SNN', 'Soins du nouveau-né en suites de couches', 1.00, 'SNN', 14.00, 'Nouveau-ne', true);

-- ===================================
-- POST-PARTUM
-- ===================================

-- Visites post-natales
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('SPPR', 'Séance de suivi postnatal (1 séance entre J8 et J15 post-accouchement)', 1.00, 'SPPR', 28.50, 'Post-partum', true),
('SEPO', 'Séance de suivi postnatal (1 séance entre J15 et 8 semaines)', 1.00, 'SEPO', 28.50, 'Post-partum', true);

-- Soins à domicile
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('SPO', 'Soins postnataux à domicile (visite unique)', 1.00, 'SPO', 32.00, 'Post-partum', true),
('SDAP', 'Séance de soins à domicile post-accouchement', 1.00, 'SDAP', 25.00, 'Post-partum', true);

-- ===================================
-- RÉÉDUCATION PÉRINÉALE
-- ===================================

INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('RPP', 'Séance de rééducation périnéo-sphinctérienne (10 séances maximum)', 1.00, 'RPP', 11.20, 'Reeducation', true),
('BPE', 'Bilan périnéal (1 séance)', 1.00, 'BPE', 26.60, 'Reeducation', true);

-- ===================================
-- GYNÉCOLOGIE
-- ===================================

-- Consultations gynécologiques
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('GYN', 'Consultation de contraception et gynécologie de prévention', 1.00, 'GYN', 28.50, 'Gynecologie', true),
('GYNI', 'Consultation initiale de contraception (consultation longue)', 1.00, 'GYNI', 46.00, 'Gynecologie', true);

-- Pose de dispositifs
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('DIU', 'Pose d''un dispositif intra-utérin', 1.00, 'DIU', 38.40, 'Gynecologie', true),
('RDI', 'Retrait d''un dispositif intra-utérin', 1.00, 'RDI', 14.26, 'Gynecologie', true),
('IMP', 'Pose d''implant contraceptif', 1.00, 'IMP', 38.40, 'Gynecologie', true),
('RIM', 'Retrait d''implant contraceptif', 1.00, 'RIM', 25.60, 'Gynecologie', true);

-- Prélèvements
INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('FCU', 'Frottis cervico-utérin', 1.00, 'FCU', 14.26, 'Gynecologie', true),
('PV', 'Prélèvement vaginal', 1.00, 'PV', 5.40, 'Gynecologie', true);

-- ===================================
-- ALLAITEMENT
-- ===================================

INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('SAL', 'Séance d''accompagnement à l''allaitement maternel', 1.00, 'SAL', 17.00, 'Allaitement', true),
('SAID', 'Séance d''accompagnement à l''allaitement maternel à domicile', 1.00, 'SAID', 21.00, 'Allaitement', true);

-- ===================================
-- IVG (Interruption Volontaire de Grossesse)
-- ===================================

INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('JKHD', 'IVG médicamenteuse (forfait)', 1.00, 'JKHD', 187.92, 'IVG', true),
('CSLG', 'Consultation pré-IVG', 1.00, 'CSLG', 46.00, 'IVG', true),
('IVG1', 'Consultation de contrôle post-IVG', 1.00, 'IVG1', 28.50, 'IVG', true);

-- ===================================
-- ÉCHOGRAPHIES (si habilitée)
-- ===================================

INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('YYYY150', 'Échographie obstétricale 1er trimestre', 1.00, 'YYYY', 81.92, 'Echographie', true),
('YYYY155', 'Échographie obstétricale 2e et 3e trimestres', 1.00, 'YYYY', 81.92, 'Echographie', true);

-- ===================================
-- MONITORING
-- ===================================

INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('MFE', 'Monitoring foetal (enregistrement du rythme cardiaque foetal)', 1.00, 'MFE', 14.70, 'Grossesse', true),
('MEPU', 'Mesure échographique de la longueur du col utérin', 1.00, 'MEPU', 27.00, 'Grossesse', true);

-- ===================================
-- ENTRETIEN PRÉNATAL PRÉCOCE
-- ===================================

INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('EPP', 'Entretien prénatal précoce (1 séance au 1er trimestre)', 1.00, 'EPP', 46.00, 'Grossesse', true);

-- ===================================
-- VACCINATIONS
-- ===================================

INSERT INTO cotations_ngap (code, libelle, coefficient, lettre_cle, tarif_base, categorie, actif) VALUES
('INJ', 'Injection', 1.00, 'INJ', 1.26, 'Vaccinations', true),
('VAC', 'Vaccination (hors vaccin)', 1.00, 'VAC', 6.30, 'Vaccinations', true);

-- Mise à jour du timestamp
UPDATE cotations_ngap SET updated_at = NOW();

-- Afficher le résultat
SELECT COUNT(*) as "Nombre de cotations insérées" FROM cotations_ngap;
