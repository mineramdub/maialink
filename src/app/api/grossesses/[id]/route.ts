import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { grossesses, auditLogs } from '@/lib/schema'
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

    const grossesse = await db.query.grossesses.findFirst({
      where: and(eq(grossesses.id, id), eq(grossesses.userId, user.id)),
      with: {
        patient: true,
        bebes: true,
        examens: {
          orderBy: (examens, { asc }) => [asc(examens.saPrevue)],
        },
        consultations: {
          orderBy: (consultations, { desc }) => [desc(consultations.date)],
        },
        suiviPostPartum: {
          orderBy: (suivi, { desc }) => [desc(suivi.date)],
        },
      },
    })

    if (!grossesse) {
      return NextResponse.json({ error: 'Grossesse non trouvee' }, { status: 404 })
    }

    return NextResponse.json({ success: true, grossesse })
  } catch (error) {
    console.error('Get grossesse error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
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

    const oldGrossesse = await db.query.grossesses.findFirst({
      where: and(eq(grossesses.id, id), eq(grossesses.userId, user.id)),
    })

    if (!oldGrossesse) {
      return NextResponse.json({ error: 'Grossesse non trouvee' }, { status: 404 })
    }

    const [updatedGrossesse] = await db
      .update(grossesses)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(grossesses.id, id), eq(grossesses.userId, user.id)))
      .returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'update',
      tableName: 'grossesses',
      recordId: id,
      oldData: oldGrossesse,
      newData: updatedGrossesse,
    })

    return NextResponse.json({ success: true, grossesse: updatedGrossesse })
  } catch (error) {
    console.error('Update grossesse error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
