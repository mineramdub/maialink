import { db } from '../src/lib/db.js'
import { practitionerSettings, users } from '../src/lib/schema.js'
import { eq } from 'drizzle-orm'

async function setupRaphaelle() {
  try {
    console.log('🔍 Recherche de Raphaelle Dubrulle...')

    // Find Raphaelle by name
    const allUsers = await db.select().from(users)
    const raphaelle = allUsers.find(u =>
      u.firstName?.toLowerCase() === 'raphaelle' ||
      u.lastName?.toLowerCase() === 'dubrulle' ||
      u.email?.includes('raphaelle')
    )

    if (!raphaelle) {
      console.log('Utilisateurs disponibles:')
      allUsers.forEach(u => console.log(`  - ${u.firstName} ${u.lastName} (${u.email})`))
      console.error('❌ Raphaelle Dubrulle non trouvée')
      process.exit(1)
    }

    console.log(`✅ Utilisateur trouvé: ${raphaelle.firstName} ${raphaelle.lastName} (${raphaelle.email})`)

    // Check if settings already exist
    const existingSettings = await db
      .select()
      .from(practitionerSettings)
      .where(eq(practitionerSettings.userId, raphaelle.id))
      .limit(1)

    const settingsData = {
      userId: raphaelle.id,
      cabinetAddress: '12 rue de la Santé',
      cabinetPostalCode: '75014',
      cabinetCity: 'Paris',
      cabinetPhone: '01 23 45 67 89',
      cabinetEmail: raphaelle.email,
      signatureImageUrl: '',
      updatedAt: new Date()
    }

    if (existingSettings.length > 0) {
      console.log('📝 Mise à jour des paramètres existants...')
      await db
        .update(practitionerSettings)
        .set(settingsData)
        .where(eq(practitionerSettings.userId, raphaelle.id))
    } else {
      console.log('✨ Création des paramètres praticien...')
      await db.insert(practitionerSettings).values({
        ...settingsData,
        createdAt: new Date()
      })
    }

    console.log('✅ Paramètres praticien configurés pour Raphaelle!')
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

setupRaphaelle()
