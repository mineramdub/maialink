'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  address?: string
  city?: string
  postalCode?: string
}

const DOCUMENT_TYPES = [
  { id: 'ordonnance', label: 'Ordonnance', icon: '📋' },
  { id: 'certificat', label: 'Certificat medical', icon: '📜' },
  { id: 'courrier', label: 'Courrier', icon: '✉️' },
  { id: 'declaration_grossesse', label: 'Declaration de grossesse', icon: '🤰' },
  { id: 'compte_rendu', label: 'Compte rendu', icon: '📝' },
  { id: 'autre', label: 'Autre document', icon: '📄' },
]

const TEMPLATES: Record<string, string> = {
  ordonnance: `Ordonnance

Patient(e): {{patient_nom}}
Date de naissance: {{patient_naissance}}

---

[Prescriptions]




---

Date: {{date}}
Signature:`,
  certificat: `Certificat Medical

Je soussigne(e), [Votre nom], sage-femme,
certifie avoir examine ce jour:

{{patient_nom}}
ne(e) le {{patient_naissance}}

[Contenu du certificat]




Fait a [Ville], le {{date}}

Signature:`,
  declaration_grossesse: `Declaration de Grossesse

Patient(e): {{patient_nom}}
Date de naissance: {{patient_naissance}}
Adresse: {{patient_adresse}}

Date des dernieres regles:
Date presumee de conception:
Date prevue d'accouchement:

Premier examen prenatal realise le: {{date}}

Signature de la sage-femme:`,
  courrier: `[Votre cabinet]
[Adresse]
[Telephone]

A [Ville], le {{date}}

A l'attention de [Destinataire]

Objet: [Objet du courrier]

Madame, Monsieur,

Concernant la patiente {{patient_nom}}, nee le {{patient_naissance}}.

[Corps du courrier]




Veuillez agreer, Madame, Monsieur, l'expression de mes salutations distinguees.

[Votre nom]
Sage-femme`,
}

export default function NouveauDocumentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientIdParam = searchParams.get('patient')
  const typeParam = searchParams.get('type')

  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    patientId: patientIdParam || '',
    type: typeParam || '',
    titre: '',
    contenu: '',
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    if (formData.type && TEMPLATES[formData.type]) {
      let template = TEMPLATES[formData.type]
      const patient = patients.find((p) => p.id === formData.patientId)

      if (patient) {
        template = template
          .replace(/\{\{patient_nom\}\}/g, `${patient.firstName} ${patient.lastName}`)
          .replace(/\{\{patient_naissance\}\}/g, new Date(patient.birthDate).toLocaleDateString('fr-FR'))
          .replace(/\{\{patient_adresse\}\}/g, `${patient.address || ''}, ${patient.postalCode || ''} ${patient.city || ''}`)
      }

      template = template.replace(/\{\{date\}\}/g, new Date().toLocaleDateString('fr-FR'))

      setFormData((prev) => ({
        ...prev,
        contenu: template,
        titre: DOCUMENT_TYPES.find((t) => t.id === formData.type)?.label || '',
      }))
    }
  }, [formData.type, formData.patientId, patients])

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

    // TODO: Implement API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/documents')
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              Creez un document pour une patiente
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handlePrint} className="no-print">
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type et patient */}
        <Card className="no-print">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <div className="space-y-2">
              <Label>Titre du document</Label>
              <Input
                value={formData.titre}
                onChange={(e) =>
                  setFormData({ ...formData, titre: e.target.value })
                }
                placeholder="Titre du document"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contenu */}
        <Card>
          <CardHeader className="no-print">
            <CardTitle>Contenu du document</CardTitle>
            <CardDescription>
              Modifiez le contenu selon vos besoins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.contenu}
              onChange={(e) =>
                setFormData({ ...formData, contenu: e.target.value })
              }
              rows={20}
              className="font-mono text-sm"
              placeholder="Contenu du document..."
            />
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 no-print">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 no-print">
          <Button type="button" variant="outline" asChild>
            <Link href="/documents">Annuler</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSaving || !formData.patientId || !formData.type}
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}
