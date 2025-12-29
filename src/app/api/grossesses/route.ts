import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { grossesses, patients, auditLogs, alertes } from '@/lib/schema'
import { eq, and, desc } from 'drizzle-orm'
import { calculateDPA } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const patientId = searchParams.get('patientId')

    let whereClause = eq(grossesses.userId, user.id)

    if (status) {
      whereClause = and(whereClause, eq(grossesses.status, status as 'en_cours' | 'terminee' | 'fausse_couche' | 'ivg' | 'img'))!
    }

    if (patientId) {
      whereClause = and(whereClause, eq(grossesses.patientId, patientId))!
    }

    const result = await db.query.grossesses.findMany({
      where: whereClause,
      with: {
        patient: true,
        bebes: true,
        examens: true,
      },
      orderBy: [desc(grossesses.createdAt)],
    })

    return NextResponse.json({ success: true, grossesses: result })
  } catch (error) {
    console.error('Get grossesses error:', error)
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

    // Calculate DPA from DDR
    const ddr = new Date(body.ddr)
    const dpa = calculateDPA(ddr)

    const [newGrossesse] = await db.insert(grossesses).values({
      patientId: body.patientId,
      userId: user.id,
      ddr: body.ddr,
      dpa: dpa.toISOString().split('T')[0],
      dateConception: body.dateConception,
      grossesseMultiple: body.grossesseMultiple || false,
      nombreFoetus: body.nombreFoetus || 1,
      gestite: (patient.gravida || 0) + 1,
      parite: patient.para || 0,
      facteursRisque: body.facteursRisque || [],
      notes: body.notes,
    }).returning()

    // Update patient gravida
    await db.update(patients).set({
      gravida: (patient.gravida || 0) + 1,
      updatedAt: new Date(),
    }).where(eq(patients.id, patient.id))

    // Create initial alerts for required exams
    const initialAlerts = [
      { type: 'examen', message: 'Echo T1 a programmer (11-14 SA)', severity: 'info' as const },
      { type: 'examen', message: 'Bilan sanguin du 1er trimestre a realiser', severity: 'info' as const },
    ]

    for (const alert of initialAlerts) {
      await db.insert(alertes).values({
        patientId: body.patientId,
        grossesseId: newGrossesse.id,
        userId: user.id,
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
      })
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'create',
      tableName: 'grossesses',
      recordId: newGrossesse.id,
      newData: newGrossesse,
    })

    return NextResponse.json({ success: true, grossesse: newGrossesse })
  } catch (error) {
    console.error('Create grossesse error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
