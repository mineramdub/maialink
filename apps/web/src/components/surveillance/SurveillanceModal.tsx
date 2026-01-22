import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SurveillanceModalProps {
  open: boolean
  onClose: () => void
  patientId: string
  patientName: string
  grossesseId?: string
  existingSurveillance?: any
  onSuccess?: () => void
}

const NIVEAU_OPTIONS = [
  { value: 'normal', label: 'Normal', color: 'green' },
  { value: 'vigilance', label: 'Vigilance', color: 'yellow' },
  { value: 'rapprochee', label: 'Surveillance rapprochée', color: 'red' },
]

const RAISON_OPTIONS = [
  { value: 'hta', label: 'HTA (Hypertension artérielle)' },
  { value: 'diabete', label: 'Diabète gestationnel' },
  { value: 'rciu', label: 'RCIU (Retard de croissance intra-utérin)' },
  { value: 'macrosomie', label: 'Macrosomie fœtale' },
  { value: 'map', label: 'MAP (Menace d\'accouchement prématuré)' },
  { value: 'antecedents', label: 'Antécédents à risque' },
  { value: 'age_maternel', label: 'Âge maternel (<18 ou >40 ans)' },
  { value: 'grossesse_multiple', label: 'Grossesse multiple' },
  { value: 'autre', label: 'Autre raison' },
]

const PARAMETRES_SUGGESTIONS: Record<string, string[]> = {
  hta: ['Tension artérielle', 'Protéinurie', 'Réflexes ostéo-tendineux', 'Signes fonctionnels'],
  diabete: ['Glycémie capillaire', 'HbA1c', 'Poids', 'Échographies de croissance'],
  rciu: ['Doppler fœtal', 'Échographies de croissance', 'ERCF', 'MAF'],
  macrosomie: ['Échographies de croissance', 'Glycémie', 'Estimation du poids fœtal'],
  map: ['Contractions utérines', 'Col utérin', 'Échographie cervicale', 'Repos'],
}

export function SurveillanceModal({
  open,
  onClose,
  patientId,
  patientName,
  grossesseId,
  existingSurveillance,
  onSuccess,
}: SurveillanceModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    niveau: 'vigilance' as 'normal' | 'vigilance' | 'rapprochee',
    raison: 'hta',
    raisonDetail: '',
    dateProchainControle: '',
    frequenceControle: 7,
    notesSurveillance: '',
    parametresSuivre: [] as string[],
  })

  const [customParametre, setCustomParametre] = useState('')

  useEffect(() => {
    if (existingSurveillance) {
      setFormData({
        niveau: existingSurveillance.niveau || 'vigilance',
        raison: existingSurveillance.raison || 'hta',
        raisonDetail: existingSurveillance.raisonDetail || '',
        dateProchainControle: existingSurveillance.dateProchainControle
          ? new Date(existingSurveillance.dateProchainControle).toISOString().split('T')[0]
          : '',
        frequenceControle: existingSurveillance.frequenceControle || 7,
        notesSurveillance: existingSurveillance.notesSurveillance || '',
        parametresSuivre: existingSurveillance.parametresSuivre || [],
      })
    } else {
      // Defaults pour nouvelle surveillance
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      setFormData((prev) => ({
        ...prev,
        dateProchainControle: nextWeek.toISOString().split('T')[0],
      }))
    }
  }, [existingSurveillance, open])

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const url = existingSurveillance
        ? `/api/surveillance/${existingSurveillance.id}`
        : '/api/surveillance'

      const method = existingSurveillance ? 'PATCH' : 'POST'

      const payload = existingSurveillance
        ? formData
        : {
            ...formData,
            patientId,
            grossesseId,
          }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 1000)
      } else {
        setError(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  const handleTerminer = async () => {
    if (!existingSurveillance) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/surveillance/${existingSurveillance.id}/terminer`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 1000)
      } else {
        setError(data.error || 'Erreur')
      }
    } catch (err) {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  const addParametre = (param: string) => {
    if (param && !formData.parametresSuivre.includes(param)) {
      setFormData({
        ...formData,
        parametresSuivre: [...formData.parametresSuivre, param],
      })
    }
  }

  const removeParametre = (param: string) => {
    setFormData({
      ...formData,
      parametresSuivre: formData.parametresSuivre.filter((p) => p !== param),
    })
  }

  const suggestedParams = PARAMETRES_SUGGESTIONS[formData.raison] || []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingSurveillance ? 'Modifier' : 'Ajouter'} la surveillance - {patientName}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-green-700">Surveillance enregistrée avec succès</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Niveau de surveillance */}
          <div>
            <Label>Niveau de surveillance *</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {NIVEAU_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, niveau: option.value as any })}
                  className={cn(
                    'rounded-lg border-2 p-3 text-center transition-all',
                    formData.niveau === option.value
                      ? option.color === 'green'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : option.color === 'yellow'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  )}
                >
                  <div className="text-sm font-semibold">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Raison */}
          <div>
            <Label htmlFor="raison">Raison de la surveillance *</Label>
            <Select
              value={formData.raison}
              onValueChange={(value) => setFormData({ ...formData, raison: value })}
            >
              <SelectTrigger id="raison">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RAISON_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Détails de la raison */}
          <div>
            <Label htmlFor="raisonDetail">Détails (optionnel)</Label>
            <Textarea
              id="raisonDetail"
              value={formData.raisonDetail}
              onChange={(e) => setFormData({ ...formData, raisonDetail: e.target.value })}
              placeholder="Précisions complémentaires..."
              rows={2}
            />
          </div>

          {/* Date prochain contrôle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateProchainControle">Prochain contrôle *</Label>
              <Input
                id="dateProchainControle"
                type="date"
                value={formData.dateProchainControle}
                onChange={(e) =>
                  setFormData({ ...formData, dateProchainControle: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="frequenceControle">Fréquence (jours)</Label>
              <Input
                id="frequenceControle"
                type="number"
                value={formData.frequenceControle}
                onChange={(e) =>
                  setFormData({ ...formData, frequenceControle: parseInt(e.target.value) || 7 })
                }
                min={1}
              />
            </div>
          </div>

          {/* Paramètres à suivre */}
          <div>
            <Label>Paramètres à suivre</Label>
            <div className="space-y-2 mt-2">
              {/* Paramètres suggérés */}
              {suggestedParams.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-2">Suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedParams.map((param) => (
                      <Badge
                        key={param}
                        variant={
                          formData.parametresSuivre.includes(param) ? 'default' : 'outline'
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          formData.parametresSuivre.includes(param)
                            ? removeParametre(param)
                            : addParametre(param)
                        }
                      >
                        {param}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Paramètres sélectionnés */}
              {formData.parametresSuivre.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-2">Paramètres sélectionnés:</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.parametresSuivre.map((param) => (
                      <Badge key={param} variant="secondary" className="gap-1">
                        {param}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-600"
                          onClick={() => removeParametre(param)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Ajouter paramètre personnalisé */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un paramètre personnalisé..."
                  value={customParametre}
                  onChange={(e) => setCustomParametre(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addParametre(customParametre)
                      setCustomParametre('')
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addParametre(customParametre)
                    setCustomParametre('')
                  }}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notesSurveillance">Notes de surveillance</Label>
            <Textarea
              id="notesSurveillance"
              value={formData.notesSurveillance}
              onChange={(e) => setFormData({ ...formData, notesSurveillance: e.target.value })}
              placeholder="Notes, observations, plan de surveillance..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {existingSurveillance && (
            <Button variant="destructive" onClick={handleTerminer} disabled={loading}>
              Terminer la surveillance
            </Button>
          )}
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
