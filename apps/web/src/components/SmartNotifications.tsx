import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Bell,
  Calendar,
  FileText,
  Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'suggestion'
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  autoClose?: number // ms
}

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const location = useLocation()

  useEffect(() => {
    // Charger les notifications au chargement
    loadNotifications()

    // Écouter les nouveaux événements de notification
    const handleNotification = (event: CustomEvent) => {
      addNotification(event.detail)
    }

    window.addEventListener('smart-notification' as any, handleNotification)
    return () => {
      window.removeEventListener('smart-notification' as any, handleNotification)
    }
  }, [])

  useEffect(() => {
    // Charger des notifications contextuelles selon la page
    loadContextualNotifications()
  }, [location.pathname])

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/active', {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success && data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const loadContextualNotifications = async () => {
    // Notifications contextuelles selon la page actuelle
    if (location.pathname.includes('/consultations/new')) {
      // Suggestion pour pré-remplissage
      const patientId = new URLSearchParams(location.search).get('patientId')
      if (patientId) {
        addNotification({
          id: 'autofill-suggestion',
          type: 'suggestion',
          title: 'Pré-remplissage disponible',
          message: 'Des suggestions basées sur l\'historique sont disponibles pour cette consultation.',
          dismissible: true,
        })
      }
    }

    if (location.pathname.includes('/surveillance')) {
      // Check pour contrôles en retard
      try {
        const res = await fetch('/api/surveillance/dashboard', {
          credentials: 'include',
        })
        const data = await res.json()
        if (data.success && data.dashboard.enRetard.length > 0) {
          addNotification({
            id: 'surveillance-overdue',
            type: 'warning',
            title: 'Contrôles en retard',
            message: `${data.dashboard.enRetard.length} patient(s) ont des contrôles en retard.`,
            action: {
              label: 'Voir',
              onClick: () => window.location.href = '/surveillance',
            },
          })
        }
      } catch (error) {
        console.error('Error checking surveillance:', error)
      }
    }
  }

  const addNotification = (notification: Notification) => {
    // Éviter les doublons
    if (notifications.some(n => n.id === notification.id)) {
      return
    }

    setNotifications(prev => [...prev, notification])

    // Auto-close si spécifié
    if (notification.autoClose) {
      setTimeout(() => {
        dismissNotification(notification.id)
      }, notification.autoClose)
    }
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle2
      case 'warning':
        return AlertTriangle
      case 'error':
        return AlertTriangle
      case 'suggestion':
        return Lightbulb
      default:
        return Info
    }
  }

  const getVariant = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const getColorClasses = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'suggestion':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-slate-200 bg-slate-50'
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => {
        const Icon = getIcon(notification.type)
        return (
          <Alert
            key={notification.id}
            className={cn(
              'shadow-lg transition-all animate-in slide-in-from-right',
              getColorClasses(notification.type)
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0',
                  notification.type === 'success' && 'bg-green-100',
                  notification.type === 'warning' && 'bg-yellow-100',
                  notification.type === 'error' && 'bg-red-100',
                  notification.type === 'suggestion' && 'bg-blue-100',
                  notification.type === 'info' && 'bg-slate-100'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4',
                    notification.type === 'success' && 'text-green-600',
                    notification.type === 'warning' && 'text-yellow-600',
                    notification.type === 'error' && 'text-red-600',
                    notification.type === 'suggestion' && 'text-blue-600',
                    notification.type === 'info' && 'text-slate-600'
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <AlertTitle className="text-sm font-semibold mb-1">
                  {notification.title}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {notification.message}
                </AlertDescription>
                {notification.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={notification.action.onClick}
                  >
                    {notification.action.label}
                  </Button>
                )}
              </div>
              {notification.dismissible !== false && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => dismissNotification(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Alert>
        )
      })}
    </div>
  )
}

// Fonction utilitaire pour déclencher une notification depuis n'importe où
export function showNotification(notification: Omit<Notification, 'id'>) {
  const event = new CustomEvent('smart-notification', {
    detail: {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
    },
  })
  window.dispatchEvent(event)
}
