import { db } from '../lib/db.js'
import { ordonnanceTemplates } from '../lib/schema.js'
import { eq } from 'drizzle-orm'

/**
 * Script pour nettoyer les templates d'ordonnances :
 * - Enlever les cases à cocher ☐
 * - Enlever les titres comme "MÉDICAMENT PRESCRIT :", "POSOLOGIE :", etc.
 */

const TITRES_A_ENLEVER = [
  'MÉDICAMENT PRESCRIT :',
  'POSOLOGIE :',
  'QUANTITÉ :',
  'CONSEILS DONNÉS :',
  'SURVEILLANCE :',
  'CONTRE-INDICATIONS VÉRIFIÉES :',
  'AVANTAGES :',
  'EFFETS SECONDAIRES POSSIBLES :',
  'SIGNES D\'ALERTE :',
  'RENOUVELLEMENT :',
  'PROCHAINE CONSULTATION :',
  'EXAMENS COMPLÉMENTAIRES :',
  'BILAN À PRÉVOIR :',
  'TRAITEMENT :',
  'DURÉE :',
  'RECOMMANDATIONS :',
  'À ÉVITER :',
  'CONSIGNES :',
  'MODALITÉS :',
  'INDICATIONS :',
]

function cleanTemplateContent(contenu: string): string {
  if (!contenu) return contenu

  let cleaned = contenu

  // 1. Enlever toutes les cases à cocher ☐
  cleaned = cleaned.replace(/☐\s*/g, '')

  // 2. Enlever les titres en majuscules suivis de :
  TITRES_A_ENLEVER.forEach(titre => {
    // Enlever le titre s'il est sur une ligne seule
    const regex = new RegExp(`^${titre}\\s*$`, 'gm')
    cleaned = cleaned.replace(regex, '')
  })

  // 3. Enlever aussi les titres génériques en majuscules suivis de :
  cleaned = cleaned.replace(/^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ\s]+\s*:\s*$/gm, '')

  // 4. Nettoyer les lignes vides multiples (plus de 2 consécutives)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  // 5. Enlever les espaces en début/fin
  cleaned = cleaned.trim()

  return cleaned
}

async function main() {
  console.log('🧹 Nettoyage des templates d\'ordonnances...\n')

  try {
    // Récupérer tous les templates
    const allTemplates = await db.query.ordonnanceTemplates.findMany()

    console.log(`📊 ${allTemplates.length} templates trouvés\n`)

    let updatedCount = 0

    for (const template of allTemplates) {
      const originalContent = template.contenu
      const cleanedContent = cleanTemplateContent(originalContent)

      // Vérifier s'il y a eu des changements
      if (cleanedContent !== originalContent) {
        // Mettre à jour le template
        await db
          .update(ordonnanceTemplates)
          .set({
            contenu: cleanedContent,
            updatedAt: new Date()
          })
          .where(eq(ordonnanceTemplates.id, template.id))

        updatedCount++
        console.log(`✅ Nettoyé: ${template.nom}`)

        // Afficher un aperçu des changements
        const beforeLines = originalContent.split('\n').length
        const afterLines = cleanedContent.split('\n').length
        const removedCheckboxes = (originalContent.match(/☐/g) || []).length

        console.log(`   → Cases à cocher enlevées: ${removedCheckboxes}`)
        console.log(`   → Lignes: ${beforeLines} → ${afterLines}`)
        console.log('')
      }
    }

    console.log(`\n✨ Terminé ! ${updatedCount} templates mis à jour sur ${allTemplates.length}`)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
