import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, User } from 'lucide-react'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  city: string
}

export function QuickConsultationModal() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Écouter l'événement d'ouverture
  useEffect(() => {
    const handler = () => {
      setOpen(true)
      setSearch('')
      setPatients([])
    }
    document.addEventListener('open-quick-consultation', handler)
    return () => document.removeEventListener('open-quick-consultation', handler)
  }, [])

  // Recherche patientes
  useEffect(() => {
    if (search.length > 1) {
      setIsLoading(true)
      fetch(
        `${import.meta.env.VITE_API_URL}/api/search?q=${search}`,
        { credentials: 'include' }
      )
        .then(res => res.json())
        .then(data => {
          setPatients(data.patients || [])
          setIsLoading(false)
        })
        .catch(() => {
          setPatients([])
          setIsLoading(false)
        })
    } else {
      setPatients([])
    }
  }, [search])

  const handleSelectPatient = async (patient: Patient) => {
    // Charger contexte (dernière grossesse, dernière consultation)
    const [grossesseRes, consultRes] = await Promise.all([
      fetch(
        `${import.meta.env.VITE_API_URL}/api/grossesses?patientId=${patient.id}&status=en_cours&limit=1`,
        { credentials: 'include' }
      ),
      fetch(
        `${import.meta.env.VITE_API_URL}/api/consultations?patientId=${patient.id}&limit=1`,
        { credentials: 'include' }
      )
    ])

    const grossesseData = await grossesseRes.json()
    const consultData = await consultRes.json()

    // Stocker contexte pour pré-remplissage
    sessionStorage.setItem('quickConsultContext', JSON.stringify({
      patient,
      grossesse: grossesseData.grossesses?.[0],
      lastConsult: consultData.consultations?.[0]
    }))

    // Rediriger vers formulaire consultation
    navigate(`/consultations/new?patientId=${patient.id}`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle consultation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="patient-search">Rechercher une patiente</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="patient-search"
                type="text"
                placeholder="Nom, prénom, ville..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>

          {/* Résultats */}
          {isLoading && (
            <div className="text-center py-8 text-slate-500">
              Recherche en cours...
            </div>
          )}

          {!isLoading && search.length > 1 && patients.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Aucune patiente trouvée
            </div>
          )}

          {patients.length > 0 && (
            <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className="w-full p-3 hover:bg-slate-50 text-left flex items-start gap-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-slate-600 truncate">
                      {patient.birthDate} • {patient.city}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                navigate('/patients/new?returnTo=consultations/new')
                setOpen(false)
              }}
              className="flex-1"
            >
              + Nouvelle patiente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
