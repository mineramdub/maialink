import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
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
  Filter,
  X,
  Check,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react'
import type { AgendaEventType, AgendaMode } from '../../types/agenda'
import { EVENT_CONFIG, ALL_EVENT_TYPES } from '../../types/agenda'

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

interface AgendaFiltersProps {
  isOpen: boolean
  onClose: () => void
  selectedTypes: AgendaEventType[]
  onTypesChange: (types: AgendaEventType[]) => void
  mode: AgendaMode
  onModeChange: (mode: AgendaMode) => void
  patients?: { id: string; firstName: string; lastName: string }[]
  selectedPatientId?: string
  onPatientChange: (patientId?: string) => void
}

export function AgendaFilters({
  isOpen,
  onClose,
  selectedTypes,
  onTypesChange,
  mode,
  onModeChange,
  patients = [],
  selectedPatientId,
  onPatientChange,
}: AgendaFiltersProps) {
  const toggleType = (type: AgendaEventType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const selectAll = () => {
    onTypesChange([...ALL_EVENT_TYPES])
  }

  const selectNone = () => {
    onTypesChange([])
  }

  if (!isOpen) return null

  return (
    <div className="w-72 border-l bg-white flex flex-col h-full">
      {/* En-tête */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-600" />
          <span className="font-semibold text-slate-900">Filtres</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Mode de vue */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Mode</h3>
          <div className="space-y-1">
            <button
              onClick={() => {
                onModeChange('all')
                onPatientChange(undefined)
              }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                mode === 'all' && !selectedPatientId
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-slate-100 text-slate-700'
              )}
            >
              <Users className="w-4 h-4" />
              <span>Toutes les patientes</span>
            </button>
            <button
              onClick={() => onModeChange('today')}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                mode === 'today'
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-slate-100 text-slate-700'
              )}
            >
              <Calendar className="w-4 h-4" />
              <span>RDV du jour</span>
            </button>
          </div>
        </div>

        {/* Filtre par patiente */}
        {patients.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">
              Patiente
            </h3>
            <select
              value={selectedPatientId || ''}
              onChange={(e) => {
                onPatientChange(e.target.value || undefined)
                if (e.target.value) onModeChange('patient')
              }}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
            >
              <option value="">Toutes les patientes</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.lastName} {patient.firstName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Types d'événements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase">
              Types d'événements
            </h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={selectAll} className="h-6 px-2 text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Tous
              </Button>
              <Button variant="ghost" size="sm" onClick={selectNone} className="h-6 px-2 text-xs">
                <EyeOff className="w-3 h-3 mr-1" />
                Aucun
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            {ALL_EVENT_TYPES.map((type) => {
              const config = EVENT_CONFIG[type]
              const IconComponent = ICONS[config.icon] || Calendar
              const isSelected = selectedTypes.includes(type)

              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                    isSelected
                      ? 'bg-white shadow-sm border'
                      : 'hover:bg-slate-50 opacity-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center transition-all',
                      isSelected ? '' : 'opacity-40'
                    )}
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <IconComponent
                      className="w-3.5 h-3.5"
                    />
                  </div>
                  <span className={cn('flex-1 text-left', !isSelected && 'text-slate-400')}>
                    {config.label}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
