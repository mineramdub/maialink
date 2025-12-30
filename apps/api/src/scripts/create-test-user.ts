import dotenv from 'dotenv'
import { db } from '../lib/db.js'
import { users } from '../lib/schema.js'
import { hashPassword } from '../lib/auth.js'
import { eq } from 'drizzle-orm'

dotenv.config()

async function createTestUser() {
  console.log('🔧 Création d\'un utilisateur de test...\n')

  const testEmail = 'test@maialink.fr'
  const testPassword = 'test123'

  try {
    // Vérifier si l'utilisateur existe déjà
    const existing = await db.query.users.findFirst({
      where: eq(users.email, testEmail)
    })

    if (existing) {
      console.log('ℹ️  L\'utilisateur test existe déjà')
      console.log('📧 Email:', testEmail)
      console.log('🔑 Mot de passe:', testPassword)
      console.log('\n✅ Utilisez ces identifiants pour vous connecter à http://localhost:3000/login')
      return
    }

    // Créer le nouvel utilisateur
    const passwordHash = await hashPassword(testPassword)

    const [newUser] = await db.insert(users).values({
      email: testEmail,
      passwordHash,
      firstName: 'Test',
      lastName: 'User',
      role: 'sage_femme',
      isActive: true,
    }).returning()

    console.log('✅ Utilisateur de test créé avec succès!\n')
    console.log('📧 Email:', testEmail)
    console.log('🔑 Mot de passe:', testPassword)
    console.log('👤 Nom:', newUser.firstName, newUser.lastName)
    console.log('🎭 Rôle:', newUser.role)
    console.log('\n🌐 Connectez-vous sur http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Erreur lors de la création:', error)
    throw error
  }
}

createTestUser()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
