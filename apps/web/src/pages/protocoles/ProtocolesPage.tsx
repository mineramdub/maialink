import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Plus, BookOpen, Loader2, FileText, CheckCircle, Clock, Search, Filter } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { formatDate } from '../../lib/utils'

export default function ProtocolesPage() {
  const navigate = useNavigate()
  const [protocols, setProtocols] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    fetchProtocols()
  }, [])

  const fetchProtocols = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/protocols`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setProtocols(data.protocols)
      }
    } catch (error) {
      console.error('Error fetching protocols:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique categories from protocols
  const uniqueCategories = useMemo(() => {
    const categories = new Set(protocols.map(p => p.category).filter(Boolean))
    return Array.from(categories).sort()
  }, [protocols])

  // Color palette for categories (deterministic based on string hash)
  const categoryColorPalette = [
    'bg-pink-100 text-pink-800 hover:bg-pink-200',
    'bg-purple-100 text-purple-800 hover:bg-purple-200',
    'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'bg-green-100 text-green-800 hover:bg-green-200',
    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    'bg-orange-100 text-orange-800 hover:bg-orange-200',
    'bg-teal-100 text-teal-800 hover:bg-teal-200',
    'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    'bg-rose-100 text-rose-800 hover:bg-rose-200',
    'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
  ]

  // Get color for a category based on its string hash
  const getCategoryColor = (category: string): string => {
    if (!category) return 'bg-slate-100 text-slate-800 hover:bg-slate-200'
    let hash = 0
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % categoryColorPalette.length
    return categoryColorPalette[index]
  }

  // Filter protocols
  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = searchQuery === '' ||
      protocol.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (protocol.description && protocol.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === 'all' || protocol.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Protocoles médicaux</h1>
          <p className="text-slate-500 mt-1">
            {filteredProtocols.length} protocole{filteredProtocols.length > 1 ? 's' : ''}
            {categoryFilter !== 'all' && ` (${categoryFilter})`}
          </p>
        </div>
        <Button onClick={() => navigate('/protocoles/new')}>
          <Plus className="h-4 w-4 mr-1" />
          Importer un protocole
        </Button>
      </div>

      {/* Filters */}
      {protocols.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher par nom ou description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-64">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : protocols.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucun protocole
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Importez vos premiers protocoles médicaux
            </p>
            <Button onClick={() => navigate('/protocoles/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Importer un protocole
            </Button>
          </CardContent>
        </Card>
      ) : filteredProtocols.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucun résultat
            </h3>
            <p className="text-sm text-slate-500">
              Aucun protocole ne correspond à votre recherche
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProtocols.map((protocol) => (
            <Card
              key={protocol.id}
              className="hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/protocoles/${protocol.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <FileText className="h-8 w-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  {protocol.isProcessed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-500" />
                  )}
                </div>

                <h3 className="font-medium text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {protocol.nom}
                </h3>

                <Badge className={getCategoryColor(protocol.category)}>
                  {protocol.category || 'Non catégorisé'}
                </Badge>

                {protocol.description && (
                  <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                    {protocol.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    {formatDate(protocol.createdAt)}
                  </span>
                  {protocol.pageCount && (
                    <span className="text-xs text-slate-400">
                      {protocol.pageCount} pages
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
