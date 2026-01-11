import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Textarea } from '../../components/ui/textarea'
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
  Trash2,
  Bell,
  StickyNote,
  Save,
  X,
  ChevronRight,
  Eye,
  Pill,
} from 'lucide-react'
import { formatDate, calculateAge, calculateSA } from '../../lib/utils'
import { useAppointments } from '../../hooks/useAppointments'
import { NewAppointmentDialog } from '../../components/NewAppointmentDialog'
import { ReeducationTab } from '../../components/ReeducationTab'
import { PatientDocuments } from '../../components/PatientDocuments'
import { SurveillanceBadge } from '../../components/surveillance/SurveillanceBadge'
import { SurveillanceModal } from '../../components/surveillance/SurveillanceModal'
import { TraitementsHabituels } from '../../components/TraitementsHabituels'
import { format, parseISO, isFuture, isPast } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [alertes, setAlertes] = useState<any[]>([])
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [surveillance, setSurveillance] = useState<any>(null)
  const [surveillanceModalOpen, setSurveillanceModalOpen] = useState(false)

  // Fetch appointments for this patient
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments({
    patientId: id
  })

  useEffect(() => {
    fetchPatient()
    fetchAlertes()
    fetchSurveillance()
  }, [id])

  const fetchPatient = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setPatient(data.patient)
        setNotesValue(data.patient.notes || '')
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

  const fetchAlertes = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/alertes?patientId=${id}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success) {
        setAlertes(data.alertes.filter((a: any) => !a.isDismissed))
      }
    } catch (error) {
      console.error('Error fetching alertes:', error)
    }
  }

  const fetchSurveillance = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/surveillance/patient/${id}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success) {
        setSurveillance(data.surveillance)
      }
    } catch (error) {
      console.error('Error fetching surveillance:', error)
    }
  }

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notes: notesValue })
      })

      const data = await res.json()

      if (data.success) {
        setPatient({ ...patient, notes: notesValue })
        setIsEditingNotes(false)
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSavingNotes(false)
    }
  }

  const handleDelete = async () => {
    const patientName = `${patient.firstName} ${patient.lastName}`

    if (!confirm(
      `Êtes-vous sûr de vouloir archiver la patiente ${patientName} ?\n\n` +
      `Cette action archivera la patiente et toutes ses données associées (consultations, grossesses, etc.). ` +
      `Les données archivées ne seront plus visibles mais resteront dans la base de données.`
    )) {
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await res.json()

      if (data.success) {
        navigate('/patients')
      } else {
        alert(data.error || 'Erreur lors de l\'archivage')
      }
    } catch (error) {
      console.error('Error deleting patient:', error)
      alert('Erreur lors de l\'archivage')
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
        <div className="flex gap-2">
          <Button asChild>
            <Link to={`/patients/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Archiver
          </Button>
        </div>
      </div>

      {/* Alertes & Tâches */}
      {alertes.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-3">
                  Alertes & Tâches ({alertes.length})
                </h3>
                <div className="space-y-2">
                  {alertes.map((alerte: any) => (
                    <div
                      key={alerte.id}
                      className={`p-3 rounded-lg ${
                        alerte.severity === 'urgent'
                          ? 'bg-red-100 border border-red-300'
                          : alerte.severity === 'warning'
                          ? 'bg-orange-100 border border-orange-300'
                          : 'bg-white border border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={
                                alerte.severity === 'urgent'
                                  ? 'bg-red-200 text-red-800 border-red-300'
                                  : alerte.severity === 'warning'
                                  ? 'bg-orange-200 text-orange-800 border-orange-300'
                                  : 'bg-blue-200 text-blue-800 border-blue-300'
                              }
                            >
                              {alerte.type === 'tache_manuelle' ? 'Tâche' : alerte.type}
                            </Badge>
                            {!alerte.isRead && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{alerte.message}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDate(alerte.createdAt)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                        >
                          <Link to="/alertes">
                            <ArrowLeft className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes - Pense-bête */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-base">Notes & Pense-bête</CardTitle>
          </div>
          {!isEditingNotes ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingNotes(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditingNotes(false)
                  setNotesValue(patient.notes || '')
                }}
                disabled={isSavingNotes}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
              >
                {isSavingNotes ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditingNotes ? (
            <Textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Ajoutez des notes pour vos prochaines consultations : antécédents importants, préférences de la patiente, points à surveiller..."
              rows={6}
              className="w-full"
            />
          ) : (
            <div className="text-sm text-slate-700 whitespace-pre-wrap min-h-[80px]">
              {patient.notes || (
                <span className="text-slate-400 italic">
                  Aucune note. Cliquez sur "Modifier" pour ajouter un pense-bête.
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
          <TabsTrigger value="traitements">
            <Pill className="h-4 w-4 mr-2" />
            Traitements
          </TabsTrigger>
          <TabsTrigger value="reeducation">
            <Activity className="h-4 w-4 mr-2" />
            Rééducation
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Grossesse en cours</CardTitle>
              {patient.grossesses && patient.grossesses.find((g: any) => g.status === 'en_cours') && (
                <Button
                  size="sm"
                  variant={surveillance ? "outline" : "default"}
                  onClick={() => setSurveillanceModalOpen(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {surveillance ? "Modifier surveillance" : "Ajouter surveillance"}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {patient.grossesses && patient.grossesses.find((g: any) => g.status === 'en_cours') ? (
                (() => {
                  const activeGrossesse = patient.grossesses.find((g: any) => g.status === 'en_cours')
                  return (
                    <div className="space-y-4">
                      {surveillance && (
                        <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-lg">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <SurveillanceBadge
                                niveau={surveillance.niveau}
                                raison={surveillance.raison}
                              />
                              {surveillance.dateProchainControle && (
                                <div className="mt-2 text-sm text-slate-700">
                                  <span className="font-medium">Prochain contrôle:</span>{' '}
                                  {formatDate(surveillance.dateProchainControle)}
                                </div>
                              )}
                              {surveillance.notesSurveillance && (
                                <div className="mt-2 text-sm text-slate-600">
                                  {surveillance.notesSurveillance}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <Link to={`/grossesses/${activeGrossesse.id}`}>
                        <div className="p-6 border-2 border-blue-200 bg-blue-50 rounded-lg hover:border-blue-300 transition-all hover:shadow-md cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-600">En cours</Badge>
                                {activeGrossesse.ddr && (() => {
                                  const sa = calculateSA(activeGrossesse.ddr)
                                  return (
                                    <span className="text-sm text-slate-600">
                                      {sa.weeks} SA + {sa.days}j
                                    </span>
                                  )
                                })()}
                              </div>
                              <div className="text-sm text-slate-700 space-y-1">
                                <div>
                                  <span className="font-medium">DDR:</span> {formatDate(activeGrossesse.ddr)}
                                </div>
                                <div>
                                  <span className="font-medium">DPA:</span> {formatDate(activeGrossesse.dpa)}
                                </div>
                              </div>
                            </div>
                            <div className="text-blue-600">
                              <ChevronRight className="h-8 w-8" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })()
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 mb-4">Aucune grossesse en cours</p>
                  <Button asChild>
                    <Link to={`/grossesses/new?patientId=${id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Déclarer une grossesse
                    </Link>
                  </Button>
                </div>
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

        <TabsContent value="traitements">
          <TraitementsHabituels
            patientId={id!}
            patientName={`${patient.firstName} ${patient.lastName}`}
          />
        </TabsContent>

        <TabsContent value="reeducation">
          <ReeducationTab patientId={id!} />
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
          <PatientDocuments patientId={id!} />
        </TabsContent>
      </Tabs>

      {/* Surveillance Modal */}
      {patient.grossesses && patient.grossesses.find((g: any) => g.status === 'en_cours') && (
        <SurveillanceModal
          open={surveillanceModalOpen}
          onClose={() => setSurveillanceModalOpen(false)}
          patientId={id!}
          patientName={`${patient.firstName} ${patient.lastName}`}
          grossesseId={patient.grossesses.find((g: any) => g.status === 'en_cours')?.id}
          existingSurveillance={surveillance}
          onSuccess={() => {
            fetchSurveillance()
            setSurveillanceModalOpen(false)
          }}
        />
      )}
    </div>
  )
}
