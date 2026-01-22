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
import { Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

interface Frottis {
  id: string
  dateRealisation: string
  dateResultat?: string
  resultat: string
  notes?: string
  dateProchainFrottis?: string
  patientePrevenu: boolean
  resultatRecupere: boolean
  patient: {
    firstName: string
    lastName: string
  }
}

export function FrottisTab() {
  const [frottis, setFrottis] = useState<Frottis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    patientId: '',
    dateRealisation: '',
    dateResultat: '',
    resultat: 'en_attente',
    notes: '',
  })

  useEffect(() => {
    fetchFrottis()
    fetchPatients()
  }, [])

  const fetchFrottis = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/frottis`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setFrottis(data.frottis)
      }
    } catch (error) {
      console.error('Error fetching frottis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleCheckbox = async (frottisId: string, field: 'patientePrevenu' | 'resultatRecupere', currentValue: boolean) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/frottis/${frottisId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [field]: !currentValue }),
      })

      const data = await res.json()
      if (data.success) {
        fetchFrottis()
      }
    } catch (error) {
      console.error('Error updating frottis:', error)
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
    if (!formData.patientId || !formData.dateRealisation) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/frottis`, {
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
          dateRealisation: '',
          dateResultat: '',
          resultat: 'en_attente',
          notes: '',
        })
        fetchFrottis()
      } else {
        alert(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating frottis:', error)
      alert('Erreur lors de la création')
    } finally {
      setIsSaving(false)
    }
  }

  const getResultatBadge = (resultat: string) => {
    if (resultat === 'normal') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Normal
        </Badge>
      )
    }
    if (resultat === 'en_attente') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          En attente
        </Badge>
      )
    }
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
        <AlertCircle className="h-3 w-3 mr-1" />
        Anormal
      </Badge>
    )
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
          <CardTitle>Frottis cervicaux</CardTitle>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nouveau frottis
          </Button>
        </CardHeader>
        <CardContent>
          {frottis.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patiente</TableHead>
                    <TableHead>Date réalisation</TableHead>
                    <TableHead>Résultat</TableHead>
                    <TableHead className="text-center">Patiente prévenue</TableHead>
                    <TableHead className="text-center">Résultat récupéré</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {frottis.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">
                        {f.patient.firstName} {f.patient.lastName}
                      </TableCell>
                      <TableCell>{formatDate(f.dateRealisation)}</TableCell>
                      <TableCell>{getResultatBadge(f.resultat)}</TableCell>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={f.patientePrevenu}
                          onChange={() => handleToggleCheckbox(f.id, 'patientePrevenu', f.patientePrevenu)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={f.resultatRecupere}
                          onChange={() => handleToggleCheckbox(f.id, 'resultatRecupere', f.resultatRecupere)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-xs truncate">
                        {f.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Aucun frottis enregistré</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog nouveau frottis */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau frottis</DialogTitle>
            <DialogDescription>
              Enregistrer un nouveau frottis cervical pour une patiente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Patiente *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(v) => setFormData({ ...formData, patientId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une patiente" />
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
              <Label>Date de réalisation *</Label>
              <Input
                type="date"
                value={formData.dateRealisation}
                onChange={(e) => setFormData({ ...formData, dateRealisation: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Résultat</Label>
              <Select
                value={formData.resultat}
                onValueChange={(v) => setFormData({ ...formData, resultat: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="ascus">ASCUS</SelectItem>
                  <SelectItem value="lsil">LSIL</SelectItem>
                  <SelectItem value="hsil">HSIL</SelectItem>
                  <SelectItem value="agc">AGC</SelectItem>
                  <SelectItem value="carcinome">Carcinome</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.resultat !== 'en_attente' && (
              <div className="space-y-2">
                <Label>Date du résultat</Label>
                <Input
                  type="date"
                  value={formData.dateResultat}
                  onChange={(e) => setFormData({ ...formData, dateResultat: e.target.value })}
                />
              </div>
            )}

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
