import { NextRequest, NextResponse } from 'next/server'
import { registerUser, createSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, rpps, adeli } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    const result = await registerUser({
      email,
      password,
      firstName,
      lastName,
      rpps,
      adeli,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Create session automatically after registration
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const token = await createSession(result.user!.id, ipAddress, userAgent)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: result.user,
    })
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
