import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Plus, Stethoscope, Loader2, Calendar } from 'lucide-react'
import { formatDate } from '../../lib/utils'

interface Consultation {
  id: string
  date: string
  type: string
  saTerm?: number
  saJours?: number
  patient: {
    firstName: string
    lastName: string
  }
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setConsultations(data.consultations)
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      prenatale: 'Prénatale',
      postnatale: 'Postnatale',
      gyneco: 'Gynéco',
      reeducation: 'Rééducation',
      preparation: 'Préparation',
      monitoring: 'Monitoring',
      autre: 'Autre'
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Consultations</h1>
          <p className="text-slate-500 mt-1">
            {consultations.length} consultation{consultations.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Button asChild>
          <Link to="/consultations/new">
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle consultation
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : consultations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Stethoscope className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucune consultation
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Commencez par ajouter une nouvelle consultation
            </p>
            <Button asChild>
              <Link to="/consultations/new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle consultation
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => (
            <Link key={c.id} to={`/consultations/${c.id}`}>
              <Card className="hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-900">
                            {c.patient.firstName} {c.patient.lastName}
                          </h3>
                          <Badge variant="outline">{getTypeLabel(c.type)}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(c.date)}
                          </div>
                          {c.saTerm !== undefined && (
                            <div>
                              {c.saTerm} SA + {c.saJours} j
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
