import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Textarea } from '../../components/ui/textarea'
import { ArrowLeft, Loader2, Edit2, Save, Check, Printer, FileSignature } from 'lucide-react'
import { formatDate } from '../../lib/utils'

export default function OrdonnanceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ordonnance, setOrdonnance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSigning, setIsSigning] = useState(false)

  useEffect(() => {
    fetchOrdonnance()
  }, [id])

  const fetchOrdonnance = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ordonnances/${id}`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setOrdonnance(data.document)
        setEditedContent(data.document.contenu)
      } else {
        navigate('/patients')
      }
    } catch (error) {
      console.error('Error fetching ordonnance:', error)
      navigate('/patients')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ordonnances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contenu: editedContent })
      })

      const data = await res.json()

      if (data.success) {
        setOrdonnance(data.document)
        setIsEditing(false)
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving ordonnance:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSign = async () => {
    if (!confirm('Êtes-vous sûr de vouloir signer cette ordonnance ? Une fois signée, elle ne pourra plus être modifiée.')) {
      return
    }

    setIsSigning(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ordonnances/${id}/sign`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await res.json()

      if (data.success) {
        setOrdonnance(data.document)
        alert('Ordonnance signée avec succès !')
      } else {
        alert(data.error || 'Erreur lors de la signature')
      }
    } catch (error) {
      console.error('Error signing ordonnance:', error)
      alert('Erreur lors de la signature')
    } finally {
      setIsSigning(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!ordonnance) return null

  return (
    <div className="space-y-6 pb-12">
      {/* Header - Ne pas imprimer */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/patients/${ordonnance.patientId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {ordonnance.titre}
            </h1>
            <p className="text-slate-500 mt-1">
              {ordonnance.patient?.firstName} {ordonnance.patient?.lastName}
              {ordonnance.signe && (
                <span className="ml-3 inline-flex items-center gap-1 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  Signée le {formatDate(ordonnance.dateSigne)}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!ordonnance.signe && !isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {isEditing && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditedContent(ordonnance.contenu)
                }}
                disabled={isSaving}
              >
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </>
          )}
          {!ordonnance.signe && !isEditing && (
            <Button onClick={handleSign} disabled={isSigning} className="bg-green-600 hover:bg-green-700">
              {isSigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signature...
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4 mr-2" />
                  Signer
                </>
              )}
            </Button>
          )}
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* Contenu de l'ordonnance */}
      <Card>
        <CardContent className="p-8">
          {isEditing ? (
            <div>
              <p className="text-sm text-slate-600 mb-3">
                Modifiez le contenu de l'ordonnance ci-dessous :
              </p>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={30}
                className="font-mono text-sm"
                placeholder="Contenu de l'ordonnance..."
              />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {ordonnance.contenu}
              </pre>
            </div>
          )}

          {ordonnance.signe && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Signé électroniquement</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Le {formatDate(ordonnance.dateSigne)} par Dr. {ordonnance.user?.firstName} {ordonnance.user?.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Document signé</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions print:hidden */}
      {!ordonnance.signe && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
          <p className="text-sm text-blue-800">
            💡 <strong>Conseil :</strong> Vous pouvez modifier l'ordonnance avant de la signer.
            Une fois signée, elle ne pourra plus être modifiée.
          </p>
        </div>
      )}
    </div>
  )
}
