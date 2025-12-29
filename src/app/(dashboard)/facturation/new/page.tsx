'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Loader2, Save, Plus, Trash2, Euro } from 'lucide-react'
import { COTATIONS_SAGE_FEMME, getCotationsByCategory } from '@/lib/cotations-ngap'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

interface CotationLine {
  code: string
  libelle: string
  montant: number
  quantity: number
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [cotations, setCotations] = useState<CotationLine[]>([])
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: '',
  })

  useEffect(() => {
    fetchPatients()
  }, [])

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

  const addCotation = (code: string) => {
    const cotation = COTATIONS_SAGE_FEMME.find((c) => c.code === code)
    if (cotation) {
      setCotations([
        ...cotations,
        {
          code: cotation.code,
          libelle: cotation.libelle,
          montant: cotation.tarifBase,
          quantity: 1,
        },
      ])
    }
  }

  const removeCotation = (index: number) => {
    setCotations(cotations.filter((_, i) => i !== index))
  }

  const updateCotationQuantity = (index: number, quantity: number) => {
    const updated = [...cotations]
    updated[index].quantity = quantity
    setCotations(updated)
  }

  const total = cotations.reduce((acc, c) => acc + c.montant * c.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!formData.patientId) {
      setError('Veuillez selectionner une patiente')
      setIsLoading(false)
      return
    }

    if (cotations.length === 0) {
      setError('Veuillez ajouter au moins une cotation')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cotations: cotations.map((c) => ({
            code: c.code,
            libelle: c.libelle,
            montant: c.montant,
            quantity: c.quantity,
          })),
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error)
        return
      }

      router.push('/facturation')
    } catch {
      setError('Erreur lors de la creation de la facture')
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { id: 'consultation', label: 'Consultations' },
    { id: 'grossesse', label: 'Grossesse' },
    { id: 'postpartum', label: 'Post-partum' },
    { id: 'preparation', label: 'Preparation' },
    { id: 'reeducation', label: 'Reeducation' },
    { id: 'gyneco', label: 'Gynecologie' },
    { id: 'deplacement', label: 'Deplacement' },
    { id: 'majoration', label: 'Majorations' },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/facturation">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Nouvelle facture</h1>
          <p className="text-slate-500 mt-1">Creer une facture avec cotations NGAP</p>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Informations */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Patiente *</Label>
                    <Select
                      value={formData.patientId}
                      onValueChange={(v) => setFormData({ ...formData, patientId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner..." />
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
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mode de paiement</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="especes">Especes</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="carte">Carte bancaire</SelectItem>
                      <SelectItem value="virement">Virement</SelectItem>
                      <SelectItem value="tiers_payant">Tiers payant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Cotations ajoutees */}
            <Card>
              <CardHeader>
                <CardTitle>Actes et cotations</CardTitle>
              </CardHeader>
              <CardContent>
                {cotations.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">
                    Ajoutez des cotations depuis le panneau de droite
                  </p>
                ) : (
                  <div className="space-y-3">
                    {cotations.map((cot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{cot.code}</Badge>
                          <span className="text-sm">{cot.libelle}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            min="1"
                            value={cot.quantity}
                            onChange={(e) =>
                              updateCotationQuantity(index, parseInt(e.target.value) || 1)
                            }
                            className="w-16 h-8 text-center"
                          />
                          <span className="text-sm font-medium w-20 text-right">
                            {(cot.montant * cot.quantity).toFixed(2)} EUR
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeCotation(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold">{total.toFixed(2)} EUR</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau cotations */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Cotations NGAP</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto space-y-4">
                {categories.map((cat) => {
                  const catCotations = getCotationsByCategory(cat.id)
                  if (catCotations.length === 0) return null

                  return (
                    <div key={cat.id}>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        {cat.label}
                      </h4>
                      <div className="space-y-1">
                        {catCotations.map((cot) => (
                          <button
                            key={cot.code}
                            type="button"
                            onClick={() => addCotation(cot.code)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {cot.code}
                              </Badge>
                              <span className="text-sm truncate max-w-[120px]">
                                {cot.libelle}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">
                                {cot.tarifBase.toFixed(2)}
                              </span>
                              <Plus className="h-4 w-4 text-slate-400" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/facturation">Annuler</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Creer la facture
          </Button>
        </div>
      </form>
    </div>
  )
}
