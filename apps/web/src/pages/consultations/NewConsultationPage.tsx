import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ArrowLeft, Loader2, Save, FileText } from 'lucide-react'
import { getTemplatesByType, getTemplateById, type ConsultationTemplate } from '../../lib/consultationTemplates'

export default function NewConsultationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')
  
  const [isLoading, setIsLoading] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [availableTemplates, setAvailableTemplates] = useState<ConsultationTemplate[]>([])
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    type: 'prenatale',
    date: new Date().toISOString().split('T')[0],
    duree: 30,
    poids: '',
    tensionSystolique: '',
    tensionDiastolique: '',
    hauteurUterine: '',
    bdc: '',
    motif: '',
    examenClinique: '',
    conclusion: '',
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  // Update available templates when type changes
  useEffect(() => {
    const templates = getTemplatesByType(formData.type)
    setAvailableTemplates(templates)
    setSelectedTemplate('') // Reset template selection when type changes
  }, [formData.type])

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

  const applyTemplate = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (template) {
      setFormData({
        ...formData,
        ...template.data,
      })
      setSelectedTemplate(templateId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        poids: formData.poids ? parseFloat(formData.poids) : undefined,
        tensionSystolique: formData.tensionSystolique ? parseInt(formData.tensionSystolique) : undefined,
        tensionDiastolique: formData.tensionDiastolique ? parseInt(formData.tensionDiastolique) : undefined,
        hauteurUterine: formData.hauteurUterine ? parseFloat(formData.hauteurUterine) : undefined,
        bdc: formData.bdc ? parseInt(formData.bdc) : undefined,
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        return
      }

      navigate(`/consultations/${data.consultation.id}`)
    } catch {
      setError('Erreur lors de la création de la consultation')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/consultations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Nouvelle consultation</h1>
          <p className="text-slate-500 mt-1">Créer une nouvelle consultation</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
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
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => updateField('type', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prenatale">Prénatale</SelectItem>
                    <SelectItem value="postnatale">Postnatale</SelectItem>
                    <SelectItem value="gyneco">Gynéco</SelectItem>
                    <SelectItem value="reeducation">Rééducation</SelectItem>
                    <SelectItem value="preparation">Préparation</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  required
                />
              </div>
            </div>

            {availableTemplates.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="template">Utiliser un template (optionnel)</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={applyTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-gray-500">{template.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-xs text-blue-600">
                    Template appliqué - Les champs ont été pré-remplis
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="motif">Motif</Label>
              <Textarea
                id="motif"
                rows={2}
                value={formData.motif}
                onChange={(e) => updateField('motif', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Examen clinique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poids">Poids (kg)</Label>
                <Input
                  id="poids"
                  type="number"
                  step="0.1"
                  value={formData.poids}
                  onChange={(e) => updateField('poids', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hauteurUterine">Hauteur utérine (cm)</Label>
                <Input
                  id="hauteurUterine"
                  type="number"
                  step="0.1"
                  value={formData.hauteurUterine}
                  onChange={(e) => updateField('hauteurUterine', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tensionSystolique">TA Systolique</Label>
                <Input
                  id="tensionSystolique"
                  type="number"
                  placeholder="120"
                  value={formData.tensionSystolique}
                  onChange={(e) => updateField('tensionSystolique', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tensionDiastolique">TA Diastolique</Label>
                <Input
                  id="tensionDiastolique"
                  type="number"
                  placeholder="80"
                  value={formData.tensionDiastolique}
                  onChange={(e) => updateField('tensionDiastolique', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bdc">BDC (bpm)</Label>
                <Input
                  id="bdc"
                  type="number"
                  placeholder="140"
                  value={formData.bdc}
                  onChange={(e) => updateField('bdc', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examenClinique">Examen clinique</Label>
              <Textarea
                id="examenClinique"
                rows={4}
                value={formData.examenClinique}
                onChange={(e) => updateField('examenClinique', e.target.value)}
                placeholder="Description de l'examen..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conclusion">Conclusion</Label>
              <Textarea
                id="conclusion"
                rows={3}
                value={formData.conclusion}
                onChange={(e) => updateField('conclusion', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/consultations')}>
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
                Créer la consultation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
