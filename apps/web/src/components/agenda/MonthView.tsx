import { useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
} from 'date-fns'
// import { fr } from 'date-fns/locale'
import { cn } from '../../lib/utils'
import type { AgendaEvent } from '../../types/agenda'

interface MonthViewProps {
  currentDate: Date
  selectedDate: Date
  events: AgendaEvent[]
  onSelectDate: (date: Date) => void
}

export function MonthView({ currentDate, selectedDate, events, onSelectDate }: MonthViewProps) {
  // Générer les jours du mois avec padding pour remplir les semaines
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
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

    return grouped
  }, [events])

  // Vérifier si un jour a des alertes urgentes
  const hasUrgentAlerts = (dayEvents: AgendaEvent[]) => {
    return dayEvents.some(e => e.type === 'alerte_urgent')
  }

  // Vérifier si un jour a des alertes warning
  const hasWarningAlerts = (dayEvents: AgendaEvent[]) => {
    return dayEvents.some(e => e.type === 'alerte_warning')
  }

  // Obtenir les couleurs uniques des événements d'un jour (max 5)
  const getEventDots = (dayEvents: AgendaEvent[]) => {
    const uniqueColors = [...new Set(dayEvents.map(e => e.color))]
    return uniqueColors.slice(0, 5)
  }

  return (
    <div className="w-full">
      {/* En-têtes des jours */}
      <div className="grid grid-cols-7 mb-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayEvents = eventsByDay.get(dateKey) || []
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)
          const urgent = hasUrgentAlerts(dayEvents)
          const warning = hasWarningAlerts(dayEvents)
          const dots = getEventDots(dayEvents)
          const extraCount = dayEvents.length > 5 ? dayEvents.length - 5 : 0

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                'relative aspect-square p-1 rounded-lg transition-all flex flex-col items-center justify-start',
                // États de base
                !isCurrentMonth && 'opacity-40',
                isCurrentMonth && 'hover:bg-slate-100',
                // Sélection
                isSelected && 'bg-blue-600 text-white hover:bg-blue-700',
                // Aujourd'hui
                isCurrentDay && !isSelected && 'ring-2 ring-blue-600 ring-inset',
                // Alertes urgentes - bordure rouge
                urgent && !isSelected && 'ring-2 ring-red-500 ring-inset bg-red-50',
                // Alertes warning - bordure orange si pas d'urgent
                warning && !urgent && !isSelected && 'ring-2 ring-orange-400 ring-inset bg-orange-50/50'
              )}
            >
              {/* Numéro du jour */}
              <span
                className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-white' : isCurrentDay ? 'text-blue-600' : ''
                )}
              >
                {format(day, 'd')}
              </span>

              {/* Points colorés des événements */}
              {dots.length > 0 && (
                <div className="flex flex-wrap gap-0.5 justify-center mt-1 max-w-full">
                  {dots.map((color, index) => (
                    <div
                      key={index}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        isSelected && 'opacity-80'
                      )}
                      style={{ backgroundColor: isSelected ? 'white' : color }}
                    />
                  ))}
                  {extraCount > 0 && (
                    <span
                      className={cn(
                        'text-[9px] font-medium ml-0.5',
                        isSelected ? 'text-white/80' : 'text-slate-500'
                      )}
                    >
                      +{extraCount}
                    </span>
                  )}
                </div>
              )}

              {/* Badge compteur alertes urgentes */}
              {urgent && (
                <div
                  className={cn(
                    'absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold',
                    isSelected ? 'bg-white text-red-600' : 'bg-red-500 text-white'
                  )}
                >
                  {dayEvents.filter(e => e.type === 'alerte_urgent').length}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
