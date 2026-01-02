import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { FileText, Download, ArrowLeft, Loader2 } from 'lucide-react'
import {
  documentTemplates,
  type PatientData,
  type GrossesseData,
  type ConsultationData,
  type PraticienData,
  type DocumentType,
} from '../../lib/documentTemplates'

const DOCUMENT_TYPES = [
  { value: 'declarationGrossesse', label: 'Déclaration de grossesse' },
  { value: 'certificatGrossesse', label: 'Certificat de grossesse' },
  { value: 'arretTravail', label: 'Arrêt de travail (grossesse pathologique)' },
  { value: 'ordonnanceBiologie', label: 'Ordonnance - Biologie' },
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
  const patientId = searchParams.get('patientId')
  const grossesseId = searchParams.get('grossesseId')

  const [isLoading, setIsLoading] = useState(true)
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
    if (patientId) {
      fetchPatientData()
    } else {
      setIsLoading(false)
    }
  }, [patientId])

  const fetchPatientData = async () => {
    try {
      const patientRes = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${patientId}`, {
        credentials: 'include',
      })
      const patientData = await patientRes.json()

      if (patientData.success) {
        setPatient(patientData.patient)
      }

      if (grossesseId) {
        const grossesseRes = await fetch(`${import.meta.env.VITE_API_URL}/api/grossesses/${grossesseId}`, {
          credentials: 'include',
        })
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
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = () => {
    if (!documentType || !patient) return

    setIsGenerating(true)

    try {
      let doc

      switch (documentType) {
        case 'declarationGrossesse':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.declarationGrossesse(patient, grossesse)
          break

        case 'certificatGrossesse':
          if (!grossesse || !lastConsultation) {
            alert('Données de grossesse requises')
            return
          }
          doc = documentTemplates.certificatGrossesse(patient, grossesse, lastConsultation, undefined, certificatOptions)
          break

        case 'arretTravail':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.arretTravail(patient, grossesse, arretData.dateDebut, arretData.dateFin, arretData.motif)
          break

        case 'ordonnanceBiologie':
          if (!grossesse) {
            alert('Sélectionnez une grossesse')
            return
          }
          doc = documentTemplates.ordonnanceBiologie(patient, grossesse, biologieData.examens, biologieData.indication)
          break

        case 'demandeEchographie':
          if (!grossesse || !echoData.type) {
            alert('Données requises')
            return
          }
          doc = documentTemplates.demandeEchographie(patient, grossesse, echoData.type, echoData.indication)
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
            compteRenduData.destinataire
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
              <h3 className="font-medium">Examens à prescrire</h3>
              <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto border rounded-lg p-4">
                {EXAMENS_BIOLOGIE.map((examen) => (
                  <div key={examen} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={examen}
                      checked={biologieData.examens.includes(examen)}
                      onChange={() => toggleExamen(examen)}
                      className="rounded"
                    />
                    <Label htmlFor={examen} className="cursor-pointer">
                      {examen}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="indication">Indication</Label>
                <Input
                  id="indication"
                  value={biologieData.indication}
                  onChange={(e) => setBiologieData({ ...biologieData, indication: e.target.value })}
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
