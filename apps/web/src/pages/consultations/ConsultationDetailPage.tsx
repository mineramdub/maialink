import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { ArrowLeft, Loader2, User, AlertTriangle, FileText, Trash2, ExternalLink, Edit2, Printer } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { ExportPDFButton } from '../../components/ExportPDFButton'

interface OrdonnanceSuggestion {
  id: string
  titre: string
  motif: string
  type_consultation: string
  contenu: string
  tags: string[]
}

export default function ConsultationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [consultation, setConsultation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ordonnances, setOrdonnances] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<OrdonnanceSuggestion[]>([])
  const [isCreatingOrdonnance, setIsCreatingOrdonnance] = useState(false)

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
        // Fetch ordonnances linked to this consultation
        fetchOrdonnances(data.consultation.patientId)
        // Fetch ordonnance suggestions
        fetchOrdonnanceSuggestions()
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

  const fetchOrdonnanceSuggestions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations/${id}/ordonnance-suggestions`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Error fetching ordonnance suggestions:', error)
    }
  }

  const fetchOrdonnances = async (patientId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents?patientId=${patientId}&type=ordonnance`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        // Filter ordonnances linked to this consultation
        const consultationOrdonnances = data.documents.filter(
          (doc: any) => doc.consultationId === id
        )
        setOrdonnances(consultationOrdonnances)
      }
    } catch (error) {
      console.error('Error fetching ordonnances:', error)
    }
  }

  const handleCreateOrdonnanceFromTemplate = async (template: OrdonnanceSuggestion) => {
    if (isCreatingOrdonnance) return

    setIsCreatingOrdonnance(true)
    try {
      // Replace placeholders in template
      const patientName = `${consultation.patient.firstName} ${consultation.patient.lastName}`
      const birthDate = formatDate(consultation.patient.birthDate)

      let contenu = template.contenu
      contenu = contenu.replace(/\[NOM Prénom\]/g, patientName)
      contenu = contenu.replace(/\[DATE\]/g, birthDate)
      contenu = contenu.replace(/\[SA\]/g, consultation.saTerm ? `${consultation.saTerm} SA + ${consultation.saJours} j` : '')

      // Create ordonnance
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ordonnances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          patientId: consultation.patientId,
          consultationId: id,
          titre: template.titre,
          contenu: contenu,
          signe: false
        })
      })

      const data = await res.json()

      if (data.success) {
        // Navigate to the created ordonnance
        navigate(`/ordonnances/${data.ordonnance.id}`)
      } else {
        alert(data.error || 'Erreur lors de la création de l\'ordonnance')
      }
    } catch (error) {
      console.error('Error creating ordonnance:', error)
      alert('Erreur lors de la création de l\'ordonnance')
    } finally {
      setIsCreatingOrdonnance(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(
      `Êtes-vous sûr de vouloir supprimer cette consultation du ${formatDate(consultation.date)} ?\n\n` +
      `Cette action est irréversible et supprimera définitivement toutes les données associées.`
    )) {
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await res.json()

      if (data.success) {
        navigate(`/patients/${consultation.patientId}`)
      } else {
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting consultation:', error)
      alert('Erreur lors de la suppression')
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
      {/* En-tête pour l'impression */}
      <div className="hidden print:block mb-8">
        <h1 className="text-2xl font-bold text-center mb-2">COMPTE-RENDU DE CONSULTATION</h1>
        <p className="text-center text-slate-600">
          Consultation du {formatDate(consultation.date)}
        </p>
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded">
          <p className="font-medium">Patiente : {consultation.patient.firstName} {consultation.patient.lastName}</p>
          <p className="text-sm text-slate-600">Date de naissance : {formatDate(consultation.patient.birthDate)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between print:hidden">
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
          <Button
            onClick={() => navigate(`/ordonnances/new?patientId=${consultation.patientId}&consultationId=${id}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Créer ordonnance
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <ExportPDFButton
            type="consultation"
            data={consultation}
            patient={consultation.patient}
            variant="outline"
          />
          <Button variant="outline" asChild>
            <Link to={`/consultations/edit/${id}`}>
              <Edit2 className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/patients/${consultation.patientId}`}>
              <User className="h-4 w-4 mr-2" />
              Voir patiente
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Ordonnances liées à cette consultation */}
      {ordonnances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ordonnances associées ({ordonnances.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ordonnances.map((ord: any) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{ord.titre}</p>
                      <p className="text-sm text-slate-500">
                        Créée le {formatDate(ord.createdAt)}
                        {ord.signe && (
                          <span className="ml-2 text-green-600 font-medium">• Signée</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/ordonnances/${ord.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions d'ordonnances */}
      {suggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <FileText className="h-5 w-5" />
              Ordonnances suggérées pour cette consultation ({suggestions.length})
            </CardTitle>
            <p className="text-sm text-blue-700 mt-2">
              Cliquez sur une suggestion pour créer une ordonnance pré-remplie
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleCreateOrdonnanceFromTemplate(suggestion)}
                  disabled={isCreatingOrdonnance}
                  className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-blue-200 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-blue-900 truncate">{suggestion.titre}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {suggestion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
