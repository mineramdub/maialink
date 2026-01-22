/**
 * Composant pour modifier un template de consultation depuis la consultation elle-même
 * Les modifications se répercutent sur toutes les futures consultations utilisant ce template
 */

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Pencil, Save, RotateCcw, AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface TemplateEditorProps {
  templateId: string | null
  currentMotif: string
  currentExamenClinique: string
  currentConclusion: string
  onSave?: () => void
}

export function TemplateEditor({
  templateId,
  currentMotif,
  currentExamenClinique,
  currentConclusion,
  onSave
}: TemplateEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editedMotif, setEditedMotif] = useState(currentMotif)
  const [editedExamen, setEditedExamen] = useState(currentExamenClinique)
  const [editedConclusion, setEditedConclusion] = useState(currentConclusion)

  const handleOpen = () => {
    setEditedMotif(currentMotif)
    setEditedExamen(currentExamenClinique)
    setEditedConclusion(currentConclusion)
    setSaveSuccess(false)
    setError(null)
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!templateId) {
      setError('Aucun template associé à cette consultation')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultation-templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          templateId,
          name: `Template personnalisé ${templateId}`,
          description: 'Modifié depuis une consultation',
          type: 'prenatale', // TODO: Déduire du templateId
          data: {
            motif: editedMotif,
            examenClinique: editedExamen,
            conclusion: editedConclusion
          }
        })
      })

      const data = await res.json()

      if (data.success) {
        setSaveSuccess(true)
        setTimeout(() => {
          setIsOpen(false)
          onSave?.()
        }, 1500)
      } else {
        setError(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur réseau')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (!templateId) return

    if (!confirm('Êtes-vous sûr de vouloir réinitialiser ce template aux valeurs par défaut ?')) {
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/consultation-templates/${templateId}/reset`,
        {
          method: 'POST',
          credentials: 'include'
        }
      )

      const data = await res.json()

      if (data.success) {
        setSaveSuccess(true)
        setTimeout(() => {
          setIsOpen(false)
          onSave?.()
          window.location.reload() // Recharger pour obtenir les valeurs par défaut
        }, 1500)
      } else {
        setError(data.error || 'Erreur lors de la réinitialisation')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur réseau')
    } finally {
      setIsSaving(false)
    }
  }

  if (!templateId) {
    return null
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="gap-2"
      >
        <Pencil className="h-4 w-4" />
        Modifier le template
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Modifier le template de consultation
              <Badge variant="outline">{templateId}</Badge>
            </DialogTitle>
            <DialogDescription>
              Les modifications apportées à ce template se répercuteront sur toutes les futures consultations utilisant ce modèle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Info importante */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Note :</strong> Cette modification affectera uniquement vos futures consultations.
                Les consultations déjà créées ne seront pas modifiées.
              </AlertDescription>
            </Alert>

            {/* Motif */}
            <div className="space-y-2">
              <Label htmlFor="motif">Motif de consultation</Label>
              <Textarea
                id="motif"
                value={editedMotif}
                onChange={(e) => setEditedMotif(e.target.value)}
                rows={3}
                className="font-medium"
              />
            </div>

            {/* Examen clinique */}
            <div className="space-y-2">
              <Label htmlFor="examen">Examen clinique</Label>
              <Textarea
                id="examen"
                value={editedExamen}
                onChange={(e) => setEditedExamen(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            {/* Conclusion */}
            <div className="space-y-2">
              <Label htmlFor="conclusion">Conclusion</Label>
              <Textarea
                id="conclusion"
                value={editedConclusion}
                onChange={(e) => setEditedConclusion(e.target.value)}
                rows={6}
                className="font-medium"
              />
            </div>

            {/* Messages de succès/erreur */}
            {saveSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  Template enregistré avec succès ! Les prochaines consultations utiliseront cette version.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Annuler
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving || saveSuccess}
            >
              {isSaving ? (
                'Enregistrement...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer le template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
