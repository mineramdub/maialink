import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import {
  ArrowLeft,
  Loader2,
  Edit,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Calendar,
  Activity,
} from 'lucide-react'
import { formatDate } from '../../lib/utils'

export default function ReeducationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [parcours, setParcours] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchParcours()
  }, [id])

  const fetchParcours = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reeducation/${id}`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success) {
        setParcours(data.parcours)
      } else {
        navigate('/patients')
      }
    } catch (error) {
      console.error('Error fetching parcours:', error)
      navigate('/patients')
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!parcours) {
    return null
  }

  const progressPercent =
    (parcours.nombreSeancesRealisees / parcours.nombreSeancesPrevues) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/patients/${parcours.patientId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Parcours de rééducation
            </h1>
            <p className="text-slate-500 mt-1">
              {parcours.patient?.firstName} {parcours.patient?.lastName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/patients/${parcours.patientId}`}>
              <User className="h-4 w-4 mr-2" />
              Voir patiente
            </Link>
          </Button>
        </div>
      </div>

      {/* Résumé du parcours */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-600">Statut</div>
              <div className="mt-1">{getStatusBadge(parcours.status)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Motif</div>
              <div className="font-medium mt-1">{parcours.motif}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Date de début</div>
              <div className="font-medium mt-1">
                {formatDate(parcours.dateDebut)}
              </div>
            </div>
            {parcours.dateFin && (
              <div>
                <div className="text-sm text-slate-600">Date de fin</div>
                <div className="font-medium mt-1">
                  {formatDate(parcours.dateFin)}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Progression</span>
              <span className="font-medium">
                {parcours.nombreSeancesRealisees || 0} /{' '}
                {parcours.nombreSeancesPrevues} séances
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>

          {parcours.notes && (
            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-slate-900 mb-2">
                Notes
              </div>
              <p className="text-sm text-slate-600">{parcours.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tableau des séances */}
      <Card>
        <CardHeader>
          <CardTitle>Séances de rééducation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Séance
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Statut
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">
                    Testing
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {parcours.seances &&
                  parcours.seances.map((seance: any) => (
                    <tr
                      key={seance.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {seance.numeroSeance === 1
                            ? 'Séance 1 - Bilan initial'
                            : `Séance ${seance.numeroSeance}`}
                        </div>
                        {seance.numeroSeance === 1 && (
                          <div className="text-xs text-slate-500 mt-1">
                            Interrogatoire + Testing + Examen
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {seance.date ? formatDate(seance.date) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        {seance.status === 'realisee' ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Réalisée
                          </Badge>
                        ) : seance.status === 'annulee' ? (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Annulée
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Planifiée
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">
                        {seance.testingScore !== null &&
                        seance.testingScore !== undefined
                          ? `${seance.testingScore}/5`
                          : seance.testingControle !== null &&
                            seance.testingControle !== undefined
                          ? `${seance.testingControle}/5`
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link
                            to={`/reeducation/${id}/seance/${seance.id}`}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            {seance.status === 'realisee' ? 'Voir' : 'Remplir'}
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
