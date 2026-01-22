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

interface PractitionerInfo {
  firstName: string
  lastName: string
  rpps?: string
  adeli?: string
  numeroAM?: string
  phone?: string
  cabinetAddress?: string
  cabinetPostalCode?: string
  cabinetCity?: string
  specialite?: string
  typeStructure?: string
  nomStructure?: string
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
  const [practitioner, setPractitioner] = useState<PractitionerInfo | null>(null)
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
    fetchPractitionerInfo()
  }, [])

  useEffect(() => {
    const type = DOCUMENT_TYPES.find((t) => t.id === formData.type)
    if (type) {
      setFormData((prev) => ({ ...prev, titre: type.label }))
    }
  }, [formData.type])

  useEffect(() => {
    const generateBarcodes = async () => {
      if (!practitioner) return

      try {
        const JsBarcode = (await import('jsbarcode')).default

        if (practitioner.rpps) {
          const canvas = document.getElementById('barcode-rpps')
          if (canvas) {
            JsBarcode(canvas, practitioner.rpps, {
              format: 'CODE128',
              width: 1.5,
              height: 40,
              displayValue: true,
              fontSize: 10,
              margin: 2,
            })
          }
        }

        if (practitioner.numeroAM) {
          const canvas = document.getElementById('barcode-am')
          if (canvas) {
            JsBarcode(canvas, practitioner.numeroAM, {
              format: 'CODE128',
              width: 1.5,
              height: 40,
              displayValue: true,
              fontSize: 10,
              margin: 2,
            })
          }
        }
      } catch (error) {
        console.error('Error generating barcodes:', error)
      }
    }

    // Petit délai pour s'assurer que les canvas sont montés
    setTimeout(generateBarcodes, 100)
  }, [practitioner])

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

  const fetchPractitionerInfo = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setPractitioner(data.user)
      }
    } catch (error) {
      console.error('Error fetching practitioner info:', error)
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

      // Capture avec haute résolution pour une meilleure qualité
      const canvas = await html2canvas(documentRef.current, {
        scale: 3, // Augmenté de 2 à 3 pour une meilleure qualité
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: documentRef.current.scrollWidth,
        windowHeight: documentRef.current.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png', 1.0) // Qualité maximale
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const imgHeight = 297 // A4 height in mm

      // Ajouter l'image avec les dimensions exactes A4
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST')

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
                    rows={8}
                    placeholder={
                      formData.type === 'ordonnance'
                        ? "1) Acide folique 0,4mg\n   1 comprimé par jour, le matin à jeun\n   Durée : 3 mois\n\n2) Fer élément 80mg\n   1 comprimé par jour au cours du repas\n   Durée : jusqu'à normalisation de la ferritinémie"
                        : "Je soussignée, certifie avoir examiné ce jour..."
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
                className="bg-white relative"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  width: '210mm',
                  minHeight: '297mm',
                  padding: '20mm 15mm',
                  margin: '0 auto'
                }}
              >
                {/* Bordure décorative */}
                <div className="absolute inset-0 border-4 border-double border-blue-900" style={{ margin: '5mm' }}></div>

                <div className="relative" style={{ minHeight: '257mm' }}>
                  {/* En-tête professionnel */}
                  <div className="flex justify-between items-start mb-6 pb-4" style={{ borderBottom: '2px solid #1e40af' }}>
                    <div style={{ flex: 1 }}>
                      {practitioner?.nomStructure && (
                        <div className="text-base font-bold text-blue-900 uppercase" style={{ letterSpacing: '0.5px' }}>
                          {practitioner.nomStructure}
                        </div>
                      )}
                      <div className="mt-2 text-lg font-bold text-gray-900">
                        {practitioner?.firstName} {practitioner?.lastName}
                      </div>
                      {practitioner?.specialite && (
                        <div className="text-sm text-gray-700 italic mt-1">{practitioner.specialite}</div>
                      )}

                      {/* Coordonnées */}
                      <div className="mt-3 text-xs text-gray-600 leading-relaxed">
                        {practitioner?.cabinetAddress && <div>{practitioner.cabinetAddress}</div>}
                        {(practitioner?.cabinetPostalCode || practitioner?.cabinetCity) && (
                          <div>{practitioner.cabinetPostalCode} {practitioner.cabinetCity}</div>
                        )}
                        {practitioner?.phone && <div>Tél. : {practitioner.phone}</div>}
                      </div>
                    </div>

                    <div className="text-right">
                      {/* Date */}
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        {practitioner?.cabinetCity || '[Ville]'}, le {new Date().toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>

                      {/* Codes-barres */}
                      {(practitioner?.rpps || practitioner?.numeroAM) && (
                        <div className="space-y-2 mt-4">
                          {practitioner?.rpps && (
                            <canvas id="barcode-rpps" style={{ maxWidth: '110px', height: 'auto' }}></canvas>
                          )}
                          {practitioner?.numeroAM && (
                            <canvas id="barcode-am" style={{ maxWidth: '110px', height: 'auto' }}></canvas>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Titre */}
                  <div className="text-center my-6">
                    <h1 className="text-2xl font-bold uppercase tracking-widest" style={{
                      color: '#1e40af',
                      borderTop: '3px double #1e40af',
                      borderBottom: '3px double #1e40af',
                      padding: '12px 0',
                      letterSpacing: '3px'
                    }}>
                      {formData.titre}
                    </h1>
                  </div>

                  {/* Informations patient */}
                  {selectedPatient && (
                    <div className="mb-8 pb-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900 mb-1">
                          Patient(e) : <span className="uppercase">{selectedPatient.lastName}</span> {selectedPatient.firstName}
                        </div>
                        <div className="text-gray-700">
                          Né(e) le : {new Date(selectedPatient.birthDate).toLocaleDateString('fr-FR')}
                        </div>
                        {selectedPatient.securityNumber && (
                          <div className="text-gray-700">
                            N° Sécurité Sociale : {selectedPatient.securityNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contenu selon type */}
                  {formData.type === 'courrier' && formData.destinataire && (
                    <div className="mb-6">
                      <div className="font-medium mb-2">À l'attention de {formData.destinataire}</div>
                      {formData.objet && (
                        <div className="mb-4">
                          <span className="font-semibold">Objet :</span> {formData.objet}
                        </div>
                      )}
                      <div className="mt-4">Madame, Monsieur,</div>
                    </div>
                  )}

                  {/* Prescriptions */}
                  <div className="mb-8" style={{ minHeight: '200px' }}>
                    {formData.prescriptions ? (
                      <div className="text-gray-900" style={{
                        fontSize: '14px',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {formData.prescriptions.split('\n').map((line, index) => {
                          const trimmed = line.trim()
                          if (!trimmed) return <div key={index} style={{ height: '8px' }}></div>

                          // Si la ligne commence par un tiret ou un numéro
                          if (trimmed.match(/^[-•]\s/) || trimmed.match(/^\d+[.)]\s/)) {
                            return (
                              <div key={index} className="mb-3 pl-4" style={{
                                textIndent: '-16px',
                                fontWeight: '500'
                              }}>
                                {line}
                              </div>
                            )
                          }

                          // Sinon ligne normale (posologie, etc.)
                          return (
                            <div key={index} className="mb-1 pl-6 text-gray-700">
                              {line}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-400 italic text-center py-8">
                        {formData.type === 'ordonnance'
                          ? 'Les prescriptions apparaîtront ici...'
                          : 'Le contenu du document apparaîtra ici...'}
                      </div>
                    )}
                  </div>

                  {/* Observations */}
                  {formData.observations && (
                    <div className="mb-8 p-4" style={{
                      backgroundColor: '#fef3c7',
                      border: '1px solid #fbbf24',
                      borderLeft: '4px solid #f59e0b'
                    }}>
                      <div className="text-sm font-semibold text-amber-900 mb-2">Observations :</div>
                      <div className="text-sm text-amber-800">{formData.observations}</div>
                    </div>
                  )}

                  {/* Signature */}
                  <div className="absolute" style={{ bottom: '40mm', right: '15mm' }}>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-16">
                        Signature et cachet du praticien
                      </div>
                      <div style={{
                        borderTop: '1px solid #6b7280',
                        width: '180px',
                        paddingTop: '8px'
                      }}>
                        <div className="text-xs text-gray-500">
                          {practitioner?.firstName} {practitioner?.lastName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pied de page */}
                  <div className="absolute text-center text-xs" style={{
                    bottom: '10mm',
                    left: '15mm',
                    right: '15mm',
                    paddingTop: '8px',
                    borderTop: '1px solid #d1d5db',
                    color: '#6b7280'
                  }}>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        {practitioner?.rpps && <span>RPPS: {practitioner.rpps}</span>}
                        {practitioner?.adeli && <span>ADELI: {practitioner.adeli}</span>}
                        {practitioner?.numeroAM && <span>N°AM: {practitioner.numeroAM}</span>}
                      </div>
                      <div>Document généré le {new Date().toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
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
