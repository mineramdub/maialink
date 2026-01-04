import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

interface ExamenCliniqueAdapteProps {
  type: string
  motif?: string
  defaultValue?: string
  onChange: (text: string) => void
}

export function ExamenCliniqueAdapte({ type, motif, defaultValue, onChange }: ExamenCliniqueAdapteProps) {
  // Si un texte par défaut existe (template appliqué), on l'affiche en textarea simple
  if (defaultValue && defaultValue.trim().length > 50) {
    return (
      <div className="space-y-2">
        <Textarea
          value={defaultValue}
          onChange={(e) => onChange(e.target.value)}
          rows={15}
          className="font-mono text-sm"
        />
      </div>
    )
  }

  // Sinon, afficher le formulaire adapté au type
  switch (type) {
    case 'prenatale':
      return <ExamenPrenatale onChange={onChange} />
    case 'postnatale':
      return <ExamenPostnatale onChange={onChange} />
    case 'gyneco':
      return <ExamenGyneco motif={motif} onChange={onChange} />
    case 'reeducation':
      return <ExamenReeducation onChange={onChange} />
    case 'preparation':
      return <ExamenPreparation onChange={onChange} />
    case 'ivg':
      return <ExamenIVG onChange={onChange} />
    default:
      return <ExamenGenerique onChange={onChange} />
  }
}

// ========== EXAMEN PRÉNATAL ==========
function ExamenPrenatale({ onChange }: { onChange: (text: string) => void }) {
  const [data, setData] = useState({
    omf: '',
    col: '',
    presentation: '',
    bdc: '',
    mouvements: '',
    oedemes: '',
    varices: '',
    autre: ''
  })

  useEffect(() => {
    const text = generatePrenataleText(data)
    onChange(text)
  }, [data])

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <Label className="text-sm font-semibold">Examen obstétrical</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Hauteur utérine</Label>
              <Input
                placeholder="Ex: Conforme au terme"
                value={data.omf}
                onChange={(e) => updateField('omf', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">BDC</Label>
              <Input
                placeholder="Ex: Régulier, 140 bpm"
                value={data.bdc}
                onChange={(e) => updateField('bdc', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Col (si TV réalisé)</Label>
              <Select value={data.col} onValueChange={(v) => updateField('col', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long fermé postérieur">Long, fermé, postérieur</SelectItem>
                  <SelectItem value="mi-long fermé">Mi-long, fermé</SelectItem>
                  <SelectItem value="raccourci fermé">Raccourci, fermé</SelectItem>
                  <SelectItem value="raccourci perméable">Raccourci, perméable</SelectItem>
                  <SelectItem value="dilaté">Dilaté à [X] cm</SelectItem>
                  <SelectItem value="non fait">Non réalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Présentation</Label>
              <Select value={data.presentation} onValueChange={(v) => updateField('presentation', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="céphalique">Céphalique</SelectItem>
                  <SelectItem value="siège">Siège</SelectItem>
                  <SelectItem value="transverse">Transverse</SelectItem>
                  <SelectItem value="non déterminée">Non déterminée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Mouvements actifs fœtaux</Label>
            <Select value={data.mouvements} onValueChange={(v) => updateField('mouvements', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="présents perçus">Présents, bien perçus</SelectItem>
                <SelectItem value="diminués">Diminués</SelectItem>
                <SelectItem value="absents">Absents (URGENCE)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Œdèmes</Label>
              <Select value={data.oedemes} onValueChange={(v) => updateField('oedemes', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absents">Absents</SelectItem>
                  <SelectItem value="membres inférieurs">Membres inférieurs</SelectItem>
                  <SelectItem value="généralisés">Généralisés (visage, mains)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Varices</Label>
              <Select value={data.varices} onValueChange={(v) => updateField('varices', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absentes">Absentes</SelectItem>
                  <SelectItem value="débutantes">Débutantes</SelectItem>
                  <SelectItem value="importantes">Importantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Autres observations</Label>
            <Input
              placeholder="Ex: Cicatrice césarienne souple"
              value={data.autre}
              onChange={(e) => updateField('autre', e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function generatePrenataleText(data: any): string {
  const parts: string[] = ['EXAMEN OBSTÉTRICAL:']

  if (data.omf) parts.push(`- Hauteur utérine: ${data.omf}`)
  if (data.bdc) parts.push(`- BDC: ${data.bdc}`)
  if (data.presentation) parts.push(`- Présentation: ${data.presentation}`)
  if (data.col) parts.push(`- Col: ${data.col}`)
  if (data.mouvements) parts.push(`- MAF: ${data.mouvements}`)
  if (data.oedemes) parts.push(`- Œdèmes: ${data.oedemes}`)
  if (data.varices) parts.push(`- Varices: ${data.varices}`)
  if (data.autre) parts.push(`- ${data.autre}`)

  return parts.join('\n')
}

// ========== EXAMEN POSTNATAL ==========
function ExamenPostnatale({ onChange }: { onChange: (text: string) => void }) {
  const [data, setData] = useState({
    involution: '',
    lochies: '',
    perinee: '',
    cicatrice: '',
    seins: '',
    allaitement: '',
    autre: ''
  })

  useEffect(() => {
    const text = generatePostnataleText(data)
    onChange(text)
  }, [data])

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <Label className="text-sm font-semibold">Examen postnatal</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Involution utérine</Label>
              <Select value={data.involution} onValueChange={(v) => updateField('involution', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complète">Complète (non palpable)</SelectItem>
                  <SelectItem value="sous-ombilical">Utérus sous-ombilical</SelectItem>
                  <SelectItem value="ombilical">Utérus à l'ombilic</SelectItem>
                  <SelectItem value="sus-ombilical">Utérus sus-ombilical (retard)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Lochies</Label>
              <Select value={data.lochies} onValueChange={(v) => updateField('lochies', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normales">Normales, séro-sanglantes</SelectItem>
                  <SelectItem value="terminées">Terminées</SelectItem>
                  <SelectItem value="abondantes">Abondantes</SelectItem>
                  <SelectItem value="malodorantes">Malodorantes (infection)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Périnée / Cicatrice</Label>
              <Select value={data.perinee} onValueChange={(v) => updateField('perinee', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intact">Périnée intact</SelectItem>
                  <SelectItem value="cicatrisé">Cicatrice bien cicatrisée</SelectItem>
                  <SelectItem value="inflammatoire">Cicatrice inflammatoire</SelectItem>
                  <SelectItem value="desunie">Cicatrice désunie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Seins</Label>
              <Select value={data.seins} onValueChange={(v) => updateField('seins', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="souples">Souples</SelectItem>
                  <SelectItem value="tendus">Tendus (montée laiteuse)</SelectItem>
                  <SelectItem value="engorgés">Engorgés</SelectItem>
                  <SelectItem value="mastite">Mastite (rouge, douloureux, fièvre)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Allaitement</Label>
            <Select value={data.allaitement} onValueChange={(v) => updateField('allaitement', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maternel">Allaitement maternel exclusif</SelectItem>
                <SelectItem value="mixte">Allaitement mixte</SelectItem>
                <SelectItem value="artificiel">Allaitement artificiel</SelectItem>
                <SelectItem value="crevasses">AM avec crevasses</SelectItem>
                <SelectItem value="arreté">Allaitement arrêté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Cicatrice césarienne (si applicable)</Label>
            <Select value={data.cicatrice} onValueChange={(v) => updateField('cicatrice', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non applicable">Non applicable</SelectItem>
                <SelectItem value="souple">Souple, bien cicatrisée</SelectItem>
                <SelectItem value="indurée">Indurée</SelectItem>
                <SelectItem value="douloureuse">Douloureuse</SelectItem>
                <SelectItem value="inflammatoire">Inflammatoire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Autres observations</Label>
            <Input
              placeholder="Ex: Diastasis des grands droits 2cm"
              value={data.autre}
              onChange={(e) => updateField('autre', e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function generatePostnataleText(data: any): string {
  const parts: string[] = ['EXAMEN POSTNATAL:']

  if (data.involution) parts.push(`- Involution utérine: ${data.involution}`)
  if (data.lochies) parts.push(`- Lochies: ${data.lochies}`)
  if (data.perinee) parts.push(`- Périnée: ${data.perinee}`)
  if (data.cicatrice && data.cicatrice !== 'non applicable') parts.push(`- Cicatrice césarienne: ${data.cicatrice}`)
  if (data.seins) parts.push(`- Seins: ${data.seins}`)
  if (data.allaitement) parts.push(`- Allaitement: ${data.allaitement}`)
  if (data.autre) parts.push(`- ${data.autre}`)

  return parts.join('\n')
}

// ========== EXAMEN GYNÉCOLOGIQUE ==========
function ExamenGyneco({ motif, onChange }: { motif?: string, onChange: (text: string) => void }) {
  const [data, setData] = useState({
    seins: '',
    adenopathies: '',
    vulve: '',
    speculum_col: '',
    speculum_leucorrhees: '',
    tv_uterus: '',
    tv_annexes: '',
    tv_mobilisation: '',
    autre: ''
  })

  useEffect(() => {
    const text = generateGynecoText(data)
    onChange(text)
  }, [data])

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <Label className="text-sm font-semibold">Examen des seins</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Inspection et palpation</Label>
              <Select value={data.seins} onValueChange={(v) => updateField('seins', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normaux">Seins symétriques, souples, pas de masse</SelectItem>
                  <SelectItem value="masse">Masse palpable</SelectItem>
                  <SelectItem value="ecoulement">Écoulement mamelonnaire</SelectItem>
                  <SelectItem value="retraction">Rétraction cutanée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Adénopathies axillaires</Label>
              <Select value={data.adenopathies} onValueChange={(v) => updateField('adenopathies', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absentes">Absentes</SelectItem>
                  <SelectItem value="présentes">Présentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <Label className="text-sm font-semibold">Examen gynécologique</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Vulve</Label>
            <Select value={data.vulve} onValueChange={(v) => updateField('vulve', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normale">Normale</SelectItem>
                <SelectItem value="inflammation">Inflammation/rougeur</SelectItem>
                <SelectItem value="lésions">Lésions (condylomes, herpès)</SelectItem>
                <SelectItem value="atrophie">Atrophie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Spéculum - Col</Label>
              <Select value={data.speculum_col} onValueChange={(v) => updateField('speculum_col', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rose sain">Rose, sain</SelectItem>
                  <SelectItem value="ectropion">Ectropion</SelectItem>
                  <SelectItem value="congestif">Congestif/rouge</SelectItem>
                  <SelectItem value="polype">Polype</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Leucorrhées</Label>
              <Select value={data.speculum_leucorrhees} onValueChange={(v) => updateField('speculum_leucorrhees', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physiologiques">Physiologiques (claires)</SelectItem>
                  <SelectItem value="absentes">Absentes</SelectItem>
                  <SelectItem value="blanches épaisses">Blanches épaisses (mycose)</SelectItem>
                  <SelectItem value="grisâtres">Grisâtres malodorantes (vaginose)</SelectItem>
                  <SelectItem value="verdâtres">Verdâtres (trichomonas/infection)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Toucher vaginal - Utérus</Label>
              <Select value={data.tv_uterus} onValueChange={(v) => updateField('tv_uterus', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVF mobile indolore">AVF, mobile, indolore</SelectItem>
                  <SelectItem value="RVF">RVF</SelectItem>
                  <SelectItem value="augmenté">Augmenté de volume</SelectItem>
                  <SelectItem value="fibrome">Fibrome palpable</SelectItem>
                  <SelectItem value="douloureux">Douloureux</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Annexes</Label>
              <Select value={data.tv_annexes} onValueChange={(v) => updateField('tv_annexes', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="libres">Libres, indolores</SelectItem>
                  <SelectItem value="masse">Masse latéro-utérine</SelectItem>
                  <SelectItem value="empâtement">Empâtement douloureux</SelectItem>
                  <SelectItem value="douloureuses">Douloureuses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Mobilisation utérine</Label>
            <Select value={data.tv_mobilisation} onValueChange={(v) => updateField('tv_mobilisation', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indolore">Indolore</SelectItem>
                <SelectItem value="douloureuse">Douloureuse (salpingite?)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Autres observations</Label>
            <Input
              placeholder="Ex: Prélèvement vaginal réalisé"
              value={data.autre}
              onChange={(e) => updateField('autre', e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function generateGynecoText(data: any): string {
  const parts: string[] = []

  if (data.seins || data.adenopathies) {
    parts.push('EXAMEN DES SEINS:')
    if (data.seins) parts.push(`- Inspection/palpation: ${data.seins}`)
    if (data.adenopathies) parts.push(`- Adénopathies axillaires: ${data.adenopathies}`)
    parts.push('')
  }

  parts.push('EXAMEN GYNÉCOLOGIQUE:')
  if (data.vulve) parts.push(`- Vulve: ${data.vulve}`)
  if (data.speculum_col) parts.push(`- Spéculum - Col: ${data.speculum_col}`)
  if (data.speculum_leucorrhees) parts.push(`- Leucorrhées: ${data.speculum_leucorrhees}`)
  if (data.tv_uterus) parts.push(`- TV - Utérus: ${data.tv_uterus}`)
  if (data.tv_annexes) parts.push(`- TV - Annexes: ${data.tv_annexes}`)
  if (data.tv_mobilisation) parts.push(`- Mobilisation utérine: ${data.tv_mobilisation}`)
  if (data.autre) parts.push(`- ${data.autre}`)

  return parts.join('\n')
}

// ========== EXAMEN RÉÉDUCATION ==========
function ExamenReeducation({ onChange }: { onChange: (text: string) => void }) {
  const [data, setData] = useState({
    testing: '',
    fuites_urinaires: '',
    fuites_anales: '',
    pesanteur: '',
    dyspareunie: '',
    cicatrice: '',
    diastasis: '',
    autre: ''
  })

  useEffect(() => {
    const text = generateReeducationText(data)
    onChange(text)
  }, [data])

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <Label className="text-sm font-semibold">Testing périnéal</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Testing (cotation /5)</Label>
            <Select value={data.testing} onValueChange={(v) => updateField('testing', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0/5">0/5 - Aucune contraction</SelectItem>
                <SelectItem value="1/5">1/5 - Frémissement</SelectItem>
                <SelectItem value="2/5">2/5 - Contraction faible</SelectItem>
                <SelectItem value="3/5">3/5 - Contraction modérée</SelectItem>
                <SelectItem value="4/5">4/5 - Contraction bonne</SelectItem>
                <SelectItem value="5/5">5/5 - Contraction forte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Fuites urinaires</Label>
              <Select value={data.fuites_urinaires} onValueChange={(v) => updateField('fuites_urinaires', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absentes">Absentes</SelectItem>
                  <SelectItem value="effort">À l'effort (toux, éternuement)</SelectItem>
                  <SelectItem value="impériosités">Par impériosités</SelectItem>
                  <SelectItem value="mixte">Mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Fuites anales</Label>
              <Select value={data.fuites_anales} onValueChange={(v) => updateField('fuites_anales', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absentes">Absentes</SelectItem>
                  <SelectItem value="gaz">Gaz uniquement</SelectItem>
                  <SelectItem value="selles liquides">Selles liquides</SelectItem>
                  <SelectItem value="selles solides">Selles solides (URGENT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Pesanteur pelvienne</Label>
              <Select value={data.pesanteur} onValueChange={(v) => updateField('pesanteur', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absente">Absente</SelectItem>
                  <SelectItem value="légère">Légère</SelectItem>
                  <SelectItem value="modérée">Modérée</SelectItem>
                  <SelectItem value="importante">Importante (prolapsus?)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Dyspareunie</Label>
              <Select value={data.dyspareunie} onValueChange={(v) => updateField('dyspareunie', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absente">Absente</SelectItem>
                  <SelectItem value="rapports non repris">Rapports non repris</SelectItem>
                  <SelectItem value="superficielle">Superficielle (entrée)</SelectItem>
                  <SelectItem value="profonde">Profonde</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Cicatrice épisiotomie/déchirure</Label>
            <Select value={data.cicatrice} onValueChange={(v) => updateField('cicatrice', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non applicable">Non applicable</SelectItem>
                <SelectItem value="bien cicatrisée">Bien cicatrisée, souple</SelectItem>
                <SelectItem value="indurée">Indurée</SelectItem>
                <SelectItem value="douloureuse">Douloureuse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Diastasis des grands droits</Label>
            <Input
              placeholder="Ex: 2cm"
              value={data.diastasis}
              onChange={(e) => updateField('diastasis', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Autres observations</Label>
            <Input
              placeholder="Ex: Réflexe à la toux absent"
              value={data.autre}
              onChange={(e) => updateField('autre', e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function generateReeducationText(data: any): string {
  const parts: string[] = ['BILAN PÉRINÉAL:']

  if (data.testing) parts.push(`- Testing périnéal: ${data.testing}`)
  if (data.fuites_urinaires) parts.push(`- Fuites urinaires: ${data.fuites_urinaires}`)
  if (data.fuites_anales && data.fuites_anales !== 'absentes') parts.push(`- Fuites anales: ${data.fuites_anales}`)
  if (data.pesanteur && data.pesanteur !== 'absente') parts.push(`- Pesanteur pelvienne: ${data.pesanteur}`)
  if (data.dyspareunie && data.dyspareunie !== 'absente') parts.push(`- Dyspareunie: ${data.dyspareunie}`)
  if (data.cicatrice && data.cicatrice !== 'non applicable') parts.push(`- Cicatrice: ${data.cicatrice}`)
  if (data.diastasis) parts.push(`- Diastasis: ${data.diastasis}`)
  if (data.autre) parts.push(`- ${data.autre}`)

  return parts.join('\n')
}

// ========== EXAMEN PRÉPARATION ==========
function ExamenPreparation({ onChange }: { onChange: (text: string) => void }) {
  const [data, setData] = useState({
    theme: '',
    participants: '',
    notions: '',
    exercices: ''
  })

  useEffect(() => {
    const text = generatePreparationText(data)
    onChange(text)
  }, [data])

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <Label className="text-sm font-semibold">Séance de préparation</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Thème abordé</Label>
            <Input
              placeholder="Ex: Travail et accouchement"
              value={data.theme}
              onChange={(e) => updateField('theme', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Participants</Label>
            <Select value={data.participants} onValueChange={(v) => updateField('participants', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seule">Mère seule</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="accompagnant">Avec accompagnant(e)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Notions abordées</Label>
            <Textarea
              rows={4}
              placeholder="Ex: Phases du travail, positions, gestion douleur..."
              value={data.notions}
              onChange={(e) => updateField('notions', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Exercices pratiques</Label>
            <Textarea
              rows={3}
              placeholder="Ex: Respiration, relaxation, positions sur ballon..."
              value={data.exercices}
              onChange={(e) => updateField('exercices', e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function generatePreparationText(data: any): string {
  const parts: string[] = []

  if (data.theme) parts.push(`THÈME: ${data.theme}`)
  if (data.participants) parts.push(`Participants: ${data.participants}`)

  if (data.notions) {
    parts.push('')
    parts.push('NOTIONS ABORDÉES:')
    parts.push(data.notions)
  }

  if (data.exercices) {
    parts.push('')
    parts.push('EXERCICES PRATIQUES:')
    parts.push(data.exercices)
  }

  return parts.join('\n')
}

// ========== EXAMEN IVG ==========
function ExamenIVG({ onChange }: { onChange: (text: string) => void }) {
  const [data, setData] = useState({
    terme_echo: '',
    col: '',
    uterus: '',
    methode: '',
    decision: '',
    soutien: '',
    autre: ''
  })

  useEffect(() => {
    const text = generateIVGText(data)
    onChange(text)
  }, [data])

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <Label className="text-sm font-semibold">Examen et datation</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Terme échographique</Label>
            <Input
              placeholder="Ex: 6 SA + 3j"
              value={data.terme_echo}
              onChange={(e) => updateField('terme_echo', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Col au spéculum</Label>
              <Select value={data.col} onValueChange={(v) => updateField('col', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fermé">Fermé</SelectItem>
                  <SelectItem value="entrouvert">Entrouvert</SelectItem>
                  <SelectItem value="saignant">Saignant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Utérus au TV</Label>
              <Input
                placeholder="Ex: Augmenté, cohérent avec terme"
                value={data.uterus}
                onChange={(e) => updateField('uterus', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Méthode envisagée</Label>
            <Select value={data.methode} onValueChange={(v) => updateField('methode', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="médicamenteuse">IVG médicamenteuse</SelectItem>
                <SelectItem value="chirurgicale">IVG chirurgicale (aspiration)</SelectItem>
                <SelectItem value="à décider">À décider</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Décision</Label>
              <Select value={data.decision} onValueChange={(v) => updateField('decision', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ferme">Ferme, réfléchie</SelectItem>
                  <SelectItem value="ambivalente">Ambivalente</SelectItem>
                  <SelectItem value="sous pression">Sous pression</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Soutien entourage</Label>
              <Select value={data.soutien} onValueChange={(v) => updateField('soutien', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="présent">Présent</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="partiel">Partiel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Autres observations</Label>
            <Input
              placeholder="Ex: Groupe sanguin A-, Rhophylac nécessaire"
              value={data.autre}
              onChange={(e) => updateField('autre', e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function generateIVGText(data: any): string {
  const parts: string[] = []

  if (data.terme_echo) parts.push(`DATATION: ${data.terme_echo}`)

  parts.push('')
  parts.push('EXAMEN GYNÉCOLOGIQUE:')
  if (data.col) parts.push(`- Col: ${data.col}`)
  if (data.uterus) parts.push(`- Utérus: ${data.uterus}`)

  parts.push('')
  parts.push('CONTEXTE:')
  if (data.decision) parts.push(`- Décision: ${data.decision}`)
  if (data.soutien) parts.push(`- Soutien: ${data.soutien}`)
  if (data.methode) parts.push(`- Méthode choisie: ${data.methode}`)
  if (data.autre) parts.push(`- ${data.autre}`)

  return parts.join('\n')
}

// ========== EXAMEN GÉNÉRIQUE (fallback) ==========
function ExamenGenerique({ onChange }: { onChange: (text: string) => void }) {
  const [data, setData] = useState({
    general: '',
    cardiovasculaire: '',
    pulmonaire: '',
    abdominal: '',
    autre: ''
  })

  useEffect(() => {
    const text = generateGeneriqueText(data)
    onChange(text)
  }, [data])

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-3">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <Label className="text-sm font-semibold">Examen clinique</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">État général</Label>
            <Input
              placeholder="Ex: Bon état général"
              value={data.general}
              onChange={(e) => updateField('general', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Cardiovasculaire</Label>
            <Input
              placeholder="Ex: Bruits du cœur réguliers"
              value={data.cardiovasculaire}
              onChange={(e) => updateField('cardiovasculaire', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Pulmonaire</Label>
            <Input
              placeholder="Ex: Murmure vésiculaire normal"
              value={data.pulmonaire}
              onChange={(e) => updateField('pulmonaire', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Abdominal</Label>
            <Input
              placeholder="Ex: Abdomen souple, indolore"
              value={data.abdominal}
              onChange={(e) => updateField('abdominal', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Autres observations</Label>
            <Textarea
              rows={3}
              placeholder="Autres éléments d'examen..."
              value={data.autre}
              onChange={(e) => updateField('autre', e.target.value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function generateGeneriqueText(data: any): string {
  const parts: string[] = ['EXAMEN CLINIQUE:']

  if (data.general) parts.push(`- État général: ${data.general}`)
  if (data.cardiovasculaire) parts.push(`- Cardiovasculaire: ${data.cardiovasculaire}`)
  if (data.pulmonaire) parts.push(`- Pulmonaire: ${data.pulmonaire}`)
  if (data.abdominal) parts.push(`- Abdominal: ${data.abdominal}`)
  if (data.autre) parts.push(`\n${data.autre}`)

  return parts.join('\n')
}
