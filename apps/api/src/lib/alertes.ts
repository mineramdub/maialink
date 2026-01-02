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
      consultations: {
        orderBy: (consultations, { desc }) => [desc(consultations.date)],
      },
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
    const ddr = new Date(grossesse.ddr)
    const now = new Date()
    const diffTime = now.getTime() - ddr.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const sa = Math.floor(diffDays / 7)
    const jours = diffDays % 7
    const saFormatted = `${sa} SA + ${jours}j`

    // Consultation mensuelle
    const lastConsult = grossesse.consultations[0]
    if (lastConsult) {
      const daysSinceConsult = Math.floor(
        (now.getTime() - new Date(lastConsult.date).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceConsult > 28) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'consultation_mensuelle',
          message: `Consultation mensuelle à planifier pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted}) - Dernière consultation il y a ${daysSinceConsult} jours`,
          severity: daysSinceConsult > 35 ? 'warning' : 'info',
        })
      }
    } else if (sa > 8) {
      alertesToCreate.push({
        patientId: grossesse.patientId,
        grossesseId: grossesse.id,
        userId,
        type: 'consultation_mensuelle',
        message: `Première consultation de suivi à planifier pour ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted})`,
        severity: 'warning',
      })
    }

    // Déclaration de grossesse (avant 15 SA) - Alerte à partir de 6 SA
    if (sa >= 6 && sa <= 15) {
      // Vérifier si déclaration déjà faite (à implémenter dans le schéma si nécessaire)
      alertesToCreate.push({
        patientId: grossesse.patientId,
        grossesseId: grossesse.id,
        userId,
        type: 'declaration_grossesse',
        message: `Déclaration de grossesse à effectuer (avant 15 SA) - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted})`,
        severity: sa > 13 ? 'warning' : 'info',
      })
    }

    // Examens biologiques T1 (idéal avant 12 SA) - Alerte à partir de 6 SA
    if (sa >= 6 && sa <= 12) {
      const hasBioT1 = grossesse.examens.some(
        (e) => (e.type === 'nfs' || e.type === 'toxoplasmose') && e.dateRealisee
      )
      if (!hasBioT1) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'biologie_t1',
          message: `Bilan biologique T1 à prescrire (NFS, toxo, rubéole, syphilis, VIH, groupe sanguin) - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted})`,
          severity: sa > 10 ? 'warning' : 'info',
        })
      }
    }

    // Échographie T1 (11-13 SA idéal) - Alerte à partir de 9 SA seulement
    if (sa >= 9 && sa <= 14) {
      const hasEchoT1 = grossesse.examens.some(
        (e) => e.type === 'echo_t1' && e.dateRealisee
      )
      if (!hasEchoT1) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'echo_t1',
          message: `Échographie T1 (11-13 SA) à prescrire - ${grossesse.patient.firstName} ${grossesse.patient.lastName} est à ${saFormatted}`,
          severity: sa > 12 ? 'warning' : sa > 10 ? 'info' : 'info',
        })
      }
    }

    // Échographie T2 (20-25 SA idéal) - Morphologique - Alerte à partir de 18 SA
    if (sa >= 18 && sa <= 26) {
      const hasEchoT2 = grossesse.examens.some(
        (e) => e.type === 'echo_t2' && e.dateRealisee
      )
      if (!hasEchoT2) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'echo_t2',
          message: `Échographie T2 morphologique (20-25 SA) à prescrire - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted})`,
          severity: sa > 24 ? 'warning' : 'info',
        })
      }
    }

    // Examens biologiques T2 + Test O'Sullivan (24-28 SA idéal) - Alerte à partir de 22 SA
    if (sa >= 22 && sa <= 28) {
      const hasBioT2 = grossesse.examens.some(
        (e) => e.type === 'rai' && e.dateRealisee
      )
      const hasSugar = grossesse.examens.some(
        (e) => e.type === 'glycemie' && e.dateRealisee
      )

      if (!hasBioT2 || !hasSugar) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'biologie_t2',
          message: `Bilan biologique T2 à prescrire (NFS, RAI, glycémie + Test O'Sullivan) - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted})`,
          severity: sa > 26 ? 'warning' : 'info',
        })
      }
    }

    // Échographie T3 (30-35 SA idéal) - Croissance - Alerte à partir de 28 SA
    if (sa >= 28 && sa <= 36) {
      const hasEchoT3 = grossesse.examens.some(
        (e) => e.type === 'echo_t3' && e.dateRealisee
      )
      if (!hasEchoT3) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'echo_t3',
          message: `Échographie T3 de croissance (30-35 SA) à prescrire - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted})`,
          severity: sa > 34 ? 'warning' : 'info',
        })
      }
    }

    // Examens biologiques T3 (28-32 SA idéal) - Alerte à partir de 27 SA
    if (sa >= 27 && sa <= 32) {
      const hasBioT3 = grossesse.examens.some(
        (e) => e.type === 'nfs' && e.dateRealisee &&
        new Date(e.dateRealisee).getTime() > ddr.getTime() + (26 * 7 * 24 * 60 * 60 * 1000)
      )
      if (!hasBioT3) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'biologie_t3',
          message: `Bilan biologique T3 à prescrire (NFS, RAI, AgHBs, sérologies toxo si négative) - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted})`,
          severity: sa > 30 ? 'warning' : 'info',
        })
      }
    }

    // Préparation à la naissance (EPP) - À partir de 26 SA (pour anticiper la période 28-36)
    if (sa >= 26 && sa <= 36) {
      // Vérifier si déjà mentionné récemment pour éviter les doublons
      const hasRecentEPP = alertesToCreate.some(
        a => a.type === 'epp' && a.patientId === grossesse.patientId
      )
      if (!hasRecentEPP && (sa === 26 || sa === 30 || sa === 34)) {
        // N'afficher qu'à 26, 30 et 34 SA pour rappel progressif
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'epp',
          message: `Entretien prénatal précoce et séances de préparation à la naissance à planifier - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted}) - 8 séances remboursées`,
          severity: sa > 33 ? 'warning' : 'info',
        })
      }
    }

    // Consultation anesthésie - À partir de 30 SA seulement (pour consultation avant 36 SA)
    if (sa >= 30 && sa <= 36) {
      // Vérifier si consultation déjà faite
      const hasConsultAnesthesie = grossesse.consultations.some(
        c => c.type === 'consultation_anesthesie'
      )
      if (!hasConsultAnesthesie) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'consultation_anesthesie',
          message: `Consultation d'anesthésie obligatoire à planifier (à faire avant 36 SA) - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted})`,
          severity: sa > 34 ? 'urgent' : sa > 32 ? 'warning' : 'info',
        })
      }
    }

    // Prélèvement vaginal streptocoque B (35-37 SA idéal) - Alerte à partir de 33 SA
    if (sa >= 33 && sa <= 38) {
      const hasStreptoB = grossesse.examens.some(
        (e) => e.type === 'strepto_b' && e.dateRealisee
      )
      if (!hasStreptoB) {
        alertesToCreate.push({
          patientId: grossesse.patientId,
          grossesseId: grossesse.id,
          userId,
          type: 'strepto_b',
          message: `Prélèvement vaginal streptocoque B (35-37 SA) à prescrire - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted})`,
          severity: sa > 36 ? 'warning' : 'info',
        })
      }
    }

    // DPA proche (37+ SA) - À terme
    if (sa >= 37 && sa < 41) {
      alertesToCreate.push({
        patientId: grossesse.patientId,
        grossesseId: grossesse.id,
        userId,
        type: 'dpa_proche',
        message: `Grossesse à terme - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted}) - DPA: ${new Date(grossesse.dpa).toLocaleDateString('fr-FR')} - Préparer le dossier maternité`,
        severity: sa >= 39 ? 'warning' : 'info',
      })
    }

    // Terme dépassé (41+ SA)
    if (sa >= 41) {
      const daysOver = Math.floor((now.getTime() - new Date(grossesse.dpa).getTime()) / (1000 * 60 * 60 * 24))
      alertesToCreate.push({
        patientId: grossesse.patientId,
        grossesseId: grossesse.id,
        userId,
        type: 'terme_depasse',
        message: `⚠️ TERME DÉPASSÉ - ${grossesse.patient.firstName} ${grossesse.patient.lastName} (${saFormatted}) - DPA dépassé de ${daysOver} jours - Suivi rapproché et déclenchement à prévoir`,
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
