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
  Trash2,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Star,
  Edit,
  AlertCircle,
  Users,
  Building2,
  Hospital,
  Pill,
} from 'lucide-react'

interface NumeroUtile {
  id: string
  nom: string
  description?: string
  categorie: string
  telephone?: string
  email?: string
  adresse?: string
  notes?: string
  favori: boolean
  ordre: number
  createdAt: string
}

const categories = [
  { value: 'urgences', label: 'Urgences', icon: AlertCircle, color: 'red' },
  { value: 'collegues', label: 'Collègues', icon: Users, color: 'blue' },
  { value: 'laboratoires', label: 'Laboratoires', icon: Building2, color: 'purple' },
  { value: 'maternites', label: 'Maternités', icon: Hospital, color: 'pink' },
  { value: 'pharmacies', label: 'Pharmacies', icon: Pill, color: 'green' },
  { value: 'autres', label: 'Autres', icon: Phone, color: 'gray' },
]

const ALL_CATEGORIES = 'all'

export default function NumerosUtilesPage() {
  const [numeros, setNumeros] = useState<NumeroUtile[]>([])
  const [filteredNumeros, setFilteredNumeros] = useState<NumeroUtile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNumero, setEditingNumero] = useState<NumeroUtile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFavorisOnly, setShowFavorisOnly] = useState(false)

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    categorie: 'collegues',
    telephone: '',
    email: '',
    adresse: '',
    notes: '',
    favori: false,
  })

  useEffect(() => {
    fetchNumeros()
  }, [])

  useEffect(() => {
    let filtered = numeros

    if (searchTerm) {
      filtered = filtered.filter(n =>
        n.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.telephone?.includes(searchTerm) ||
        n.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory && selectedCategory !== ALL_CATEGORIES) {
      filtered = filtered.filter(n => n.categorie === selectedCategory)
    }

    if (showFavorisOnly) {
      filtered = filtered.filter(n => n.favori)
    }

    setFilteredNumeros(filtered)
  }, [searchTerm, selectedCategory, numeros, showFavorisOnly])

  const fetchNumeros = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/numeros-utiles`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setNumeros(data.numeros)
      setFilteredNumeros(data.numeros)
    } catch (error) {
      console.error('Error fetching numéros:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingNumero
        ? `${import.meta.env.VITE_API_URL}/api/numeros-utiles/${editingNumero.id}`
        : `${import.meta.env.VITE_API_URL}/api/numeros-utiles`

      const res = await fetch(url, {
        method: editingNumero ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to save')

      setDialogOpen(false)
      setEditingNumero(null)
      setFormData({
        nom: '',
        description: '',
        categorie: 'collegues',
        telephone: '',
        email: '',
        adresse: '',
        notes: '',
        favori: false,
      })
      fetchNumeros()
    } catch (error) {
      console.error('Error saving numéro:', error)
      alert('Erreur lors de l\'enregistrement')
    }
  }

  const handleEdit = (numero: NumeroUtile) => {
    setEditingNumero(numero)
    setFormData({
      nom: numero.nom,
      description: numero.description || '',
      categorie: numero.categorie,
      telephone: numero.telephone || '',
      email: numero.email || '',
      adresse: numero.adresse || '',
      notes: numero.notes || '',
      favori: numero.favori,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce numéro ?')) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/numeros-utiles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to delete')
      fetchNumeros()
    } catch (error) {
      console.error('Error deleting numéro:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const toggleFavori = async (numero: NumeroUtile) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/numeros-utiles/${numero.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ favori: !numero.favori })
      })

      if (!res.ok) throw new Error('Failed to toggle favori')
      fetchNumeros()
    } catch (error) {
      console.error('Error toggling favori:', error)
    }
  }

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(c => c.value === categoryValue) || categories[categories.length - 1]
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
          <h1 className="text-3xl font-bold">Carnet de Numéros Utiles</h1>
          <p className="text-slate-600 mt-1">
            Gardez vos contacts professionnels à portée de main
          </p>
        </div>
        <Button onClick={() => {
          setEditingNumero(null)
          setFormData({
            nom: '',
            description: '',
            categorie: 'collegues',
            telephone: '',
            email: '',
            adresse: '',
            notes: '',
            favori: false,
          })
          setDialogOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contact
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher un contact..."
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
        <Button
          variant={showFavorisOnly ? "default" : "outline"}
          onClick={() => setShowFavorisOnly(!showFavorisOnly)}
        >
          <Star className={`h-4 w-4 mr-2 ${showFavorisOnly ? 'fill-current' : ''}`} />
          Favoris
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(cat => {
          const count = numeros.filter(n => n.categorie === cat.value).length
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
                <Icon className={`h-6 w-6 mx-auto mb-2 text-${cat.color}-600`} />
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-slate-600">{cat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Liste des numéros */}
      {filteredNumeros.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            <Phone className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>Aucun contact trouvé</p>
            <p className="text-sm">Commencez par ajouter vos premiers contacts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNumeros.map(numero => {
            const catInfo = getCategoryInfo(numero.categorie)
            const Icon = catInfo.icon
            return (
              <Card key={numero.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-base">{numero.nom}</CardTitle>
                        <button
                          onClick={() => toggleFavori(numero)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Star className={`h-4 w-4 ${numero.favori ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Icon className="h-3 w-3 mr-1" />
                        {catInfo.label}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(numero)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(numero.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {numero.description && (
                    <p className="text-sm text-slate-600">{numero.description}</p>
                  )}

                  {numero.telephone && (
                    <a
                      href={`tel:${numero.telephone}`}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      {numero.telephone}
                    </a>
                  )}

                  {numero.email && (
                    <a
                      href={`mailto:${numero.email}`}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {numero.email}
                    </a>
                  )}

                  {numero.adresse && (
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{numero.adresse}</span>
                    </div>
                  )}

                  {numero.notes && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-slate-500 line-clamp-2">{numero.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog d'ajout/édition */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingNumero ? 'Modifier le contact' : 'Nouveau contact'}
            </DialogTitle>
            <DialogDescription>
              {editingNumero ? 'Modifiez les informations du contact' : 'Ajoutez un nouveau contact à votre carnet'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Nom *</Label>
                <Input
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="ex: Dr Dupont, Maternité Port-Royal"
                />
              </div>

              <div className="col-span-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ex: Gynécologue-obstétricien"
                />
              </div>

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

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.favori}
                    onChange={(e) => setFormData({ ...formData, favori: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Marquer comme favori</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Téléphone</Label>
                <Input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  placeholder="ex: 01 23 45 67 89"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ex: contact@exemple.fr"
                />
              </div>
            </div>

            <div>
              <Label>Adresse</Label>
              <Input
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                placeholder="ex: 123 rue de la République, 75001 Paris"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes complémentaires..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDialogOpen(false)
              setEditingNumero(null)
            }}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.nom || !formData.categorie}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingNumero ? 'Modifier' : 'Créer le contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
