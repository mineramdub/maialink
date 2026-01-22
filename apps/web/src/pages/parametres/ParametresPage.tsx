import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { CalendarIntegrationSettings } from '../../components/CalendarIntegrationSettings'
import { PracticeLearningSettings } from '../../components/PracticeLearningSettings'
import { Settings, CreditCard, AlertTriangle, Check, ExternalLink } from 'lucide-react'

export default function ParametresPage() {
  const { user } = useAuth()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')

  // Mock subscription data - to be replaced with real API call
  const subscription = {
    plan: 'Mensuel',
    status: 'active',
    price: '49€',
    startDate: '2024-01-15',
    nextBilling: '2024-02-15',
    paymentMethod: 'Carte bancaire •••• 4242',
  }

  const handleCancelSubscription = () => {
    // TODO: Implement cancellation logic with API
    console.log('Cancellation reason:', cancellationReason)
    setShowCancelDialog(false)
    alert('Votre demande de résiliation a été prise en compte. Vous recevrez un email de confirmation.')
  }

  const handleManagePayment = () => {
    // TODO: Redirect to payment portal (Stripe, etc.)
    alert('Redirection vers le portail de paiement...')
  }

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

      {/* Subscription Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Abonnement
              </CardTitle>
              <CardDescription className="mt-1">
                Gérer votre abonnement et facturation
              </CardDescription>
            </div>
            <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className="flex items-center gap-1">
              {subscription.status === 'active' ? (
                <>
                  <Check className="h-3 w-3" />
                  Actif
                </>
              ) : (
                'Inactif'
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subscription Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-slate-500">Formule</Label>
                <p className="text-sm font-medium text-slate-900 mt-1">{subscription.plan}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Prix</Label>
                <p className="text-sm font-medium text-slate-900 mt-1">{subscription.price} / mois</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Moyen de paiement</Label>
                <p className="text-sm font-medium text-slate-900 mt-1">{subscription.paymentMethod}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-slate-500">Date de souscription</Label>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {new Date(subscription.startDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Prochain renouvellement</Label>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {new Date(subscription.nextBilling).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Inclus dans votre abonnement :</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 shrink-0" />
                Dossiers patients illimités
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 shrink-0" />
                Suivi de grossesses complet
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 shrink-0" />
                Téléconsultations et facturation
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 shrink-0" />
                Stockage sécurisé illimité
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 shrink-0" />
                Support prioritaire
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleManagePayment}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Gérer le paiement
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Résilier l'abonnement
            </Button>
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

      {/* Cancellation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la résiliation
            </DialogTitle>
            <DialogDescription>
              Nous sommes désolés de vous voir partir. Votre abonnement restera actif jusqu'à la fin de la période en cours.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-900">
                <strong>Attention :</strong> En résiliant votre abonnement :
              </p>
              <ul className="mt-2 space-y-1 text-sm text-amber-800 list-disc list-inside">
                <li>Vous perdrez l'accès à vos données après le {new Date(subscription.nextBilling).toLocaleDateString('fr-FR')}</li>
                <li>Les consultations en cours ne pourront plus être modifiées</li>
                <li>Vous ne pourrez plus créer de nouveaux dossiers</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Raison de la résiliation (facultatif)</Label>
              <textarea
                id="reason"
                className="w-full min-h-[100px] rounded-md border border-slate-300 p-3 text-sm"
                placeholder="Dites-nous pourquoi vous souhaitez résilier..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmer la résiliation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
