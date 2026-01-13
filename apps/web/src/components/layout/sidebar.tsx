import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
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
  ChevronLeft,
  ChevronRight,
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

  // Sidebar width management
  const MIN_WIDTH = 80
  const MAX_WIDTH = 400
  const DEFAULT_WIDTH = 288 // 72 * 4 = w-72

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStartX, setResizeStartX] = useState(0)
  const [resizeStartWidth, setResizeStartWidth] = useState(0)

  // Determine if collapsed (width <= 100px)
  const isCollapsed = sidebarWidth <= 100

  // Load width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('maialink_sidebar_width')
    if (savedWidth) {
      const width = parseInt(savedWidth)
      if (!isNaN(width)) {
        setSidebarWidth(width)
      }
    }
  }, [])

  // Save width to localStorage and notify DashboardLayout
  useEffect(() => {
    localStorage.setItem('maialink_sidebar_width', String(sidebarWidth))
    window.dispatchEvent(new CustomEvent('sidebar-resize', {
      detail: { width: sidebarWidth, collapsed: isCollapsed }
    }))
  }, [sidebarWidth, isCollapsed])

  // Toggle between collapsed and expanded
  const toggleCollapsed = () => {
    if (isCollapsed) {
      setSidebarWidth(DEFAULT_WIDTH)
    } else {
      setSidebarWidth(MIN_WIDTH)
    }
  }

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    setResizeStartX(e.clientX)
    setResizeStartWidth(sidebarWidth)
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return
    const delta = e.clientX - resizeStartX
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, resizeStartWidth + delta))
    setSidebarWidth(newWidth)
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  // Add/remove event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, resizeStartX, resizeStartWidth])

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
    <aside
      className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-150"
      style={{ width: `${sidebarWidth}px` }}
    >
      <div className="flex grow flex-col gap-y-6 overflow-y-auto border-r border-purple-200/40 bg-gradient-to-br from-white via-purple-50/50 to-pink-50/50 backdrop-blur-xl px-6 pb-4 relative">
        {/* Resize handle */}
        <div
          className={cn(
            "absolute top-0 right-0 bottom-0 w-1 hover:w-2 bg-purple-200/0 hover:bg-purple-400/50 cursor-col-resize transition-all z-50 group",
            isResizing && "w-2 bg-purple-500"
          )}
          onMouseDown={handleResizeStart}
        >
          <div className="absolute inset-y-0 -right-1 w-3 cursor-col-resize" />
        </div>
        {/* Toggle Button */}
        <Button
          onClick={toggleCollapsed}
          variant="ghost"
          size="icon"
          className="absolute top-4 -right-3 z-50 h-6 w-6 rounded-full bg-white border border-purple-200 shadow-md hover:bg-purple-50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-purple-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-purple-600" />
          )}
        </Button>

        {/* Logo */}
        <div className={cn(
          "flex h-20 shrink-0 items-center pt-4 transition-all",
          isCollapsed ? "justify-center" : "gap-3"
        )}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-300 via-pink-300 to-purple-400 shadow-lg shadow-purple-300/25 animate-glow">
            <Heart className="h-6 w-6 text-white" fill="white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text-artistic">MaiaLink</span>
              <span className="text-xs text-purple-500/70 font-medium">Suivi sage-femme</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-y-6">
            {/* Grouped Navigation */}
            {navigationGroups.map((group) => (
              <div key={group.title} className="animate-slide-up">
                {!isCollapsed && (
                  <h3 className="px-3 mb-3 text-xs font-bold text-purple-900/60 uppercase tracking-widest">
                    {group.title}
                  </h3>
                )}
                <ul role="list" className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        title={isCollapsed ? item.name : undefined}
                        className={cn(
                          'group flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold leading-6 transition-all duration-200',
                          isCollapsed ? 'justify-center' : 'gap-x-3',
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-white shadow-lg shadow-purple-300/25 scale-[1.02]'
                            : 'text-slate-700 hover:bg-white/80 hover:shadow-md hover:scale-[1.01] hover:text-purple-600'
                        )}
                      >
                        <div className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg transition-all relative',
                          isActive(item.href)
                            ? 'bg-white/25'
                            : 'bg-purple-100/60 group-hover:bg-purple-200/80'
                        )}>
                          <item.icon
                            className={cn(
                              'h-5 w-5 shrink-0 transition-all',
                              isActive(item.href) ? 'text-white' : 'text-purple-500 group-hover:text-purple-600'
                            )}
                          />
                          {isCollapsed && item.badge && item.badge > 0 && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                              {item.badge}
                            </div>
                          )}
                        </div>
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.name}</span>
                            {item.badge && item.badge > 0 && (
                              <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center text-xs font-bold animate-pulse">
                                {item.badge}
                              </Badge>
                            )}
                          </>
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
                    title={isCollapsed ? "Paramètres" : undefined}
                    className={cn(
                      'group flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold leading-6 transition-all duration-200',
                      isCollapsed ? 'justify-center' : 'gap-x-3',
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
                    {!isCollapsed && <span className="flex-1">Paramètres</span>}
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
