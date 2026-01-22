'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Loader2,
  Edit,
  Baby,
  Stethoscope,
  FileText,
  Receipt,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Plus,
  ExternalLink,
  Heart,
  Droplet,
  User,
  Clock,
  StickyNote,
  Save,
  Trash2,
} from 'lucide-react'
import { formatDate, calculateAge, calculateSA, calculateDPA, calculateIMC, getIMCCategory } from '@/lib/utils'
import { ResultatLaboModal } from '@/components/patient/ResultatLaboModal'

interface ResultatLabo {
  id: string
  type: string
  nom: string
  dateAnalyse?: string
  dateReception?: string
  resultatManuel?: string
  fichierUrl?: string
  fichierNom?: string
  normal?: boolean
  commentaire?: string
  laboratoire?: string
  createdAt: string
}

interface Patient {
  id: string
  firstName: string
  lastName: string
  maidenName?: string
  birthDate: string
  birthPlace?: string
  socialSecurityNumber?: string
  email?: string
  phone?: string
  mobilePhone?: string
  address?: string
  postalCode?: string
  city?: string
  bloodType?: string
  rhesus?: string
  allergies?: string
  antecedentsMedicaux?: string[]
  antecedentsChirurgicaux?: string[]
  antecedentsFamiliaux?: string[]
  traitementEnCours?: string
  gravida: number
  para: number
  // Gynécologie
  ageMenarche?: number
  dureeCycle?: number
  dureeRegles?: number
  regulariteCycle?: string
  dysmenorrhee?: string
  dyspareunie?: string
  leucorrhees?: string
  contraceptionActuelle?: string
  dateDernierFrottis?: string
  dateDerniereMammographie?: string
  // Obstétrique détaillé
  datesDernieresRegles?: string
  gestesParite?: string
  accouchements?: string
  cesarienne?: boolean
  nombreCesariennes?: number
  fausseCouches?: number
  ivg?: number
  grossesseExtraUterine?: boolean
  mortNe?: boolean
  mutuelle?: string
  numeroMutuelle?: string
  medecinTraitant?: string
  personneConfiance?: string
  telephoneConfiance?: string
  notes?: string
  notesNextConsultation?: string
  status: string
  grossesses: Grossesse[]
  consultations: Consultation[]
  alertes: Alerte[]
  resultatsLabo?: ResultatLabo[]
}

interface Grossesse {
  id: string
  ddr: string
  dpa: string
  status: string
  grossesseMultiple: boolean
  nombreFoetus: number
  facteursRisque?: string[]
  notes?: string
}

interface Consultation {
  id: string
  type: string
  date: string
  poids?: string
  tensionSystolique?: number
  tensionDiastolique?: number
  saTerm?: number
  saJours?: number
  conclusion?: string
}

interface Alerte {
  id: string
  type: string
  message: string
  severity: string
  isRead: boolean
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [nextNotes, setNextNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [isSavingField, setIsSavingField] = useState(false)
  const [showOncogeneticScore, setShowOncogeneticScore] = useState(false)
  const [showLabModal, setShowLabModal] = useState(false)

  useEffect(() => {
    fetchPatient()
  }, [resolvedParams.id])

  useEffect(() => {
    if (patient?.notesNextConsultation) {
      setNextNotes(patient.notesNextConsultation)
    }
  }, [patient?.notesNextConsultation])

  const fetchPatient = async () => {
    try {
      const res = await fetch(`/api/patients/${resolvedParams.id}`)
      const data = await res.json()

      if (data.success) {
        setPatient(data.patient)
      } else {
        router.push('/patients')
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveNextNotes = async () => {
    if (!patient) return
    setIsSavingNotes(true)
    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notesNextConsultation: nextNotes }),
      })
      const data = await res.json()
      if (data.success) {
        setPatient({ ...patient, notesNextConsultation: nextNotes })
        setIsEditingNotes(false)
      }
    } catch (error) {
      console.error('Error saving notes:', error)
    } finally {
      setIsSavingNotes(false)
    }
  }

  const deleteNextNotes = async () => {
    if (!patient) return
    setIsSavingNotes(true)
    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notesNextConsultation: null }),
      })
      const data = await res.json()
      if (data.success) {
        setPatient({ ...patient, notesNextConsultation: undefined })
        setNextNotes('')
        setIsEditingNotes(false)
      }
    } catch (error) {
      console.error('Error deleting notes:', error)
    } finally {
      setIsSavingNotes(false)
    }
  }

  const startEditField = (fieldName: string, currentValue: string) => {
    setEditingField(fieldName)
    setEditValue(currentValue || '')
  }

  const cancelEditField = () => {
    setEditingField(null)
    setEditValue('')
  }

  const saveField = async (fieldName: string) => {
    if (!patient) return
    setIsSavingField(true)
    try {
      let bodyData: any = {}

      // Gestion spéciale pour le groupe sanguin
      if (fieldName === 'bloodType' && editValue) {
        const bloodType = editValue.slice(0, -1) // A, B, AB ou O
        const rhesus = editValue.slice(-1) // + ou -
        bodyData = { bloodType, rhesus }
      } else {
        bodyData = { [fieldName]: editValue || null }
      }

      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })
      const data = await res.json()
      if (data.success) {
        if (fieldName === 'bloodType' && editValue) {
          setPatient({ ...patient, bloodType: editValue.slice(0, -1), rhesus: editValue.slice(-1) })
        } else {
          setPatient({ ...patient, [fieldName]: editValue || undefined })
        }
        setEditingField(null)
        setEditValue('')
      }
    } catch (error) {
      console.error('Error saving field:', error)
    } finally {
      setIsSavingField(false)
    }
  }

  const handleDeleteResultat = async (resultatId: string) => {
    if (!confirm('Supprimer ce résultat de laboratoire ?')) return

    try {
      const res = await fetch(`/api/resultats-labo/${resultatId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        fetchPatient()
      }
    } catch (error) {
      console.error('Error deleting resultat:', error)
    }
  }

  // Calcul du score oncogénétique selon critères Eisinger
  const calculateOncogeneticScore = () => {
    if (!patient?.antecedentsFamiliaux) return { score: 0, recommendation: '', details: [] }

    const atcds = patient.antecedentsFamiliaux.join(' ').toLowerCase()
    let score = 0
    const details: string[] = []

    // Critères majeurs (score élevé)
    if (atcds.includes('cancer du sein') && atcds.includes('ovaire')) {
      score += 3
      details.push('Association cancer sein + ovaire dans la famille')
    }

    if (atcds.includes('cancer du sein') && atcds.includes('homme')) {
      score += 3
      details.push('Cancer du sein chez un homme')
    }

    // Comptage des cas de cancer du sein
    const cancerSeinMatches = (atcds.match(/cancer du sein/g) || []).length
    if (cancerSeinMatches >= 3) {
      score += 2
      details.push(`${cancerSeinMatches} cas de cancer du sein dans la famille`)
    } else if (cancerSeinMatches === 2) {
      score += 1
      details.push(`${cancerSeinMatches} cas de cancer du sein dans la famille`)
    } else if (cancerSeinMatches === 1) {
      score += 0.5
      details.push('1 cas de cancer du sein dans la famille')
    }

    // Age précoce
    if (atcds.includes('avant') || atcds.includes('jeune') || atcds.includes('40 ans')) {
      score += 1
      details.push('Cancer diagnostiqué à un âge précoce')
    }

    // Cancer bilatéral
    if (atcds.includes('bilatéral') || atcds.includes('deux seins')) {
      score += 1
      details.push('Cancer du sein bilatéral')
    }

    // Recommandation
    let recommendation = ''
    let level: 'low' | 'moderate' | 'high' = 'low'

    if (score >= 3) {
      recommendation = 'Consultation oncogénétique FORTEMENT RECOMMANDÉE'
      level = 'high'
    } else if (score >= 1.5) {
      recommendation = 'Consultation oncogénétique recommandée'
      level = 'moderate'
    } else if (score > 0) {
      recommendation = 'Surveillance renforcée conseillée'
      level = 'low'
    } else {
      recommendation = 'Pas de critère oncogénétique identifié'
      level = 'low'
    }

    return { score, recommendation, details, level }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!patient) {
    return null
  }

  const currentGrossesse = patient.grossesses.find((g) => g.status === 'en_cours')
  const sa = currentGrossesse ? calculateSA(currentGrossesse.ddr) : null
  const progress = sa ? Math.min((sa.total / 280) * 100, 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/patients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-700">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-slate-900">
                  {patient.firstName} {patient.lastName}
                </h1>
                {patient.gravida > 0 && (
                  <Badge variant="secondary">
                    <Baby className="h-3 w-3 mr-1" />
                    G{patient.gravida}P{patient.para}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                <span>{calculateAge(patient.birthDate)} ans</span>
                {patient.bloodType && (
                  <span className="flex items-center gap-1">
                    <Droplet className="h-3 w-3" />
                    {patient.bloodType}{patient.rhesus}
                  </span>
                )}
                {patient.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {patient.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-12 lg:ml-0">
          <Button variant="outline" onClick={() => window.open('https://pro.doctolib.fr', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Doctolib
          </Button>
          <Button asChild>
            <Link href={`/patients/${patient.id}/edit`}>
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      {/* Alertes */}
      {patient.alertes.length > 0 && (
        <div className="space-y-2">
          {patient.alertes.map((alerte) => (
            <div
              key={alerte.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                alerte.severity === 'critical'
                  ? 'bg-red-50 border-red-200'
                  : alerte.severity === 'warning'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 mt-0.5 ${
                  alerte.severity === 'critical'
                    ? 'text-red-600'
                    : alerte.severity === 'warning'
                    ? 'text-amber-600'
                    : 'text-blue-600'
                }`}
              />
              <div>
                <p className="text-sm font-medium">{alerte.message}</p>
                <p className="text-xs text-slate-500 mt-1">{alerte.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rappel frottis */}
      {(() => {
        if (!patient.dateDernierFrottis) {
          return (
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-amber-50 border-amber-200">
              <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">Frottis cervico-utérin à programmer</p>
                <p className="text-xs text-amber-700 mt-1">Aucun frottis enregistré. Recommandation : tous les 3 ans entre 25 et 65 ans.</p>
              </div>
            </div>
          )
        }

        const dateFrottis = new Date(patient.dateDernierFrottis)
        const now = new Date()
        const diffYears = (now.getTime() - dateFrottis.getTime()) / (1000 * 60 * 60 * 24 * 365.25)

        if (diffYears >= 3) {
          return (
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-amber-50 border-amber-200">
              <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">Frottis cervico-utérin à renouveler</p>
                <p className="text-xs text-amber-700 mt-1">
                  Dernier frottis : {formatDate(patient.dateDernierFrottis)}
                  {diffYears >= 4 && <span className="font-semibold"> (en retard)</span>}
                </p>
              </div>
            </div>
          )
        }
        return null
      })()}

      {/* Grossesse en cours */}
      {currentGrossesse && sa && (
        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
                  <Baby className="h-7 w-7 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Grossesse en cours
                  </h3>
                  <p className="text-2xl font-bold text-pink-600">
                    {sa.weeks} SA + {sa.days} j
                  </p>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Progression</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" indicatorClassName="bg-pink-500" />
                <div className="flex justify-between text-xs mt-2 text-slate-500">
                  <span>DDR: {formatDate(currentGrossesse.ddr)}</span>
                  <span>DPA: {formatDate(currentGrossesse.dpa)}</span>
                </div>
              </div>
              <Button asChild>
                <Link href={`/grossesses/${currentGrossesse.id}`}>
                  Suivi complet
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="resume" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="resume" className="gap-2">
            <User className="h-4 w-4" />
            Resume
          </TabsTrigger>
          <TabsTrigger value="consultations" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Consultations
          </TabsTrigger>
          <TabsTrigger value="grossesses" className="gap-2">
            <Baby className="h-4 w-4" />
            Grossesses
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="facturation" className="gap-2">
            <Receipt className="h-4 w-4" />
            Facturation
          </TabsTrigger>
        </TabsList>

        {/* Resume */}
        <TabsContent value="resume">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Notes prochaine consultation */}
            <Card className="lg:col-span-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-amber-600" />
                  Notes pour la prochaine consultation
                </CardTitle>
                <div className="flex gap-2">
                  {patient.notesNextConsultation && !isEditingNotes && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingNotes(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={deleteNextNotes}
                        disabled={isSavingNotes}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditingNotes || !patient.notesNextConsultation ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Notez ici ce dont vous devez vous rappeler pour la prochaine consultation..."
                      value={nextNotes}
                      onChange={(e) => setNextNotes(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      {isEditingNotes && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNextNotes(patient.notesNextConsultation || '')
                            setIsEditingNotes(false)
                          }}
                        >
                          Annuler
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={saveNextNotes}
                        disabled={isSavingNotes || !nextNotes.trim()}
                      >
                        {isSavingNotes ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Save className="h-4 w-4 mr-1" />
                        )}
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {patient.notesNextConsultation}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Coordonnees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {patient.mobilePhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <a href={`tel:${patient.mobilePhone}`} className="text-blue-600 hover:underline">
                      {patient.mobilePhone}
                    </a>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <a href={`mailto:${patient.email}`} className="text-blue-600 hover:underline">
                      {patient.email}
                    </a>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    <span>
                      {patient.address}
                      {patient.postalCode && `, ${patient.postalCode}`}
                      {patient.city && ` ${patient.city}`}
                    </span>
                  </div>
                )}
                {patient.personneConfiance && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-slate-500 mb-1">Personne de confiance</p>
                    <p className="font-medium">{patient.personneConfiance}</p>
                    {patient.telephoneConfiance && (
                      <a href={`tel:${patient.telephoneConfiance}`} className="text-sm text-blue-600 hover:underline">
                        {patient.telephoneConfiance}
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medical */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Informations medicales</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/patients/${patient.id}/edit?tab=medical`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {/* Groupe sanguin */}
                {patient.bloodType && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Groupe sanguin:</span>
                    <span className="font-medium">{patient.bloodType}{patient.rhesus}</span>
                  </div>
                )}

                {/* Médecin traitant */}
                {patient.medecinTraitant && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Médecin traitant:</span>
                    <span className="font-medium">{patient.medecinTraitant}</span>
                  </div>
                )}

                {/* Allergies */}
                {patient.allergies && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-slate-500 mb-1">Allergies:</p>
                    <Badge variant="destructive">{patient.allergies}</Badge>
                  </div>
                )}

                {/* Traitements */}
                {patient.traitementEnCours && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-slate-500 mb-1">Traitements:</p>
                    <p className="text-sm">{patient.traitementEnCours}</p>
                  </div>
                )}

                {/* ATCD médicaux */}
                {patient.antecedentsMedicaux && patient.antecedentsMedicaux.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-slate-500 mb-1">ATCD médicaux:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.antecedentsMedicaux.map((atcd, idx) => (
                        <Badge key={idx} variant="secondary">{atcd}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* ATCD chirurgicaux */}
                {patient.antecedentsChirurgicaux && patient.antecedentsChirurgicaux.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-slate-500 mb-1">ATCD chirurgicaux:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.antecedentsChirurgicaux.map((atcd, idx) => (
                        <Badge key={idx} variant="secondary">{atcd}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* ATCD familiaux */}
                {patient.antecedentsFamiliaux && patient.antecedentsFamiliaux.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-slate-500 mb-1">ATCD familiaux:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.antecedentsFamiliaux.map((atcd, idx) => (
                        <Badge key={idx} variant="outline">{atcd}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message si aucune info */}
                {!patient.bloodType && !patient.medecinTraitant && !patient.allergies && !patient.traitementEnCours &&
                 (!patient.antecedentsMedicaux || patient.antecedentsMedicaux.length === 0) &&
                 (!patient.antecedentsChirurgicaux || patient.antecedentsChirurgicaux.length === 0) &&
                 (!patient.antecedentsFamiliaux || patient.antecedentsFamiliaux.length === 0) && (
                  <p className="text-sm text-slate-400 text-center py-4">
                    Aucune information médicale renseignée
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Dernieres consultations */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Dernieres consultations</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/consultations/new?patient=${patient.id}`}>
                    <Plus className="h-4 w-4 mr-1" />
                    Nouvelle
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {patient.consultations.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">
                    Aucune consultation enregistree
                  </p>
                ) : (
                  <div className="space-y-3">
                    {patient.consultations.slice(0, 5).map((consult) => (
                      <div
                        key={consult.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                            <Stethoscope className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{consult.type.replace('_', ' ')}</p>
                            <p className="text-xs text-slate-500">
                              {consult.saTerm && `${consult.saTerm} SA + ${consult.saJours}j - `}
                              {formatDate(consult.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          {consult.poids && (
                            <span className="text-slate-600">{consult.poids} kg</span>
                          )}
                          {consult.tensionSystolique && (
                            <span className="text-slate-600">
                              {consult.tensionSystolique}/{consult.tensionDiastolique}
                            </span>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/consultations/${consult.id}`}>
                              Voir
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consultations */}
        <TabsContent value="consultations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Historique des consultations</CardTitle>
              <Button asChild>
                <Link href={`/consultations/new?patient=${patient.id}`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle consultation
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {patient.consultations.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Aucune consultation enregistree
                </p>
              ) : (
                <div className="space-y-3">
                  {patient.consultations.map((consult) => (
                    <Link
                      key={consult.id}
                      href={`/consultations/${consult.id}`}
                      className="block p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                            <Stethoscope className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium">{consult.type.replace('_', ' ')}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock className="h-3 w-3" />
                              {formatDate(consult.date)}
                              {consult.saTerm && (
                                <Badge variant="secondary" className="ml-2">
                                  {consult.saTerm} SA + {consult.saJours}j
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {consult.poids && (
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Poids</p>
                              <p className="font-medium">{consult.poids} kg</p>
                            </div>
                          )}
                          {consult.tensionSystolique && (
                            <div className="text-right">
                              <p className="text-xs text-slate-500">TA</p>
                              <p className="font-medium">
                                {consult.tensionSystolique}/{consult.tensionDiastolique}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      {consult.conclusion && (
                        <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                          {consult.conclusion}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grossesses */}
        <TabsContent value="grossesses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Historique des grossesses</CardTitle>
              <Button asChild>
                <Link href={`/grossesses/new?patient=${patient.id}`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle grossesse
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {patient.grossesses.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Aucune grossesse enregistree
                </p>
              ) : (
                <div className="space-y-4">
                  {patient.grossesses.map((grossesse) => {
                    const grossesseSA = calculateSA(grossesse.ddr)
                    const isEnCours = grossesse.status === 'en_cours'
                    return (
                      <Link
                        key={grossesse.id}
                        href={`/grossesses/${grossesse.id}`}
                        className="block p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                              isEnCours ? 'bg-pink-100' : 'bg-slate-100'
                            }`}>
                              <Baby className={`h-6 w-6 ${isEnCours ? 'text-pink-600' : 'text-slate-600'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {isEnCours
                                    ? `${grossesseSA.weeks} SA + ${grossesseSA.days}j`
                                    : `Grossesse ${grossesse.status.replace('_', ' ')}`}
                                </p>
                                {grossesse.grossesseMultiple && (
                                  <Badge variant="info">
                                    {grossesse.nombreFoetus} foetus
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-500">
                                DDR: {formatDate(grossesse.ddr)} - DPA: {formatDate(grossesse.dpa)}
                              </p>
                            </div>
                          </div>
                          <Badge variant={isEnCours ? 'success' : 'secondary'}>
                            {isEnCours ? 'En cours' : grossesse.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {grossesse.facteursRisque && grossesse.facteursRisque.length > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="text-sm text-amber-600">
                              Facteurs de risque: {grossesse.facteursRisque.join(', ')}
                            </span>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Résultats de laboratoire</CardTitle>
              <Button onClick={() => setShowLabModal(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Nouveau résultat
              </Button>
            </CardHeader>
            <CardContent>
              {!patient.resultatsLabo || patient.resultatsLabo.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Aucun résultat de laboratoire
                </p>
              ) : (
                <div className="space-y-3">
                  {patient.resultatsLabo.map((resultat) => (
                    <div key={resultat.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-slate-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{resultat.nom}</h4>
                          {resultat.normal !== null && resultat.normal !== undefined && (
                            <Badge variant={resultat.normal ? 'default' : 'destructive'}>
                              {resultat.normal ? 'Normal' : 'Anormal'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">
                          {resultat.dateAnalyse && formatDate(resultat.dateAnalyse)}
                          {resultat.laboratoire && ` • ${resultat.laboratoire}`}
                        </p>
                        {resultat.resultatManuel && (
                          <div className="mt-2 bg-slate-50 p-3 rounded border border-slate-200">
                            <p className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                              {resultat.resultatManuel}
                            </p>
                          </div>
                        )}
                        {resultat.commentaire && (
                          <p className="text-sm text-slate-600 mt-1 italic">{resultat.commentaire}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {resultat.fichierUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={resultat.fichierUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteResultat(resultat.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <ResultatLaboModal
            patientId={patient.id}
            open={showLabModal}
            onClose={() => setShowLabModal(false)}
            onSuccess={fetchPatient}
          />
        </TabsContent>

        {/* Facturation */}
        <TabsContent value="facturation">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Factures</CardTitle>
              <Button asChild>
                <Link href={`/facturation/new?patient=${patient.id}`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle facture
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 text-center py-8">
                Aucune facture pour cette patiente
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
