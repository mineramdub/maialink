import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Loader2, Plus } from 'lucide-react'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateAlerteDialog({ open, onOpenChange, onSuccess }: Props) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    patientId: '',
    type: 'tache_manuelle',
    message: '',
    severity: 'info' as 'info' | 'warning' | 'urgent',
  })

  useEffect(() => {
    if (open) {
      fetchPatients()
    }
  }, [open])

  const fetchPatients = async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.patientId || !formData.message.trim()) {
      alert('Veuillez sélectionner une patiente et saisir un message')
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alertes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        // Reset form
        setFormData({
          patientId: '',
          type: 'tache_manuelle',
          message: '',
          severity: 'info',
        })
        onOpenChange(false)
        if (onSuccess) onSuccess()
      } else {
        alert(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating alerte:', error)
      alert('Erreur lors de la création')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Créer une alerte / tâche
          </DialogTitle>
          <DialogDescription>
            Ajoutez une tâche personnalisée ou un rappel pour une patiente
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Patient selection */}
            <div>
              <Label htmlFor="patientId">Patiente concernée *</Label>
              <select
                id="patientId"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une patiente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div>
              <Label htmlFor="severity">Priorité</Label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="info">Information / Rappel</option>
                <option value="warning">Important / À surveiller</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                placeholder="Ex: Appeler patiente pour RDV biologie, Vérifier résultats échographie T3..."
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Décrivez la tâche ou le rappel à effectuer
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating || !formData.patientId || !formData.message.trim()}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer l'alerte
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
