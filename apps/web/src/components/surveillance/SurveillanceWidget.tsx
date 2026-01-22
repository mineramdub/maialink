import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Calendar, ChevronRight, Eye, TrendingUp } from 'lucide-react'
import { SurveillanceBadge } from './SurveillanceBadge'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

interface SurveillanceItem {
  id: string
  patient: Patient
  niveau: 'normal' | 'vigilance' | 'rapprochee'
  raison: string
  dateProchainControle: string
}

interface DashboardData {
  aSurveillerSemaine: SurveillanceItem[]
  enRetard: SurveillanceItem[]
  stats: {
    total: number
    parNiveau: Array<{ niveau: string; count: number }>
  }
}

export function SurveillanceWidget() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/surveillance/dashboard', {
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        setDashboard(data.dashboard)
      }
    } catch (error) {
      console.error('Error fetching surveillance dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
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
    } else {
      return `Dans ${diffDays} jours`
    }
  }

  const getStatsForNiveau = (niveau: string) => {
    return dashboard?.stats.parNiveau.find((s) => s.niveau === niveau)?.count || 0
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Patients sous surveillance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!dashboard || dashboard.stats.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Patients sous surveillance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-500 py-4">
            Aucun patient sous surveillance actuellement
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-blue-600" />
            Patients sous surveillance
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            {dashboard.stats.total} patient{dashboard.stats.total > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats par niveau */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <div className="text-2xl font-bold text-green-700">
              {getStatsForNiveau('normal')}
            </div>
            <div className="text-xs text-green-600 mt-1">Normal</div>
          </div>
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
            <div className="text-2xl font-bold text-yellow-700">
              {getStatsForNiveau('vigilance')}
            </div>
            <div className="text-xs text-yellow-600 mt-1">Vigilance</div>
          </div>
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <div className="text-2xl font-bold text-red-700">
              {getStatsForNiveau('rapprochee')}
            </div>
            <div className="text-xs text-red-600 mt-1">Rapprochée</div>
          </div>
        </div>

        {/* En retard */}
        {dashboard.enRetard.length > 0 && (
          <div className="rounded-lg bg-red-50 border-2 border-red-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">
                {dashboard.enRetard.length} contrôle{dashboard.enRetard.length > 1 ? 's' : ''} en retard
              </span>
            </div>
            <div className="space-y-1">
              {dashboard.enRetard.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="text-xs text-red-600 flex items-center gap-1 cursor-pointer hover:text-red-800"
                  onClick={() => navigate(`/patients/${item.patient.id}`)}
                >
                  <ChevronRight className="h-3 w-3" />
                  {item.patient.firstName} {item.patient.lastName}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patients à surveiller cette semaine */}
        {dashboard.aSurveillerSemaine.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Cette semaine
            </h4>
            <div className="space-y-2">
              {dashboard.aSurveillerSemaine.slice(0, 5).map((item) => {
                const isOverdue = new Date(item.dateProchainControle) < new Date()
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'group cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md',
                      isOverdue
                        ? 'border-red-200 bg-red-50/50 hover:border-red-300'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    )}
                    onClick={() => navigate(`/patients/${item.patient.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {item.patient.firstName} {item.patient.lastName}
                          </span>
                          <SurveillanceBadge
                            niveau={item.niveau}
                            raison={item.raison}
                            compact
                          />
                        </div>
                        <div
                          className={cn(
                            'text-xs flex items-center gap-1',
                            isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
                          )}
                        >
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.dateProchainControle)}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bouton voir tout */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/surveillance')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Voir tous les patients surveillés
        </Button>
      </CardContent>
    </Card>
  )
}
