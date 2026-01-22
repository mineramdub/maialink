import { db } from '../lib/db.js'
import { ordonnanceTemplates } from '../lib/schema.js'
import { eq } from 'drizzle-orm'

async function checkTemplates() {
  const templates = await db.query.ordonnanceTemplates.findMany({
    where: eq(ordonnanceTemplates.isActive, true)
  })

  console.log('Templates trouvés:', templates.length)
  console.log('')

  // Grouper par catégorie
  const byCategory: Record<string, any[]> = {}
  templates.forEach(t => {
    if (!byCategory[t.categorie]) {
      byCategory[t.categorie] = []
    }
    byCategory[t.categorie].push(t)
  })

  Object.entries(byCategory).forEach(([categorie, temps]) => {
    console.log(`\n=== ${categorie} (${temps.length} templates) ===`)
    temps.forEach(t => {
      console.log(`  - ${t.nom}`)
    })
  })

  process.exit(0)
}

checkTemplates()
