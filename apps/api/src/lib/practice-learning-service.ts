/**
 * Service d'apprentissage de la pratique médicale
 *
 * Ce service analyse les actions du praticien de manière ANONYMISÉE
 * pour générer des suggestions personnalisées basées sur ses habitudes.
 *
 * RGPD/HDS Compliant:
 * - Toutes les données sont anonymisées (pas de nom, prénom, date de naissance)
 * - Seuls des profils génériques sont stockés
 * - Données limitées à l'utilisateur uniquement
 * - Aucun transfert vers des services tiers
 */

import { db } from './db'
import { practicePatterns, smartSuggestions, practiceLearningEvents, consultations } from './schema'
import { eq, and, desc, sql } from 'drizzle-orm'

export interface AnonymizedContext {
  consultationType?: string
  sa?: number
  motif?: string
  ageGroupe?: string  // "20-30", "30-40", "40+"
  parite?: number
  antecedents?: string[]
  trimestre?: number
}

export interface PrescriptionAction {
  medicament: string
  dosage?: string
  duree?: string
}

export interface ExamenAction {
  type: string
  libelle: string
}

export class PracticeLearningService {
  /**
   * Anonymiser un âge en tranche d'âge
   */
  static anonymizeAge(age: number): string {
    if (age < 20) return '< 20'
    if (age < 30) return '20-30'
    if (age < 40) return '30-40'
    return '40+'
  }

  /**
   * Créer un contexte anonymisé à partir d'une consultation
   */
  static anonymizeContext(consultation: {
    type?: string
    sa?: number
    motif?: string
    patient?: {
      dateNaissance?: string
      parite?: number
      antecedents?: string[]
    }
  }): AnonymizedContext {
    const context: AnonymizedContext = {
      consultationType: consultation.type,
      motif: consultation.motif,
    }

    if (consultation.sa) {
      context.sa = consultation.sa
      context.trimestre = Math.ceil(consultation.sa / 13)
    }

    if (consultation.patient) {
      if (consultation.patient.dateNaissance) {
        const age = new Date().getFullYear() - new Date(consultation.patient.dateNaissance).getFullYear()
        context.ageGroupe = this.anonymizeAge(age)
      }
      if (consultation.patient.parite !== undefined) {
        context.parite = consultation.patient.parite
      }
      if (consultation.patient.antecedents) {
        context.antecedents = consultation.patient.antecedents
      }
    }

    return context
  }

  /**
   * Capturer une action de prescription
   */
  static async capturePrescription(
    userId: string,
    context: AnonymizedContext,
    prescription: PrescriptionAction
  ): Promise<void> {
    // Vérifier si ce pattern existe déjà
    const existingPattern = await db.query.practicePatterns.findFirst({
      where: and(
        eq(practicePatterns.userId, userId),
        eq(practicePatterns.actionType, 'prescription'),
        sql`${practicePatterns.context} @> ${JSON.stringify(context)}::jsonb`,
        sql`${practicePatterns.actionData}->>'medicament' = ${prescription.medicament}`
      ),
    })

    if (existingPattern) {
      // Incrémenter la fréquence
      await db
        .update(practicePatterns)
        .set({
          frequency: sql`${practicePatterns.frequency} + 1`,
          lastUsed: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(practicePatterns.id, existingPattern.id))
    } else {
      // Créer un nouveau pattern
      await db.insert(practicePatterns).values({
        userId,
        actionType: 'prescription',
        context,
        actionData: { prescription },
        frequency: 1,
        lastUsed: new Date(),
      })
    }

    // Logger l'événement
    await db.insert(practiceLearningEvents).values({
      userId,
      eventType: 'pattern_detected',
      context: {
        consultationType: context.consultationType,
        sa: context.sa,
        actionType: 'prescription',
      },
      metadata: {
        prescription,
      },
    })
  }

  /**
   * Capturer une action d'examen
   */
  static async captureExamen(
    userId: string,
    context: AnonymizedContext,
    examen: ExamenAction
  ): Promise<void> {
    const existingPattern = await db.query.practicePatterns.findFirst({
      where: and(
        eq(practicePatterns.userId, userId),
        eq(practicePatterns.actionType, 'examen'),
        sql`${practicePatterns.context} @> ${JSON.stringify(context)}::jsonb`,
        sql`${practicePatterns.actionData}->'examen'->>'libelle' = ${examen.libelle}`
      ),
    })

    if (existingPattern) {
      await db
        .update(practicePatterns)
        .set({
          frequency: sql`${practicePatterns.frequency} + 1`,
          lastUsed: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(practicePatterns.id, existingPattern.id))
    } else {
      await db.insert(practicePatterns).values({
        userId,
        actionType: 'examen',
        context,
        actionData: { examen },
        frequency: 1,
        lastUsed: new Date(),
      })
    }

    await db.insert(practiceLearningEvents).values({
      userId,
      eventType: 'pattern_detected',
      context: {
        consultationType: context.consultationType,
        sa: context.sa,
        actionType: 'examen',
      },
      metadata: { examen },
    })
  }

  /**
   * Capturer un conseil récurrent
   */
  static async captureConseil(
    userId: string,
    context: AnonymizedContext,
    conseil: string
  ): Promise<void> {
    const existingPattern = await db.query.practicePatterns.findFirst({
      where: and(
        eq(practicePatterns.userId, userId),
        eq(practicePatterns.actionType, 'conseil'),
        sql`${practicePatterns.context} @> ${JSON.stringify(context)}::jsonb`,
        sql`${practicePatterns.actionData}->>'conseil' = ${conseil}`
      ),
    })

    if (existingPattern) {
      await db
        .update(practicePatterns)
        .set({
          frequency: sql`${practicePatterns.frequency} + 1`,
          lastUsed: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(practicePatterns.id, existingPattern.id))
    } else {
      await db.insert(practicePatterns).values({
        userId,
        actionType: 'conseil',
        context,
        actionData: { conseil },
        frequency: 1,
        lastUsed: new Date(),
      })
    }
  }

  /**
   * Obtenir les suggestions pour un contexte donné
   */
  static async getSuggestions(
    userId: string,
    context: AnonymizedContext
  ): Promise<Array<{
    id: string
    type: string
    data: any
    confidence: number
    explanation: string
  }>> {
    // Rechercher les patterns similaires avec haute fréquence
    const similarPatterns = await db.query.practicePatterns.findMany({
      where: and(
        eq(practicePatterns.userId, userId),
        sql`${practicePatterns.frequency} >= 3` // Au moins 3 occurrences
      ),
      orderBy: [desc(practicePatterns.frequency), desc(practicePatterns.lastUsed)],
      limit: 10,
    })

    const suggestions: Array<{
      id: string
      type: string
      data: any
      confidence: number
      explanation: string
    }> = []

    for (const pattern of similarPatterns) {
      // Calculer la similarité du contexte
      const similarity = this.calculateContextSimilarity(context, pattern.context as AnonymizedContext)

      if (similarity > 0.6) {
        // Seuil de similarité de 60%
        const confidence = Math.min(0.95, (pattern.frequency / 10) * similarity)

        let explanation = ''
        if (pattern.actionType === 'prescription') {
          const medicament = (pattern.actionData as any).prescription?.medicament
          explanation = `Vous prescrivez souvent ${medicament} dans ce contexte (${pattern.frequency} fois)`
        } else if (pattern.actionType === 'examen') {
          const libelle = (pattern.actionData as any).examen?.libelle
          explanation = `Vous prescrivez souvent ${libelle} dans ce contexte (${pattern.frequency} fois)`
        } else if (pattern.actionType === 'conseil') {
          explanation = `Conseil que vous donnez fréquemment (${pattern.frequency} fois)`
        }

        suggestions.push({
          id: pattern.id,
          type: pattern.actionType,
          data: pattern.actionData,
          confidence,
          explanation,
        })
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Calculer la similarité entre deux contextes
   */
  static calculateContextSimilarity(context1: AnonymizedContext, context2: AnonymizedContext): number {
    let score = 0
    let maxScore = 0

    // Type de consultation (poids: 3)
    maxScore += 3
    if (context1.consultationType === context2.consultationType) {
      score += 3
    }

    // SA (poids: 2)
    if (context1.sa !== undefined && context2.sa !== undefined) {
      maxScore += 2
      const saDiff = Math.abs(context1.sa - context2.sa)
      if (saDiff <= 2) {
        score += 2
      } else if (saDiff <= 4) {
        score += 1
      }
    }

    // Âge groupe (poids: 1)
    if (context1.ageGroupe && context2.ageGroupe) {
      maxScore += 1
      if (context1.ageGroupe === context2.ageGroupe) {
        score += 1
      }
    }

    // Parité (poids: 1)
    if (context1.parite !== undefined && context2.parite !== undefined) {
      maxScore += 1
      if (context1.parite === context2.parite) {
        score += 1
      }
    }

    // Trimestre (poids: 1)
    if (context1.trimestre && context2.trimestre) {
      maxScore += 1
      if (context1.trimestre === context2.trimestre) {
        score += 1
      }
    }

    return maxScore > 0 ? score / maxScore : 0
  }

  /**
   * Marquer une suggestion comme acceptée
   */
  static async acceptSuggestion(userId: string, suggestionId: string): Promise<void> {
    const suggestion = await db.query.smartSuggestions.findFirst({
      where: and(
        eq(smartSuggestions.id, suggestionId),
        eq(smartSuggestions.userId, userId)
      ),
    })

    if (suggestion) {
      const newTimesAccepted = suggestion.timesAccepted + 1
      const newTimesShown = suggestion.timesShown
      const newAcceptanceRate = ((newTimesAccepted / newTimesShown) * 100).toFixed(2)

      await db
        .update(smartSuggestions)
        .set({
          timesAccepted: newTimesAccepted,
          acceptanceRate: newAcceptanceRate,
          updatedAt: new Date(),
        })
        .where(eq(smartSuggestions.id, suggestionId))

      await db.insert(practiceLearningEvents).values({
        userId,
        suggestionId,
        eventType: 'suggestion_accepted',
        context: suggestion.triggerContext as any,
      })
    }
  }

  /**
   * Marquer une suggestion comme refusée
   */
  static async rejectSuggestion(userId: string, suggestionId: string, feedback?: string): Promise<void> {
    const suggestion = await db.query.smartSuggestions.findFirst({
      where: and(
        eq(smartSuggestions.id, suggestionId),
        eq(smartSuggestions.userId, userId)
      ),
    })

    if (suggestion) {
      const newTimesRejected = suggestion.timesRejected + 1
      const newTimesShown = suggestion.timesShown
      const newAcceptanceRate = ((suggestion.timesAccepted / newTimesShown) * 100).toFixed(2)

      await db
        .update(smartSuggestions)
        .set({
          timesRejected: newTimesRejected,
          acceptanceRate: newAcceptanceRate,
          updatedAt: new Date(),
        })
        .where(eq(smartSuggestions.id, suggestionId))

      await db.insert(practiceLearningEvents).values({
        userId,
        suggestionId,
        eventType: 'suggestion_rejected',
        context: suggestion.triggerContext as any,
        metadata: feedback ? { userFeedback: feedback } : undefined,
      })

      // Si le taux d'acceptation est trop faible (< 20%), désactiver la suggestion
      if (newTimesShown >= 5 && parseFloat(newAcceptanceRate) < 20) {
        await db
          .update(smartSuggestions)
          .set({ isActive: false })
          .where(eq(smartSuggestions.id, suggestionId))
      }
    }
  }

  /**
   * Obtenir les statistiques d'apprentissage pour un utilisateur
   */
  static async getUserLearningStats(userId: string): Promise<{
    totalPatterns: number
    totalSuggestions: number
    averageAcceptanceRate: number
    topPatterns: Array<{ actionType: string; frequency: number; data: any }>
  }> {
    const patterns = await db.query.practicePatterns.findMany({
      where: eq(practicePatterns.userId, userId),
      orderBy: [desc(practicePatterns.frequency)],
      limit: 10,
    })

    const suggestions = await db.query.smartSuggestions.findMany({
      where: and(
        eq(smartSuggestions.userId, userId),
        eq(smartSuggestions.isActive, true)
      ),
    })

    const totalAcceptanceRate = suggestions.reduce(
      (sum, s) => sum + parseFloat(s.acceptanceRate || '0'),
      0
    )

    return {
      totalPatterns: patterns.length,
      totalSuggestions: suggestions.length,
      averageAcceptanceRate: suggestions.length > 0 ? totalAcceptanceRate / suggestions.length : 0,
      topPatterns: patterns.map(p => ({
        actionType: p.actionType,
        frequency: p.frequency,
        data: p.actionData,
      })),
    }
  }

  /**
   * Supprimer toutes les données d'apprentissage d'un utilisateur
   */
  static async deleteAllUserData(userId: string): Promise<void> {
    await db.delete(practiceLearningEvents).where(eq(practiceLearningEvents.userId, userId))
    await db.delete(smartSuggestions).where(eq(smartSuggestions.userId, userId))
    await db.delete(practicePatterns).where(eq(practicePatterns.userId, userId))
  }
}
