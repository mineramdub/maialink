import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { CheckCircle2, X, Plus, Activity } from 'lucide-react'

interface FrottisItem {
  dateRealisation: string
  notes: string
}

interface FrottisSuggestionProps {
  prescriptions: string[]
  conclusion: string
  patientId: string
  onFrottisAdded?: () => void
}

export function FrottisSuggestion({ prescriptions, conclusion, patientId, onFrottisAdded }: FrottisSuggestionProps) {
  const [detectedFrottis, setDetectedFrottis] = useState<FrottisItem | null>(null)
  const [added, setAdded] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Mots-clés pour détecter un frottis
  const frottisKeywords = [
    'frottis',
    'frottis cervical',
    'frottis cervico-vaginal',
    'FCV',
    'dépistage col',
    'cytologie cervicale',
    'test HPV',
    'HPV',
    'colposcopie'
  ]

  // Détecter les frottis dans les prescriptions ou la conclusion
  useEffect(() => {
    const fullText = `${prescriptions.join(' ')} ${conclusion}`.toLowerCase()

    // Vérifier si un frottis est mentionné
    const hasFrottis = frottisKeywords.some(keyword =>
      fullText.includes(keyword.toLowerCase())
    )

    if (hasFrottis) {
      // Extraire des informations si possible
      let notes = ''
      if (fullText.includes('hpv')) {
        notes += 'Test HPV associé. '
      }
      if (fullText.includes('colposcopie')) {
        notes += 'Colposcopie programmée. '
      }
      if (fullText.includes('contrôle') || fullText.includes('suivi')) {
        notes += 'Frottis de contrôle. '
      }

      setDetectedFrottis({
        dateRealisation: new Date().toISOString().split('T')[0],
        notes: notes.trim() || 'Frottis prescrit lors de la consultation'
      })
    } else {
      setDetectedFrottis(null)
    }
  }, [prescriptions, conclusion])

  const handleAddFrottis = async () => {
    if (!detectedFrottis) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/frottis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          patientId,
          dateRealisation: detectedFrottis.dateRealisation,
          resultat: 'en_attente',
          notes: detectedFrottis.notes
        }),
      })

      const data = await res.json()
      if (data.success) {
        setAdded(true)
        onFrottisAdded?.()
      } else {
        alert(data.error || 'Erreur lors de l\'ajout du frottis')
      }
    } catch (error) {
      console.error('Error adding frottis:', error)
      alert('Erreur lors de l\'ajout du frottis')
    }
  }

  if (dismissed || !detectedFrottis || added) {
    if (added) {
      return (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-800 font-medium">
                Frottis ajouté au suivi gynéco
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }
    return null
  }

  return (
    <Card className="border-teal-200 bg-teal-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-teal-600" />
              <h3 className="text-sm font-semibold text-teal-900">
                Frottis prescrit détecté
              </h3>
            </div>

            <div className="p-2 bg-white rounded border border-teal-200 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-teal-100 text-teal-800 border-teal-300 text-xs">
                  Frottis cervical
                </Badge>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>📅 Date : {new Date(detectedFrottis.dateRealisation).toLocaleDateString('fr-FR')}</div>
                <div>📝 {detectedFrottis.notes}</div>
                <div className="mt-2 text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  ⏰ Résultat en attente de récupération
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAddFrottis}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter au suivi frottis
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDismissed(true)}
              >
                <X className="h-4 w-4 mr-1" />
                Ignorer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
