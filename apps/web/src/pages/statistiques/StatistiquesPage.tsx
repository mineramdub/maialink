import { Card, CardContent } from '../../components/ui/card'
import { BarChart3 } from 'lucide-react'

export default function StatistiquesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Statistiques</h1>
        <p className="text-slate-500 mt-1">Analyse de votre activité</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Tableau de bord statistiques
          </h3>
          <p className="text-sm text-slate-500 text-center max-w-md">
            Visualisez vos statistiques d'activité, consultations et revenus
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
