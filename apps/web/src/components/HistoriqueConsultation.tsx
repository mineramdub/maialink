import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { History, TrendingUp, TrendingDown, Minus, Copy } from 'lucide-react'
import { cn } from '../lib/utils'

interface HistoriqueConsultationProps {
  patientId: string
  currentType: string
  currentData: any
  onReprendre: (data: any) => void
}

export function HistoriqueConsultation({
  patientId,
  currentType,
  currentData,
  onReprendre
}: HistoriqueConsultationProps) {
  const [lastConsultation, setLastConsultation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showComparaison, setShowComparaison] = useState(true)

  useEffect(() => {
    if (patientId) {
      fetchLastConsultation()
    }
  }, [patientId, currentType])

  const fetchLastConsultation = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/consultations/patient/${patientId}/last?type=${currentType}`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success && data.lastConsultation) {
        setLastConsultation(data.lastConsultation)
      } else {
        setLastConsultation(null)
      }
    } catch (error) {
      console.error('Error fetching last consultation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReprendre = () => {
    if (lastConsultation) {
      onReprendre({
        motif: lastConsultation.motif,
        duree: lastConsultation.duree,
        // Ne pas reprendre les valeurs numériques, juste les champs texte
        examenClinique: lastConsultation.examenClinique,
        conclusion: lastConsultation.conclusion,
      })
    }
  }

  const calculateEvolution = (current: number | null, previous: number | null): {
    value: number | null
    trend: 'up' | 'down' | 'stable'
    percentage?: number
  } => {
    if (!current || !previous) return { value: null, trend: 'stable' }

    const diff = current - previous
    const percentage = previous !== 0 ? (diff / previous) * 100 : 0

    if (Math.abs(diff) < 0.01) return { value: diff, trend: 'stable', percentage }
    return {
      value: diff,
      trend: diff > 0 ? 'up' : 'down',
      percentage: Math.abs(percentage)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500">Chargement historique...</p>
        </CardContent>
      </Card>
    )
  }

  if (!lastConsultation) {
    return (
      <Card className="border-slate-200 bg-slate-50/30">
        <CardContent className="p-4">
          <p className="text-sm text-slate-500">Aucune consultation précédente trouvée</p>
        </CardContent>
      </Card>
    )
  }

  const daysSince = Math.floor(
    (new Date().getTime() - new Date(lastConsultation.date).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <History className="h-4 w-4 text-blue-600" />
            Dernière consultation
            <Badge variant="outline" className="ml-2">
              {formatDate(lastConsultation.date)} (il y a {daysSince}j)
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowComparaison(!showComparaison)}
            >
              {showComparaison ? 'Masquer' : 'Afficher'} comparaison
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleReprendre}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              Reprendre
            </Button>
          </div>
        </div>
      </CardHeader>

      {showComparaison && (
        <CardContent className="pt-0 space-y-3">
          {/* Comparaison Poids */}
          {lastConsultation.poids && currentData.poids && (
            <ComparaisonItem
              label="Poids"
              previous={lastConsultation.poids}
              current={parseFloat(currentData.poids)}
              unit="kg"
              evolution={calculateEvolution(
                parseFloat(currentData.poids),
                lastConsultation.poids
              )}
            />
          )}

          {/* Comparaison TA */}
          {lastConsultation.tensionSystolique && currentData.tensionSystolique && (
            <ComparaisonItem
              label="TA Systolique"
              previous={lastConsultation.tensionSystolique}
              current={parseInt(currentData.tensionSystolique)}
              unit="mmHg"
              evolution={calculateEvolution(
                parseInt(currentData.tensionSystolique),
                lastConsultation.tensionSystolique
              )}
            />
          )}

          {lastConsultation.tensionDiastolique && currentData.tensionDiastolique && (
            <ComparaisonItem
              label="TA Diastolique"
              previous={lastConsultation.tensionDiastolique}
              current={parseInt(currentData.tensionDiastolique)}
              unit="mmHg"
              evolution={calculateEvolution(
                parseInt(currentData.tensionDiastolique),
                lastConsultation.tensionDiastolique
              )}
            />
          )}

          {/* Comparaison HU (si consultation prénatale) */}
          {currentType === 'prenatale' && lastConsultation.hauteurUterine && currentData.hauteurUterine && (
            <ComparaisonItem
              label="Hauteur utérine"
              previous={lastConsultation.hauteurUterine}
              current={parseFloat(currentData.hauteurUterine)}
              unit="cm"
              evolution={calculateEvolution(
                parseFloat(currentData.hauteurUterine),
                lastConsultation.hauteurUterine
              )}
            />
          )}

          {/* Comparaison BDC (si consultation prénatale) */}
          {currentType === 'prenatale' && lastConsultation.bdc && currentData.bdc && (
            <ComparaisonItem
              label="BDC"
              previous={lastConsultation.bdc}
              current={parseInt(currentData.bdc)}
              unit="bpm"
              evolution={calculateEvolution(
                parseInt(currentData.bdc),
                lastConsultation.bdc
              )}
            />
          )}

          {/* Informations complémentaires */}
          {lastConsultation.motif && (
            <div className="pt-2 border-t border-blue-200">
              <p className="text-xs font-medium text-slate-600 mb-1">Motif précédent :</p>
              <p className="text-sm text-slate-700">{lastConsultation.motif}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

function ComparaisonItem({
  label,
  previous,
  current,
  unit,
  evolution
}: {
  label: string
  previous: number
  current: number
  unit: string
  evolution: { value: number | null; trend: 'up' | 'down' | 'stable'; percentage?: number }
}) {
  const getTrendIcon = () => {
    if (evolution.trend === 'up') return <TrendingUp className="h-4 w-4 text-orange-600" />
    if (evolution.trend === 'down') return <TrendingDown className="h-4 w-4 text-blue-600" />
    return <Minus className="h-4 w-4 text-slate-400" />
  }

  const getTrendColor = () => {
    if (evolution.trend === 'stable') return 'text-slate-600'

    // Pour le poids et HU, une augmentation est généralement normale en grossesse
    if (label.includes('Poids') || label.includes('Hauteur')) {
      return evolution.trend === 'up' ? 'text-green-600' : 'text-blue-600'
    }

    // Pour la TA, on veut qu'elle reste stable ou baisse
    if (label.includes('TA')) {
      return evolution.trend === 'up' ? 'text-orange-600' : 'text-green-600'
    }

    return 'text-slate-600'
  }

  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
          {getTrendIcon()}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">
              {previous} {unit}
            </span>
            <span className="text-slate-300">→</span>
            <span className="text-sm font-semibold text-slate-900">
              {current} {unit}
            </span>
          </div>
        </div>
      </div>

      {evolution.value !== null && evolution.trend !== 'stable' && (
        <div className={cn("text-right", getTrendColor())}>
          <p className="text-sm font-semibold">
            {evolution.value > 0 ? '+' : ''}{evolution.value.toFixed(1)} {unit}
          </p>
          {evolution.percentage !== undefined && (
            <p className="text-xs">
              {evolution.percentage.toFixed(1)}%
            </p>
          )}
        </div>
      )}

      {evolution.trend === 'stable' && (
        <Badge variant="outline" className="text-xs">
          Stable
        </Badge>
      )}
    </div>
  )
}
