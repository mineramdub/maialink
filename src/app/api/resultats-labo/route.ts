import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { resultatsLabo } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { put } from '@vercel/blob'

// GET - Liste des résultats pour un patient
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const patientId = req.nextUrl.searchParams.get('patientId')
  if (!patientId) return NextResponse.json({ error: 'Patient ID requis' }, { status: 400 })

  const resultats = await db.query.resultatsLabo.findMany({
    where: eq(resultatsLabo.patientId, patientId),
    orderBy: [desc(resultatsLabo.dateAnalyse), desc(resultatsLabo.createdAt)],
  })

  return NextResponse.json({ success: true, resultats })
}

// POST - Créer un résultat (avec ou sans fichier)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const formData = await req.formData()

  const patientId = formData.get('patientId') as string
  const type = formData.get('type') as string
  const nom = formData.get('nom') as string
  const dateAnalyse = formData.get('dateAnalyse') as string | null
  const dateReception = formData.get('dateReception') as string | null
  const resultatManuel = formData.get('resultatManuel') as string | null
  const normal = formData.get('normal') as string | null
  const commentaire = formData.get('commentaire') as string | null
  const laboratoire = formData.get('laboratoire') as string | null
  const file = formData.get('file') as File | null

  let fichierUrl = null
  let fichierNom = null

  // Upload du fichier si présent
  if (file) {
    const blob = await put(`resultats-labo/${user.id}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })
    fichierUrl = blob.url
    fichierNom = file.name
  }

  const [resultat] = await db.insert(resultatsLabo).values({
    patientId,
    userId: user.id,
    type,
    nom,
    dateAnalyse: dateAnalyse || null,
    dateReception: dateReception || null,
    resultatManuel: resultatManuel || null,
    fichierUrl,
    fichierNom,
    normal: normal ? normal === 'true' : null,
    commentaire: commentaire || null,
    laboratoire: laboratoire || null,
  }).returning()

  return NextResponse.json({ success: true, resultat })
}
