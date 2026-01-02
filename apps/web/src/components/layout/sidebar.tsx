import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  LayoutDashboard,
  Users,
  Baby,
  Calendar,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  Activity,
  Stethoscope,
  ClipboardList,
  BookOpen,
  Bell,
  FileStack,
} from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: number
}

interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  // Fetch alert count
  const { data: alertData } = useQuery({
    queryKey: ['alerts-count'],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/alertes/count`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch alert count')
      return res.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const alertCount = alertData?.count || 0

  const navigationGroups: NavigationGroup[] = [
    {
      title: 'Vue d\'ensemble',
      items: [
        { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Soins',
      items: [
        { name: 'Patientes', href: '/patients', icon: Users },
        { name: 'Grossesses', href: '/grossesses', icon: Baby },
        { name: 'Alertes', href: '/alertes', icon: Bell, badge: alertCount }
      ]
    },
    {
      title: 'Activité',
      items: [
        { name: 'Agenda', href: '/agenda', icon: Calendar },
        { name: 'Consultations', href: '/consultations', icon: Stethoscope },
        { name: 'Rééducation', href: '/reeducation', icon: Activity },
        { name: 'Gynécologie', href: '/gynecologie', icon: ClipboardList }
      ]
    },
    {
      title: 'Ressources',
      items: [
        { name: 'Documents', href: '/documents', icon: FileText },
        { name: 'Templates', href: '/templates', icon: FileStack },
        { name: 'Protocoles', href: '/protocoles', icon: BookOpen }
      ]
    },
    {
      title: 'Gestion',
      items: [
        { name: 'Facturation', href: '/facturation', icon: Receipt },
        { name: 'Statistiques', href: '/statistiques', icon: BarChart3 }
      ]
    }
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-slate-900">MaiaLink</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-y-6">
            {/* Grouped Navigation */}
            {navigationGroups.map((group) => (
              <div key={group.title}>
                <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {group.title}
                </h3>
                <ul role="list" className="-mx-2 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          'group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium leading-6 transition-colors',
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive(item.href) ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-900'
                          )}
                        />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Paramètres at bottom */}
            <div className="mt-auto">
              <ul role="list" className="-mx-2 space-y-1">
                <li>
                  <Link
                    to="/parametres"
                    className={cn(
                      'group flex gap-x-3 rounded-lg p-2 text-sm font-medium leading-6 transition-colors',
                      isActive('/parametres')
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <Settings
                      className={cn(
                        'h-5 w-5 shrink-0',
                        isActive('/parametres') ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'
                      )}
                    />
                    Paramètres
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}
