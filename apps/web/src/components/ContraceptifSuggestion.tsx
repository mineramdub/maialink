import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { CheckCircle2, X, Plus, Shield } from 'lucide-react'

interface ContraceptifItem {
  type: string
  marque?: string
  modele?: string
  datePose: string
  dateExpiration?: string
}

interface ContraceptifSuggestionProps {
  prescriptions: string[]
  patientId: string
  onContraceptifAdded?: () => void
}

export function ContraceptifSuggestion({ prescriptions, patientId, onContraceptifAdded }: ContraceptifSuggestionProps) {
  const [detectedContraceptifs, setDetectedContraceptifs] = useState<ContraceptifItem[]>([])
  const [addedContraceptifs, setAddedContraceptifs] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState(false)

  // Mots-clés pour détecter les contraceptifs
  const contraceptifKeywords = {
    'DIU cuivre': ['DIU cuivre', 'stérilet cuivre', 'TT380', 'UT380', 'Mona Lisa'],
    'DIU hormonal': ['DIU hormonal', 'Mirena', 'Kyleena', 'Jaydess', 'stérilet hormonal'],
    'Implant': ['Nexplanon', 'implant', 'implant contraceptif'],
    'Pilule': ['pilule', 'Leeloo', 'Optimizette', 'Optilova', 'Cerazette', 'Minidril', 'Yaz', 'Jasmine', 'contraception orale'],
    'Patch': ['Evra', 'patch contraceptif'],
    'Anneau vaginal': ['Nuvaring', 'anneau vaginal', 'anneau contraceptif'],
  }

  // Calculer date d'expiration selon le type
  const calculateExpiration = (type: string, datePose: string): string | undefined => {
    const date = new Date(datePose)

    switch (type) {
      case 'DIU cuivre':
        date.setFullYear(date.getFullYear() + 5)
        return date.toISOString().split('T')[0]
      case 'DIU hormonal':
        date.setFullYear(date.getFullYear() + 5)
        return date.toISOString().split('T')[0]
      case 'Implant':
        date.setFullYear(date.getFullYear() + 3)
        return date.toISOString().split('T')[0]
      default:
        return undefined
    }
  }

  // Détecter les contraceptifs dans les prescriptions
  useEffect(() => {
    if (!prescriptions || prescriptions.length === 0) {
      setDetectedContraceptifs([])
      return
    }

    const contraceptifs: ContraceptifItem[] = []
    const fullText = prescriptions.join(' ').toLowerCase()
    const datePose = new Date().toISOString().split('T')[0]

    // Parcourir chaque type de contraceptif
    Object.entries(contraceptifKeywords).forEach(([type, keywords]) => {
      keywords.forEach(keyword => {
        if (fullText.includes(keyword.toLowerCase())) {
          // Trouver la prescription qui contient ce mot-clé
          const matchingPrescription = prescriptions.find(p =>
            p.toLowerCase().includes(keyword.toLowerCase())
          )

          if (matchingPrescription && !contraceptifs.some(c => c.type === type)) {
            const dateExpiration = calculateExpiration(type, datePose)

            contraceptifs.push({
              type,
              marque: keyword.charAt(0).toUpperCase() + keyword.slice(1),
              modele: keyword.includes('Mirena') || keyword.includes('Kyleena') || keyword.includes('Jaydess') ? keyword : undefined,
              datePose,
              dateExpiration
            })
          }
        }
      })
    })

    setDetectedContraceptifs(contraceptifs)
  }, [prescriptions])

  const handleAddContraceptif = async (contraceptif: ContraceptifItem) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/contraceptifs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          patientId,
          type: contraceptif.type,
          marque: contraceptif.marque,
          modele: contraceptif.modele,
          datePose: contraceptif.datePose,
          dateExpiration: contraceptif.dateExpiration,
          notes: 'Ajouté automatiquement depuis la consultation'
        }),
      })

      const data = await res.json()
      if (data.success) {
        setAddedContraceptifs(prev => new Set(prev).add(contraceptif.type))
        onContraceptifAdded?.()
      } else {
        alert(data.error || 'Erreur lors de l\'ajout du contraceptif')
      }
    } catch (error) {
      console.error('Error adding contraceptif:', error)
      alert('Erreur lors de l\'ajout du contraceptif')
    }
  }

  const handleAddAllContraceptifs = async () => {
    for (const contraceptif of detectedContraceptifs) {
      if (!addedContraceptifs.has(contraceptif.type)) {
        await handleAddContraceptif(contraceptif)
      }
    }
  }

  if (dismissed || detectedContraceptifs.length === 0) {
    return null
  }

  const pendingContraceptifs = detectedContraceptifs.filter(c => !addedContraceptifs.has(c.type))

  if (pendingContraceptifs.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800 font-medium">
              Tous les contraceptifs ont été ajoutés au suivi
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-purple-900">
                Contraceptifs prescrits détectés
              </h3>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                {pendingContraceptifs.length}
              </Badge>
            </div>

            <div className="space-y-2 mb-3">
              {pendingContraceptifs.map((contraceptif, index) => (
                <div key={index} className="flex items-start justify-between gap-2 p-2 bg-white rounded border border-purple-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
                        {contraceptif.type}
                      </Badge>
                      {contraceptif.marque && (
                        <span className="text-xs font-medium text-slate-600">
                          {contraceptif.marque}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>📅 Pose : {new Date(contraceptif.datePose).toLocaleDateString('fr-FR')}</div>
                      {contraceptif.dateExpiration && (
                        <div>⏰ Expiration : {new Date(contraceptif.dateExpiration).toLocaleDateString('fr-FR')}</div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddContraceptif(contraceptif)}
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
                onClick={handleAddAllContraceptifs}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tout ajouter au suivi contraceptifs
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
