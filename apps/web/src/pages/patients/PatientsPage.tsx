import { useState, memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  Plus,
  Search,
  Users,
  Baby,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react'
import { formatDate, calculateAge } from '../../lib/utils'
import { usePatients, usePrefetchPatient } from '../../hooks/usePatients'

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  email?: string
  phone?: string
  mobilePhone?: string
  gravida: number
  para: number
  status: string
}

const PatientCard = memo(({ patient, onPrefetch }: { patient: Patient; onPrefetch: (id: string) => void }) => (
  <Link
    key={patient.id}
    to={`/patients/${patient.id}`}
    onMouseEnter={() => onPrefetch(patient.id)}
    onFocus={() => onPrefetch(patient.id)}
  >
    <Card className="card-hover hover:border-slate-300 cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold shrink-0">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-900 truncate">
              {patient.firstName} {patient.lastName}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {calculateAge(patient.birthDate)} ans
            </p>

            {/* Contact Info */}
            <div className="mt-3 space-y-1">
              {patient.email && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{patient.email}</span>
                </div>
              )}
              {(patient.phone || patient.mobilePhone) && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{patient.mobilePhone || patient.phone}</span>
                </div>
              )}
            </div>

            {/* Obstetric Info */}
            {(patient.gravida > 0 || patient.para > 0) && (
              <div className="flex items-center gap-2 mt-3">
                <Baby className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-600">
                  G{patient.gravida} P{patient.para}
                </span>
              </div>
            )}

            {/* Status Badge */}
            <div className="mt-3">
              <Badge
                variant={patient.status === 'active' ? 'default' : 'secondary'}
              >
                {patient.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Birth Date */}
        <div className="mt-4 pt-4 border-t text-xs text-slate-500">
          Née le {formatDate(patient.birthDate)}
        </div>
      </CardContent>
    </Card>
  </Link>
))

PatientCard.displayName = 'PatientCard'

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const prefetchPatient = usePrefetchPatient()

  const handlePrefetch = useCallback((id: string) => {
    prefetchPatient(id)
  }, [prefetchPatient])

  // Use React Query with caching - data will be fetched in background
  const { data: patients = [], isLoading, error } = usePatients({
    search: search || undefined,
    status: statusFilter || undefined,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patientes</h1>
          <p className="text-slate-500 mt-1">
            {patients.length} patiente{patients.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Button asChild>
          <Link to="/patients/new">
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle patiente
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher par nom, prénom, email ou date de naissance..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actives</SelectItem>
            <SelectItem value="inactive">Inactives</SelectItem>
            <SelectItem value="all">Toutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="py-8 text-center text-red-600">
            Erreur lors du chargement des patientes
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && patients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucune patiente
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Commencez par ajouter une nouvelle patiente
            </p>
            <Button asChild>
              <Link to="/patients/new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle patiente
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Patient Cards with Prefetch on Hover */}
      {!isLoading && !error && patients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} onPrefetch={handlePrefetch} />
          ))}
        </div>
      )}
    </div>
  )
}
