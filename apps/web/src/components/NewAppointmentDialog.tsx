import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog'
import { Calendar, Plus } from 'lucide-react'
import { useCreateAppointment } from '../hooks/useAppointments'

interface NewAppointmentDialogProps {
  patientId: string
  patientName: string
  trigger?: React.ReactNode
}

export function NewAppointmentDialog({ patientId, patientName, trigger }: NewAppointmentDialogProps) {
  const [open, setOpen] = useState(false)
  const createAppointment = useCreateAppointment()

  const [formData, setFormData] = useState({
    title: '',
    type: 'prenatale',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Combine date and time
    const startTime = new Date(`${formData.date}T${formData.startTime}`)
    const endTime = new Date(`${formData.date}T${formData.endTime}`)

    try {
      await createAppointment.mutateAsync({
        patientId,
        title: formData.title || `RDV ${patientName}`,
        type: formData.type,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: formData.location,
        notes: formData.notes,
      })

      setOpen(false)
      setFormData({
        title: '',
        type: 'prenatale',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        notes: '',
      })
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Erreur lors de la création du rendez-vous')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Nouveau RDV
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau rendez-vous</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Patient</Label>
            <Input value={patientName} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de consultation *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prenatale">Prénatale</SelectItem>
                <SelectItem value="postnatale">Postnatale</SelectItem>
                <SelectItem value="gyneco">Gynécologique</SelectItem>
                <SelectItem value="reeducation">Rééducation</SelectItem>
                <SelectItem value="preparation">Préparation naissance</SelectItem>
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
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure début *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Heure fin *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Cabinet, domicile..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Notes complémentaires..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createAppointment.isPending}>
              {createAppointment.isPending ? 'Création...' : 'Créer le RDV'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
