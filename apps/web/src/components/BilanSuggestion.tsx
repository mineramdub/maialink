import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { CheckCircle2, X, Plus, Clock } from 'lucide-react'
import { cn } from '../lib/utils'

interface BilanItem {
  type: string
  description: string
  categorie: 'obstetrique' | 'gyneco'
}

interface BilanSuggestionProps {
  prescriptions: string[]
  patientId: string
  consultationType?: string
  onBilanAdded?: () => void
}

export function BilanSuggestion({ prescriptions, patientId, consultationType, onBilanAdded }: BilanSuggestionProps) {
  const [detectedBilans, setDetectedBilans] = useState<BilanItem[]>([])
  const [addedBilans, setAddedBilans] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState(false)

  // Mots-clés pour détecter les bilans
  const bilanKeywords = {
    biologie: [
      'NFS', 'numération', 'hémogramme', 'plaquettes',
      'glycémie', 'HGPO', 'glucose',
      'TSH', 'hormones thyroïdiennes',
      'créatinine', 'urée', 'ionogramme',
      'bilan hépatique', 'transaminases', 'ASAT', 'ALAT',
      'sérologie', 'toxoplasmose', 'rubéole', 'CMV', 'HIV', 'VIH', 'hépatite',
      'protéinurie', 'ECBU', 'BU',
      'férritine', 'fer sérique',
      'acide urique',
      'βHCG', 'hCG',
      'streptocoque B', 'strepto B',
      'bilan biologique'
    ],
    echographie: [
      'échographie', 'écho', 'doppler', 'échographie pelvienne', 'échographie obstétricale',
      'échographie morphologique', 'échographie de datation', 'T1', 'T2', 'T3'
    ],
    anatomopathologie: [
      'frottis', 'frottis cervical', 'cytologie', 'biopsie', 'HPV', 'colposcopie'
    ],
    radiologie: [
      'radiographie', 'radio', 'IRM', 'scanner', 'mammographie'
    ]
  }

  // Détecter les bilans dans les prescriptions
  useEffect(() => {
    if (!prescriptions || prescriptions.length === 0) {
      setDetectedBilans([])
      return
    }

    const bilans: BilanItem[] = []
    const fullText = prescriptions.join(' ').toLowerCase()

    // Déterminer la catégorie en fonction du type de consultation
    const categorie: 'obstetrique' | 'gyneco' =
      consultationType === 'prenatale' || consultationType === 'postnatale'
        ? 'obstetrique'
        : 'gyneco'

    // Parcourir chaque type de bilan
    Object.entries(bilanKeywords).forEach(([type, keywords]) => {
      keywords.forEach(keyword => {
        if (fullText.includes(keyword.toLowerCase())) {
          // Trouver la prescription qui contient ce mot-clé
          const matchingPrescription = prescriptions.find(p =>
            p.toLowerCase().includes(keyword.toLowerCase())
          )

          if (matchingPrescription && !bilans.some(b => b.description === matchingPrescription)) {
            bilans.push({
              type: type === 'biologie' ? 'Biologie'
                  : type === 'echographie' ? 'Échographie'
                  : type === 'anatomopathologie' ? 'Anatomopathologie'
                  : 'Radiologie',
              description: matchingPrescription,
              categorie
            })
          }
        }
      })
    })

    setDetectedBilans(bilans)
  }, [prescriptions, consultationType])

  const handleAddBilan = async (bilan: BilanItem) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/resultats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          patientId,
          typeExamen: bilan.type,
          description: bilan.description,
          categorie: bilan.categorie,
          dateExamen: new Date().toISOString().split('T')[0],
        }),
      })

      const data = await res.json()
      if (data.success) {
        setAddedBilans(prev => new Set(prev).add(bilan.description))
        onBilanAdded?.()
      } else {
        alert(data.error || 'Erreur lors de l\'ajout du bilan')
      }
    } catch (error) {
      console.error('Error adding bilan:', error)
      alert('Erreur lors de l\'ajout du bilan')
    }
  }

  const handleAddAllBilans = async () => {
    for (const bilan of detectedBilans) {
      if (!addedBilans.has(bilan.description)) {
        await handleAddBilan(bilan)
      }
    }
  }

  if (dismissed || detectedBilans.length === 0) {
    return null
  }

  const pendingBilans = detectedBilans.filter(b => !addedBilans.has(b.description))

  if (pendingBilans.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800 font-medium">
              Tous les bilans ont été ajoutés aux résultats en attente
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-900">
                Bilans prescrits détectés
              </h3>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {pendingBilans.length}
              </Badge>
            </div>

            <div className="space-y-2 mb-3">
              {pendingBilans.map((bilan, index) => (
                <div key={index} className="flex items-start justify-between gap-2 p-2 bg-white rounded border border-blue-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn(
                        "text-xs",
                        bilan.categorie === 'obstetrique'
                          ? "bg-pink-100 text-pink-800 border-pink-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      )}>
                        {bilan.categorie === 'obstetrique' ? 'Obstétrique' : 'Gynéco'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {bilan.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700">{bilan.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddBilan(bilan)}
                    className="h-8 shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAddAllBilans}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tout ajouter aux résultats en attente
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
