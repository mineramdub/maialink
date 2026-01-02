import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Loader2, FileText, CheckCircle } from 'lucide-react'

interface Template {
  id: string
  nom: string
  variables: string[]
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  consultationId?: string
}

export function GenerateOrdonnanceDialog({ open, onOpenChange, patientId, consultationId }: Props) {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (open) {
      fetchTemplates()
    }
  }, [open])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ordonnances/templates`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    // Initialize variables with empty strings
    const initialVars: Record<string, string> = {}
    template.variables?.forEach(v => {
      initialVars[v] = ''
    })
    setVariables(initialVars)
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ordonnances/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          patientId,
          consultationId,
          variables
        })
      })

      const data = await res.json()

      if (data.success) {
        // Navigate to ordonnance page for editing/signing
        navigate(`/ordonnances/${data.ordonnance.id}`)
        onOpenChange(false)
      } else {
        alert('Erreur lors de la génération')
      }
    } catch (error) {
      console.error('Error generating ordonnance:', error)
      alert('Erreur lors de la génération')
    } finally {
      setIsGenerating(false)
    }
  }

  const getVariableLabel = (varName: string): string => {
    const labels: Record<string, string> = {
      patientName: 'Nom du patient',
      date: 'Date',
      lieu: 'Lieu',
      ddr: 'Date des dernières règles (DDR)',
      terme: 'Terme actuel',
      dateProchainRDV: 'Date prochain RDV',
      ferritine: 'Ferritinémie (ng/mL)',
      hemoglobine: 'Hémoglobine (g/dL)',
      dureeTraitement: 'Durée du traitement',
      dateArretContraception: 'Date d\'arrêt contraception'
    }
    return labels[varName] || varName
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Générer une ordonnance
          </DialogTitle>
          <DialogDescription>
            Choisissez un modèle d'ordonnance pré-remplie à personnaliser
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : !selectedTemplate ? (
          // Step 1: Select template
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Sélectionnez un modèle :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="p-4 text-left border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 group-hover:text-blue-700">
                        {template.nom}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {template.variables && template.variables.length > 0 ?
                          `${template.variables.length} champ(s) à compléter` :
                          'Prêt à l\'emploi'
                        }
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Step 2: Fill variables
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">{selectedTemplate.nom}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedTemplate(null)
                  setVariables({})
                }}
              >
                Changer
              </Button>
            </div>

            {selectedTemplate.variables && selectedTemplate.variables.length > 0 ? (
              <>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Complétez les informations suivantes :
                  </p>
                  <div className="space-y-4">
                    {selectedTemplate.variables
                      .filter(v => !['patientName', 'date', 'lieu'].includes(v)) // Skip auto-filled vars
                      .map((varName) => (
                        <div key={varName}>
                          <Label htmlFor={varName}>
                            {getVariableLabel(varName)}
                            {varName.includes('date') || varName.includes('Date') ? ' (optionnel)' : ''}
                          </Label>
                          <Input
                            id={varName}
                            value={variables[varName] || ''}
                            onChange={(e) => setVariables({ ...variables, [varName]: e.target.value })}
                            placeholder={
                              varName.includes('date') || varName.includes('Date')
                                ? 'jj/mm/aaaa'
                                : `Saisir ${getVariableLabel(varName).toLowerCase()}`
                            }
                          />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-slate-500 mb-3">
                    ℹ️ Les champs suivants seront remplis automatiquement :
                    Nom du patient, Date du jour, Lieu du cabinet
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Ce modèle est prêt à l'emploi ! Cliquez sur "Générer" pour créer l'ordonnance.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isGenerating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Générer l'ordonnance
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
