import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import {
  ArrowLeft,
  Loader2,
  Edit,
  Calendar,
  Baby,
  AlertTriangle,
  Activity,
  FileText,
  User,
  Plus,
  Stethoscope,
} from 'lucide-react'
import { formatDate, calculateSA } from '../../lib/utils'

export default function GrosesseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [grossesse, setGrossesse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sa, setSa] = useState<any>(null)
  const [showAccouchementDialog, setShowAccouchementDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accouchementData, setAccouchementData] = useState({
    dateAccouchement: '',
    modeAccouchement: '',
    lieuAccouchement: '',
    compteRendu: '',
  })

  useEffect(() => {
    fetchGrossesse()
  }, [id])

  const fetchGrossesse = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grossesses/${id}`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setGrossesse(data.grossesse)
        setSa(calculateSA(data.grossesse.ddr))
      } else {
        navigate('/grossesses')
      }
    } catch (error) {
      console.error('Error fetching grossesse:', error)
      navigate('/grossesses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccouchementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/grossesses/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateAccouchement: accouchementData.dateAccouchement,
          modeAccouchement: accouchementData.modeAccouchement,
          lieuAccouchement: accouchementData.lieuAccouchement,
          compteRendu: accouchementData.compteRendu,
          status: 'terminee',
        }),
      })

      const data = await res.json()

      if (data.success) {
        setShowAccouchementDialog(false)
        fetchGrossesse()
        alert('Accouchement enregistré avec succès')
      } else {
        alert('Erreur: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving accouchement:', error)
      alert('Erreur lors de l\'enregistrement')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!grossesse) {
    return null
  }

  const progressPercent = sa ? Math.min((sa.weeks / 40) * 100, 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/grossesses">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Grossesse - {grossesse.patient.firstName} {grossesse.patient.lastName}
            </h1>
            <p className="text-slate-500 mt-1">
              {sa && `${sa.weeks} SA + ${sa.days} jours`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/patients/${grossesse.patientId}`}>
              <User className="h-4 w-4 mr-2" />
              Voir patiente
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/documents/generate?patientId=${grossesse.patientId}&grossesseId=${id}`}>
              <FileText className="h-4 w-4 mr-2" />
              Générer document
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/consultations/new?grossesseId=${id}&patientId=${grossesse.patientId}`}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle consultation
            </Link>
          </Button>
          {grossesse.status !== 'terminee' && (
            <Button variant="default" className="bg-pink-600 hover:bg-pink-700" onClick={() => setShowAccouchementDialog(true)}>
              <Baby className="h-4 w-4 mr-2" />
              Accouchement
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Avancement de la grossesse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Progression</span>
                <span className="font-medium">
                  {sa && `${sa.weeks} / 40 semaines`}
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <div className="text-sm text-slate-600">DDR</div>
                <div className="font-medium mt-1">{formatDate(grossesse.ddr)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">DPA</div>
                <div className="font-medium mt-1">{formatDate(grossesse.dpa)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Statut</div>
                <Badge className="mt-1">{grossesse.status}</Badge>
              </div>
              {grossesse.grossesseMultiple && (
                <div>
                  <div className="text-sm text-slate-600">Foetus</div>
                  <div className="font-medium mt-1">{grossesse.nombreFoetus}</div>
                </div>
              )}
            </div>

            {grossesse.facteursRisque && grossesse.facteursRisque.length > 0 && (
              <div className="pt-4 border-t">
                <div className="text-sm font-medium text-slate-900 mb-2">
                  Facteurs de risque
                </div>
                <div className="flex flex-wrap gap-2">
                  {grossesse.facteursRisque.map((f: string, i: number) => (
                    <Badge key={i} variant="outline">{f}</Badge>
                  ))}
                </div>
              </div>
            )}

            {grossesse.notes && (
              <div className="pt-4 border-t">
                <div className="text-sm font-medium text-slate-900 mb-2">Notes</div>
                <p className="text-sm text-slate-600">{grossesse.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-slate-600">Gestité:</span>
                <span className="ml-2 font-medium">{grossesse.gestite || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-600">Parité:</span>
                <span className="ml-2 font-medium">{grossesse.parite || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="consultations">
        <TabsList>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="examens">Examens</TabsTrigger>
          <TabsTrigger value="bebes">Bébés</TabsTrigger>
        </TabsList>

        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <CardTitle>Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              {grossesse.consultations && grossesse.consultations.length > 0 ? (
                <div className="space-y-4">
                  {grossesse.consultations.map((c: any) => (
                    <Link key={c.id} to={`/consultations/${c.id}`}>
                      <div className="p-4 border rounded-lg hover:bg-slate-50">
                        <div className="font-medium">{formatDate(c.date)}</div>
                        <div className="text-sm text-slate-600 mt-1">{c.type}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-600 py-8">
                  Aucune consultation
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examens">
          <Card>
            <CardHeader>
              <CardTitle>Examens</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-slate-600 py-8">
                Aucun examen enregistré
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bebes">
          <Card>
            <CardHeader>
              <CardTitle>Bébés</CardTitle>
            </CardHeader>
            <CardContent>
              {grossesse.bebes && grossesse.bebes.length > 0 ? (
                <div className="space-y-4">
                  {grossesse.bebes.map((b: any) => (
                    <div key={b.id} className="p-4 border rounded-lg">
                      <div className="font-medium">{b.prenom || 'Bébé'}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Né le {formatDate(b.dateNaissance)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-600 py-8">
                  Grossesse en cours
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Accouchement */}
      <Dialog open={showAccouchementDialog} onOpenChange={setShowAccouchementDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compte rendu d'accouchement</DialogTitle>
            <DialogDescription>
              Enregistrez les informations de l'accouchement pour {grossesse.patient.firstName} {grossesse.patient.lastName}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAccouchementSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateAccouchement">Date d'accouchement *</Label>
                <Input
                  id="dateAccouchement"
                  type="date"
                  value={accouchementData.dateAccouchement}
                  onChange={(e) => setAccouchementData({ ...accouchementData, dateAccouchement: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modeAccouchement">Mode d'accouchement *</Label>
                <Select
                  value={accouchementData.modeAccouchement}
                  onValueChange={(value) => setAccouchementData({ ...accouchementData, modeAccouchement: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voie_basse">Voie basse spontanée</SelectItem>
                    <SelectItem value="voie_basse_instrumentale">Voie basse instrumentale</SelectItem>
                    <SelectItem value="cesarienne">Césarienne</SelectItem>
                    <SelectItem value="cesarienne_urgence">Césarienne en urgence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="lieuAccouchement">Lieu d'accouchement</Label>
                <Input
                  id="lieuAccouchement"
                  value={accouchementData.lieuAccouchement}
                  onChange={(e) => setAccouchementData({ ...accouchementData, lieuAccouchement: e.target.value })}
                  placeholder="Ex: Maternité de l'hôpital..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="compteRendu">Compte rendu</Label>
                <Textarea
                  id="compteRendu"
                  value={accouchementData.compteRendu}
                  onChange={(e) => setAccouchementData({ ...accouchementData, compteRendu: e.target.value })}
                  placeholder="Déroulement de l'accouchement, complications éventuelles, état de la mère et du bébé..."
                  rows={8}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAccouchementDialog(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Baby className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
