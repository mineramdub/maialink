import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog'
import {
  Pill,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Calendar,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Traitement {
  id: string
  nom: string
  dci?: string
  dosage?: string
  forme?: string
  posologie: string
  voieAdministration?: string
  dateDebut?: string
  dateFin?: string
  renouvellementAuto: boolean
  categorie?: string
  indication?: string
  isActive: boolean
  isChronique: boolean
  notes?: string
  prescripteur?: string
  createdAt: string
  updatedAt: string
}

interface Props {
  patientId: string
  patientName: string
}

const CATEGORIES = [
  'Antihypertenseur',
  'Antidiabétique',
  'Supplément nutritionnel',
  'Antalgique',
  'Anti-inflammatoire',
  'Antibiotique',
  'Antifongique',
  'Anticoagulant',
  'Hormone',
  'Vitamine',
  'Autre',
]

const FORMES = [
  'Comprimé',
  'Gélule',
  'Sirop',
  'Suspension',
  'Solution injectable',
  'Pommade',
  'Crème',
  'Ovule',
  'Suppositoire',
  'Patch',
  'Spray',
  'Autre',
]

export function TraitementsHabituels({ patientId, patientName }: Props) {
  const [traitements, setTraitements] = useState<Traitement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTraitement, setEditingTraitement] = useState<Traitement | null>(null)
  const [formData, setFormData] = useState({
    nom: '',
    dci: '',
    dosage: '',
    forme: '',
    posologie: '',
    voieAdministration: 'orale',
    dateDebut: '',
    dateFin: '',
    renouvellementAuto: false,
    categorie: '',
    indication: '',
    isChronique: false,
    notes: '',
    prescripteur: '',
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchTraitements()
  }, [patientId])

  const fetchTraitements = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/traitements-habituels?patientId=${patientId}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success) {
        setTraitements(data.traitements)
      }
    } catch (error) {
      console.error('Error fetching traitements:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les traitements',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingTraitement
        ? `${import.meta.env.VITE_API_URL}/api/traitements-habituels/${editingTraitement.id}`
        : `${import.meta.env.VITE_API_URL}/api/traitements-habituels`

      const res = await fetch(url, {
        method: editingTraitement ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          patientId,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: editingTraitement ? 'Traitement modifié' : 'Traitement ajouté',
          description: 'Le traitement a été enregistré avec succès',
        })
        fetchTraitements()
        setIsDialogOpen(false)
        resetForm()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      })
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/traitements-habituels/${id}/toggle-active`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Statut modifié',
          description: 'Le statut du traitement a été mis à jour',
        })
        fetchTraitements()
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce traitement ?')) return

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/traitements-habituels/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await res.json()

      if (data.success) {
        toast({
          title: 'Traitement supprimé',
          description: 'Le traitement a été supprimé avec succès',
        })
        fetchTraitements()
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le traitement',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (traitement: Traitement) => {
    setEditingTraitement(traitement)
    setFormData({
      nom: traitement.nom,
      dci: traitement.dci || '',
      dosage: traitement.dosage || '',
      forme: traitement.forme || '',
      posologie: traitement.posologie,
      voieAdministration: traitement.voieAdministration || 'orale',
      dateDebut: traitement.dateDebut || '',
      dateFin: traitement.dateFin || '',
      renouvellementAuto: traitement.renouvellementAuto,
      categorie: traitement.categorie || '',
      indication: traitement.indication || '',
      isChronique: traitement.isChronique,
      notes: traitement.notes || '',
      prescripteur: traitement.prescripteur || '',
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingTraitement(null)
    setFormData({
      nom: '',
      dci: '',
      dosage: '',
      forme: '',
      posologie: '',
      voieAdministration: 'orale',
      dateDebut: '',
      dateFin: '',
      renouvellementAuto: false,
      categorie: '',
      indication: '',
      isChronique: false,
      notes: '',
      prescripteur: '',
    })
  }

  const activeTraitements = traitements.filter((t) => t.isActive)
  const inactiveTraitements = traitements.filter((t) => !t.isActive)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Traitements habituels
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un traitement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTraitement ? 'Modifier' : 'Ajouter'} un traitement
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="nom">Nom du médicament *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                    placeholder="Ex: Tardyferon B9"
                  />
                </div>

                <div>
                  <Label htmlFor="dci">DCI</Label>
                  <Input
                    id="dci"
                    value={formData.dci}
                    onChange={(e) => setFormData({ ...formData, dci: e.target.value })}
                    placeholder="Ex: Fer + Vitamine B9"
                  />
                </div>

                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="Ex: 500mg"
                  />
                </div>

                <div>
                  <Label htmlFor="forme">Forme</Label>
                  <Select
                    value={formData.forme}
                    onValueChange={(value) => setFormData({ ...formData, forme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMES.map((forme) => (
                        <SelectItem key={forme} value={forme}>
                          {forme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="categorie">Catégorie</Label>
                  <Select
                    value={formData.categorie}
                    onValueChange={(value) => setFormData({ ...formData, categorie: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="posologie">Posologie *</Label>
                  <Input
                    id="posologie"
                    value={formData.posologie}
                    onChange={(e) => setFormData({ ...formData, posologie: e.target.value })}
                    required
                    placeholder="Ex: 1 comprimé matin et soir"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="indication">Indication</Label>
                  <Input
                    id="indication"
                    value={formData.indication}
                    onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                    placeholder="Ex: Anémie ferriprive"
                  />
                </div>

                <div>
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="dateFin">Date de fin</Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="prescripteur">Prescripteur</Label>
                  <Input
                    id="prescripteur"
                    value={formData.prescripteur}
                    onChange={(e) => setFormData({ ...formData, prescripteur: e.target.value })}
                    placeholder="Ex: Dr Martin (médecin traitant)"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ex: Prendre pendant les repas..."
                    rows={3}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isChronique"
                      checked={formData.isChronique}
                      onChange={(e) =>
                        setFormData({ ...formData, isChronique: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isChronique" className="font-normal cursor-pointer">
                      Traitement chronique (de fond)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="renouvellementAuto"
                      checked={formData.renouvellementAuto}
                      onChange={(e) =>
                        setFormData({ ...formData, renouvellementAuto: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="renouvellementAuto" className="font-normal cursor-pointer">
                      Renouvellement automatique
                    </Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingTraitement ? 'Modifier' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Chargement...</div>
        ) : activeTraitements.length === 0 && inactiveTraitements.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Aucun traitement enregistré</p>
            <p className="text-sm text-slate-400 mt-1">
              Ajoutez les traitements habituels de {patientName}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTraitements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Traitements actifs</h4>
                <div className="space-y-2">
                  {activeTraitements.map((traitement) => (
                    <TraitementCard
                      key={traitement.id}
                      traitement={traitement}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </div>
              </div>
            )}

            {inactiveTraitements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">
                  Traitements arrêtés
                </h4>
                <div className="space-y-2 opacity-60">
                  {inactiveTraitements.map((traitement) => (
                    <TraitementCard
                      key={traitement.id}
                      traitement={traitement}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TraitementCard({
  traitement,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  traitement: Traitement
  onEdit: (t: Traitement) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 transition-all',
        traitement.isActive
          ? 'bg-white border-blue-200 hover:border-blue-300'
          : 'bg-slate-50 border-slate-200'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-semibold text-slate-900">
              {traitement.nom}
              {traitement.dosage && (
                <span className="font-normal text-slate-600 ml-2">{traitement.dosage}</span>
              )}
            </h5>
            {traitement.isChronique && (
              <Badge variant="secondary" className="text-xs">
                Chronique
              </Badge>
            )}
            {traitement.renouvellementAuto && (
              <Badge variant="outline" className="text-xs">
                Renouvellement auto
              </Badge>
            )}
          </div>

          <p className="text-sm text-slate-700 mb-2">{traitement.posologie}</p>

          {traitement.indication && (
            <p className="text-xs text-slate-500 mb-2">
              <span className="font-medium">Indication:</span> {traitement.indication}
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            {traitement.categorie && (
              <span className="inline-flex items-center gap-1">
                <Pill className="h-3 w-3" />
                {traitement.categorie}
              </span>
            )}
            {traitement.dateDebut && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Depuis le {new Date(traitement.dateDebut).toLocaleDateString('fr-FR')}
              </span>
            )}
            {traitement.prescripteur && (
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {traitement.prescripteur}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleActive(traitement.id)}
            title={traitement.isActive ? 'Marquer comme arrêté' : 'Réactiver'}
          >
            {traitement.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(traitement)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(traitement.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
