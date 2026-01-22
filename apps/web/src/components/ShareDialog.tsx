import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Loader2, Share2, Copy, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  patientName: string
  grossesseId?: string
  grossesses?: Array<{ id: string; ddr: string; dpa: string; status: string }>
  onSuccess?: () => void
}

type ShareType = 'patient' | 'grossesse' | 'documents' | 'synthetic_pdf'

interface ShareResult {
  share: any
  accessCode: string
  shareUrl: string
}

export function ShareDialog({
  open,
  onOpenChange,
  patientId,
  patientName,
  grossesseId,
  grossesses = [],
  onSuccess
}: ShareDialogProps) {
  const [step, setStep] = useState<'config' | 'result'>('config')
  const [isCreating, setIsCreating] = useState(false)
  const [shareResult, setShareResult] = useState<ShareResult | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const [formData, setFormData] = useState({
    shareType: (grossesseId ? 'grossesse' : 'patient') as ShareType,
    selectedGrossesseId: grossesseId || '',
    permissions: {
      read: true,
      write: false,
      download: true,
    },
    recipientName: '',
    recipientEmail: '',
    recipientNote: '',
  })

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setStep('config')
      setShareResult(null)
      setCopiedLink(false)
      setCopiedCode(false)
      setFormData({
        shareType: (grossesseId ? 'grossesse' : 'patient') as ShareType,
        selectedGrossesseId: grossesseId || '',
        permissions: {
          read: true,
          write: false,
          download: true,
        },
        recipientName: '',
        recipientEmail: '',
        recipientNote: '',
      })
    }
  }, [open, grossesseId])

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const payload: any = {
        shareType: formData.shareType,
        patientId,
        permissions: formData.permissions,
        recipientName: formData.recipientName || null,
        recipientEmail: formData.recipientEmail || null,
        recipientNote: formData.recipientNote || null,
      }

      // Add type-specific data
      if (formData.shareType === 'grossesse' && formData.selectedGrossesseId) {
        payload.grossesseId = formData.selectedGrossesseId
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/share/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setShareResult({
          share: data.share,
          accessCode: data.accessCode,
          shareUrl: data.shareUrl,
        })
        setStep('result')
        if (onSuccess) onSuccess()
      } else {
        alert(data.error || 'Erreur lors de la création du partage')
      }
    } catch (error) {
      console.error('Error creating share:', error)
      alert('Erreur lors de la création du partage')
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'link') {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      } else {
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const getFullShareUrl = () => {
    if (!shareResult) return ''
    const baseUrl = window.location.origin
    return `${baseUrl}${shareResult.shareUrl}`
  }

  const formatShareType = (type: ShareType) => {
    switch (type) {
      case 'patient':
        return 'Dossier complet'
      case 'grossesse':
        return 'Grossesse spécifique'
      case 'documents':
        return 'Documents sélectionnés'
      case 'synthetic_pdf':
        return 'PDF de synthèse'
      default:
        return type
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 'config' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Partager le dossier médical
              </DialogTitle>
              <DialogDescription>
                Créez un lien sécurisé pour partager ce dossier avec un professionnel de santé
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Type de partage */}
              <div>
                <Label className="text-base font-medium mb-3 block">Type de partage</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, shareType: 'patient' })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.shareType === 'patient'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium">Dossier complet</div>
                    <div className="text-sm text-slate-600 mt-1">
                      Toutes les grossesses, consultations et documents
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, shareType: 'grossesse' })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.shareType === 'grossesse'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    disabled={grossesses.length === 0}
                  >
                    <div className="font-medium">Grossesse spécifique</div>
                    <div className="text-sm text-slate-600 mt-1">
                      Consultations et examens d'une grossesse
                    </div>
                  </button>
                </div>
              </div>

              {/* Sélection de la grossesse */}
              {formData.shareType === 'grossesse' && grossesses.length > 0 && (
                <div>
                  <Label htmlFor="grossesse">Grossesse à partager *</Label>
                  <select
                    id="grossesse"
                    value={formData.selectedGrossesseId}
                    onChange={(e) =>
                      setFormData({ ...formData, selectedGrossesseId: e.target.value })
                    }
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une grossesse</option>
                    {grossesses.map((g) => (
                      <option key={g.id} value={g.id}>
                        DDR: {new Date(g.ddr).toLocaleDateString('fr-FR')} - DPA:{' '}
                        {new Date(g.dpa).toLocaleDateString('fr-FR')} ({g.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Permissions */}
              <div>
                <Label className="text-base font-medium mb-3 block">Permissions</Label>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="read"
                      checked={formData.permissions.read}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: { ...formData.permissions, read: !!checked },
                        })
                      }
                      disabled
                    />
                    <div className="flex-1">
                      <Label htmlFor="read" className="cursor-pointer font-medium">
                        Lecture (requis)
                      </Label>
                      <p className="text-sm text-slate-600">
                        Le destinataire peut consulter les données partagées
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="write"
                      checked={formData.permissions.write}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: { ...formData.permissions, write: !!checked },
                        })
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="write" className="cursor-pointer font-medium">
                        Écriture
                      </Label>
                      <p className="text-sm text-slate-600">
                        Le destinataire peut modifier les données médicales
                      </p>
                    </div>
                  </div>

                  {formData.permissions.write && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        <strong>Attention :</strong> Le destinataire pourra modifier les données
                        médicales. Toutes les modifications seront tracées dans les journaux
                        d'audit.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="download"
                      checked={formData.permissions.download}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: { ...formData.permissions, download: !!checked },
                        })
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="download" className="cursor-pointer font-medium">
                        Téléchargement
                      </Label>
                      <p className="text-sm text-slate-600">
                        Le destinataire peut télécharger les documents
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations destinataire */}
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Informations destinataire (optionnel)
                </Label>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="recipientName" className="text-sm">
                      Nom du destinataire
                    </Label>
                    <Input
                      id="recipientName"
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientName: e.target.value })
                      }
                      placeholder="Dr. Martin, Sage-femme Sophie..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recipientEmail" className="text-sm">
                      Email du destinataire
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      value={formData.recipientEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientEmail: e.target.value })
                      }
                      placeholder="email@exemple.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recipientNote" className="text-sm">
                      Note interne
                    </Label>
                    <Input
                      id="recipientNote"
                      type="text"
                      value={formData.recipientNote}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientNote: e.target.value })
                      }
                      placeholder="Suivi conjoint pour..."
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Note visible uniquement par vous (pas par le destinataire)
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
                  Annuler
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={
                    isCreating ||
                    (formData.shareType === 'grossesse' && !formData.selectedGrossesseId)
                  }
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Créer le partage
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                Partage créé avec succès
              </DialogTitle>
              <DialogDescription>
                Partagez ces informations avec le destinataire de manière sécurisée
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Résumé du partage */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Patiente :</span>
                  <span className="font-medium">{patientName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Type de partage :</span>
                  <span className="font-medium">{formatShareType(formData.shareType)}</span>
                </div>
                {formData.recipientName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Destinataire :</span>
                    <span className="font-medium">{formData.recipientName}</span>
                  </div>
                )}
              </div>

              {/* Lien de partage */}
              <div>
                <Label className="text-base font-medium mb-2 block">Lien de partage</Label>
                <div className="flex gap-2">
                  <Input
                    value={getFullShareUrl()}
                    readOnly
                    className="font-mono text-sm"
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(getFullShareUrl(), 'link')}
                  >
                    {copiedLink ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Code d'accès */}
              <div>
                <Label className="text-base font-medium mb-2 block">Code d'accès</Label>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 tracking-widest mb-4">
                      {shareResult?.accessCode}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(shareResult?.accessCode || '', 'code')}
                      className="mx-auto"
                    >
                      {copiedCode ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          Code copié
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copier le code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <Alert className="mt-3 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Important :</strong> Ce code ne sera jamais réaffiché. Notez-le ou
                    communiquez-le maintenant au destinataire.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Recommandations de sécurité */}
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Recommandations de sécurité :</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Envoyez le lien et le code par des canaux séparés (ex: email + SMS)</li>
                    <li>Vérifiez l'identité du destinataire avant de partager</li>
                    <li>Révoquez l'accès dès qu'il n'est plus nécessaire</li>
                    <li>
                      Consultez régulièrement les journaux d'accès dans la gestion des partages
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Action finale */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => onOpenChange(false)}>Terminer</Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
