import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { patients, auditLogs } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const { id } = await params

    const patient = await db.query.patients.findFirst({
      where: and(eq(patients.id, id), eq(patients.userId, user.id)),
      with: {
        grossesses: {
          orderBy: (grossesses, { desc }) => [desc(grossesses.createdAt)],
        },
        consultations: {
          orderBy: (consultations, { desc }) => [desc(consultations.date)],
          limit: 10,
        },
        appointments: {
          orderBy: (appointments, { desc }) => [desc(appointments.startTime)],
          limit: 5,
        },
        documents: {
          orderBy: (documents, { desc }) => [desc(documents.createdAt)],
          limit: 10,
        },
        alertes: {
          where: (alertes, { eq }) => eq(alertes.isRead, false),
        },
      },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patiente non trouvee' }, { status: 404 })
    }

    // Audit log - lecture du dossier
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'read',
      tableName: 'patients',
      recordId: id,
    })

    return NextResponse.json({ success: true, patient })
  } catch (error) {
    console.error('Get patient error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Get old data for audit
    const oldPatient = await db.query.patients.findFirst({
      where: and(eq(patients.id, id), eq(patients.userId, user.id)),
    })

    if (!oldPatient) {
      return NextResponse.json({ error: 'Patiente non trouvee' }, { status: 404 })
    }

    const [updatedPatient] = await db
      .update(patients)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(patients.id, id), eq(patients.userId, user.id)))
      .returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'update',
      tableName: 'patients',
      recordId: id,
      oldData: oldPatient,
      newData: updatedPatient,
    })

    return NextResponse.json({ success: true, patient: updatedPatient })
  } catch (error) {
    console.error('Update patient error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const { id } = await params

    // Soft delete - just archive
    const [archivedPatient] = await db
      .update(patients)
      .set({
        status: 'archived',
        updatedAt: new Date(),
      })
      .where(and(eq(patients.id, id), eq(patients.userId, user.id)))
      .returning()

    if (!archivedPatient) {
      return NextResponse.json({ error: 'Patiente non trouvee' }, { status: 404 })
    }

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'delete',
      tableName: 'patients',
      recordId: id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete patient error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
