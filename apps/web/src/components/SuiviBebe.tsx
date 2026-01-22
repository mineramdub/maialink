import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Baby, TrendingUp, AlertTriangle, Info } from 'lucide-react'
import { analyzeBabyMeasurements } from '../lib/percentiles'

interface SuiviBebeProps {
  bebeId?: string
  sexe: 'M' | 'F'
  dateNaissance: Date | string
  onMeasurementsChange?: (measurements: BabyMeasurements) => void
  showPreviousMeasurements?: boolean
}

export interface BabyMeasurements {
  poids: number // grammes
  taille: number // cm
  perimetreCranien: number // mm
  date?: Date
}

export function SuiviBebe({
  bebeId,
  sexe,
  dateNaissance,
  onMeasurementsChange,
  showPreviousMeasurements = true
}: SuiviBebeProps) {
  const [measurements, setMeasurements] = useState<BabyMeasurements>({
    poids: 0,
    taille: 0,
    perimetreCranien: 0
  })

  const [previousMeasurements, setPreviousMeasurements] = useState<BabyMeasurements | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Charger les mensurations précédentes si bebeId fourni
  useEffect(() => {
    if (bebeId && showPreviousMeasurements) {
      fetchPreviousMeasurements()
    }
  }, [bebeId])

  // Calculer les percentiles quand les mensurations changent
  useEffect(() => {
    if (measurements.poids > 0 && measurements.taille > 0 && measurements.perimetreCranien > 0) {
      const result = analyzeBabyMeasurements(
        measurements.poids,
        measurements.taille,
        measurements.perimetreCranien,
        dateNaissance,
        sexe
      )
      setAnalysis(result)

      // Notifier le parent si callback fourni
      if (onMeasurementsChange) {
        onMeasurementsChange(measurements)
      }
    } else {
      setAnalysis(null)
    }
  }, [measurements, dateNaissance, sexe])

  const fetchPreviousMeasurements = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bebes/${bebeId}/last-measurements`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success && data.measurements) {
        setPreviousMeasurements(data.measurements)
      }
    } catch (error) {
      console.error('Erreur chargement mensurations précédentes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateMeasurement = (field: keyof BabyMeasurements, value: string) => {
    const numValue = parseFloat(value) || 0
    setMeasurements(prev => ({ ...prev, [field]: numValue }))
  }

  const calculateGrowth = (current: number, previous: number): { value: number; percentage: number } => {
    const diff = current - previous
    const percentage = previous > 0 ? ((diff / previous) * 100) : 0
    return { value: diff, percentage }
  }

  const getStatusBadge = (status: 'normal' | 'surveillance' | 'pathologique') => {
    if (status === 'pathologique') {
      return <Badge variant="destructive" className="text-xs">Pathologique</Badge>
    } else if (status === 'surveillance') {
      return <Badge variant="default" className="bg-orange-500 text-xs">Surveillance</Badge>
    }
    return <Badge variant="default" className="bg-green-500 text-xs">Normal</Badge>
  }

  const formatAge = (months: number): string => {
    if (months < 1) {
      const days = Math.round(months * 30)
      return `${days} jours`
    } else if (months < 12) {
      const m = Math.floor(months)
      const days = Math.round((months - m) * 30)
      return days > 0 ? `${m} mois ${days} jours` : `${m} mois`
    } else {
      const years = Math.floor(months / 12)
      const m = Math.round(months % 12)
      return m > 0 ? `${years} an${years > 1 ? 's' : ''} ${m} mois` : `${years} an${years > 1 ? 's' : ''}`
    }
  }

  return (
    <Card className="border-pink-200 bg-gradient-to-br from-pink-50/30 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-900">
          <Baby className="h-5 w-5" />
          Suivi des mensurations du bébé
          {analysis && (
            <span className="text-sm font-normal text-slate-600 ml-2">
              ({formatAge(analysis.ageMonths)})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mensurations précédentes */}
        {showPreviousMeasurements && previousMeasurements && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Dernières mensurations :</strong>
              <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-xs">
                <div>Poids: {previousMeasurements.poids}g</div>
                <div>Taille: {previousMeasurements.taille}cm</div>
                <div>PC: {previousMeasurements.perimetreCranien}mm</div>
              </div>
              {previousMeasurements.date && (
                <div className="text-xs text-slate-600 mt-1">
                  {new Date(previousMeasurements.date).toLocaleDateString('fr-FR')}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Saisie mensurations */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="poids" className="text-xs font-bold text-slate-700 uppercase">
              Poids (g)
            </Label>
            <Input
              id="poids"
              type="number"
              placeholder="3500"
              value={measurements.poids || ''}
              onChange={(e) => updateMeasurement('poids', e.target.value)}
              className="font-mono"
            />
            {analysis && (
              <div className="text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">P{analysis.poids.percentile}</span>
                  {getStatusBadge(analysis.poids.status)}
                </div>
                {previousMeasurements && previousMeasurements.poids > 0 && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <TrendingUp className="h-3 w-3" />
                    +{calculateGrowth(measurements.poids, previousMeasurements.poids).value}g
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taille" className="text-xs font-bold text-slate-700 uppercase">
              Taille (cm)
            </Label>
            <Input
              id="taille"
              type="number"
              step="0.1"
              placeholder="50"
              value={measurements.taille || ''}
              onChange={(e) => updateMeasurement('taille', e.target.value)}
              className="font-mono"
            />
            {analysis && (
              <div className="text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">P{analysis.taille.percentile}</span>
                  {getStatusBadge(analysis.taille.status)}
                </div>
                {previousMeasurements && previousMeasurements.taille > 0 && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <TrendingUp className="h-3 w-3" />
                    +{calculateGrowth(measurements.taille, previousMeasurements.taille).value.toFixed(1)}cm
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pc" className="text-xs font-bold text-slate-700 uppercase">
              PC (mm)
            </Label>
            <Input
              id="pc"
              type="number"
              placeholder="350"
              value={measurements.perimetreCranien || ''}
              onChange={(e) => updateMeasurement('perimetreCranien', e.target.value)}
              className="font-mono"
            />
            {analysis && (
              <div className="text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">P{analysis.pc.percentile}</span>
                  {getStatusBadge(analysis.pc.status)}
                </div>
                {previousMeasurements && previousMeasurements.perimetreCranien > 0 && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <TrendingUp className="h-3 w-3" />
                    +{calculateGrowth(measurements.perimetreCranien, previousMeasurements.perimetreCranien).value}mm
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Alertes pathologiques */}
        {analysis && analysis.alerts.length > 0 && (
          <Alert variant={analysis.globalStatus === 'pathologique' ? 'destructive' : 'default'}
                 className={analysis.globalStatus === 'surveillance' ? 'bg-orange-50 border-orange-200' : ''}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong className="block mb-1">
                {analysis.globalStatus === 'pathologique' ? '⚠️ Alerte pathologique' : '⚡ Surveillance recommandée'}
              </strong>
              <ul className="list-disc list-inside space-y-1">
                {analysis.alerts.map((alert: string, idx: number) => (
                  <li key={idx} className="text-xs">{alert}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Résumé global */}
        {analysis && analysis.globalStatus === 'normal' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Croissance normale - Toutes les mensurations dans les normes
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
