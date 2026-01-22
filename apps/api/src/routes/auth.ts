import { Router } from 'express'
import { loginUser, registerUser, logout } from '../lib/auth.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      })
    }

    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip
    const userAgent = req.headers['user-agent']

    const result = await loginUser(email, password, ipAddress, userAgent)

    if (!result.success) {
      return res.status(401).json(result)
    }

    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24h
      path: '/',
    })

    res.json({ success: true, user: result.user })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const {
      email, password, firstName, lastName,
      rpps, adeli, numeroAM, phone,
      specialite, typeStructure, nomStructure,
      cabinetAddress, cabinetPostalCode, cabinetCity
    } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs requis doivent être remplis'
      })
    }

    const result = await registerUser({
      email,
      password,
      firstName,
      lastName,
      rpps,
      adeli,
      numeroAM,
      phone,
      specialite,
      typeStructure,
      nomStructure,
      cabinetAddress,
      cabinetPostalCode,
      cabinetCity,
    })

    if (!result.success) {
      return res.status(400).json(result)
    }

    res.json(result)
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

router.post('/logout', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const token = req.cookies.auth_token

    if (token) {
      await logout(token)
    }

    res.clearCookie('auth_token')
    res.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ success: false, error: 'Erreur serveur' })
  }
})

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  res.json({ success: true, user: req.user })
})

export default router
