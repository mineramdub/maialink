import { db } from './db.js'
import { alertes, grossesses, examensPrenataux } from './schema.js'
import { eq, and, isNull, lt, gte, lte } from 'drizzle-orm'

// Calcul des semaines d'aménorrhée depuis la DDR
export function calculateSA(ddr: Date): number {
  const now = new Date()
  const diffTime = now.getTime() - ddr.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.floor(diffDays / 7)
}

// Génère les alertes pour les examens prénataux à venir
export async function generateExamAlertes(userId: string) {
  // Récupérer toutes les grossesses en cours
  const grossessesEnCours = await db.query.grossesses.findMany({
    where: and(
      eq(grossesses.userId, userId),
      eq(grossesses.status, 'en_cours')
    ),
    with: {
      patient: true,
      examens: true,
    },
  })

  const alertesToCreate: Array<{
    patientId: string
    grossesseId: string
    userId: string
    type: string
    message: string
    severity: 'info' | 'warning' | 'urgent'
  }> = []

  for (const grossesse of grossessesEnCours) {
    const sa = calculateSA(new Date(grossesse.ddr))

    // Échographie T1 (11-13 SA)
    if (sa >= 9 && sa <= 13) {
      const hasEchoT1 = grossesse.examens.some(
        (e) => e.type === 'echo_t1' && e.dateRealisee
      )
      if (!hasEchoT1) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'examen_prevu',
          message: `Échographie T1 à prévoir pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${sa} SA)`,
          severity: sa > 12 ? 'warning' : 'info',
        })
      }
    }

    // Échographie T2 (20-25 SA)
    if (sa >= 18 && sa <= 25) {
      const hasEchoT2 = grossesse.examens.some(
        (e) => e.type === 'echo_t2' && e.dateRealisee
      )
      if (!hasEchoT2) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'examen_prevu',
          message: `Échographie T2 à prévoir pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${sa} SA)`,
          severity: sa > 24 ? 'warning' : 'info',
        })
      }
    }

    // Échographie T3 (30-35 SA)
    if (sa >= 28 && sa <= 35) {
      const hasEchoT3 = grossesse.examens.some(
        (e) => e.type === 'echo_t3' && e.dateRealisee
      )
      if (!hasEchoT3) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'examen_prevu',
          message: `Échographie T3 à prévoir pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${sa} SA)`,
          severity: sa > 34 ? 'warning' : 'info',
        })
      }
    }

    // Test O'Sullivan (24-28 SA)
    if (sa >= 23 && sa <= 28) {
      const hasSugar = grossesse.examens.some(
        (e) => e.type === 'glycemie' && e.dateRealisee
      )
      if (!hasSugar) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'examen_prevu',
          message: `Test O'Sullivan (glycémie) à prévoir pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${sa} SA)`,
          severity: sa > 27 ? 'warning' : 'info',
        })
      }
    }

    // DPA proche (37+ SA)
    if (sa >= 37) {
      alertesToCreate.push({
        patientId: grossesse.patientId,
        grossesseId: grossesse.id,
        userId,
        type: 'dpa_proche',
        message: `DPA proche pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${sa} SA) - DPA: ${new Date(grossesse.dpa).toLocaleDateString('fr-FR')}`,
        severity: sa >= 41 ? 'urgent' : sa >= 39 ? 'warning' : 'info',
      })
    }

    // Terme dépassé (41+ SA)
    if (sa >= 41) {
      alertesToCreate.push({
        patientId: grossesse.patientId,
        grossesseId: grossesse.id,
        userId,
        type: 'terme_depasse',
        message: `TERME DÉPASSÉ pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${sa} SA) - Suivi rapproché nécessaire`,
        severity: 'urgent',
      })
    }
  }

  // Supprimer les anciennes alertes non lues du même type pour éviter les doublons
  for (const alerte of alertesToCreate) {
    await db.delete(alertes).where(
      and(
        eq(alertes.userId, userId),
        eq(alertes.patientId, alerte.patientId),
        eq(alertes.type, alerte.type),
        eq(alertes.isRead, false)
      )
    )
  }

  // Créer les nouvelles alertes
  if (alertesToCreate.length > 0) {
    await db.insert(alertes).values(alertesToCreate)
  }

  return alertesToCreate.length
}

// Génère les alertes post-partum
export async function generatePostPartumAlertes(userId: string) {
  // Récupérer les grossesses terminées récemment
  const now = new Date()
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const grossessesTerminees = await db.query.grossesses.findMany({
    where: and(
      eq(grossesses.userId, userId),
      eq(grossesses.status, 'terminee'),
      gte(grossesses.updatedAt, twoMonthsAgo)
    ),
    with: {
      patient: true,
      suiviPostPartum: true,
    },
  })

  const alertesToCreate: Array<{
    patientId: string
    grossesseId: string
    userId: string
    type: string
    message: string
    severity: 'info' | 'warning' | 'urgent'
  }> = []

  for (const grossesse of grossessesTerminees) {
    const dateAccouchement = grossesse.dateAccouchement
    if (!dateAccouchement) continue

    const joursPostPartum = Math.floor(
      (now.getTime() - new Date(dateAccouchement).getTime()) / (1000 * 60 * 60 * 24)
    )

    // Visite J8 post-partum
    if (joursPostPartum >= 6 && joursPostPartum <= 10) {
      const hasVisiteJ8 = grossesse.suiviPostPartum.some(
        (s) => s.joursPostPartum && s.joursPostPartum >= 6 && s.joursPostPartum <= 10
      )
      if (!hasVisiteJ8) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'visite_postpartum',
          message: `Visite post-partum J8 à prévoir pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (J${joursPostPartum})`,
          severity: joursPostPartum > 9 ? 'warning' : 'info',
        })
      }
    }

    // Consultation post-natale (6-8 semaines)
    if (joursPostPartum >= 35 && joursPostPartum <= 60) {
      const hasConsultPostNatale = grossesse.suiviPostPartum.some(
        (s) => s.joursPostPartum && s.joursPostPartum >= 35
      )
      if (!hasConsultPostNatale) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'consultation_postnatale',
          message: `Consultation post-natale à prévoir pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${Math.floor(joursPostPartum / 7)} semaines post-partum)`,
          severity: joursPostPartum > 56 ? 'warning' : 'info',
        })
      }
    }
  }

  // Supprimer les anciennes alertes non lues du même type
  for (const alerte of alertesToCreate) {
    await db.delete(alertes).where(
      and(
        eq(alertes.userId, userId),
        eq(alertes.patientId, alerte.patientId),
        eq(alertes.type, alerte.type),
        eq(alertes.isRead, false)
      )
    )
  }

  // Créer les nouvelles alertes
  if (alertesToCreate.length > 0) {
    await db.insert(alertes).values(alertesToCreate)
  }

  return alertesToCreate.length
}
