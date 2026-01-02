import { useState, useMemo, useCallback, useEffect } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Filter,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Clock,
} from 'lucide-react'
import { useAgendaEvents } from '../../hooks/useAgendaEvents'
import { usePatients } from '../../hooks/usePatients'
import { useUpdateAppointment } from '../../hooks/useAppointments'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isSameDay,
  parseISO,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { MonthView, WeekView, DayView, AgendaFilters, EventDetailsDialog, EventItem } from '../../components/agenda'
import { NewAppointmentDialog } from '../../components/NewAppointmentDialog'
import type { AgendaEvent, AgendaEventType, AgendaView, AgendaMode } from '../../types/agenda'
import { ALL_EVENT_TYPES } from '../../types/agenda'
import { cn } from '../../lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { agendaKeys } from '../../hooks/useAgendaEvents'

export default function AgendaPage() {
  // État de la vue
  const [view, setView] = useState<AgendaView>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // État des filtres
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<AgendaEventType[]>([...ALL_EVENT_TYPES])
  const [mode, setMode] = useState<AgendaMode>('all')
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>()

  // État des dialogs
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [showNewAppointment, setShowNewAppointment] = useState(false)

  // Calculer les dates de début et fin selon la vue
  const { startDate, endDate } = useMemo(() => {
    switch (view) {
      case 'month':
        return {
          startDate: startOfMonth(currentDate),
          endDate: endOfMonth(currentDate),
        }
      case 'week':
        return {
          startDate: startOfWeek(currentDate, { weekStartsOn: 1 }),
          endDate: endOfWeek(currentDate, { weekStartsOn: 1 }),
        }
      case 'day':
        return {
          startDate: selectedDate,
          endDate: selectedDate,
        }
    }
  }, [view, currentDate, selectedDate])

  // Charger les événements
  const { data: events = [], isLoading } = useAgendaEvents({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    patientId: selectedPatientId,
    types: selectedTypes.length < ALL_EVENT_TYPES.length ? selectedTypes : undefined,
  })

  // Charger les patientes pour le filtre
  const { data: patients = [] } = usePatients()

  // Hooks pour les actions
  const updateAppointment = useUpdateAppointment()
  const queryClient = useQueryClient()

  // Filtrer les événements pour le jour sélectionné (vue mois)
  const selectedDayEvents = useMemo(() => {
    return events.filter((event) => isSameDay(parseISO(event.date), selectedDate))
  }, [events, selectedDate])

  // Navigation
  const navigate = useCallback((direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date())
      setSelectedDate(new Date())
      return
    }

    const delta = direction === 'next' ? 1 : -1

    switch (view) {
      case 'month':
        setCurrentDate(delta > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(delta > 0 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
        break
      case 'day':
        const newDate = delta > 0 ? addDays(selectedDate, 1) : subDays(selectedDate, 1)
        setSelectedDate(newDate)
        setCurrentDate(newDate)
        break
    }
  }, [view, currentDate, selectedDate])

  // Raccourcis clavier
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key.toLowerCase()) {
        case 'm':
          setView('month')
          break
        case 'w':
          setView('week')
          break
        case 'd':
          setView('day')
          break
        case 't':
          navigate('today')
          break
        case 'arrowleft':
          navigate('prev')
          break
        case 'arrowright':
          navigate('next')
          break
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [navigate])

  // Gestion des actions sur les événements
  const handleEventAction = async (action: string, event: AgendaEvent) => {
    switch (action) {
      case 'confirm':
        if (event.type === 'appointment') {
          await updateAppointment.mutateAsync({
            id: event.id,
            data: { status: 'confirme' },
          })
          queryClient.invalidateQueries({ queryKey: agendaKeys.events() })
        }
        break

      case 'cancel':
        if (event.type === 'appointment') {
          await updateAppointment.mutateAsync({
            id: event.id,
            data: { status: 'annule' },
          })
          queryClient.invalidateQueries({ queryKey: agendaKeys.events() })
        }
        break

      case 'view':
        // Navigation vers la page de détail selon le type
        if (event.patient) {
          window.location.href = `/patients/${event.patient.id}`
        }
        break

      case 'mark_read':
        // TODO: Implémenter l'API pour marquer une alerte comme lue
        console.log('Mark as read:', event.id)
        break

      case 'dismiss':
        // TODO: Implémenter l'API pour ignorer une alerte
        console.log('Dismiss:', event.id)
        break
    }

    setShowEventDetails(false)
  }

  // Titre de la période affichée
  const periodTitle = useMemo(() => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: fr })
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
        return `${format(weekStart, 'd')} - ${format(weekEnd, 'd MMMM yyyy', { locale: fr })}`
      case 'day':
        return format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })
    }
  }, [view, currentDate, selectedDate])

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* En-tête */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Agenda</h1>
          <span className="text-sm text-slate-500">
            {events.length} événement{events.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation */}
          <div className="flex items-center gap-1 mr-4">
            <Button variant="outline" size="icon" onClick={() => navigate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('today')}>
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Titre de la période */}
          <div className="min-w-[200px] text-center">
            <span className="font-medium text-slate-900 capitalize">{periodTitle}</span>
          </div>

          {/* Sélecteur de vue */}
          <div className="flex items-center border rounded-lg p-1 ml-4">
            <Button
              variant={view === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('month')}
              className="gap-1"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Mois</span>
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('week')}
              className="gap-1"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Semaine</span>
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('day')}
              className="gap-1"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Jour</span>
            </Button>
          </div>

          {/* Bouton filtres */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
            {selectedTypes.length < ALL_EVENT_TYPES.length && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                {selectedTypes.length}
              </span>
            )}
          </Button>

          {/* Bouton nouveau RDV */}
          <Button size="sm" onClick={() => setShowNewAppointment(true)} className="ml-2">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Zone du calendrier */}
        <div className="flex-1 flex overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <>
              {/* Vue calendrier */}
              <div className={cn('flex-1 overflow-auto p-4', view === 'month' && 'lg:pr-0')}>
                {view === 'month' && (
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <MonthView
                        currentDate={currentDate}
                        selectedDate={selectedDate}
                        events={events}
                        onSelectDate={(date) => {
                          setSelectedDate(date)
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

                {view === 'week' && (
                  <WeekView
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    events={events}
                    onSelectDate={(date) => {
                      setSelectedDate(date)
                      setView('day')
                    }}
                    onEventClick={(event) => {
                      setSelectedEvent(event)
                      setShowEventDetails(true)
                    }}
                  />
                )}

                {view === 'day' && (
                  <Card className="h-full">
                    <CardContent className="p-0 h-full">
                      <DayView
                        selectedDate={selectedDate}
                        events={selectedDayEvents}
                        onEventClick={(event) => {
                          setSelectedEvent(event)
                          setShowEventDetails(true)
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Panneau latéral jour sélectionné (vue mois uniquement) */}
              {view === 'month' && (
                <div className="hidden lg:block w-80 p-4 pl-0">
                  <Card className="h-full">
                    <CardContent className="p-4 h-full overflow-auto">
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarIcon className="h-5 w-5 text-slate-600" />
                        <h3 className="font-semibold text-slate-900">
                          {format(selectedDate, 'd MMMM', { locale: fr })}
                        </h3>
                      </div>

                      {selectedDayEvents.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-sm text-slate-500">Aucun événement</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => setShowNewAppointment(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un RDV
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedDayEvents.map((event) => (
                            <EventItem
                              key={event.id}
                              event={event}
                              onClick={() => {
                                setSelectedEvent(event)
                                setShowEventDetails(true)
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>

        {/* Panneau de filtres */}
        <AgendaFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          mode={mode}
          onModeChange={setMode}
          patients={patients.map((p: any) => ({
            id: p.id,
            firstName: p.firstName,
            lastName: p.lastName,
          }))}
          selectedPatientId={selectedPatientId}
          onPatientChange={setSelectedPatientId}
        />
      </div>

      {/* Dialogs */}
      <EventDetailsDialog
        event={selectedEvent}
        open={showEventDetails}
        onOpenChange={setShowEventDetails}
        onAction={handleEventAction}
      />

      <NewAppointmentDialog
        open={showNewAppointment}
        onOpenChange={setShowNewAppointment}
        defaultDate={selectedDate}
      />
    </div>
  )
}
