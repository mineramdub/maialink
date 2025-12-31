import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Bell, Check, X, AlertTriangle, Info, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
      examen_prevu: 'Examen à prévoir',
      dpa_proche: 'DPA proche',
      terme_depasse: 'Terme dépassé',
      visite_postpartum: 'Visite post-partum',
      consultation_postnatale: 'Consultation post-natale'
    }
    return labels[type] || type
  }

  const activeAlertes = alertes.filter(a => !a.isDismissed)
  const unreadAlertes = activeAlertes.filter(a => !a.isRead)

  if (isLoading) {
    return <div className="p-8">Chargement...</div>
  }

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

      {/* Alertes List */}
      <div className="space-y-3">
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
          activeAlertes.map((alerte) => (
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
          ))
        )}
      </div>
    </div>
  )
}
