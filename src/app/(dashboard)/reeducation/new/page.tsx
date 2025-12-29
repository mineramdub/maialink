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
  Activity,
} from 'lucide-react'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

const EXERCICES = [
  'Contraction perinee',
  'Relaxation',
  'Verrou perineal',
  'Coordination respiration',
  'Travail abdominal',
  'Posture',
  'Proprioception',
]

export default function NouvelleSeanceReeducationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientIdParam = searchParams.get('patient')

  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    patientId: patientIdParam || '',
    numeroSeance: 1,
    date: new Date().toISOString().split('T')[0],
    testingPerineal: '',
    testingAbdominaux: '',
    exercicesRealises: [] as string[],
    biofeedback: false,
    electrostimulation: false,
    observations: '',
    evolution: '',
  })

  useEffect(() => {
    fetchPatients()
  }, [])

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
    router.push('/reeducation')
  }

  const toggleExercice = (exercice: string) => {
    setFormData((prev) => ({
      ...prev,
      exercicesRealises: prev.exercicesRealises.includes(exercice)
        ? prev.exercicesRealises.filter((e) => e !== exercice)
        : [...prev.exercicesRealises, exercice],
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/reeducation">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Nouvelle seance de reeducation
          </h1>
          <p className="text-slate-500">
            Enregistrez une seance de reeducation perineale
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient et date */}
        <Card>
          <CardHeader>
            <CardTitle>Informations generales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Numero de seance</Label>
              <Select
                value={formData.numeroSeance.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, numeroSeance: parseInt(value) })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      Seance {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bilan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Bilan perineal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Testing perineal (0-5)</Label>
                <Select
                  value={formData.testingPerineal}
                  onValueChange={(value) =>
                    setFormData({ ...formData, testingPerineal: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} - {n === 0 ? 'Aucune contraction' : n === 5 ? 'Excellente force' : `Force ${n}/5`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Testing abdominaux (0-5)</Label>
                <Select
                  value={formData.testingAbdominaux}
                  onValueChange={(value) =>
                    setFormData({ ...formData, testingAbdominaux: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}/5
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercices */}
        <Card>
          <CardHeader>
            <CardTitle>Exercices realises</CardTitle>
            <CardDescription>
              Selectionnez les exercices effectues pendant la seance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {EXERCICES.map((exercice) => (
                <button
                  key={exercice}
                  type="button"
                  onClick={() => toggleExercice(exercice)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    formData.exercicesRealises.includes(exercice)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {exercice}
                </button>
              ))}
            </div>

            <div className="flex gap-6 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.biofeedback}
                  onChange={(e) =>
                    setFormData({ ...formData, biofeedback: e.target.checked })
                  }
                  className="rounded border-slate-300"
                />
                <span className="text-sm">Biofeedback</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.electrostimulation}
                  onChange={(e) =>
                    setFormData({ ...formData, electrostimulation: e.target.checked })
                  }
                  className="rounded border-slate-300"
                />
                <span className="text-sm">Electrostimulation</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Observations */}
        <Card>
          <CardHeader>
            <CardTitle>Observations et evolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Observations</Label>
              <Textarea
                placeholder="Notes sur la seance..."
                value={formData.observations}
                onChange={(e) =>
                  setFormData({ ...formData, observations: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Evolution</Label>
              <Textarea
                placeholder="Evolution par rapport a la seance precedente..."
                value={formData.evolution}
                onChange={(e) =>
                  setFormData({ ...formData, evolution: e.target.value })
                }
                rows={3}
              />
            </div>
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
            <Link href="/reeducation">Annuler</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSaving || !formData.patientId}
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Enregistrer la seance
          </Button>
        </div>
      </form>
    </div>
  )
}
