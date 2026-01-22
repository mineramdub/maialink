import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Plus,
  Loader2,
  FileText,
  Download,
  Trash2,
  Upload,
  File,
} from 'lucide-react'
import { formatDate } from '../lib/utils'

interface PatientDocumentsProps {
  patientId: string
}

export function PatientDocuments({ patientId }: PatientDocumentsProps) {
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadData, setUploadData] = useState({
    title: '',
    notes: '',
  })

  useEffect(() => {
    fetchDocuments()
  }, [patientId])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/patient-documents/${patientId}`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success) {
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Pré-remplir le titre avec le nom du fichier
      if (!uploadData.title) {
        setUploadData({ ...uploadData, title: file.name })
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', uploadData.title || selectedFile.name)
      if (uploadData.notes) {
        formData.append('notes', uploadData.notes)
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/patient-documents/${patientId}/upload`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      )

      const data = await res.json()

      if (data.success) {
        setIsUploadOpen(false)
        setSelectedFile(null)
        setUploadData({ title: '', notes: '' })
        fetchDocuments()
      } else {
        alert(data.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Erreur lors de l\'upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (documentId: string) => {
    try {
      window.open(
        `${import.meta.env.VITE_API_URL}/api/patient-documents/${patientId}/download/${documentId}`,
        '_blank'
      )
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Erreur lors du téléchargement')
    }
  }

  const handleDelete = async (documentId: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      return
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/patient-documents/${patientId}/${documentId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await res.json()

      if (data.success) {
        fetchDocuments()
      } else {
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />
    }
    if (mimeType?.includes('image')) {
      return <File className="h-5 w-5 text-blue-500" />
    }
    return <File className="h-5 w-5 text-slate-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents</CardTitle>
          <Button size="sm" onClick={() => setIsUploadOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un document
          </Button>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(doc.mimeType)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{doc.title}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatDate(doc.createdAt)} • {formatFileSize(doc.fileSize || 0)}
                      </div>
                      {doc.notes && (
                        <div className="text-xs text-slate-600 mt-1 line-clamp-1">
                          {doc.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doc.id, doc.title)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">Aucun document</p>
              <Button size="sm" onClick={() => setIsUploadOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le premier document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'upload */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un document</DialogTitle>
            <DialogDescription>
              Uploadez un PDF, image ou autre document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fichier *</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              {selectedFile && (
                <div className="text-xs text-slate-500">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                value={uploadData.title}
                onChange={(e) =>
                  setUploadData({ ...uploadData, title: e.target.value })
                }
                placeholder="Ex: Résultats échographie T1"
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (optionnel)</Label>
              <Textarea
                value={uploadData.notes}
                onChange={(e) =>
                  setUploadData({ ...uploadData, notes: e.target.value })
                }
                rows={3}
                placeholder="Ajoutez des notes..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadOpen(false)
                  setSelectedFile(null)
                  setUploadData({ title: '', notes: '' })
                }}
                disabled={isUploading}
              >
                Annuler
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
