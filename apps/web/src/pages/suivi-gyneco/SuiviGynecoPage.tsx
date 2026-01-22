import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Activity, Pill, Baby, FileText, Plus, X, FolderPlus } from 'lucide-react'
import { FrottisTab } from '../../components/suivi-gyneco/FrottisTab'
import { ContraceptifsTab } from '../../components/suivi-gyneco/ContraceptifsTab'
import { AccouchementsTab } from '../../components/suivi-gyneco/AccouchementsTab'
import { ResultatsTab } from '../../components/suivi-gyneco/ResultatsTab'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

interface CustomCategory {
  id: string
  name: string
  icon: string
}

export default function SuiviGynecoPage() {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [activeTab, setActiveTab] = useState('frottis')

  // Charger les catégories personnalisées depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('suivi_gyneco_custom_categories')
    if (saved) {
      try {
        setCustomCategories(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading custom categories:', e)
      }
    }
  }, [])

  // Sauvegarder les catégories personnalisées
  const saveCategories = (categories: CustomCategory[]) => {
    localStorage.setItem('suivi_gyneco_custom_categories', JSON.stringify(categories))
    setCustomCategories(categories)
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: CustomCategory = {
      id: `custom_${Date.now()}`,
      name: newCategoryName.trim(),
      icon: '📋'
    }

    saveCategories([...customCategories, newCategory])
    setNewCategoryName('')
    setIsAddingCategory(false)
    setActiveTab(newCategory.id)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      const updated = customCategories.filter(c => c.id !== categoryId)
      saveCategories(updated)
      if (activeTab === categoryId) {
        setActiveTab('frottis')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Organisation & Rappels</h1>
          <p className="text-slate-500 mt-1">
            Gestion des frottis, contraceptifs, accouchements, résultats et catégories personnalisées
          </p>
        </div>
        <Button onClick={() => setIsAddingCategory(true)} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle catégorie
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          <TabsList>
            <TabsTrigger value="frottis">
              <Activity className="h-4 w-4 mr-2" />
              Frottis
            </TabsTrigger>
            <TabsTrigger value="contraceptifs">
              <Pill className="h-4 w-4 mr-2" />
              Contraceptifs
            </TabsTrigger>
            <TabsTrigger value="accouchements">
              <Baby className="h-4 w-4 mr-2" />
              Accouchements à venir
            </TabsTrigger>
            <TabsTrigger value="resultats">
              <FileText className="h-4 w-4 mr-2" />
              Résultats à récupérer
            </TabsTrigger>

            {customCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="group relative">
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteCategory(category.id)
                  }}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Supprimer"
                >
                  <X className="h-3 w-3 text-red-500 hover:text-red-700" />
                </button>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="frottis">
          <FrottisTab />
        </TabsContent>

        <TabsContent value="contraceptifs">
          <ContraceptifsTab />
        </TabsContent>

        <TabsContent value="accouchements">
          <AccouchementsTab />
        </TabsContent>

        <TabsContent value="resultats">
          <ResultatsTab />
        </TabsContent>

        {customCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FolderPlus className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    Catégorie personnalisée - Ajoutez vos propres éléments de suivi
                  </p>
                  <p className="text-sm text-slate-500">
                    Utilisez cette catégorie pour organiser vos rappels et suivis personnalisés.
                  </p>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-left max-w-md mx-auto">
                    <p className="font-medium text-blue-900 mb-2">💡 Idées d'utilisation :</p>
                    <ul className="list-disc list-inside text-blue-800 space-y-1">
                      <li>Vaccinations spécifiques</li>
                      <li>Examens complémentaires récurrents</li>
                      <li>Rappels de suivi post-opératoire</li>
                      <li>Contrôles particuliers pour pathologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog pour ajouter une catégorie */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle catégorie personnalisée</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom de la catégorie</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="ex: Vaccinations, Examens spéciaux..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCategory()
                  }
                }}
                autoFocus
              />
            </div>
            <div className="text-xs text-slate-500">
              Cette catégorie vous permettra d'organiser des éléments de suivi personnalisés selon vos besoins.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Créer la catégorie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
