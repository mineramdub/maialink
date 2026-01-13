import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Brain, Trash2, BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../hooks/use-toast'

interface LearningStats {
  totalPatterns: number
  totalSuggestions: number
  averageAcceptanceRate: number
  topPatterns: Array<{
    actionType: string
    frequency: number
    data: any
  }>
}

export function PracticeLearningSettings() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isEnabled, setIsEnabled] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch stats
  const { data: stats, isLoading } = useQuery<LearningStats>({
    queryKey: ['practice-learning-stats'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/practice-learning/stats`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
  })

  // Delete all data mutation
  const deleteDataMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/practice-learning/data`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete data')
      return res.json()
    },
    onSuccess: () => {
      toast({
        title: 'Données supprimées',
        description: 'Toutes vos données d\'apprentissage ont été effacées',
      })
      queryClient.invalidateQueries({ queryKey: ['practice-learning-stats'] })
      setShowDeleteConfirm(false)
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer les données',
        variant: 'destructive',
      })
    },
  })

  const getActionTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      prescription: 'Prescriptions',
      examen: 'Examens',
      conseil: 'Conseils',
      diagnostic: 'Diagnostics',
      orientation: 'Orientations',
    }
    return labels[type] || type
  }

  const getActionDataText = (type: string, data: any): string => {
    if (type === 'prescription' && data.prescription) {
      return data.prescription.medicament || 'Médicament'
    }
    if (type === 'examen' && data.examen) {
      return data.examen.libelle || 'Examen'
    }
    if (type === 'conseil' && data.conseil) {
      return data.conseil.length > 50 ? data.conseil.substring(0, 50) + '...' : data.conseil
    }
    return 'Action'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Apprentissage de ma pratique
          </h2>
          <p className="text-slate-600 mt-1">
            Le système analyse vos habitudes de manière anonyme pour vous proposer des suggestions personnalisées
          </p>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
          className="mt-2"
        />
      </div>

      {/* Warning RGPD */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-purple-900 mb-2">
                Conforme RGPD & HDS
              </p>
              <ul className="space-y-1 text-purple-800">
                <li>✓ Toutes vos données restent sur votre serveur (pas de transfert externe)</li>
                <li>✓ Les données patientes sont anonymisées (pas de nom, prénom, date de naissance)</li>
                <li>✓ Vous gardez le contrôle total (désactivation et suppression à tout moment)</li>
                <li>✓ Seuls des profils génériques sont analysés (âge, parité, SA)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {!isLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Patterns détectés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-900">{stats.totalPatterns}</span>
                <BarChart3 className="h-5 w-5 text-purple-600 mb-1" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Actions récurrentes identifiées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Suggestions actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-900">{stats.totalSuggestions}</span>
                <Brain className="h-5 w-5 text-blue-600 mb-1" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Recommandations disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Taux d'acceptation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-900">
                  {stats.averageAcceptanceRate.toFixed(0)}%
                </span>
                <TrendingUp className="h-5 w-5 text-green-600 mb-1" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Vous suivez vos suggestions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Patterns */}
      {!isLoading && stats && stats.topPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vos patterns les plus fréquents</CardTitle>
            <CardDescription>
              Les actions que vous réalisez le plus souvent dans votre pratique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topPatterns.slice(0, 5).map((pattern, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="text-xs">
                      {getActionTypeLabel(pattern.actionType)}
                    </Badge>
                    <span className="text-sm text-slate-700">
                      {getActionDataText(pattern.actionType, pattern.data)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {pattern.frequency}x
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paramètres avancés */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paramètres avancés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Capture automatique</Label>
              <p className="text-xs text-slate-500">
                Enregistrer automatiquement vos actions lors des consultations
              </p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Afficher les suggestions</Label>
              <p className="text-xs text-slate-500">
                Proposer des suggestions pendant la saisie des consultations
              </p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Zone de danger */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg text-red-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zone de danger
          </CardTitle>
          <CardDescription>
            Actions irréversibles concernant vos données d'apprentissage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer toutes mes données d'apprentissage
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-900">
                Êtes-vous sûr(e) ?
              </p>
              <p className="text-sm text-red-800">
                Cette action est irréversible. Tous vos patterns, suggestions et statistiques d'apprentissage seront définitivement supprimés.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteDataMutation.mutate()}
                  disabled={deleteDataMutation.isPending}
                >
                  {deleteDataMutation.isPending ? 'Suppression...' : 'Oui, supprimer'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Explications techniques */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg">Comment ça fonctionne ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <div>
            <p className="font-semibold mb-1">1. Analyse anonymisée</p>
            <p className="text-slate-600">
              Chaque fois que vous réalisez une action (prescription, examen, conseil), le système enregistre uniquement des informations génériques : type de consultation, tranche d'âge, SA, parité. Aucune donnée d'identification patiente n'est stockée.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">2. Détection de patterns</p>
            <p className="text-slate-600">
              Le système identifie les actions que vous réalisez fréquemment dans des contextes similaires. Par exemple, si vous prescrivez souvent du Magnésium à 25 SA pour les primipares, cela devient un pattern.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">3. Suggestions intelligentes</p>
            <p className="text-slate-600">
              Lors de vos prochaines consultations dans un contexte similaire, le système vous propose automatiquement les actions les plus probables. Vous restez libre d'accepter ou refuser.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">4. Apprentissage continu</p>
            <p className="text-slate-600">
              Le système s'améliore en fonction de vos choix. Si vous refusez souvent une suggestion, elle sera désactivée automatiquement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
