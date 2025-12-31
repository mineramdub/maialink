import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { appointments, auditLogs } from '../lib/schema.js'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

const router = Router()
router.use(authMiddleware)

// GET /api/appointments - List appointments
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { patientId, startDate, endDate, status } = req.query

    let whereClause = eq(appointments.userId, req.user!.id)

    if (patientId) {
      whereClause = and(whereClause, eq(appointments.patientId, patientId as string))!
    }
    if (status) {
      whereClause = and(whereClause, eq(appointments.status, status as any))!
    }
    if (startDate) {
      whereClause = and(whereClause, gte(appointments.startTime, new Date(startDate as string)))!
    }
    if (endDate) {
      whereClause = and(whereClause, lte(appointments.endTime, new Date(endDate as string)))!
    }

    const result = await db.query.appointments.findMany({
      where: whereClause,
      with: {
        patient: true,
      },
      orderBy: [desc(appointments.startTime)],
    })

    res.json({
      success: true,
      appointments: result,
    })
  } catch (error) {
    console.error('Get appointments error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/appointments/:id - Get single appointment
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const appointment = await db.query.appointments.findFirst({
      where: and(eq(appointments.id, id), eq(appointments.userId, req.user!.id)),
      with: {
        patient: true,
      },
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' })
    }

    res.json({ success: true, appointment })
  } catch (error) {
    console.error('Get appointment error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/appointments - Create appointment
router.post('/', async (req: AuthRequest, res) => {
  try {
    const body = req.body

    const [newAppointment] = await db.insert(appointments).values({
      patientId: body.patientId,
      userId: req.user!.id,
      title: body.title,
      type: body.type,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      status: body.status || 'planifie',
      location: body.location,
      isHomeVisit: body.isHomeVisit || false,
      notes: body.notes,
    }).returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'create',
      tableName: 'appointments',
      recordId: newAppointment.id,
      newData: newAppointment,
    })

    res.json({ success: true, appointment: newAppointment })
  } catch (error) {
    console.error('Create appointment error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PATCH /api/appointments/:id - Update appointment
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const body = req.body

    const oldAppointment = await db.query.appointments.findFirst({
      where: and(eq(appointments.id, id), eq(appointments.userId, req.user!.id)),
    })

    if (!oldAppointment) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' })
    }

    const updateData: any = { ...body, updatedAt: new Date() }
    if (body.startTime) updateData.startTime = new Date(body.startTime)
    if (body.endTime) updateData.endTime = new Date(body.endTime)

    const [updatedAppointment] = await db
      .update(appointments)
      .set(updateData)
      .where(and(eq(appointments.id, id), eq(appointments.userId, req.user!.id)))
      .returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'update',
      tableName: 'appointments',
      recordId: id,
      oldData: oldAppointment,
      newData: updatedAppointment,
    })

    res.json({ success: true, appointment: updatedAppointment })
  } catch (error) {
    console.error('Update appointment error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const appointment = await db.query.appointments.findFirst({
      where: and(eq(appointments.id, id), eq(appointments.userId, req.user!.id)),
    })

    if (!appointment) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' })
    }

    await db.delete(appointments)
      .where(and(eq(appointments.id, id), eq(appointments.userId, req.user!.id)))

    // Audit log
    await db.insert(auditLogs).values({
      userId: req.user!.id,
      action: 'delete',
      tableName: 'appointments',
      recordId: id,
      oldData: appointment,
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Delete appointment error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
