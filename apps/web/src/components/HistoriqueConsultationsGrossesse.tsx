import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Stethoscope, Calendar, FileText, Activity, TrendingUp, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { calculateSA } from '../lib/utils'
import { useNavigate } from 'react-router-dom'

interface HistoriqueConsultationsGrossesseProps {
  grossesseId: string
  patientId: string
  ddr: string
}

interface Consultation {
  id: string
  date: string
  type: string
  motifConsultation?: string
  contenuConsultation?: string
  examenPhysique?: {
    poids?: number
    ta?: string
    hauteurUterine?: number
    mouvementsFoetaux?: string
    bcf?: number
    bandelette?: string
    toucherVaginal?: string
  }
  examensComplementaires?: string
  diagnosticConclusion?: string
}

export function HistoriqueConsultationsGrossesse({
  grossesseId,
  patientId,
  ddr,
}: HistoriqueConsultationsGrossesseProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchConsultations()
  }, [grossesseId])

  const fetchConsultations = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/consultations?grossesseId=${grossesseId}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success) {
        // Trier par date décroissante (plus récent en premier)
        const sorted = data.consultations.sort(
          (a: Consultation, b: Consultation) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setConsultations(sorted)
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateSAForDate = (consultationDate: string) => {
    if (!ddr) return null
    try {
      const ddrDate = new Date(ddr)
      const consultDate = new Date(consultationDate)
      const diffTime = consultDate.getTime() - ddrDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffDays / 7)
      const days = diffDays % 7
      return { weeks, days }
    } catch {
      return null
    }
  }

  const getExamensInhabituels = (consultation: Consultation) => {
    const inhabituels: string[] = []
    const examen = consultation.examenPhysique

    if (!examen) return inhabituels

    // TA anormale (systolique > 140 ou diastolique > 90)
    if (examen.ta) {
      const taMatch = examen.ta.match(/(\d+)\/(\d+)/)
      if (taMatch) {
        const systolique = parseInt(taMatch[1])
        const diastolique = parseInt(taMatch[2])
        if (systolique > 140 || diastolique > 90) {
          inhabituels.push(`⚠️ TA élevée: ${examen.ta}`)
        }
      }
    }

    // Bandelette anormale
    if (
      examen.bandelette &&
      examen.bandelette.toLowerCase() !== 'normal' &&
      examen.bandelette.toLowerCase() !== 'ras'
    ) {
      inhabituels.push(`⚠️ Bandelette: ${examen.bandelette}`)
    }

    // BCF anormal (< 110 ou > 160)
    if (examen.bcf && (examen.bcf < 110 || examen.bcf > 160)) {
      inhabituels.push(`⚠️ BCF anormal: ${examen.bcf} bpm`)
    }

    // Toucher vaginal anormal
    if (
      examen.toucherVaginal &&
      examen.toucherVaginal.toLowerCase() !== 'normal' &&
      examen.toucherVaginal.toLowerCase() !== 'ras' &&
      examen.toucherVaginal.toLowerCase() !== 'non fait'
    ) {
      inhabituels.push(`⚠️ TV: ${examen.toucherVaginal}`)
    }

    // Mouvements foetaux inquiétants
    if (
      examen.mouvementsFoetaux &&
      (examen.mouvementsFoetaux.toLowerCase().includes('diminu') ||
        examen.mouvementsFoetaux.toLowerCase().includes('absent'))
    ) {
      inhabituels.push(`⚠️ MF: ${examen.mouvementsFoetaux}`)
    }

    return inhabituels
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'suivi_grossesse':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'echographie':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'urgence':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'post_partum':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      suivi_grossesse: 'Suivi Grossesse',
      echographie: 'Échographie',
      urgence: 'Urgence',
      post_partum: 'Post-Partum',
      consultation_sf: 'Consultation SF',
      autre: 'Autre',
    }
    return labels[type] || type
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-slate-500">
          Chargement de l'historique...
        </CardContent>
      </Card>
    )
  }

  if (consultations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique des consultations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Stethoscope className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Aucune consultation enregistrée</p>
            <p className="text-sm text-slate-400 mt-1">
              Les consultations liées à cette grossesse apparaîtront ici
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique des consultations
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            {consultations.length} consultation{consultations.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consultations.map((consultation, index) => {
            const sa = calculateSAForDate(consultation.date)
            const examensInhabituels = getExamensInhabituels(consultation)

            return (
              <div
                key={consultation.id}
                className="border-l-4 border-purple-300 pl-4 py-3 hover:bg-slate-50 rounded-r-lg transition-colors cursor-pointer relative group"
                onClick={() => navigate(`/consultations/${consultation.id}`)}
              >
                {/* Badge numéro de consultation */}
                <div className="absolute -left-[14px] top-3 bg-purple-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                  {consultations.length - index}
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="font-semibold text-slate-900">
                        {format(new Date(consultation.date), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    {sa && (
                      <Badge variant="outline" className="bg-purple-50 border-purple-200">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {sa.weeks} SA {sa.days > 0 && `+ ${sa.days}j`}
                      </Badge>
                    )}
                    <Badge className={`${getTypeColor(consultation.type)} border`}>
                      {getTypeLabel(consultation.type)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/consultations/${consultation.id}`)
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {/* Motif */}
                {consultation.motifConsultation && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-slate-700">Motif: </span>
                    <span className="text-sm text-slate-600">
                      {consultation.motifConsultation}
                    </span>
                  </div>
                )}

                {/* Notes principales */}
                {consultation.contenuConsultation && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-slate-700">Notes: </span>
                    <span className="text-sm text-slate-600">
                      {consultation.contenuConsultation.length > 200
                        ? consultation.contenuConsultation.substring(0, 200) + '...'
                        : consultation.contenuConsultation}
                    </span>
                  </div>
                )}

                {/* Diagnostic/Conclusion */}
                {consultation.diagnosticConclusion && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-slate-700">Conclusion: </span>
                    <span className="text-sm text-slate-600">
                      {consultation.diagnosticConclusion}
                    </span>
                  </div>
                )}

                {/* Examens inhabituels */}
                {examensInhabituels.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-orange-200 bg-orange-50/50 -mx-4 px-4 py-2 rounded-r">
                    <div className="flex items-start gap-2">
                      <Activity className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-orange-900 mb-1">
                          Examens inhabituels :
                        </p>
                        <div className="space-y-1">
                          {examensInhabituels.map((examen, i) => (
                            <p key={i} className="text-xs text-orange-800">
                              {examen}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Examens complémentaires */}
                {consultation.examensComplementaires && (
                  <div className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">Examens complémentaires: </span>
                    {consultation.examensComplementaires}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
