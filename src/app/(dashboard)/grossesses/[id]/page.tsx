'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Loader2,
  Baby,
  Calendar,
  Activity,
  AlertTriangle,
  Check,
  Clock,
  Plus,
  TrendingUp,
  Stethoscope,
  FileText,
  Heart,
} from 'lucide-react'
import { formatDate, calculateSA } from '@/lib/utils'
import { EXAMENS_PRENATAUX, CONSULTATIONS_MENSUELLES } from '@/lib/pregnancy-utils'

interface Grossesse {
  id: string
  patientId: string
  ddr: string
  dpa: string
  status: string
  grossesseMultiple: boolean
  nombreFoetus: number
  gestite: number
  parite: number
  facteursRisque?: string[]
  notes?: string
  patient: {
    id: string
    firstName: string
    lastName: string
    birthDate: string
  }
  examens: Array<{
    id: string
    type: string
    nom: string
    saPrevue: number
    dateRecommandee?: string
    dateRealisee?: string
    resultat?: string
    normal?: boolean
  }>
  consultations: Array<{
    id: string
    type: string
    date: string
    saTerm?: number
    saJours?: number
    poids?: string
    tensionSystolique?: number
    tensionDiastolique?: number
    hauteurUterine?: number
    bdc?: number
    conclusion?: string
  }>
}

export default function GrossesseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [grossesse, setGrossesse] = useState<Grossesse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGrossesse()
  }, [resolvedParams.id])

  const fetchGrossesse = async () => {
    try {
      const res = await fetch(`/api/grossesses/${resolvedParams.id}`)
      const data = await res.json()

      if (data.success) {
        setGrossesse(data.grossesse)
      } else {
        router.push('/grossesses')
      }
    } catch (error) {
      console.error('Error fetching grossesse:', error)
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

  if (!grossesse) {
    return null
  }

  const sa = calculateSA(grossesse.ddr)
  const progress = Math.min((sa.total / 280) * 100, 100)
  const trimestre = sa.weeks < 14 ? 1 : sa.weeks < 28 ? 2 : 3

  // Timeline des examens
  const examensTimeline = EXAMENS_PRENATAUX.map((examen) => {
    const examenRealise = grossesse.examens.find((e) => e.type === examen.id || e.nom === examen.nom)
    const estEnRetard = !examenRealise && sa.weeks > examen.saMax
    const estAFaire = !examenRealise && sa.weeks >= examen.saMin && sa.weeks <= examen.saMax

    return {
      ...examen,
      realise: !!examenRealise,
      dateRealisee: examenRealise?.dateRealisee,
      resultat: examenRealise?.resultat,
      normal: examenRealise?.normal,
      enRetard: estEnRetard,
      aFaire: estAFaire,
    }
  })

  // Donnees pour les courbes
  const consultationsData = grossesse.consultations
    .filter((c) => c.saTerm)
    .sort((a, b) => (a.saTerm || 0) - (b.saTerm || 0))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/patients/${grossesse.patientId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">
                Suivi de grossesse
              </h1>
              <Badge variant="success">En cours</Badge>
            </div>
            <Link
              href={`/patients/${grossesse.patient.id}`}
              className="text-slate-500 hover:text-slate-700 hover:underline"
            >
              {grossesse.patient.firstName} {grossesse.patient.lastName}
            </Link>
          </div>
        </div>
        <div className="flex gap-2 ml-12 lg:ml-0">
          <Button variant="outline" asChild>
            <Link href={`/consultations/new?patient=${grossesse.patientId}&grossesse=${grossesse.id}&type=prenatale`}>
              <Plus className="h-4 w-4 mr-1" />
              Consultation
            </Link>
          </Button>
        </div>
      </div>

      {/* Progression grossesse */}
      <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                <Baby className="h-10 w-10 text-pink-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-pink-600">
                  {sa.weeks} <span className="text-2xl">SA</span> + {sa.days}j
                </p>
                <p className="text-slate-500">
                  {trimestre}
                  {trimestre === 1 ? 'er' : 'eme'} trimestre
                  {grossesse.grossesseMultiple && ` - ${grossesse.nombreFoetus} foetus`}
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Progression</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" indicatorClassName="bg-pink-500" />
              <div className="flex justify-between items-center mt-3">
                <div className="text-center">
                  <p className="text-xs text-slate-400">DDR</p>
                  <p className="text-sm font-medium">{formatDate(grossesse.ddr)}</p>
                </div>
                <div className="flex-1 h-px bg-slate-200 mx-4" />
                <div className="text-center">
                  <p className="text-xs text-slate-400">Aujourdhui</p>
                  <p className="text-sm font-medium">{sa.weeks} SA + {sa.days}j</p>
                </div>
                <div className="flex-1 h-px bg-slate-200 mx-4" />
                <div className="text-center">
                  <p className="text-xs text-slate-400">DPA</p>
                  <p className="text-sm font-medium">{formatDate(grossesse.dpa)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes examens en retard */}
      {examensTimeline.filter((e) => e.enRetard && e.obligatoire).length > 0 && (
        <div className="space-y-2">
          {examensTimeline
            .filter((e) => e.enRetard && e.obligatoire)
            .map((examen) => (
              <div
                key={examen.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200"
              >
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">{examen.nom} en retard</p>
                  <p className="text-xs text-amber-600">
                    A realiser entre {examen.saMin} et {examen.saMax} SA
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Programmer
                </Button>
              </div>
            ))}
        </div>
      )}

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timeline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="courbes" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Courbes
          </TabsTrigger>
          <TabsTrigger value="examens" className="gap-2">
            <FileText className="h-4 w-4" />
            Examens
          </TabsTrigger>
          <TabsTrigger value="consultations" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Consultations
          </TabsTrigger>
        </TabsList>

        {/* Timeline */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Timeline de la grossesse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Ligne verticale */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />

                <div className="space-y-6">
                  {CONSULTATIONS_MENSUELLES.map((consult, index) => {
                    const isPast = sa.weeks > consult.sa
                    const isCurrent = sa.weeks >= consult.sa - 2 && sa.weeks <= consult.sa + 2
                    const consultRealise = grossesse.consultations.find(
                      (c) => c.saTerm && Math.abs(c.saTerm - consult.sa) <= 2
                    )

                    return (
                      <div key={index} className="relative flex items-start gap-4 pl-12">
                        {/* Point sur la timeline */}
                        <div
                          className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                            consultRealise
                              ? 'bg-green-500 border-green-500'
                              : isCurrent
                              ? 'bg-pink-500 border-pink-500 animate-pulse'
                              : isPast
                              ? 'bg-amber-500 border-amber-500'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {consultRealise && (
                            <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5" />
                          )}
                        </div>

                        <div
                          className={`flex-1 p-4 rounded-lg border ${
                            isCurrent
                              ? 'border-pink-300 bg-pink-50'
                              : consultRealise
                              ? 'border-green-200 bg-green-50'
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{consult.description}</p>
                              <p className="text-sm text-slate-500">{consult.sa} SA</p>
                            </div>
                            {consultRealise ? (
                              <Badge variant="success">Realise</Badge>
                            ) : isCurrent ? (
                              <Button size="sm" asChild>
                                <Link href={`/consultations/new?patient=${grossesse.patientId}&grossesse=${grossesse.id}&type=prenatale`}>
                                  Saisir
                                </Link>
                              </Button>
                            ) : isPast ? (
                              <Badge variant="warning">Non realise</Badge>
                            ) : (
                              <Badge variant="secondary">A venir</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courbes */}
        <TabsContent value="courbes">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Courbe de poids */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evolution du poids</CardTitle>
              </CardHeader>
              <CardContent>
                {consultationsData.length < 2 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <TrendingUp className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-sm text-slate-500">
                      Minimum 2 consultations necessaires pour afficher la courbe
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultationsData.map((c, i) => (
                      <div key={c.id} className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 w-16">{c.saTerm} SA</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(parseFloat(c.poids || '0') / 100) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {c.poids || '-'} kg
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Courbe de tension */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evolution de la tension</CardTitle>
              </CardHeader>
              <CardContent>
                {consultationsData.filter((c) => c.tensionSystolique).length < 2 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Activity className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-sm text-slate-500">
                      Minimum 2 mesures necessaires pour afficher la courbe
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultationsData
                      .filter((c) => c.tensionSystolique)
                      .map((c) => (
                        <div key={c.id} className="flex items-center gap-4">
                          <span className="text-sm text-slate-500 w-16">{c.saTerm} SA</span>
                          <div className="flex-1 flex items-center gap-2">
                            <div
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                (c.tensionSystolique || 0) >= 140
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {c.tensionSystolique}/{c.tensionDiastolique}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hauteur uterine */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hauteur uterine</CardTitle>
              </CardHeader>
              <CardContent>
                {consultationsData.filter((c) => c.hauteurUterine).length < 2 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Baby className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-sm text-slate-500">
                      Minimum 2 mesures necessaires pour afficher la courbe
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultationsData
                      .filter((c) => c.hauteurUterine)
                      .map((c) => (
                        <div key={c.id} className="flex items-center gap-4">
                          <span className="text-sm text-slate-500 w-16">{c.saTerm} SA</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-pink-500 rounded-full"
                              style={{ width: `${((c.hauteurUterine || 0) / 40) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-16 text-right">
                            {c.hauteurUterine} cm
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* BDC */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rythme cardiaque foetal</CardTitle>
              </CardHeader>
              <CardContent>
                {consultationsData.filter((c) => c.bdc).length < 2 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Heart className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-sm text-slate-500">
                      Minimum 2 mesures necessaires pour afficher la courbe
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultationsData
                      .filter((c) => c.bdc)
                      .map((c) => (
                        <div key={c.id} className="flex items-center gap-4">
                          <span className="text-sm text-slate-500 w-16">{c.saTerm} SA</span>
                          <div className="flex-1 flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span
                              className={`font-medium ${
                                (c.bdc || 0) < 110 || (c.bdc || 0) > 160
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {c.bdc} bpm
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Examens */}
        <TabsContent value="examens">
          <Card>
            <CardHeader>
              <CardTitle>Examens prenataux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {examensTimeline.map((examen) => (
                  <div
                    key={examen.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      examen.realise
                        ? 'border-green-200 bg-green-50'
                        : examen.enRetard
                        ? 'border-amber-200 bg-amber-50'
                        : examen.aFaire
                        ? 'border-pink-200 bg-pink-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          examen.realise
                            ? 'bg-green-100'
                            : examen.enRetard
                            ? 'bg-amber-100'
                            : examen.aFaire
                            ? 'bg-pink-100'
                            : 'bg-slate-100'
                        }`}
                      >
                        {examen.realise ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : examen.enRetard ? (
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{examen.nom}</p>
                        <p className="text-sm text-slate-500">
                          {examen.saMin}-{examen.saMax} SA - {examen.description}
                        </p>
                        {examen.dateRealisee && (
                          <p className="text-xs text-green-600 mt-1">
                            Realise le {formatDate(examen.dateRealisee)}
                            {examen.resultat && ` - ${examen.resultat}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {examen.obligatoire && (
                        <Badge variant="secondary">Obligatoire</Badge>
                      )}
                      {!examen.realise && (
                        <Button size="sm" variant="outline">
                          Saisir resultat
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consultations */}
        <TabsContent value="consultations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Consultations prenatales</CardTitle>
              <Button asChild>
                <Link href={`/consultations/new?patient=${grossesse.patientId}&grossesse=${grossesse.id}&type=prenatale`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle consultation
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {grossesse.consultations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Stethoscope className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-sm text-slate-500">
                    Aucune consultation enregistree pour cette grossesse
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {grossesse.consultations.map((consult) => (
                    <Link
                      key={consult.id}
                      href={`/consultations/${consult.id}`}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                          <Stethoscope className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Consultation {consult.saTerm && `${consult.saTerm} SA + ${consult.saJours}j`}
                          </p>
                          <p className="text-sm text-slate-500">{formatDate(consult.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {consult.poids && (
                          <div className="text-right">
                            <p className="text-xs text-slate-400">Poids</p>
                            <p className="font-medium">{consult.poids} kg</p>
                          </div>
                        )}
                        {consult.tensionSystolique && (
                          <div className="text-right">
                            <p className="text-xs text-slate-400">TA</p>
                            <p className="font-medium">
                              {consult.tensionSystolique}/{consult.tensionDiastolique}
                            </p>
                          </div>
                        )}
                        {consult.bdc && (
                          <div className="text-right">
                            <p className="text-xs text-slate-400">BDC</p>
                            <p className="font-medium">{consult.bdc} bpm</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
