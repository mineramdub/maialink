'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Save,
  Loader2,
  FileText,
  Printer,
  Download,
  Eye,
  Edit3,
} from 'lucide-react'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  address?: string
  city?: string
  postalCode?: string
  phoneNumber?: string
  securityNumber?: string
}

const DOCUMENT_TYPES = [
  { id: 'ordonnance', label: 'Ordonnance', icon: '📋' },
  { id: 'certificat', label: 'Certificat medical', icon: '📜' },
  { id: 'courrier', label: 'Courrier', icon: '✉️' },
  { id: 'declaration_grossesse', label: 'Declaration de grossesse', icon: '🤰' },
  { id: 'compte_rendu', label: 'Compte rendu', icon: '📝' },
  { id: 'autre', label: 'Autre document', icon: '📄' },
]

export default function NouveauDocumentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientIdParam = searchParams.get('patient')
  const typeParam = searchParams.get('type')
  const documentRef = useRef<HTMLDivElement>(null)

  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    patientId: patientIdParam || '',
    type: typeParam || 'ordonnance',
    titre: 'Ordonnance',
    prescriptions: '',
    observations: '',
    destinataire: '',
    objet: '',
  })

  const selectedPatient = patients.find((p) => p.id === formData.patientId)

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    const type = DOCUMENT_TYPES.find((t) => t.id === formData.type)
    if (type) {
      setFormData((prev) => ({ ...prev, titre: type.label }))
    }
  }, [formData.type])

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients')
      const data = await res.json()
      if (data.success) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/documents')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = async () => {
    if (!documentRef.current) return

    setIsExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      const fileName = `${formData.type}_${selectedPatient?.lastName || 'document'}_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      setError('Erreur lors de l\'export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
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
      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/documents">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Nouveau document
            </h1>
            <p className="text-slate-500">
              Creez et exportez un document PDF
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Editer' : 'Apercu'}
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleExportPDF} disabled={isExporting || !selectedPatient}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Exporter PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulaire */}
        <div className="space-y-4 no-print">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-500" />
                Informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Type de document *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Patiente *</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, patientId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez une patiente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'courrier' && (
                <>
                  <div className="space-y-2">
                    <Label>Destinataire</Label>
                    <Input
                      value={formData.destinataire}
                      onChange={(e) =>
                        setFormData({ ...formData, destinataire: e.target.value })
                      }
                      placeholder="Dr. Martin, Gynecologue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Objet</Label>
                    <Input
                      value={formData.objet}
                      onChange={(e) =>
                        setFormData({ ...formData, objet: e.target.value })
                      }
                      placeholder="Suivi de grossesse"
                    />
                  </div>
                </>
              )}

              {(formData.type === 'ordonnance' || formData.type === 'certificat') && (
                <div className="space-y-2">
                  <Label>
                    {formData.type === 'ordonnance' ? 'Prescriptions' : 'Contenu du certificat'}
                  </Label>
                  <Textarea
                    value={formData.prescriptions}
                    onChange={(e) =>
                      setFormData({ ...formData, prescriptions: e.target.value })
                    }
                    rows={6}
                    placeholder={
                      formData.type === 'ordonnance'
                        ? "- Acide folique 0.4mg\n  1 comprime par jour\n\n- Fer 80mg\n  1 comprime par jour au repas"
                        : "Je soussignee, certifie avoir examine ce jour..."
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Observations / Notes</Label>
                <Textarea
                  value={formData.observations}
                  onChange={(e) =>
                    setFormData({ ...formData, observations: e.target.value })
                  }
                  rows={3}
                  placeholder="Notes supplementaires..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apercu du document */}
        <div className="print-only-full">
          <Card className="shadow-lg no-print-border">
            <CardHeader className="no-print">
              <CardTitle>Apercu du document</CardTitle>
              <CardDescription>
                Ce document sera exporte en PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={documentRef}
                className="bg-white p-8 min-h-[800px] border-t"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {/* En-tete */}
                <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Cabinet Sage-Femme</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      [Votre nom]<br />
                      [Adresse du cabinet]<br />
                      [Telephone] - [Email]
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      N° RPPS: [Numero]
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">
                      {formatDate(new Date())}
                    </p>
                  </div>
                </div>

                {/* Titre du document */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">
                    {formData.titre}
                  </h1>
                </div>

                {/* Infos patient */}
                {selectedPatient && (
                  <div className="mb-8 p-4 bg-slate-50 rounded-lg">
                    <p className="font-semibold text-slate-800">
                      Patient(e): {selectedPatient.firstName} {selectedPatient.lastName}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Ne(e) le: {new Date(selectedPatient.birthDate).toLocaleDateString('fr-FR')}
                    </p>
                    {selectedPatient.address && (
                      <p className="text-sm text-slate-600">
                        Adresse: {selectedPatient.address}, {selectedPatient.postalCode} {selectedPatient.city}
                      </p>
                    )}
                    {selectedPatient.securityNumber && (
                      <p className="text-sm text-slate-600">
                        N° SS: {selectedPatient.securityNumber}
                      </p>
                    )}
                  </div>
                )}

                {/* Contenu selon le type */}
                {formData.type === 'courrier' && formData.destinataire && (
                  <div className="mb-6">
                    <p className="font-medium">A l'attention de: {formData.destinataire}</p>
                    {formData.objet && (
                      <p className="mt-2">
                        <span className="font-medium">Objet:</span> {formData.objet}
                      </p>
                    )}
                    <p className="mt-4">Madame, Monsieur,</p>
                  </div>
                )}

                {/* Prescriptions / Contenu principal */}
                <div className="mb-8 min-h-[200px]">
                  {formData.prescriptions ? (
                    <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                      {formData.prescriptions}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">
                      {formData.type === 'ordonnance'
                        ? 'Les prescriptions apparaitront ici...'
                        : 'Le contenu du document apparaitra ici...'}
                    </p>
                  )}
                </div>

                {/* Observations */}
                {formData.observations && (
                  <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm font-medium text-amber-800">Observations:</p>
                    <p className="text-sm text-amber-700 mt-1">{formData.observations}</p>
                  </div>
                )}

                {/* Signature */}
                <div className="mt-12 flex justify-end">
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-12">
                      Fait a [Ville], le {formatDate(new Date())}
                    </p>
                    <div className="border-t border-slate-300 pt-2 w-48">
                      <p className="text-sm text-slate-600">Signature et cachet</p>
                    </div>
                  </div>
                </div>

                {/* Pied de page */}
                <div className="absolute bottom-8 left-8 right-8 text-center text-xs text-slate-400 border-t pt-4">
                  Document genere par MaiaLink - {formatDate(new Date())}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 no-print">
          {error}
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-only-full,
          .print-only-full * {
            visibility: visible;
          }
          .print-only-full {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .no-print-border {
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
