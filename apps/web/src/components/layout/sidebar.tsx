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
  HeartPulse,
  Eye,
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
        { name: 'Surveillance', href: '/surveillance', icon: Eye },
        { name: 'Alertes', href: '/alertes', icon: Bell, badge: alertCount }
      ]
    },
    {
      title: 'Activité',
      items: [
        { name: 'Agenda', href: '/agenda', icon: Calendar },
        { name: 'Consultations', href: '/consultations', icon: Stethoscope },
        { name: 'Orga Rappels', href: '/suivi-gyneco', icon: HeartPulse },
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
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-6 overflow-y-auto border-r border-purple-100/50 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-xl px-6 pb-4">
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center gap-3 pt-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg shadow-purple-500/30 animate-glow">
            <Heart className="h-6 w-6 text-white" fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold gradient-text-artistic">MaiaLink</span>
            <span className="text-xs text-purple-600/70 font-medium">Suivi sage-femme</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-y-6">
            {/* Grouped Navigation */}
            {navigationGroups.map((group) => (
              <div key={group.title} className="animate-slide-up">
                <h3 className="px-3 mb-3 text-xs font-bold text-purple-900/60 uppercase tracking-widest">
                  {group.title}
                </h3>
                <ul role="list" className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          'group flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-semibold leading-6 transition-all duration-200',
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                            : 'text-slate-700 hover:bg-white/80 hover:shadow-md hover:scale-[1.01] hover:text-purple-700'
                        )}
                      >
                        <div className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                          isActive(item.href)
                            ? 'bg-white/20'
                            : 'bg-purple-100/50 group-hover:bg-purple-200/70'
                        )}>
                          <item.icon
                            className={cn(
                              'h-5 w-5 shrink-0 transition-all',
                              isActive(item.href) ? 'text-white' : 'text-purple-600 group-hover:text-purple-700'
                            )}
                          />
                        </div>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center text-xs font-bold animate-pulse">
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
            <div className="mt-auto pt-4 border-t border-purple-100">
              <ul role="list" className="space-y-1.5">
                <li>
                  <Link
                    to="/parametres"
                    className={cn(
                      'group flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-semibold leading-6 transition-all duration-200',
                      isActive('/parametres')
                        ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg shadow-slate-500/30'
                        : 'text-slate-600 hover:bg-white/80 hover:shadow-md hover:scale-[1.01] hover:text-slate-900'
                    )}
                  >
                    <div className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                      isActive('/parametres')
                        ? 'bg-white/20'
                        : 'bg-slate-100/50 group-hover:bg-slate-200/70'
                    )}>
                      <Settings
                        className={cn(
                          'h-5 w-5 shrink-0 transition-all',
                          isActive('/parametres') ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'
                        )}
                      />
                    </div>
                    <span className="flex-1">Paramètres</span>
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
