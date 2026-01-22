/**
 * Service de facturation - Point d'entrée
 * Permet de changer facilement de fournisseur
 */

import { BillingService } from './BillingService'
import { MockBillingService } from './MockBillingService'
// Import des implémentations réelles quand disponibles :
// import { InzeeBillingService } from './InzeeBillingService'
// import { JeromeBillingService } from './JeromeBillingService'

export * from './types'
export { BillingService } from './BillingService'

/**
 * Configuration du service de facturation à utiliser
 * Changer ici pour basculer entre mock et production
 */
const BILLING_SERVICE_TYPE: 'mock' | 'inzee' | 'jerome' = 'mock'

/**
 * Factory pour créer l'instance du service de facturation
 */
export function createBillingService(): BillingService {
  switch (BILLING_SERVICE_TYPE) {
    case 'mock':
      return new MockBillingService()

    // Décommenter quand les services réels seront implémentés:
    // case 'inzee':
    //   return new InzeeBillingService({
    //     apiKey: import.meta.env.VITE_INZEE_API_KEY,
    //     apiSecret: import.meta.env.VITE_INZEE_API_SECRET
    //   })

    // case 'jerome':
    //   return new JeromeBillingService({
    //     clientId: import.meta.env.VITE_JEROME_CLIENT_ID,
    //     clientSecret: import.meta.env.VITE_JEROME_CLIENT_SECRET
    //   })

    default:
      return new MockBillingService()
  }
}

// Instance singleton
let billingServiceInstance: BillingService | null = null

/**
 * Obtient l'instance du service de facturation (singleton)
 */
export function getBillingService(): BillingService {
  if (!billingServiceInstance) {
    billingServiceInstance = createBillingService()
  }
  return billingServiceInstance
}

/**
 * Réinitialise l'instance (utile pour les tests)
 */
export function resetBillingService(): void {
  billingServiceInstance = null
}
