import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  Plus,
  X,
  Highlighter,
  Calculator,
  Heart,
  Stethoscope,
  Scissors,
  Baby,
  Users
} from 'lucide-react'

interface AntecedentItem {
  text: string
  highlighted: boolean
}

interface Props {
  patientId: string
  data: {
    antecedentsMedicaux?: string[]
    antecedentsChirurgicaux?: string[]
    antecedentsGynecologiques?: any
    antecedentsFamiliaux?: string[]
    antecedentsObstetricaux?: string
    traitementEnCours?: string
  }
  onSave: (data: any) => Promise<void>
  compact?: boolean
}

export function AntecedentsEditor({ patientId, data, onSave, compact = false }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showScoreDialog, setShowScoreDialog] = useState(false)

  // Antécédents médicaux
  const [antecedentsMed, setAntecedentsMed] = useState<AntecedentItem[]>(
    (data.antecedentsMedicaux || []).map(text => ({ text, highlighted: text.startsWith('⭐ ') }))
  )
  const [newAntecedentMed, setNewAntecedentMed] = useState('')

  // Antécédents chirurgicaux
  const [antecedentsChir, setAntecedentsChir] = useState<AntecedentItem[]>(
    (data.antecedentsChirurgicaux || []).map(text => ({ text, highlighted: text.startsWith('⭐ ') }))
  )
  const [newAntecedentChir, setNewAntecedentChir] = useState('')

  // Antécédents gynécologiques
  const [antecedentsGyn, setAntecedentsGyn] = useState(data.antecedentsGynecologiques || {})

  // Antécédents familiaux
  const [antecedentsFam, setAntecedentsFam] = useState<AntecedentItem[]>(
    (data.antecedentsFamiliaux || []).map(text => ({ text, highlighted: text.startsWith('⭐ ') }))
  )
  const [newAntecedentFam, setNewAntecedentFam] = useState('')

  // Antécédents obstétricaux
  const [antecedentsObs, setAntecedentsObs] = useState(data.antecedentsObstetricaux || '')

  // Traitements en cours
  const [traitements, setTraitements] = useState(data.traitementEnCours || '')

  // Score cancer du sein
  const [scoreData, setScoreData] = useState({
    ageMenopause: '',
    agePremierEnfant: '',
    nbParentesPremierDegre: 0,
    nbParentesSecondDegre: 0,
    mutationBRCA: false,
  })

  const addAntecedent = (type: 'med' | 'chir' | 'fam', highlighted: boolean = false) => {
    let newText = ''
    let setter: any
    let current: AntecedentItem[]

    switch (type) {
      case 'med':
        newText = newAntecedentMed
        setter = setAntecedentsMed
        current = antecedentsMed
        setNewAntecedentMed('')
        break
      case 'chir':
        newText = newAntecedentChir
        setter = setAntecedentsChir
        current = antecedentsChir
        setNewAntecedentChir('')
        break
      case 'fam':
        newText = newAntecedentFam
        setter = setAntecedentsFam
        current = antecedentsFam
        setNewAntecedentFam('')
        break
    }

    if (newText.trim()) {
      setter([...current, { text: newText.trim(), highlighted }])
    }
  }

  const removeAntecedent = (type: 'med' | 'chir' | 'fam', index: number) => {
    switch (type) {
      case 'med':
        setAntecedentsMed(antecedentsMed.filter((_, i) => i !== index))
        break
      case 'chir':
        setAntecedentsChir(antecedentsChir.filter((_, i) => i !== index))
        break
      case 'fam':
        setAntecedentsFam(antecedentsFam.filter((_, i) => i !== index))
        break
    }
  }

  const toggleHighlight = (type: 'med' | 'chir' | 'fam', index: number) => {
    const toggle = (items: AntecedentItem[]) =>
      items.map((item, i) =>
        i === index ? { ...item, highlighted: !item.highlighted } : item
      )

    switch (type) {
      case 'med':
        setAntecedentsMed(toggle(antecedentsMed))
        break
      case 'chir':
        setAntecedentsChir(toggle(antecedentsChir))
        break
      case 'fam':
        setAntecedentsFam(toggle(antecedentsFam))
        break
    }
  }

  const calculateBreastCancerScore = () => {
    // Score d'Eisinger simplifié
    let score = 0
    const nbTotal = scoreData.nbParentesPremierDegre + scoreData.nbParentesSecondDegre * 0.5

    if (scoreData.mutationBRCA) score += 5
    if (nbTotal >= 3) score += 4
    else if (nbTotal >= 2) score += 3
    else if (nbTotal >= 1) score += 2

    if (scoreData.agePremierEnfant && parseInt(scoreData.agePremierEnfant) > 30) score += 1
    if (scoreData.ageMenopause && parseInt(scoreData.ageMenopause) > 55) score += 0.5

    return score
  }

  const getScoreInterpretation = (score: number) => {
    if (score >= 5) return { niveau: 'TRÈS ÉLEVÉ', color: 'bg-red-600', text: 'Consultation oncogénétique recommandée' }
    if (score >= 3) return { niveau: 'ÉLEVÉ', color: 'bg-orange-600', text: 'Dépistage renforcé recommandé' }
    if (score >= 2) return { niveau: 'MODÉRÉ', color: 'bg-yellow-600', text: 'Surveillance régulière' }
    return { niveau: 'FAIBLE', color: 'bg-green-600', text: 'Dépistage standard' }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Convertir les items en strings avec préfixe ⭐ si highlighted
      const formatItems = (items: AntecedentItem[]) =>
        items.map(item => item.highlighted ? `⭐ ${item.text}` : item.text)

      await onSave({
        antecedentsMedicaux: formatItems(antecedentsMed),
        antecedentsChirurgicaux: formatItems(antecedentsChir),
        antecedentsGynecologiques: antecedentsGyn,
        antecedentsFamiliaux: formatItems(antecedentsFam),
        antecedentsObstetricaux: antecedentsObs,
        traitementEnCours: traitements,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving antecedents:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const renderAntecedentsList = (
    items: AntecedentItem[],
    type: 'med' | 'chir' | 'fam',
    newValue: string,
    setNewValue: (val: string) => void,
    icon: any,
    title: string,
    color: string
  ) => (
    <Card className={`border-l-4 ${color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base">{title}</CardTitle>
          {type === 'fam' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowScoreDialog(true)}
              className="ml-auto"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Score Cancer Sein
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 p-2 rounded-lg ${
              item.highlighted ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-slate-50'
            }`}
          >
            <div className="flex-1 text-sm">
              {item.text.replace(/^⭐ /, '')}
            </div>
            {isEditing && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleHighlight(type, index)}
                  className="h-6 w-6 p-0"
                  title="Surligner"
                >
                  <Highlighter className={`h-3 w-3 ${item.highlighted ? 'text-yellow-600' : 'text-slate-400'}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAntecedent(type, index)}
                  className="h-6 w-6 p-0 text-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}

        {isEditing && (
          <div className="flex gap-2 mt-3">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Ajouter un antécédent..."
              onKeyPress={(e) => e.key === 'Enter' && addAntecedent(type)}
              className="text-sm"
            />
            <Button
              size="sm"
              onClick={() => addAntecedent(type)}
              disabled={!newValue.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!isEditing && items.length === 0 && (
          <p className="text-sm text-slate-400 italic">Aucun antécédent</p>
        )}
      </CardContent>
    </Card>
  )

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Résumé compact */}
          <div>
            <span className="text-slate-600 font-medium">ATCD médicaux:</span>
            <div className="text-slate-800 mt-1">
              {antecedentsMed.length > 0 ? (
                <div className="space-y-0.5">
                  {antecedentsMed.slice(0, 2).map((item, i) => (
                    <div key={i} className={item.highlighted ? 'font-medium text-yellow-700' : ''}>
                      • {item.text.replace(/^⭐ /, '')}
                    </div>
                  ))}
                  {antecedentsMed.length > 2 && (
                    <div className="text-slate-500">+{antecedentsMed.length - 2} autre(s)</div>
                  )}
                </div>
              ) : (
                <span className="text-slate-400 italic">Aucun</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-600 font-medium">ATCD chirurgicaux:</span>
            <div className="text-slate-800 mt-1">
              {antecedentsChir.length > 0 ? (
                <div className="space-y-0.5">
                  {antecedentsChir.slice(0, 2).map((item, i) => (
                    <div key={i} className={item.highlighted ? 'font-medium text-yellow-700' : ''}>
                      • {item.text.replace(/^⭐ /, '')}
                    </div>
                  ))}
                  {antecedentsChir.length > 2 && (
                    <div className="text-slate-500">+{antecedentsChir.length - 2} autre(s)</div>
                  )}
                </div>
              ) : (
                <span className="text-slate-400 italic">Aucun</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-600 font-medium">ATCD familiaux:</span>
            <div className="text-slate-800 mt-1">
              {antecedentsFam.length > 0 ? (
                <div className="space-y-0.5">
                  {antecedentsFam.slice(0, 2).map((item, i) => (
                    <div key={i} className={item.highlighted ? 'font-medium text-yellow-700' : ''}>
                      • {item.text.replace(/^⭐ /, '')}
                    </div>
                  ))}
                  {antecedentsFam.length > 2 && (
                    <div className="text-slate-500">+{antecedentsFam.length - 2} autre(s)</div>
                  )}
                </div>
              ) : (
                <span className="text-slate-400 italic">Aucun</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-600 font-medium">Traitements:</span>
            <div className="text-slate-800 mt-1">
              {traitements ? (
                <div className="line-clamp-2">{traitements}</div>
              ) : (
                <span className="text-slate-400 italic">Aucun</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Antécédents & Traitements</h3>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
              Annuler
            </Button>
            <Button onClick={handleSave} size="sm" disabled={isSaving}>
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Antécédents Médicaux */}
        {renderAntecedentsList(
          antecedentsMed,
          'med',
          newAntecedentMed,
          setNewAntecedentMed,
          <Heart className="h-5 w-5 text-red-600" />,
          'Antécédents Médicaux',
          'border-l-red-500'
        )}

        {/* Antécédents Chirurgicaux */}
        {renderAntecedentsList(
          antecedentsChir,
          'chir',
          newAntecedentChir,
          setNewAntecedentChir,
          <Scissors className="h-5 w-5 text-blue-600" />,
          'Antécédents Chirurgicaux',
          'border-l-blue-500'
        )}

        {/* Antécédents Gynécologiques */}
        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-pink-600" />
              <CardTitle className="text-base">Antécédents Gynécologiques</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isEditing ? (
              <>
                <div>
                  <Label className="text-xs">Ménarches (âge)</Label>
                  <Input
                    type="number"
                    value={antecedentsGyn.dateReglesMenarches || ''}
                    onChange={(e) => setAntecedentsGyn({ ...antecedentsGyn, dateReglesMenarches: e.target.value })}
                    className="text-sm mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Durée cycle (j)</Label>
                    <Input
                      type="number"
                      value={antecedentsGyn.dureeCycle || ''}
                      onChange={(e) => setAntecedentsGyn({ ...antecedentsGyn, dureeCycle: e.target.value })}
                      className="text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Durée règles (j)</Label>
                    <Input
                      type="number"
                      value={antecedentsGyn.dureeRegles || ''}
                      onChange={(e) => setAntecedentsGyn({ ...antecedentsGyn, dureeRegles: e.target.value })}
                      className="text-sm mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Contraception actuelle</Label>
                  <Input
                    value={antecedentsGyn.contraception || ''}
                    onChange={(e) => setAntecedentsGyn({ ...antecedentsGyn, contraception: e.target.value })}
                    className="text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Dernier frottis</Label>
                  <Input
                    type="date"
                    value={antecedentsGyn.dateDernierFrottis || ''}
                    onChange={(e) => setAntecedentsGyn({ ...antecedentsGyn, dateDernierFrottis: e.target.value })}
                    className="text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Autres (pathologies, chirurgies...)</Label>
                  <Textarea
                    value={antecedentsGyn.autres || ''}
                    onChange={(e) => setAntecedentsGyn({ ...antecedentsGyn, autres: e.target.value })}
                    className="text-sm mt-1"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <div className="text-sm space-y-1">
                {antecedentsGyn.dateReglesMenarches && <div>Ménarches: {antecedentsGyn.dateReglesMenarches} ans</div>}
                {antecedentsGyn.dureeCycle && <div>Cycle: {antecedentsGyn.dureeCycle}j</div>}
                {antecedentsGyn.dureeRegles && <div>Règles: {antecedentsGyn.dureeRegles}j</div>}
                {antecedentsGyn.contraception && <div>Contraception: {antecedentsGyn.contraception}</div>}
                {antecedentsGyn.dateDernierFrottis && <div>Dernier frottis: {antecedentsGyn.dateDernierFrottis}</div>}
                {antecedentsGyn.autres && <div className="mt-2">{antecedentsGyn.autres}</div>}
                {!antecedentsGyn.dateReglesMenarches && !antecedentsGyn.contraception && (
                  <p className="text-slate-400 italic">Aucune donnée</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Antécédents Familiaux */}
        {renderAntecedentsList(
          antecedentsFam,
          'fam',
          newAntecedentFam,
          setNewAntecedentFam,
          <Users className="h-5 w-5 text-purple-600" />,
          'Antécédents Familiaux',
          'border-l-purple-500'
        )}

        {/* Antécédents Obstétricaux */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Antécédents Obstétricaux</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={antecedentsObs}
                onChange={(e) => setAntecedentsObs(e.target.value)}
                placeholder="Détails des grossesses précédentes, accouchements, complications..."
                rows={4}
                className="text-sm"
              />
            ) : (
              <div className="text-sm whitespace-pre-wrap">
                {antecedentsObs || <span className="text-slate-400 italic">Aucun antécédent obstétrical</span>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Traitements en cours */}
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Traitements en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={traitements}
                onChange={(e) => setTraitements(e.target.value)}
                placeholder="Liste des médicaments et posologie..."
                rows={4}
                className="text-sm"
              />
            ) : (
              <div className="text-sm whitespace-pre-wrap">
                {traitements || <span className="text-slate-400 italic">Aucun traitement</span>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Score Cancer du Sein */}
      <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Score de risque Cancer du Sein</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre de parentes 1er degré atteintes</Label>
              <Input
                type="number"
                value={scoreData.nbParentesPremierDegre}
                onChange={(e) => setScoreData({ ...scoreData, nbParentesPremierDegre: parseInt(e.target.value) || 0 })}
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">Mère, sœur, fille</p>
            </div>
            <div>
              <Label>Nombre de parentes 2ème degré atteintes</Label>
              <Input
                type="number"
                value={scoreData.nbParentesSecondDegre}
                onChange={(e) => setScoreData({ ...scoreData, nbParentesSecondDegre: parseInt(e.target.value) || 0 })}
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">Grand-mère, tante, nièce</p>
            </div>
            <div>
              <Label>Âge au premier enfant</Label>
              <Input
                type="number"
                value={scoreData.agePremierEnfant}
                onChange={(e) => setScoreData({ ...scoreData, agePremierEnfant: e.target.value })}
              />
            </div>
            <div>
              <Label>Âge à la ménopause</Label>
              <Input
                type="number"
                value={scoreData.ageMenopause}
                onChange={(e) => setScoreData({ ...scoreData, ageMenopause: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={scoreData.mutationBRCA}
                onChange={(e) => setScoreData({ ...scoreData, mutationBRCA: e.target.checked })}
                id="brca"
              />
              <Label htmlFor="brca">Mutation BRCA1/BRCA2 connue</Label>
            </div>

            <div className="pt-4 border-t">
              {(() => {
                const score = calculateBreastCancerScore()
                const interp = getScoreInterpretation(score)
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Score calculé:</span>
                      <span className="text-2xl font-bold">{score.toFixed(1)}</span>
                    </div>
                    <div className={`p-3 rounded-lg text-white ${interp.color}`}>
                      <div className="font-bold">{interp.niveau}</div>
                      <div className="text-sm mt-1">{interp.text}</div>
                    </div>
                  </div>
                )
              })()}
            </div>

            <Button onClick={() => setShowScoreDialog(false)} className="w-full">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
