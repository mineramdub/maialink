import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Combobox } from '../ui/combobox'
import { Plus, Loader2, Trash2, Edit2, AlertCircle, Upload, FileText } from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import { cn } from '../../lib/utils'

interface Resultat {
  id: string
  typeExamen: string
  description: string
  categorie: 'obstetrique' | 'gyneco'
  dateExamen?: string
  statut: string
  dateRecuperation?: string
  notes?: string
  fichierUrl?: string
  fichierNom?: string
  patient: {
    id: string
    firstName: string
    lastName: string
  }
  createdAt: string
}

export function ResultatsTab() {
  const [resultats, setResultats] = useState<Resultat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const emptyRow = {
    id: 'new',
    typeExamen: 'Biologie',
    description: '',
    categorie: 'gyneco' as 'obstetrique' | 'gyneco',
    dateExamen: new Date().toISOString().split('T')[0],
    statut: 'en_attente',
    notes: '',
    patient: { id: '', firstName: '', lastName: '' },
    patientId: '',
    createdAt: new Date().toISOString(),
  }

  const [newRow, setNewRow] = useState<any>(emptyRow)

  useEffect(() => {
    fetchResultats()
    fetchPatients()
  }, [])

  const fetchResultats = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/resultats/en-attente`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setResultats(data.resultats)
      }
    } catch (error) {
      console.error('Error fetching resultats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients?status=active`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const handleSaveNew = async () => {
    if (!newRow.patientId || !newRow.description) {
      alert('Veuillez remplir au moins la patiente et la description')
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/resultats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          patientId: newRow.patientId,
          typeExamen: newRow.typeExamen,
          description: newRow.description,
          categorie: newRow.categorie,
          dateExamen: newRow.dateExamen,
          notes: newRow.notes,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setIsAdding(false)
        setNewRow(emptyRow)
        fetchResultats()
      } else {
        alert(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating resultat:', error)
      alert('Erreur lors de la création')
    }
  }

  const handleUpdate = async (resultat: Resultat) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/resultats/${resultat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(resultat),
      })

      const data = await res.json()
      if (data.success) {
        setEditingId(null)
        fetchResultats()
      } else {
        alert(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating resultat:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const handleMarkAsRecovered = async (resultatId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/resultats/${resultatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          statut: 'recupere',
          dateRecuperation: new Date().toISOString().split('T')[0],
        }),
      })

      const data = await res.json()
      if (data.success) {
        fetchResultats()
      } else {
        alert(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error marking resultat as recovered:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const handleDelete = async (resultatId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce résultat ?')) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/resultats/${resultatId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await res.json()
      if (data.success) {
        fetchResultats()
      }
    } catch (error) {
      console.error('Error deleting resultat:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleUploadPDF = async (resultatId: string, patientId: string, file: File) => {
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('resultatId', resultatId)
      formData.append('patientId', patientId)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/resultats/upload-and-analyze`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        alert('PDF analysé et résultat ajouté au dossier patient!')
        fetchResultats()
      } else {
        alert(data.error || 'Erreur lors de l\'analyse du PDF')
      }
    } catch (error) {
      console.error('Error uploading PDF:', error)
      alert('Erreur lors de l\'upload du PDF')
    }
  }

  const handleToggleRecovered = async (resultatId: string, isRecovered: boolean) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suivi-gyneco/resultats/${resultatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          statut: isRecovered ? 'en_attente' : 'recupere',
          dateRecuperation: isRecovered ? null : new Date().toISOString().split('T')[0],
        }),
      })

      const data = await res.json()
      if (data.success) {
        fetchResultats()
      } else {
        alert(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error toggling recovered:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const getRowColor = (resultat: Resultat) => {
    const daysOld = resultat.dateExamen
      ? Math.floor((Date.now() - new Date(resultat.dateExamen).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    if (daysOld > 14) {
      // Très ancien (> 2 semaines)
      return 'bg-red-50 border-l-4 border-red-400'
    }
    if (daysOld > 7) {
      // Ancien (> 1 semaine)
      return 'bg-orange-50 border-l-4 border-orange-400'
    }
    if (resultat.categorie === 'obstetrique') {
      return 'bg-pink-50 border-l-4 border-pink-400'
    }
    return 'bg-blue-50 border-l-4 border-blue-400'
  }

  const getCategoryBadge = (categorie: 'obstetrique' | 'gyneco') => {
    if (categorie === 'obstetrique') {
      return (
        <Badge className="bg-pink-100 text-pink-800 border-pink-300">
          Obstétrique
        </Badge>
      )
    }
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
        Gynéco
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Résultats en attente</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Les couleurs indiquent : <span className="text-pink-600">Obstétrique</span> • <span className="text-blue-600">Gynéco</span> • <span className="text-orange-600">&gt;7j</span> • <span className="text-red-600">&gt;14j</span>
          </p>
        </div>
        <Button size="sm" onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle ligne
        </Button>
      </CardHeader>
      <CardContent>
        <div>
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left p-3 text-sm font-semibold text-slate-700" style={{width: '15%'}}>Patiente</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700" style={{width: '10%'}}>Type</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700" style={{width: '15%'}}>Description</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700" style={{width: '10%'}}>Catégorie</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700" style={{width: '10%'}}>Date</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700" style={{width: '15%'}}>PDF</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700" style={{width: '13%'}}>Notes</th>
                <th className="text-center p-3 text-sm font-semibold text-slate-700" style={{width: '7%'}}>Reçu</th>
                <th className="text-right p-3 text-sm font-semibold text-slate-700" style={{width: '5%'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* New row */}
              {isAdding && (
                <tr className="border-b bg-green-50">
                  <td className="p-2">
                    <Combobox
                      options={patients.map(p => ({
                        value: p.id,
                        label: `${p.firstName} ${p.lastName}`
                      }))}
                      value={newRow.patientId}
                      onValueChange={(v) => {
                        const patient = patients.find(p => p.id === v)
                        setNewRow({ ...newRow, patientId: v, patient })
                      }}
                      placeholder="Sélectionner une patiente"
                      searchPlaceholder="Rechercher une patiente..."
                      emptyText="Aucune patiente trouvée"
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <Select
                      value={newRow.typeExamen}
                      onValueChange={(v) => setNewRow({ ...newRow, typeExamen: v })}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Biologie">Biologie</SelectItem>
                        <SelectItem value="Échographie">Échographie</SelectItem>
                        <SelectItem value="Anatomopathologie">Anatomopath.</SelectItem>
                        <SelectItem value="Radiologie">Radiologie</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      value={newRow.description}
                      onChange={(e) => setNewRow({ ...newRow, description: e.target.value })}
                      placeholder="ex: NFS, TSH..."
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSaveNew()
                        }
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <Select
                      value={newRow.categorie}
                      onValueChange={(v) => setNewRow({ ...newRow, categorie: v })}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gyneco">Gynéco</SelectItem>
                        <SelectItem value="obstetrique">Obstétrique</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="date"
                      value={newRow.dateExamen}
                      onChange={(e) => setNewRow({ ...newRow, dateExamen: e.target.value })}
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSaveNew()
                        }
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <span className="text-xs text-slate-400">-</span>
                  </td>
                  <td className="p-2">
                    <Input
                      value={newRow.notes}
                      onChange={(e) => setNewRow({ ...newRow, notes: e.target.value })}
                      placeholder="Notes..."
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSaveNew()
                        }
                      }}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <span className="text-xs text-slate-400">-</span>
                  </td>
                  <td className="p-2 text-right">
                    <span className="text-xs text-slate-500 italic">Appuyez sur Entrée</span>
                  </td>
                </tr>
              )}

              {/* Existing rows */}
              {resultats.map((resultat) => (
                <tr key={resultat.id} className={cn('border-b transition-colors', getRowColor(resultat))}>
                  <td className="p-3 text-sm font-medium">
                    {resultat.patient.firstName} {resultat.patient.lastName}
                  </td>
                  <td className="p-3 text-sm">
                    {editingId === resultat.id ? (
                      <Select
                        value={resultat.typeExamen}
                        onValueChange={(v) => {
                          const updated = resultats.map(r => r.id === resultat.id ? { ...r, typeExamen: v } : r)
                          setResultats(updated)
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Biologie">Biologie</SelectItem>
                          <SelectItem value="Échographie">Échographie</SelectItem>
                          <SelectItem value="Anatomopathologie">Anatomopath.</SelectItem>
                          <SelectItem value="Radiologie">Radiologie</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      resultat.typeExamen
                    )}
                  </td>
                  <td className="p-3 text-sm">
                    {editingId === resultat.id ? (
                      <Input
                        value={resultat.description}
                        onChange={(e) => {
                          const updated = resultats.map(r => r.id === resultat.id ? { ...r, description: e.target.value } : r)
                          setResultats(updated)
                        }}
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleUpdate(resultat)
                          }
                        }}
                      />
                    ) : (
                      resultat.description
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === resultat.id ? (
                      <Select
                        value={resultat.categorie}
                        onValueChange={(v: any) => {
                          const updated = resultats.map(r => r.id === resultat.id ? { ...r, categorie: v } : r)
                          setResultats(updated)
                        }}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gyneco">Gynéco</SelectItem>
                          <SelectItem value="obstetrique">Obstétrique</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getCategoryBadge(resultat.categorie)
                    )}
                  </td>
                  <td className="p-3 text-sm">
                    {editingId === resultat.id ? (
                      <Input
                        type="date"
                        value={resultat.dateExamen || ''}
                        onChange={(e) => {
                          const updated = resultats.map(r => r.id === resultat.id ? { ...r, dateExamen: e.target.value } : r)
                          setResultats(updated)
                        }}
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleUpdate(resultat)
                          }
                        }}
                      />
                    ) : (
                      resultat.dateExamen && new Date(resultat.dateExamen).toLocaleDateString('fr-FR')
                    )}
                  </td>
                  <td className="p-3 text-sm">
                    {resultat.fichierUrl ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={resultat.fichierUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-xs truncate max-w-[100px]">{resultat.fichierNom || 'PDF'}</span>
                        </a>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleUploadPDF(resultat.id, resultat.patient.id, file)
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          asChild
                        >
                          <span>
                            <Upload className="h-3 w-3 mr-1" />
                            Upload
                          </span>
                        </Button>
                      </label>
                    )}
                  </td>
                  <td className="p-3 text-sm">
                    {editingId === resultat.id ? (
                      <Input
                        value={resultat.notes || ''}
                        onChange={(e) => {
                          const updated = resultats.map(r => r.id === resultat.id ? { ...r, notes: e.target.value } : r)
                          setResultats(updated)
                        }}
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleUpdate(resultat)
                          }
                        }}
                      />
                    ) : (
                      resultat.notes
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <Checkbox
                      checked={resultat.statut === 'recupere'}
                      onCheckedChange={(checked) => {
                        handleToggleRecovered(resultat.id, resultat.statut === 'recupere')
                      }}
                    />
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      {editingId === resultat.id ? (
                        <span className="text-xs text-slate-500 italic">Entrée</span>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(resultat.id)}
                            className="h-8 w-8 p-0"
                            title="Modifier"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(resultat.id)}
                            className="h-8 w-8 p-0"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {resultats.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-600">
                    Aucun résultat en attente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
