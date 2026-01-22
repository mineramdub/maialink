import { db } from '../lib/db.js'
import { ordonnanceTemplates } from '../lib/schema.js'
import { ORDONNANCE_TEMPLATES } from '../lib/ordonnanceTemplates.js'

/**
 * Script de seed pour migrer les templates d'ordonnances existants vers la base de données
 * Cela permet de gérer les templates dynamiquement via l'interface admin
 */

async function seedOrdonnanceTemplates() {
  console.log('🌱 Début du seed des templates d\'ordonnances...')

  try {
    // Mapper les types de consultation vers les types d'ordonnance
    const mapConsultationType = (motif: string): 'medicament' | 'biologie' | 'echographie' | 'autre' => {
      if (motif.includes('biologie') || motif.includes('bilan')) return 'biologie'
      if (motif.includes('echo') || motif.includes('échographie')) return 'echographie'
      if (motif.includes('medicament') || motif.includes('traitement') || motif.includes('contraception')) return 'medicament'
      return 'autre'
    }

    // Mapper les catégories vers les priorités
    const mapPriorite = (tags: string[]): 'urgent' | 'recommande' | 'optionnel' => {
      if (tags.includes('urgent')) return 'urgent'
      if (tags.includes('optionnel')) return 'optionnel'
      return 'recommande'
    }

    // Compter les templates existants
    console.log(`📋 ${ORDONNANCE_TEMPLATES.length} templates à migrer`)

    let inserted = 0
    let errors = 0

    for (const template of ORDONNANCE_TEMPLATES) {
      try {
        await db.insert(ordonnanceTemplates).values({
          // userId null = template système
          userId: null,

          nom: template.nom || template.titre,
          categorie: template.categorie.toLowerCase(),
          type: mapConsultationType(template.motif),
          priorite: mapPriorite(template.tags),

          contenu: template.contenu,
          description: template.description,

          // Metadata
          source: 'HAS/CNGOF', // Par défaut, à adapter selon les sources
          version: '2024.1',
          dateValidite: null, // Pas de date d'expiration par défaut

          isActive: true,
          isSystemTemplate: true, // Templates système non modifiables par défaut
        })

        inserted++
        console.log(`✓ Template migré: ${template.nom}`)
      } catch (error: any) {
        errors++
        console.error(`✗ Erreur pour ${template.nom}:`, error.message)
      }
    }

    console.log('\n📊 Résumé:')
    console.log(`  ✓ Templates migrés: ${inserted}`)
    console.log(`  ✗ Erreurs: ${errors}`)
    console.log('\n✅ Seed terminé!')
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error)
    throw error
  }
}

// Exécuter le seed
seedOrdonnanceTemplates()
  .then(() => {
    console.log('✅ Script terminé avec succès')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script échoué:', error)
    process.exit(1)
  })
