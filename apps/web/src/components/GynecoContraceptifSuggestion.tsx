import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { CheckCircle2, X, Plus, Shield, AlertTriangle, Trash2 } from 'lucide-react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'

interface ContraceptifItem {
  type: string
  marque?: string
  modele?: string
  numeroLot?: string
  datePose: string
  dateExpiration?: string
}

interface ExistingContraceptif {
  id: string
  type: string
  marque?: string
  datePose: string
  dateExpiration?: string
  actif: boolean
}

interface GynecoContraceptifSuggestionProps {
  contraceptionActuelle?: string
  dateDebutContraception?: string
  patientId: string
  onContraceptifAdded?: () => void
  onContraceptifRemoved?: () => void
}

export function GynecoContraceptifSuggestion({
  contraceptionActuelle,
  dateDebutContraception,
  patientId,
  onContraceptifAdded,
  onContraceptifRemoved,
}: GynecoContraceptifSuggestionProps) {
  const [detectedContraceptif, setDetectedContraceptif] = useState<ContraceptifItem | null>(null)
  const [existingContraceptifs, setExistingContraceptifs] = useState<ExistingContraceptif[]>([])
  const [actionTaken, setActionTaken] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showRemovalDialog, setShowRemovalDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [removalData, setRemovalData] = useState({ dateRetrait: new Date().toISOString().split('T')[0], raisonRetrait: '' })
  const [addFormData, setAddFormData] = useState<ContraceptifItem | null>(null)

  // Mapping contraception types to tracking types
  const contraceptifMapping: Record<string, { type: string; duration: number }> = {
    'diu cuivre': { type: 'sterilet_cuivre', duration: 5 },
    'stérilet cuivre': { type: 'sterilet_cuivre', duration: 5 },
    'sterilet cuivre': { type: 'sterilet_cuivre', duration: 5 },
    'tt380': { type: 'sterilet_cuivre', duration: 5 },
    'ut380': { type: 'sterilet_cuivre', duration: 5 },
    'mona lisa': { type: 'sterilet_cuivre', duration: 5 },
    'diu hormonal': { type: 'sterilet_hormonal', duration: 5 },
    'stérilet hormonal': { type: 'sterilet_hormonal', duration: 5 },
    'sterilet hormonal': { type: 'sterilet_hormonal', duration: 5 },
    'mirena': { type: 'sterilet_hormonal', duration: 5 },
    'kyleena': { type: 'sterilet_hormonal', duration: 5 },
    'jaydess': { type: 'sterilet_hormonal', duration: 3 },
    'implant': { type: 'implant', duration: 3 },
    'nexplanon': { type: 'implant', duration: 3 },
  }

  // Fetch existing contraceptifs for this patient
  useEffect(() => {
    const fetchExistingContraceptifs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/contraceptifs?patientId=${patientId}`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (data.success) {
          setExistingContraceptifs(data.contraceptifs.filter((c: ExistingContraceptif) => c.actif))
        }
      } catch (error) {
        console.error('Error fetching existing contraceptifs:', error)
      }
    }

    if (patientId) {
      fetchExistingContraceptifs()
    }
  }, [patientId])

  // Detect contraceptif from consultation data
  useEffect(() => {
    if (!contraceptionActuelle || contraceptionActuelle.trim() === '') {
      // No contraception mentioned - check if we need to suggest removal
      if (existingContraceptifs.length > 0) {
        // Has active contraceptifs but none mentioned - could be removal
        setDetectedContraceptif(null)
      }
      return
    }

    const lowerContraception = contraceptionActuelle.toLowerCase()
    const datePose = dateDebutContraception || new Date().toISOString().split('T')[0]

    // Check if it matches our tracked types
    for (const [keyword, config] of Object.entries(contraceptifMapping)) {
      if (lowerContraception.includes(keyword)) {
        const dateExpiration = new Date(datePose)
        dateExpiration.setFullYear(dateExpiration.getFullYear() + config.duration)

        setDetectedContraceptif({
          type: config.type,
          marque: contraceptionActuelle,
          datePose,
          dateExpiration: dateExpiration.toISOString().split('T')[0],
        })
        return
      }
    }

    // Not a tracked contraceptif type
    setDetectedContraceptif(null)
  }, [contraceptionActuelle, dateDebutContraception, existingContraceptifs])

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
          numeroLot: contraceptif.numeroLot,
          datePose: contraceptif.datePose,
          dateExpiration: contraceptif.dateExpiration,
          notes: 'Ajouté depuis consultation gynécologique',
        }),
      })

      const data = await res.json()
      if (data.success) {
        setActionTaken(true)
        setShowAddDialog(false)
        onContraceptifAdded?.()
      } else {
        alert(data.error || "Erreur lors de l'ajout du contraceptif")
      }
    } catch (error) {
      console.error('Error adding contraceptif:', error)
      alert("Erreur lors de l'ajout du contraceptif")
    }
  }

  const handleRemoveContraceptif = async (contraceptifId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/contraceptifs/${contraceptifId}/retirer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(removalData),
      })

      const data = await res.json()
      if (data.success) {
        setActionTaken(true)
        setShowRemovalDialog(false)
        onContraceptifRemoved?.()
      } else {
        alert(data.error || 'Erreur lors du retrait du contraceptif')
      }
    } catch (error) {
      console.error('Error removing contraceptif:', error)
      alert('Erreur lors du retrait du contraceptif')
    }
  }

  const openAddDialog = () => {
    setAddFormData(detectedContraceptif)
    setShowAddDialog(true)
  }

  const openRemovalDialog = (contraceptif: ExistingContraceptif) => {
    setShowRemovalDialog(true)
  }

  if (dismissed || actionTaken) {
    return null
  }

  // Case 1: Active contraceptif exists but none mentioned in consultation (potential removal)
  if (existingContraceptifs.length > 0 && !detectedContraceptif && (!contraceptionActuelle || contraceptionActuelle.trim() === '')) {
    return (
      <>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-orange-900 mb-2">
                  Contraceptif actif détecté
                </h3>
                <p className="text-xs text-orange-700 mb-3">
                  Cette patiente a un contraceptif actif mais aucune contraception n'est mentionnée dans cette consultation. A-t-il été retiré ?
                </p>
                <div className="space-y-2">
                  {existingContraceptifs.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2 bg-white rounded border border-orange-200">
                      <div>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs mb-1">
                          {c.type.replace('_', ' ')}
                        </Badge>
                        <div className="text-xs text-slate-600">
                          Posé le {new Date(c.datePose).toLocaleDateString('fr-FR')}
                          {c.marque && ` • ${c.marque}`}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRemovalDialog(c)}
                        className="text-orange-700 hover:bg-orange-100"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Retirer
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
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

        {/* Removal Dialog */}
        <Dialog open={showRemovalDialog} onOpenChange={setShowRemovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer le retrait du contraceptif</DialogTitle>
              <DialogDescription>
                Enregistrez la date et la raison du retrait pour le suivi de la patiente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="dateRetrait">Date de retrait *</Label>
                <Input
                  id="dateRetrait"
                  type="date"
                  value={removalData.dateRetrait}
                  onChange={(e) => setRemovalData({ ...removalData, dateRetrait: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="raisonRetrait">Raison du retrait</Label>
                <Select onValueChange={(value) => setRemovalData({ ...removalData, raisonRetrait: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une raison" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fin_efficacite">Fin d'efficacité</SelectItem>
                    <SelectItem value="desir_grossesse">Désir de grossesse</SelectItem>
                    <SelectItem value="effets_secondaires">Effets secondaires</SelectItem>
                    <SelectItem value="changement_methode">Changement de méthode</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {removalData.raisonRetrait === 'autre' && (
                <div className="space-y-2">
                  <Label htmlFor="autreRaison">Précisez</Label>
                  <Textarea
                    id="autreRaison"
                    value={removalData.raisonRetrait}
                    onChange={(e) => setRemovalData({ ...removalData, raisonRetrait: e.target.value })}
                    rows={2}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRemovalDialog(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => handleRemoveContraceptif(existingContraceptifs[0].id)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Confirmer le retrait
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Case 2: New contraceptif detected
  if (detectedContraceptif && !actionTaken) {
    // Check if similar contraceptif already exists
    const alreadyExists = existingContraceptifs.some(
      (c) => c.type === detectedContraceptif.type && c.actif
    )

    if (alreadyExists) {
      return (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-800 font-medium">
                Ce contraceptif est déjà dans le suivi
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-purple-900">
                    Contraceptif détecté dans la consultation
                  </h3>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800">
                    Nouveau
                  </Badge>
                </div>

                <div className="p-3 bg-white rounded border border-purple-200 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
                      {detectedContraceptif.type.replace('_', ' ')}
                    </Badge>
                    {detectedContraceptif.marque && (
                      <span className="text-xs font-medium text-slate-600">
                        {detectedContraceptif.marque}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>📅 Pose : {new Date(detectedContraceptif.datePose).toLocaleDateString('fr-FR')}</div>
                    {detectedContraceptif.dateExpiration && (
                      <div>⏰ Expiration : {new Date(detectedContraceptif.dateExpiration).toLocaleDateString('fr-FR')}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={openAddDialog}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter au suivi contraceptifs
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

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter le contraceptif au suivi</DialogTitle>
              <DialogDescription>
                Complétez les informations pour le suivi et les rappels.
              </DialogDescription>
            </DialogHeader>
            {addFormData && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select
                    value={addFormData.type}
                    onValueChange={(value) => setAddFormData({ ...addFormData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sterilet_cuivre">DIU Cuivre</SelectItem>
                      <SelectItem value="sterilet_hormonal">DIU Hormonal</SelectItem>
                      <SelectItem value="implant">Implant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marque">Marque</Label>
                    <Input
                      id="marque"
                      value={addFormData.marque || ''}
                      onChange={(e) => setAddFormData({ ...addFormData, marque: e.target.value })}
                      placeholder="Ex: Mirena, Nexplanon..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modele">Modèle</Label>
                    <Input
                      id="modele"
                      value={addFormData.modele || ''}
                      onChange={(e) => setAddFormData({ ...addFormData, modele: e.target.value })}
                      placeholder="Ex: 52mg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroLot">Numéro de lot</Label>
                  <Input
                    id="numeroLot"
                    value={addFormData.numeroLot || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, numeroLot: e.target.value })}
                    placeholder="Numéro de lot du dispositif"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="datePose">Date de pose *</Label>
                    <Input
                      id="datePose"
                      type="date"
                      value={addFormData.datePose}
                      onChange={(e) => setAddFormData({ ...addFormData, datePose: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateExpiration">Date d'expiration *</Label>
                    <Input
                      id="dateExpiration"
                      type="date"
                      value={addFormData.dateExpiration || ''}
                      onChange={(e) => setAddFormData({ ...addFormData, dateExpiration: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => addFormData && handleAddContraceptif(addFormData)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter au suivi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return null
}
