import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import {
  ArrowLeft,
  Loader2,
  Edit,
  Baby,
  Stethoscope,
  FileText,
  Receipt,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Plus,
} from 'lucide-react'
import { formatDate, calculateAge } from '../../lib/utils'
import { useAppointments } from '../../hooks/useAppointments'
import { NewAppointmentDialog } from '../../components/NewAppointmentDialog'
import { format, parseISO, isFuture, isPast } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch appointments for this patient
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments({
    patientId: id
  })

  useEffect(() => {
    fetchPatient()
  }, [id])

  const fetchPatient = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setPatient(data.patient)
      } else {
        navigate('/patients')
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
      navigate('/patients')
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

  if (!patient) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/patients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-slate-500 mt-1">
              {calculateAge(patient.birthDate)} ans • Nee le {formatDate(patient.birthDate)}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/patients/${id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Link>
        </Button>
      </div>

      {patient.alertes && patient.alertes.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900">Alertes actives</h3>
                <ul className="mt-2 space-y-1">
                  {patient.alertes.map((alert: any) => (
                    <li key={alert.id} className="text-sm text-orange-800">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Informations de contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{patient.email}</span>
              </div>
            )}
            {(patient.phone || patient.mobilePhone) && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{patient.mobilePhone || patient.phone}</span>
              </div>
            )}
            {patient.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-slate-400" />
                <div>
                  <div>{patient.address}</div>
                  <div>{patient.postalCode} {patient.city}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Informations medicales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {patient.bloodType && (
              <div>
                <span className="text-slate-600">Groupe sanguin:</span>
                <span className="ml-2 font-medium">{patient.bloodType} {patient.rhesus}</span>
              </div>
            )}
            {patient.gravida > 0 && (
              <div>
                <span className="text-slate-600">Parite:</span>
                <span className="ml-2 font-medium">G{patient.gravida}P{patient.para}</span>
              </div>
            )}
            {patient.allergies && (
              <div>
                <span className="text-slate-600">Allergies:</span>
                <div className="mt-1 text-sm">{patient.allergies}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Activite recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-slate-600">Grossesses:</span>
              <span className="ml-2 font-medium">{patient.grossesses?.length || 0}</span>
            </div>
            <div>
              <span className="text-slate-600">Consultations:</span>
              <span className="ml-2 font-medium">{patient.consultations?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grossesses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grossesses">
            <Baby className="h-4 w-4 mr-2" />
            Grossesses
          </TabsTrigger>
          <TabsTrigger value="consultations">
            <Stethoscope className="h-4 w-4 mr-2" />
            Consultations
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Rendez-vous
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grossesses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Grossesses</CardTitle>
              <Button size="sm" asChild>
                <Link to={`/grossesses/new?patientId=${id}`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle grossesse
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {patient.grossesses && patient.grossesses.length > 0 ? (
                <div className="space-y-4">
                  {patient.grossesses.map((g: any) => (
                    <Link key={g.id} to={`/grossesses/${g.id}`}>
                      <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">DDR: {formatDate(g.ddr)}</div>
                            <div className="text-sm text-slate-600 mt-1">
                              DPA: {formatDate(g.dpa)}
                            </div>
                          </div>
                          <Badge>{g.status}</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-600 py-8">
                  Aucune grossesse enregistree
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Consultations</CardTitle>
              <Button size="sm" asChild>
                <Link to={`/consultations/new?patientId=${id}`}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle consultation
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {patient.consultations && patient.consultations.length > 0 ? (
                <div className="space-y-4">
                  {patient.consultations.slice(0, 5).map((c: any) => (
                    <Link key={c.id} to={`/consultations/${c.id}`}>
                      <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{formatDate(c.date)}</div>
                            <div className="text-sm text-slate-600 mt-1">{c.type}</div>
                          </div>
                          <Badge variant="outline">{c.type}</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-600 py-8">
                  Aucune consultation enregistree
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Rendez-vous</CardTitle>
              <NewAppointmentDialog
                patientId={id!}
                patientName={`${patient.firstName} ${patient.lastName}`}
                trigger={
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Nouveau RDV
                  </Button>
                }
              />
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments
                    .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                    .map((apt: any) => {
                      const startTime = parseISO(apt.startTime)
                      const isUpcoming = isFuture(startTime)

                      return (
                        <div
                          key={apt.id}
                          className={`p-4 border rounded-lg hover:bg-slate-50 transition-colors ${
                            isUpcoming ? 'border-blue-200 bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <div className="font-medium">
                                  {format(startTime, 'EEEE d MMMM yyyy', { locale: fr })}
                                </div>
                                {isUpcoming && (
                                  <Badge className="bg-blue-100 text-blue-700">À venir</Badge>
                                )}
                              </div>
                              <div className="text-sm text-slate-600 mt-2 ml-6">
                                {format(startTime, 'HH:mm')} - {format(parseISO(apt.endTime), 'HH:mm')}
                              </div>
                              <div className="text-sm text-slate-600 mt-1 ml-6">
                                {apt.type}
                              </div>
                              {apt.location && (
                                <div className="text-sm text-slate-600 mt-1 ml-6 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {apt.location}
                                </div>
                              )}
                              {apt.notes && (
                                <div className="text-sm text-slate-600 mt-2 ml-6 pt-2 border-t">
                                  {apt.notes}
                                </div>
                              )}
                            </div>
                            <Badge variant="outline">{apt.status}</Badge>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className="text-center text-slate-600 py-8">
                  Aucun rendez-vous enregistré
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-slate-600 py-8">
                Aucun document
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
