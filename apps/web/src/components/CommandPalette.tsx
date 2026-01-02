import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Calendar, Users, FileText, Stethoscope, Baby, Receipt,
  Settings, BarChart3, BookOpen, LayoutDashboard, UserPlus,
  ClipboardList, Activity, Bell
} from 'lucide-react'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  city: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const navigate = useNavigate()

  // Cmd+K pour ouvrir
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Recherche patientes en temps réel
  useEffect(() => {
    if (search.length > 2) {
      fetch(`${import.meta.env.VITE_API_URL}/api/search?q=${search}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setPatients(data.patients || []))
        .catch(() => setPatients([]))
    } else {
      setPatients([])
    }
  }, [search])

  const actions = [
    // Navigation
    {
      group: 'Navigation',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      action: () => navigate('/dashboard'),
      keywords: ['accueil', 'home']
    },
    {
      group: 'Navigation',
      label: 'Patientes',
      icon: Users,
      action: () => navigate('/patients'),
      keywords: ['patients', 'liste']
    },
    {
      group: 'Navigation',
      label: 'Agenda',
      icon: Calendar,
      action: () => navigate('/agenda'),
      keywords: ['rendez-vous', 'rdv', 'calendrier']
    },
    {
      group: 'Navigation',
      label: 'Consultations',
      icon: Stethoscope,
      action: () => navigate('/consultations'),
      keywords: ['consultations', 'suivis']
    },
    {
      group: 'Navigation',
      label: 'Grossesses',
      icon: Baby,
      action: () => navigate('/grossesses'),
      keywords: ['grossesse', 'enceinte']
    },
    {
      group: 'Navigation',
      label: 'Documents',
      icon: FileText,
      action: () => navigate('/documents'),
      keywords: ['certificats', 'ordonnances']
    },
    {
      group: 'Navigation',
      label: 'Facturation',
      icon: Receipt,
      action: () => navigate('/facturation'),
      keywords: ['factures', 'paiements']
    },
    {
      group: 'Navigation',
      label: 'Protocoles',
      icon: BookOpen,
      action: () => navigate('/protocoles'),
      keywords: ['protocoles', 'guidelines']
    },
    {
      group: 'Navigation',
      label: 'Alertes',
      icon: Bell,
      action: () => navigate('/alertes'),
      keywords: ['alertes', 'notifications']
    },
    {
      group: 'Navigation',
      label: 'Statistiques',
      icon: BarChart3,
      action: () => navigate('/statistiques'),
      keywords: ['stats', 'rapports']
    },

    // Actions rapides
    {
      group: 'Actions',
      label: 'Nouvelle patiente',
      icon: UserPlus,
      action: () => navigate('/patients/new'),
      shortcut: '⌘⇧P',
      keywords: ['créer', 'ajouter', 'nouvelle']
    },
    {
      group: 'Actions',
      label: 'Nouvelle consultation',
      icon: Stethoscope,
      action: () => {
        setOpen(false)
        document.dispatchEvent(new CustomEvent('open-quick-consultation'))
      },
      shortcut: '⌘⇧C',
      keywords: ['consultation', 'rendez-vous']
    },
    {
      group: 'Actions',
      label: 'Nouveau document',
      icon: FileText,
      action: () => navigate('/documents/new'),
      shortcut: '⌘⇧D',
      keywords: ['document', 'certificat', 'ordonnance']
    },
    {
      group: 'Actions',
      label: 'Nouvelle grossesse',
      icon: Baby,
      action: () => navigate('/grossesses/new'),
      keywords: ['grossesse', 'suivi', 'enceinte']
    },
    {
      group: 'Actions',
      label: 'Nouvelle facture',
      icon: Receipt,
      action: () => navigate('/facturation/new'),
      keywords: ['facture', 'facturation', 'paiement']
    },
  ]

  // Grouper actions par catégorie
  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.group]) acc[action.group] = []
    acc[action.group].push(action)
    return acc
  }, {} as Record<string, typeof actions>)

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Rechercher une action ou une patiente..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

        {/* Patientes trouvées */}
        {patients.length > 0 && (
          <CommandGroup heading="Patientes">
            {patients.map((patient) => (
              <CommandItem
                key={patient.id}
                onSelect={() => {
                  navigate(`/patients/${patient.id}`)
                  setOpen(false)
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                <span className="flex-1">
                  {patient.firstName} {patient.lastName}
                </span>
                <span className="text-sm text-slate-500">
                  {patient.city}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Actions groupées */}
        {Object.entries(groupedActions).map(([group, items]) => (
          <CommandGroup key={group} heading={group}>
            {items.map((item, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  item.action()
                  setOpen(false)
                }}
              >
                <item.icon className="w-4 h-4 mr-2" />
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="ml-auto px-2 py-1 text-xs bg-slate-100 border border-slate-200 rounded">
                    {item.shortcut}
                  </kbd>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
