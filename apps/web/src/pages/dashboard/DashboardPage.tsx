import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Users, Baby, Calendar, Receipt, AlertTriangle, Bell, Loader2, ArrowRight, Syringe, FileText } from 'lucide-react'
import { formatDate } from '../../lib/utils'

interface DashboardStats {
  patients: number
  grossesses: number
  consultationsToday: number
  monthlyRevenue: number
}

interface Alerte {
  type: 'terme_proche' | 'examen_a_faire' | 'vaccination'
  priority: 'urgent' | 'normal'
  message: string
  patientId: string
  grossesseId: string
  date: string
}

interface UpcomingConsultation {
  id: string
  date: string
  type: string
  patientName: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    patients: 0,
    grossesses: 0,
    consultationsToday: 0,
    monthlyRevenue: 0
  })
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [upcomingConsultations, setUpcomingConsultations] = useState<UpcomingConsultation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setStats(data.stats)
        setAlertes(data.alertes || [])
        setUpcomingConsultations(data.upcomingConsultations || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAlerteIcon = (type: string) => {
    switch (type) {
      case 'terme_proche':
        return <Baby className="h-4 w-4" />
      case 'examen_a_faire':
        return <FileText className="h-4 w-4" />
      case 'vaccination':
        return <Syringe className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlerteColor = (priority: string) => {
    return priority === 'urgent' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-orange-50 border-orange-200 text-orange-800'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 p-8 shadow-2xl shadow-purple-500/30 animate-gradient-shift">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0wIDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Bonjour {user?.firstName} 👋
          </h1>
          <p className="mt-3 text-lg text-white/90 font-medium">
            Bienvenue sur votre tableau de bord MaiaLink
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Patientes */}
        <Card className="p-6 card-premium border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 hover:shadow-xl transition-all duration-300 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600/80 uppercase tracking-wide mb-2">Patientes</p>
              <p className="text-3xl font-bold text-blue-900">{stats.patients}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-float">
              <Users className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        {/* Card Grossesses */}
        <Card className="p-6 card-premium border-0 bg-gradient-to-br from-pink-50 via-white to-pink-50/50 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{animationDelay: '50ms'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-pink-600/80 uppercase tracking-wide mb-2">Grossesses</p>
              <p className="text-3xl font-bold text-pink-900">{stats.grossesses}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-float" style={{animationDelay: '200ms'}}>
              <Baby className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        {/* Card RDV */}
        <Card className="p-6 card-premium border-0 bg-gradient-to-br from-green-50 via-white to-green-50/50 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{animationDelay: '100ms'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600/80 uppercase tracking-wide mb-2">RDV aujourd'hui</p>
              <p className="text-3xl font-bold text-green-900">{stats.consultationsToday}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 animate-float" style={{animationDelay: '400ms'}}>
              <Calendar className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        {/* Card CA */}
        <Card className="p-6 card-premium border-0 bg-gradient-to-br from-purple-50 via-white to-purple-50/50 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{animationDelay: '150ms'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600/80 uppercase tracking-wide mb-2">CA du mois</p>
              <p className="text-3xl font-bold text-purple-900">{stats.monthlyRevenue.toFixed(2)} €</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-float" style={{animationDelay: '600ms'}}>
              <Receipt className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50/50 via-white to-red-50/50 card-premium">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">Alertes</span>
                {alertes.length > 0 && (
                  <Badge variant="destructive" className="animate-pulse font-bold">{alertes.length}</Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {alertes.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-slate-600">Aucune alerte pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertes.slice(0, 5).map((alerte, index) => (
                  <Link
                    key={index}
                    to={`/grossesses/${alerte.grossesseId}`}
                    className="block animate-slide-up"
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    <div className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-[1.02] ${getAlerteColor(alerte.priority)}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {getAlerteIcon(alerte.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-tight">
                            {alerte.message}
                          </p>
                          {alerte.priority === 'urgent' && (
                            <Badge variant="destructive" className="mt-2 text-xs font-bold">Urgent</Badge>
                          )}
                        </div>
                        <ArrowRight className="h-5 w-5 flex-shrink-0 opacity-60" />
                      </div>
                    </div>
                  </Link>
                ))}
                {alertes.length > 5 && (
                  <Button variant="outline" className="w-full mt-4 border-2 hover:bg-orange-50" asChild>
                    <Link to="/alertes">
                      Voir toutes les alertes ({alertes.length})
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prochains RDV */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50 card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">Prochains rendez-vous</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingConsultations.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">Aucun rendez-vous à venir</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingConsultations.map((consultation, index) => (
                  <Link
                    key={consultation.id}
                    to={`/consultations/${consultation.id}`}
                    className="block animate-slide-up"
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    <div className="p-4 rounded-xl border-2 border-green-100 bg-white hover:border-green-300 hover:shadow-lg transition-all hover:scale-[1.02]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{consultation.patientName}</p>
                            <p className="text-sm text-slate-600 mt-1 font-medium">
                              {formatDate(consultation.date)} · {consultation.type}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
