import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { formatDate } from '../../lib/utils'

export default function SeanceEditPage() {
  const { parcoursId, seanceId } = useParams()
  const navigate = useNavigate()
  const [seance, setSeance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Formulaire séance 1 - Bilan initial
  const [bilanData, setBilanData] = useState({
    date: new Date().toISOString().split('T')[0],
    atcdMedicaux: '',
    atcdChirurgicaux: '',
    symptomes: '',
    testingScore: 0,
    testingNotes: '',
    examenClinique: '',
    objectifs: '',
    status: 'realisee',
  })

  // Formulaire séances 2-5 - Exercices
  const [seanceData, setSeanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    exercicesPerineaux: [] as any[],
    exercicesAbdominaux: [] as any[],
    testingControle: null as number | null,
    notesSeance: '',
    commentairePourProchaine: '',
    status: 'realisee',
  })

  useEffect(() => {
    fetchSeance()
  }, [seanceId])

  const fetchSeance = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reeducation/${parcoursId}/seances/${seanceId}`,
        { credentials: 'include' }
      )
      const data = await res.json()

      if (data.success) {
        setSeance(data.seance)

        // Pré-remplir les formulaires si la séance a déjà des données
        if (data.seance.numeroSeance === 1) {
          setBilanData({
            date: data.seance.date || new Date().toISOString().split('T')[0],
            atcdMedicaux: data.seance.atcdMedicaux || '',
            atcdChirurgicaux: data.seance.atcdChirurgicaux || '',
            symptomes: data.seance.symptomes || '',
            testingScore: data.seance.testingScore || 0,
            testingNotes: data.seance.testingNotes || '',
            examenClinique: data.seance.examenClinique || '',
            objectifs: data.seance.objectifs || '',
            status: data.seance.status || 'realisee',
          })
        } else {
          setSeanceData({
            date: data.seance.date || new Date().toISOString().split('T')[0],
            exercicesPerineaux: data.seance.exercicesPerineaux || [],
            exercicesAbdominaux: data.seance.exercicesAbdominaux || [],
            testingControle: data.seance.testingControle || null,
            notesSeance: data.seance.notesSeance || '',
            commentairePourProchaine: data.seance.commentairePourProchaine || '',
            status: data.seance.status || 'realisee',
          })
        }
      } else {
        navigate(`/reeducation/${parcoursId}`)
      }
    } catch (error) {
      console.error('Error fetching seance:', error)
      navigate(`/reeducation/${parcoursId}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const dataToSend = seance.numeroSeance === 1 ? bilanData : seanceData

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reeducation/${parcoursId}/seances/${seanceId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(dataToSend),
        }
      )

      const data = await res.json()

      if (data.success) {
        navigate(`/reeducation/${parcoursId}`)
      } else {
        alert(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving seance:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const addExercice = (type: 'perineaux' | 'abdominaux') => {
    const newExercice = { nom: '', series: 3, repetitions: 10, notes: '' }
    if (type === 'perineaux') {
      setSeanceData({
        ...seanceData,
        exercicesPerineaux: [...seanceData.exercicesPerineaux, newExercice],
      })
    } else {
      setSeanceData({
        ...seanceData,
        exercicesAbdominaux: [...seanceData.exercicesAbdominaux, newExercice],
      })
    }
  }

  const removeExercice = (type: 'perineaux' | 'abdominaux', index: number) => {
    if (type === 'perineaux') {
      setSeanceData({
        ...seanceData,
        exercicesPerineaux: seanceData.exercicesPerineaux.filter((_, i) => i !== index),
      })
    } else {
      setSeanceData({
        ...seanceData,
        exercicesAbdominaux: seanceData.exercicesAbdominaux.filter((_, i) => i !== index),
      })
    }
  }

  const updateExercice = (
    type: 'perineaux' | 'abdominaux',
    index: number,
    field: string,
    value: any
  ) => {
    const exercices =
      type === 'perineaux'
        ? [...seanceData.exercicesPerineaux]
        : [...seanceData.exercicesAbdominaux]

    exercices[index] = { ...exercices[index], [field]: value }

    if (type === 'perineaux') {
      setSeanceData({ ...seanceData, exercicesPerineaux: exercices })
    } else {
      setSeanceData({ ...seanceData, exercicesAbdominaux: exercices })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!seance) {
    return null
  }

  const isBilanInitial = seance.numeroSeance === 1

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/reeducation/${parcoursId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {isBilanInitial ? 'Séance 1 - Bilan initial' : `Séance ${seance.numeroSeance}`}
          </h1>
          <p className="text-slate-500 mt-1">
            {seance.patient?.firstName} {seance.patient?.lastName}
          </p>
        </div>
      </div>

      {/* FORMULAIRE BILAN INITIAL (Séance 1) */}
      {isBilanInitial ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Date de la séance</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={bilanData.date}
                onChange={(e) => setBilanData({ ...bilanData, date: e.target.value })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interrogatoire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Antécédents médicaux</Label>
                <Textarea
                  value={bilanData.atcdMedicaux}
                  onChange={(e) =>
                    setBilanData({ ...bilanData, atcdMedicaux: e.target.value })
                  }
                  rows={3}
                  placeholder="Pathologies, traitements en cours..."
                />
              </div>

              <div className="space-y-2">
                <Label>Antécédents chirurgicaux</Label>
                <Textarea
                  value={bilanData.atcdChirurgicaux}
                  onChange={(e) =>
                    setBilanData({ ...bilanData, atcdChirurgicaux: e.target.value })
                  }
                  rows={3}
                  placeholder="Chirurgies antérieures..."
                />
              </div>

              <div className="space-y-2">
                <Label>Symptômes / Motif de consultation</Label>
                <Textarea
                  value={bilanData.symptomes}
                  onChange={(e) =>
                    setBilanData({ ...bilanData, symptomes: e.target.value })
                  }
                  rows={3}
                  placeholder="Fuites urinaires, douleurs, inconfort..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testing périnéal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Score de testing (0-5)</Label>
                <Select
                  value={bilanData.testingScore.toString()}
                  onValueChange={(value) =>
                    setBilanData({ ...bilanData, testingScore: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 - Aucune contraction</SelectItem>
                    <SelectItem value="1">1 - Contraction très faible</SelectItem>
                    <SelectItem value="2">2 - Contraction faible</SelectItem>
                    <SelectItem value="3">3 - Contraction modérée</SelectItem>
                    <SelectItem value="4">4 - Contraction bonne</SelectItem>
                    <SelectItem value="5">5 - Contraction forte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes de testing</Label>
                <Textarea
                  value={bilanData.testingNotes}
                  onChange={(e) =>
                    setBilanData({ ...bilanData, testingNotes: e.target.value })
                  }
                  rows={3}
                  placeholder="Observations lors du testing..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Examen clinique</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={bilanData.examenClinique}
                onChange={(e) =>
                  setBilanData({ ...bilanData, examenClinique: e.target.value })
                }
                rows={4}
                placeholder="Observations, palpation, évaluation..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objectifs de rééducation</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={bilanData.objectifs}
                onChange={(e) =>
                  setBilanData({ ...bilanData, objectifs: e.target.value })
                }
                rows={4}
                placeholder="Objectifs personnalisés pour cette patiente..."
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        /* FORMULAIRE SÉANCES 2-5 (Exercices) */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Date de la séance</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={seanceData.date}
                onChange={(e) => setSeanceData({ ...seanceData, date: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Commentaire de la séance précédente */}
          {seance.numeroSeance > 2 && seance.parcours?.seances && (
            <>
              {(() => {
                const previousSeance = seance.parcours.seances.find(
                  (s: any) => s.numeroSeance === seance.numeroSeance - 1
                )
                if (previousSeance?.commentairePourProchaine) {
                  return (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-sm">Note de la séance précédente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-700">
                          {previousSeance.commentairePourProchaine}
                        </p>
                      </CardContent>
                    </Card>
                  )
                }
                return null
              })()}
            </>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exercices périnéaux</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addExercice('perineaux')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {seanceData.exercicesPerineaux.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Aucun exercice ajouté
                </p>
              ) : (
                seanceData.exercicesPerineaux.map((ex, i) => (
                  <div key={i} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <Label className="text-base">Exercice {i + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercice('perineaux', i)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Nom de l'exercice (ex: Contractions de Kegel)"
                      value={ex.nom}
                      onChange={(e) =>
                        updateExercice('perineaux', i, 'nom', e.target.value)
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Séries</Label>
                        <Input
                          type="number"
                          value={ex.series || ''}
                          onChange={(e) =>
                            updateExercice('perineaux', i, 'series', parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Répétitions</Label>
                        <Input
                          type="number"
                          value={ex.repetitions || ''}
                          onChange={(e) =>
                            updateExercice(
                              'perineaux',
                              i,
                              'repetitions',
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                    <Textarea
                      placeholder="Notes (optionnel)"
                      value={ex.notes || ''}
                      onChange={(e) =>
                        updateExercice('perineaux', i, 'notes', e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exercices abdominaux</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addExercice('abdominaux')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {seanceData.exercicesAbdominaux.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Aucun exercice ajouté
                </p>
              ) : (
                seanceData.exercicesAbdominaux.map((ex, i) => (
                  <div key={i} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <Label className="text-base">Exercice {i + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercice('abdominaux', i)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Nom de l'exercice (ex: Gainage ventral)"
                      value={ex.nom}
                      onChange={(e) =>
                        updateExercice('abdominaux', i, 'nom', e.target.value)
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Séries</Label>
                        <Input
                          type="number"
                          value={ex.series || ''}
                          onChange={(e) =>
                            updateExercice('abdominaux', i, 'series', parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Durée (sec)</Label>
                        <Input
                          placeholder="30"
                          value={ex.duree || ''}
                          onChange={(e) =>
                            updateExercice('abdominaux', i, 'duree', e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <Textarea
                      placeholder="Notes (optionnel)"
                      value={ex.notes || ''}
                      onChange={(e) =>
                        updateExercice('abdominaux', i, 'notes', e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testing de contrôle (optionnel)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Score de contrôle (0-5)</Label>
              <Select
                value={seanceData.testingControle?.toString() || 'none'}
                onValueChange={(value) =>
                  setSeanceData({
                    ...seanceData,
                    testingControle: value === 'none' ? null : parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Non évalué" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non évalué</SelectItem>
                  <SelectItem value="0">0 - Aucune contraction</SelectItem>
                  <SelectItem value="1">1 - Contraction très faible</SelectItem>
                  <SelectItem value="2">2 - Contraction faible</SelectItem>
                  <SelectItem value="3">3 - Contraction modérée</SelectItem>
                  <SelectItem value="4">4 - Contraction bonne</SelectItem>
                  <SelectItem value="5">5 - Contraction forte</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes de séance</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={seanceData.notesSeance}
                onChange={(e) =>
                  setSeanceData({ ...seanceData, notesSeance: e.target.value })
                }
                rows={4}
                placeholder="Observations, réactions de la patiente, difficultés rencontrées..."
              />
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">
                Commentaire pour la prochaine séance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={seanceData.commentairePourProchaine}
                onChange={(e) =>
                  setSeanceData({
                    ...seanceData,
                    commentairePourProchaine: e.target.value,
                  })
                }
                rows={3}
                placeholder="Points à surveiller, exercices à modifier, rappels pour la prochaine fois..."
              />
              <p className="text-xs text-slate-500 mt-2">
                Ce commentaire sera affiché au début de la prochaine séance
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-3 sticky bottom-0 bg-white py-4 border-t">
        <Button
          variant="outline"
          onClick={() => navigate(`/reeducation/${parcoursId}`)}
          disabled={isSaving}
        >
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
