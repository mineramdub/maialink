import { useState, useEffect } from 'react'
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
import { Plus } from 'lucide-react'
import { useCreateAppointment } from '../hooks/useAppointments'
import { usePatients } from '../hooks/usePatients'
import { format } from 'date-fns'

interface NewAppointmentDialogProps {
  // Mode contrôlé (depuis AgendaPage)
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultDate?: Date
  // Mode legacy (depuis fiche patient)
  patientId?: string
  patientName?: string
  trigger?: React.ReactNode
}

export function NewAppointmentDialog({
  open: controlledOpen,
  onOpenChange,
  defaultDate,
  patientId: initialPatientId,
  patientName: initialPatientName,
  trigger,
}: NewAppointmentDialogProps) {
  // État local pour le mode non-contrôlé
  const [internalOpen, setInternalOpen] = useState(false)

  // Déterminer si on est en mode contrôlé
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? onOpenChange! : setInternalOpen

  const createAppointment = useCreateAppointment()
  const { data: patients = [], refetch: refetchPatients } = usePatients()

  // Refetch patients quand le dialog s'ouvre
  useEffect(() => {
    if (open) {
      refetchPatients()
    }
  }, [open, refetchPatients])

  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(initialPatientId)

  const [formData, setFormData] = useState({
    title: '',
    type: 'prenatale',
    date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
    startTime: '09:00',
    endTime: '09:30',
    location: '',
    notes: '',
  })

  // Mettre à jour la date quand defaultDate change
  useEffect(() => {
    if (defaultDate) {
      setFormData((prev) => ({
        ...prev,
        date: format(defaultDate, 'yyyy-MM-dd'),
      }))
    }
  }, [defaultDate])

  // Initialiser le patient si fourni en props
  useEffect(() => {
    if (initialPatientId) {
      setSelectedPatientId(initialPatientId)
    }
  }, [initialPatientId])

  const selectedPatient = patients.find((p: any) => p.id === selectedPatientId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatientId) {
      alert('Veuillez sélectionner une patiente')
      return
    }

    // Combine date and time
    const startTime = new Date(`${formData.date}T${formData.startTime}`)
    const endTime = new Date(`${formData.date}T${formData.endTime}`)

    const patientName = selectedPatient
      ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
      : 'Patient'

    try {
      await createAppointment.mutateAsync({
        patientId: selectedPatientId,
        title: formData.title || `RDV ${patientName}`,
        type: formData.type,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: formData.location,
        notes: formData.notes,
      })

      setOpen(false)
      // Reset form
      setFormData({
        title: '',
        type: 'prenatale',
        date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
        startTime: '09:00',
        endTime: '09:30',
        location: '',
        notes: '',
      })
      if (!initialPatientId) {
        setSelectedPatientId(undefined)
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Erreur lors de la création du rendez-vous')
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Nouveau rendez-vous</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sélection de patient */}
        {!initialPatientId ? (
          <div className="space-y-2">
            <Label>Patiente *</Label>
            <Select
              value={selectedPatientId || ''}
              onValueChange={(value) => setSelectedPatientId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une patiente..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient: any) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Patiente</Label>
            <Input value={initialPatientName || ''} disabled />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Titre (optionnel)</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Consultation de suivi"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type de consultation *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
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
  )

  // Mode contrôlé (pas de trigger)
  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    )
  }

  // Mode non-contrôlé avec trigger
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
      {dialogContent}
    </Dialog>
  )
}
