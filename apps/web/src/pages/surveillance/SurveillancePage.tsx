import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { SurveillanceBadge } from '../../components/surveillance/SurveillanceBadge'
import {
  Eye,
  Calendar,
  ChevronRight,
  AlertTriangle,
  Filter,
  Loader2,
  TrendingUp,
} from 'lucide-react'
import { formatDate, calculateSA } from '../../lib/utils'
import { cn } from '@/lib/utils'

interface Surveillance {
  id: string
  patient: {
    id: string
    firstName: string
    lastName: string
    dateNaissance: string
  }
  grossesse?: {
    id: string
    ddr: string
    dpa: string
  }
  niveau: 'normal' | 'vigilance' | 'rapprochee'
  raison: string
  raisonDetail?: string
  dateDebut: string
  dateProchainControle: string
  frequenceControle: number
  notesSurveillance?: string
  parametresSuivre?: string[]
  isActive: boolean
}

export default function SurveillancePage() {
  const navigate = useNavigate()
  const [surveillances, setSurveillances] = useState<Surveillance[]>([])
  const [loading, setLoading] = useState(true)
  const [filterNiveau, setFilterNiveau] = useState<string>('all')
  const [filterActive, setFilterActive] = useState('true')

  useEffect(() => {
    fetchSurveillances()
  }, [filterNiveau, filterActive])

  const fetchSurveillances = async () => {
    try {
      const params = new URLSearchParams()
      if (filterActive !== 'all') params.append('active', filterActive)
      if (filterNiveau !== 'all') params.append('niveau', filterNiveau)

      const response = await fetch(`/api/surveillance?${params.toString()}`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setSurveillances(data.surveillances)
      }
    } catch (error) {
      console.error('Error fetching surveillances:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`
    } else if (diffDays === 0) {
      return "Aujourd'hui"
    } else if (diffDays === 1) {
      return 'Demain'
    } else if (diffDays <= 7) {
      return `Dans ${diffDays} jours`
    } else {
      return formatDate(dateString)
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const groupBySeverity = () => {
    const overdue = surveillances.filter(
      (s) => new Date(s.dateProchainControle) < new Date() && s.isActive
    )
    const thisWeek = surveillances.filter((s) => {
      const date = new Date(s.dateProchainControle)
      const today = new Date()
      const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      return date >= today && date <= in7Days && s.isActive
    })
    const upcoming = surveillances.filter((s) => {
      const date = new Date(s.dateProchainControle)
      const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      return date > in7Days && s.isActive
    })

    return { overdue, thisWeek, upcoming }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const { overdue, thisWeek, upcoming } = groupBySeverity()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Eye className="h-6 w-6 text-blue-600" />
            Patients sous surveillance
          </h1>
          <p className="text-slate-600 mt-1">
            {surveillances.length} patient{surveillances.length > 1 ? 's' : ''} actuellement
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filtres:</span>
            </div>
            <Select value={filterNiveau} onValueChange={setFilterNiveau}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="vigilance">Vigilance</SelectItem>
                <SelectItem value="rapprochee">Rapprochée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Actives uniquement</SelectItem>
                <SelectItem value="false">Terminées uniquement</SelectItem>
                <SelectItem value="all">Toutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700">{overdue.length}</div>
                <div className="text-sm text-red-600">En retard</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">{thisWeek.length}</div>
                <div className="text-sm text-blue-600">Cette semaine</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-700">{upcoming.length}</div>
                <div className="text-sm text-slate-600">À venir</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* En retard */}
      {overdue.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Contrôles en retard ({overdue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdue.map((surveillance) => (
                <SurveillanceCard
                  key={surveillance.id}
                  surveillance={surveillance}
                  isOverdue
                  onClick={() => navigate(`/patients/${surveillance.patient.id}`)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cette semaine */}
      {thisWeek.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Cette semaine ({thisWeek.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {thisWeek.map((surveillance) => (
                <SurveillanceCard
                  key={surveillance.id}
                  surveillance={surveillance}
                  onClick={() => navigate(`/patients/${surveillance.patient.id}`)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* À venir */}
      {upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>À venir ({upcoming.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcoming.map((surveillance) => (
                <SurveillanceCard
                  key={surveillance.id}
                  surveillance={surveillance}
                  onClick={() => navigate(`/patients/${surveillance.patient.id}`)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {surveillances.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Eye className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucun patient sous surveillance
            </h3>
            <p className="text-slate-600">
              Les patients ajoutés en surveillance apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SurveillanceCard({
  surveillance,
  isOverdue = false,
  onClick,
}: {
  surveillance: Surveillance
  isOverdue?: boolean
  onClick: () => void
}) {
  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`
    } else if (diffDays === 0) {
      return "Aujourd'hui"
    } else if (diffDays === 1) {
      return 'Demain'
    } else if (diffDays <= 7) {
      return `Dans ${diffDays} jours`
    } else {
      return formatDate(dateString)
    }
  }

  return (
    <div
      className={cn(
        'group cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md',
        isOverdue
          ? 'border-red-200 bg-red-50/50 hover:border-red-300'
          : 'border-slate-200 bg-white hover:border-blue-300'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-medium text-slate-900">
                {surveillance.patient.firstName} {surveillance.patient.lastName}
              </div>
              <div className="text-sm text-slate-500">
                {calculateAge(surveillance.patient.dateNaissance)} ans
                {surveillance.grossesse && (() => {
                  const sa = calculateSA(surveillance.grossesse.ddr)
                  return <span className="ml-2">• {sa.weeks} SA + {sa.days}j</span>
                })()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SurveillanceBadge
              niveau={surveillance.niveau}
              raison={surveillance.raison}
              compact
            />
            {surveillance.parametresSuivre && surveillance.parametresSuivre.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {surveillance.parametresSuivre.length} paramètre
                {surveillance.parametresSuivre.length > 1 ? 's' : ''} à suivre
              </Badge>
            )}
          </div>

          <div
            className={cn(
              'flex items-center gap-2 text-sm',
              isOverdue ? 'text-red-600 font-medium' : 'text-slate-600'
            )}
          >
            <Calendar className="h-4 w-4" />
            <span>Prochain contrôle: {formatDateRelative(surveillance.dateProchainControle)}</span>
          </div>

          {surveillance.notesSurveillance && (
            <div className="text-sm text-slate-600 line-clamp-2">
              {surveillance.notesSurveillance}
            </div>
          )}
        </div>

        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
      </div>
    </div>
  )
}
