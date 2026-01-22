/**
 * Implémentation mock pour tester sans matériel réel
 * Génère des données de test réalistes
 */

import { BillingService } from './BillingService'
import type {
  PatientVitaleData,
  ProfessionalCPSData,
  FSEData,
  BillingResult,
  CardReaderStatus
} from './types'

export class MockBillingService extends BillingService {
  private isInitialized = false
  private vitaleCardInserted = false
  private cpsCardInserted = false

  async initialize(): Promise<void> {
    console.log('[MockBillingService] Initialisation...')
    await this.delay(500)
    this.isInitialized = true
    console.log('[MockBillingService] Initialisé')
  }

  async getCardReaderStatus(): Promise<CardReaderStatus> {
    return {
      connected: this.isInitialized,
      model: 'Ingenico iCT220 (Simulé)',
      vitaleCardPresent: this.vitaleCardInserted,
      cpsCardPresent: this.cpsCardInserted
    }
  }

  async readVitaleCard(): Promise<PatientVitaleData> {
    console.log('[MockBillingService] Lecture carte Vitale...')
    await this.delay(1500)

    this.vitaleCardInserted = true

    // Données de test réalistes
    return {
      nir: '1' + Math.floor(Math.random() * 10) +
           ('0' + Math.floor(Math.random() * 12 + 1)).slice(-2) +
           Math.floor(Math.random() * 99 + 1).toString().padStart(2, '0') +
           Math.floor(Math.random() * 99 + 1).toString().padStart(2, '0') +
           Math.floor(Math.random() * 999).toString().padStart(3, '0') +
           Math.floor(Math.random() * 999).toString().padStart(3, '0'),
      nirKey: Math.floor(Math.random() * 99).toString().padStart(2, '0'),
      firstName: 'Sophie',
      lastName: 'Martin',
      birthDate: '1990-05-15',
      gender: 'F',
      regimeCode: '01', // Régime général
      caisse: '750',
      centre: '001',
      amo: true,
      amc: true,
      exonerationTicketModerateur: false,
      mutuelleCode: 'MUT001',
      mutuelleNom: 'Mutuelle Générale',
      mutuelleNumeroAdherent: 'M' + Math.floor(Math.random() * 1000000),
      medecinTraitant: {
        nom: 'Dupont',
        prenom: 'Jean',
        numeroAM: '1' + Math.floor(Math.random() * 100000000)
      }
    }
  }

  async readCPSCard(): Promise<ProfessionalCPSData> {
    console.log('[MockBillingService] Lecture carte CPS...')
    await this.delay(1500)

    this.cpsCardInserted = true

    return {
      numeroAM: '10009876543', // RPPS
      civilite: 'Mme',
      nom: 'Durand',
      prenom: 'Marie',
      profession: 'Sage-femme',
      specialite: 'Sage-femme libérale',
      numeroFINESS: '750000001',
      numeroSIRET: '12345678900012',
      cardNumber: 'CPS' + Math.floor(Math.random() * 10000000),
      expirationDate: '2026-12-31'
    }
  }

  async sendFSE(fseData: FSEData): Promise<BillingResult> {
    console.log('[MockBillingService] Envoi FSE...', fseData)
    await this.delay(2000)

    // Simulation d'un envoi réussi
    const montantRembourse = fseData.montantTotal * 0.7 // 70% remboursé
    const montantPatient = fseData.montantTotal - montantRembourse

    return {
      success: true,
      fseNumber: 'FSE' + Date.now(),
      transmissionId: 'TX' + Math.floor(Math.random() * 1000000),
      details: {
        montantRembourse: Math.round(montantRembourse * 100) / 100,
        montantPatient: Math.round(montantPatient * 100) / 100,
        dateRemboursement: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    }
  }

  async checkPatientRights(nir: string): Promise<{
    amo: boolean
    amc: boolean
    exoneration: boolean
    dateValidite: string
  }> {
    console.log('[MockBillingService] Vérification droits patient:', nir)
    await this.delay(1000)

    return {
      amo: true,
      amc: Math.random() > 0.3, // 70% ont une mutuelle
      exoneration: Math.random() > 0.9, // 10% en exonération
      dateValidite: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }

  async disconnect(): Promise<void> {
    console.log('[MockBillingService] Déconnexion...')
    await this.delay(300)
    this.isInitialized = false
    this.vitaleCardInserted = false
    this.cpsCardInserted = false
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
