import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Plus, Baby, Loader2, Calendar } from 'lucide-react'
import { formatDate } from '../../lib/utils'

interface Grossesse {
  id: string
  ddr: string
  dpa: string
  status: string
  grossesseMultiple: boolean
  nombreFoetus: number
  patient: {
    firstName: string
    lastName: string
  }
}

export default function GrossessesPage() {
  const [grossesses, setGrossesses] = useState<Grossesse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGrossesses()
  }, [])

  const fetchGrossesses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grossesses`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setGrossesses(data.grossesses)
      }
    } catch (error) {
      console.error('Error fetching grossesses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Grossesses</h1>
          <p className="text-slate-500 mt-1">
            {grossesses.length} grossesse{grossesses.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Button asChild>
          <Link to="/grossesses/new">
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle grossesse
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : grossesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Baby className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucune grossesse
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Commencez par ajouter une nouvelle grossesse
            </p>
            <Button asChild>
              <Link to="/grossesses/new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle grossesse
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grossesses.map((g) => (
            <Link key={g.id} to={`/grossesses/${g.id}`}>
              <Card className="hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {g.patient.firstName} {g.patient.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge>{g.status}</Badge>
                        {g.grossesseMultiple && (
                          <Badge variant="secondary">
                            {g.nombreFoetus} foetus
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Baby className="h-8 w-8 text-pink-500" />
                  </div>

                  <div className="space-y-2 text-sm mt-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      DDR: {formatDate(g.ddr)}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      DPA: {formatDate(g.dpa)}
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
