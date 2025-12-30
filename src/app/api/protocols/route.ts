import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { protocols } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { put } from '@vercel/blob'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const userProtocols = await db.query.protocols.findMany({
      where: eq(protocols.userId, user.id),
      orderBy: [desc(protocols.createdAt)],
    })

    return NextResponse.json({ success: true, protocols: userProtocols })
  } catch (error) {
    console.error('Get protocols error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const nom = formData.get('nom') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    if (!file || !nom) {
      return NextResponse.json({ error: 'Fichier et nom requis' }, { status: 400 })
    }

    // Vérifier que c'est un PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Seuls les fichiers PDF sont acceptes' }, { status: 400 })
    }

    // Upload vers Vercel Blob
    const blob = await put(`protocols/${user.id}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    // Créer l'entrée en base
    const [protocol] = await db.insert(protocols).values({
      userId: user.id,
      nom,
      description: description || null,
      category: category as 'grossesse' | 'post_partum' | 'gynecologie' | 'reeducation' | 'pediatrie' | 'autre',
      fileUrl: blob.url,
      fileName: file.name,
      fileSize: file.size,
      isProcessed: false,
    }).returning()

    // Lancer le traitement immédiatement (sans attendre)
    const baseUrl = request.headers.get('origin') || request.headers.get('host') || 'https://maialink.vercel.app'
    const processUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`

    fetch(`${processUrl}/api/protocols/${protocol.id}/process`, {
      method: 'POST',
    }).catch(console.error)

    return NextResponse.json({ success: true, protocol })
  } catch (error) {
    console.error('Create protocol error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
