import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  FileText,
  TestTube,
  Activity,
  Stethoscope,
  Eye,
  EyeOff,
  List,
  AlertTriangle,
  ChevronDown,
  Plus
} from 'lucide-react'
import { cn } from '../lib/utils'

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
  isCompleted?: boolean
  completedDate?: string
}

interface Consultation {
  id: string
  date: string
  type: string
  saTerm?: number
  motif?: string
  examenClinique?: any
}

interface Props {
  grossesseId: string
  currentSA: number
  ddr: string
  dpa: string
  calendrierEvents: CalendarEvent[]
  consultations?: Consultation[]
}

export function CalendrierGrossesse({ grossesseId, currentSA, ddr, dpa, calendrierEvents, consultations = [] }: Props) {
  const navigate = useNavigate()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({})

  // Filter states
  const [showCompleted, setShowCompleted] = useState(false)
  const [filterPriority, setFilterPriority] = useState<'all' | 'obligatoire' | 'recommande'>('all')
  const [filterType, setFilterType] = useState<'all' | 'consultation' | 'examen' | 'echographie'>('all')
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline')

  const handleValidateEvent = async (eventId: string) => {
    try {
      setIsValidating(true)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/grossesses/${grossesseId}/calendar/${eventId}/validate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            dateRealisee: new Date().toISOString(),
            notes: 'Validé depuis le calendrier'
          })
        }
      )

      const data = await res.json()

      if (data.success) {
        alert('Événement marqué comme réalisé avec succès!')
        // Refresh the page to update the calendar
        window.location.reload()
      } else {
        alert(data.error || 'Erreur lors de la validation')
      }
    } catch (error) {
      console.error('Error validating event:', error)
      alert('Erreur lors de la validation')
    } finally {
      setIsValidating(false)
      setShowDetails(false)
    }
  }

  const toggleItem = (key: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const renderClickableText = (text: string, index: number, eventId: string) => {
    const prescriptionKeywords = [
      'échographie',
      'echo',
      'bilan',
      'analyse',
      'prise de sang',
      'prélèvement',
      'toxoplasmose',
      'rubéole',
      'syphilis',
      'hépatite',
      'glycémie',
      'tggo',
      'ogtt',
      'rai',
      'fer',
      'ferritine',
      'nfs',
      'numération',
      'streptocoque',
      'ECBU',
      'albuminurie',
      'glycosurie',
      'monitoring',
      'enregistrement',
      'prescription'
    ]

    const lowerText = text.toLowerCase()
    const foundKeyword = prescriptionKeywords.find(keyword =>
      lowerText.includes(keyword.toLowerCase())
    )

    if (foundKeyword) {
      const regex = new RegExp(`(${foundKeyword})`, 'gi')
      const parts = text.split(regex)

      return (
        <span>
          {parts.map((part, i) => {
            if (part.toLowerCase() === foundKeyword.toLowerCase()) {
              return (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Get patient ID from grossesse
                    navigate(`/ordonnances/new?grossesseId=${grossesseId}`)
                  }}
                  className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                >
                  {part}
                </button>
              )
            }
            return part
          })}
        </span>
      )
    }

    return text
  }

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
    if (event.isCompleted || event.status === 'done') {
      return 'bg-green-50 border-green-200 text-green-800'
    } else if (event.status === 'overdue') {
      return 'bg-orange-50 border-orange-200 text-orange-800'
    } else if (event.status === 'pending') {
      return 'bg-blue-50 border-blue-200 text-blue-800'
    } else {
      // upcoming
      return 'bg-slate-50 border-slate-200 text-slate-700'
    }
  }

  const getStatusIcon = (event: CalendarEvent) => {
    if (event.isCompleted || event.status === 'done') {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    } else if (event.status === 'overdue') {
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    } else if (event.status === 'pending') {
      return <AlertCircle className="h-4 w-4 text-blue-600" />
    } else {
      return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const getStatusLabel = (event: CalendarEvent) => {
    if (event.isCompleted || event.status === 'done') {
      return event.completedDate
        ? `Réalisé le ${new Date(event.completedDate).toLocaleDateString('fr-FR')}`
        : 'Réalisé'
    } else if (event.status === 'overdue') {
      return event.priorite === 'obligatoire' ? 'En retard (obligatoire)' : 'Période passée'
    } else if (event.status === 'pending') {
      return 'À prévoir maintenant'
    } else {
      return `À partir de ${event.saMin} SA`
    }
  }

  // Filter function
  const filterEvents = (events: CalendarEvent[]) => {
    return events.filter(event => {
      // Filtre par statut complété
      if (!showCompleted && event.isCompleted) return false

      // Filtre par priorité
      if (filterPriority !== 'all' && event.priorite !== filterPriority) return false

      // Filtre par type
      if (filterType !== 'all' && event.type !== filterType) return false

      return true
    })
  }

  // Grouper par trimestre
  const t1Events = calendrierEvents.filter(e => e.saMax <= 14)
  const t2Events = calendrierEvents.filter(e => e.saMin >= 14 && e.saMax < 28)
  const t3Events = calendrierEvents.filter(e => e.saMin >= 28 && e.saMax < 42)
  const postPartumEvents = calendrierEvents.filter(e => e.saMin >= 42)

  // Grouper consultations par trimestre
  const t1Consultations = consultations.filter(c => (c.saTerm || 0) <= 14)
  const t2Consultations = consultations.filter(c => (c.saTerm || 0) > 14 && (c.saTerm || 0) < 28)
  const t3Consultations = consultations.filter(c => (c.saTerm || 0) >= 28)

  // Calculate overdue events for alerts
  const overdueEvents = calendrierEvents.filter(
    e => e.status === 'overdue' && !e.isCompleted && e.priorite === 'obligatoire'
  )

  const renderConsultationsList = (consultations: Consultation[], trimestre: string) => {
    if (consultations.length === 0) return null

    return (
      <div className="mb-4">
        <div className="p-3 bg-purple-50 rounded-lg mb-2">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-purple-600" />
            <h4 className="text-sm font-semibold text-purple-900">Consultations réalisées ({consultations.length})</h4>
          </div>
        </div>
        <div className="space-y-2">
          {consultations.map((consultation) => (
            <Link key={consultation.id} to={`/consultations/${consultation.id}`}>
              <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50/50 cursor-pointer transition-all hover:shadow-md hover:border-purple-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100">
                      <Stethoscope className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-900">{consultation.type}</h4>
                        <Badge className="text-xs bg-purple-600">Réalisée</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs mt-2">
                        <span className="text-slate-600">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(consultation.date).toLocaleDateString('fr-FR')}
                        </span>
                        {consultation.saTerm && (
                          <span className="text-slate-600">{consultation.saTerm} SA</span>
                        )}
                        {consultation.motif && (
                          <span className="text-slate-600 truncate">{consultation.motif}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const renderEventList = (events: CalendarEvent[], trimestre: string, trimestreConsultations: Consultation[]) => {
    const filteredEvents = filterEvents(events)
    const hasContent = filteredEvents.length > 0 || trimestreConsultations.length > 0
    if (!hasContent) return null

    const completedCount = filteredEvents.filter(e => e.isCompleted).length
    const hasIncomplete = filteredEvents.some(e => !e.isCompleted)

    return (
      <Collapsible defaultOpen={hasIncomplete || trimestreConsultations.length > 0} className="mb-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-slate-900">{trimestre}</h3>
            <Badge variant={completedCount === filteredEvents.length ? "default" : "secondary"}>
              {completedCount} / {filteredEvents.length}
            </Badge>
            {trimestreConsultations.length > 0 && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {trimestreConsultations.length} consultation{trimestreConsultations.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <ChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-200 ui-expanded:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-4">
          {/* Consultations réalisées d'abord */}
          {renderConsultationsList(trimestreConsultations, trimestre)}

          {/* Puis événements du calendrier */}
          {filteredEvents.length > 0 && (
            <div className="space-y-2">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                    getStatusColor(event)
                  )}
                  onClick={() => {
                    setSelectedEvent(event)
                    setShowDetails(true)
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Icon badge */}
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                        event.isCompleted && "bg-green-100",
                        event.status === 'pending' && "bg-blue-100",
                        event.status === 'overdue' && "bg-orange-100",
                        event.status === 'upcoming' && "bg-slate-100"
                      )}>
                        {getEventIcon(event.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-slate-900">{event.titre}</h4>
                          {event.priorite === 'obligatoire' && (
                            <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs mt-2">
                          <span className="text-slate-500">
                            {event.saMin}-{event.saMax} SA
                          </span>

                          <span className="flex items-center gap-1 font-medium">
                            {getStatusIcon(event)}
                            {getStatusLabel(event)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    )
  }

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
          {/* Barre de contrôles et filtres */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant={showCompleted ? "default" : "outline"}
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {showCompleted ? "Masquer validées" : "Afficher validées"}
              </Button>

              <Select value={filterPriority} onValueChange={(v: any) => setFilterPriority(v)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="obligatoire">Obligatoires</SelectItem>
                  <SelectItem value="recommande">Recommandées</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="consultation">Consultations</SelectItem>
                  <SelectItem value="examen">Examens</SelectItem>
                  <SelectItem value="echographie">Échographies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'timeline' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('timeline')}
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Alert for overdue exams */}
          {overdueEvents.length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-orange-900 text-sm">Examens obligatoires en retard</h3>
                  <p className="text-sm text-orange-800 mt-1">
                    {overdueEvents.length} examen(s) obligatoire(s) n'ont pas été réalisé(s) dans les délais recommandés.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress bars per trimester */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { name: 'T1', events: t1Events },
              { name: 'T2', events: t2Events },
              { name: 'T3', events: t3Events },
              { name: 'PP', events: postPartumEvents }
            ].map(({ name, events }) => {
              const total = events.length
              const completed = events.filter(e => e.isCompleted).length
              const percentage = total > 0 ? (completed / total) * 100 : 0

              return (
                <div key={name} className="text-center">
                  <div className="text-xs font-medium text-slate-600 mb-1">{name}</div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {completed}/{total}
                  </div>
                </div>
              )
            })}
          </div>

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
          {renderEventList(t1Events, '1er Trimestre (0-14 SA)', t1Consultations)}
          {renderEventList(t2Events, '2e Trimestre (14-28 SA)', t2Consultations)}
          {renderEventList(t3Events, '3e Trimestre (28-41 SA)', t3Consultations)}
          {renderEventList(postPartumEvents, 'Post-partum', [])}
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
                  <div className="space-y-2">
                    {selectedEvent.examens.map((examen, i) => {
                      const key = `${selectedEvent.id}-examen-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedItems[key] || false}
                            onChange={() => toggleItem(key)}
                            className="mt-1 h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-slate-700 cursor-pointer ${
                              checkedItems[key] ? 'line-through opacity-60' : ''
                            }`}
                          >
                            {renderClickableText(examen, i, selectedEvent.id)}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedEvent.conseils && selectedEvent.conseils.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Conseils & Points de vigilance
                  </h4>
                  <div className="space-y-2">
                    {selectedEvent.conseils.map((conseil, i) => {
                      const key = `${selectedEvent.id}-conseil-${i}`
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={checkedItems[key] || false}
                            onChange={() => toggleItem(key)}
                            className="mt-1 h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={key}
                            className={`text-sm text-slate-700 cursor-pointer ${
                              checkedItems[key] ? 'line-through opacity-60' : ''
                            }`}
                          >
                            {renderClickableText(conseil, i, selectedEvent.id)}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-4 border-t">
                {!selectedEvent.isCompleted && (
                  <Button
                    onClick={() => handleValidateEvent(selectedEvent.id)}
                    disabled={isValidating}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {isValidating ? 'Validation en cours...' : 'Marquer comme réalisé'}
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      navigate(`/consultations/new?grossesseId=${grossesseId}&saTerm=${selectedEvent.saMin}`)
                      setShowDetails(false)
                    }}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
