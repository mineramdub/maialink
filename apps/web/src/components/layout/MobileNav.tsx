import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, Bell, Menu } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  alertCount?: number
}

export function MobileNav({ alertCount = 0 }: MobileNavProps) {
  const location = useLocation()
  const [sheetOpen, setSheetOpen] = useState(false)

  const mainItems = [
    { icon: LayoutDashboard, label: 'Accueil', href: '/dashboard' },
    { icon: Users, label: 'Patients', href: '/patients' },
    { icon: Calendar, label: 'Agenda', href: '/agenda' },
    {
      icon: Bell,
      label: 'Alertes',
      href: '/alertes',
      badge: alertCount
    },
  ]

  const moreItems = [
    { label: 'Consultations', href: '/consultations' },
    { label: 'Grossesses', href: '/grossesses' },
    { label: 'Rééducation', href: '/reeducation' },
    { label: 'Gynécologie', href: '/gynecologie' },
    { label: 'Documents', href: '/documents' },
    { label: 'Templates', href: '/templates' },
    { label: 'Protocoles', href: '/protocoles' },
    { label: 'Facturation', href: '/facturation' },
    { label: 'Statistiques', href: '/statistiques' },
    { label: 'Paramètres', href: '/parametres' },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {mainItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center relative gap-1",
              "transition-colors",
              isActive(item.href)
                ? "text-blue-600"
                : "text-slate-600"
            )}
          >
            <item.icon className="w-6 h-6" />
            {item.badge && item.badge > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-2 right-6 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {item.badge}
              </Badge>
            )}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}

        {/* Menu "Plus" */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-1 text-slate-600">
              <Menu className="w-6 h-6" />
              <span className="text-xs font-medium">Plus</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Plus d'options</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSheetOpen(false)}
                  className={cn(
                    "p-4 border rounded-xl text-center font-medium",
                    "transition-colors",
                    isActive(item.href)
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "hover:bg-slate-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
