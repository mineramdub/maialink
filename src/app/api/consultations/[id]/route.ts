import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { consultations } from '@/lib/schema'
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

    const consultation = await db.query.consultations.findFirst({
      where: and(eq(consultations.id, id), eq(consultations.userId, user.id)),
      with: {
        patient: true,
        grossesse: true,
      },
    })

    if (!consultation) {
      return NextResponse.json({ error: 'Consultation non trouvee' }, { status: 404 })
    }

    return NextResponse.json({ success: true, consultation })
  } catch (error) {
    console.error('Get consultation error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
