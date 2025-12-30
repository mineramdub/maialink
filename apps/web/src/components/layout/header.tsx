import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  ExternalLink,
  Heart,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  user?: {
    firstName: string
    lastName: string
    email: string
  }
}

const mobileNavigation = [
  { name: 'Tableau de bord', href: '/dashboard' },
  { name: 'Patientes', href: '/patients' },
  { name: 'Grossesses', href: '/grossesses' },
  { name: 'Consultations', href: '/consultations' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Reeducation', href: '/reeducation' },
  { name: 'Gynecologie', href: '/gynecologie' },
  { name: 'Documents', href: '/documents' },
  { name: 'Facturation', href: '/facturation' },
  { name: 'Statistiques', href: '/statistiques' },
  { name: 'Parametres', href: '/parametres' },
]

export function Header({ user }: HeaderProps) {
  const navigate = useNavigate()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    navigate('/login')
  }

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'SF'

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-slate-700"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="flex flex-1 items-center justify-center lg:justify-start lg:ml-0">
            <div className="w-full max-w-lg">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Rechercher une patiente..."
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Doctolib link */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              onClick={() => window.open('https://pro.doctolib.fr', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Doctolib
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-slate-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg py-1">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/parametres"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    Mon profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Deconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold">MaiaLink</span>
              </div>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="h-6 w-6 text-slate-500" />
              </button>
            </div>
            <nav className="px-4 py-4">
              <ul className="space-y-1">
                {mobileNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le menu user */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  )
}
