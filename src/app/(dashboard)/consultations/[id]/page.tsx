'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Loader2,
  Calendar,
  User,
  Stethoscope,
  Activity,
  Baby,
  FileText,
  Printer,
  Edit,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Consultation {
  id: string
  patientId: string
  grossesseId?: string
  type: string
  date: string
  duree?: number
  poids?: string
  taille?: number
  tensionSystolique?: number
  tensionDiastolique?: number
  pouls?: number
  temperature?: string
  saTerm?: number
  saJours?: number
  hauteurUterine?: number
  bdc?: number
  mouvementsFoetaux?: boolean
  presentationFoetale?: string
  motif?: string
  examenClinique?: string
  conclusion?: string
  prescriptions?: string
  proteineUrinaire?: string
  glucoseUrinaire?: string
  patient: {
    id: string
    firstName: string
    lastName: string
  }
  grossesse?: {
    id: string
    ddr: string
    dpa: string
  }
}

const TYPE_LABELS: Record<string, string> = {
  prenatale: 'Consultation prenatale',
  postnatale: 'Consultation postnatale',
  gyneco: 'Consultation gynecologique',
  reeducation: 'Seance de reeducation',
  preparation: 'Preparation a la naissance',
  monitoring: 'Monitoring',
  autre: 'Autre',
}

export default function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConsultation()
  }, [resolvedParams.id])

  const fetchConsultation = async () => {
    try {
      const res = await fetch(`/api/consultations/${resolvedParams.id}`)
      const data = await res.json()

      if (data.success) {
        setConsultation(data.consultation)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching consultation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!consultation) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/patients/${consultation.patientId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {TYPE_LABELS[consultation.type] || consultation.type}
            </h1>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-4 w-4" />
              {formatDate(consultation.date)}
              {consultation.duree && ` - ${consultation.duree} min`}
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-12 sm:ml-0">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Patient info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <User className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <Link
                href={`/patients/${consultation.patient.id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {consultation.patient.firstName} {consultation.patient.lastName}
              </Link>
              {consultation.grossesse && (
                <p className="text-sm text-slate-500">
                  Grossesse en cours - DPA: {formatDate(consultation.grossesse.dpa)}
                </p>
              )}
            </div>
            {consultation.saTerm && (
              <Badge variant="info" className="ml-auto">
                {consultation.saTerm} SA + {consultation.saJours}j
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Constantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Constantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              {consultation.poids && (
                <div>
                  <p className="text-xs text-slate-500">Poids</p>
                  <p className="text-lg font-semibold">{consultation.poids} kg</p>
                </div>
              )}
              {consultation.tensionSystolique && (
                <div>
                  <p className="text-xs text-slate-500">Tension arterielle</p>
                  <p className={`text-lg font-semibold ${
                    consultation.tensionSystolique >= 140 ? 'text-red-600' : ''
                  }`}>
                    {consultation.tensionSystolique}/{consultation.tensionDiastolique} mmHg
                  </p>
                </div>
              )}
              {consultation.pouls && (
                <div>
                  <p className="text-xs text-slate-500">Pouls</p>
                  <p className="text-lg font-semibold">{consultation.pouls} bpm</p>
                </div>
              )}
              {consultation.temperature && (
                <div>
                  <p className="text-xs text-slate-500">Temperature</p>
                  <p className="text-lg font-semibold">{consultation.temperature}C</p>
                </div>
              )}
            </div>

            {(consultation.proteineUrinaire || consultation.glucoseUrinaire) && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-slate-700 mb-2">Bandelette urinaire</p>
                <div className="grid gap-2 grid-cols-2">
                  {consultation.proteineUrinaire && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Proteines</span>
                      <span className={consultation.proteineUrinaire !== 'negatif' ? 'text-amber-600 font-medium' : ''}>
                        {consultation.proteineUrinaire}
                      </span>
                    </div>
                  )}
                  {consultation.glucoseUrinaire && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Glucose</span>
                      <span className={consultation.glucoseUrinaire !== 'negatif' ? 'text-amber-600 font-medium' : ''}>
                        {consultation.glucoseUrinaire}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Obstetrique */}
        {consultation.grossesse && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5 text-pink-500" />
                Examen obstetrical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2">
                {consultation.hauteurUterine && (
                  <div>
                    <p className="text-xs text-slate-500">Hauteur uterine</p>
                    <p className="text-lg font-semibold">{consultation.hauteurUterine} cm</p>
                  </div>
                )}
                {consultation.bdc && (
                  <div>
                    <p className="text-xs text-slate-500">BDC foetal</p>
                    <p className={`text-lg font-semibold ${
                      consultation.bdc < 110 || consultation.bdc > 160 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {consultation.bdc} bpm
                    </p>
                  </div>
                )}
                {consultation.presentationFoetale && (
                  <div>
                    <p className="text-xs text-slate-500">Presentation</p>
                    <p className="text-lg font-semibold capitalize">{consultation.presentationFoetale}</p>
                  </div>
                )}
                {consultation.mouvementsFoetaux !== undefined && (
                  <div>
                    <p className="text-xs text-slate-500">Mouvements foetaux</p>
                    <p className="text-lg font-semibold">
                      {consultation.mouvementsFoetaux ? 'Presents' : 'Non percus'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Examen clinique */}
      {(consultation.motif || consultation.examenClinique) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-slate-500" />
              Examen clinique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultation.motif && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Motif</p>
                <p className="text-slate-600">{consultation.motif}</p>
              </div>
            )}
            {consultation.examenClinique && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Examen</p>
                <p className="text-slate-600 whitespace-pre-wrap">{consultation.examenClinique}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conclusion et prescriptions */}
      {(consultation.conclusion || consultation.prescriptions) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              Conclusion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultation.conclusion && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Conclusion</p>
                <p className="text-slate-600 whitespace-pre-wrap">{consultation.conclusion}</p>
              </div>
            )}
            {consultation.prescriptions && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Prescriptions</p>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-slate-700 whitespace-pre-wrap">{consultation.prescriptions}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/patients/${consultation.patientId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour au dossier
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/facturation/new?patient=${consultation.patientId}&consultation=${consultation.id}`}>
            Facturer cette consultation
          </Link>
        </Button>
      </div>
    </div>
  )
}
