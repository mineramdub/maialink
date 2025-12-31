import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FileText, Search, Plus, X, Save } from 'lucide-react'

interface Medicament {
  nom: string
  dci: string
  dosage: string
  forme: string
  posologie: string
  duree: string
  indications: string[]
}

interface OrdonnanceTemplate {
  nom: string
  categorie: string
  description: string
  medicaments: Array<{ medicamentId: string; personnalise: boolean }>
  contenu: string
}

interface SelectedMedicament extends Medicament {
  personnalise?: boolean
}

export default function NewOrdonnancePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [patients, setPatients] = useState<any[]>([])
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [templates, setTemplates] = useState<OrdonnanceTemplate[]>([])

  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedicaments, setSelectedMedicaments] = useState<SelectedMedicament[]>([])
  const [notes, setNotes] = useState('')
  const [dureeValidite, setDureeValidite] = useState('30')

  const [isGenerating, setIsGenerating] = useState(false)
  const [previewContent, setPreviewContent] = useState('')

  // Charger les patients
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setPatients(data.patients || []))
      .catch(err => console.error('Erreur chargement patients:', err))
  }, [])

  // Charger les templates et médicaments depuis le backend
  useEffect(() => {
    // Charger templates
    fetch(`${import.meta.env.VITE_API_URL}/api/ordonnances/templates`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || [])
        setMedicaments(data.medicaments || [])
      })
      .catch(err => console.error('Erreur chargement templates:', err))
  }, [])

  // Appliquer un template
  const applyTemplate = (templateNom: string) => {
    const template = templates.find(t => t.nom === templateNom)
    if (!template) return

    // Trouver les médicaments du template
    const templateMeds = template.medicaments.map(tm => {
      const med = medicaments.find(m => m.nom === tm.medicamentId)
      return med ? { ...med, personnalise: tm.personnalise } : null
    }).filter(Boolean) as SelectedMedicament[]

    setSelectedMedicaments(templateMeds)
    setSelectedTemplate(templateNom)

    // Générer preview
    generatePreview(templateMeds, template.contenu)
  }

  // Filtrer médicaments selon recherche
  const filteredMedicaments = medicaments.filter(med =>
    med.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.dci.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.indications.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Ajouter un médicament manuellement
  const addMedicament = (med: Medicament) => {
    if (!selectedMedicaments.find(m => m.nom === med.nom)) {
      const newMeds = [...selectedMedicaments, { ...med, personnalise: false }]
      setSelectedMedicaments(newMeds)
      setSearchQuery('')
      generatePreview(newMeds)
    }
  }

  // Retirer un médicament
  const removeMedicament = (index: number) => {
    const newMeds = selectedMedicaments.filter((_, i) => i !== index)
    setSelectedMedicaments(newMeds)
    generatePreview(newMeds)
  }

  // Générer le preview
  const generatePreview = (meds: SelectedMedicament[], templateContent?: string) => {
    if (templateContent) {
      // Utiliser le contenu du template
      const content = templateContent.replace(/{{dureeValidite}}/g, dureeValidite)
      setPreviewContent(content)
    } else {
      // Générer manuellement
      let content = 'MÉDICAMENTS PRESCRITS:\n\n'

      meds.forEach((med, index) => {
        content += `${index + 1}. ${med.nom}`
        if (med.dosage) content += ` ${med.dosage}`
        if (med.forme) content += `, ${med.forme}`
        content += `\n   Posologie: ${med.posologie}`
        content += `\n   Durée: ${med.duree}\n\n`
      })

      if (notes) {
        content += `RECOMMANDATIONS:\n${notes}\n\n`
      }

      content += `Ordonnance valable ${dureeValidite} jours.`
      setPreviewContent(content)
    }
  }

  // Mettre à jour preview quand notes ou durée change
  useEffect(() => {
    if (selectedMedicaments.length > 0) {
      generatePreview(selectedMedicaments)
    }
  }, [notes, dureeValidite])

  // Sauvegarder l'ordonnance
  const handleSave = async () => {
    if (!selectedPatientId) {
      alert('Veuillez sélectionner une patiente')
      return
    }

    if (selectedMedicaments.length === 0) {
      alert('Veuillez ajouter au moins un médicament')
      return
    }

    setIsGenerating(true)

    try {
      const patient = patients.find(p => p.id === selectedPatientId)

      const ordonnanceData = {
        patientId: selectedPatientId,
        patientNom: `${patient.firstName} ${patient.lastName}`,
        patientDateNaissance: patient.birthDate,
        medicaments: selectedMedicaments.map(m => ({
          nom: m.nom,
          dci: m.dci,
          dosage: m.dosage,
          forme: m.forme,
          posologie: m.posologie,
          duree: m.duree
        })),
        contenu: previewContent,
        dureeValidite: parseInt(dureeValidite),
        notes: notes || undefined,
        templateNom: selectedTemplate || undefined
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ordonnances/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(ordonnanceData)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erreur génération ordonnance')
      }

      const data = await res.json()
      alert('Ordonnance créée avec succès !')
      navigate(`/ordonnances/${data.ordonnance.id}`)
    } catch (error: any) {
      console.error('Erreur:', error)
      alert(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/ordonnances')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nouvelle Ordonnance
            </h1>
            <p className="text-sm text-gray-500">
              Créez une ordonnance à partir d'un template ou manuellement
            </p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isGenerating}>
          <Save className="h-4 w-4 mr-2" />
          {isGenerating ? 'Génération...' : 'Enregistrer'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Colonne gauche - Formulaire */}
        <div className="space-y-6">
          {/* Sélection patiente */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Patiente</h2>
            <div className="space-y-4">
              <div>
                <Label>Sélectionner une patiente *</Label>
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une patiente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} - {new Date(patient.birthDate).toLocaleDateString('fr-FR')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Templates prédéfinis */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Templates Prédéfinis</h2>
            <div className="space-y-2">
              <Label>Utiliser un template</Label>
              <Select value={selectedTemplate} onValueChange={applyTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un template (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.nom} value={template.nom}>
                      <div>
                        <div className="font-medium">{template.nom}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <p className="text-xs text-blue-600">
                  ✓ Template "{selectedTemplate}" appliqué
                </p>
              )}
            </div>
          </Card>

          {/* Recherche médicaments */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Ajouter des Médicaments</h2>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, DCI ou indication..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Résultats recherche */}
              {searchQuery && (
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  {filteredMedicaments.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucun médicament trouvé
                    </div>
                  ) : (
                    filteredMedicaments.map((med) => (
                      <button
                        key={med.nom}
                        onClick={() => addMedicament(med)}
                        className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{med.nom}</div>
                            <div className="text-xs text-gray-600">{med.dci} - {med.forme} {med.dosage}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {med.indications.map((ind, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {ind}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Médicaments sélectionnés */}
              {selectedMedicaments.length > 0 && (
                <div className="space-y-2">
                  <Label>Médicaments sélectionnés ({selectedMedicaments.length})</Label>
                  <div className="space-y-2">
                    {selectedMedicaments.map((med, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{med.nom}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {med.posologie} - {med.duree}
                          </div>
                        </div>
                        <button
                          onClick={() => removeMedicament(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Options supplémentaires */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Options</h2>
            <div className="space-y-4">
              <div>
                <Label>Durée de validité (jours)</Label>
                <Input
                  type="number"
                  value={dureeValidite}
                  onChange={(e) => setDureeValidite(e.target.value)}
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <Label>Recommandations / Notes</Label>
                <Textarea
                  placeholder="Ajouter des recommandations pour la patiente..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Colonne droite - Preview */}
        <div>
          <Card className="p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Aperçu de l'ordonnance</h2>
            </div>

            {selectedMedicaments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Sélectionnez des médicaments pour voir l'aperçu</p>
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 font-mono text-xs overflow-y-auto max-h-[calc(100vh-200px)]">
                <div className="mb-6 pb-4 border-b-2 border-gray-300">
                  <div className="text-center font-bold text-sm mb-2">ORDONNANCE</div>
                  <div className="text-xs space-y-1">
                    <div>Dr. {user?.firstName} {user?.lastName}</div>
                    <div>Sage-Femme</div>
                    {user?.rpps && <div>RPPS: {user.rpps}</div>}
                    {user?.adeli && <div>ADELI: {user.adeli}</div>}
                  </div>
                </div>

                {selectedPatientId && (
                  <div className="mb-6 pb-4 border-b border-gray-300">
                    <div className="font-semibold">PATIENTE:</div>
                    <div>{patients.find(p => p.id === selectedPatientId)?.firstName} {patients.find(p => p.id === selectedPatientId)?.lastName}</div>
                    <div className="text-xs text-gray-600">
                      Né(e) le {new Date(patients.find(p => p.id === selectedPatientId)?.birthDate || '').toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )}

                <div className="whitespace-pre-wrap">
                  {previewContent}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-300 text-right">
                  <div className="text-xs text-gray-600">
                    Date: {new Date().toLocaleDateString('fr-FR')}
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    [Signature électronique]
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
