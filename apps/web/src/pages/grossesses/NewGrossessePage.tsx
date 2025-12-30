import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ArrowLeft, Loader2, Save } from 'lucide-react'

export default function NewGrossessePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')
  
  const [isLoading, setIsLoading] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    ddr: '',
    dateConception: '',
    grossesseMultiple: false,
    nombreFoetus: 1,
    facteursRisque: [] as string[],
    notes: '',
  })

  useEffect(() => {
    fetchPatients()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grossesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        return
      }

      navigate(`/grossesses/${data.grossesse.id}`)
    } catch {
      setError('Erreur lors de la création de la grossesse')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/grossesses">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Nouvelle grossesse</h1>
          <p className="text-slate-500 mt-1">Déclarer une nouvelle grossesse</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de grossesse</CardTitle>
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
                <Label htmlFor="ddr">Date des dernières règles (DDR) *</Label>
                <Input
                  id="ddr"
                  type="date"
                  value={formData.ddr}
                  onChange={(e) => updateField('ddr', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateConception">Date de conception (estimée)</Label>
                <Input
                  id="dateConception"
                  type="date"
                  value={formData.dateConception}
                  onChange={(e) => updateField('dateConception', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Grossesse multiple ?</Label>
              <Select
                value={formData.grossesseMultiple ? 'oui' : 'non'}
                onValueChange={(v) => {
                  updateField('grossesseMultiple', v === 'oui')
                  if (v === 'non') updateField('nombreFoetus', 1)
                }}
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
                <Label htmlFor="nombreFoetus">Nombre de foetus</Label>
                <Input
                  id="nombreFoetus"
                  type="number"
                  min="2"
                  value={formData.nombreFoetus}
                  onChange={(e) => updateField('nombreFoetus', parseInt(e.target.value) || 1)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Informations complémentaires..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/grossesses')}>
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
                Créer la grossesse
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
