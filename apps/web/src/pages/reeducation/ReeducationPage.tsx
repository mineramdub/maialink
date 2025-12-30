import { Card, CardContent } from '../../components/ui/card'
import { Activity } from 'lucide-react'

export default function ReeducationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Rééducation périnéale</h1>
        <p className="text-slate-500 mt-1">Suivi des séances de rééducation</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Activity className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Rééducation périnéale
          </h3>
          <p className="text-sm text-slate-500 text-center max-w-md">
            Planifiez et suivez les séances de rééducation de vos patientes
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
