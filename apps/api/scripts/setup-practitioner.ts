import { db } from '../src/lib/db.js'
import { practitionerSettings, users } from '../src/lib/schema.js'
import { eq } from 'drizzle-orm'

async function setupPractitioner() {
  try {
    console.log('🔍 Recherche de l\'utilisateur...')

    // Find the user (assuming there's only one for now)
    const allUsers = await db.select().from(users).limit(1)

    if (allUsers.length === 0) {
      console.error('❌ Aucun utilisateur trouvé dans la base de données')
      process.exit(1)
    }

    const user = allUsers[0]
    console.log(`✅ Utilisateur trouvé: ${user.firstName} ${user.lastName}`)

    // Check if settings already exist
    const existingSettings = await db
      .select()
      .from(practitionerSettings)
      .where(eq(practitionerSettings.userId, user.id))
      .limit(1)

    const settingsData = {
      userId: user.id,
      cabinetAddress: '12 rue de la Santé',
      cabinetPostalCode: '75014',
      cabinetCity: 'Paris',
      cabinetPhone: '01 23 45 67 89',
      cabinetEmail: user.email,
      signatureImageUrl: '',
      updatedAt: new Date()
    }

    if (existingSettings.length > 0) {
      console.log('📝 Mise à jour des paramètres existants...')
      await db
        .update(practitionerSettings)
        .set(settingsData)
        .where(eq(practitionerSettings.userId, user.id))
    } else {
      console.log('✨ Création des paramètres praticien...')
      await db.insert(practitionerSettings).values({
        ...settingsData,
        createdAt: new Date()
      })
    }

    console.log('✅ Paramètres praticien configurés avec succès!')
    console.log('\nParamètres:')
    console.log('  Adresse:', settingsData.cabinetAddress)
    console.log('  Code postal:', settingsData.cabinetPostalCode)
    console.log('  Ville:', settingsData.cabinetCity)
    console.log('  Téléphone:', settingsData.cabinetPhone)
    console.log('  Email:', settingsData.cabinetEmail)
    console.log('\n🎉 Vous pouvez maintenant générer des documents PDF!')

  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

setupPractitioner()
