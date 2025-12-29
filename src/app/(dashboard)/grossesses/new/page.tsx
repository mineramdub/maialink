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
  Baby,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import { calculateDPA, formatDate } from '@/lib/utils'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gravida: number
  para: number
}

const FACTEURS_RISQUE = [
  'Diabete gestationnel anterieur',
  'Pre-eclampsie anterieure',
  'Hypertension arterielle',
  'Diabete type 1 ou 2',
  'Obesite (IMC > 30)',
  'Age maternel > 35 ans',
  'Antecedent de prematurite',
  'Antecedent de RCIU',
  'Grossesse multiple',
  'FIV/PMA',
  'Maladie auto-immune',
  'Thrombophilie',
  'Cardiopathie',
  'Epilepsie',
  'Tabagisme actif',
]

export default function NouvelleGrossessePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientIdParam = searchParams.get('patient')

  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    patientId: patientIdParam || '',
    ddr: '',
    grossesseMultiple: false,
    nombreFoetus: 1,
    facteursRisque: [] as string[],
    notes: '',
  })

  const [dpaCalculee, setDpaCalculee] = useState<Date | null>(null)

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    if (formData.ddr) {
      const ddr = new Date(formData.ddr)
      const dpa = calculateDPA(ddr)
      setDpaCalculee(dpa)
    } else {
      setDpaCalculee(null)
    }
  }, [formData.ddr])

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

    try {
      const res = await fetch('/api/grossesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        router.push(`/grossesses/${data.grossesse.id}`)
      } else {
        setError(data.error || 'Erreur lors de la creation')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleFacteurRisque = (facteur: string) => {
    setFormData((prev) => ({
      ...prev,
      facteursRisque: prev.facteursRisque.includes(facteur)
        ? prev.facteursRisque.filter((f) => f !== facteur)
        : [...prev.facteursRisque, facteur],
    }))
  }

  const selectedPatient = patients.find((p) => p.id === formData.patientId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/grossesses">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Declarer une grossesse
          </h1>
          <p className="text-slate-500">
            Enregistrez une nouvelle grossesse pour une patiente
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selection patiente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-pink-500" />
              Patiente
            </CardTitle>
            <CardDescription>
              Selectionnez la patiente concernee
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            {selectedPatient && (
              <div className="p-4 rounded-lg bg-slate-50 border">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-500">Date de naissance</p>
                    <p className="font-medium">
                      {formatDate(selectedPatient.birthDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Gestite</p>
                    <p className="font-medium">G{selectedPatient.gravida || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Parite</p>
                    <p className="font-medium">P{selectedPatient.para || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pink-500" />
              Dates
            </CardTitle>
            <CardDescription>
              Date des dernieres regles et calcul de la DPA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Date des dernieres regles (DDR) *</Label>
                <Input
                  type="date"
                  value={formData.ddr}
                  onChange={(e) =>
                    setFormData({ ...formData, ddr: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Date prevue d'accouchement (DPA)</Label>
                <div className="flex h-10 items-center px-3 rounded-md border bg-slate-50">
                  {dpaCalculee ? (
                    <span className="font-medium text-pink-600">
                      {formatDate(dpaCalculee.toISOString())}
                    </span>
                  ) : (
                    <span className="text-slate-400">Calculee automatiquement</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Grossesse multiple ?</Label>
                <Select
                  value={formData.grossesseMultiple ? 'oui' : 'non'}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      grossesseMultiple: value === 'oui',
                      nombreFoetus: value === 'oui' ? 2 : 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non">Non</SelectItem>
                    <SelectItem value="oui">Oui</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.grossesseMultiple && (
                <div className="space-y-2">
                  <Label>Nombre de foetus</Label>
                  <Select
                    value={formData.nombreFoetus.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, nombreFoetus: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 (jumeaux)</SelectItem>
                      <SelectItem value="3">3 (triples)</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Facteurs de risque */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Facteurs de risque
            </CardTitle>
            <CardDescription>
              Selectionnez les facteurs de risque eventuels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {FACTEURS_RISQUE.map((facteur) => (
                <button
                  key={facteur}
                  type="button"
                  onClick={() => toggleFacteurRisque(facteur)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    formData.facteursRisque.includes(facteur)
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {facteur}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Notes complementaires..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/grossesses">Annuler</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSaving || !formData.patientId || !formData.ddr}
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Declarer la grossesse
          </Button>
        </div>
      </form>
    </div>
  )
}
