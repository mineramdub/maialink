import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { CalendarIntegrationSettings } from '../../components/CalendarIntegrationSettings'
import { PracticeLearningSettings } from '../../components/PracticeLearningSettings'
import { Settings } from 'lucide-react'

export default function ParametresPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">Gérer votre compte et préférences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input value={user?.firstName || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={user?.lastName || ''} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled />
          </div>

          <div className="space-y-2">
            <Label>Rôle</Label>
            <Input value={user?.role || ''} disabled className="capitalize" />
          </div>
        </CardContent>
      </Card>

      <CalendarIntegrationSettings />

      <PracticeLearningSettings />

      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Les paramètres de personnalisation seront bientôt disponibles
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
