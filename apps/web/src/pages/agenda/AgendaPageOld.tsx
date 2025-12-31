import { Card, CardContent } from '../../components/ui/card'
import { Calendar } from 'lucide-react'

export default function AgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Agenda</h1>
        <p className="text-slate-500 mt-1">Gérer vos rendez-vous</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Calendrier des rendez-vous
          </h3>
          <p className="text-sm text-slate-500 text-center max-w-md">
            Planifiez et gérez vos consultations avec vos patientes
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
