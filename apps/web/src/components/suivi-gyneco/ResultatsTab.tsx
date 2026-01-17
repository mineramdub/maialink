import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Plus, Loader2, CheckCircle2, Trash2, Edit2, Save, X, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Resultat {
  id: string
  typeExamen: string
  description: string
  categorie: 'obstetrique' | 'gyneco'
  dateExamen?: string
  laboratoire?: string
  statut: string
  dateRecuperation?: string
  notes?: string
  patient: {
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
    laboratoire: '',
    statut: 'en_attente',
    notes: '',
    patient: { firstName: '', lastName: '' },
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
          laboratoire: newRow.laboratoire,
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left p-3 text-sm font-semibold text-slate-700 w-40">Patiente</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700 w-32">Type</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700 w-48">Description</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700 w-28">Catégorie</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700 w-32">Date</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700 w-32">Laboratoire</th>
                <th className="text-left p-3 text-sm font-semibold text-slate-700 w-48">Notes</th>
                <th className="text-right p-3 text-sm font-semibold text-slate-700 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* New row */}
              {isAdding && (
                <tr className="border-b bg-green-50">
                  <td className="p-2">
                    <Select
                      value={newRow.patientId}
                      onValueChange={(v) => {
                        const patient = patients.find(p => p.id === v)
                        setNewRow({ ...newRow, patientId: v, patient })
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.firstName} {p.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={newRow.laboratoire}
                      onChange={(e) => setNewRow({ ...newRow, laboratoire: e.target.value })}
                      placeholder="Laboratoire"
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={newRow.notes}
                      onChange={(e) => setNewRow({ ...newRow, notes: e.target.value })}
                      placeholder="Notes..."
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={handleSaveNew} className="h-8 w-8 p-0">
                        <Save className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsAdding(false)
                          setNewRow(emptyRow)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
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
                      />
                    ) : (
                      resultat.dateExamen && new Date(resultat.dateExamen).toLocaleDateString('fr-FR')
                    )}
                  </td>
                  <td className="p-3 text-sm">
                    {editingId === resultat.id ? (
                      <Input
                        value={resultat.laboratoire || ''}
                        onChange={(e) => {
                          const updated = resultats.map(r => r.id === resultat.id ? { ...r, laboratoire: e.target.value } : r)
                          setResultats(updated)
                        }}
                        className="h-8 text-sm"
                      />
                    ) : (
                      resultat.laboratoire
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
                      />
                    ) : (
                      resultat.notes
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      {editingId === resultat.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              handleUpdate(resultat)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Save className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(null)
                              fetchResultats()
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
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
                            onClick={() => handleMarkAsRecovered(resultat.id)}
                            className="h-8 w-8 p-0"
                            title="Marquer récupéré"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
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
                  <td colSpan={8} className="text-center py-12 text-slate-600">
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
