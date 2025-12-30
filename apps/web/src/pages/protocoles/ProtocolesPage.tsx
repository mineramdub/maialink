import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Plus, BookOpen, Loader2, Upload, FileText, CheckCircle, Clock } from 'lucide-react'
import { formatDate } from '../../lib/utils'

export default function ProtocolesPage() {
  const [protocols, setProtocols] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/protocols`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setProtocols([data.protocol, ...protocols])
        setShowUpload(false)
        form.reset()
        
        // Lancer le traitement
        fetch(`${import.meta.env.VITE_API_URL}/api/protocols/${data.protocol.id}/process`, {
          method: 'POST',
          credentials: 'include'
        }).catch(console.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Protocoles médicaux</h1>
          <p className="text-slate-500 mt-1">
            {protocols.length} protocole{protocols.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Plus className="h-4 w-4 mr-1" />
          Importer un protocole
        </Button>
      </div>

      {showUpload && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du protocole *</Label>
                <Input id="nom" name="nom" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grossesse">Grossesse</SelectItem>
                    <SelectItem value="post_partum">Post-partum</SelectItem>
                    <SelectItem value="gynecologie">Gynécologie</SelectItem>
                    <SelectItem value="reeducation">Rééducation</SelectItem>
                    <SelectItem value="pediatrie">Pédiatrie</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Fichier PDF *</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Upload...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Importer
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUpload(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {protocols.map((protocol) => (
            <Card key={protocol.id} className="hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  {protocol.isProcessed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-500" />
                  )}
                </div>

                <h3 className="font-medium text-slate-900 mb-1">
                  {protocol.nom}
                </h3>

                <Badge variant="secondary" className="mb-2">
                  {protocol.category}
                </Badge>

                {protocol.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {protocol.description}
                  </p>
                )}

                <div className="text-xs text-slate-400">
                  Importé le {formatDate(protocol.createdAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
