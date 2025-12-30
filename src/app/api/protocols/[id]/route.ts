import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { protocols, protocolChunks } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { del } from '@vercel/blob'

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

    const protocol = await db.query.protocols.findFirst({
      where: and(eq(protocols.id, id), eq(protocols.userId, user.id)),
      with: {
        chunks: true,
      },
    })

    if (!protocol) {
      return NextResponse.json({ error: 'Protocole non trouve' }, { status: 404 })
    }

    return NextResponse.json({ success: true, protocol })
  } catch (error) {
    console.error('Get protocol error:', error)
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

    const protocol = await db.query.protocols.findFirst({
      where: and(eq(protocols.id, id), eq(protocols.userId, user.id)),
    })

    if (!protocol) {
      return NextResponse.json({ error: 'Protocole non trouve' }, { status: 404 })
    }

    // Supprimer le fichier du blob storage
    try {
      await del(protocol.fileUrl)
    } catch (e) {
      console.error('Error deleting blob:', e)
    }

    // Supprimer les chunks (cascade) et le protocole
    await db.delete(protocolChunks).where(eq(protocolChunks.protocolId, id))
    await db.delete(protocols).where(eq(protocols.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete protocol error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
