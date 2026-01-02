import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
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
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  ExternalLink,
  Bell,
  BellOff,
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

interface EventDetailsDialogProps {
  event: AgendaEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction?: (action: string, event: AgendaEvent) => void
}

export function EventDetailsDialog({
  event,
  open,
  onOpenChange,
  onAction,
}: EventDetailsDialogProps) {
  if (!event) return null

  const IconComponent = ICONS[event.icon] || Calendar
  const eventDate = parseISO(event.date)
  const hasTime = format(eventDate, 'HH:mm') !== '00:00'

  // Actions contextuelles selon le type d'événement
  const getActions = () => {
    const actions: { label: string; action: string; icon: React.ComponentType<any>; variant?: 'default' | 'destructive' | 'outline' }[] = []

    switch (event.type) {
      case 'appointment':
        if (event.status === 'planifie') {
          actions.push({ label: 'Confirmer', action: 'confirm', icon: CheckCircle })
        }
        if (event.status !== 'annule' && event.status !== 'termine') {
          actions.push({ label: 'Annuler', action: 'cancel', icon: XCircle, variant: 'destructive' })
        }
        actions.push({ label: 'Voir détails', action: 'view', icon: ExternalLink, variant: 'outline' })
        break

      case 'alerte_info':
      case 'alerte_warning':
      case 'alerte_urgent':
        if (!event.metadata?.isRead) {
          actions.push({ label: 'Marquer lue', action: 'mark_read', icon: Eye })
        }
        actions.push({ label: 'Ignorer', action: 'dismiss', icon: BellOff, variant: 'outline' })
        break

      case 'consultation':
        actions.push({ label: 'Voir consultation', action: 'view', icon: ExternalLink, variant: 'outline' })
        break

      case 'examen_prenatal':
        if (event.status === 'a_faire') {
          actions.push({ label: 'Marquer réalisé', action: 'mark_done', icon: CheckCircle })
        }
        actions.push({ label: 'Voir détails', action: 'view', icon: ExternalLink, variant: 'outline' })
        break

      default:
        actions.push({ label: 'Voir détails', action: 'view', icon: ExternalLink, variant: 'outline' })
    }

    return actions
  }

  const actions = getActions()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${event.color}20` }}
            >
              <span style={{ color: event.color }}>
              <IconComponent className="w-5 h-5" />
            </span>
            </div>
            <div>
              <DialogTitle className="text-left">{event.title}</DialogTitle>
              <div className="text-sm text-slate-500 mt-0.5">
                {format(eventDate, "EEEE d MMMM yyyy", { locale: fr })}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informations principales */}
          <div className="space-y-3">
            {hasTime && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  {format(eventDate, 'HH:mm')}
                  {event.endDate && ` - ${format(parseISO(event.endDate), 'HH:mm')}`}
                </span>
              </div>
            )}

            {event.patient && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-slate-400" />
                <span>{event.patient.firstName} {event.patient.lastName}</span>
              </div>
            )}

            {event.metadata?.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{event.metadata.location}</span>
              </div>
            )}

            {event.status && (
              <div className="flex items-center gap-3 text-sm">
                <Info className="w-4 h-4 text-slate-400" />
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
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
              </div>
            )}

            {event.severity && event.severity !== 'info' && (
              <div className="flex items-center gap-3 text-sm">
                <Bell className="w-4 h-4 text-slate-400" />
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium uppercase',
                    event.severity === 'warning' && 'bg-orange-100 text-orange-700',
                    event.severity === 'critical' && 'bg-red-100 text-red-700'
                  )}
                >
                  {event.severity === 'critical' ? 'Urgent' : 'Attention'}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700">{event.description}</p>
            </div>
          )}

          {/* Métadonnées supplémentaires selon le type */}
          {event.metadata && (
            <div className="text-xs text-slate-500 space-y-1">
              {event.metadata.type && (
                <div>Type: {event.metadata.type}</div>
              )}
              {event.metadata.saPrevue && (
                <div>SA prévue: {event.metadata.saPrevue}</div>
              )}
              {event.metadata.priorite && (
                <div>Priorité: {event.metadata.priorite}</div>
              )}
              {event.metadata.examens && event.metadata.examens.length > 0 && (
                <div>
                  <div className="font-medium mt-2 mb-1">Examens:</div>
                  <ul className="list-disc list-inside">
                    {event.metadata.examens.slice(0, 5).map((exam: string, i: number) => (
                      <li key={i}>{exam}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {actions.map(({ label, action, icon: ActionIcon, variant = 'default' }) => (
              <Button
                key={action}
                variant={variant}
                size="sm"
                onClick={() => onAction?.(action, event)}
                className="flex-1 min-w-[120px]"
              >
                <ActionIcon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
