import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { CardReaderWidget } from '../../components/billing/CardReaderWidget'
import { FSETransmission } from '../../components/billing/FSETransmission'
import type { PatientVitaleData, ProfessionalCPSData } from '../../services/billing'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

interface Cotation {
  code: string
  libelle: string
  montant: number
  quantity: number
}

const COTATIONS = [
  { code: 'C', libelle: 'Consultation', montant: 25.0, categorie: 'consultation' },
  { code: 'CSF', libelle: 'Consultation de suivi', montant: 25.0, categorie: 'consultation' },
  { code: 'SF 12', libelle: 'Surveillance de grossesse pathologique', montant: 37.80, categorie: 'grossesse' },
  { code: 'SF 15', libelle: 'Monitoring foetal', montant: 47.25, categorie: 'grossesse' },
  { code: 'SF 6', libelle: 'Visite post-natale', montant: 18.90, categorie: 'postpartum' },
  { code: 'SF 9', libelle: 'Seance de suivi post-natal', montant: 28.35, categorie: 'postpartum' },
  { code: 'SF 7', libelle: 'Seance de reeducation perineale', montant: 22.05, categorie: 'reeducation' },
  { code: 'SF 8', libelle: 'Bilan perineal', montant: 25.20, categorie: 'reeducation' },
  { code: 'SF 17', libelle: 'Seance preparation individuelle', montant: 53.55, categorie: 'preparation' },
  { code: 'SF 21', libelle: 'Entretien prenatal precoce', montant: 46.0, categorie: 'preparation' },
]

export default function NewFacturationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    dateEcheance: '',
    status: 'brouillon',
    paymentMethod: '',
    notes: '',
    partSecu: 0,
    partMutuelle: 0,
    consultationId: '',
  })

  const [cotations, setCotations] = useState<Cotation[]>([])
  const [vitaleData, setVitaleData] = useState<PatientVitaleData | null>(null)
  const [cpsData, setCPSData] = useState<ProfessionalCPSData | null>(null)

  useEffect(() => {
    fetchPatients()

    // Pre-fill from query params
    const patientId = searchParams.get('patientId')
    const consultationId = searchParams.get('consultationId')

    if (patientId) {
      setFormData(prev => ({ ...prev, patientId, consultationId: consultationId || '' }))
    }
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

  const addCotation = () => {
    setCotations([...cotations, { code: '', libelle: '', montant: 0, quantity: 1 }])
  }

  const removeCotation = (index: number) => {
    setCotations(cotations.filter((_, i) => i !== index))
  }

  const updateCotation = (index: number, field: keyof Cotation, value: any) => {
    const updated = [...cotations]
    updated[index] = { ...updated[index], [field]: value }

    // Si on change le code, remplir automatiquement libelle et montant
    if (field === 'code') {
      const cotation = COTATIONS.find(c => c.code === value)
      if (cotation) {
        updated[index].libelle = cotation.libelle
        updated[index].montant = cotation.montant
      }
    }

    setCotations(updated)
  }

  const calculateTotal = () => {
    return cotations.reduce((sum, cot) => sum + (cot.montant * cot.quantity), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          cotations,
        }),
      })

      const data = await res.json()

      if (data.success) {
        navigate(`/facturation/${data.invoice.id}`)
      } else {
        alert('Erreur lors de la création de la facture')
      }
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('Erreur lors de la création de la facture')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/facturation')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Nouvelle facture</h1>
          <p className="text-slate-500 mt-1">Créer une nouvelle facture</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patiente *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une patiente" />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateEcheance">Date d'échéance</Label>
                <Input
                  id="dateEcheance"
                  type="date"
                  value={formData.dateEcheance}
                  onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brouillon">Brouillon</SelectItem>
                    <SelectItem value="envoyee">Envoyée</SelectItem>
                    <SelectItem value="payee">Payée</SelectItem>
                    <SelectItem value="impayee">Impayée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Moyen de paiement</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carte">Carte bancaire</SelectItem>
                    <SelectItem value="especes">Espèces</SelectItem>
                    <SelectItem value="cheque">Chèque</SelectItem>
                    <SelectItem value="virement">Virement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cotations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cotations NGAP</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addCotation}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une cotation
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {cotations.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Aucune cotation ajoutée
              </p>
            ) : (
              cotations.map((cotation, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Code NGAP</Label>
                    <Select
                      value={cotation.code}
                      onValueChange={(value) => updateCotation(index, 'code', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {COTATIONS.map((cot) => (
                          <SelectItem key={cot.code} value={cot.code}>
                            {cot.code} - {cot.libelle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32 space-y-2">
                    <Label>Montant</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={cotation.montant}
                      onChange={(e) => updateCotation(index, 'montant', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="w-24 space-y-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      value={cotation.quantity}
                      onChange={(e) => updateCotation(index, 'quantity', parseInt(e.target.value))}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCotation(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))
            )}

            {cotations.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total TTC</span>
                  <span>{calculateTotal().toFixed(2)} €</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lecteur de cartes Vitale / CPS */}
        <CardReaderWidget
          onVitaleRead={(data) => {
            setVitaleData(data)
            // Pré-remplir les informations patient si nécessaire
          }}
          onCPSRead={(data) => {
            setCPSData(data)
          }}
        />

        {/* Télétransmission FSE */}
        {cotations.length > 0 && (
          <FSETransmission
            patientData={vitaleData}
            professionalData={cpsData}
            actes={cotations}
            onTransmissionSuccess={(result) => {
              console.log('Télétransmission réussie:', result)
              // Mettre à jour le statut de la facture
              setFormData(prev => ({ ...prev, status: 'envoyee' }))
            }}
          />
        )}

        {/* Répartition paiement */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition du paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partSecu">Part Sécurité Sociale (Carte Vitale)</Label>
                <div className="relative">
                  <Input
                    id="partSecu"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.partSecu}
                    onChange={(e) => setFormData({ ...formData, partSecu: parseFloat(e.target.value) || 0 })}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partMutuelle">Part Mutuelle</Label>
                <div className="relative">
                  <Input
                    id="partMutuelle"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.partMutuelle}
                    onChange={(e) => setFormData({ ...formData, partMutuelle: parseFloat(e.target.value) || 0 })}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                </div>
              </div>
            </div>

            {cotations.length > 0 && (
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total facture</span>
                  <span className="font-medium">{calculateTotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Part Sécu + Mutuelle</span>
                  <span className="font-medium">{(formData.partSecu + formData.partMutuelle).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className={`${(calculateTotal() - formData.partSecu - formData.partMutuelle) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    Reste à charge patient
                  </span>
                  <span className={`${(calculateTotal() - formData.partSecu - formData.partMutuelle) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {(calculateTotal() - formData.partSecu - formData.partMutuelle).toFixed(2)} €
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes complémentaires..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/facturation')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Création...' : 'Créer la facture'}
          </Button>
        </div>
      </form>
    </div>
  )
}
