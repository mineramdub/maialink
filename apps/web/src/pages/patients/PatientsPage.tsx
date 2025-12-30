import { useState, useEffect } from 'react'
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

interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  email?: string
  phone?: string
  mobilePhone?: string
  city?: string
  status: string
  gravida: number
  para: number
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')

  useEffect(() => {
    fetchPatients()
  }, [search, statusFilter])

  const fetchPatients = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients?${params}`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
            placeholder="Rechercher par nom, prenom ou email..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actives</SelectItem>
            <SelectItem value="inactive">Inactives</SelectItem>
            <SelectItem value="archived">Archivees</SelectItem>
            <SelectItem value="all">Toutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des patientes */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : patients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucune patiente
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Commencez par ajouter votre premiere patiente
            </p>
            <Button asChild>
              <Link to="/patients/new">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une patiente
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <Link key={patient.id} to={`/patients/${patient.id}`}>
              <Card className="hover:border-slate-300 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {calculateAge(patient.birthDate)} ans
                        </p>
                      </div>
                    </div>
                    {patient.gravida > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <Baby className="h-3 w-3" />
                        G{patient.gravida}P{patient.para}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    {(patient.phone || patient.mobilePhone) && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {patient.mobilePhone || patient.phone}
                      </div>
                    )}
                    {patient.email && (
                      <div className="flex items-center gap-2 text-slate-600 truncate">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Nee le {formatDate(patient.birthDate)}
                    </span>
                    {patient.city && (
                      <span className="text-xs text-slate-400">
                        {patient.city}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
