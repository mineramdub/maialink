import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  FileText,
  Plus,
  Edit,
  Copy,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  X
} from 'lucide-react'

interface OrdonnanceTemplate {
  id: string
  nom: string
  categorie: string
  type: 'medicament' | 'biologie' | 'echographie' | 'autre'
  priorite: 'urgent' | 'recommande' | 'optionnel'
  contenu: string
  description: string | null
  source: string | null
  version: string | null
  dateValidite: string | null
  isActive: boolean
  isSystemTemplate: boolean
  createdAt: string
  updatedAt: string
  ageInDays?: number
  ageInYears?: number
  ageWarning?: 'warning' | 'critical' | null
}

interface Stats {
  total: number
  system: number
  personal: number
  active: number
  inactive: number
  expiringSoon: number
  expired: number
}

export function OrdonnanceTemplatesPage() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<OrdonnanceTemplate[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<OrdonnanceTemplate | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategorie, setFilterCategorie] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Formulaire d'édition
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    type: 'medicament' as 'medicament' | 'biologie' | 'echographie' | 'autre',
    priorite: 'recommande' as 'urgent' | 'recommande' | 'optionnel',
    contenu: '',
    description: '',
    source: '',
    version: '',
    dateValidite: '',
    isActive: true,
  })

  useEffect(() => {
    fetchTemplates()
    fetchStats()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ordonnance-templates`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Erreur chargement templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ordonnance-templates/stats/summary`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }

  const handleEdit = (template: OrdonnanceTemplate) => {
    if (template.isSystemTemplate) {
      // Dupliquer au lieu d'éditer
      handleDuplicate(template)
      return
    }

    setSelectedTemplate(template)
    setFormData({
      nom: template.nom,
      categorie: template.categorie,
      type: template.type,
      priorite: template.priorite,
      contenu: template.contenu,
      description: template.description || '',
      source: template.source || '',
      version: template.version || '',
      dateValidite: template.dateValidite || '',
      isActive: template.isActive,
    })
    setIsCreating(false)
    setIsEditModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedTemplate(null)
    setFormData({
      nom: '',
      categorie: '',
      type: 'medicament',
      priorite: 'recommande',
      contenu: '',
      description: '',
      source: '',
      version: '2024.1',
      dateValidite: '',
      isActive: true,
    })
    setIsCreating(true)
    setIsEditModalOpen(true)
  }

  const handleDuplicate = async (template: OrdonnanceTemplate) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ordonnance-templates/${template.id}/duplicate`,
        {
          method: 'POST',
          credentials: 'include'
        }
      )
      const data = await res.json()
      if (data.success) {
        alert('Template dupliqué avec succès!')
        fetchTemplates()
        fetchStats()
      }
    } catch (error) {
      console.error('Erreur duplication:', error)
      alert('Erreur lors de la duplication')
    }
  }

  const handleDelete = async (template: OrdonnanceTemplate) => {
    if (template.isSystemTemplate) {
      alert('Les templates système ne peuvent pas être supprimés')
      return
    }

    if (!confirm(`Supprimer le template "${template.nom}" ?`)) {
      return
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ordonnance-templates/${template.id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )
      const data = await res.json()
      if (data.success) {
        alert('Template supprimé avec succès!')
        fetchTemplates()
        fetchStats()
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleSave = async () => {
    try {
      const url = isCreating
        ? `${import.meta.env.VITE_API_URL}/api/ordonnance-templates`
        : `${import.meta.env.VITE_API_URL}/api/ordonnance-templates/${selectedTemplate?.id}`

      const res = await fetch(url, {
        method: isCreating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        alert(isCreating ? 'Template créé avec succès!' : 'Template mis à jour avec succès!')
        setIsEditModalOpen(false)
        fetchTemplates()
        fetchStats()
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  // Filtrage
  const filteredTemplates = templates.filter(template => {
    if (searchTerm && !template.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !template.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    if (filterCategorie !== 'all' && template.categorie !== filterCategorie) {
      return false
    }

    if (filterType !== 'all' && template.type !== filterType) {
      return false
    }

    if (filterStatus === 'active' && !template.isActive) return false
    if (filterStatus === 'inactive' && template.isActive) return false
    if (filterStatus === 'expired' && template.ageWarning !== 'critical') return false
    if (filterStatus === 'expiring' && template.ageWarning !== 'warning') return false

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Templates d'Ordonnances</h1>
          <p className="text-slate-600 mt-1">Gérer les templates pour faciliter la prescription</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Template
        </Button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-7 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.system}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Personnels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.personal}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Inactifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-400">{stats.inactive}</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">À revoir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Expirés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerte pour templates expirés */}
      {stats && stats.expired > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Templates à mettre à jour</AlertTitle>
          <AlertDescription>
            {stats.expired} template(s) n'ont pas été mis à jour depuis plus de 2 ans.
            Il est recommandé de vérifier qu'ils sont conformes aux recommandations actuelles.
          </AlertDescription>
        </Alert>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Nom du template..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="filterCategorie">Catégorie</Label>
              <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="contraception">Contraception</SelectItem>
                  <SelectItem value="infection">Infection</SelectItem>
                  <SelectItem value="grossesse">Grossesse</SelectItem>
                  <SelectItem value="gynecologie">Gynécologie</SelectItem>
                  <SelectItem value="allaitement">Allaitement</SelectItem>
                  <SelectItem value="reeducation">Rééducation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filterType">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="medicament">Médicament</SelectItem>
                  <SelectItem value="biologie">Biologie</SelectItem>
                  <SelectItem value="echographie">Échographie</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filterStatus">Statut</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                  <SelectItem value="expiring">À revoir ({'>'} 1 an)</SelectItem>
                  <SelectItem value="expired">Expirés ({'>'} 2 ans)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des templates */}
      <div className="grid gap-4">
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              Aucun template trouvé
            </CardContent>
          </Card>
        ) : (
          filteredTemplates.map(template => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-slate-400" />
                      <h3 className="text-lg font-semibold text-slate-900">{template.nom}</h3>

                      {template.isSystemTemplate && (
                        <Badge variant="secondary">Système</Badge>
                      )}

                      {template.ageWarning === 'critical' && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expiré ({template.ageInYears}+ ans)
                        </Badge>
                      )}

                      {template.ageWarning === 'warning' && (
                        <Badge variant="warning" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                          <Clock className="h-3 w-3" />
                          À revoir ({template.ageInYears} an{template.ageInYears! > 1 ? 's' : ''})
                        </Badge>
                      )}

                      {!template.isActive && (
                        <Badge variant="outline" className="text-slate-400">Inactif</Badge>
                      )}
                    </div>

                    {template.description && (
                      <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="capitalize">{template.categorie}</span>
                      <span>•</span>
                      <span className="capitalize">{template.type}</span>
                      <span>•</span>
                      <span className="capitalize">{template.priorite}</span>
                      {template.source && (
                        <>
                          <span>•</span>
                          <span>{template.source}</span>
                        </>
                      )}
                      {template.version && (
                        <>
                          <span>•</span>
                          <span>v{template.version}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                      title={template.isSystemTemplate ? 'Dupliquer (templates système non modifiables)' : 'Éditer'}
                    >
                      {template.isSystemTemplate ? (
                        <Copy className="h-4 w-4" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                    </Button>

                    {!template.isSystemTemplate && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicate(template)}
                          title="Dupliquer"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(template)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal d'édition/création */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Créer un nouveau template' : `Éditer: ${selectedTemplate?.nom}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom du template *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Contraception - Pilule Combinée"
                />
              </div>

              <div>
                <Label htmlFor="categorie">Catégorie *</Label>
                <Input
                  id="categorie"
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  placeholder="Ex: contraception"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicament">Médicament</SelectItem>
                    <SelectItem value="biologie">Biologie</SelectItem>
                    <SelectItem value="echographie">Échographie</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priorite">Priorité *</Label>
                <Select
                  value={formData.priorite}
                  onValueChange={(v: any) => setFormData({ ...formData, priorite: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="recommande">Recommandé</SelectItem>
                    <SelectItem value="optionnel">Optionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">Template actif</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description courte du template..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="contenu">Contenu du template *</Label>
              <Textarea
                id="contenu"
                value={formData.contenu}
                onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                placeholder="Contenu de l'ordonnance avec checkboxes..."
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="Ex: HAS, CNGOF"
                />
              </div>

              <div>
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="Ex: 2024.1"
                />
              </div>

              <div>
                <Label htmlFor="dateValidite">Date de validité</Label>
                <Input
                  id="dateValidite"
                  type="date"
                  value={formData.dateValidite}
                  onChange={(e) => setFormData({ ...formData, dateValidite: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {isCreating ? 'Créer' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
