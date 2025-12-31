import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { ArrowLeft, Loader2, User, AlertTriangle, FileText } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { GenerateOrdonnanceDialog } from '../../components/GenerateOrdonnanceDialog'

export default function ConsultationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [consultation, setConsultation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showOrdonnanceDialog, setShowOrdonnanceDialog] = useState(false)

  useEffect(() => {
    fetchConsultation()
  }, [id])

  const fetchConsultation = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations/${id}`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setConsultation(data.consultation)
      } else {
        navigate('/consultations')
      }
    } catch (error) {
      console.error('Error fetching consultation:', error)
      navigate('/consultations')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!consultation) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/consultations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Consultation du {formatDate(consultation.date)}
            </h1>
            <p className="text-slate-500 mt-1">
              {consultation.patient.firstName} {consultation.patient.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowOrdonnanceDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Créer ordonnance
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/patients/${consultation.patientId}`}>
              <User className="h-4 w-4 mr-2" />
              Voir patiente
            </Link>
          </Button>
        </div>
      </div>

      {/* Modal de génération d'ordonnance */}
      <GenerateOrdonnanceDialog
        open={showOrdonnanceDialog}
        onOpenChange={setShowOrdonnanceDialog}
        patientId={consultation.patientId}
        consultationId={consultation.id}
      />

      {consultation.alertes && consultation.alertes.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900">Alertes détectées</h3>
                <ul className="mt-2 space-y-1">
                  {consultation.alertes.map((alert: any, i: number) => (
                    <li key={i} className="text-sm text-orange-800">
                      • {alert.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Détails de la consultation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge>{consultation.type}</Badge>
                {consultation.saTerm !== undefined && (
                  <Badge variant="outline">
                    {consultation.saTerm} SA + {consultation.saJours} j
                  </Badge>
                )}
              </div>

              {consultation.motif && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-900 mb-2">Motif</h3>
                  <p className="text-sm text-slate-600">{consultation.motif}</p>
                </div>
              )}

              {consultation.examenClinique && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-900 mb-2">Examen clinique</h3>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">
                    {consultation.examenClinique}
                  </p>
                </div>
              )}

              {consultation.conclusion && (
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-2">Conclusion</h3>
                  <p className="text-sm text-slate-600">{consultation.conclusion}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Constantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {consultation.poids && (
                <div>
                  <span className="text-slate-600">Poids:</span>
                  <span className="ml-2 font-medium">{consultation.poids} kg</span>
                </div>
              )}
              {consultation.tensionSystolique && consultation.tensionDiastolique && (
                <div>
                  <span className="text-slate-600">Tension:</span>
                  <span className="ml-2 font-medium">
                    {consultation.tensionSystolique}/{consultation.tensionDiastolique} mmHg
                  </span>
                </div>
              )}
              {consultation.hauteurUterine && (
                <div>
                  <span className="text-slate-600">HU:</span>
                  <span className="ml-2 font-medium">{consultation.hauteurUterine} cm</span>
                </div>
              )}
              {consultation.bdc && (
                <div>
                  <span className="text-slate-600">BDC:</span>
                  <span className="ml-2 font-medium">{consultation.bdc} bpm</span>
                </div>
              )}
              {consultation.temperature && (
                <div>
                  <span className="text-slate-600">Température:</span>
                  <span className="ml-2 font-medium">{consultation.temperature} °C</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
