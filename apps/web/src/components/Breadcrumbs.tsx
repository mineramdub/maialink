import { Link, useLocation, useMatches } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  path: string
  isActive: boolean
}

// Map of paths to user-friendly labels
const PATH_LABELS: Record<string, string> = {
  dashboard: 'Tableau de bord',
  patients: 'Patientes',
  grossesses: 'Grossesses',
  consultations: 'Consultations',
  reeducation: 'Rééducation',
  'suivi-gyneco': 'Suivi gynéco',
  surveillance: 'Surveillance',
  gynecologie: 'Gynécologie',
  documents: 'Documents',
  facturation: 'Facturation',
  agenda: 'Agenda',
  statistiques: 'Statistiques',
  protocoles: 'Protocoles',
  alertes: 'Alertes',
  ordonnances: 'Ordonnances',
  roulette: 'Roulette',
  templates: 'Modèles',
  parametres: 'Paramètres',
  new: 'Nouveau',
  edit: 'Modifier',
  generate: 'Générer',
  praticien: 'Praticien',
  admin: 'Administration',
  'ordonnance-templates': 'Modèles ordonnance',
}

// Function to get label for a path segment
function getLabel(segment: string): string {
  // Check if it's a known label
  if (PATH_LABELS[segment]) {
    return PATH_LABELS[segment]
  }

  // If it's an ID (numbers or UUID), return a generic label
  if (/^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment)) {
    return 'Détails'
  }

  // Otherwise, capitalize first letter
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

// Function to build breadcrumb items from pathname
function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Always add home
  breadcrumbs.push({
    label: 'Accueil',
    path: '/dashboard',
    isActive: false,
  })

  // Build breadcrumbs from path segments
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1

    breadcrumbs.push({
      label: getLabel(segment),
      path: currentPath,
      isActive: isLast,
    })
  })

  return breadcrumbs
}

export function Breadcrumbs() {
  const location = useLocation()
  const breadcrumbs = buildBreadcrumbs(location.pathname)

  // Don't show breadcrumbs on dashboard
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-slate-600 mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-1 text-slate-400 flex-shrink-0" />
          )}
          {breadcrumb.isActive ? (
            <span className="text-slate-900 font-medium">{breadcrumb.label}</span>
          ) : (
            <Link
              to={breadcrumb.path}
              className={cn(
                'hover:text-slate-900 transition-colors',
                index === 0 && 'flex items-center gap-1'
              )}
            >
              {index === 0 && <Home className="h-3.5 w-3.5" />}
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
