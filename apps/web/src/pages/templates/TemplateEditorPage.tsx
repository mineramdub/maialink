import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  FileText,
  User,
  Baby,
  Calendar,
  Heart,
  Activity,
  Sparkles,
} from 'lucide-react'

// Variables disponibles pour l'insertion
const AVAILABLE_VARIABLES = {
  patient: [
    { key: '{{patient.nom}}', label: 'Nom', description: 'Nom de famille de la patiente' },
    { key: '{{patient.prenom}}', label: 'Prénom', description: 'Prénom de la patiente' },
    {
      key: '{{patient.nomComplet}}',
      label: 'Nom complet',
      description: 'Prénom et nom de la patiente',
    },
    { key: '{{patient.dateNaissance}}', label: 'Date de naissance', description: 'jj/mm/aaaa' },
    { key: '{{patient.age}}', label: 'Âge', description: 'Âge en années' },
    { key: '{{patient.adresse}}', label: 'Adresse', description: 'Adresse complète' },
    { key: '{{patient.telephone}}', label: 'Téléphone', description: 'Numéro de téléphone' },
    {
      key: '{{patient.numeroSS}}',
      label: 'Numéro SS',
      description: 'Numéro de sécurité sociale',
    },
    { key: '{{patient.groupeSanguin}}', label: 'Groupe sanguin', description: 'Groupe + Rhésus' },
  ],
  grossesse: [
    { key: '{{grossesse.ddr}}', label: 'DDR', description: 'Date des dernières règles' },
    { key: '{{grossesse.dpa}}', label: 'DPA', description: 'Date prévue d\'accouchement' },
    { key: '{{grossesse.terme}}', label: 'Terme', description: 'Terme actuel (SA+J)' },
    { key: '{{grossesse.gravida}}', label: 'Gravida', description: 'Nombre de grossesses' },
    { key: '{{grossesse.para}}', label: 'Para', description: 'Nombre d\'accouchements' },
    {
      key: '{{grossesse.typeGrossesse}}',
      label: 'Type',
      description: 'Unique / Gémellaire',
    },
  ],
  praticien: [
    { key: '{{praticien.nom}}', label: 'Nom', description: 'Nom du praticien' },
    { key: '{{praticien.prenom}}', label: 'Prénom', description: 'Prénom du praticien' },
    {
      key: '{{praticien.nomComplet}}',
      label: 'Nom complet',
      description: 'Prénom et nom du praticien',
    },
    { key: '{{praticien.rpps}}', label: 'RPPS', description: 'Numéro RPPS' },
    { key: '{{praticien.adeli}}', label: 'ADELI', description: 'Numéro ADELI' },
    { key: '{{praticien.telephone}}', label: 'Téléphone', description: 'Téléphone du cabinet' },
    { key: '{{praticien.adresse}}', label: 'Adresse', description: 'Adresse du cabinet' },
  ],
  document: [
    { key: '{{document.date}}', label: 'Date', description: 'Date du jour (jj/mm/aaaa)' },
    { key: '{{document.heure}}', label: 'Heure', description: 'Heure actuelle (hh:mm)' },
    { key: '{{document.lieu}}', label: 'Lieu', description: 'Ville du cabinet' },
  ],
}

const DOCUMENT_TYPES = [
  { value: 'ordonnance', label: 'Ordonnance', icon: FileText },
  { value: 'certificat', label: 'Certificat', icon: Badge },
  { value: 'courrier', label: 'Courrier', icon: FileText },
  { value: 'declaration_grossesse', label: 'Déclaration de grossesse', icon: Heart },
  { value: 'compte_rendu', label: 'Compte rendu', icon: Activity },
  { value: 'autre', label: 'Autre', icon: FileText },
]

export default function TemplateEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  // Form state
  const [nom, setNom] = useState('')
  const [type, setType] = useState<string>('certificat')
  const [contenu, setContenu] = useState('')
  const [variables, setVariables] = useState<string[]>([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Load template if editing
  useEffect(() => {
    if (isEditing) {
      loadTemplate(id)
    }
  }, [id, isEditing])

  const loadTemplate = async (templateId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/document-templates/${templateId}`,
        {
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setNom(data.template.nom)
        setType(data.template.type)
        setContenu(data.template.contenu)
        setVariables(data.template.variables || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement du template:', error)
    }
  }

  const handleSave = async () => {
    if (!nom.trim() || !contenu.trim()) {
      alert('Le nom et le contenu sont obligatoires')
      return
    }

    setIsSaving(true)

    try {
      const method = isEditing ? 'PUT' : 'POST'
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/api/document-templates/${id}`
        : `${import.meta.env.VITE_API_URL}/api/document-templates`

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nom,
          type,
          contenu,
          variables: extractVariables(contenu),
          isDefault: false,
        }),
      })

      if (response.ok) {
        navigate('/templates')
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g
    const matches = text.matchAll(regex)
    const vars = new Set<string>()
    for (const match of matches) {
      vars.add(`{{${match[1]}}}`)
    }
    return Array.from(vars)
  }

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = contenu
    const newText = text.substring(0, start) + variable + text.substring(end)

    setContenu(newText)

    // Mettre le curseur après la variable insérée
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + variable.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const renderPreview = () => {
    let preview = contenu

    // Remplacer les variables par des exemples
    const examples: Record<string, string> = {
      '{{patient.nom}}': 'MARTIN',
      '{{patient.prenom}}': 'Sophie',
      '{{patient.nomComplet}}': 'Sophie MARTIN',
      '{{patient.dateNaissance}}': '15/03/1990',
      '{{patient.age}}': '34',
      '{{patient.adresse}}': '12 rue de la République, 75001 PARIS',
      '{{patient.telephone}}': '06 12 34 56 78',
      '{{patient.numeroSS}}': '2 90 03 75 123 456 78',
      '{{patient.groupeSanguin}}': 'A+',
      '{{grossesse.ddr}}': '01/01/2024',
      '{{grossesse.dpa}}': '08/10/2024',
      '{{grossesse.terme}}': '32 SA + 3 jours',
      '{{grossesse.gravida}}': '2',
      '{{grossesse.para}}': '1',
      '{{grossesse.typeGrossesse}}': 'Unique',
      '{{praticien.nom}}': 'DUBOIS',
      '{{praticien.prenom}}': 'Marie',
      '{{praticien.nomComplet}}': 'Marie DUBOIS',
      '{{praticien.rpps}}': '10001234567',
      '{{praticien.adeli}}': '750012345',
      '{{praticien.telephone}}': '01 23 45 67 89',
      '{{praticien.adresse}}': '5 avenue des Champs, 75008 PARIS',
      '{{document.date}}': new Date().toLocaleDateString('fr-FR'),
      '{{document.heure}}': new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      '{{document.lieu}}': 'PARIS',
    }

    Object.entries(examples).forEach(([variable, value]) => {
      preview = preview.replaceAll(variable, `<strong class="text-blue-600">${value}</strong>`)
    })

    // Remplacer les sauts de ligne par des <br>
    preview = preview.replace(/\n/g, '<br>')

    return preview
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/templates')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isEditing ? 'Modifier le template' : 'Nouveau template'}
            </h1>
            <p className="text-slate-500 mt-1">
              Créez un template personnalisé avec des variables dynamiques
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Masquer' : 'Aperçu'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale - Éditeur */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du template */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
              <CardDescription>Définissez le nom et le type de document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du template *</Label>
                <Input
                  id="nom"
                  placeholder="Ex: Certificat de grossesse personnalisé"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de document *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((docType) => (
                      <SelectItem key={docType.value} value={docType.value}>
                        {docType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Éditeur de contenu */}
          <Card>
            <CardHeader>
              <CardTitle>Contenu du template</CardTitle>
              <CardDescription>
                Rédigez le contenu et insérez des variables dynamiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="template-content"
                placeholder="Saisissez le contenu de votre template ici...

Exemple:
Je soussignée {{praticien.nomComplet}}, sage-femme, certifie avoir examiné ce jour {{patient.nomComplet}}, née le {{patient.dateNaissance}}.

La patiente est actuellement enceinte, terme estimé à {{grossesse.terme}}.

Fait à {{document.lieu}}, le {{document.date}}

{{praticien.nomComplet}}
RPPS: {{praticien.rpps}}"
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
              />

              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>{contenu.length} caractères</span>
                <span>{extractVariables(contenu).length} variables détectées</span>
              </div>
            </CardContent>
          </Card>

          {/* Prévisualisation */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Aperçu avec données d'exemple
                </CardTitle>
                <CardDescription>
                  Les variables sont remplacées par des données fictives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="bg-white border border-slate-200 rounded-lg p-6 min-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: renderPreview() }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne latérale - Variables */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Variables disponibles
              </CardTitle>
              <CardDescription>
                Cliquez sur une variable pour l'insérer dans le texte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variables Patient */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-sm text-slate-900">Patiente</h4>
                </div>
                <div className="space-y-1">
                  {AVAILABLE_VARIABLES.patient.map((variable) => (
                    <button
                      key={variable.key}
                      onClick={() => insertVariable(variable.key)}
                      className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-100 transition-colors group"
                    >
                      <div className="font-mono text-blue-600 group-hover:text-blue-700">
                        {variable.key}
                      </div>
                      <div className="text-slate-500 mt-0.5">{variable.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Variables Grossesse */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Baby className="h-4 w-4 text-pink-600" />
                  <h4 className="font-medium text-sm text-slate-900">Grossesse</h4>
                </div>
                <div className="space-y-1">
                  {AVAILABLE_VARIABLES.grossesse.map((variable) => (
                    <button
                      key={variable.key}
                      onClick={() => insertVariable(variable.key)}
                      className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-100 transition-colors group"
                    >
                      <div className="font-mono text-blue-600 group-hover:text-blue-700">
                        {variable.key}
                      </div>
                      <div className="text-slate-500 mt-0.5">{variable.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Variables Praticien */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-sm text-slate-900">Praticien</h4>
                </div>
                <div className="space-y-1">
                  {AVAILABLE_VARIABLES.praticien.map((variable) => (
                    <button
                      key={variable.key}
                      onClick={() => insertVariable(variable.key)}
                      className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-100 transition-colors group"
                    >
                      <div className="font-mono text-blue-600 group-hover:text-blue-700">
                        {variable.key}
                      </div>
                      <div className="text-slate-500 mt-0.5">{variable.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Variables Document */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <h4 className="font-medium text-sm text-slate-900">Document</h4>
                </div>
                <div className="space-y-1">
                  {AVAILABLE_VARIABLES.document.map((variable) => (
                    <button
                      key={variable.key}
                      onClick={() => insertVariable(variable.key)}
                      className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-slate-100 transition-colors group"
                    >
                      <div className="font-mono text-blue-600 group-hover:text-blue-700">
                        {variable.key}
                      </div>
                      <div className="text-slate-500 mt-0.5">{variable.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guide rapide */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">Guide rapide</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-slate-700">
              <p>
                <strong>Variables:</strong> Utilisez la syntaxe{' '}
                <code className="bg-white px-1 py-0.5 rounded">{'{{variable}}'}</code> pour insérer
                des données dynamiques
              </p>
              <p>
                <strong>Aperçu:</strong> Cliquez sur "Aperçu" pour voir le rendu avec des données
                d'exemple
              </p>
              <p>
                <strong>Formatage:</strong> Les sauts de ligne sont préservés dans le document final
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
