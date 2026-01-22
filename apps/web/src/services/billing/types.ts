/**
 * Types pour l'intégration de facturation avec carte Vitale/CPS
 * Compatible avec différents fournisseurs (Inzee, Jérôme, etc.)
 */

export interface PatientVitaleData {
  // Identité
  nir: string // Numéro de sécurité sociale
  nirKey: string // Clé du NIR
  firstName: string
  lastName: string
  birthDate: string
  gender: 'M' | 'F'

  // Assurance
  regimeCode: string // Code régime (01 = régime général, etc.)
  caisse: string // Code caisse
  centre: string // Code centre

  // Droits
  amo: boolean // Assurance maladie obligatoire
  amc: boolean // Assurance maladie complémentaire
  exonerationTicketModerateur: boolean

  // Mutuelle (si AMC)
  mutuelleCode?: string
  mutuelleNom?: string
  mutuelleNumeroAdherent?: string

  // Autres
  medecinTraitant?: {
    nom: string
    prenom: string
    numeroAM: string
  }
}

export interface ProfessionalCPSData {
  // Identité professionnelle
  numeroAM: string // Numéro RPPS ou ADELI
  civilite: string
  nom: string
  prenom: string
  profession: string
  specialite?: string

  // Exercice
  numeroFINESS?: string
  numeroSIRET?: string

  // Carte
  cardNumber: string
  expirationDate: string
}

export interface FSEData {
  // Feuille de Soins Électronique
  patient: PatientVitaleData
  professional: ProfessionalCPSData
  date: string

  // Actes
  actes: Array<{
    code: string // Code NGAP/CCAM
    libelle: string
    montant: number
    quantite: number
    coefficient?: number
    date?: string
  }>

  // Montants
  montantTotal: number
  partAMO: number
  partAMC: number
  partPatient: number

  // Parcours de soins
  parcoursCoordonne: boolean
  horsParcoursCoordonne: boolean
  accidentTravail: boolean

  // Prescription
  prescripteur?: {
    nom: string
    prenom: string
    numeroAM: string
  }
}

export interface BillingResult {
  success: boolean
  fseNumber?: string // Numéro FSE
  transmissionId?: string // ID de transmission CPAM
  error?: string
  details?: {
    montantRembourse: number
    montantPatient: number
    dateRemboursement?: string
  }
}

export interface CardReaderStatus {
  connected: boolean
  model?: string
  vitaleCardPresent: boolean
  cpsCardPresent: boolean
  error?: string
}
