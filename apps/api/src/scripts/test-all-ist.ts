import { invalidateTemplateCache } from '../lib/template-loader.js'
import { getGynecologyRecommendationsAsync } from '../lib/pregnancy-calendar.js'

async function testAllIST() {
  console.log('=== TEST COMPLET DES TEMPLATES IST/INFECTIONS ===\n')

  invalidateTemplateCache()

  const tests = [
    'mycose',
    'chlamydia',
    'gonorrhée',
    'vaginose',
    'trichomonase',
    'cystite',
    'infection',
    'contraception',
  ]

  for (const motif of tests) {
    const result = await getGynecologyRecommendationsAsync(motif)
    console.log(`${motif.toUpperCase()}:`)
    console.log(`  → ${result.ordonnancesSuggerees.length} template(s)`)
    if (result.ordonnancesSuggerees.length > 0) {
      result.ordonnancesSuggerees.forEach(t => {
        console.log(`     • ${t.nom}`)
      })
    } else {
      console.log('     ⚠️  AUCUN TEMPLATE TROUVÉ!')
    }
    console.log('')
  }

  console.log('✅ Tests terminés!')
  process.exit(0)
}

testAllIST()
