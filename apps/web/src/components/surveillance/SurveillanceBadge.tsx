import { AlertTriangle, Eye, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SurveillanceBadgeProps {
  niveau: 'normal' | 'vigilance' | 'rapprochee'
  raison?: string
  className?: string
  compact?: boolean
}

const NIVEAU_CONFIG = {
  normal: {
    icon: Eye,
    label: 'Surveillance',
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-700',
    iconBg: 'bg-green-200',
  },
  vigilance: {
    icon: AlertCircle,
    label: 'Vigilance',
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
    text: 'text-yellow-700',
    iconBg: 'bg-yellow-200',
  },
  rapprochee: {
    icon: AlertTriangle,
    label: 'Rapprochée',
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-700',
    iconBg: 'bg-red-200',
  },
}

const RAISON_LABELS: Record<string, string> = {
  hta: 'HTA',
  diabete: 'Diabète',
  rciu: 'RCIU',
  macrosomie: 'Macrosomie',
  map: 'MAP',
  antecedents: 'Antécédents',
  age_maternel: 'Âge maternel',
  grossesse_multiple: 'Grossesse multiple',
  autre: 'Autre',
}

export function SurveillanceBadge({ niveau, raison, className, compact = false }: SurveillanceBadgeProps) {
  const config = NIVEAU_CONFIG[niveau]
  const Icon = config.icon

  if (compact) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2 py-1',
          config.bg,
          config.border,
          config.text,
          className
        )}
        title={`${config.label}${raison ? `: ${RAISON_LABELS[raison] || raison}` : ''}`}
      >
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">{config.label}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-3 py-2',
        config.bg,
        config.border,
        className
      )}
    >
      <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.iconBg)}>
        <Icon className={cn('h-4 w-4', config.text)} />
      </div>
      <div>
        <div className={cn('text-sm font-semibold', config.text)}>{config.label}</div>
        {raison && (
          <div className="text-xs text-gray-600">{RAISON_LABELS[raison] || raison}</div>
        )}
      </div>
    </div>
  )
}
