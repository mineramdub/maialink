/**
 * Service abstrait pour la facturation avec carte Vitale/CPS
 * Permet de changer facilement de fournisseur d'API
 */

import type {
  PatientVitaleData,
  ProfessionalCPSData,
  FSEData,
  BillingResult,
  CardReaderStatus
} from './types'

export abstract class BillingService {
  /**
   * Initialise la connexion avec le lecteur de cartes
   */
  abstract initialize(): Promise<void>

  /**
   * Vérifie le statut du lecteur de cartes
   */
  abstract getCardReaderStatus(): Promise<CardReaderStatus>

  /**
   * Lit la carte Vitale du patient
   */
  abstract readVitaleCard(): Promise<PatientVitaleData>

  /**
   * Lit la carte CPS du professionnel
   */
  abstract readCPSCard(): Promise<ProfessionalCPSData>

  /**
   * Crée et envoie une FSE (Feuille de Soins Électronique)
   * @param fseData Données de la feuille de soins
   * @returns Résultat de la télétransmission
   */
  abstract sendFSE(fseData: FSEData): Promise<BillingResult>

  /**
   * Vérifie les droits du patient
   * @param nir Numéro de sécurité sociale
   * @returns État des droits en temps réel
   */
  abstract checkPatientRights(nir: string): Promise<{
    amo: boolean
    amc: boolean
    exoneration: boolean
    dateValidite: string
  }>

  /**
   * Ferme la connexion
   */
  abstract disconnect(): Promise<void>
}
