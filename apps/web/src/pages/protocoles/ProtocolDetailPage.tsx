import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import {
  ArrowLeft,
  FileText,
  Calendar,
  HardDrive,
  Layers,
  BookOpen,
  BarChart3,
  ExternalLink,
  RefreshCw,
  Loader2,
  CheckCircle,
  Clock,
  Search,
  Trash2,
  AlertCircle
} from 'lucide-react'
import { formatDate } from '../../lib/utils'

interface ProtocolChunk {
  id: string
  content: string
  pageNumber: number
  chunkIndex: number
}

interface Protocol {
  id: string
  nom: string
  description: string | null
  category: string
  fileUrl: string
  fileName: string
  fileSize: number
  pageCount: number | null
  isProcessed: boolean
  processingError: string | null
  createdAt: string
  updatedAt: string
  chunksCount: number
  chunks: ProtocolChunk[]
  processingStatus: {
    status: string
    progress: Array<{ step: string; progress: number; total: number; message: string }>
  } | null
}

export default function ProtocolDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [protocol, setProtocol] = useState<Protocol | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isReanalyzing, setIsReanalyzing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch protocol details
  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/protocols/${id}`, {
          credentials: 'include',
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Erreur lors du chargement')
        }

        setProtocol(data.protocol)
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProtocol()
    }
  }, [id])

  // Poll for processing status if not processed
  useEffect(() => {
    if (!protocol || protocol.isProcessed) return

    const pollStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/protocols/${id}/status`, {
          credentials: 'include',
        })
        const data = await response.json()

        if (data.success && data.status === 'completed') {
          // Refresh protocol data
          const protocolResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/protocols/${id}`, {
            credentials: 'include',
          })
          const protocolData = await protocolResponse.json()
          if (protocolData.success) {
            setProtocol(protocolData.protocol)
          }
        } else if (data.success && data.status === 'processing') {
          // Update processing status
          setProtocol(prev => prev ? { ...prev, processingStatus: data } : prev)
        }
      } catch (err) {
        console.error('Status poll error:', err)
      }
    }

    const interval = setInterval(pollStatus, 2000)
    return () => clearInterval(interval)
  }, [id, protocol?.isProcessed])

  // Re-analyze with Gemini
  const handleReanalyze = async () => {
    if (!protocol) return

    setIsReanalyzing(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/protocols/${id}/reanalyze`, {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setProtocol(prev => prev ? {
          ...prev,
          category: data.analysis.category,
          description: data.analysis.description,
        } : prev)
      } else {
        alert('Erreur: ' + (data.error || 'Erreur inconnue'))
      }
    } catch (err) {
      console.error('Reanalyze error:', err)
      alert('Erreur lors de la ré-analyse')
    } finally {
      setIsReanalyzing(false)
    }
  }

  // Delete protocol
  const handleDelete = async () => {
    if (!protocol) return
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce protocole ?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/protocols/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        navigate('/protocoles')
      } else {
        alert('Erreur: ' + (data.error || 'Erreur inconnue'))
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Erreur lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  // Open PDF
  const openPdf = (page?: number) => {
    if (!protocol) return
    let url = `${import.meta.env.VITE_API_URL}${protocol.fileUrl}`
    if (page) {
      url += `#page=${page}`
    }
    window.open(url, '_blank')
  }

  // Filter chunks by search
  const filteredChunks = protocol?.chunks.filter(chunk =>
    searchQuery === '' || chunk.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // Color palette for categories (deterministic based on string hash)
  const categoryColorPalette = [
    'bg-pink-100 text-pink-800',
    'bg-purple-100 text-purple-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-orange-100 text-orange-800',
    'bg-teal-100 text-teal-800',
    'bg-indigo-100 text-indigo-800',
    'bg-rose-100 text-rose-800',
    'bg-cyan-100 text-cyan-800',
  ]

  // Get color for a category based on its string hash
  const getCategoryColor = (category: string): string => {
    if (!category) return 'bg-slate-100 text-slate-800'
    let hash = 0
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % categoryColorPalette.length
    return categoryColorPalette[index]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (error || !protocol) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              {error || 'Protocole non trouvé'}
            </h3>
            <Button variant="outline" onClick={() => navigate('/protocoles')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux protocoles
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" onClick={() => navigate('/protocoles')} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold text-slate-900">{protocol.nom}</h1>
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(protocol.category)}>
              {protocol.category || 'Non catégorisé'}
            </Badge>
            {protocol.isProcessed ? (
              <Badge variant="outline" className="text-green-600 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Traité
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                <Clock className="h-3 w-3 mr-1" />
                En attente
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReanalyze} disabled={isReanalyzing}>
            {isReanalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Ré-analyser IA
          </Button>
          <Button onClick={() => openPdf()}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir PDF
          </Button>
        </div>
      </div>

      {/* Processing status */}
      {!protocol.isProcessed && protocol.processingStatus && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-medium text-blue-900">Traitement en cours</span>
            </div>
            {protocol.processingStatus.progress.length > 0 && (
              <>
                <p className="text-sm text-blue-700 mb-2">
                  {protocol.processingStatus.progress[protocol.processingStatus.progress.length - 1].message}
                </p>
                <Progress
                  value={
                    (protocol.processingStatus.progress[protocol.processingStatus.progress.length - 1].progress /
                      protocol.processingStatus.progress[protocol.processingStatus.progress.length - 1].total) * 100
                  }
                  className="h-2"
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        {/* Tab: Info */}
        <TabsContent value="info">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Nom</label>
                  <p className="text-slate-900">{protocol.nom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Description</label>
                  <p className="text-slate-900">{protocol.description || 'Aucune description'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Catégorie</label>
                  <p>
                    <Badge className={getCategoryColor(protocol.category)}>
                      {protocol.category || 'Non catégorisé'}
                    </Badge>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fichier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-blue-500" />
                  <div>
                    <p className="font-medium text-slate-900">{protocol.fileName}</p>
                    <p className="text-sm text-slate-500">
                      {protocol.fileSize > 0 ? `${(protocol.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Taille inconnue'}
                    </p>
                  </div>
                </div>
                {protocol.pageCount && (
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span>{protocol.pageCount} pages</span>
                  </div>
                )}
                <Button variant="outline" className="w-full" onClick={() => openPdf()}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir le PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Créé le</p>
                    <p className="text-slate-900">{formatDate(protocol.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Modifié le</p>
                    <p className="text-slate-900">{formatDate(protocol.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base text-red-600">Zone de danger</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  La suppression est irréversible et effacera le protocole ainsi que toutes ses données.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Supprimer le protocole
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Content */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Contenu extrait</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher dans le contenu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {protocol.chunks.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Layers className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Aucun contenu extrait</p>
                  <p className="text-sm">Le protocole doit être traité pour extraire le contenu</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredChunks.length === 0 ? (
                    <p className="text-center py-8 text-slate-500">
                      Aucun résultat pour "{searchQuery}"
                    </p>
                  ) : (
                    filteredChunks.map((chunk) => (
                      <div
                        key={chunk.id}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            Chunk #{chunk.chunkIndex + 1}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openPdf(chunk.pageNumber)}
                            className="text-xs"
                          >
                            Page {chunk.pageNumber}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-4">
                          {chunk.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Stats */}
        <TabsContent value="stats">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Layers className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{protocol.chunksCount}</p>
                    <p className="text-sm text-slate-500">Chunks créés</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{protocol.pageCount || '-'}</p>
                    <p className="text-sm text-slate-500">Pages</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <HardDrive className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {protocol.fileSize > 0 ? `${(protocol.fileSize / 1024 / 1024).toFixed(1)}` : '-'}
                    </p>
                    <p className="text-sm text-slate-500">MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">État du traitement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {protocol.isProcessed ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium text-green-700">Traitement terminé</p>
                      <p className="text-sm text-slate-500">
                        Le protocole est prêt à être utilisé pour les recherches
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="font-medium text-orange-700">En attente de traitement</p>
                      <p className="text-sm text-slate-500">
                        Le protocole n'a pas encore été traité pour la recherche sémantique
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
