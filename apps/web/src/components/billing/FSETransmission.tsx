/**
 * Composant pour la télétransmission FSE (Feuille de Soins Électronique)
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react'
import { getBillingService } from '../../services/billing'
import type { FSEData, BillingResult, PatientVitaleData, ProfessionalCPSData } from '../../services/billing'

interface FSETransmissionProps {
  patientData: PatientVitaleData | null
  professionalData: ProfessionalCPSData | null
  actes: Array<{
    code: string
    libelle: string
    montant: number
    quantite: number
  }>
  onTransmissionSuccess?: (result: BillingResult) => void
}

export function FSETransmission({
  patientData,
  professionalData,
  actes,
  onTransmissionSuccess
}: FSETransmissionProps) {
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [result, setResult] = useState<BillingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const billingService = getBillingService()

  const canTransmit = patientData && professionalData && actes.length > 0

  const montantTotal = actes.reduce((sum, acte) => sum + (acte.montant * acte.quantite), 0)

  const handleTransmit = async () => {
    if (!canTransmit) return

    setIsTransmitting(true)
    setError(null)
    setResult(null)

    try {
      const fseData: FSEData = {
        patient: patientData!,
        professional: professionalData!,
        date: new Date().toISOString(),
        actes: actes.map(acte => ({
          code: acte.code,
          libelle: acte.libelle,
          montant: acte.montant,
          quantite: acte.quantite
        })),
        montantTotal,
        partAMO: montantTotal * 0.7, // 70% remboursé par défaut
        partAMC: montantTotal * 0.15, // 15% mutuelle
        partPatient: montantTotal * 0.15, // 15% reste à charge
        parcoursCoordonne: true,
        horsParcoursCoordonne: false,
        accidentTravail: false
      }

      const transmissionResult = await billingService.sendFSE(fseData)
      setResult(transmissionResult)

      if (transmissionResult.success) {
        onTransmissionSuccess?.(transmissionResult)
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la télétransmission')
      console.error('Erreur télétransmission:', err)
    } finally {
      setIsTransmitting(false)
    }
  }

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Send className="h-5 w-5 text-green-600" />
          Télétransmission FSE
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Vérifications avant transmission */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {patientData ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-600" />
            )}
            <span className={patientData ? 'text-slate-700' : 'text-orange-700'}>
              Carte Vitale patient
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {professionalData ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-600" />
            )}
            <span className={professionalData ? 'text-slate-700' : 'text-orange-700'}>
              Carte CPS professionnelle
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {actes.length > 0 ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-600" />
            )}
            <span className={actes.length > 0 ? 'text-slate-700' : 'text-orange-700'}>
              {actes.length} acte(s) à facturer
            </span>
          </div>
        </div>

        {/* Récapitulatif montants */}
        {actes.length > 0 && (
          <div className="p-3 bg-slate-50 rounded space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Total actes :</span>
              <span className="font-medium">{montantTotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Part AMO (70%) :</span>
              <span className="text-slate-700">{(montantTotal * 0.7).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Part mutuelle (15%) :</span>
              <span className="text-slate-700">{(montantTotal * 0.15).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Reste à charge (15%) :</span>
              <span className="text-slate-700">{(montantTotal * 0.15).toFixed(2)} €</span>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de télétransmission</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Résultat de transmission */}
        {result?.success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">Télétransmission réussie !</AlertTitle>
            <AlertDescription className="text-green-700 space-y-1 mt-2">
              <div>N° FSE : <strong>{result.fseNumber}</strong></div>
              <div>N° Transmission : <strong>{result.transmissionId}</strong></div>
              {result.details && (
                <>
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <div>Montant remboursé : <strong>{result.details.montantRembourse.toFixed(2)} €</strong></div>
                    <div>Reste patient : <strong>{result.details.montantPatient.toFixed(2)} €</strong></div>
                    {result.details.dateRemboursement && (
                      <div className="text-xs mt-1">
                        Remboursement estimé : {new Date(result.details.dateRemboursement).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Info mode démo */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Mode démonstration actif.</strong> Les télétransmissions sont simulées.
            Pour activer la télétransmission réelle, configurez votre fournisseur d'API (Inzee, Jérôme, etc.) dans les paramètres.
          </AlertDescription>
        </Alert>

        {/* Bouton transmission */}
        <Button
          onClick={handleTransmit}
          disabled={!canTransmit || isTransmitting}
          className="w-full"
          size="lg"
        >
          {isTransmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Télétransmission en cours...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Télétransmettre à l'Assurance Maladie
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
