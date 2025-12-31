import { useState } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Loader2 } from 'lucide-react'
import { useAppointments } from '../../hooks/useAppointments'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Fetch appointments for current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const { data: appointments = [], isLoading } = useAppointments({
    startDate: monthStart.toISOString(),
    endDate: monthEnd.toISOString(),
  })

  // Generate calendar days
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Filter appointments for selected date
  const selectedDateAppointments = appointments.filter((apt: any) =>
    isSameDay(parseISO(apt.startTime), selectedDate)
  )

  // Get appointments count for each day
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt: any) => isSameDay(parseISO(apt.startTime), day))
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planifie: 'bg-blue-100 text-blue-700',
      confirme: 'bg-green-100 text-green-700',
      en_cours: 'bg-purple-100 text-purple-700',
      termine: 'bg-gray-100 text-gray-700',
      annule: 'bg-red-100 text-red-700',
      absent: 'bg-orange-100 text-orange-700',
    }
    return colors[status] || colors.planifie
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planifie: 'Planifié',
      confirme: 'Confirmé',
      en_cours: 'En cours',
      termine: 'Terminé',
      annule: 'Annulé',
      absent: 'Absent',
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Agenda</h1>
          <p className="text-slate-500 mt-1">
            {appointments.length} rendez-vous ce mois-ci
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentDate(new Date())
                      setSelectedDate(new Date())
                    }}
                  >
                    Aujourd'hui
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-slate-600 py-2"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {daysInMonth.map((day) => {
                  const dayAppointments = getAppointmentsForDay(day)
                  const isSelected = isSameDay(day, selectedDate)
                  const isCurrentDay = isToday(day)

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative p-2 text-sm rounded-lg transition-colors
                        ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'}
                        ${isCurrentDay && !isSelected ? 'border-2 border-blue-600' : ''}
                      `}
                    >
                      <div className="font-medium">{format(day, 'd')}</div>
                      {dayAppointments.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-600'}`} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day Appointments */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">
                  {format(selectedDate, 'd MMMM yyyy', { locale: fr })}
                </h3>
              </div>

              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">Aucun rendez-vous</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateAppointments.map((apt: any) => (
                    <div
                      key={apt.id}
                      className="p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-slate-900 text-sm">
                          {apt.patient?.firstName} {apt.patient?.lastName}
                        </div>
                        <Badge className={`text-xs ${getStatusColor(apt.status)}`}>
                          {getStatusLabel(apt.status)}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {format(parseISO(apt.startTime), 'HH:mm')} -{' '}
                          {format(parseISO(apt.endTime), 'HH:mm')}
                        </div>

                        {apt.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {apt.location}
                          </div>
                        )}

                        <div className="text-xs text-slate-500 mt-1">
                          {apt.type}
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="mt-2 text-xs text-slate-600 border-t pt-2">
                          {apt.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Today's Appointments Summary */}
      {!isLoading && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Rendez-vous d'aujourd'hui</h3>
            {appointments.filter((apt: any) => isToday(parseISO(apt.startTime))).length === 0 ? (
              <p className="text-sm text-slate-500">Aucun rendez-vous aujourd'hui</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments
                  .filter((apt: any) => isToday(parseISO(apt.startTime)))
                  .map((apt: any) => (
                    <div
                      key={apt.id}
                      className="p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-slate-900">
                          {apt.patient?.firstName} {apt.patient?.lastName}
                        </div>
                        <Badge className={`text-xs ${getStatusColor(apt.status)}`}>
                          {getStatusLabel(apt.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        <Clock className="h-3.5 w-3.5 inline mr-1" />
                        {format(parseISO(apt.startTime), 'HH:mm')}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
