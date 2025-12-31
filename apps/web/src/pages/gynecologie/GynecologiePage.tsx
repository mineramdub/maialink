import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Plus, Activity, Loader2, Calendar, X, User } from 'lucide-react'
import { formatDate } from '../../lib/utils'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

interface GynecoConsultation {
  id: string
  date: string
  motif?: string
  dateDernieresRegles?: string
  dureeRegles?: number
  dureeCycle?: number
  regularite?: string
  contraceptionActuelle?: string
  dateDebutContraception?: string
  dateDernierFrottis?: string
  resultatFrottis?: string
  hpv?: string
  examenSeins?: string
  examenGynecologique?: string
  prescriptions?: string
  observations?: string
  patient: {
    firstName: string
    lastName: string
  }
}

export default function GynecologiePage() {
  const [consultations, setConsultations] = useState<GynecoConsultation[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<any>({
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchConsultations()
    fetchPatients()
  }, [])

  const fetchConsultations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gyneco`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setConsultations(data.consultations)
      }
    } catch (error) {
      console.error('Error fetching gyneco consultations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
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
    setIsSubmitting(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gyneco`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        setShowForm(false)
        setFormData({ date: new Date().toISOString().split('T')[0] })
        fetchConsultations()
      } else {
        alert('Erreur: ' + data.error)
      }
    } catch (error) {
      console.error('Error creating gyneco consultation:', error)
      alert('Erreur lors de la création de la consultation')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Gynécologie</h1>
          <p className="text-slate-500 mt-1">
            {consultations.length} consultation{consultations.length > 1 ? 's' : ''} gynécologique{consultations.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Annuler
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle consultation
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section: Informations de base */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Informations générales</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patiente *</Label>
                    <Select onValueChange={(value) => handleInputChange('patientId', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une patiente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.firstName} {p.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date de consultation *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motif">Motif de consultation</Label>
                  <Input
                    id="motif"
                    value={formData.motif || ''}
                    onChange={(e) => handleInputChange('motif', e.target.value)}
                    placeholder="Ex: Bilan annuel, contraception, douleurs..."
                  />
                </div>
              </div>

              {/* Section: Cycle menstruel */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Cycle menstruel</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateDernieresRegles">Date des dernières règles</Label>
                    <Input
                      id="dateDernieresRegles"
                      type="date"
                      value={formData.dateDernieresRegles || ''}
                      onChange={(e) => handleInputChange('dateDernieresRegles', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regularite">Régularité</Label>
                    <Select onValueChange={(value) => handleInputChange('regularite', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regulier">Régulier</SelectItem>
                        <SelectItem value="irregulier">Irrégulier</SelectItem>
                        <SelectItem value="aucun">Aucun (ménopause)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dureeRegles">Durée des règles (jours)</Label>
                    <Input
                      id="dureeRegles"
                      type="number"
                      min="1"
                      max="15"
                      value={formData.dureeRegles || ''}
                      onChange={(e) => handleInputChange('dureeRegles', parseInt(e.target.value))}
                      placeholder="Ex: 5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dureeCycle">Durée du cycle (jours)</Label>
                    <Input
                      id="dureeCycle"
                      type="number"
                      min="20"
                      max="45"
                      value={formData.dureeCycle || ''}
                      onChange={(e) => handleInputChange('dureeCycle', parseInt(e.target.value))}
                      placeholder="Ex: 28"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Contraception */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Contraception</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contraceptionActuelle">Contraception actuelle</Label>
                    <Input
                      id="contraceptionActuelle"
                      value={formData.contraceptionActuelle || ''}
                      onChange={(e) => handleInputChange('contraceptionActuelle', e.target.value)}
                      placeholder="Ex: Pilule, DIU, implant, préservatif..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateDebutContraception">Date de début</Label>
                    <Input
                      id="dateDebutContraception"
                      type="date"
                      value={formData.dateDebutContraception || ''}
                      onChange={(e) => handleInputChange('dateDebutContraception', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Dépistage */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Dépistage</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateDernierFrottis">Date du dernier frottis</Label>
                    <Input
                      id="dateDernierFrottis"
                      type="date"
                      value={formData.dateDernierFrottis || ''}
                      onChange={(e) => handleInputChange('dateDernierFrottis', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resultatFrottis">Résultat du frottis</Label>
                    <Select onValueChange={(value) => handleInputChange('resultatFrottis', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="ascus">ASCUS</SelectItem>
                        <SelectItem value="lsil">LSIL</SelectItem>
                        <SelectItem value="hsil">HSIL</SelectItem>
                        <SelectItem value="autre">Autre anomalie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hpv">Test HPV</Label>
                    <Select onValueChange={(value) => handleInputChange('hpv', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="negatif">Négatif</SelectItem>
                        <SelectItem value="positif">Positif</SelectItem>
                        <SelectItem value="non_realise">Non réalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Section: Examen */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Examen</h3>

                <div className="space-y-2">
                  <Label htmlFor="examenSeins">Examen des seins</Label>
                  <Textarea
                    id="examenSeins"
                    value={formData.examenSeins || ''}
                    onChange={(e) => handleInputChange('examenSeins', e.target.value)}
                    placeholder="Palpation, aspect, anomalies éventuelles..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examenGynecologique">Examen gynécologique</Label>
                  <Textarea
                    id="examenGynecologique"
                    value={formData.examenGynecologique || ''}
                    onChange={(e) => handleInputChange('examenGynecologique', e.target.value)}
                    placeholder="Spéculum, toucher vaginal, col, utérus..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Section: Prescriptions et observations */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prescriptions">Prescriptions</Label>
                  <Textarea
                    id="prescriptions"
                    value={formData.prescriptions || ''}
                    onChange={(e) => handleInputChange('prescriptions', e.target.value)}
                    placeholder="Médicaments, examens complémentaires..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">Observations</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations || ''}
                    onChange={(e) => handleInputChange('observations', e.target.value)}
                    placeholder="Notes complémentaires..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des consultations */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : consultations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucune consultation gynécologique
            </h3>
            <p className="text-sm text-slate-500 text-center max-w-md mb-4">
              Créez votre première consultation gynécologique
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle consultation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {consultations.map((consultation) => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-pink-500" />
                    <div>
                      <div className="font-medium text-slate-900">
                        {consultation.patient.firstName} {consultation.patient.lastName}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(consultation.date)}
                      </div>
                    </div>
                  </div>
                </div>

                {consultation.motif && (
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {consultation.motif}
                    </Badge>
                  </div>
                )}

                <div className="space-y-1 text-xs text-slate-600">
                  {consultation.contraceptionActuelle && (
                    <div>Contraception: {consultation.contraceptionActuelle}</div>
                  )}
                  {consultation.dateDernierFrottis && (
                    <div>Dernier frottis: {formatDate(consultation.dateDernierFrottis)}</div>
                  )}
                  {consultation.resultatFrottis && (
                    <div className="text-xs">
                      Résultat: <span className={consultation.resultatFrottis === 'normal' ? 'text-green-600' : 'text-orange-600'}>
                        {consultation.resultatFrottis}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
