import { useMemo, useRef, useEffect } from 'react'
import { format, parseISO, differenceInMinutes } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '../../lib/utils'
import type { AgendaEvent } from '../../types/agenda'
import { EventItem } from './EventItem'

interface DayViewProps {
  selectedDate: Date
  events: AgendaEvent[]
  onEventClick: (event: AgendaEvent) => void
}

const HOUR_HEIGHT = 60 // pixels par heure
const START_HOUR = 0
const END_HOUR = 24
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)

export function DayView({ selectedDate, events, onEventClick }: DayViewProps) {
  const timelineRef = useRef<HTMLDivElement>(null)

  // Séparer les événements avec heure et sans heure (toute la journée)
  const { timedEvents, allDayEvents } = useMemo(() => {
    const timed: AgendaEvent[] = []
    const allDay: AgendaEvent[] = []

    for (const event of events) {
      const eventTime = parseISO(event.date)
      const timeStr = format(eventTime, 'HH:mm')

      // Si l'heure est 00:00 et pas de endDate, c'est un événement "toute la journée"
      if (timeStr === '00:00' && !event.endDate) {
        allDay.push(event)
      } else {
        timed.push(event)
      }
    }

    // Trier les événements par heure
    timed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return { timedEvents: timed, allDayEvents: allDay }
  }, [events])

  // Calculer les colonnes pour éviter les chevauchements
  const timedEventsWithColumns = useMemo(() => {
    const result: Array<AgendaEvent & { column: number; totalColumns: number }> = []
    const activeEvents: Array<{ event: AgendaEvent; endTime: Date; column: number }> = []

    for (const event of timedEvents) {
      const startTime = parseISO(event.date)
      const endTime = event.endDate ? parseISO(event.endDate) : new Date(startTime.getTime() + 30 * 60 * 1000)

      // Retirer les événements terminés
      const stillActive = activeEvents.filter(ae => ae.endTime > startTime)

      // Trouver une colonne libre
      const usedColumns = new Set(stillActive.map(ae => ae.column))
      let column = 0
      while (usedColumns.has(column)) column++

      // Calculer le nombre total de colonnes pour ce groupe
      const totalColumns = Math.max(column + 1, ...stillActive.map(ae => ae.column + 1))

      result.push({ ...event, column, totalColumns })
      stillActive.push({ event, endTime, column })

      // Mettre à jour totalColumns pour les événements actifs
      for (const ae of stillActive) {
        const idx = result.findIndex(r => r.id === ae.event.id)
        if (idx >= 0) {
          result[idx].totalColumns = Math.max(result[idx].totalColumns, totalColumns)
        }
      }

      activeEvents.length = 0
      activeEvents.push(...stillActive)
    }

    return result
  }, [timedEvents])

  // Scroll vers l'heure actuelle ou 8h au chargement
  useEffect(() => {
    if (timelineRef.current) {
      const now = new Date()
      const currentHour = now.getHours()
      // Scroll vers l'heure actuelle, ou vers 8h par défaut
      const targetHour = currentHour >= 7 && currentHour <= 20 ? currentHour : 8
      const scrollPosition = targetHour * HOUR_HEIGHT - 50
      timelineRef.current.scrollTop = Math.max(0, scrollPosition)
    }
  }, [selectedDate])

  // Calculer la position et la hauteur d'un événement
  const getEventPosition = (event: AgendaEvent) => {
    const eventStart = parseISO(event.date)
    const eventEnd = event.endDate ? parseISO(event.endDate) : null

    const startHour = eventStart.getHours() + eventStart.getMinutes() / 60
    const top = (startHour - START_HOUR) * HOUR_HEIGHT

    let height = HOUR_HEIGHT / 2 // hauteur par défaut de 30min
    if (eventEnd) {
      const durationMinutes = differenceInMinutes(eventEnd, eventStart)
      height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 25) // min 25px
    }

    return { top, height }
  }

  // Indicateur de l'heure actuelle
  const currentTimePosition = useMemo(() => {
    const now = new Date()
    const currentHour = now.getHours() + now.getMinutes() / 60
    return currentHour * HOUR_HEIGHT
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* En-tête avec la date */}
      <div className="text-center py-3 border-b bg-slate-50">
        <div className="text-lg font-semibold text-slate-900">
          {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
        </div>
        <div className="text-sm text-slate-500">
          {events.length} événement{events.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Section "Toute la journée" */}
      {allDayEvents.length > 0 && (
        <div className="border-b bg-slate-50/50 p-3 max-h-[150px] overflow-y-auto">
          <div className="text-xs font-medium text-slate-500 uppercase mb-2">
            Toute la journée ({allDayEvents.length})
          </div>
          <div className="space-y-1">
            {allDayEvents.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                compact
                onClick={() => onEventClick(event)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Timeline 00h-24h */}
      <div
        ref={timelineRef}
        className="flex-1 overflow-y-auto relative"
        style={{ minHeight: '500px' }}
      >
        <div className="flex" style={{ height: (END_HOUR - START_HOUR) * HOUR_HEIGHT }}>
          {/* Colonne des heures */}
          <div className="w-14 flex-shrink-0 border-r bg-slate-50/50">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="relative text-right pr-2 text-xs text-slate-500 border-b border-slate-100"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="absolute -top-2 right-2">
                  {String(hour).padStart(2, '0')}h
                </span>
              </div>
            ))}
          </div>

          {/* Zone des événements */}
          <div className="flex-1 relative">
            {/* Lignes de grille */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="border-b border-slate-100"
                style={{ height: HOUR_HEIGHT }}
              />
            ))}

            {/* Indicateur de l'heure actuelle */}
            <div
              className="absolute left-0 right-0 flex items-center z-30 pointer-events-none"
              style={{ top: currentTimePosition }}
            >
              <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5" />
              <div className="flex-1 h-0.5 bg-red-500" />
            </div>

            {/* Événements positionnés avec gestion des chevauchements */}
            {timedEventsWithColumns.map((event) => {
              const { top, height } = getEventPosition(event)
              const eventTime = parseISO(event.date)
              const width = `calc((100% - 8px) / ${event.totalColumns})`
              const left = `calc(4px + (100% - 8px) * ${event.column} / ${event.totalColumns})`

              return (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    'absolute rounded-lg overflow-hidden transition-all hover:shadow-lg z-10',
                    'border bg-white hover:z-20'
                  )}
                  style={{
                    top,
                    left,
                    width,
                    height: Math.max(height, 28),
                    borderLeftWidth: '4px',
                    borderLeftColor: event.color,
                  }}
                >
                  <div className="p-1.5 h-full overflow-hidden">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] font-medium text-slate-600">
                        {format(eventTime, 'HH:mm')}
                      </span>
                      {event.severity === 'critical' && (
                        <span className="px-1 py-0.5 bg-red-100 text-red-700 text-[8px] font-bold rounded">
                          !
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-xs text-slate-900 truncate">
                      {event.title}
                    </div>
                    {event.patient && height > 45 && (
                      <div className="text-[10px] text-slate-500 truncate">
                        {event.patient.firstName} {event.patient.lastName}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Liste récapitulative en bas */}
      {events.length > 0 && (
        <div className="border-t bg-slate-50/50 p-3 max-h-[250px] overflow-y-auto">
          <div className="text-xs font-medium text-slate-500 uppercase mb-2">
            Liste complète ({events.length})
          </div>
          <div className="space-y-1">
            {events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  compact
                  onClick={() => onEventClick(event)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
