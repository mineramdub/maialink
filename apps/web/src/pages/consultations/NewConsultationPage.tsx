import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ArrowLeft, Loader2, Save, FileText, Calendar, AlertTriangle, CheckCircle2, Plus, Sparkles } from 'lucide-react'
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
import { TemplateEditor } from '../../components/TemplateEditor'
import {
  EXAMEN_CLINIQUE_TEMPLATES,
  CONCLUSION_TEMPLATES,
  MOTIF_TEMPLATES
} from '../../lib/consultationTextTemplates'
import { AutofillService } from '../../services/autofillService'
import { showNotification } from '../../components/SmartNotifications'

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
    resumeCourt: '', // Résumé court pour affichage dans les listes
    saTerm: '',
    saJours: '',
    sousTypeGyneco: '', // 'instauration' ou 'suivi' pour les consultations gynéco
    prescriptions: '', // Liste des prescriptions créées
    templateId: '', // ID du template utilisé
  })

  const [prescriptionsList, setPrescriptionsList] = useState<string[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
  const [autofillSuggestions, setAutofillSuggestions] = useState<any>(null)
  const [autofillApplied, setAutofillApplied] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  // Autofill suggestions basées sur l'historique du patient
  useEffect(() => {
    // Ne pas appliquer l'autofill en mode édition ou si déjà appliqué
    if (isEditMode || autofillApplied || !patientData) {
      return
    }

    // Attendre que toutes les données soient chargées
    if (!patientData) return

    // Récupérer l'historique des consultations
    const fetchConsultationHistory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/consultations/patient/${patientData.id}?limit=10`,
          { credentials: 'include' }
        )
        const data = await res.json()
        const previousConsultations = data.success ? data.consultations : []

        // Générer les suggestions d'autofill
        const suggestions = AutofillService.suggestConsultationData(
          patientData,
          grossesseData,
          previousConsultations
        )

        setAutofillSuggestions(suggestions)

        // Afficher une notification si des suggestions sont disponibles
        if (suggestions && Object.keys(suggestions).length > 0) {
          showNotification({
            type: 'suggestion',
            title: 'Suggestions de pré-remplissage disponibles',
            message: 'Des suggestions basées sur l\'historique de la patiente sont disponibles.',
            action: {
              label: 'Appliquer',
              onClick: () => applyAutofillSuggestions(suggestions)
            },
            dismissible: true
          })
        }
      } catch (error) {
        console.error('Error fetching consultation history for autofill:', error)
      }
    }

    fetchConsultationHistory()
  }, [patientData, grossesseData, isEditMode, autofillApplied])

  // Fonction pour appliquer les suggestions d'autofill
  const applyAutofillSuggestions = (suggestions: any) => {
    const updates: any = {}

    // Appliquer le type de consultation suggéré
    if (suggestions.type && !formData.type) {
      updates.type = suggestions.type
    }

    // Pré-remplir l'examen clinique avec le template
    if (suggestions.examenCliniqueTemplate && !formData.examenClinique) {
      updates.examenClinique = suggestions.examenCliniqueTemplate
    }

    // Appliquer les mises à jour au formulaire
    if (Object.keys(updates).length > 0) {
      setFormData(prev => ({ ...prev, ...updates }))
      setAutofillApplied(true)

      showNotification({
        type: 'success',
        title: 'Suggestions appliquées',
        message: 'Les suggestions de pré-remplissage ont été appliquées au formulaire.',
        autoClose: 3000
      })
    }
  }

  // Suggestions IA automatiques basées sur le texte
  useEffect(() => {
    if (!formData.patientId || (!formData.motif && !formData.examenClinique && !formData.conclusion)) {
      setAiSuggestions([])
      return
    }

    const newSuggestions: any[] = []
    const texteComplet = `${formData.motif} ${formData.examenClinique} ${formData.conclusion}`.toLowerCase()

    // Mycose
    if (
      texteComplet.includes('mycose') ||
      texteComplet.includes('candidose') ||
      (texteComplet.includes('leucorrhées') && (texteComplet.includes('blanches') || texteComplet.includes('épaisses')))
    ) {
      newSuggestions.push({
        nom: 'Traitement mycose vulvo-vaginale',
        type: 'medicament',
        priorite: 'urgent',
        description: 'Econazole ou Miconazole ovules + crème',
        raison: 'Mycose diagnostiquée',
        templateNom: 'Mycose vulvo-vaginale'
      })
    }

    // Vaginose
    if (
      texteComplet.includes('vaginose') ||
      (texteComplet.includes('leucorrhées') && texteComplet.includes('malodorantes'))
    ) {
      newSuggestions.push({
        nom: 'Traitement vaginose bactérienne',
        type: 'medicament',
        priorite: 'urgent',
        description: 'Métronidazole 500mg x2/j pendant 7 jours',
        raison: 'Vaginose bactérienne diagnostiquée',
        templateNom: 'Vaginose bactérienne'
      })
    }

    // HTA
    const tas = formData.tensionSystolique ? parseInt(formData.tensionSystolique) : null
    const tad = formData.tensionDiastolique ? parseInt(formData.tensionDiastolique) : null

    if (
      (tas && tas >= 140) ||
      (tad && tad >= 90) ||
      texteComplet.includes('hta') ||
      texteComplet.includes('hypertension')
    ) {
      newSuggestions.push({
        nom: 'Bilan HTA gravidique / Pré-éclampsie',
        type: 'biologie',
        priorite: 'urgent',
        description: 'Protéinurie 24h, NFS plaquettes, bilan hépatique, créatinine, acide urique',
        raison: 'HTA détectée ou suspectée',
        templateNom: 'Bilan HTA gravidique'
      })
    }

    // Diabète gestationnel
    const sa = formData.saTerm ? parseInt(formData.saTerm) : null
    if (
      (formData.type === 'prenatale' && sa && sa >= 24 && sa <= 28) ||
      texteComplet.includes('diabète') ||
      texteComplet.includes('hgpo')
    ) {
      if (!texteComplet.includes('hgpo réalisée') && !texteComplet.includes('hgpo fait')) {
        newSuggestions.push({
          nom: 'Test diabète gestationnel (HGPO)',
          type: 'biologie',
          priorite: 'recommande',
          description: 'HGPO 75g - Dépistage diabète gestationnel',
          raison: sa ? `Terme optimal pour dépistage (${sa} SA)` : 'Dépistage diabète gestationnel',
          templateNom: 'HGPO - Test diabète gestationnel'
        })
      }
    }

    // RCIU
    if (
      texteComplet.includes('rciu') ||
      texteComplet.includes('retard de croissance') ||
      texteComplet.includes('hu insuffisante')
    ) {
      newSuggestions.push({
        nom: 'Échographie + Doppler (RCIU)',
        type: 'echographie',
        priorite: 'urgent',
        description: 'Échographie biométrie + Doppler ombilical, utérins',
        raison: 'Suspicion RCIU',
        templateNom: 'Échographie Doppler RCIU'
      })
    }

    // Streptocoque B
    if (formData.type === 'prenatale' && sa && sa >= 35 && sa <= 37) {
      if (!texteComplet.includes('streptocoque b') && !texteComplet.includes('strep b fait')) {
        newSuggestions.push({
          nom: 'Prélèvement vaginal Streptocoque B',
          type: 'biologie',
          priorite: 'recommande',
          description: 'PV recherche Streptocoque B (35-37 SA)',
          raison: `Terme optimal pour dépistage (${sa} SA)`,
          templateNom: 'Prélèvement vaginal Streptocoque B'
        })
      }
    }

    // Rééducation périnéale
    if (
      (formData.type === 'postnatale' || formData.type === 'reeducation') &&
      (texteComplet.includes('fuites') || texteComplet.includes('incontinence') || texteComplet.includes('périnée'))
    ) {
      if (!texteComplet.includes('rééducation prescrite')) {
        newSuggestions.push({
          nom: 'Ordonnance kinésithérapie - Rééducation périnéale',
          type: 'autre',
          priorite: 'recommande',
          description: '10 séances de rééducation périnéale',
          raison: 'Post-partum ou troubles périnéaux',
          templateNom: 'Kinésithérapie - Rééducation périnéale post-partum'
        })
      }
    }

    setAiSuggestions(newSuggestions)
  }, [formData.motif, formData.examenClinique, formData.conclusion, formData.type, formData.saTerm, formData.tensionSystolique, formData.tensionDiastolique, formData.patientId])

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
        templateId: templateId, // Sauvegarder l'ID du template utilisé
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

      // Redirect to billing after creating a new consultation
      if (!isEditMode) {
        const consultationId = data.consultation.id
        const patientId = formData.patientId
        navigate(`/facturation/new?patientId=${patientId}&consultationId=${consultationId}`)
      } else {
        navigate(`/consultations/${consultationId}`)
      }
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

  const generateSummary = async () => {
    if (!consultationId && isEditMode) {
      showNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de générer un résumé sans consultation enregistrée'
      })
      return
    }

    // If in edit mode, use the API endpoint
    if (isEditMode && consultationId) {
      try {
        setIsGeneratingSummary(true)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations/${consultationId}/generate-summary`, {
          method: 'POST',
          credentials: 'include',
        })
        const data = await res.json()

        if (data.success) {
          setFormData(prev => ({ ...prev, resumeCourt: data.resume }))
          showNotification({
            type: 'success',
            title: 'Résumé généré',
            message: 'Le résumé a été généré avec succès'
          })
        }
      } catch (error) {
        console.error('Error generating summary:', error)
        showNotification({
          type: 'error',
          title: 'Erreur',
          message: 'Erreur lors de la génération du résumé'
        })
      } finally {
        setIsGeneratingSummary(false)
      }
    } else {
      // If creating a new consultation, generate a simple summary from available data
      let summary = ''
      if (formData.type === 'prenatale' && formData.saTerm) {
        summary = `Cslt prénatal ${formData.saTerm}SA`
      } else if (formData.type === 'postnatale') {
        summary = `Suivi post-natal`
      } else if (formData.type === 'gyneco') {
        summary = `Consultation gynéco`
      } else {
        summary = `Consultation ${formData.type}`
      }

      // Add important info from motif/conclusion if available
      const motifShort = formData.motif?.substring(0, 30) || ''
      if (motifShort && summary.length + motifShort.length < 90) {
        summary += ` - ${motifShort}`
      }

      setFormData(prev => ({ ...prev, resumeCourt: summary.substring(0, 100) }))
      showNotification({
        type: 'info',
        title: 'Résumé généré',
        message: 'Un résumé de base a été généré. Vous pourrez l\'affiner après l\'enregistrement.'
      })
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
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-blue-600">
                      Template appliqué - Les champs ont été pré-remplis
                    </p>
                    <TemplateEditor
                      templateId={formData.templateId}
                      currentMotif={formData.motif}
                      currentExamenClinique={formData.examenClinique}
                      currentConclusion={formData.conclusion}
                      onSave={() => {
                        // Recharger le template après modification
                        if (formData.templateId) {
                          applyTemplate(formData.templateId)
                        }
                      }}
                    />
                  </div>
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

        {/* Recommandations et suggestions - Section unifiée */}
        {(calendarRecommendations || gynecologyRecommendations?.ordonnancesSuggerees?.length > 0 || aiSuggestions.length > 0) && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Calendar className="h-5 w-5" />
                Recommandations et suggestions
                {currentSA && <span className="text-sm font-normal">({Math.floor(currentSA)} SA + {Math.round((currentSA - Math.floor(currentSA)) * 7)}j)</span>}
              </CardTitle>
              <p className="text-sm text-blue-700">
                Actions recommandées, examens et ordonnances à prévoir pour cette consultation
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Examens en retard - Section d'alerte */}
              {calendarRecommendations?.examensEnRetard?.length > 0 && (
                <div className="space-y-2 p-4 bg-orange-100 border-2 border-orange-300 rounded-lg">
                  <h4 className="font-bold text-sm text-orange-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    ⚠️ Examens en retard - À rattraper
                  </h4>
                  <div className="space-y-3">
                    {calendarRecommendations.examensEnRetard.map((retard: any, i: number) => (
                      <div key={i} className="p-3 bg-white rounded-lg border-2 border-orange-400">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-orange-900">
                            {retard.titre}
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            Prévu {retard.saMin}-{retard.saMax} SA
                          </Badge>
                        </div>
                        {retard.examens?.length > 0 && (
                          <div className="space-y-1 mt-2">
                            {retard.examens.map((examen: string, j: number) => {
                              const key = `retard-${i}-${j}`
                              return (
                                <div key={j} className="flex items-start gap-2">
                                  <input
                                    type="checkbox"
                                    id={key}
                                    checked={checkedRecommendations[key] || false}
                                    onChange={() => toggleRecommendation(key)}
                                    className="mt-1 h-4 w-4 rounded border-orange-400 text-orange-600 focus:ring-orange-500"
                                  />
                                  <label
                                    htmlFor={key}
                                    className={`text-sm text-orange-800 cursor-pointer flex-1 ${
                                      checkedRecommendations[key] ? 'line-through opacity-60' : ''
                                    }`}
                                  >
                                    {examen}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Examens à réaliser */}
              {calendarRecommendations?.examensAFaire?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Examens à réaliser
                  </h4>
                  <div className="space-y-2">
                    {calendarRecommendations.examensAFaire.map((examen: string, i: number) => {
                      const key = `examen-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2 p-2 bg-white rounded border border-blue-100">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedRecommendations[key] || false}
                            onChange={() => toggleRecommendation(key)}
                            className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-blue-800 cursor-pointer flex-1 ${
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

              {/* Prescriptions à prévoir */}
              {calendarRecommendations?.prescriptionsAPrevoir?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Prescriptions à prévoir
                  </h4>
                  <div className="space-y-2">
                    {calendarRecommendations.prescriptionsAPrevoir.map((prescription: string, i: number) => {
                      const key = `prescription-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2 p-2 bg-white rounded border border-blue-100">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedRecommendations[key] || false}
                            onChange={() => toggleRecommendation(key)}
                            className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-blue-800 cursor-pointer flex-1 ${
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

              {/* Points de vigilance */}
              {calendarRecommendations?.pointsDeVigilance?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-orange-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Points de vigilance
                  </h4>
                  <div className="space-y-2">
                    {calendarRecommendations.pointsDeVigilance.map((point: string, i: number) => {
                      const key = `vigilance-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedRecommendations[key] || false}
                            onChange={() => toggleRecommendation(key)}
                            className="mt-1 h-4 w-4 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-orange-800 cursor-pointer flex-1 ${
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

              {/* Conseils à donner */}
              {calendarRecommendations?.conseilsADonner?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Conseils à donner
                  </h4>
                  <div className="space-y-2">
                    {calendarRecommendations.conseilsADonner.map((conseil: string, i: number) => {
                      const key = `conseil-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2 p-2 bg-green-50 rounded border border-green-200">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedRecommendations[key] || false}
                            onChange={() => toggleRecommendation(key)}
                            className="mt-1 h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-green-800 cursor-pointer flex-1 ${
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

              {/* Ordonnances suggérées selon le terme */}
              {calendarRecommendations?.ordonnancesSuggerees && calendarRecommendations.ordonnancesSuggerees.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-semibold text-sm text-purple-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Ordonnances recommandées (selon le terme)
                  </h4>
                  <div className="space-y-2">
                    {calendarRecommendations.ordonnancesSuggerees.map((ordonnance: any) => (
                      <div
                        key={ordonnance.id}
                        className="flex items-start justify-between p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
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
                            addPrescription(ordonnance.nom)
                            const consultationIdParam = formData.id ? `&consultationId=${formData.id}` : ''
                            window.open(
                              `/ordonnances/new?patientId=${formData.patientId}${consultationIdParam}&template=${encodeURIComponent(ordonnance.templateNom || ordonnance.nom)}`,
                              '_blank'
                            )
                          }}
                          className="shrink-0 ml-3"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Créer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ordonnances gynécologie */}
              {gynecologyRecommendations?.ordonnancesSuggerees && gynecologyRecommendations.ordonnancesSuggerees.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-semibold text-sm text-pink-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Ordonnances recommandées (gynécologie)
                  </h4>
                  <div className="space-y-2">
                    {gynecologyRecommendations.ordonnancesSuggerees.map((ordonnance: any) => (
                      <div
                        key={ordonnance.id}
                        className="flex items-start justify-between p-3 bg-white rounded-lg border border-pink-200 hover:border-pink-300 transition-colors"
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
                            addPrescription(ordonnance.nom)
                            const consultationIdParam = formData.id ? `&consultationId=${formData.id}` : ''
                            window.open(
                              `/ordonnances/new?patientId=${formData.patientId}${consultationIdParam}&template=${encodeURIComponent(ordonnance.templateNom || ordonnance.nom)}`,
                              '_blank'
                            )
                          }}
                          className="shrink-0 ml-3"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Créer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions automatiques IA */}
              {aiSuggestions.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-semibold text-sm text-indigo-900 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Ordonnances suggérées (détection automatique)
                  </h4>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-white rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm text-slate-900">
                              {suggestion.nom}
                            </h4>
                            <Badge
                              variant={suggestion.priorite === 'urgent' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {suggestion.priorite === 'urgent' ? '🔴 Urgent' : suggestion.priorite === 'recommande' ? '🟡 Recommandé' : '🟢 Optionnel'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type === 'biologie' ? '🧪 Biologie' :
                               suggestion.type === 'echographie' ? '📊 Échographie' :
                               suggestion.type === 'medicament' ? '💊 Médicament' : '📄 Autre'}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 mb-1">{suggestion.description}</p>
                          <p className="text-xs text-indigo-600 italic">→ {suggestion.raison}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            addPrescription(suggestion.nom)
                            const consultationIdParam = formData.id ? `&consultationId=${formData.id}` : ''
                            const params = new URLSearchParams({
                              patientId: formData.patientId,
                              ...(formData.grossesseId && { grossesseId: formData.grossesseId }),
                              ...(suggestion.templateNom && { template: suggestion.templateNom })
                            })
                            window.open(`/ordonnances/new?${params.toString()}`, '_blank')
                          }}
                          className="shrink-0 ml-3"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Créer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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

            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <Label htmlFor="resumeCourt" className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Résumé court (pour affichage dans les listes)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateSummary}
                  disabled={isGeneratingSummary}
                  className="text-xs"
                >
                  {isGeneratingSummary ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Générer avec IA
                    </>
                  )}
                </Button>
              </div>
              <Input
                id="resumeCourt"
                type="text"
                maxLength={100}
                placeholder="Ex: Cslt prénatal 28SA - RAS"
                value={formData.resumeCourt}
                onChange={(e) => updateField('resumeCourt', e.target.value)}
                className="bg-white"
              />
              <p className="text-xs text-slate-600">
                Ce résumé apparaîtra à côté de la consultation dans la liste des consultations. Max 100 caractères.
              </p>
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
