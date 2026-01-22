import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Loader2, Baby, Calendar } from 'lucide-react'
import { formatDate, calculateSA } from '../../lib/utils'
import { Link } from 'react-router-dom'
import { differenceInDays } from 'date-fns'

interface Grossesse {
  id: string
  ddr: string
  dpa: string
  status: string
  patient: {
    id: string
    firstName: string
    lastName: string
  }
}

export function AccouchementsTab() {
  const [accouchements, setAccouchements] = useState<Grossesse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAccouchements()
  }, [])

  const fetchAccouchements = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/accouchements`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setAccouchements(data.accouchements)
      }
    } catch (error) {
      console.error('Error fetching accouchements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProximityBadge = (dpa: string) => {
    const today = new Date()
    const dpaDate = new Date(dpa)
    const daysRemaining = differenceInDays(dpaDate, today)

    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive">
          Dépassé de {Math.abs(daysRemaining)} jours
        </Badge>
      )
    } else if (daysRemaining === 0) {
      return (
        <Badge className="bg-pink-100 text-pink-800 border-pink-300">
          Aujourd'hui !
        </Badge>
      )
    } else if (daysRemaining <= 7) {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-300">
          Dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
        </Badge>
      )
    } else if (daysRemaining <= 30) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          Dans {daysRemaining} jours
        </Badge>
      )
    } else if (daysRemaining <= 60) {
      return (
        <Badge variant="outline">
          Dans {Math.round(daysRemaining / 7)} semaines
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-slate-50">
        Dans {Math.round(daysRemaining / 30)} mois
      </Badge>
    )
  }

  const getMonthLabel = (dpa: string) => {
    const date = new Date(dpa)
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  }

  // Grouper par mois
  const groupedByMonth = accouchements.reduce((acc, grossesse) => {
    const monthKey = getMonthLabel(grossesse.dpa)
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(grossesse)
    return acc
  }, {} as Record<string, Grossesse[]>)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accouchements prévus</CardTitle>
        <p className="text-sm text-slate-500">
          {accouchements.length} grossesse{accouchements.length > 1 ? 's' : ''} en cours
        </p>
      </CardHeader>
      <CardContent>
        {accouchements.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedByMonth).map(([month, grossesses]) => (
              <div key={month}>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {month}
                  <Badge variant="outline" className="ml-2">{grossesses.length}</Badge>
                </h3>
                <div className="space-y-3">
                  {grossesses.map((g) => {
                    const sa = calculateSA(g.ddr)
                    return (
                      <Link key={g.id} to={`/grossesses/${g.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                              <Baby className="h-5 w-5 text-pink-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">
                                {g.patient.firstName} {g.patient.lastName}
                              </div>
                              <div className="text-sm text-slate-600 mt-1">
                                DPA: {formatDate(g.dpa)}
                              </div>
                              {sa && (
                                <div className="text-xs text-slate-500 mt-1">
                                  {sa.weeks} SA + {sa.days} jours
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getProximityBadge(g.dpa)}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Baby className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">Aucune grossesse en cours</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
