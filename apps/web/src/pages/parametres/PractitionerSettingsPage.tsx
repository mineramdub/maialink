import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { AlertCircle, CheckCircle2, Building2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'

interface PractitionerSettings {
  cabinetAddress: string
  cabinetPostalCode: string
  cabinetCity: string
  cabinetPhone: string
  cabinetEmail: string
  signatureImageUrl: string
}

export default function PractitionerSettingsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [settings, setSettings] = useState<PractitionerSettings>({
    cabinetAddress: '',
    cabinetPostalCode: '',
    cabinetCity: '',
    cabinetPhone: '',
    cabinetEmail: user?.email || '',
    signatureImageUrl: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/practitioner/settings`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success && data.settings) {
        setSettings({
          cabinetAddress: data.settings.cabinetAddress || '',
          cabinetPostalCode: data.settings.cabinetPostalCode || '',
          cabinetCity: data.settings.cabinetCity || '',
          cabinetPhone: data.settings.cabinetPhone || '',
          cabinetEmail: data.settings.cabinetEmail || user?.email || '',
          signatureImageUrl: data.settings.signatureImageUrl || ''
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setErrorMessage('Erreur lors du chargement des paramètres')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings.cabinetAddress) {
      setErrorMessage('L\'adresse du cabinet est requise')
      return
    }

    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/practitioner/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      })

      const data = await res.json()

      if (data.success) {
        setSuccessMessage('Paramètres enregistrés avec succès !')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrorMessage(data.error || 'Erreur lors de l\'enregistrement')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setErrorMessage('Erreur lors de l\'enregistrement des paramètres')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Paramètres Praticien
        </h1>
        <p className="text-slate-500 mt-1">
          Informations de votre cabinet pour la génération de documents
        </p>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Succès</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations du Cabinet</CardTitle>
          <CardDescription>
            Ces informations apparaîtront sur tous les documents que vous générez
            (ordonnances, certificats, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Identité praticien */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input value={user?.firstName || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={user?.lastName || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>N° RPPS</Label>
              <Input value={user?.rpps || 'Non renseigné'} disabled />
            </div>
            <div className="space-y-2">
              <Label>N° ADELI</Label>
              <Input value={user?.adeli || 'Non renseigné'} disabled />
            </div>
          </div>

          {/* Adresse cabinet */}
          <div className="space-y-2">
            <Label htmlFor="cabinetAddress" className="text-sm font-medium">
              Adresse du cabinet <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cabinetAddress"
              value={settings.cabinetAddress}
              onChange={(e) => setSettings({ ...settings, cabinetAddress: e.target.value })}
              placeholder="Ex: 12 rue de la Santé"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cabinetPostalCode">Code postal</Label>
              <Input
                id="cabinetPostalCode"
                value={settings.cabinetPostalCode}
                onChange={(e) => setSettings({ ...settings, cabinetPostalCode: e.target.value })}
                placeholder="75000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cabinetCity">Ville</Label>
              <Input
                id="cabinetCity"
                value={settings.cabinetCity}
                onChange={(e) => setSettings({ ...settings, cabinetCity: e.target.value })}
                placeholder="Paris"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cabinetPhone">Téléphone du cabinet</Label>
              <Input
                id="cabinetPhone"
                type="tel"
                value={settings.cabinetPhone}
                onChange={(e) => setSettings({ ...settings, cabinetPhone: e.target.value })}
                placeholder="01 XX XX XX XX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cabinetEmail">Email du cabinet</Label>
              <Input
                id="cabinetEmail"
                type="email"
                value={settings.cabinetEmail}
                onChange={(e) => setSettings({ ...settings, cabinetEmail: e.target.value })}
                placeholder="contact@cabinet.fr"
              />
            </div>
          </div>

          {/* Signature (future) */}
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="signatureImageUrl" className="text-sm text-slate-600">
              Signature numérique (à venir)
            </Label>
            <Input
              id="signatureImageUrl"
              value={settings.signatureImageUrl}
              onChange={(e) => setSettings({ ...settings, signatureImageUrl: e.target.value })}
              placeholder="URL de votre signature"
              disabled
            />
            <p className="text-xs text-slate-500">
              La fonctionnalité de signature numérique sera bientôt disponible
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={isSaving || !settings.cabinetAddress} size="lg">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les paramètres'
              )}
            </Button>
            <Button variant="outline" onClick={fetchSettings} disabled={isSaving}>
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Ces informations sont obligatoires pour générer des documents légalement valides.
          Assurez-vous que l'adresse et les coordonnées de votre cabinet sont correctes.
        </AlertDescription>
      </Alert>
    </div>
  )
}
