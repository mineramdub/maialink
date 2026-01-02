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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Bonjour {user?.firstName} 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Bienvenue sur votre tableau de bord MaiaLink
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Patientes</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stats.patients}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Grossesses en cours</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stats.grossesses}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
              <Baby className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">RDV aujourd'hui</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stats.consultationsToday}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">CA du mois</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stats.monthlyRevenue.toFixed(2)} €</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertes et notifications
                {alertes.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{alertes.length}</Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {alertes.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-8">Aucune alerte pour le moment</p>
            ) : (
              <div className="space-y-3">
                {alertes.slice(0, 5).map((alerte, index) => (
                  <Link
                    key={index}
                    to={`/grossesses/${alerte.grossesseId}`}
                    className="block"
                  >
                    <div className={`p-3 rounded-lg border transition-colors hover:shadow-md ${getAlerteColor(alerte.priority)}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getAlerteIcon(alerte.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">
                            {alerte.message}
                          </p>
                          {alerte.priority === 'urgent' && (
                            <Badge variant="destructive" className="mt-2 text-xs">Urgent</Badge>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                ))}
                {alertes.length > 5 && (
                  <Button variant="outline" className="w-full mt-2" asChild>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Prochains rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingConsultations.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-8">Aucun rendez-vous à venir</p>
            ) : (
              <div className="space-y-3">
                {upcomingConsultations.map((consultation) => (
                  <Link
                    key={consultation.id}
                    to={`/consultations/${consultation.id}`}
                    className="block"
                  >
                    <div className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{consultation.patientName}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {formatDate(consultation.date)} - {consultation.type}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
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
