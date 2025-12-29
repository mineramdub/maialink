import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/schema'
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

    const invoice = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, id), eq(invoices.userId, user.id)),
      with: {
        patient: true,
        consultation: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Facture non trouvee' }, { status: 404 })
    }

    return NextResponse.json({ success: true, invoice })
  } catch (error) {
    console.error('Get invoice error:', error)
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

    const existing = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, id), eq(invoices.userId, user.id)),
    })

    if (!existing) {
      return NextResponse.json({ error: 'Facture non trouvee' }, { status: 404 })
    }

    const [updated] = await db.update(invoices)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, id))
      .returning()

    return NextResponse.json({ success: true, invoice: updated })
  } catch (error) {
    console.error('Update invoice error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
