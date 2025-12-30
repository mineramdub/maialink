import { useAuth } from '../../contexts/AuthContext'
import { Card } from '../../components/ui/card'
import { Users, Baby, Calendar, Receipt } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Patientes</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">-</p>
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
              <p className="text-2xl font-bold text-slate-900 mt-2">-</p>
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
              <p className="text-2xl font-bold text-slate-900 mt-2">-</p>
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
              <p className="text-2xl font-bold text-slate-900 mt-2">- €</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Prochains rendez-vous
          </h2>
          <p className="text-sm text-slate-600">Aucun rendez-vous a venir</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Alertes et notifications
          </h2>
          <p className="text-sm text-slate-600">Aucune alerte</p>
        </Card>
      </div>
    </div>
  )
}
