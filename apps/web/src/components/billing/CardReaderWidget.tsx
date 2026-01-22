/**
 * Composant pour lire les cartes Vitale et CPS
 * Affiche le statut du lecteur et permet la lecture des cartes
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Stethoscope
} from 'lucide-react'
import { getBillingService } from '../../services/billing'
import type { PatientVitaleData, ProfessionalCPSData, CardReaderStatus } from '../../services/billing'

interface CardReaderWidgetProps {
  onVitaleRead?: (data: PatientVitaleData) => void
  onCPSRead?: (data: ProfessionalCPSData) => void
  autoReadCPS?: boolean // Lire automatiquement la CPS au démarrage
}

export function CardReaderWidget({
  onVitaleRead,
  onCPSRead,
  autoReadCPS = true
}: CardReaderWidgetProps) {
  const [status, setStatus] = useState<CardReaderStatus | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isReadingVitale, setIsReadingVitale] = useState(false)
  const [isReadingCPS, setIsReadingCPS] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vitaleData, setVitaleData] = useState<PatientVitaleData | null>(null)
  const [cpsData, setCPSData] = useState<ProfessionalCPSData | null>(null)

  const billingService = getBillingService()

  useEffect(() => {
    initializeReader()
  }, [])

  const initializeReader = async () => {
    setIsInitializing(true)
    setError(null)

    try {
      await billingService.initialize()
      const readerStatus = await billingService.getCardReaderStatus()
      setStatus(readerStatus)

      // Lecture automatique de la CPS si demandé
      if (autoReadCPS && readerStatus.connected) {
        await handleReadCPS()
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'initialisation du lecteur')
      console.error('Erreur initialisation:', err)
    } finally {
      setIsInitializing(false)
    }
  }

  const handleReadVitale = async () => {
    setIsReadingVitale(true)
    setError(null)

    try {
      const data = await billingService.readVitaleCard()
      setVitaleData(data)
      onVitaleRead?.(data)

      // Mise à jour du statut
      const readerStatus = await billingService.getCardReaderStatus()
      setStatus(readerStatus)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la lecture de la carte Vitale')
      console.error('Erreur lecture Vitale:', err)
    } finally {
      setIsReadingVitale(false)
    }
  }

  const handleReadCPS = async () => {
    setIsReadingCPS(true)
    setError(null)

    try {
      const data = await billingService.readCPSCard()
      setCPSData(data)
      onCPSRead?.(data)

      // Mise à jour du statut
      const readerStatus = await billingService.getCardReaderStatus()
      setStatus(readerStatus)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la lecture de la carte CPS')
      console.error('Erreur lecture CPS:', err)
    } finally {
      setIsReadingCPS(false)
    }
  }

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Lecteur de cartes Vitale / CPS
          {status?.connected && (
            <Badge variant="outline" className="ml-auto">
              <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
              Connecté
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Statut du lecteur */}
        {!status?.connected && !isInitializing && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Lecteur non connecté. Vérifiez que votre lecteur est branché et réessayez.
            </AlertDescription>
          </Alert>
        )}

        {isInitializing && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Initialisation du lecteur...
          </div>
        )}

        {status?.model && (
          <div className="text-xs text-slate-600">
            Modèle : {status.model}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Carte CPS */}
          <div className="space-y-2">
            <Button
              onClick={handleReadCPS}
              disabled={!status?.connected || isReadingCPS}
              className="w-full"
              variant={cpsData ? "outline" : "default"}
            >
              {isReadingCPS ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Lecture...
                </>
              ) : cpsData ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  CPS lue
                </>
              ) : (
                <>
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Lire CPS
                </>
              )}
            </Button>

            {cpsData && (
              <div className="p-2 bg-green-50 rounded text-xs space-y-1">
                <div className="font-medium text-green-900">
                  {cpsData.civilite} {cpsData.prenom} {cpsData.nom}
                </div>
                <div className="text-green-700">{cpsData.profession}</div>
                <div className="text-green-600">N° {cpsData.numeroAM}</div>
              </div>
            )}
          </div>

          {/* Carte Vitale */}
          <div className="space-y-2">
            <Button
              onClick={handleReadVitale}
              disabled={!status?.connected || isReadingVitale}
              className="w-full"
              variant={vitaleData ? "outline" : "default"}
            >
              {isReadingVitale ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Lecture...
                </>
              ) : vitaleData ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Vitale lue
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Lire Vitale
                </>
              )}
            </Button>

            {vitaleData && (
              <div className="p-2 bg-blue-50 rounded text-xs space-y-1">
                <div className="font-medium text-blue-900">
                  {vitaleData.firstName} {vitaleData.lastName}
                </div>
                <div className="text-blue-700">
                  Né(e) le {new Date(vitaleData.birthDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="text-blue-600">
                  NIR: {vitaleData.nir.slice(0, 13)}...
                </div>
                <div className="flex gap-1 mt-1">
                  {vitaleData.amo && (
                    <Badge variant="outline" className="text-xs">AMO</Badge>
                  )}
                  {vitaleData.amc && (
                    <Badge variant="outline" className="text-xs">Mutuelle</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-slate-500 pt-2 border-t">
          💡 Insérez les cartes dans le lecteur avant de cliquer sur les boutons
        </div>
      </CardContent>
    </Card>
  )
}
