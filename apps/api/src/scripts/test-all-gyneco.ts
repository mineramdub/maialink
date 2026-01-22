import { invalidateTemplateCache } from '../lib/template-loader.js'
import { getGynecologyRecommendationsAsync } from '../lib/pregnancy-calendar.js'

async function testAllGyneco() {
  console.log('=== TEST COMPLET DES TEMPLATES GYNÉCO ===\n')

  invalidateTemplateCache()

  const tests = [
    // Infections
    { motif: 'mycose', expected: 'Mycose Vaginale' },
    { motif: 'chlamydia', expected: 'IST - Chlamydia' },
    { motif: 'gonorrhée', expected: 'IST - Gonorrhée' },
    { motif: 'vaginose', expected: 'Vaginose Bactérienne' },
    { motif: 'trichomonase', expected: 'IST - Trichomonase' },
    { motif: 'cystite', expected: 'Infection Urinaire - Cystite' },

    // Contraception
    { motif: 'contraception', expected: '10 templates contraception' },
    { motif: 'pilule', expected: 'Pilule' },
    { motif: 'diu', expected: 'DIU' },

    // Troubles menstruels
    { motif: 'aménorrhée', expected: 'Aménorrhée' },
    { motif: 'ménorragies', expected: 'Ménorragies' },
    { motif: 'règles abondantes', expected: 'Ménorragies' },
    { motif: 'spanioménorrhée', expected: 'Spanioménorrhée' },
    { motif: 'cycles longs', expected: 'Spanioménorrhée' },
    { motif: 'dysménorrhée', expected: 'Douleurs Menstruelles' },
    { motif: 'règles douloureuses', expected: 'Douleurs Menstruelles' },

    // Ménopause
    { motif: 'ménopause', expected: 'Ménopause' },
    { motif: 'bouffées de chaleur', expected: 'Ménopause' },

    // Dépistage
    { motif: 'dépistage ist', expected: 'Dépistage IST' },
    { motif: 'frottis', expected: 'Frottis' },
  ]

  let errors = 0

  for (const test of tests) {
    const result = await getGynecologyRecommendationsAsync(test.motif)
    const found = result.ordonnancesSuggerees.length

    if (found === 0) {
      console.log(`❌ ${test.motif}: AUCUN TEMPLATE!`)
      errors++
    } else {
      const names = result.ordonnancesSuggerees.map(t => t.nom).join(', ')
      const hasExpected = names.toLowerCase().includes(test.expected.toLowerCase()) ||
                         test.expected.includes('templates') && found > 0

      if (hasExpected) {
        console.log(`✅ ${test.motif}: ${found} template(s) - ${names.substring(0, 60)}${names.length > 60 ? '...' : ''}`)
      } else {
        console.log(`⚠️  ${test.motif}: Trouvé "${names}" mais attendait "${test.expected}"`)
        errors++
      }
    }
  }

  console.log(`\n${errors === 0 ? '✅ Tous les tests passent!' : `❌ ${errors} erreur(s) détectée(s)`}`)
  process.exit(errors > 0 ? 1 : 0)
}

testAllGyneco()
