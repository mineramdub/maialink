import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Users,
  FileText,
  Stethoscope,
  Baby,
  Receipt,
  Settings,
  BarChart3,
  BookOpen,
  LayoutDashboard,
  UserPlus,
  Bell,
  Eye,
  Search,
  Clock,
  AlertTriangle,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { formatDate, calculateSA } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'patient' | 'grossesse' | 'consultation' | 'protocol' | 'surveillance' | 'document'
  title: string
  subtitle?: string
  metadata?: string
  urgent?: boolean
}

export function EnhancedCommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<any>({})
  const [recentItems, setRecentItems] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const navigate = useNavigate()

  // Cmd+K pour ouvrir
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Charger les éléments récents au chargement
  useEffect(() => {
    if (open && search.length === 0) {
      fetchRecentItems()
    }
  }, [open])

  // Recherche en temps réel
  useEffect(() => {
    if (search.length > 1) {
      setLoading(true)
      const timer = setTimeout(() => {
        fetchSearchResults(search)
      }, 300) // Debounce de 300ms
      return () => clearTimeout(timer)
    } else {
      setResults({})
      setLoading(false)
    }
  }, [search, selectedType])

  const fetchSearchResults = async (query: string) => {
    try {
      const types = selectedType === 'all' ? '' : `&types=${selectedType}`
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}${types}`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setResults(data.results)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentItems = async () => {
    try {
      const res = await fetch('/api/search/recent', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setRecentItems(data.recent)
      }
    } catch (error) {
      console.error('Recent items error:', error)
    }
  }

  const handleSelect = (item: any, type: string) => {
    setOpen(false)
    setSearch('')

    switch (type) {
      case 'patient':
        navigate(`/patients/${item.id}`)
        break
      case 'grossesse':
        navigate(`/grossesses/${item.id}`)
        break
      case 'consultation':
        navigate(`/consultations/${item.id}`)
        break
      case 'protocol':
        navigate(`/protocoles/${item.id}`)
        break
      case 'surveillance':
        navigate(`/patients/${item.patientId}`)
        break
      case 'document':
        navigate(`/documents`)
        break
    }
  }

  const actions = [
    // Navigation rapide
    {
      group: 'Navigation',
      items: [
        { label: 'Tableau de bord', icon: LayoutDashboard, action: () => navigate('/dashboard'), shortcut: '⌘H' },
        { label: 'Patientes', icon: Users, action: () => navigate('/patients'), shortcut: '⌘P' },
        { label: 'Grossesses', icon: Baby, action: () => navigate('/grossesses'), shortcut: '⌘G' },
        { label: 'Consultations', icon: Stethoscope, action: () => navigate('/consultations') },
        { label: 'Surveillance', icon: Eye, action: () => navigate('/surveillance'), shortcut: '⌘⇧S' },
        { label: 'Agenda', icon: Calendar, action: () => navigate('/agenda') },
        { label: 'Alertes', icon: Bell, action: () => navigate('/alertes') },
        { label: 'Documents', icon: FileText, action: () => navigate('/documents') },
        { label: 'Protocoles', icon: BookOpen, action: () => navigate('/protocoles') },
        { label: 'Facturation', icon: Receipt, action: () => navigate('/facturation') },
        { label: 'Statistiques', icon: BarChart3, action: () => navigate('/statistiques') },
      ],
    },
    // Actions rapides
    {
      group: 'Actions rapides',
      items: [
        { label: 'Nouvelle patiente', icon: UserPlus, action: () => navigate('/patients/new'), shortcut: '⌘⇧P' },
        { label: 'Nouvelle consultation', icon: Stethoscope, action: () => navigate('/consultations/new'), shortcut: '⌘N' },
        { label: 'Nouvelle ordonnance', icon: FileText, action: () => navigate('/ordonnances/new'), shortcut: '⌘O' },
        { label: 'Générer document', icon: FileText, action: () => navigate('/documents/generate'), shortcut: '⌘D' },
        { label: 'Nouvelle grossesse', icon: Baby, action: () => navigate('/grossesses/new') },
        { label: 'Nouvelle facture', icon: Receipt, action: () => navigate('/facturation/new') },
      ],
    },
  ]

  const typeFilters = [
    { value: 'all', label: 'Tout', icon: Search },
    { value: 'patients', label: 'Patientes', icon: Users },
    { value: 'grossesses', label: 'Grossesses', icon: Baby },
    { value: 'consultations', label: 'Consultations', icon: Stethoscope },
    { value: 'surveillances', label: 'Surveillance', icon: Eye },
    { value: 'protocols', label: 'Protocoles', icon: BookOpen },
  ]

  const hasResults =
    (results.patients?.length || 0) +
    (results.grossesses?.length || 0) +
    (results.consultations?.length || 0) +
    (results.protocols?.length || 0) +
    (results.surveillances?.length || 0) +
    (results.documents?.length || 0) >
    0

  const hasRecentItems =
    (recentItems.patients?.length || 0) + (recentItems.consultations?.length || 0) > 0

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          placeholder="Rechercher patientes, consultations, protocoles..."
          value={search}
          onValueChange={setSearch}
          className="border-0 focus:ring-0"
        />
      </div>

      {/* Filtres de type */}
      {search.length > 0 && (
        <div className="flex items-center gap-1 border-b px-3 py-2 overflow-x-auto">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedType(filter.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap',
                selectedType === filter.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <filter.icon className="h-3 w-3" />
              {filter.label}
            </button>
          ))}
        </div>
      )}

      <CommandList>
        {search.length === 0 ? (
          <>
            {/* Items récents */}
            {hasRecentItems && (
              <>
                <CommandGroup heading="Récents">
                  {recentItems.patients?.map((patient: any) => (
                    <CommandItem
                      key={`recent-patient-${patient.id}`}
                      onSelect={() => handleSelect(patient, 'patient')}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                        <Users className="h-4 w-4 text-blue-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{patient.city}</div>
                      </div>
                      <Clock className="h-4 w-4 text-slate-400" />
                    </CommandItem>
                  ))}
                  {recentItems.consultations?.map((consult: any) => (
                    <CommandItem
                      key={`recent-consultation-${consult.id}`}
                      onSelect={() => handleSelect(consult, 'consultation')}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                        <Stethoscope className="h-4 w-4 text-green-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{consult.patientName}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {formatDate(consult.date)} • {consult.type}
                        </div>
                      </div>
                      <Clock className="h-4 w-4 text-slate-400" />
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Actions */}
            {actions.map((group) => (
              <CommandGroup key={group.group} heading={group.group}>
                {group.items.map((item, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      item.action()
                      setOpen(false)
                    }}
                    className="flex items-center gap-3"
                  >
                    <item.icon className="h-4 w-4 text-slate-500" />
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="ml-auto px-2 py-0.5 text-xs bg-slate-100 border border-slate-200 rounded">
                        {item.shortcut}
                      </kbd>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </>
        ) : loading ? (
          <div className="py-6 text-center text-sm text-slate-500">
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            <span className="ml-2">Recherche...</span>
          </div>
        ) : !hasResults ? (
          <CommandEmpty>Aucun résultat trouvé pour "{search}"</CommandEmpty>
        ) : (
          <>
            {/* Résultats Patientes */}
            {results.patients?.length > 0 && (
              <CommandGroup heading={`Patientes (${results.patients.length})`}>
                {results.patients.map((patient: any) => (
                  <CommandItem
                    key={`patient-${patient.id}`}
                    onSelect={() => handleSelect(patient, 'patient')}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                      <Users className="h-4 w-4 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {patient.birthDate && formatDate(patient.birthDate)}
                        {patient.city && ` • ${patient.city}`}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Résultats Grossesses */}
            {results.grossesses?.length > 0 && (
              <CommandGroup heading={`Grossesses (${results.grossesses.length})`}>
                {results.grossesses.map((grossesse: any) => (
                  <CommandItem
                    key={`grossesse-${grossesse.id}`}
                    onSelect={() => handleSelect(grossesse, 'grossesse')}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100">
                      <Baby className="h-4 w-4 text-pink-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{grossesse.patientName}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {grossesse.ddr && (() => {
                          const sa = calculateSA(grossesse.ddr)
                          return `${sa.weeks} SA + ${sa.days}j`
                        })()}
                        {grossesse.status === 'en_cours' && (
                          <Badge variant="default" className="ml-2 text-xs">
                            En cours
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Résultats Consultations */}
            {results.consultations?.length > 0 && (
              <CommandGroup heading={`Consultations (${results.consultations.length})`}>
                {results.consultations.map((consultation: any) => (
                  <CommandItem
                    key={`consultation-${consultation.id}`}
                    onSelect={() => handleSelect(consultation, 'consultation')}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                      <Stethoscope className="h-4 w-4 text-green-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{consultation.patientName}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {formatDate(consultation.date)} • {consultation.type}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Résultats Surveillance */}
            {results.surveillances?.length > 0 && (
              <CommandGroup heading={`Surveillance (${results.surveillances.length})`}>
                {results.surveillances.map((surveillance: any) => (
                  <CommandItem
                    key={`surveillance-${surveillance.id}`}
                    onSelect={() => handleSelect(surveillance, 'surveillance')}
                    className="flex items-center gap-3 py-3"
                  >
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg',
                        surveillance.niveau === 'rapprochee'
                          ? 'bg-red-100'
                          : surveillance.niveau === 'vigilance'
                          ? 'bg-yellow-100'
                          : 'bg-green-100'
                      )}
                    >
                      <Eye
                        className={cn(
                          'h-4 w-4',
                          surveillance.niveau === 'rapprochee'
                            ? 'text-red-700'
                            : surveillance.niveau === 'vigilance'
                            ? 'text-yellow-700'
                            : 'text-green-700'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{surveillance.patientName}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {surveillance.raison} • Prochain contrôle:{' '}
                        {formatDate(surveillance.dateProchainControle)}
                      </div>
                    </div>
                    {new Date(surveillance.dateProchainControle) < new Date() && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Résultats Protocoles */}
            {results.protocols?.length > 0 && (
              <CommandGroup heading={`Protocoles (${results.protocols.length})`}>
                {results.protocols.map((protocol: any) => (
                  <CommandItem
                    key={`protocol-${protocol.id}`}
                    onSelect={() => handleSelect(protocol, 'protocol')}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                      <BookOpen className="h-4 w-4 text-purple-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{protocol.nom}</div>
                      <div className="text-xs text-slate-500 truncate">{protocol.description}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
