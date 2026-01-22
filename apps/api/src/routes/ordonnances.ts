import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { db } from '../lib/db.js'
import { documentTemplates, documents, patients } from '../lib/schema.js'
import { eq, and } from 'drizzle-orm'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ORDONNANCE_TEMPLATES } from '../lib/ordonnanceTemplates.js'

const router = Router()
router.use(authMiddleware)

// GET /api/ordonnances/templates - Get ordonnance templates and medications
router.get('/templates', async (req: AuthRequest, res) => {
  try {
    // Get DB templates (legacy system)
    const dbTemplates = await db.query.documentTemplates.findMany({
      where: eq(documentTemplates.type, 'ordonnance'),
      orderBy: (documentTemplates, { asc }) => [asc(documentTemplates.nom)]
    })

    // Return both DB templates and new medication-based templates
    res.json({
      success: true,
      templates: ORDONNANCE_TEMPLATES,  // New system
      dbTemplates  // Legacy system for compatibility
    })
  } catch (error) {
    console.error('Get templates error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/ordonnances/generate - Generate ordonnance from template
router.post('/generate', async (req: AuthRequest, res) => {
  try {
    const {
      patientId,
      patientNom,
      patientDateNaissance,
      medicaments,
      contenu,
      dureeValidite,
      notes,
      templateNom,
      consultationId
    } = req.body

    // Get patient info
    const patient = await db.query.patients.findFirst({
      where: and(
        eq(patients.id, patientId),
        eq(patients.userId, req.user!.id)
      ),
      with: {
        grossesses: {
          where: (grossesses, { eq }) => eq(grossesses.status, 'en_cours'),
          orderBy: (grossesses, { desc }) => [desc(grossesses.createdAt)],
          limit: 1
        }
      }
    })

    if (!patient) {
      return res.status(404).json({ error: 'Patiente non trouvée' })
    }

    // Get user (prescriber) info
    const { users } = await import('../lib/schema.js')
    const prescriber = await db.query.users.findFirst({
      where: eq(users.id, req.user!.id)
    })

    // Calculate terme if grossesse en cours
    let grossesseInfo = ''
    const grossesse = patient.grossesses?.[0]
    if (grossesse) {
      const ddr = new Date(grossesse.ddr)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - ddr.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const semaines = Math.floor(diffDays / 7)
      const jours = diffDays % 7
      const dpa = new Date(ddr)
      dpa.setDate(dpa.getDate() + 280)

      grossesseInfo = `Grossesse en cours: DDR: ${format(ddr, 'dd/MM/yyyy', { locale: fr })} - DPA: ${format(dpa, 'dd/MM/yyyy', { locale: fr })} - Terme: ${semaines} SA + ${jours}j`
    }

    // Build legal header
    const header = `Dr ${prescriber?.firstName || ''} ${prescriber?.lastName || ''}
Sage-femme
N° RPPS: ${prescriber?.rpps || 'Non renseigné'}
N° ADELI: ${prescriber?.adeli || 'Non renseigné'}
${prescriber?.phone || ''}

─────────────────────────────────────────────────────

ORDONNANCE

Patient(e): ${patient.firstName || ''} ${patient.lastName || ''}${patient.maidenName ? ` (née ${patient.maidenName})` : ''}
Date de naissance: ${format(new Date(patient.birthDate), 'dd/MM/yyyy', { locale: fr })}
N° Sécurité Sociale: ${patient.socialSecurityNumber || 'Non renseigné'}
${grossesseInfo ? '\n' + grossesseInfo : ''}

─────────────────────────────────────────────────────

`

    // Build footer
    const footer = `

─────────────────────────────────────────────────────

Fait à Cabinet, le ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}

Signature électronique:
Dr ${prescriber?.firstName || ''} ${prescriber?.lastName || ''}
Sage-femme - N° RPPS: ${prescriber?.rpps || 'Non renseigné'}`

    // Combine all
    const fullContenu = header + contenu + footer

    // Create document
    const [document] = await db.insert(documents).values({
      patientId,
      userId: req.user!.id,
      consultationId: consultationId || null,
      type: 'ordonnance',
      titre: templateNom || 'Ordonnance médicale',
      contenu: fullContenu,
      signe: false
    }).returning()

    res.json({ success: true, ordonnance: document })
  } catch (error) {
    console.error('Generate ordonnance error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/ordonnances/:id/sign - Sign ordonnance
router.post('/:id/sign', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const [signedDoc] = await db
      .update(documents)
      .set({
        signe: true,
        dateSigne: new Date(),
        updatedAt: new Date()
      })
      .where(and(
        eq(documents.id, id),
        eq(documents.userId, req.user!.id)
      ))
      .returning()

    if (!signedDoc) {
      return res.status(404).json({ error: 'Document non trouvé' })
    }

    res.json({ success: true, document: signedDoc })
  } catch (error) {
    console.error('Sign ordonnance error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/ordonnances/:id - Get ordonnance
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const document = await db.query.documents.findFirst({
      where: and(
        eq(documents.id, id),
        eq(documents.userId, req.user!.id)
      ),
      with: {
        patient: true
      }
    })

    if (!document) {
      return res.status(404).json({ error: 'Document non trouvé' })
    }

    res.json({ success: true, document })
  } catch (error) {
    console.error('Get ordonnance error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/ordonnances/:id - Update ordonnance (before signing)
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { contenu, titre } = req.body

    // Check if not already signed
    const existing = await db.query.documents.findFirst({
      where: and(
        eq(documents.id, id),
        eq(documents.userId, req.user!.id)
      )
    })

    if (!existing) {
      return res.status(404).json({ error: 'Document non trouvé' })
    }

    if (existing.signe) {
      return res.status(400).json({ error: 'Impossible de modifier un document déjà signé' })
    }

    const [updated] = await db
      .update(documents)
      .set({
        contenu: contenu || existing.contenu,
        titre: titre || existing.titre,
        updatedAt: new Date()
      })
      .where(eq(documents.id, id))
      .returning()

    res.json({ success: true, document: updated })
  } catch (error) {
    console.error('Update ordonnance error:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
