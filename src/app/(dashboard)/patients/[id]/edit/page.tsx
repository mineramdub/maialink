'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Loader2, Save, User, Heart, Phone, FileText } from 'lucide-react'
import Link from 'next/link'

interface Patient {
  id: string
  firstName: string
  lastName: string
  maidenName?: string
  birthDate: string
  birthPlace?: string
  socialSecurityNumber?: string
  email?: string
  phone?: string
  mobilePhone?: string
  address?: string
  postalCode?: string
  city?: string
  bloodType?: string
  rhesus?: string
  allergies?: string
  traitementEnCours?: string
  gravida: number
  para: number
  mutuelle?: string
  numeroMutuelle?: string
  medecinTraitant?: string
  personneConfiance?: string
  telephoneConfiance?: string
  consentementRGPD: boolean
  notes?: string
}

export default function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<Patient | null>(null)

  useEffect(() => {
    fetchPatient()
  }, [resolvedParams.id])

  const fetchPatient = async () => {
    try {
      const res = await fetch(`/api/patients/${resolvedParams.id}`)
      const data = await res.json()
      if (data.success) {
        setFormData(data.patient)
      } else {
        router.push('/patients')
      }
    } catch {
      router.push('/patients')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/patients/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        return
      }

      router.push(`/patients/${resolvedParams.id}`)
    } catch {
      setError('Erreur lors de la modification')
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field: string, value: unknown) => {
    if (formData) {
      setFormData({ ...formData, [field]: value })
    }
  }

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/patients/${resolvedParams.id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Modifier la patiente</h1>
          <p className="text-slate-500 mt-1">{formData.firstName} {formData.lastName}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="identite" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="identite" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Identite</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="medical" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Medical</span>
            </TabsTrigger>
            <TabsTrigger value="administratif" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Administratif</span>
            </TabsTrigger>
          </TabsList>

          {/* Identité */}
          <TabsContent value="identite">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maidenName">Nom de naissance</Label>
                    <Input
                      id="maidenName"
                      value={formData.maidenName || ''}
                      onChange={(e) => updateField('maidenName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Prenom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date de naissance *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateField('birthDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthPlace">Lieu de naissance</Label>
                    <Input
                      id="birthPlace"
                      value={formData.birthPlace || ''}
                      onChange={(e) => updateField('birthPlace', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialSecurityNumber">Numero de securite sociale</Label>
                  <Input
                    id="socialSecurityNumber"
                    value={formData.socialSecurityNumber || ''}
                    onChange={(e) => updateField('socialSecurityNumber', e.target.value)}
                    placeholder="1 XX XX XX XXX XXX XX"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Coordonnees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mobilePhone">Telephone mobile</Label>
                    <Input
                      id="mobilePhone"
                      type="tel"
                      value={formData.mobilePhone || ''}
                      onChange={(e) => updateField('mobilePhone', e.target.value)}
                      placeholder="06 XX XX XX XX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telephone fixe</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode || ''}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.city || ''}
                      onChange={(e) => updateField('city', e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Personne de confiance</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="personneConfiance">Nom</Label>
                      <Input
                        id="personneConfiance"
                        value={formData.personneConfiance || ''}
                        onChange={(e) => updateField('personneConfiance', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telephoneConfiance">Telephone</Label>
                      <Input
                        id="telephoneConfiance"
                        type="tel"
                        value={formData.telephoneConfiance || ''}
                        onChange={(e) => updateField('telephoneConfiance', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Médical */}
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Informations medicales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Groupe sanguin</Label>
                    <Select
                      value={formData.bloodType || ''}
                      onValueChange={(v) => updateField('bloodType', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Groupe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rhesus</Label>
                    <Select
                      value={formData.rhesus || ''}
                      onValueChange={(v) => updateField('rhesus', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rhesus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+">Positif (+)</SelectItem>
                        <SelectItem value="-">Negatif (-)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medecinTraitant">Medecin traitant</Label>
                    <Input
                      id="medecinTraitant"
                      value={formData.medecinTraitant || ''}
                      onChange={(e) => updateField('medecinTraitant', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies || ''}
                    onChange={(e) => updateField('allergies', e.target.value)}
                    placeholder="Liste des allergies connues..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traitementEnCours">Traitements en cours</Label>
                  <Textarea
                    id="traitementEnCours"
                    value={formData.traitementEnCours || ''}
                    onChange={(e) => updateField('traitementEnCours', e.target.value)}
                    placeholder="Medicaments en cours..."
                  />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Obstetrique</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gravida">Gestite (G)</Label>
                      <Input
                        id="gravida"
                        type="number"
                        min="0"
                        value={formData.gravida}
                        onChange={(e) => updateField('gravida', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="para">Parite (P)</Label>
                      <Input
                        id="para"
                        type="number"
                        min="0"
                        value={formData.para}
                        onChange={(e) => updateField('para', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Administratif */}
          <TabsContent value="administratif">
            <Card>
              <CardHeader>
                <CardTitle>Informations administratives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mutuelle">Mutuelle</Label>
                    <Input
                      id="mutuelle"
                      value={formData.mutuelle || ''}
                      onChange={(e) => updateField('mutuelle', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroMutuelle">N de mutuelle</Label>
                    <Input
                      id="numeroMutuelle"
                      value={formData.numeroMutuelle || ''}
                      onChange={(e) => updateField('numeroMutuelle', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Notes complementaires..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="consentementRGPD"
                    checked={formData.consentementRGPD}
                    onChange={(e) => updateField('consentementRGPD', e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <Label htmlFor="consentementRGPD" className="text-sm cursor-pointer">
                    La patiente consent au traitement de ses donnees de sante conformement au RGPD
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" asChild>
            <Link href={`/patients/${resolvedParams.id}`}>Annuler</Link>
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}
