import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { invoices, patients, auditLogs } from '../lib/schema.js'
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm'
import { generateInvoiceNumber } from '../lib/cotations-ngap.js'

const router = Router()
router.use(authMiddleware)

// GET /api/invoices - List invoices
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { patientId, status, startDate, endDate } = req.query

    let whereClause = eq(invoices.userId, req.user!.id)

    if (patientId) {
      whereClause = and(whereClause, eq(invoices.patientId, patientId as string))!
    }
    if (status) {
      whereClause = and(whereClause, eq(invoices.status, status as 'brouillon' | 'envoyee' | 'payee' | 'impayee' | 'annulee'))!
    }
    if (startDate) {
      whereClause = and(whereClause, gte(invoices.date, startDate as string))!
    }
    if (endDate) {
      whereClause = and(whereClause, lte(invoices.date, endDate as string))!
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
      .where(eq(invoices.userId, req.user!.id))

    res.json({
      success: true,
      invoices: result,
      stats: stats[0],
    })
  } catch (error) {
    console.error('Get invoices error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/invoices - Create invoice
router.post('/', async (req: AuthRequest, res) => {
  try {
    const body = req.body

    // Verify patient
    const patient = await db.query.patients.findFirst({
      where: and(eq(patients.id, body.patientId), eq(patients.userId, req.user!.id)),
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patiente non trouvee' })
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
      userId: req.user!.id,
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
      userId: req.user!.id,
      action: 'create',
      tableName: 'invoices',
      recordId: newInvoice.id,
      newData: newInvoice,
    })

    res.json({ success: true, invoice: newInvoice })
  } catch (error) {
    console.error('Create invoice error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/invoices/:id - Get invoice details
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const invoice = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, id), eq(invoices.userId, req.user!.id)),
      with: {
        patient: true,
        consultation: true,
      },
    })

    if (!invoice) {
      return res.status(404).json({ error: 'Facture non trouvee' })
    }

    res.json({ success: true, invoice })
  } catch (error) {
    console.error('Get invoice error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PATCH /api/invoices/:id - Update invoice
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const body = req.body

    const oldInvoice = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, id), eq(invoices.userId, req.user!.id)),
    })

    if (!oldInvoice) {
      return res.status(404).json({ error: 'Facture non trouvee' })
    }

    const [updatedInvoice] = await db
      .update(invoices)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(invoices.id, id), eq(invoices.userId, req.user!.id)))
      .returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'update',
      tableName: 'invoices',
      recordId: id,
      oldData: oldInvoice,
      newData: updatedInvoice,
    })

    res.json({ success: true, invoice: updatedInvoice })
  } catch (error) {
    console.error('Update invoice error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
