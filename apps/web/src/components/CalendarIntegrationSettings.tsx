import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Badge } from './ui/badge'
import { Calendar, RefreshCw, Check, X, ExternalLink, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

interface CalendarIntegrationStatus {
  connected: boolean
  syncEnabled: boolean
  googleEmail?: string
  lastSyncAt?: string
  syncDirection?: 'import' | 'export' | 'bidirectional'
  doctolibCalendarName?: string
}

export function CalendarIntegrationSettings() {
  const [status, setStatus] = useState<CalendarIntegrationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [calendars, setCalendars] = useState<any[]>([])
  const [selectedCalendar, setSelectedCalendar] = useState<string>('')
  const [settings, setSettings] = useState({
    syncDirection: 'bidirectional' as 'import' | 'export' | 'bidirectional',
    syncFrequency: 15,
    doctolibCalendarName: '',
  })

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendar-integration/status`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success) {
        setStatus(data)
        setSettings({
          syncDirection: data.syncDirection || 'bidirectional',
          syncFrequency: data.syncFrequency || 15,
          doctolibCalendarName: data.doctolibCalendarName || '',
        })

        // Si connecté, charger la liste des calendriers
        if (data.connected) {
          fetchCalendars()
        }
      }
    } catch (error) {
      console.error('Error fetching status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCalendars = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendar-integration/calendars`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success && data.calendars) {
        setCalendars(data.calendars)
      }
    } catch (error) {
      console.error('Error fetching calendars:', error)
    }
  }

  const handleConnect = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendar-integration/auth-url`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success && data.authUrl) {
        // Ouvrir Google OAuth dans une nouvelle fenêtre
        window.location.href = data.authUrl
      }
    } catch (error) {
      console.error('Error getting auth URL:', error)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter Google Calendar ?')) {
      return
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendar-integration/disconnect`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      const data = await res.json()

      if (data.success) {
        fetchStatus()
      }
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }

  const handleSync = async () => {
    try {
      setIsSyncing(true)
      setSyncResult(null)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendar-integration/sync`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
      const data = await res.json()

      if (data.success) {
        setSyncResult(data)
        fetchStatus() // Rafraîchir le statut pour mettre à jour lastSyncAt
      }
    } catch (error) {
      console.error('Error syncing:', error)
      setSyncResult({ success: false, error: String(error) })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleUpdateSettings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendar-integration/settings`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...settings,
            googleCalendarId: selectedCalendar,
          }),
        }
      )
      const data = await res.json()

      if (data.success) {
        fetchStatus()
        alert('Paramètres mis à jour !')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const handleToggleSync = async (enabled: boolean) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calendar-integration/settings`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            syncEnabled: enabled,
          }),
        }
      )
      const data = await res.json()

      if (data.success) {
        fetchStatus()
      }
    } catch (error) {
      console.error('Error toggling sync:', error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Intégration Google Calendar
            </CardTitle>
            <CardDescription className="mt-2">
              Synchronisez vos rendez-vous Doctolib avec MaiaLink via Google Calendar
            </CardDescription>
          </div>
          {status?.connected && (
            <Badge variant={status.syncEnabled ? 'default' : 'secondary'}>
              {status.syncEnabled ? 'Actif' : 'Inactif'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statut de connexion */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {status?.connected ? (
              <>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Connecté</p>
                  <p className="text-xs text-slate-500">{status.googleEmail}</p>
                  {status.lastSyncAt && (
                    <p className="text-xs text-slate-400">
                      Dernière sync : {new Date(status.lastSyncAt).toLocaleString('fr-FR')}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
                  <X className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">Non connecté</p>
                  <p className="text-xs text-slate-500">
                    Connectez votre compte Google pour synchroniser
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {status?.connected ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSync}
                  disabled={isSyncing || !status.syncEnabled}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Synchronisation...' : 'Synchroniser'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  Déconnecter
                </Button>
              </>
            ) : (
              <Button onClick={handleConnect}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Connecter Google
              </Button>
            )}
          </div>
        </div>

        {/* Résultat de la synchronisation */}
        {syncResult && (
          <Alert variant={syncResult.success ? 'default' : 'destructive'}>
            <AlertTitle>
              {syncResult.success ? 'Synchronisation réussie' : 'Erreur de synchronisation'}
            </AlertTitle>
            <AlertDescription>
              {syncResult.success ? (
                <div className="text-sm space-y-1">
                  <p>Importés : {syncResult.importedCount} rendez-vous</p>
                  <p>Exportés : {syncResult.exportedCount} rendez-vous</p>
                  <p>Mis à jour : {syncResult.updatedCount} rendez-vous</p>
                  {syncResult.errors && syncResult.errors.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-orange-600">
                        {syncResult.errors.length} avertissement(s)
                      </summary>
                      <ul className="mt-1 space-y-1">
                        {syncResult.errors.map((err: string, idx: number) => (
                          <li key={idx} className="text-xs text-slate-600">
                            • {err}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              ) : (
                <p className="text-sm">{syncResult.error || 'Une erreur est survenue'}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Configuration (visible uniquement si connecté) */}
        {status?.connected && (
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Activer la synchronisation automatique</Label>
                <p className="text-xs text-slate-500 mt-1">
                  Synchronise automatiquement toutes les {settings.syncFrequency} minutes
                </p>
              </div>
              <Switch
                checked={status.syncEnabled}
                onCheckedChange={handleToggleSync}
              />
            </div>

            <div className="space-y-2">
              <Label>Direction de synchronisation</Label>
              <Select
                value={settings.syncDirection}
                onValueChange={(value: any) =>
                  setSettings({ ...settings, syncDirection: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">
                    Import uniquement (Doctolib → MaiaLink)
                  </SelectItem>
                  <SelectItem value="export">
                    Export uniquement (MaiaLink → Google Calendar)
                  </SelectItem>
                  <SelectItem value="bidirectional">
                    Bidirectionnelle (Import + Export)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {calendars.length > 0 && (
              <div className="space-y-2">
                <Label>Calendrier Google à utiliser</Label>
                <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un calendrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map((cal) => (
                      <SelectItem key={cal.id} value={cal.id}>
                        {cal.summary} {cal.primary && '(Principal)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Nom du calendrier Doctolib (optionnel)</Label>
              <Input
                placeholder="Ex: Doctolib"
                value={settings.doctolibCalendarName}
                onChange={(e) =>
                  setSettings({ ...settings, doctolibCalendarName: e.target.value })
                }
              />
              <p className="text-xs text-slate-500">
                Si vos événements Doctolib sont dans un calendrier Google spécifique, indiquez
                son nom pour les identifier automatiquement
              </p>
            </div>

            <div className="space-y-2">
              <Label>Fréquence de synchronisation (minutes)</Label>
              <Input
                type="number"
                min="5"
                max="60"
                value={settings.syncFrequency}
                onChange={(e) =>
                  setSettings({ ...settings, syncFrequency: parseInt(e.target.value) })
                }
              />
            </div>

            <Button onClick={handleUpdateSettings} className="w-full">
              Enregistrer les paramètres
            </Button>
          </div>
        )}

        {/* Instructions pour Doctolib */}
        {!status?.connected && (
          <Alert>
            <AlertTitle>Comment ça marche ?</AlertTitle>
            <AlertDescription className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1">
                <li>Connectez votre compte Google Calendar</li>
                <li>
                  Assurez-vous que vos rendez-vous Doctolib sont synchronisés avec votre Google
                  Calendar
                </li>
                <li>
                  MaiaLink importera automatiquement vos rendez-vous Doctolib et exportera vos
                  rendez-vous MaiaLink vers Google Calendar
                </li>
              </ol>
              <p className="mt-3 pt-3 border-t text-xs">
                ℹ️ <strong>Note :</strong> La synchronisation Doctolib → Google Calendar doit
                être configurée dans votre compte Doctolib
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
