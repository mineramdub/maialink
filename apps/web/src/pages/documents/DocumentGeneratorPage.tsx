import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { FileText, Download, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import {
  documentTemplates,
  type PatientData,
  type GrossesseData,
  type ConsultationData,
  type PraticienData,
  type DocumentType,
} from '../../lib/documentTemplates'
import { usePractitionerData } from '../../hooks/usePractitionerData'

const DOCUMENT_TYPES = [
  { value: 'declarationGrossesse', label: 'Déclaration de grossesse' },
  { value: 'certificatGrossesse', label: 'Certificat de grossesse' },
  { value: 'arretTravail', label: 'Arrêt de travail (grossesse pathologique)' },
  { value: 'ordonnanceBiologie', label: 'Ordonnance - Biologie (personnalisée)' },
  { value: 'bilanPreEclampsie', label: 'Bilan biologique - Pré-éclampsie' },
  { value: 'bilanCholestase', label: 'Bilan biologique - Cholestase gravidique' },
  { value: 'bilanDiabeteGestationnel', label: 'Bilan biologique - Diabète gestationnel' },
  { value: 'bilanAnemie', label: 'Bilan biologique - Anémie' },
  { value: 'demandeEchographie', label: 'Demande d\'échographie' },
  { value: 'compteRenduConsultation', label: 'Compte-rendu de consultation' },
]

const EXAMENS_BIOLOGIE = [
  'NFS (Numération Formule Sanguine)',
  'Groupe sanguin + Rhésus',
  'RAI (Recherche d\'agglutinines irrégulières)',
  'Glycémie à jeun',
  'HGPO 75g (Hyperglycémie provoquée)',
  'Toxoplasmose (sérologie)',
  'Rubéole (sérologie)',
  'Syphilis (TPHA-VDRL)',
  'VIH (sérologie)',
  'Hépatite B (Ag HBs)',
  'Hépatite C (sérologie)',
  'TSH (hormone thyroïdienne)',
  'Ferritine',
  'Albuminurie / Protéinurie',
  'ECBU (examen cytobactériologique urinaire)',
  'Streptocoque B (prélèvement vaginal)',
]

export default function DocumentGeneratorPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const patientIdFromUrl = searchParams.get('patientId')
  const grossesseId = searchParams.get('grossesseId')

  const praticien = usePractitionerData()

  const [isLoading, setIsLoading] = useState(true)
  const [allPatients, setAllPatients] = useState<any[]>([])
  const [allGrossesses, setAllGrossesses] = useState<any[]>([])
  const [patientId, setPatientId] = useState<string>(patientIdFromUrl || '')
  const [selectedGrossesseId, setSelectedGrossesseId] = useState<string>(grossesseId || '')
  const [patient, setPatient] = useState<PatientData | null>(null)
  const [grossesse, setGrossesse] = useState<GrossesseData | null>(null)
  const [lastConsultation, setLastConsultation] = useState<ConsultationData | null>(null)

  const [documentType, setDocumentType] = useState<DocumentType | ''>('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Form data for different document types
  const [certificatOptions, setCertificatOptions] = useState({
    apteTravail: true,
    pathologique: false,
    observations: '',
  })

  const [arretData, setArretData] = useState({
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    motif: '',
  })

  const [biologieData, setBiologieData] = useState({
    examens: [] as string[],
    indication: 'Suivi de grossesse',
  })

  const [echoData, setEchoData] = useState({
    type: '' as 'T1' | 'T2' | 'T3' | 'croissance' | 'autre' | '',
    indication: '',
  })

  const [compteRenduData, setCompteRenduData] = useState({
    observations: '',
    destinataire: 'Dr ',
  })

  useEffect(() => {
    fetchAllPatients()
  }, [])

  useEffect(() => {
    if (patientId) {
      fetchPatientData()
    } else {
      setPatient(null)
      setGrossesse(null)
      setLastConsultation(null)
    }
  }, [patientId])

  const fetchAllPatients = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setAllPatients(data.patients || [])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPatientData = async () => {
    try {
      setIsLoading(true)
      const patientRes = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${patientId}`, {
        credentials: 'include',
      })
      const patientData = await patientRes.json()

      if (patientData.success) {
        setPatient(patientData.patient)

        // Fetch grossesses for this patient
        const grossessesRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/grossesses?patientId=${patientId}`,
          { credentials: 'include' }
        )
        const grossessesData = await grossessesRes.json()

        if (grossessesData.success && grossessesData.grossesses) {
          setAllGrossesses(grossessesData.grossesses)

          // Auto-select active grossesse if not already specified
          if (!selectedGrossesseId && grossessesData.grossesses.length > 0) {
            const activeGrossesse = grossessesData.grossesses.find((g: any) => g.statut === 'en_cours')
            if (activeGrossesse) {
              setSelectedGrossesseId(activeGrossesse.id)
            } else {
              setSelectedGrossesseId(grossessesData.grossesses[0].id)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedGrossesseId) {
      fetchGrossesseData()
    } else {
      setGrossesse(null)
      setLastConsultation(null)
    }
  }, [selectedGrossesseId])

  const fetchGrossesseData = async () => {
    if (!selectedGrossesseId) return

    try {
      const grossesseRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/grossesses/${selectedGrossesseId}`,
        { credentials: 'include' }
      )
      const grossesseData = await grossesseRes.json()

      if (grossesseData.success) {
        setGrossesse({
          ddr: grossesseData.grossesse.ddr,
          dpa: grossesseData.grossesse.dpa,
          gestite: grossesseData.grossesse.gestite,
          parite: grossesseData.grossesse.parite,
          grossesseMultiple: grossesseData.grossesse.grossesseMultiple,
          nombreFoetus: grossesseData.grossesse.nombreFoetus,
        })

        // Get last consultation
        if (grossesseData.grossesse.consultations && grossesseData.grossesse.consultations.length > 0) {
          const lastConsult = grossesseData.grossesse.consultations[0]
          setLastConsultation({
            date: lastConsult.date,
            poids: lastConsult.poids,
            tensionSystolique: lastConsult.tensionSystolique,
            tensionDiastolique: lastConsult.tensionDiastolique,
            hauteurUterine: lastConsult.hauteurUterine,
            bdc: lastConsult.bdc,
            saTerm: lastConsult.saTerm,
            saJours: lastConsult.saJours,
          })
        }
      }
    } catch (error) {
      console.error('Error fetching grossesse data:', error)
    }
  }

  const handleGenerate = () => {
    if (!documentType || !patient) return

    // VALIDATION PRATICIEN
    if (!praticien || !praticien.address) {
      alert('Complétez vos paramètres praticien avant de générer des documents')
      navigate('/parametres/praticien')
      return
    }

    setIsGenerating(true)

    try {
      let doc

      switch (documentType) {
        case 'declarationGrossesse':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.declarationGrossesse(patient, grossesse, praticien)
          break

        case 'certificatGrossesse':
          if (!grossesse || !lastConsultation) {
            alert('Données de grossesse requises')
            return
          }
          doc = documentTemplates.certificatGrossesse(patient, grossesse, lastConsultation, praticien, certificatOptions)
          break

        case 'arretTravail':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.arretTravail(patient, grossesse, arretData.dateDebut, arretData.dateFin, arretData.motif, praticien)
          break

        case 'ordonnanceBiologie':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.ordonnanceBiologie(patient, grossesse, biologieData.examens, biologieData.indication, praticien)
          break

        case 'bilanPreEclampsie':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.bilanPreEclampsie(patient, grossesse, biologieData.indication, praticien)
          break

        case 'bilanCholestase':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.bilanCholestase(patient, grossesse, biologieData.indication, praticien)
          break

        case 'bilanDiabeteGestationnel':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.bilanDiabeteGestationnel(patient, grossesse, biologieData.indication, praticien)
          break

        case 'bilanAnemie':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.bilanAnemie(patient, grossesse, biologieData.indication, praticien)
          break

        case 'demandeEchographie':
          if (!grossesse || !echoData.type) {
            alert('Données requises')
            return
          }
          doc = documentTemplates.demandeEchographie(patient, grossesse, echoData.type, echoData.indication, praticien)
          break

        case 'compteRenduConsultation':
          if (!lastConsultation) {
            alert('Aucune consultation disponible')
            return
          }
          doc = documentTemplates.compteRenduConsultation(
            patient,
            grossesse,
            lastConsultation,
            compteRenduData.observations,
            compteRenduData.destinataire,
            praticien
          )
          break
      }

      if (doc) {
        const filename = `${documentType}_${patient.lastName}_${new Date().toISOString().split('T')[0]}.pdf`
        doc.save(filename)
      }
    } catch (error) {
      console.error('Error generating document:', error)
      alert('Erreur lors de la génération du document')
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleExamen = (examen: string) => {
    setBiologieData((prev) => ({
      ...prev,
      examens: prev.examens.includes(examen)
        ? prev.examens.filter((e) => e !== examen)
        : [...prev.examens, examen],
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Générateur de documents</h1>
          {patient && (
            <p className="text-slate-500 mt-1">
              Pour {patient.firstName} {patient.lastName}
            </p>
          )}
        </div>
      </div>

      {!praticien?.address && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Paramètres praticien incomplets</AlertTitle>
          <AlertDescription>
            Complétez vos informations de cabinet pour générer des documents valides.{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-red-600 underline"
              onClick={() => navigate('/parametres/praticien')}
            >
              Accéder aux paramètres
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!patientIdFromUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Patiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Sélectionnez une patiente</Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une patiente..." />
                </SelectTrigger>
                <SelectContent>
                  {allPatients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {patient && allGrossesses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grossesse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Sélectionnez une grossesse</Label>
              <Select value={selectedGrossesseId} onValueChange={setSelectedGrossesseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une grossesse..." />
                </SelectTrigger>
                <SelectContent>
                  {allGrossesses.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      DDR: {new Date(g.ddr).toLocaleDateString('fr-FR')} - {g.statut === 'en_cours' ? '(En cours)' : g.statut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Type de document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sélectionnez le type de document à générer</Label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un document..." />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {documentType === 'certificatGrossesse' && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Options du certificat</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="apteTravail"
                    checked={certificatOptions.apteTravail}
                    onChange={(e) => setCertificatOptions({ ...certificatOptions, apteTravail: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="apteTravail">Apte au travail</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pathologique"
                    checked={certificatOptions.pathologique}
                    onChange={(e) => setCertificatOptions({ ...certificatOptions, pathologique: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="pathologique">Grossesse pathologique</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observations">Observations complémentaires</Label>
                  <Textarea
                    id="observations"
                    value={certificatOptions.observations}
                    onChange={(e) => setCertificatOptions({ ...certificatOptions, observations: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {documentType === 'arretTravail' && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Période d'arrêt</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={arretData.dateDebut}
                    onChange={(e) => setArretData({ ...arretData, dateDebut: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFin">Date de fin</Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={arretData.dateFin}
                    onChange={(e) => setArretData({ ...arretData, dateFin: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motif">Motif médical</Label>
                <Textarea
                  id="motif"
                  value={arretData.motif}
                  onChange={(e) => setArretData({ ...arretData, motif: e.target.value })}
                  placeholder="Ex: Menace d'accouchement prématuré, HTA gravidique..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {documentType === 'ordonnanceBiologie' && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="font-medium mb-2">Examens à prescrire</h3>
                <p className="text-sm text-slate-600 mb-3">Cochez les examens souhaités ou ajoutez des examens personnalisés</p>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4 bg-slate-50">
                {EXAMENS_BIOLOGIE.map((examen) => (
                  <div key={examen} className="flex items-center gap-2 hover:bg-white p-1 rounded">
                    <input
                      type="checkbox"
                      id={examen}
                      checked={biologieData.examens.includes(examen)}
                      onChange={() => toggleExamen(examen)}
                      className="rounded"
                    />
                    <Label htmlFor={examen} className="cursor-pointer flex-1">
                      {examen}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Label htmlFor="customExamen" className="font-medium text-blue-900">Ajouter un examen personnalisé</Label>
                <div className="flex gap-2">
                  <Input
                    id="customExamen"
                    placeholder="Ex: Vitamine D, Ferritine..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const newExamen = e.currentTarget.value.trim()
                        if (!biologieData.examens.includes(newExamen)) {
                          setBiologieData({
                            ...biologieData,
                            examens: [...biologieData.examens, newExamen]
                          })
                          e.currentTarget.value = ''
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = document.getElementById('customExamen') as HTMLInputElement
                      if (input && input.value.trim()) {
                        const newExamen = input.value.trim()
                        if (!biologieData.examens.includes(newExamen)) {
                          setBiologieData({
                            ...biologieData,
                            examens: [...biologieData.examens, newExamen]
                          })
                          input.value = ''
                        }
                      }
                    }}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indication" className="font-medium">Indication clinique</Label>
                <Textarea
                  id="indication"
                  value={biologieData.indication}
                  onChange={(e) => setBiologieData({ ...biologieData, indication: e.target.value })}
                  placeholder="Ex: Suivi de grossesse - Bilan du 2ème trimestre, Suspicion d'anémie ferriprive..."
                  rows={3}
                />
              </div>

              {biologieData.examens.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-2">
                    ✓ {biologieData.examens.length} examen(s) sélectionné(s)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {biologieData.examens.map((examen) => (
                      <span
                        key={examen}
                        className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border"
                      >
                        {examen}
                        <button
                          onClick={() => {
                            setBiologieData({
                              ...biologieData,
                              examens: biologieData.examens.filter(e => e !== examen)
                            })
                          }}
                          className="text-red-600 hover:text-red-800 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(documentType === 'bilanPreEclampsie' ||
            documentType === 'bilanCholestase' ||
            documentType === 'bilanDiabeteGestationnel' ||
            documentType === 'bilanAnemie') && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Bilan biologique spécialisé</h3>
              <p className="text-sm text-slate-600">
                {documentType === 'bilanPreEclampsie' && 'Ce bilan comprend les examens standards pour le diagnostic de pré-éclampsie.'}
                {documentType === 'bilanCholestase' && 'Ce bilan comprend les examens standards pour le diagnostic de cholestase gravidique.'}
                {documentType === 'bilanDiabeteGestationnel' && 'Ce bilan comprend les examens standards pour le dépistage et la surveillance du diabète gestationnel.'}
                {documentType === 'bilanAnemie' && 'Ce bilan comprend les examens standards pour le diagnostic étiologique d\'anémie.'}
              </p>
              <div className="space-y-2">
                <Label htmlFor="indicationBilan">Indication complémentaire (optionnelle)</Label>
                <Textarea
                  id="indicationBilan"
                  value={biologieData.indication}
                  onChange={(e) => setBiologieData({ ...biologieData, indication: e.target.value })}
                  placeholder="Ajouter des précisions cliniques si nécessaire..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {documentType === 'demandeEchographie' && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Type d'échographie</h3>
              <Select value={echoData.type} onValueChange={(value: any) => setEchoData({ ...echoData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T1">Échographie du 1er trimestre (11-14 SA)</SelectItem>
                  <SelectItem value="T2">Échographie du 2ème trimestre (22-24 SA)</SelectItem>
                  <SelectItem value="T3">Échographie du 3ème trimestre (32-34 SA)</SelectItem>
                  <SelectItem value="croissance">Échographie de croissance</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <Label htmlFor="indicationEcho">Indication / Renseignements cliniques</Label>
                <Textarea
                  id="indicationEcho"
                  value={echoData.indication}
                  onChange={(e) => setEchoData({ ...echoData, indication: e.target.value })}
                  placeholder="Ex: Contrôle croissance, suspicion RCIU..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {documentType === 'compteRenduConsultation' && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Compte-rendu</h3>
              <div className="space-y-2">
                <Label htmlFor="destinataire">Destinataire</Label>
                <Input
                  id="destinataire"
                  value={compteRenduData.destinataire}
                  onChange={(e) => setCompteRenduData({ ...compteRenduData, destinataire: e.target.value })}
                  placeholder="Dr Nom ou Sage-femme Nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observationsCR">Observations de la consultation</Label>
                <Textarea
                  id="observationsCR"
                  value={compteRenduData.observations}
                  onChange={(e) => setCompteRenduData({ ...compteRenduData, observations: e.target.value })}
                  rows={6}
                  placeholder="Résumé de la consultation, examens réalisés, conduite à tenir..."
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {documentType && (
        <div className="flex gap-2">
          <Button onClick={handleGenerate} disabled={isGenerating || !patient} size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Générer et télécharger le PDF
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
