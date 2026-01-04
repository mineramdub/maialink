import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ArrowLeft, Loader2, Save, FileText, Calendar, AlertTriangle, CheckCircle2, Plus } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { getTemplatesByType, getTemplateById, type ConsultationTemplate } from '../../lib/consultationTemplates'
import { getObservationTemplate, generateObservationFromData } from '../../lib/observationTemplates'
import { useConsultationSuggestions } from '../../hooks/useConsultationSuggestions'
import { ConsultationSuggestions } from '../../components/ConsultationSuggestions'
import { TextTemplateSelector } from '../../components/TextTemplateSelector'
import { ExamenCliniqueAdapte } from '../../components/ExamenCliniqueAdapte'
import { SuiviBebe } from '../../components/SuiviBebe'
import { HistoriqueConsultation } from '../../components/HistoriqueConsultation'
import { AlertesCliniques } from '../../components/AlertesCliniques'
import { SuggestionsOrdonnances } from '../../components/SuggestionsOrdonnances'
import {
  EXAMEN_CLINIQUE_TEMPLATES,
  CONCLUSION_TEMPLATES,
  MOTIF_TEMPLATES
} from '../../lib/consultationTextTemplates'

export default function NewConsultationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { id: consultationId } = useParams()
  const patientId = searchParams.get('patientId')
  const grossesseId = searchParams.get('grossesseId')
  const isEditMode = !!consultationId

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConsultation, setIsLoadingConsultation] = useState(isEditMode)
  const [patients, setPatients] = useState<any[]>([])
  const [grossesses, setGrossesses] = useState<any[]>([])
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [availableTemplates, setAvailableTemplates] = useState<ConsultationTemplate[]>([])
  const [currentSA, setCurrentSA] = useState<number | null>(null)
  const [calendarRecommendations, setCalendarRecommendations] = useState<any>(null)
  const [gynecologyRecommendations, setGynecologyRecommendations] = useState<any>(null)
  const [checkedRecommendations, setCheckedRecommendations] = useState<{[key: string]: boolean}>({})
  const [bebes, setBebes] = useState<any[]>([])
  const [selectedBebe, setSelectedBebe] = useState<any>(null)
  const [patientData, setPatientData] = useState<any>(null)
  const [grossesseData, setGrossesseData] = useState<any>(null)
  const [lastConsultation, setLastConsultation] = useState<any>(null)
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    grossesseId: grossesseId || '',
    bebeId: '',
    type: 'prenatale',
    date: new Date().toISOString().split('T')[0],
    duree: 30,
    poids: '',
    tensionSystolique: '',
    tensionDiastolique: '',
    hauteurUterine: '',
    bdc: '',
    motif: '',
    examenClinique: '',
    conclusion: '',
    saTerm: '',
    saJours: '',
    sousTypeGyneco: '', // 'instauration' ou 'suivi' pour les consultations gynéco
    prescriptions: '', // Liste des prescriptions créées
  })

  const [prescriptionsList, setPrescriptionsList] = useState<string[]>([])

  useEffect(() => {
    fetchPatients()
    if (isEditMode && consultationId) {
      fetchConsultationData(consultationId)
    }
  }, [])

  const fetchConsultationData = async (id: string) => {
    try {
      setIsLoadingConsultation(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations/${id}`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        const consultation = data.consultation
        setFormData({
          patientId: consultation.patientId,
          grossesseId: consultation.grossesseId || '',
          type: consultation.type,
          date: consultation.date.split('T')[0],
          duree: consultation.duree || 30,
          poids: consultation.poids?.toString() || '',
          tensionSystolique: consultation.tensionSystolique?.toString() || '',
          tensionDiastolique: consultation.tensionDiastolique?.toString() || '',
          hauteurUterine: consultation.hauteurUterine?.toString() || '',
          bdc: consultation.bdc?.toString() || '',
          motif: consultation.motif || '',
          examenClinique: consultation.examenClinique || '',
          conclusion: consultation.conclusion || '',
          saTerm: consultation.saTerm?.toString() || '',
          saJours: consultation.saJours?.toString() || '',
          sousTypeGyneco: consultation.sousTypeGyneco || '',
        })
      } else {
        setError('Consultation non trouvée')
        navigate('/consultations')
      }
    } catch (error) {
      console.error('Error fetching consultation:', error)
      setError('Erreur lors du chargement de la consultation')
    } finally {
      setIsLoadingConsultation(false)
    }
  }

  // Update available templates when type changes
  useEffect(() => {
    const templates = getTemplatesByType(formData.type)
    setAvailableTemplates(templates)
    setSelectedTemplate('') // Reset template selection when type changes
  }, [formData.type])

  // Fetch grossesses when patient changes
  useEffect(() => {
    if (formData.patientId) {
      fetchGrossesses(formData.patientId)
    } else {
      setGrossesses([])
      setFormData(prev => ({ ...prev, grossesseId: '' }))
    }
  }, [formData.patientId])

  // Calculate SA and fetch recommendations when grossesse or saTerm changes
  useEffect(() => {
    if (formData.type === 'prenatale' && formData.grossesseId) {
      calculateSAAndFetchRecommendations()
    } else if (formData.saTerm && formData.saJours) {
      const sa = parseFloat(formData.saTerm) + (parseFloat(formData.saJours) / 7)
      fetchCalendarRecommendations(sa)
    } else {
      setCalendarRecommendations(null)
      setCurrentSA(null)
    }
  }, [formData.grossesseId, formData.saTerm, formData.saJours])

  // Fetch gynecology recommendations when motif or sousTypeGyneco changes for gyneco consultations
  useEffect(() => {
    console.log('[Gyneco useEffect] Type:', formData.type, 'Motif:', formData.motif, 'SousType:', formData.sousTypeGyneco)
    if (formData.type === 'gyneco' && (formData.motif?.trim().length > 3 || formData.sousTypeGyneco)) {
      console.log('[Gyneco useEffect] Triggering fetch for motif:', formData.motif, 'sousType:', formData.sousTypeGyneco)
      fetchGynecologyRecommendations(formData.motif, formData.sousTypeGyneco)
    } else if (formData.type !== 'gyneco') {
      setGynecologyRecommendations(null)
    } else {
      console.log('[Gyneco useEffect] Motif too short or empty:', formData.motif)
    }
  }, [formData.type, formData.motif, formData.sousTypeGyneco])

  // Fetch bebes when patient changes for postnatal consultations
  useEffect(() => {
    if (formData.type === 'postnatale' && formData.patientId) {
      fetchBebesForPatient(formData.patientId)
    } else {
      setBebes([])
      setSelectedBebe(null)
    }
  }, [formData.type, formData.patientId])

  // Fetch patient data and last consultation for alerts
  useEffect(() => {
    if (formData.patientId) {
      fetchPatientForAlerts(formData.patientId)
      fetchLastConsultationForAlerts(formData.patientId)
    }
  }, [formData.patientId])

  // Fetch grossesse data for alerts
  useEffect(() => {
    if (formData.grossesseId) {
      fetchGrossesseForAlerts(formData.grossesseId)
    }
  }, [formData.grossesseId])

  // Suggestions et alertes automatiques
  const { alerts, suggestions } = useConsultationSuggestions({
    type: formData.type,
    saTerm: formData.saTerm,
    saJours: formData.saJours,
    tensionSystolique: formData.tensionSystolique,
    tensionDiastolique: formData.tensionDiastolique,
    hauteurUterine: formData.hauteurUterine,
    poids: formData.poids,
    bdc: formData.bdc,
  })

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients?status=active`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const fetchGrossesses = async (patientId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/grossesses?patientId=${patientId}&status=en_cours`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success) {
        setGrossesses(data.grossesses)
      }
    } catch (error) {
      console.error('Error fetching grossesses:', error)
    }
  }

  const fetchBebesForPatient = async (patientId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/patients/${patientId}`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success && data.patient) {
        // Récupérer les bébés via les grossesses terminées
        const grossessesRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/grossesses?patientId=${patientId}`,
          { credentials: 'include' }
        )
        const grossessesData = await grossessesRes.json()

        if (grossessesData.success) {
          // Pour chaque grossesse, récupérer les bébés
          const allBebes = []
          for (const grossesse of grossessesData.grossesses) {
            const bebesRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/bebes/grossesse/${grossesse.id}`,
              { credentials: 'include' }
            )
            const bebesData = await bebesRes.json()
            if (bebesData.success && bebesData.bebes) {
              allBebes.push(...bebesData.bebes)
            }
          }
          setBebes(allBebes)
        }
      }
    } catch (error) {
      console.error('Error fetching bebes:', error)
    }
  }

  const fetchPatientForAlerts = async (patientId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/patients/${patientId}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success && data.patient) {
        setPatientData(data.patient)
      }
    } catch (error) {
      console.error('Error fetching patient for alerts:', error)
    }
  }

  const fetchLastConsultationForAlerts = async (patientId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/consultations/patient/${patientId}/last`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success && data.lastConsultation) {
        setLastConsultation(data.lastConsultation)
      }
    } catch (error) {
      console.error('Error fetching last consultation for alerts:', error)
    }
  }

  const fetchGrossesseForAlerts = async (grossesseId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/grossesses/${grossesseId}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success && data.grossesse) {
        setGrossesseData(data.grossesse)
      }
    } catch (error) {
      console.error('Error fetching grossesse for alerts:', error)
    }
  }

  const calculateSAAndFetchRecommendations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grossesses/${formData.grossesseId}`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success && data.grossesse.ddr) {
        const ddr = new Date(data.grossesse.ddr)
        const today = new Date()
        const diffDays = Math.floor((today.getTime() - ddr.getTime()) / (1000 * 60 * 60 * 24))
        const sa = diffDays / 7
        const weeks = Math.floor(sa)
        const days = Math.round((sa - weeks) * 7)

        setCurrentSA(sa)
        setFormData(prev => ({
          ...prev,
          saTerm: weeks.toString(),
          saJours: days.toString()
        }))

        fetchCalendarRecommendations(sa)
      }
    } catch (error) {
      console.error('Error calculating SA:', error)
    }
  }

  const fetchCalendarRecommendations = async (sa: number) => {
    if (!formData.grossesseId) {
      // Si pas de grossesse sélectionnée, juste utiliser la fonction locale
      // Pour l'instant, on ne peut pas fetcher sans grossesseId
      setCalendarRecommendations(null)
      return
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/grossesses/${formData.grossesseId}/recommendations`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success) {
        setCalendarRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const fetchGynecologyRecommendations = async (motif: string, sousTypeGyneco?: string) => {
    try {
      console.log('[Gyneco] Fetching recommendations for motif:', motif, 'sousType:', sousTypeGyneco)
      const params = new URLSearchParams({ motif: motif || '' })
      if (sousTypeGyneco) {
        params.append('sousTypeGyneco', sousTypeGyneco)
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/consultations/gynecology-recommendations?${params.toString()}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      console.log('[Gyneco] API response:', data)
      if (data.success) {
        console.log('[Gyneco] Recommendations:', data.recommendations)
        console.log('[Gyneco] Ordonnances suggérées:', data.recommendations?.ordonnancesSuggerees)
        setGynecologyRecommendations(data.recommendations)
      } else {
        console.error('[Gyneco] API returned error:', data.error)
      }
    } catch (error) {
      console.error('[Gyneco] Error fetching recommendations:', error)
      setGynecologyRecommendations(null)
    }
  }

  const toggleRecommendation = (key: string) => {
    setCheckedRecommendations(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Fonction pour ajouter une prescription et mettre à jour la conclusion
  const addPrescription = (prescriptionName: string) => {
    if (!prescriptionsList.includes(prescriptionName)) {
      const newList = [...prescriptionsList, prescriptionName]
      setPrescriptionsList(newList)

      // Mettre à jour automatiquement la conclusion
      updateConclusionWithPrescriptions(newList)
    }
  }

  // Mettre à jour la conclusion avec les prescriptions
  const updateConclusionWithPrescriptions = (prescriptions: string[]) => {
    setFormData(prev => {
      let conclusionText = prev.conclusion

      // Retirer l'ancienne section prescriptions si elle existe
      conclusionText = conclusionText.replace(/\n\n?PRESCRIPTIONS? :[\s\S]*$/, '')

      // Ajouter la nouvelle section prescriptions
      if (prescriptions.length > 0) {
        const prescriptionsSection = `\n\nPRESCRIPTIONS :\n${prescriptions.map(p => `- ${p}`).join('\n')}`
        conclusionText = conclusionText.trim() + prescriptionsSection
      }

      return {
        ...prev,
        conclusion: conclusionText,
        prescriptions: prescriptions.join(', ')
      }
    })
  }

  const renderClickableText = (text: string, index: number) => {
    // Mots-clés qui doivent rediriger vers l'ordonnance
    const prescriptionKeywords = [
      'échographie',
      'echo',
      'bilan',
      'analyse',
      'prise de sang',
      'prélèvement',
      'toxoplasmose',
      'rubéole',
      'syphilis',
      'hépatite',
      'glycémie',
      'tggo',
      'ogtt',
      'rai',
      'fer',
      'ferritine',
      'nfs',
      'numération',
      'streptocoque',
      'ECBU',
      'albuminurie',
      'glycosurie',
      'monitoring',
      'enregistrement',
      'prescription'
    ]

    // Chercher si le texte contient un mot-clé
    const lowerText = text.toLowerCase()
    const foundKeyword = prescriptionKeywords.find(keyword =>
      lowerText.includes(keyword.toLowerCase())
    )

    if (foundKeyword) {
      // Trouver la position du mot-clé dans le texte
      const regex = new RegExp(`(${foundKeyword})`, 'gi')
      const parts = text.split(regex)

      return (
        <span>
          {parts.map((part, i) => {
            if (part.toLowerCase() === foundKeyword.toLowerCase()) {
              return (
                <Link
                  key={i}
                  to={`/ordonnances/new?patientId=${formData.patientId}&grossesseId=${formData.grossesseId}`}
                  className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {part}
                </Link>
              )
            }
            return part
          })}
        </span>
      )
    }

    return text
  }

  const applySuggestion = (field: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]}\n\n${text}` : text
    }))
  }

  const applyTemplate = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (template) {
      setFormData({
        ...formData,
        ...template.data,
      })
      setSelectedTemplate(templateId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        poids: formData.poids ? parseFloat(formData.poids) : undefined,
        tensionSystolique: formData.tensionSystolique ? parseInt(formData.tensionSystolique) : undefined,
        tensionDiastolique: formData.tensionDiastolique ? parseInt(formData.tensionDiastolique) : undefined,
        hauteurUterine: formData.hauteurUterine ? parseFloat(formData.hauteurUterine) : undefined,
        bdc: formData.bdc ? parseInt(formData.bdc) : undefined,
      }

      const url = isEditMode
        ? `${import.meta.env.VITE_API_URL}/api/consultations/${consultationId}`
        : `${import.meta.env.VITE_API_URL}/api/consultations`

      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        return
      }

      navigate(`/consultations/${isEditMode ? consultationId : data.consultation.id}`)
    } catch {
      setError(isEditMode ? 'Erreur lors de la modification de la consultation' : 'Erreur lors de la création de la consultation')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value })
  }

  const applyObservationTemplate = async () => {
    try {
      let sa: number | undefined

      // If prenatal consultation with grossesse, fetch SA
      if (formData.type === 'prenatale' && formData.grossesseId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grossesses/${formData.grossesseId}`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (data.success && data.grossesse.ddr) {
          // Calculate SA
          const ddr = new Date(data.grossesse.ddr)
          const today = new Date()
          const diffDays = Math.floor((today.getTime() - ddr.getTime()) / (1000 * 60 * 60 * 24))
          sa = diffDays / 7
        }
      }

      const template = getObservationTemplate(formData.type as any, sa)

      if (template) {
        // Generate observation with current data
        const observationText = generateObservationFromData(template.template, {
          sa: sa ? { weeks: Math.floor(sa), days: Math.round((sa - Math.floor(sa)) * 7) } : undefined,
          poids: formData.poids ? parseFloat(formData.poids) : undefined,
          tension: formData.tensionSystolique && formData.tensionDiastolique
            ? { systolique: parseInt(formData.tensionSystolique), diastolique: parseInt(formData.tensionDiastolique) }
            : undefined,
          hauteurUterine: formData.hauteurUterine ? parseFloat(formData.hauteurUterine) : undefined,
          bdc: formData.bdc ? parseInt(formData.bdc) : undefined,
        })

        setFormData({ ...formData, examenClinique: observationText })
      }
    } catch (error) {
      console.error('Error applying template:', error)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/consultations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {isEditMode ? 'Modifier la consultation' : 'Nouvelle consultation'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditMode ? 'Modifier les informations de la consultation' : 'Créer une nouvelle consultation'}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patiente *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(v) => updateField('patientId', v)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une patiente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => updateField('type', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prenatale">Prénatale</SelectItem>
                    <SelectItem value="postnatale">Postnatale</SelectItem>
                    <SelectItem value="gyneco">Gynéco</SelectItem>
                    <SelectItem value="reeducation">Rééducation</SelectItem>
                    <SelectItem value="preparation">Préparation</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  required
                />
              </div>
            </div>

            {formData.type === 'gyneco' && (
              <div className="space-y-2">
                <Label htmlFor="sousTypeGyneco">Type de consultation gynécologique</Label>
                <Select
                  value={formData.sousTypeGyneco}
                  onValueChange={(v) => updateField('sousTypeGyneco', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instauration">Instauration de contraception</SelectItem>
                    <SelectItem value="suivi">Suivi de contraception</SelectItem>
                    <SelectItem value="depistage">Dépistage / Bilan</SelectItem>
                    <SelectItem value="infection">Infection / Pathologie</SelectItem>
                    <SelectItem value="autre">Autre motif gynécologique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.type === 'prenatale' && grossesses.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="grossesseId">Grossesse</Label>
                <Select
                  value={formData.grossesseId}
                  onValueChange={(v) => updateField('grossesseId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une grossesse (optionnel)" />
                  </SelectTrigger>
                  <SelectContent>
                    {grossesses.map((g: any) => (
                      <SelectItem key={g.id} value={g.id}>
                        DDR: {new Date(g.ddr).toLocaleDateString('fr-FR')} - DPA: {new Date(g.dpa).toLocaleDateString('fr-FR')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.type === 'postnatale' && bebes.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="bebeId">Bébé à suivre</Label>
                <Select
                  value={formData.bebeId}
                  onValueChange={(v) => {
                    updateField('bebeId', v)
                    const bebe = bebes.find((b: any) => b.id === v)
                    setSelectedBebe(bebe)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le bébé" />
                  </SelectTrigger>
                  <SelectContent>
                    {bebes.map((bebe: any) => (
                      <SelectItem key={bebe.id} value={bebe.id}>
                        {bebe.prenom || 'Bébé'} - Né(e) le {new Date(bebe.dateNaissance).toLocaleDateString('fr-FR')} ({bebe.sexe})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.type === 'prenatale' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="saTerm">Terme (SA)</Label>
                  <Input
                    id="saTerm"
                    type="number"
                    placeholder="Ex: 20"
                    value={formData.saTerm}
                    onChange={(e) => updateField('saTerm', e.target.value)}
                    disabled={!!formData.grossesseId}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saJours">Jours</Label>
                  <Input
                    id="saJours"
                    type="number"
                    min="0"
                    max="6"
                    placeholder="Ex: 3"
                    value={formData.saJours}
                    onChange={(e) => updateField('saJours', e.target.value)}
                    disabled={!!formData.grossesseId}
                  />
                </div>
              </div>
            )}

            {availableTemplates.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="template">Utiliser un template (optionnel)</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={applyTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-gray-500">{template.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-xs text-blue-600">
                    Template appliqué - Les champs ont été pré-remplis
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="motif">Motif</Label>
                <TextTemplateSelector
                  templates={MOTIF_TEMPLATES}
                  onSelect={(text) => setFormData(prev => ({ ...prev, motif: text }))}
                  label="Templates"
                />
              </div>
              <Textarea
                id="motif"
                rows={2}
                value={formData.motif}
                onChange={(e) => updateField('motif', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Historique et comparaison */}
        {formData.patientId && !isEditMode && (
          <HistoriqueConsultation
            patientId={formData.patientId}
            currentType={formData.type}
            currentData={formData}
            onReprendre={(data) => {
              setFormData(prev => ({
                ...prev,
                ...data
              }))
            }}
          />
        )}

        {/* Calendar Recommendations Card */}
        {calendarRecommendations && currentSA && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Calendar className="h-5 w-5" />
                Recommandations du calendrier de grossesse ({Math.floor(currentSA)} SA + {Math.round((currentSA - Math.floor(currentSA)) * 7)} j)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {calendarRecommendations.examensAFaire?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Examens à réaliser
                  </h4>
                  <div className="space-y-2">
                    {calendarRecommendations.examensAFaire.map((examen: string, i: number) => {
                      const key = `examen-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedRecommendations[key] || false}
                            onChange={() => toggleRecommendation(key)}
                            className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-blue-800 cursor-pointer ${
                              checkedRecommendations[key] ? 'line-through opacity-60' : ''
                            }`}
                          >
                            {renderClickableText(examen, i)}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {calendarRecommendations.prescriptionsAPrevoir?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Prescriptions à prévoir
                  </h4>
                  <div className="space-y-2">
                    {calendarRecommendations.prescriptionsAPrevoir.map((prescription: string, i: number) => {
                      const key = `prescription-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedRecommendations[key] || false}
                            onChange={() => toggleRecommendation(key)}
                            className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-blue-800 cursor-pointer ${
                              checkedRecommendations[key] ? 'line-through opacity-60' : ''
                            }`}
                          >
                            {renderClickableText(prescription, i)}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {calendarRecommendations.pointsDeVigilance?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-orange-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Points de vigilance
                  </h4>
                  <div className="space-y-2">
                    {calendarRecommendations.pointsDeVigilance.map((point: string, i: number) => {
                      const key = `vigilance-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedRecommendations[key] || false}
                            onChange={() => toggleRecommendation(key)}
                            className="mt-1 h-4 w-4 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-orange-800 cursor-pointer ${
                              checkedRecommendations[key] ? 'line-through opacity-60' : ''
                            }`}
                          >
                            {renderClickableText(point, i)}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {calendarRecommendations.conseilsADonner?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Conseils à donner
                  </h4>
                  <div className="space-y-2">
                    {calendarRecommendations.conseilsADonner.map((conseil: string, i: number) => {
                      const key = `conseil-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedRecommendations[key] || false}
                            onChange={() => toggleRecommendation(key)}
                            className="mt-1 h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-green-800 cursor-pointer ${
                              checkedRecommendations[key] ? 'line-through opacity-60' : ''
                            }`}
                          >
                            {renderClickableText(conseil, i)}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Ordonnances suggérées */}
        {calendarRecommendations?.ordonnancesSuggerees && calendarRecommendations.ordonnancesSuggerees.length > 0 && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <FileText className="h-5 w-5" />
                Ordonnances suggérées (selon le terme)
              </CardTitle>
              <p className="text-sm text-purple-700">
                Créez rapidement les ordonnances recommandées pour ce terme de grossesse
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {calendarRecommendations.ordonnancesSuggerees.map((ordonnance: any) => (
                  <div
                    key={ordonnance.id}
                    className="flex items-start justify-between p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-slate-900">
                          {ordonnance.nom}
                        </h4>
                        <Badge
                          variant={ordonnance.priorite === 'urgent' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {ordonnance.priorite === 'urgent' ? '🔴 Urgent' : ordonnance.priorite === 'recommande' ? '🟡 Recommandé' : '🟢 Optionnel'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ordonnance.type === 'biologie' ? '🧪 Biologie' :
                           ordonnance.type === 'echographie' ? '📊 Échographie' :
                           ordonnance.type === 'medicament' ? '💊 Médicament' : '📄 Autre'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{ordonnance.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Ajouter la prescription à la conclusion
                        addPrescription(ordonnance.nom)

                        // Naviguer vers création ordonnance avec le template pré-rempli
                        const consultationIdParam = formData.id ? `&consultationId=${formData.id}` : ''
                        window.open(
                          `/ordonnances/new?patientId=${formData.patientId}${consultationIdParam}&template=${encodeURIComponent(ordonnance.templateNom || ordonnance.nom)}`,
                          '_blank'
                        )
                      }}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Créer
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ordonnances suggérées - Gynécologie */}
        {console.log('[Gyneco Render] gynecologyRecommendations:', gynecologyRecommendations)}
        {gynecologyRecommendations?.ordonnancesSuggerees && gynecologyRecommendations.ordonnancesSuggerees.length > 0 && (
          <Card className="border-pink-200 bg-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-900">
                <FileText className="h-5 w-5" />
                Ordonnances suggérées (selon le motif)
              </CardTitle>
              <p className="text-sm text-pink-700">
                Créez rapidement les ordonnances recommandées pour ce motif de consultation gynécologique
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {gynecologyRecommendations.ordonnancesSuggerees.map((ordonnance: any) => (
                  <div
                    key={ordonnance.id}
                    className="flex items-start justify-between p-4 bg-white rounded-lg border border-pink-200 hover:border-pink-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-slate-900">
                          {ordonnance.nom}
                        </h4>
                        <Badge
                          variant={ordonnance.priorite === 'urgent' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {ordonnance.priorite === 'urgent' ? '🔴 Urgent' : ordonnance.priorite === 'recommande' ? '🟡 Recommandé' : '🟢 Optionnel'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ordonnance.type === 'biologie' ? '🧪 Biologie' :
                           ordonnance.type === 'echographie' ? '📊 Échographie' :
                           ordonnance.type === 'medicament' ? '💊 Médicament' : '📄 Autre'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{ordonnance.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Ajouter la prescription à la conclusion
                        addPrescription(ordonnance.nom)

                        // Naviguer vers création ordonnance avec le template pré-rempli
                        const consultationIdParam = formData.id ? `&consultationId=${formData.id}` : ''
                        window.open(
                          `/ordonnances/new?patientId=${formData.patientId}${consultationIdParam}&template=${encodeURIComponent(ordonnance.templateNom || ordonnance.nom)}`,
                          '_blank'
                        )
                      }}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Créer
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Consultation Suggestions & Alerts */}
        <ConsultationSuggestions
          alerts={alerts}
          suggestions={suggestions}
          onApplySuggestion={applySuggestion}
        />

        {/* Calculs automatiques et alertes cliniques */}
        <AlertesCliniques
          type={formData.type}
          poids={formData.poids}
          tensionSystolique={formData.tensionSystolique}
          tensionDiastolique={formData.tensionDiastolique}
          hauteurUterine={formData.hauteurUterine}
          saTerm={formData.saTerm}
          bdc={formData.bdc}
          taillePatiente={patientData?.taille}
          poidsInitial={grossesseData?.poidsInitial}
          lastPoids={lastConsultation?.poids}
          lastDate={lastConsultation?.date}
        />

        {/* Suggestions automatiques d'ordonnances */}
        {formData.patientId && (formData.motif || formData.examenClinique || formData.conclusion) && (
          <SuggestionsOrdonnances
            patientId={formData.patientId}
            grossesseId={formData.grossesseId}
            type={formData.type}
            motif={formData.motif}
            examenClinique={formData.examenClinique}
            conclusion={formData.conclusion}
            saTerm={formData.saTerm}
            tensionSystolique={formData.tensionSystolique}
            tensionDiastolique={formData.tensionDiastolique}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Examen clinique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poids">Poids (kg)</Label>
                <Input
                  id="poids"
                  type="number"
                  step="0.1"
                  value={formData.poids}
                  onChange={(e) => updateField('poids', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hauteurUterine">Hauteur utérine (cm)</Label>
                <Input
                  id="hauteurUterine"
                  type="number"
                  step="0.1"
                  value={formData.hauteurUterine}
                  onChange={(e) => updateField('hauteurUterine', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tensionSystolique">TA Systolique</Label>
                <Input
                  id="tensionSystolique"
                  type="number"
                  placeholder="120"
                  value={formData.tensionSystolique}
                  onChange={(e) => updateField('tensionSystolique', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tensionDiastolique">TA Diastolique</Label>
                <Input
                  id="tensionDiastolique"
                  type="number"
                  placeholder="80"
                  value={formData.tensionDiastolique}
                  onChange={(e) => updateField('tensionDiastolique', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bdc">BDC (bpm)</Label>
                <Input
                  id="bdc"
                  type="number"
                  placeholder="140"
                  value={formData.bdc}
                  onChange={(e) => updateField('bdc', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examenClinique" className="text-base font-semibold mb-2">
                Examen clinique
              </Label>
              <ExamenCliniqueAdapte
                type={formData.type}
                motif={formData.motif}
                defaultValue={formData.examenClinique}
                onChange={(text) => updateField('examenClinique', text)}
              />
            </div>

            {formData.type === 'postnatale' && selectedBebe && (
              <SuiviBebe
                bebeId={selectedBebe.id}
                sexe={selectedBebe.sexe as 'M' | 'F'}
                dateNaissance={selectedBebe.dateNaissance}
                onMeasurementsChange={(measurements) => {
                  console.log('Mensurations mises à jour:', measurements)
                }}
                showPreviousMeasurements={true}
              />
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="conclusion">Conclusion</Label>
                <TextTemplateSelector
                  templates={CONCLUSION_TEMPLATES}
                  onSelect={(text) => setFormData(prev => ({ ...prev, conclusion: text }))}
                  label="Templates"
                />
              </div>
              <Textarea
                id="conclusion"
                rows={10}
                value={formData.conclusion}
                onChange={(e) => updateField('conclusion', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/consultations')}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Créer la consultation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
