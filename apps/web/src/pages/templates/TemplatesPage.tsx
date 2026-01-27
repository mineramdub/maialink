import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { EditTemplateModal } from '../../components/EditTemplateModal'
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Copy,
  Sparkles,
  Baby,
  Heart,
  Pill,
  Activity,
  Home,
  Calendar,
  Search,
  Star,
  Filter,
  SortAsc,
} from 'lucide-react'

// Catalogue de templates disponibles
const TEMPLATE_CATALOG = [
  {
    id: 'certificat-naissance',
    nom: 'Certificat de naissance',
    description: 'Certificat médical de naissance pour déclaration à l\'état civil',
    icon: Baby,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    category: 'Naissance',
  },
  {
    id: 'declaration-grossesse',
    nom: 'Déclaration de grossesse',
    description: 'Déclaration de grossesse à transmettre à la CPAM',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    category: 'Grossesse',
  },
  {
    id: 'certificat-grossesse',
    nom: 'Certificat de grossesse',
    description: 'Certificat médical attestant de l\'état de grossesse',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    category: 'Grossesse',
  },
  {
    id: 'arret-travail',
    nom: 'Arrêt de travail',
    description: 'Certificat d\'arrêt de travail pour grossesse pathologique',
    icon: Calendar,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    category: 'Arrêt',
  },
  {
    id: 'ordonnance-medicaments',
    nom: 'Ordonnance médicaments',
    description: 'Prescription de médicaments',
    icon: Pill,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    category: 'Ordonnance',
  },
  {
    id: 'ordonnance-biologie',
    nom: 'Ordonnance biologie',
    description: 'Prescription d\'examens de biologie médicale',
    icon: Activity,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    category: 'Ordonnance',
  },
  {
    id: 'demande-echographie',
    nom: 'Demande d\'échographie',
    description: 'Demande d\'échographie obstétricale',
    icon: Eye,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    category: 'Examen',
  },
  {
    id: 'contre-indication-sport',
    nom: 'Contre-indication sportive',
    description: 'Certificat de contre-indication à la pratique sportive',
    icon: Activity,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    category: 'Certificat',
  },
  {
    id: 'preparation-naissance',
    nom: 'Préparation à la naissance',
    description: 'Certificat de prescription pour préparation à la naissance',
    icon: Sparkles,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    category: 'Préparation',
  },
  {
    id: 'certificat-post-natal',
    nom: 'Certificat post-natal',
    description: 'Certificat médical post-natal',
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    category: 'Post-partum',
  },
  {
    id: 'visite-domicile',
    nom: 'Compte rendu visite à domicile',
    description: 'Compte rendu de visite à domicile',
    icon: Home,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    category: 'Suivi',
  },
  {
    id: 'compte-rendu-consultation',
    nom: 'Compte rendu de consultation',
    description: 'Compte rendu détaillé de consultation',
    icon: FileText,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    category: 'Consultation',
  },
]

// Mapping des catégories d'ordonnances vers icônes et couleurs
const getCategoryStyle = (category: string) => {
  const styles: Record<string, { icon: any; color: string; bgColor: string }> = {
    Grossesse: { icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    'Post-partum': { icon: Heart, color: 'text-rose-600', bgColor: 'bg-rose-50' },
    Allaitement: { icon: Baby, color: 'text-green-600', bgColor: 'bg-green-50' },
    Gynécologie: { icon: Activity, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    Contraception: { icon: Pill, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    Ordonnance: { icon: Pill, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  }
  return styles[category] || { icon: FileText, color: 'text-slate-600', bgColor: 'bg-slate-50' }
}

export default function TemplatesPage() {
  const [customTemplates, setCustomTemplates] = useState<any[]>([])
  const [ordonnanceTemplates, setOrdonnanceTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name')
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Charger les favoris depuis localStorage
    const saved = localStorage.getItem('template-favorites')
    return saved ? JSON.parse(saved) : []
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [templateToEdit, setTemplateToEdit] = useState<any>(null)

  useEffect(() => {
    loadCustomTemplates()
    loadOrdonnanceTemplates()
  }, [])

  const loadCustomTemplates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/document-templates`,
        {
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setCustomTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadOrdonnanceTemplates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ordonnances/templates`,
        {
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        // Transformer les templates d'ordonnances au format du catalogue
        const formattedTemplates = (data.templates || []).map((template: any) => {
          const categoryStyle = getCategoryStyle(template.categorie)
          return {
            id: template.id,
            nom: template.nom,
            description: template.description,
            icon: categoryStyle.icon,
            color: categoryStyle.color,
            bgColor: categoryStyle.bgColor,
            category: template.categorie,
            type: 'ordonnance',
            contenu: template.contenu,
            isSystemTemplate: template.isSystemTemplate,
          }
        })
        setOrdonnanceTemplates(formattedTemplates)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des templates d\'ordonnances:', error)
    }
  }

  // Séparer les templates d'ordonnances système et personnalisés
  const systemOrdonnanceTemplates = ordonnanceTemplates.filter(t => t.isSystemTemplate)
  const personalOrdonnanceTemplates = ordonnanceTemplates.filter(t => !t.isSystemTemplate)

  // Combiner les templates système du catalogue avec les templates d'ordonnances système
  const allTemplates = [...TEMPLATE_CATALOG, ...systemOrdonnanceTemplates]

  const categories = ['all', 'favoris', ...Array.from(new Set(allTemplates.map((t) => t.category)))]

  // Filtrer et trier les templates
  let filteredTemplates = allTemplates

  // Filtre par catégorie
  if (selectedCategory === 'favoris') {
    filteredTemplates = filteredTemplates.filter((t) => favorites.includes(t.id))
  } else if (selectedCategory !== 'all') {
    filteredTemplates = filteredTemplates.filter((t) => t.category === selectedCategory)
  }

  // Filtre par recherche
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filteredTemplates = filteredTemplates.filter(
      (t) =>
        t.nom.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    )
  }

  // Tri
  filteredTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'name') {
      return a.nom.localeCompare(b.nom)
    } else {
      return a.category.localeCompare(b.category)
    }
  })

  const toggleFavorite = (templateId: string) => {
    const newFavorites = favorites.includes(templateId)
      ? favorites.filter((id) => id !== templateId)
      : [...favorites, templateId]
    setFavorites(newFavorites)
    localStorage.setItem('template-favorites', JSON.stringify(newFavorites))
  }

  const handlePreview = (template: any) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const handleDownload = async (templateId: string) => {
    // Logique de téléchargement du template
    alert(`Téléchargement du template ${templateId}`)
  }

  const handleDuplicate = async (template: any) => {
    try {
      const toastId = toast.loading('Duplication en cours...')

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ordonnances/templates/${template.id}/duplicate`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erreur lors de la duplication', { id: toastId })
        return
      }

      toast.success(data.message || 'Template dupliqué avec succès !', { id: toastId })

      // Reload templates to show the new duplicate
      await loadOrdonnanceTemplates()
    } catch (error) {
      console.error('Duplication error:', error)
      toast.error('Erreur lors de la duplication du template')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Bibliothèque de templates</h1>
          <p className="text-slate-500 mt-1">
            Gérez et personnalisez vos templates de documents médicaux
          </p>
        </div>
        <Link to="/templates/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Créer un template
          </Button>
        </Link>
      </div>

      {/* Statistiques et info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Statistique globale */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900">{allTemplates.length}</p>
                <p className="text-xs text-blue-600 mt-1">templates</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        {/* Statistique favoris */}
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Favoris</p>
                <p className="text-2xl font-bold text-yellow-900">{favorites.length}</p>
                <p className="text-xs text-yellow-600 mt-1">marqués</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            </div>
          </CardContent>
        </Card>

        {/* Statistique catégories */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Catégories</p>
                <p className="text-2xl font-bold text-green-900">{categories.length - 2}</p>
                <p className="text-xs text-green-600 mt-1">disponibles</p>
              </div>
              <Filter className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        {/* Statistique ordonnances */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Ordonnances</p>
                <p className="text-2xl font-bold text-purple-900">{ordonnanceTemplates.length}</p>
                <p className="text-xs text-purple-600 mt-1">prêtes à l'emploi</p>
              </div>
              <Pill className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tri */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === 'name' ? 'category' : 'name')}
            >
              <SortAsc className="h-4 w-4 mr-2" />
              {sortBy === 'name' ? 'Nom' : 'Catégorie'}
            </Button>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? (
                'Tous'
              ) : cat === 'favoris' ? (
                <>
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Favoris ({favorites.length})
                </>
              ) : (
                cat
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Grille de templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">
              {searchQuery
                ? `Aucun template trouvé pour "${searchQuery}"`
                : selectedCategory === 'favoris'
                  ? 'Aucun template favori pour le moment'
                  : 'Aucun template disponible'}
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const Icon = template.icon
            const isFavorite = favorites.includes(template.id)

            return (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group relative"
              >
                {/* Bouton favori */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(template.id)
                  }}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <Star
                    className={`h-5 w-5 ${
                      isFavorite
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300 hover:text-yellow-400'
                    }`}
                  />
                </button>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`${template.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${template.color}`} />
                    </div>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-4 pr-8">{template.nom}</CardTitle>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Aperçu
                    </Button>
                    {template.type === 'ordonnance' ? (
                      <Link to={`/ordonnances/new?template=${encodeURIComponent(template.nom)}`}>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <FileText className="h-4 w-4 mr-1" />
                          Utiliser
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(template.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDuplicate(template)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Dupliquer et personnaliser
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
      </div>

      {/* Dialog prévisualisation */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.nom}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>

          {/* Prévisualisation avec le style d'ordonnance identique au builder */}
          <div className="bg-slate-100 p-4 rounded-lg">
            {selectedTemplate?.contenu ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-300">
                {/* En-tête minimal avec info template */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Aperçu du template</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedTemplate.category}
                  </Badge>
                </div>

                {/* Contenu avec exactement le même style que le builder d'ordonnances */}
                <div
                  className="w-full whitespace-pre-wrap max-h-[65vh] overflow-y-auto"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: '12pt',
                    lineHeight: '1.5',
                    padding: '20mm',
                    minHeight: '400px',
                    background: 'white',
                    color: '#000',
                  }}
                >
                  {selectedTemplate.contenu}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">
                    Aperçu non disponible
                    <br />
                    <span className="text-sm text-slate-400">(Ce template n'a pas encore de contenu)</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Fermer
            </Button>
            {selectedTemplate?.contenu && (
              <Button
                onClick={() => {
                  // Copier le contenu dans le presse-papier
                  navigator.clipboard.writeText(selectedTemplate.contenu)
                  toast.success('Template copié dans le presse-papier')
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Section templates d'ordonnances personnalisés */}
      {personalOrdonnanceTemplates.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Mes templates d'ordonnances personnalisés</CardTitle>
            <CardDescription>
              Templates d'ordonnances que vous avez dupliqués et personnalisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalOrdonnanceTemplates.map((template) => {
                const Icon = template.icon
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`${template.bgColor} p-2 rounded-lg`}>
                          <Icon className={`h-5 w-5 ${template.color}`} />
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <CardTitle className="text-base mt-3">{template.nom}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handlePreview(template)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Aperçu
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setTemplateToEdit(template)
                              setShowEditModal(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/ordonnances/new?template=${encodeURIComponent(template.nom)}`} className="flex-1">
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                              <FileText className="h-4 w-4 mr-1" />
                              Utiliser
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (confirm(`Voulez-vous vraiment supprimer le template "${template.nom}" ?`)) {
                                try {
                                  const response = await fetch(
                                    `${import.meta.env.VITE_API_URL}/api/ordonnances/templates/${encodeURIComponent(template.nom)}`,
                                    {
                                      method: 'DELETE',
                                      credentials: 'include',
                                    }
                                  )
                                  if (response.ok) {
                                    toast.success('Template supprimé avec succès')
                                    await loadOrdonnanceTemplates()
                                  } else {
                                    const data = await response.json()
                                    toast.error(data.error || 'Erreur lors de la suppression')
                                  }
                                } catch (error) {
                                  console.error('Erreur:', error)
                                  toast.error('Erreur lors de la suppression')
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section templates personnalisés */}
      <Card>
        <CardHeader>
          <CardTitle>Mes templates personnalisés</CardTitle>
          <CardDescription>
            Créez vos propres templates ou personnalisez les templates existants
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Chargement...</p>
            </div>
          ) : customTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Vous n'avez pas encore de templates personnalisés</p>
              <Link to="/templates/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer mon premier template
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <CardTitle className="text-base mt-3">{template.nom}</CardTitle>
                    <CardDescription className="text-xs">
                      {template.variables?.length || 0} variables
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link to={`/templates/${template.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (confirm('Voulez-vous supprimer ce template ?')) {
                            try {
                              const response = await fetch(
                                `${import.meta.env.VITE_API_URL}/api/document-templates/${template.id}`,
                                {
                                  method: 'DELETE',
                                  credentials: 'include',
                                }
                              )
                              if (response.ok) {
                                loadCustomTemplates()
                              }
                            } catch (error) {
                              console.error('Erreur:', error)
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Répartition par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par catégorie</CardTitle>
          <CardDescription>
            Nombre de templates disponibles dans chaque catégorie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories
              .filter((cat) => cat !== 'all' && cat !== 'favoris')
              .map((category) => {
                const count = allTemplates.filter((t) => t.category === category).length
                const categoryStyle = getCategoryStyle(category)
                const IconComponent = categoryStyle.icon

                return (
                  <div
                    key={category}
                    className={`${categoryStyle.bgColor} border ${categoryStyle.color.replace('text-', 'border-')} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent className={`h-6 w-6 ${categoryStyle.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{category}</p>
                        <p className={`text-xs ${categoryStyle.color}`}>{count} templates</p>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Guide d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle>Comment utiliser les templates ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Choisissez un template</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Parcourez la bibliothèque et sélectionnez le template qui correspond à vos
                  besoins. Marquez vos favoris avec l'étoile ⭐
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Prévisualisez le contenu</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Cliquez sur "Aperçu" pour voir le contenu détaillé du template avec mise en forme
                  et recommandations
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Utilisez dans vos ordonnances</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Pour les templates d'ordonnances, cliquez sur "Utiliser" pour créer directement
                  une ordonnance pré-remplie
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition de template */}
      <EditTemplateModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setTemplateToEdit(null)
        }}
        template={templateToEdit}
        onSuccess={() => {
          toast.success('Template modifié avec succès')
          loadOrdonnanceTemplates()
          setShowEditModal(false)
          setTemplateToEdit(null)
        }}
      />
    </div>
  )
}
