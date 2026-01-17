import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import {
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Loader2,
  BookOpen,
  FileText,
  Stethoscope,
  AlertCircle,
  Calculator,
  Link as LinkIcon
} from 'lucide-react'

interface RessourceMedicale {
  id: string
  titre: string
  description: string
  categorie: string
  type: 'lien' | 'fichier' | 'calculateur' | 'memo'
  url?: string
  contenu?: string
  tags: string[]
  createdAt: string
}

const categories = [
  { value: 'protocoles', label: 'Protocoles', icon: FileText },
  { value: 'references', label: 'Références', icon: BookOpen },
  { value: 'scores', label: 'Scores & Calculateurs', icon: Calculator },
  { value: 'urgences', label: 'Urgences', icon: AlertCircle },
  { value: 'medicaments', label: 'Médicaments', icon: Stethoscope },
  { value: 'autres', label: 'Autres', icon: LinkIcon },
]

export default function RessourcesMedicalesPage() {
  const [ressources, setRessources] = useState<RessourceMedicale[]>([])
  const [filteredRessources, setFilteredRessources] = useState<RessourceMedicale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: 'protocoles',
    type: 'lien' as 'lien' | 'fichier' | 'calculateur' | 'memo',
    url: '',
    contenu: '',
    tags: '',
  })

  const ALL_CATEGORIES = 'all'

  useEffect(() => {
    fetchRessources()
  }, [])

  useEffect(() => {
    let filtered = ressources

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory && selectedCategory !== ALL_CATEGORIES) {
      filtered = filtered.filter(r => r.categorie === selectedCategory)
    }

    setFilteredRessources(filtered)
  }, [searchTerm, selectedCategory, ressources])

  const fetchRessources = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ressources-medicales`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRessources(data)
      setFilteredRessources(data)
    } catch (error) {
      console.error('Error fetching ressources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ressources-medicales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        })
      })

      if (!res.ok) throw new Error('Failed to create')

      setDialogOpen(false)
      setFormData({
        titre: '',
        description: '',
        categorie: 'protocoles',
        type: 'lien',
        url: '',
        contenu: '',
        tags: '',
      })
      fetchRessources()
    } catch (error) {
      console.error('Error creating ressource:', error)
      alert('Erreur lors de la création de la ressource')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ressources-medicales/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to delete')
      fetchRessources()
    } catch (error) {
      console.error('Error deleting ressource:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const openRessource = (ressource: RessourceMedicale) => {
    if (ressource.type === 'lien' && ressource.url) {
      window.open(ressource.url, '_blank')
    } else if (ressource.type === 'memo' && ressource.contenu) {
      alert(ressource.contenu)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lien': return <ExternalLink className="h-4 w-4" />
      case 'fichier': return <FileText className="h-4 w-4" />
      case 'calculateur': return <Calculator className="h-4 w-4" />
      case 'memo': return <BookOpen className="h-4 w-4" />
      default: return <LinkIcon className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lien': return 'Lien externe'
      case 'fichier': return 'Fichier'
      case 'calculateur': return 'Calculateur'
      case 'memo': return 'Mémo'
      default: return type
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ressources Médicales</h1>
          <p className="text-slate-600 mt-1">
            Centralisez vos liens, protocoles et outils médicaux
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle ressource
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher une ressource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedCategory || ALL_CATEGORIES}
          onValueChange={(v) => setSelectedCategory(v === ALL_CATEGORIES ? null : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Toutes catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>Toutes catégories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => {
          const count = ressources.filter(r => r.categorie === cat.value).length
          const Icon = cat.icon
          return (
            <Card
              key={cat.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === cat.value ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
            >
              <CardContent className="p-4 text-center">
                <Icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-slate-600">{cat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Liste des ressources */}
      {filteredRessources.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>Aucune ressource trouvée</p>
            <p className="text-sm">Commencez par ajouter vos premiers liens et protocoles</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRessources.map(ressource => (
            <Card key={ressource.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-2">{ressource.titre}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getTypeIcon(ressource.type)}
                        <span className="ml-1">{getTypeLabel(ressource.type)}</span>
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.value === ressource.categorie)?.label}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(ressource.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {ressource.description}
                </p>

                {ressource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {ressource.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {(ressource.type === 'lien' || ressource.type === 'memo') && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openRessource(ressource)}
                  >
                    {ressource.type === 'lien' ? (
                      <>
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Ouvrir le lien
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-3 w-3 mr-2" />
                        Voir le mémo
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog d'ajout */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Nouvelle ressource médicale</DialogTitle>
            <DialogDescription>
              Ajoutez un lien, un protocole ou un mémo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Titre *</Label>
              <Input
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="ex: Protocole HTA grossesse"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Catégorie *</Label>
                <Select
                  value={formData.categorie}
                  onValueChange={(v) => setFormData({ ...formData, categorie: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lien">Lien externe</SelectItem>
                    <SelectItem value="fichier">Fichier</SelectItem>
                    <SelectItem value="calculateur">Calculateur</SelectItem>
                    <SelectItem value="memo">Mémo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brève description de la ressource"
                rows={3}
              />
            </div>

            {formData.type === 'lien' && (
              <div>
                <Label>URL *</Label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}

            {formData.type === 'memo' && (
              <div>
                <Label>Contenu du mémo</Label>
                <Textarea
                  value={formData.contenu}
                  onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                  placeholder="Texte du mémo..."
                  rows={5}
                />
              </div>
            )}

            <div>
              <Label>Tags (séparés par des virgules)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="ex: urgence, obstetrique, hta"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.titre || (formData.type === 'lien' && !formData.url)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer la ressource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
