'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
} from 'lucide-react'

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Patientes', href: '/patients', icon: Users },
  { name: 'Grossesses', href: '/grossesses', icon: Baby },
  { name: 'Consultations', href: '/consultations', icon: Stethoscope },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Reeducation', href: '/reeducation', icon: Activity },
  { name: 'Gynecologie', href: '/gynecologie', icon: ClipboardList },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Facturation', href: '/facturation', icon: Receipt },
  { name: 'Statistiques', href: '/statistiques', icon: BarChart3 },
]

const secondaryNavigation = [
  { name: 'Parametres', href: '/parametres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

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
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-lg p-2 text-sm font-medium leading-6 transition-colors',
                          isActive
                            ? 'bg-slate-100 text-slate-900'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            <li className="mt-auto">
              <ul role="list" className="-mx-2 space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-lg p-2 text-sm font-medium leading-6 transition-colors',
                          isActive
                            ? 'bg-slate-100 text-slate-900'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}
