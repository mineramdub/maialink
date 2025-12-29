'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Loader2, Save, AlertTriangle } from 'lucide-react'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

function NewConsultationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get('patient')
  const grossesseId = searchParams.get('grossesse')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [alerts, setAlerts] = useState<Array<{ type: string; message: string; severity: string }>>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    grossesseId: grossesseId || '',
    type: 'prenatale',
    date: new Date().toISOString().slice(0, 16),
    duree: 30,
    motif: '',
    poids: '',
    taille: '',
    tensionSystolique: '',
    tensionDiastolique: '',
    pouls: '',
    temperature: '',
    hauteurUterine: '',
    bdc: '',
    mouvementsFoetaux: true,
    presentationFoetale: '',
    proteineUrinaire: 'negatif',
    glucoseUrinaire: 'negatif',
    leucocytesUrinaires: 'negatif',
    nitritesUrinaires: 'negatif',
    examenClinique: '',
    conclusion: '',
    prescriptions: '',
  })

  useEffect(() => {
    if (!patientId) {
      fetchPatients()
    }
  }, [patientId])

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients?status=active')
      const data = await res.json()
      if (data.success) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          poids: formData.poids ? parseFloat(formData.poids) : undefined,
          taille: formData.taille ? parseInt(formData.taille) : undefined,
          tensionSystolique: formData.tensionSystolique ? parseInt(formData.tensionSystolique) : undefined,
          tensionDiastolique: formData.tensionDiastolique ? parseInt(formData.tensionDiastolique) : undefined,
          pouls: formData.pouls ? parseInt(formData.pouls) : undefined,
          temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
          hauteurUterine: formData.hauteurUterine ? parseInt(formData.hauteurUterine) : undefined,
          bdc: formData.bdc ? parseInt(formData.bdc) : undefined,
          grossesseId: formData.grossesseId || undefined,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        return
      }

      if (data.alerts && data.alerts.length > 0) {
        setAlerts(data.alerts)
      }

      router.push(`/patients/${formData.patientId}`)
    } catch {
      setError('Erreur lors de la creation de la consultation')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={patientId ? `/patients/${patientId}` : '/consultations'}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Nouvelle consultation</h1>
          <p className="text-slate-500 mt-1">Saisir les donnees de la consultation</p>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                alert.severity === 'critical'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations generales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations generales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!patientId && (
              <div className="space-y-2">
                <Label>Patiente *</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(v) => updateField('patientId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner une patiente" />
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
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Type de consultation *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => updateField('type', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prenatale">Prenatale</SelectItem>
                    <SelectItem value="postnatale">Postnatale</SelectItem>
                    <SelectItem value="gyneco">Gynecologie</SelectItem>
                    <SelectItem value="reeducation">Reeducation</SelectItem>
                    <SelectItem value="preparation">Preparation</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date et heure *</Label>
                <Input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Duree (min)</Label>
                <Input
                  type="number"
                  value={formData.duree}
                  onChange={(e) => updateField('duree', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Motif de consultation</Label>
              <Input
                value={formData.motif}
                onChange={(e) => updateField('motif', e.target.value)}
                placeholder="Suivi mensuel, douleurs, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Constantes */}
        <Card>
          <CardHeader>
            <CardTitle>Constantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>Poids (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.poids}
                  onChange={(e) => updateField('poids', e.target.value)}
                  placeholder="65.5"
                />
              </div>
              <div className="space-y-2">
                <Label>Taille (cm)</Label>
                <Input
                  type="number"
                  value={formData.taille}
                  onChange={(e) => updateField('taille', e.target.value)}
                  placeholder="165"
                />
              </div>
              <div className="space-y-2">
                <Label>TA systolique</Label>
                <Input
                  type="number"
                  value={formData.tensionSystolique}
                  onChange={(e) => updateField('tensionSystolique', e.target.value)}
                  placeholder="120"
                />
              </div>
              <div className="space-y-2">
                <Label>TA diastolique</Label>
                <Input
                  type="number"
                  value={formData.tensionDiastolique}
                  onChange={(e) => updateField('tensionDiastolique', e.target.value)}
                  placeholder="80"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>Pouls (bpm)</Label>
                <Input
                  type="number"
                  value={formData.pouls}
                  onChange={(e) => updateField('pouls', e.target.value)}
                  placeholder="75"
                />
              </div>
              <div className="space-y-2">
                <Label>Temperature (C)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => updateField('temperature', e.target.value)}
                  placeholder="37.0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examen obstetrical */}
        {(formData.type === 'prenatale' || grossesseId) && (
          <Card>
            <CardHeader>
              <CardTitle>Examen obstetrical</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label>Hauteur uterine (cm)</Label>
                  <Input
                    type="number"
                    value={formData.hauteurUterine}
                    onChange={(e) => updateField('hauteurUterine', e.target.value)}
                    placeholder="28"
                  />
                </div>
                <div className="space-y-2">
                  <Label>BDC foetal (bpm)</Label>
                  <Input
                    type="number"
                    value={formData.bdc}
                    onChange={(e) => updateField('bdc', e.target.value)}
                    placeholder="140"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Presentation</Label>
                  <Select
                    value={formData.presentationFoetale}
                    onValueChange={(v) => updateField('presentationFoetale', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cephalique">Cephalique</SelectItem>
                      <SelectItem value="siege">Siege</SelectItem>
                      <SelectItem value="transverse">Transverse</SelectItem>
                      <SelectItem value="non_determinee">Non determinee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mvts foetaux</Label>
                  <Select
                    value={formData.mouvementsFoetaux ? 'oui' : 'non'}
                    onValueChange={(v) => updateField('mouvementsFoetaux', v === 'oui')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oui">Percus</SelectItem>
                      <SelectItem value="non">Non percus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bandelette urinaire */}
        <Card>
          <CardHeader>
            <CardTitle>Bandelette urinaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>Proteines</Label>
                <Select
                  value={formData.proteineUrinaire}
                  onValueChange={(v) => updateField('proteineUrinaire', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negatif">Negatif</SelectItem>
                    <SelectItem value="traces">Traces</SelectItem>
                    <SelectItem value="+">+</SelectItem>
                    <SelectItem value="++">++</SelectItem>
                    <SelectItem value="+++">+++</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Glucose</Label>
                <Select
                  value={formData.glucoseUrinaire}
                  onValueChange={(v) => updateField('glucoseUrinaire', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negatif">Negatif</SelectItem>
                    <SelectItem value="traces">Traces</SelectItem>
                    <SelectItem value="+">+</SelectItem>
                    <SelectItem value="++">++</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Leucocytes</Label>
                <Select
                  value={formData.leucocytesUrinaires}
                  onValueChange={(v) => updateField('leucocytesUrinaires', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negatif">Negatif</SelectItem>
                    <SelectItem value="+">+</SelectItem>
                    <SelectItem value="++">++</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nitrites</Label>
                <Select
                  value={formData.nitritesUrinaires}
                  onValueChange={(v) => updateField('nitritesUrinaires', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negatif">Negatif</SelectItem>
                    <SelectItem value="positif">Positif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes cliniques */}
        <Card>
          <CardHeader>
            <CardTitle>Notes cliniques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Examen clinique</Label>
              <Textarea
                value={formData.examenClinique}
                onChange={(e) => updateField('examenClinique', e.target.value)}
                placeholder="Description de l'examen clinique..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Conclusion</Label>
              <Textarea
                value={formData.conclusion}
                onChange={(e) => updateField('conclusion', e.target.value)}
                placeholder="Conclusion et conduite a tenir..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Prescriptions</Label>
              <Textarea
                value={formData.prescriptions}
                onChange={(e) => updateField('prescriptions', e.target.value)}
                placeholder="Prescriptions et examens a realiser..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={patientId ? `/patients/${patientId}` : '/consultations'}>
              Annuler
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading || !formData.patientId}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function NewConsultationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <NewConsultationForm />
    </Suspense>
  )
}
