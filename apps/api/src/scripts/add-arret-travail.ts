import { db } from '../lib/db.js'
import { ordonnanceTemplates } from '../lib/schema.js'
import { eq, and } from 'drizzle-orm'

/**
 * Script pour ajouter le template d'arrêt de travail
 */

const ARRET_TRAVAIL_TEMPLATE = {
  nom: 'Arrêt de travail',
  description: 'Certificat d\'arrêt de travail pour grossesse pathologique ou autres motifs',
  categorie: 'Arrêt',
  type: 'autre' as const,
  priorite: 'recommande' as const,
  isSystemTemplate: true,
  isActive: true,
  contenu: `CERTIFICAT MÉDICAL D'ARRÊT DE TRAVAIL

Je soussigné(e), Sage-Femme, certifie avoir examiné ce jour :

Mme [Nom Prénom]
Née le : [Date de naissance]
Adresse : [Adresse complète]

Suite à mon examen, j'estime qu'un arrêt de travail est nécessaire pour :

MOTIF :
Grossesse pathologique
[ou autre motif à préciser]

DURÉE DE L'ARRÊT :
Du [Date début] au [Date fin]
Soit [Nombre] jours

PRÉCISIONS :
Sortie autorisée : OUI / NON
Si sortie autorisée : de [heure] à [heure]

Travail possible : NON

RECOMMANDATIONS :
Repos complet au domicile
Éviter les efforts physiques
Surveillance médicale régulière

Un certificat de prolongation pourra être établi si nécessaire après réévaluation.

Certificat établi à la demande de l'intéressée pour faire valoir ses droits.

Fait à [Ville], le [Date]

Signature et cachet`
}

async function main() {
  console.log('📝 Ajout du template Arrêt de travail...\n')

  try {
    // Vérifier si le template existe déjà
    const existing = await db.query.ordonnanceTemplates.findFirst({
      where: and(
        eq(ordonnanceTemplates.nom, ARRET_TRAVAIL_TEMPLATE.nom),
        eq(ordonnanceTemplates.isSystemTemplate, true)
      )
    })

    if (existing) {
      console.log('⚠️  Template "Arrêt de travail" existe déjà (ID: ' + existing.id + ')')
      console.log('   Mise à jour du contenu...')

      await db
        .update(ordonnanceTemplates)
        .set({
          contenu: ARRET_TRAVAIL_TEMPLATE.contenu,
          description: ARRET_TRAVAIL_TEMPLATE.description,
          updatedAt: new Date()
        })
        .where(eq(ordonnanceTemplates.id, existing.id))

      console.log('✅ Template mis à jour avec succès !')
    } else {
      // Créer le template
      const [created] = await db
        .insert(ordonnanceTemplates)
        .values(ARRET_TRAVAIL_TEMPLATE)
        .returning()

      console.log('✅ Template créé avec succès !')
      console.log('   ID:', created.id)
      console.log('   Nom:', created.nom)
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
