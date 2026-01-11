import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Plus, User, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Appointment {
  id: string
  time: string
  patient: {
    id: string
    firstName: string
    lastName: string
  }
  type: string
  status: string
  duration: number
}

export function TodayAppointmentsWidget() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTodayAppointments()
  }, [])

  const fetchTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/appointments?date=${today}`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setAppointments(data.appointments || [])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé'
      case 'pending':
        return 'En attente'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Rendez-vous du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
          Rendez-vous du jour
          {appointments.length > 0 && (
            <Badge variant="secondary">{appointments.length}</Badge>
          )}
        </CardTitle>
        <Button size="sm" onClick={() => navigate('/agenda')}>
          <Plus className="h-4 w-4 mr-1" />
          Nouveau
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">Aucun rendez-vous aujourd'hui</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => navigate('/agenda')}
            >
              Voir l'agenda
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 card-hover cursor-pointer"
                onClick={() => navigate(`/patients/${apt.patient.id}`)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-slate-900 truncate">
                      {apt.patient.firstName} {apt.patient.lastName}
                    </span>
                    <Badge className={cn('text-xs', getStatusColor(apt.status))}>
                      {getStatusLabel(apt.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {apt.time} • {apt.duration}min
                    </div>
                    <span className="truncate">{apt.type}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
              </div>
            ))}
            {appointments.length > 3 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/agenda')}
              >
                Voir tous les RDV
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
