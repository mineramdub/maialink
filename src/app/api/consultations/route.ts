import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { consultations, patients, alertes, auditLogs } from '@/lib/schema'
import { eq, and, desc } from 'drizzle-orm'
import { calculateSA } from '@/lib/utils'
import { checkClinicalAlerts } from '@/lib/pregnancy-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const grossesseId = searchParams.get('grossesseId')
    const type = searchParams.get('type')

    let whereClause = eq(consultations.userId, user.id)

    if (patientId) {
      whereClause = and(whereClause, eq(consultations.patientId, patientId))!
    }
    if (grossesseId) {
      whereClause = and(whereClause, eq(consultations.grossesseId, grossesseId))!
    }
    if (type) {
      whereClause = and(whereClause, eq(consultations.type, type as 'prenatale' | 'postnatale' | 'gyneco' | 'reeducation' | 'preparation' | 'monitoring' | 'autre'))!
    }

    const result = await db.query.consultations.findMany({
      where: whereClause,
      with: {
        patient: true,
        grossesse: true,
      },
      orderBy: [desc(consultations.date)],
    })

    return NextResponse.json({ success: true, consultations: result })
  } catch (error) {
    console.error('Get consultations error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const body = await request.json()

    // Verify patient belongs to user
    const patient = await db.query.patients.findFirst({
      where: and(eq(patients.id, body.patientId), eq(patients.userId, user.id)),
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patiente non trouvee' }, { status: 404 })
    }

    // Calculate SA if grossesse
    let saTerm: number | undefined
    let saJours: number | undefined
    if (body.grossesseId) {
      const grossesse = await db.query.grossesses.findFirst({
        where: eq(consultations.id, body.grossesseId),
      })
      if (grossesse) {
        const sa = calculateSA(grossesse.ddr)
        saTerm = sa.weeks
        saJours = sa.days
      }
    }

    // Check clinical alerts
    const clinicalAlerts = checkClinicalAlerts({
      tensionSystolique: body.tensionSystolique,
      tensionDiastolique: body.tensionDiastolique,
      proteineUrinaire: body.proteineUrinaire,
      poids: body.poids,
      sa: saTerm,
      hauteurUterine: body.hauteurUterine,
      bdc: body.bdc,
    })

    const [newConsultation] = await db.insert(consultations).values({
      patientId: body.patientId,
      userId: user.id,
      grossesseId: body.grossesseId,
      type: body.type,
      date: new Date(body.date),
      duree: body.duree,
      poids: body.poids,
      taille: body.taille,
      tensionSystolique: body.tensionSystolique,
      tensionDiastolique: body.tensionDiastolique,
      pouls: body.pouls,
      temperature: body.temperature,
      saTerm,
      saJours,
      hauteurUterine: body.hauteurUterine,
      bdc: body.bdc,
      mouvementsFoetaux: body.mouvementsFoetaux,
      presentationFoetale: body.presentationFoetale,
      motif: body.motif,
      examenClinique: body.examenClinique,
      conclusion: body.conclusion,
      prescriptions: body.prescriptions,
      proteineUrinaire: body.proteineUrinaire,
      glucoseUrinaire: body.glucoseUrinaire,
      leucocytesUrinaires: body.leucocytesUrinaires,
      nitritesUrinaires: body.nitritesUrinaires,
      alertes: clinicalAlerts.length > 0 ? clinicalAlerts : undefined,
    }).returning()

    // Create alerts in database
    for (const alert of clinicalAlerts) {
      await db.insert(alertes).values({
        patientId: body.patientId,
        grossesseId: body.grossesseId,
        consultationId: newConsultation.id,
        userId: user.id,
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
      })
    }

    // Update patient last consultation
    await db.update(patients).set({
      updatedAt: new Date(),
    }).where(eq(patients.id, body.patientId))

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'create',
      tableName: 'consultations',
      recordId: newConsultation.id,
      newData: newConsultation,
    })

    return NextResponse.json({
      success: true,
      consultation: newConsultation,
      alerts: clinicalAlerts,
    })
  } catch (error) {
    console.error('Create consultation error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
