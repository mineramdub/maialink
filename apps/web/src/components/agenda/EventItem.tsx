import { format, parseISO } from 'date-fns'
import { cn } from '../../lib/utils'
import type { AgendaEvent } from '../../types/agenda'
import {
  Calendar,
  Stethoscope,
  Info,
  AlertTriangle,
  AlertOctagon,
  TestTube,
  Baby,
  Activity,
  Heart,
  HeartPulse,
  Star,
  Clock,
  User,
} from 'lucide-react'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar,
  Stethoscope,
  Info,
  AlertTriangle,
  AlertOctagon,
  TestTube,
  Baby,
  Activity,
  Heart,
  HeartPulse,
  Star,
}

interface EventItemProps {
  event: AgendaEvent
  compact?: boolean
  onClick?: () => void
}

export function EventItem({ event, compact = false, onClick }: EventItemProps) {
  const IconComponent = ICONS[event.icon] || Calendar
  const eventTime = parseISO(event.date)
  const hasTime = format(eventTime, 'HH:mm') !== '00:00'

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full text-left p-1.5 rounded text-xs transition-all hover:opacity-80',
          'border-l-2 bg-white shadow-sm hover:shadow'
        )}
        style={{ borderLeftColor: event.color }}
      >
        <div className="flex items-center gap-1">
          <span style={{ color: event.color }}>
            <IconComponent className="w-3 h-3 flex-shrink-0" />
          </span>
          <span className="font-medium truncate flex-1">{event.title}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-slate-500">
          {hasTime && (
            <span className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {format(eventTime, 'HH:mm')}
            </span>
          )}
          {event.patient && (
            <span className="flex items-center gap-0.5 truncate">
              <User className="w-2.5 h-2.5" />
              {event.patient.lastName}
            </span>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-lg transition-all hover:shadow-md',
        'border bg-white'
      )}
      style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${event.color}20` }}
        >
          <span style={{ color: event.color }}>
            <IconComponent className="w-4 h-4" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 truncate">{event.title}</span>
            {event.severity === 'critical' && (
              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded uppercase">
                Urgent
              </span>
            )}
            {event.status && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-[10px] font-medium rounded',
                  event.status === 'planifie' && 'bg-blue-100 text-blue-700',
                  event.status === 'confirme' && 'bg-green-100 text-green-700',
                  event.status === 'termine' && 'bg-gray-100 text-gray-700',
                  event.status === 'annule' && 'bg-red-100 text-red-700',
                  event.status === 'realise' && 'bg-green-100 text-green-700',
                  event.status === 'a_faire' && 'bg-yellow-100 text-yellow-700'
                )}
              >
                {event.status.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{event.description}</p>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            {hasTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(eventTime, 'HH:mm')}
                {event.endDate && ` - ${format(parseISO(event.endDate), 'HH:mm')}`}
              </span>
            )}
            {event.patient && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {event.patient.firstName} {event.patient.lastName}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
