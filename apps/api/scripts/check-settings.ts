import { db } from '../src/lib/db.js'
import { practitionerSettings, users } from '../src/lib/schema.js'

async function checkSettings() {
  try {
    const allSettings = await db.select().from(practitionerSettings)
    console.log('✅ Paramètres en base:', JSON.stringify(allSettings, null, 2))

    const allUsers = await db.select().from(users)
    console.log('\n✅ Utilisateurs en base:', allUsers.length)
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
  process.exit(0)
}

checkSettings()
