'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  FileText,
  Upload,
  Loader2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  FolderOpen,
  Plus,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'

interface Protocol {
  id: string
  nom: string
  description?: string
  category: string
  fileUrl: string
  fileName: string
  fileSize: number
  pageCount?: number
  isProcessed: boolean
  processingError?: string
  createdAt: string
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  grossesse: { label: 'Grossesse', color: 'bg-pink-100 text-pink-700' },
  post_partum: { label: 'Post-partum', color: 'bg-purple-100 text-purple-700' },
  gynecologie: { label: 'Gynecologie', color: 'bg-blue-100 text-blue-700' },
  reeducation: { label: 'Reeducation', color: 'bg-green-100 text-green-700' },
  pediatrie: { label: 'Pediatrie', color: 'bg-amber-100 text-amber-700' },
  autre: { label: 'Autre', color: 'bg-slate-100 text-slate-700' },
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function ProtocolesPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    category: 'autre',
    file: null as File | null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProtocols()
  }, [])

  const fetchProtocols = async () => {
    try {
      const res = await fetch('/api/protocols')
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        file,
        nom: formData.nom || file.name.replace('.pdf', ''),
      })
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file) return

    setIsUploading(true)
    try {
      const data = new FormData()
      data.append('file', formData.file)
      data.append('nom', formData.nom)
      data.append('description', formData.description)
      data.append('category', formData.category)

      const res = await fetch('/api/protocols', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()
      if (result.success) {
        setProtocols([result.protocol, ...protocols])
        setFormData({ nom: '', description: '', category: 'autre', file: null })
        setIsDialogOpen(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      console.error('Error uploading protocol:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce protocole ? Cette action est irreversible.')) return

    try {
      const res = await fetch(`/api/protocols/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProtocols(protocols.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting protocol:', error)
    }
  }

  const handleReprocess = async (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id))

    try {
      const res = await fetch(`/api/protocols/${id}/process`, { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        // Mettre à jour le protocole dans la liste
        setProtocols(protocols.map(p =>
          p.id === id ? { ...p, isProcessed: true, processingError: undefined } : p
        ))
      } else {
        setProtocols(protocols.map(p =>
          p.id === id ? { ...p, processingError: data.error } : p
        ))
      }
    } catch (error) {
      console.error('Error reprocessing protocol:', error)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const filteredProtocols = selectedCategory === 'all'
    ? protocols
    : protocols.filter(p => p.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Protocoles</h1>
          <p className="text-slate-500 mt-1">
            Importez vos protocoles PDF et posez vos questions a l'IA
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Importer un protocole
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Importer un protocole PDF</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label>Fichier PDF *</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {formData.file ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div className="text-left">
                        <p className="font-medium text-sm">{formData.file.name}</p>
                        <p className="text-xs text-slate-500">
                          {formatFileSize(formData.file.size)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">
                        Cliquez ou glissez un fichier PDF
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">Nom du protocole *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Protocole HTA grossesse"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Categorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([value, { label }]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Decrivez brievement le contenu..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={!formData.file || !formData.nom || isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Importer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          Tous ({protocols.length})
        </Button>
        {Object.entries(CATEGORY_LABELS).map(([value, { label }]) => {
          const count = protocols.filter(p => p.category === value).length
          if (count === 0) return null
          return (
            <Button
              key={value}
              variant={selectedCategory === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(value)}
            >
              {label} ({count})
            </Button>
          )
        })}
      </div>

      {/* Liste des protocoles */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : protocols.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucun protocole
            </h3>
            <p className="text-sm text-slate-500 mb-4 text-center max-w-md">
              Importez vos protocoles PDF pour pouvoir poser des questions a l'IA
              et obtenir des reponses basees sur vos documents.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Importer un protocole
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProtocols.map((protocol) => {
            const categoryInfo = CATEGORY_LABELS[protocol.category] || CATEGORY_LABELS.autre

            return (
              <Card key={protocol.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base line-clamp-1">
                          {protocol.nom}
                        </CardTitle>
                        <Badge className={`${categoryInfo.color} text-xs`}>
                          {categoryInfo.label}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-600"
                      onClick={() => handleDelete(protocol.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {protocol.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {protocol.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatFileSize(protocol.fileSize)}</span>
                    {protocol.pageCount && (
                      <span>{protocol.pageCount} pages</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {protocol.isProcessed ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Pret pour l'IA
                      </span>
                    ) : protocol.processingError ? (
                      <span className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        Erreur
                      </span>
                    ) : processingIds.has(protocol.id) ? (
                      <span className="flex items-center gap-1 text-xs text-blue-600">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Traitement...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <Clock className="h-3 w-3" />
                        En attente
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      {!protocol.isProcessed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 hover:text-blue-700"
                          onClick={() => handleReprocess(protocol.id)}
                          disabled={processingIds.has(protocol.id)}
                        >
                          {processingIds.has(protocol.id) ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Traiter
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => window.open(protocol.fileUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
