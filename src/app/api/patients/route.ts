import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { patients, auditLogs } from '@/lib/schema'
import { eq, and, or, ilike, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status') || 'active'

    let whereClause = and(
      eq(patients.userId, user.id),
      status !== 'all' ? eq(patients.status, status as 'active' | 'inactive' | 'archived') : undefined
    )

    if (search) {
      whereClause = and(
        whereClause,
        or(
          ilike(patients.firstName, `%${search}%`),
          ilike(patients.lastName, `%${search}%`),
          ilike(patients.email, `%${search}%`)
        )
      )
    }

    const result = await db.query.patients.findMany({
      where: whereClause,
      orderBy: [desc(patients.updatedAt)],
    })

    return NextResponse.json({ success: true, patients: result })
  } catch (error) {
    console.error('Get patients error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const body = await request.json()

    const [newPatient] = await db.insert(patients).values({
      userId: user.id,
      firstName: body.firstName,
      lastName: body.lastName,
      maidenName: body.maidenName,
      birthDate: body.birthDate,
      birthPlace: body.birthPlace,
      socialSecurityNumber: body.socialSecurityNumber,
      email: body.email,
      phone: body.phone,
      mobilePhone: body.mobilePhone,
      address: body.address,
      postalCode: body.postalCode,
      city: body.city,
      bloodType: body.bloodType,
      rhesus: body.rhesus,
      allergies: body.allergies,
      antecedentsMedicaux: body.antecedentsMedicaux,
      antecedentsChirurgicaux: body.antecedentsChirurgicaux,
      antecedentsFamiliaux: body.antecedentsFamiliaux,
      traitementEnCours: body.traitementEnCours,
      gravida: body.gravida || 0,
      para: body.para || 0,
      mutuelle: body.mutuelle,
      numeroMutuelle: body.numeroMutuelle,
      medecinTraitant: body.medecinTraitant,
      personneConfiance: body.personneConfiance,
      telephoneConfiance: body.telephoneConfiance,
      consentementRGPD: body.consentementRGPD || false,
      dateConsentement: body.consentementRGPD ? new Date() : null,
      notes: body.notes,
    }).returning()

    // Audit log
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'create',
      tableName: 'patients',
      recordId: newPatient.id,
      newData: newPatient,
    })

    return NextResponse.json({ success: true, patient: newPatient })
  } catch (error) {
    console.error('Create patient error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
