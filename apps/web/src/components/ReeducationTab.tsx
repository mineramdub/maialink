import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Plus, Loader2, CheckCircle2, Clock, XCircle, Activity } from 'lucide-react'
import { formatDate } from '../lib/utils'

interface ReeducationTabProps {
  patientId: string
}

export function ReeducationTab({ patientId }: ReeducationTabProps) {
  const [parcours, setParcours] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchParcours()
  }, [patientId])

  const fetchParcours = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reeducation/patient/${patientId}`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success) {
        setParcours(data.parcours || [])
      }
    } catch (error) {
      console.error('Error fetching parcours:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_cours':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="h-3 w-3 mr-1" />
            En cours
          </Badge>
        )
      case 'termine':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Terminé
          </Badge>
        )
      case 'abandonne':
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
            <XCircle className="h-3 w-3 mr-1" />
            Abandonné
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parcours de rééducation</CardTitle>
        <Button size="sm" asChild>
          <Link to={`/reeducation/new?patientId=${patientId}`}>
            <Plus className="h-4 w-4 mr-1" />
            Nouveau parcours
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {parcours.length > 0 ? (
          <div className="space-y-4">
            {/* Parcours actif */}
            {parcours.filter(p => p.status === 'en_cours').map((p) => (
              <Link key={p.id} to={`/reeducation/${p.id}`}>
                <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-900">Parcours en cours</h4>
                        {getStatusBadge(p.status)}
                      </div>
                      <p className="text-sm text-slate-600">Motif : {p.motif}</p>
                      <p className="text-sm text-slate-600">
                        Début : {formatDate(p.dateDebut)}
                      </p>
                    </div>
                  </div>

                  {/* Tableau des séances */}
                  <div className="mt-4">
                    <div className="bg-white rounded-lg overflow-hidden border">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b">
                          <tr>
                            <th className="text-left px-3 py-2 font-medium text-slate-600">Séance</th>
                            <th className="text-left px-3 py-2 font-medium text-slate-600">Date</th>
                            <th className="text-left px-3 py-2 font-medium text-slate-600">Status</th>
                            <th className="text-center px-3 py-2 font-medium text-slate-600">Testing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {p.seances && p.seances.map((seance: any) => (
                            <tr key={seance.id} className="border-b last:border-0 hover:bg-slate-50">
                              <td className="px-3 py-2">
                                <span className="font-medium">
                                  {seance.numeroSeance === 1
                                    ? 'Bilan initial'
                                    : `Séance ${seance.numeroSeance}`}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-slate-600">
                                {seance.date ? formatDate(seance.date) : '-'}
                              </td>
                              <td className="px-3 py-2">
                                {seance.status === 'realisee' ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    ✓ Réalisée
                                  </Badge>
                                ) : seance.status === 'annulee' ? (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    Annulée
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                    Planifiée
                                  </Badge>
                                )}
                              </td>
                              <td className="px-3 py-2 text-center text-slate-600">
                                {seance.testingScore !== null && seance.testingScore !== undefined
                                  ? `${seance.testingScore}/5`
                                  : seance.testingControle !== null && seance.testingControle !== undefined
                                  ? `${seance.testingControle}/5`
                                  : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        Progression : {p.nombreSeancesRealisees || 0} / {p.nombreSeancesPrevues || 5} séances
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/reeducation/${p.id}`}>
                          Voir détails →
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Parcours terminés/abandonnés */}
            {parcours.filter(p => p.status !== 'en_cours').length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-700 mt-6">Historique</h4>
                {parcours.filter(p => p.status !== 'en_cours').map((p) => (
                  <Link key={p.id} to={`/reeducation/${p.id}`}>
                    <div className="p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">Parcours {p.motif}</span>
                            {getStatusBadge(p.status)}
                          </div>
                          <p className="text-xs text-slate-600">
                            {formatDate(p.dateDebut)} {p.dateFin && `→ ${formatDate(p.dateFin)}`}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {p.nombreSeancesRealisees || 0} / {p.nombreSeancesPrevues || 5} séances réalisées
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">Aucun parcours de rééducation</p>
            <Button size="sm" asChild>
              <Link to={`/reeducation/new?patientId=${patientId}`}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un parcours
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
