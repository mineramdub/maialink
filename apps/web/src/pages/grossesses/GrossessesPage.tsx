import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Plus, Baby, Loader2, Calendar } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { useGrossesses, usePrefetchGrossesse } from '../../hooks/useGrossesses'

export default function GrossessesPage() {
  const prefetchGrossesse = usePrefetchGrossesse()

  // React Query with cache - background refetch
  const { data: grossesses = [], isLoading, error } = useGrossesses()

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

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="py-8 text-center text-red-600">
            Erreur lors du chargement
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && grossesses.length === 0 && (
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
      )}

      {!isLoading && !error && grossesses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grossesses.map((grossesse: any) => (
            <Link
              key={grossesse.id}
              to={`/grossesses/${grossesse.id}`}
              onMouseEnter={() => prefetchGrossesse(grossesse.id)}
              onFocus={() => prefetchGrossesse(grossesse.id)}
            >
              <Card className="card-hover hover:border-slate-300 cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 shrink-0">
                      <Baby className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900">
                        {grossesse.patient?.firstName} {grossesse.patient?.lastName}
                      </h3>

                      <div className="mt-2 space-y-1">
                        {grossesse.ddr && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Calendar className="h-3.5 w-3.5" />
                            DDR: {formatDate(grossesse.ddr)}
                          </div>
                        )}
                        {grossesse.dpa && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Calendar className="h-3.5 w-3.5" />
                            DPA: {formatDate(grossesse.dpa)}
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <Badge
                          variant={grossesse.status === 'en_cours' ? 'default' : 'secondary'}
                        >
                          {grossesse.status === 'en_cours' ? 'En cours' : grossesse.status}
                        </Badge>
                      </div>

                      {grossesse.grossesseMultiple && (
                        <p className="text-xs text-purple-600 mt-2 font-medium">
                          Grossesse multiple ({grossesse.nombreFoetus} foetus)
                        </p>
                      )}
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
