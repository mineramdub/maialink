import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  FileText,
  TestTube,
  Activity,
  Stethoscope
} from 'lucide-react'

interface CalendarEvent {
  id: string
  titre: string
  description: string
  saMin: number
  saMax: number
  type: 'consultation' | 'examen' | 'echographie' | 'biologie' | 'depistage'
  priorite: 'obligatoire' | 'recommande' | 'optionnel'
  examens?: string[]
  conseils?: string[]
  status?: 'done' | 'pending' | 'overdue' | 'upcoming'
}

interface Props {
  grossesseId: string
  currentSA: number
  ddr: string
  dpa: string
  calendrierEvents: CalendarEvent[]
}

export function CalendrierGrossesse({ grossesseId, currentSA, ddr, dpa, calendrierEvents }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="h-4 w-4" />
      case 'echographie':
        return <Activity className="h-4 w-4" />
      case 'biologie':
      case 'depistage':
        return <TestTube className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (event: CalendarEvent) => {
    if (currentSA < event.saMin) {
      // À venir
      return 'bg-slate-100 border-slate-300 text-slate-700'
    } else if (currentSA >= event.saMin && currentSA <= event.saMax) {
      // En cours
      return 'bg-blue-100 border-blue-400 text-blue-800'
    } else {
      // Passé (devrait vérifier si fait)
      return 'bg-green-100 border-green-400 text-green-800'
    }
  }

  const getStatusIcon = (event: CalendarEvent) => {
    if (currentSA < event.saMin) {
      return <Clock className="h-4 w-4 text-slate-500" />
    } else if (currentSA >= event.saMin && currentSA <= event.saMax) {
      return <AlertCircle className="h-4 w-4 text-blue-600" />
    } else {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    }
  }

  const getStatusLabel = (event: CalendarEvent) => {
    if (currentSA < event.saMin) {
      return `À partir de ${event.saMin} SA`
    } else if (currentSA >= event.saMin && currentSA <= event.saMax) {
      return 'À prévoir maintenant'
    } else {
      return 'Période passée'
    }
  }

  // Grouper par trimestre
  const t1Events = calendrierEvents.filter(e => e.saMax <= 14)
  const t2Events = calendrierEvents.filter(e => e.saMin >= 14 && e.saMax < 28)
  const t3Events = calendrierEvents.filter(e => e.saMin >= 28 && e.saMax < 42)
  const postPartumEvents = calendrierEvents.filter(e => e.saMin >= 42)

  const renderEventList = (events: CalendarEvent[], trimestre: string) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {trimestre}
      </h3>
      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(event)}`}
            onClick={() => {
              setSelectedEvent(event)
              setShowDetails(true)
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                {getStatusIcon(event)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{event.titre}</span>
                    {event.priorite === 'obligatoire' && (
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300">
                        Obligatoire
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs opacity-75">{event.saMin}-{event.saMax} SA</p>
                  <p className="text-xs mt-1 opacity-90">{getStatusLabel(event)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getEventIcon(event.type)}
                <ChevronRight className="h-4 w-4 opacity-50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendrier de suivi de grossesse
          </CardTitle>
          <div className="flex gap-4 text-sm text-slate-600 mt-2">
            <span>Terme actuel : <strong>{Math.floor(currentSA)} SA + {Math.floor((currentSA % 1) * 7)} j</strong></span>
            <span>DDR : {new Date(ddr).toLocaleDateString('fr-FR')}</span>
            <span>DPA : {new Date(dpa).toLocaleDateString('fr-FR')}</span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Timeline visuelle */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">Progression</span>
              <span className="text-xs font-medium text-slate-600">{Math.floor((currentSA / 41) * 100)}%</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                style={{ width: `${Math.min((currentSA / 41) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>0 SA</span>
              <span>14 SA</span>
              <span>28 SA</span>
              <span>41 SA</span>
            </div>
          </div>

          {/* Liste des événements par trimestre */}
          {renderEventList(t1Events, '1er Trimestre (0-14 SA)')}
          {renderEventList(t2Events, '2e Trimestre (14-28 SA)')}
          {renderEventList(t3Events, '3e Trimestre (28-41 SA)')}
          {renderEventList(postPartumEvents, 'Post-partum')}
        </CardContent>
      </Card>

      {/* Modal détails événement */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowDetails(false)}>
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getEventIcon(selectedEvent.type)}
                    {selectedEvent.titre}
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-1">{selectedEvent.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge>
                      {selectedEvent.saMin}-{selectedEvent.saMax} SA
                    </Badge>
                    {selectedEvent.priorite === 'obligatoire' && (
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                        Obligatoire
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedEvent.examens && selectedEvent.examens.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Examens à réaliser
                  </h4>
                  <ul className="space-y-1">
                    {selectedEvent.examens.map((examen, i) => (
                      <li key={i} className="text-sm text-slate-700 pl-6">
                        • {examen}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedEvent.conseils && selectedEvent.conseils.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Conseils & Points de vigilance
                  </h4>
                  <ul className="space-y-1">
                    {selectedEvent.conseils.map((conseil, i) => (
                      <li key={i} className="text-sm text-slate-700 pl-6">
                        • {conseil}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    // TODO: Créer consultation
                    setShowDetails(false)
                  }}
                  className="flex-1"
                >
                  Créer consultation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                  className="flex-1"
                >
                  Fermer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
