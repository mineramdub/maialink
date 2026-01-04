import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { FileText, Plus, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SuggestionsOrdonnancesProps {
  patientId: string
  grossesseId?: string
  type: string
  motif: string
  examenClinique: string
  conclusion: string
  saTerm?: string
  tensionSystolique?: string
  tensionDiastolique?: string
}

interface OrdonnanceSuggestion {
  nom: string
  type: 'biologie' | 'echographie' | 'medicament' | 'autre'
  priorite: 'urgent' | 'recommande' | 'optionnel'
  description: string
  raison: string
  templateNom?: string
}

export function SuggestionsOrdonnances({
  patientId,
  grossesseId,
  type,
  motif,
  examenClinique,
  conclusion,
  saTerm,
  tensionSystolique,
  tensionDiastolique
}: SuggestionsOrdonnancesProps) {
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState<OrdonnanceSuggestion[]>([])

  useEffect(() => {
    const newSuggestions: OrdonnanceSuggestion[] = []

    // Texte combiné pour l'analyse
    const texteComplet = `${motif} ${examenClinique} ${conclusion}`.toLowerCase()

    // ========== DÉTECTION GYNÉCO ==========

    // Mycose
    if (
      texteComplet.includes('mycose') ||
      texteComplet.includes('candidose') ||
      (texteComplet.includes('leucorrhées') && (texteComplet.includes('blanches') || texteComplet.includes('épaisses')))
    ) {
      newSuggestions.push({
        nom: 'Traitement mycose vulvo-vaginale',
        type: 'medicament',
        priorite: 'urgent',
        description: 'Econazole ou Miconazole ovules + crème',
        raison: 'Mycose diagnostiquée',
        templateNom: 'Mycose vulvo-vaginale'
      })
    }

    // Vaginose
    if (
      texteComplet.includes('vaginose') ||
      (texteComplet.includes('leucorrhées') && texteComplet.includes('malodorantes'))
    ) {
      newSuggestions.push({
        nom: 'Traitement vaginose bactérienne',
        type: 'medicament',
        priorite: 'urgent',
        description: 'Métronidazole 500mg x2/j pendant 7 jours',
        raison: 'Vaginose bactérienne diagnostiquée',
        templateNom: 'Vaginose bactérienne'
      })
    }

    // IST / Chlamydia
    if (
      texteComplet.includes('chlamydia') ||
      texteComplet.includes('ist') ||
      texteComplet.includes('infection sexuellement')
    ) {
      newSuggestions.push({
        nom: 'Dépistage IST complet',
        type: 'biologie',
        priorite: 'urgent',
        description: 'PCR Chlamydia, Mycoplasme, Gonocoque + sérologies VIH, VHB, VHC, Syphilis',
        raison: 'Suspicion IST',
        templateNom: 'Dépistage IST'
      })
    }

    // HTA
    const tas = tensionSystolique ? parseInt(tensionSystolique) : null
    const tad = tensionDiastolique ? parseInt(tensionDiastolique) : null

    if (
      (tas && (tas >= 140)) ||
      (tad && (tad >= 90)) ||
      texteComplet.includes('hta') ||
      texteComplet.includes('hypertension')
    ) {
      newSuggestions.push({
        nom: 'Bilan HTA gravidique / Pré-éclampsie',
        type: 'biologie',
        priorite: 'urgent',
        description: 'Protéinurie 24h, NFS plaquettes, bilan hépatique, créatinine, acide urique',
        raison: 'HTA détectée ou suspectée',
        templateNom: 'Bilan HTA gravidique'
      })
    }

    // Diabète gestationnel
    const sa = saTerm ? parseInt(saTerm) : null
    if (
      (type === 'prenatale' && sa && sa >= 24 && sa <= 28) ||
      texteComplet.includes('diabète') ||
      texteComplet.includes('hgpo') ||
      texteComplet.includes('glycémie')
    ) {
      if (!texteComplet.includes('hgpo réalisée') && !texteComplet.includes('hgpo fait')) {
        newSuggestions.push({
          nom: 'Test diabète gestationnel (HGPO)',
          type: 'biologie',
          priorite: 'recommande',
          description: 'HGPO 75g - Dépistage diabète gestationnel',
          raison: sa ? `Terme optimal pour dépistage (${sa} SA)` : 'Dépistage diabète gestationnel',
          templateNom: 'HGPO - Test diabète gestationnel'
        })
      }
    }

    // RCIU / HU insuffisante
    if (
      texteComplet.includes('rciu') ||
      texteComplet.includes('retard de croissance') ||
      texteComplet.includes('hu insuffisante') ||
      texteComplet.includes('hu < ')
    ) {
      newSuggestions.push({
        nom: 'Échographie + Doppler (RCIU)',
        type: 'echographie',
        priorite: 'urgent',
        description: 'Échographie biométrie + Doppler ombilical, utérins',
        raison: 'Suspicion RCIU',
        templateNom: 'Échographie Doppler RCIU'
      })
    }

    // Macrosomie / HU excessive
    if (
      texteComplet.includes('macrosomie') ||
      texteComplet.includes('hu excessive') ||
      texteComplet.includes('hu > ')
    ) {
      newSuggestions.push({
        nom: 'Échographie biométrie + Glycémie',
        type: 'echographie',
        priorite: 'recommande',
        description: 'Échographie biométrie fœtale + bilan diabète',
        raison: 'HU excessive, suspicion macrosomie',
        templateNom: 'Échographie biométrie'
      })
    }

    // Toxoplasmose
    if (
      texteComplet.includes('toxoplasmose') ||
      (type === 'prenatale' && texteComplet.includes('toxo'))
    ) {
      newSuggestions.push({
        nom: 'Sérologie Toxoplasmose',
        type: 'biologie',
        priorite: 'recommande',
        description: 'Sérologie toxoplasmose (si non immune)',
        raison: 'Surveillance sérologique grossesse',
        templateNom: 'Sérologie Toxoplasmose'
      })
    }

    // Anémie
    if (
      texteComplet.includes('anémie') ||
      texteComplet.includes('fatigue') ||
      texteComplet.includes('pâleur') ||
      texteComplet.includes('fer')
    ) {
      if (!texteComplet.includes('fer prescrit')) {
        newSuggestions.push({
          nom: 'Bilan martial + Supplémentation fer',
          type: 'biologie',
          priorite: 'recommande',
          description: 'NFS, ferritine + prescription fer si carence',
          raison: 'Suspicion anémie ou fatigue',
          templateNom: 'Bilan martial'
        })
      }
    }

    // IVG
    if (type === 'ivg') {
      if (texteComplet.includes('médicamenteuse')) {
        newSuggestions.push({
          nom: 'Ordonnance IVG médicamenteuse',
          type: 'medicament',
          priorite: 'urgent',
          description: 'Mifépristone + Misoprostol + antalgiques + contraception',
          raison: 'IVG médicamenteuse programmée',
          templateNom: 'IVG Médicamenteuse - Protocole complet'
        })
      }

      if (texteComplet.includes('chirurgicale') || texteComplet.includes('aspiration')) {
        newSuggestions.push({
          nom: 'Ordonnance IVG chirurgicale',
          type: 'medicament',
          priorite: 'urgent',
          description: 'Préparation col + antalgiques post-op + contraception',
          raison: 'IVG chirurgicale programmée',
          templateNom: 'IVG Chirurgicale - Préparation et suites'
        })
      }
    }

    // Rééducation périnéale
    if (
      (type === 'postnatale' || type === 'reeducation') &&
      (texteComplet.includes('fuites') ||
        texteComplet.includes('incontinence') ||
        texteComplet.includes('périnée') ||
        texteComplet.includes('rééducation'))
    ) {
      if (!texteComplet.includes('rééducation prescrite')) {
        newSuggestions.push({
          nom: 'Ordonnance kinésithérapie - Rééducation périnéale',
          type: 'autre',
          priorite: 'recommande',
          description: '10 séances de rééducation périnéale',
          raison: 'Post-partum ou troubles périnéaux',
          templateNom: 'Kinésithérapie - Rééducation périnéale post-partum'
        })
      }
    }

    // Diastasis
    if (
      texteComplet.includes('diastasis') ||
      (type === 'postnatale' && texteComplet.includes('abdominale'))
    ) {
      newSuggestions.push({
        nom: 'Ordonnance kinésithérapie - Rééducation abdominale',
        type: 'autre',
        priorite: 'optionnel',
        description: '10 séances de rééducation abdominale (après rééducation périnéale)',
        raison: 'Diastasis ou hypotonie abdominale',
        templateNom: 'Kinésithérapie - Rééducation abdominale post-partum'
      })
    }

    // Streptocoque B
    if (type === 'prenatale' && sa && sa >= 35 && sa <= 37) {
      if (!texteComplet.includes('streptocoque b') && !texteComplet.includes('strep b fait')) {
        newSuggestions.push({
          nom: 'Prélèvement vaginal Streptocoque B',
          type: 'biologie',
          priorite: 'recommande',
          description: 'PV recherche Streptocoque B (35-37 SA)',
          raison: `Terme optimal pour dépistage (${sa} SA)`,
          templateNom: 'Prélèvement vaginal Streptocoque B'
        })
      }
    }

    setSuggestions(newSuggestions)
  }, [motif, examenClinique, conclusion, type, saTerm, tensionSystolique, tensionDiastolique])

  const handleCreateOrdonnance = (suggestion: OrdonnanceSuggestion) => {
    const params = new URLSearchParams({
      patientId,
      ...(grossesseId && { grossesseId }),
      ...(suggestion.templateNom && { template: suggestion.templateNom })
    })

    window.open(`/ordonnances/new?${params.toString()}`, '_blank')
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <Card className="border-indigo-200 bg-indigo-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Ordonnances suggérées automatiquement
          <Badge variant="outline" className="ml-2">
            {suggestions.length}
          </Badge>
        </CardTitle>
        <p className="text-xs text-slate-600 mt-1">
          Détection automatique basée sur le diagnostic et l'examen clinique
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 bg-white rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-slate-900">
                    {suggestion.nom}
                  </h4>
                  <Badge
                    variant={suggestion.priorite === 'urgent' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {suggestion.priorite === 'urgent' ? '🔴 Urgent' :
                     suggestion.priorite === 'recommande' ? '🟡 Recommandé' : '🟢 Optionnel'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type === 'biologie' ? '🧪 Biologie' :
                     suggestion.type === 'echographie' ? '📊 Échographie' :
                     suggestion.type === 'medicament' ? '💊 Médicament' : '📄 Autre'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mb-1">{suggestion.description}</p>
                <p className="text-xs text-indigo-600 italic">→ {suggestion.raison}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCreateOrdonnance(suggestion)}
                className="shrink-0 ml-3"
              >
                <Plus className="h-4 w-4 mr-1" />
                Créer
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
