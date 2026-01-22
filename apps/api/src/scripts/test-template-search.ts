import { invalidateTemplateCache } from '../lib/template-loader.js'
import { getGynecologyRecommendationsAsync } from '../lib/pregnancy-calendar.js'

async function testSearch() {
  console.log('=== TEST DE RECHERCHE DES TEMPLATES ===\n')

  // Invalider le cache pour forcer le rechargement
  invalidateTemplateCache()

  // Test 1: Mycose
  console.log('1. Test "mycose":')
  const mycoseResult = await getGynecologyRecommendationsAsync('mycose')
  console.log(`   Trouvé: ${mycoseResult.ordonnancesSuggerees.length} template(s)`)
  mycoseResult.ordonnancesSuggerees.forEach(t => {
    console.log(`   - ${t.nom}`)
  })

  console.log('')

  // Test 2: Chlamydia
  console.log('2. Test "chlamydia":')
  const chlamydiaResult = await getGynecologyRecommendationsAsync('chlamydia')
  console.log(`   Trouvé: ${chlamydiaResult.ordonnancesSuggerees.length} template(s)`)
  chlamydiaResult.ordonnancesSuggerees.forEach(t => {
    console.log(`   - ${t.nom}`)
  })

  console.log('')

  // Test 3: Contraception
  console.log('3. Test "contraception":')
  const contraceptionResult = await getGynecologyRecommendationsAsync('contraception')
  console.log(`   Trouvé: ${contraceptionResult.ordonnancesSuggerees.length} template(s)`)
  contraceptionResult.ordonnancesSuggerees.forEach(t => {
    console.log(`   - ${t.nom}`)
  })

  console.log('')

  // Test 4: Cystite
  console.log('4. Test "cystite":')
  const cystiteResult = await getGynecologyRecommendationsAsync('cystite')
  console.log(`   Trouvé: ${cystiteResult.ordonnancesSuggerees.length} template(s)`)
  cystiteResult.ordonnancesSuggerees.forEach(t => {
    console.log(`   - ${t.nom}`)
  })

  console.log('')

  // Test 5: Infection générique
  console.log('5. Test "infection":')
  const infectionResult = await getGynecologyRecommendationsAsync('infection')
  console.log(`   Trouvé: ${infectionResult.ordonnancesSuggerees.length} template(s)`)
  infectionResult.ordonnancesSuggerees.forEach(t => {
    console.log(`   - ${t.nom}`)
  })

  console.log('\n✅ Tests terminés!')
  process.exit(0)
}

testSearch()
