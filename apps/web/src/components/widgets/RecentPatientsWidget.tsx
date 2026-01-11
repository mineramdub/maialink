import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, ChevronRight, Plus, Clock, User } from 'lucide-react'
import { formatDate, calculateAge } from '@/lib/utils'

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateNaissance: string
  city?: string
  hasActiveGrossesse?: boolean
  lastConsultation?: string
}

export function RecentPatientsWidget() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRecentPatients()
  }, [])

  const fetchRecentPatients = async () => {
    try {
      const res = await fetch('/api/patients?limit=5&sort=recent', {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setPatients(data.patients || [])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-slate-600" />
          Patientes récentes
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/patients')}
        >
          Voir tout
        </Button>
      </CardHeader>
      <CardContent>
        {patients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600">Aucune activité récente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 card-hover cursor-pointer"
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900 truncate">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {patient.city && `${patient.city} • `}
                    {patient.age} ans
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
