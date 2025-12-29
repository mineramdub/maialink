import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices, patients, auditLogs } from '@/lib/schema'
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm'
import { generateInvoiceNumber } from '@/lib/cotations-ngap'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let whereClause = eq(invoices.userId, user.id)

    if (patientId) {
      whereClause = and(whereClause, eq(invoices.patientId, patientId))!
    }
    if (status) {
      whereClause = and(whereClause, eq(invoices.status, status as 'brouillon' | 'envoyee' | 'payee' | 'impayee' | 'annulee'))!
    }
    if (startDate) {
      whereClause = and(whereClause, gte(invoices.date, startDate))!
    }
    if (endDate) {
      whereClause = and(whereClause, lte(invoices.date, endDate))!
    }

    const result = await db.query.invoices.findMany({
      where: whereClause,
      with: {
        patient: true,
      },
      orderBy: [desc(invoices.date)],
    })

    // Calcul des stats
    const stats = await db
      .select({
        totalHT: sql<number>`sum(${invoices.montantHT})`,
        totalPaye: sql<number>`sum(${invoices.montantPaye})`,
        count: sql<number>`count(*)`,
      })
      .from(invoices)
      .where(eq(invoices.userId, user.id))

    return NextResponse.json({
      success: true,
      invoices: result,
      stats: stats[0],
    })
  } catch (error) {
    console.error('Get invoices error:', error)
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

    // Verify patient
    const patient = await db.query.patients.findFirst({
      where: and(eq(patients.id, body.patientId), eq(patients.userId, user.id)),
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patiente non trouvee' }, { status: 404 })
    }

    // Generate invoice number
    const numero = generateInvoiceNumber()

    // Calculate amounts from cotations
    let montantHT = 0
    const cotations = body.cotations || []
    for (const cot of cotations) {
      montantHT += cot.montant * (cot.quantity || 1)
    }

    const montantTTC = montantHT // Pas de TVA pour actes medicaux

    const [newInvoice] = await db.insert(invoices).values({
      numero,
      patientId: body.patientId,
      userId: user.id,
      consultationId: body.consultationId,
      date: body.date || new Date().toISOString().split('T')[0],
      dateEcheance: body.dateEcheance,
      montantHT: montantHT.toString(),
      montantTTC: montantTTC.toString(),
      montantPaye: '0',
      cotations,
      status: body.status || 'brouillon',
      paymentMethod: body.paymentMethod,
      tiersPart: body.tiersPart?.toString(),
      patientPart: body.patientPart?.toString(),
      notes: body.notes,
    }).returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'create',
      tableName: 'invoices',
      recordId: newInvoice.id,
      newData: newInvoice,
    })

    return NextResponse.json({ success: true, invoice: newInvoice })
  } catch (error) {
    console.error('Create invoice error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
