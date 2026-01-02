import { useMemo } from 'react'
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '../../lib/utils'
import type { AgendaEvent } from '../../types/agenda'
import { EventItem } from './EventItem'

interface WeekViewProps {
  currentDate: Date
  selectedDate: Date
  events: AgendaEvent[]
  onSelectDate: (date: Date) => void
  onEventClick: (event: AgendaEvent) => void
}

export function WeekView({
  currentDate,
  selectedDate,
  events,
  onSelectDate,
  onEventClick,
}: WeekViewProps) {
  // Générer les jours de la semaine
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [currentDate])

  // Grouper les événements par jour
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, AgendaEvent[]>()

    for (const event of events) {
      const dateKey = format(parseISO(event.date), 'yyyy-MM-dd')
      const existing = grouped.get(dateKey) || []
      existing.push(event)
      grouped.set(dateKey, existing)
    }

    // Trier les événements par heure dans chaque jour
    for (const [, dayEvents] of grouped) {
      dayEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    return grouped
  }, [events])

  return (
    <div className="w-full">
      {/* Grille des jours de la semaine */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayEvents = eventsByDay.get(dateKey) || []
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentDay = isToday(day)
          const hasUrgent = dayEvents.some(e => e.type === 'alerte_urgent')

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-[200px] rounded-lg border transition-all',
                isSelected && 'border-blue-500 bg-blue-50/30',
                !isSelected && 'border-slate-200 hover:border-slate-300',
                hasUrgent && !isSelected && 'border-red-300 bg-red-50/30'
              )}
            >
              {/* En-tête du jour */}
              <button
                onClick={() => onSelectDate(day)}
                className={cn(
                  'w-full p-2 text-center border-b transition-colors',
                  isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100',
                  isCurrentDay && !isSelected && 'bg-blue-100'
                )}
              >
                <div className="text-xs font-medium uppercase">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div
                  className={cn(
                    'text-lg font-semibold',
                    isCurrentDay && !isSelected && 'text-blue-600'
                  )}
                >
                  {format(day, 'd')}
                </div>
              </button>

              {/* Liste des événements */}
              <div className="p-1.5 space-y-1 max-h-[300px] overflow-y-auto">
                {dayEvents.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-4">
                    Aucun événement
                  </div>
                ) : (
                  <>
                    {dayEvents.slice(0, 4).map((event) => (
                      <EventItem
                        key={event.id}
                        event={event}
                        compact
                        onClick={() => onEventClick(event)}
                      />
                    ))}
                    {dayEvents.length > 4 && (
                      <button
                        onClick={() => onSelectDate(day)}
                        className="w-full text-xs text-blue-600 hover:text-blue-800 py-1 font-medium"
                      >
                        +{dayEvents.length - 4} autres...
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
