import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Bell, Check, X, AlertTriangle, Info, AlertCircle, RefreshCw, Plus, Users, List, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateAlerteDialog } from '@/components/CreateAlerteDialog'

interface Alerte {
  id: string
  type: string
  message: string
  severity: 'info' | 'warning' | 'urgent'
  isRead: boolean
  isDismissed: boolean
  createdAt: string
  patient: {
    id: string
    firstName: string
    lastName: string
  }
  grossesse?: {
    id: string
    ddr: string
    dpa: string
  }
}

interface AlertesStats {
  total: number
  unread: number
  byType: Record<string, number>
  bySeverity: {
    info: number
    warning: number
    urgent: number
  }
}

export default function AlertesPage() {
  const queryClient = useQueryClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'severity' | 'patient'>('severity')

  // Fetch alertes
  const { data: alertes = [], isLoading } = useQuery({
    queryKey: ['alertes'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alertes`, {
        credentials: 'include'
      })
      const data = await res.json()
      return data.alertes as Alerte[]
    }
  })

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['alertes-stats'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alertes/stats`, {
        credentials: 'include'
      })
      const data = await res.json()
      return data.stats as AlertesStats
    }
  })

  // Generate alertes
  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alertes/generate`, {
        method: 'POST',
        credentials: 'include'
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertes'] })
      queryClient.invalidateQueries({ queryKey: ['alertes-stats'] })
    }
  })

  // Mark as read
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${import.meta.env.VITE_API_URL}/api/alertes/${id}/read`, {
        method: 'PATCH',
        credentials: 'include'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertes'] })
      queryClient.invalidateQueries({ queryKey: ['alertes-stats'] })
    }
  })

  // Dismiss alerte
  const dismissMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${import.meta.env.VITE_API_URL}/api/alertes/${id}/dismiss`, {
        method: 'PATCH',
        credentials: 'include'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertes'] })
      queryClient.invalidateQueries({ queryKey: ['alertes-stats'] })
    }
  })

  // Mark all as read
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await fetch(`${import.meta.env.VITE_API_URL}/api/alertes/read-all`, {
        method: 'POST',
        credentials: 'include'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertes'] })
      queryClient.invalidateQueries({ queryKey: ['alertes-stats'] })
    }
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      warning: 'bg-orange-100 text-orange-800',
      info: 'bg-blue-100 text-blue-800'
    }
    return colors[severity as keyof typeof colors] || colors.info
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      consultation_mensuelle: 'Consultation mensuelle',
      declaration_grossesse: 'Déclaration de grossesse',
      echo_t1: 'Échographie T1',
      echo_t2: 'Échographie T2',
      echo_t3: 'Échographie T3',
      biologie_t1: 'Bilan biologique T1',
      biologie_t2: 'Bilan biologique T2',
      biologie_t3: 'Bilan biologique T3',
      test_osullivan: "Test O'Sullivan",
      strepto_b: 'Streptocoque B',
      epp: 'Préparation naissance',
      consultation_anesthesie: 'Consultation anesthésie',
      examen_prevu: 'Examen à prévoir',
      dpa_proche: 'Terme proche',
      terme_depasse: 'Terme dépassé',
      visite_postpartum: 'Visite post-partum',
      consultation_postnatale: 'Consultation post-natale',
      tache_manuelle: 'Tâche personnalisée'
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: string) => {
    // Retourne une icône pour chaque type d'alerte
    return <Bell className="h-4 w-4" />
  }

  const activeAlertes = alertes.filter(a => !a.isDismissed)
  const unreadAlertes = activeAlertes.filter(a => !a.isRead)

  // Group alerts by severity
  const urgentAlertes = activeAlertes.filter(a => a.severity === 'urgent')
  const warningAlertes = activeAlertes.filter(a => a.severity === 'warning')
  const infoAlertes = activeAlertes.filter(a => a.severity === 'info')

  // Group alerts by patient
  const alertesByPatient = activeAlertes.reduce((acc, alerte) => {
    const patientId = alerte.patient.id
    if (!acc[patientId]) {
      acc[patientId] = {
        patient: alerte.patient,
        alertes: [],
        urgentCount: 0,
        warningCount: 0,
      }
    }
    acc[patientId].alertes.push(alerte)
    if (alerte.severity === 'urgent') acc[patientId].urgentCount++
    if (alerte.severity === 'warning') acc[patientId].warningCount++
    return acc
  }, {} as Record<string, { patient: any; alertes: Alerte[]; urgentCount: number; warningCount: number }>)

  const patientGroups = Object.values(alertesByPatient).sort((a, b) => {
    // Trier par urgence d'abord
    if (a.urgentCount !== b.urgentCount) return b.urgentCount - a.urgentCount
    if (a.warningCount !== b.warningCount) return b.warningCount - a.warningCount
    return b.alertes.length - a.alertes.length
  })

  if (isLoading) {
    return <div className="p-8">Chargement...</div>
  }

  const renderAlerte = (alerte: Alerte) => (
    <Card
      key={alerte.id}
      className={`p-4 ${!alerte.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {getSeverityIcon(alerte.severity)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getSeverityBadge(alerte.severity)}>
              {getTypeLabel(alerte.type)}
            </Badge>
            {!alerte.isRead && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Nouveau
              </Badge>
            )}
          </div>
          <p className="text-gray-900 mb-2">{alerte.message}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link
              to={`/patients/${alerte.patient.id}`}
              className="hover:text-blue-600 underline"
            >
              Voir patiente
            </Link>
            {alerte.grossesse && (
              <Link
                to={`/grossesses/${alerte.grossesse.id}`}
                className="hover:text-blue-600 underline"
              >
                Voir grossesse
              </Link>
            )}
            <span className="text-xs">
              {new Date(alerte.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {!alerte.isRead && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => markReadMutation.mutate(alerte.id)}
              disabled={markReadMutation.isPending}
              title="Marquer comme lu"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dismissMutation.mutate(alerte.id)}
            disabled={dismissMutation.isPending}
            title="Ignorer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Alertes & Rappels
          </h1>
          <p className="text-gray-500 mt-1">
            {unreadAlertes.length} alerte{unreadAlertes.length > 1 ? 's' : ''} non lue{unreadAlertes.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Boutons de vue */}
          <div className="flex gap-1 mr-2 border rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'severity' ? 'default' : 'ghost'}
              onClick={() => setViewMode('severity')}
              className="px-3"
            >
              <List className="h-4 w-4 mr-1" />
              Par priorité
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'patient' ? 'default' : 'ghost'}
              onClick={() => setViewMode('patient')}
              className="px-3"
            >
              <Users className="h-4 w-4 mr-1" />
              Par patiente
            </Button>
          </div>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </Button>
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          {unreadAlertes.length > 0 && (
            <Button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Non lues</div>
            <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
          </Card>
          <Card className="p-4 bg-orange-50">
            <div className="text-sm text-orange-600 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Alertes
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.bySeverity.warning}</div>
          </Card>
          <Card className="p-4 bg-red-50">
            <div className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Urgent
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.bySeverity.urgent}</div>
          </Card>
        </div>
      )}

      {/* Alertes List - Organized by Sections */}
      {activeAlertes.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>Aucune alerte active</p>
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            variant="outline"
            className="mt-4"
          >
            Générer les alertes
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {viewMode === 'severity' ? (
            <>
              {/* Urgent Alerts Section */}
              {urgentAlertes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b-2 border-red-200 pb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-red-900">
                      Alertes Urgentes
                    </h2>
                    <Badge className="bg-red-100 text-red-800">
                      {urgentAlertes.length}
                    </Badge>
                  </div>
                  {urgentAlertes.map(renderAlerte)}
                </div>
              )}

              {/* Warning Alerts Section */}
              {warningAlertes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b-2 border-orange-200 pb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <h2 className="text-lg font-semibold text-orange-900">
                      Alertes à surveiller
                    </h2>
                    <Badge className="bg-orange-100 text-orange-800">
                      {warningAlertes.length}
                    </Badge>
                  </div>
                  {warningAlertes.map(renderAlerte)}
                </div>
              )}

              {/* Info Alerts Section */}
              {infoAlertes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b-2 border-blue-200 pb-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-blue-900">
                      Rappels & Informations
                    </h2>
                    <Badge className="bg-blue-100 text-blue-800">
                      {infoAlertes.length}
                    </Badge>
                  </div>
                  {infoAlertes.map(renderAlerte)}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Grouped by Patient */}
              {patientGroups.map((group) => (
                <Card key={group.patient.id} className="p-6">
                  <div className="mb-4 pb-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-lg font-semibold text-blue-700">
                            {group.patient.firstName[0]}{group.patient.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {group.patient.firstName} {group.patient.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {group.alertes.length} alerte{group.alertes.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {group.urgentCount > 0 && (
                          <Badge className="bg-red-100 text-red-800">
                            {group.urgentCount} urgent{group.urgentCount > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {group.warningCount > 0 && (
                          <Badge className="bg-orange-100 text-orange-800">
                            {group.warningCount} à surveiller
                          </Badge>
                        )}
                        <Link to={`/patients/${group.patient.id}`}>
                          <Button size="sm" variant="outline">
                            Voir dossier
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {group.alertes.map((alerte) => (
                      <div
                        key={alerte.id}
                        className={`p-3 rounded-lg border ${!alerte.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getSeverityIcon(alerte.severity)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getSeverityBadge(alerte.severity)}>
                                {getTypeLabel(alerte.type)}
                              </Badge>
                              {!alerte.isRead && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{alerte.message}</p>
                            <span className="text-xs text-gray-400 mt-1 inline-block">
                              {new Date(alerte.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {!alerte.isRead && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markReadMutation.mutate(alerte.id)}
                                disabled={markReadMutation.isPending}
                                title="Marquer comme lu"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => dismissMutation.mutate(alerte.id)}
                              disabled={dismissMutation.isPending}
                              title="Ignorer"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* Create Alerte Dialog */}
      <CreateAlerteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['alertes'] })
          queryClient.invalidateQueries({ queryKey: ['alertes-stats'] })
        }}
      />
    </div>
  )
}
