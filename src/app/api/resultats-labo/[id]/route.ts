import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { resultatsLabo } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { del } from '@vercel/blob'

// DELETE - Supprimer un résultat
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const resolvedParams = await params
  const [resultat] = await db.select().from(resultatsLabo).where(eq(resultatsLabo.id, resolvedParams.id))

  if (!resultat) return NextResponse.json({ error: 'Résultat non trouvé' }, { status: 404 })

  // Supprimer le fichier si présent
  if (resultat.fichierUrl) {
    try {
      await del(resultat.fichierUrl)
    } catch (error) {
      console.error('Erreur suppression fichier:', error)
    }
  }

  await db.delete(resultatsLabo).where(eq(resultatsLabo.id, resolvedParams.id))

  return NextResponse.json({ success: true })
}

// PATCH - Mettre à jour
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const resolvedParams = await params
  const body = await req.json()

  const [resultat] = await db
    .update(resultatsLabo)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(resultatsLabo.id, resolvedParams.id))
    .returning()

  return NextResponse.json({ success: true, resultat })
}
