import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

export default function NewReeducationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')

  const [isLoading, setIsLoading] = useState(false)
  const [patient, setPatient] = useState<any>(null)
  const [formData, setFormData] = useState({
    dateDebut: new Date().toISOString().split('T')[0],
    motif: '',
    nombreSeancesPrevues: 5,
    notes: '',
  })

  useEffect(() => {
    if (patientId) {
      fetchPatient()
    }
  }, [patientId])

  const fetchPatient = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/patients/${patientId}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success) {
        setPatient(data.patient)
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!patientId) {
      alert('Patiente non sélectionnée')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reeducation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            patientId,
            ...formData,
          }),
        }
      )

      const data = await res.json()

      if (data.success) {
        // Rediriger vers la page de détail du parcours
        navigate(`/reeducation/${data.parcours.id}`)
      } else {
        alert(data.error || 'Erreur lors de la création du parcours')
      }
    } catch (error) {
      console.error('Error creating parcours:', error)
      alert('Erreur lors de la création du parcours')
    } finally {
      setIsLoading(false)
    }
  }

  if (!patientId) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-slate-600">
              Aucune patiente sélectionnée
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Nouveau parcours de rééducation
          </h1>
          {patient && (
            <p className="text-slate-500 mt-1">
              {patient.firstName} {patient.lastName}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du parcours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date de début *</Label>
              <Input
                id="dateDebut"
                type="date"
                value={formData.dateDebut}
                onChange={(e) =>
                  setFormData({ ...formData, dateDebut: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motif">Motif *</Label>
              <Select
                value={formData.motif}
                onValueChange={(value) =>
                  setFormData({ ...formData, motif: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post_partum">Post-partum</SelectItem>
                  <SelectItem value="incontinence_urinaire">
                    Incontinence urinaire
                  </SelectItem>
                  <SelectItem value="incontinence_anale">
                    Incontinence anale
                  </SelectItem>
                  <SelectItem value="prolapsus">Prolapsus</SelectItem>
                  <SelectItem value="douleurs_pelviennes">
                    Douleurs pelviennes
                  </SelectItem>
                  <SelectItem value="preparation_accouchement">
                    Préparation à l'accouchement
                  </SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombreSeancesPrevues">
                Nombre de séances prévues
              </Label>
              <Input
                id="nombreSeancesPrevues"
                type="number"
                min="1"
                max="20"
                value={formData.nombreSeancesPrevues}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombreSeancesPrevues: parseInt(e.target.value),
                  })
                }
              />
              <p className="text-xs text-slate-500">
                Par défaut 5 séances (ajustable ultérieurement)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes générales (optionnel)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
                placeholder="Notes sur le parcours, objectifs généraux..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer le parcours
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
