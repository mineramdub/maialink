import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Plus, Loader2, AlertTriangle, Clock } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { differenceInDays } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

interface Contraceptif {
  id: string
  type: string
  datePose: string
  dateExpiration: string
  numeroLot?: string
  marque?: string
  modele?: string
  notes?: string
  actif: boolean
  patient: {
    firstName: string
    lastName: string
  }
}

export function ContraceptifsTab() {
  const [contraceptifs, setContraceptifs] = useState<Contraceptif[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    patientId: '',
    type: 'sterilet_cuivre',
    datePose: '',
    dateExpiration: '',
    numeroLot: '',
    marque: '',
    modele: '',
    notes: '',
  })

  useEffect(() => {
    fetchContraceptifs()
    fetchPatients()
  }, [])

  // Calculer automatiquement date d'expiration selon le type
  useEffect(() => {
    if (formData.datePose && formData.type) {
      const datePose = new Date(formData.datePose)
      let annees = 5 // Par défaut stérilet

      if (formData.type === 'implant') {
        annees = 3
      } else if (formData.type === 'sterilet_hormonal') {
        annees = 5
      } else if (formData.type === 'sterilet_cuivre') {
        annees = 5
      }

      datePose.setFullYear(datePose.getFullYear() + annees)
      setFormData({
        ...formData,
        dateExpiration: datePose.toISOString().split('T')[0],
      })
    }
  }, [formData.datePose, formData.type])

  const fetchContraceptifs = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/contraceptifs/a-renouveler`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setContraceptifs(data.contraceptifs)
      }
    } catch (error) {
      console.error('Error fetching contraceptifs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients?status=active`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.datePose || !formData.dateExpiration) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/contraceptifs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        setIsDialogOpen(false)
        setFormData({
          patientId: '',
          type: 'sterilet_cuivre',
          datePose: '',
          dateExpiration: '',
          numeroLot: '',
          marque: '',
          modele: '',
          notes: '',
        })
        fetchContraceptifs()
      } else {
        alert(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating contraceptif:', error)
      alert('Erreur lors de la création')
    } finally {
      setIsSaving(false)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sterilet_cuivre': return 'DIU cuivre'
      case 'sterilet_hormonal': return 'DIU hormonal'
      case 'implant': return 'Implant'
      default: return type
    }
  }

  const getUrgenceBadge = (dateExpiration: string) => {
    const today = new Date()
    const expDate = new Date(dateExpiration)
    const daysRemaining = differenceInDays(expDate, today)

    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expiré
        </Badge>
      )
    } else if (daysRemaining <= 14) {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-300">
          <Clock className="h-3 w-3 mr-1" />
          {daysRemaining} jours
        </Badge>
      )
    } else if (daysRemaining <= 30) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          {daysRemaining} jours
        </Badge>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contraceptifs à renouveler (dans le mois)</CardTitle>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nouveau contraceptif
          </Button>
        </CardHeader>
        <CardContent>
          {contraceptifs.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patiente</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date pose</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Urgence</TableHead>
                    <TableHead>Lot / Marque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contraceptifs.map((c) => {
                    const today = new Date()
                    const expDate = new Date(c.dateExpiration)
                    const daysRemaining = differenceInDays(expDate, today)
                    const isExpired = daysRemaining < 0

                    return (
                      <TableRow
                        key={c.id}
                        className={isExpired ? 'bg-red-50 border-l-4 border-l-red-500 hover:bg-red-100' : ''}
                      >
                        <TableCell className={isExpired ? 'font-semibold text-red-900' : 'font-medium'}>
                          {c.patient.firstName} {c.patient.lastName}
                        </TableCell>
                        <TableCell className={isExpired ? 'text-red-800' : ''}>{getTypeLabel(c.type)}</TableCell>
                        <TableCell className={isExpired ? 'text-red-800' : ''}>{formatDate(c.datePose)}</TableCell>
                        <TableCell className={isExpired ? 'font-semibold text-red-900' : ''}>{formatDate(c.dateExpiration)}</TableCell>
                        <TableCell>{getUrgenceBadge(c.dateExpiration)}</TableCell>
                        <TableCell className={isExpired ? 'text-red-800' : 'text-sm text-slate-600'}>
                          {c.numeroLot || c.marque ? (
                            <>
                              {c.numeroLot && <span>Lot: {c.numeroLot}</span>}
                              {c.numeroLot && c.marque && <span> • </span>}
                              {c.marque && <span>{c.marque}</span>}
                            </>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Aucun contraceptif à renouveler prochainement</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog nouveau contraceptif */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau contraceptif</DialogTitle>
            <DialogDescription>
              Enregistrer un stérilet ou implant pour une patiente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patiente *</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(v) => setFormData({ ...formData, patientId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
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
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sterilet_cuivre">DIU cuivre (5 ans)</SelectItem>
                    <SelectItem value="sterilet_hormonal">DIU hormonal (5 ans)</SelectItem>
                    <SelectItem value="implant">Implant (3 ans)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de pose *</Label>
                <Input
                  type="date"
                  value={formData.datePose}
                  onChange={(e) => setFormData({ ...formData, datePose: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Date d'expiration *</Label>
                <Input
                  type="date"
                  value={formData.dateExpiration}
                  onChange={(e) => setFormData({ ...formData, dateExpiration: e.target.value })}
                />
                <p className="text-xs text-slate-500">Calculée automatiquement, modifiable</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Numéro de lot</Label>
                <Input
                  value={formData.numeroLot}
                  onChange={(e) => setFormData({ ...formData, numeroLot: e.target.value })}
                  placeholder="ex: 123456"
                />
              </div>

              <div className="space-y-2">
                <Label>Marque</Label>
                <Input
                  value={formData.marque}
                  onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                  placeholder="ex: Mirena"
                />
              </div>

              <div className="space-y-2">
                <Label>Modèle</Label>
                <Input
                  value={formData.modele}
                  onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                  placeholder="ex: 52mg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes complémentaires..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
