'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, Loader2, Table2 } from 'lucide-react'

interface ResultatLaboModalProps {
  patientId: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

// Templates de champs pour chaque type d'examen
const BIOLOGY_TEMPLATES: Record<string, Array<{ name: string; label: string; unit?: string; normalRange?: string }>> = {
  nfs: [
    { name: 'hemoglobine', label: 'Hémoglobine', unit: 'g/dL', normalRange: '12-16 (F) / 13-17 (H)' },
    { name: 'hematocrite', label: 'Hématocrite', unit: '%', normalRange: '36-46 (F) / 40-54 (H)' },
    { name: 'leucocytes', label: 'Leucocytes', unit: '/mm³', normalRange: '4000-10000' },
    { name: 'plaquettes', label: 'Plaquettes', unit: '/mm³', normalRange: '150000-400000' },
    { name: 'vgm', label: 'VGM', unit: 'fL', normalRange: '80-100' },
    { name: 'tcmh', label: 'TCMH', unit: 'pg', normalRange: '27-32' },
    { name: 'ccmh', label: 'CCMH', unit: 'g/dL', normalRange: '32-36' },
  ],
  biochimie: [
    { name: 'glycemie', label: 'Glycémie à jeun', unit: 'g/L', normalRange: '0.7-1.1' },
    { name: 'creatinine', label: 'Créatinine', unit: 'mg/L', normalRange: '6-12' },
    { name: 'uree', label: 'Urée', unit: 'g/L', normalRange: '0.15-0.45' },
    { name: 'cholesterol_total', label: 'Cholestérol total', unit: 'g/L', normalRange: '<2' },
    { name: 'hdl', label: 'HDL', unit: 'g/L', normalRange: '>0.4' },
    { name: 'ldl', label: 'LDL', unit: 'g/L', normalRange: '<1.6' },
    { name: 'triglycerides', label: 'Triglycérides', unit: 'g/L', normalRange: '<1.5' },
    { name: 'tgo', label: 'TGO (ASAT)', unit: 'UI/L', normalRange: '<40' },
    { name: 'tgp', label: 'TGP (ALAT)', unit: 'UI/L', normalRange: '<40' },
  ],
  serologie: [
    { name: 'toxoplasmose_igG', label: 'Toxoplasmose IgG', normalRange: 'Positif/Négatif' },
    { name: 'toxoplasmose_igM', label: 'Toxoplasmose IgM', normalRange: 'Positif/Négatif' },
    { name: 'rubeole_igG', label: 'Rubéole IgG', normalRange: 'Positif/Négatif' },
    { name: 'rubeole_igM', label: 'Rubéole IgM', normalRange: 'Positif/Négatif' },
    { name: 'cmv_igG', label: 'CMV IgG', normalRange: 'Positif/Négatif' },
    { name: 'cmv_igM', label: 'CMV IgM', normalRange: 'Positif/Négatif' },
    { name: 'vih', label: 'VIH', normalRange: 'Positif/Négatif' },
    { name: 'hepatite_b', label: 'Hépatite B (AgHBs)', normalRange: 'Positif/Négatif' },
    { name: 'hepatite_c', label: 'Hépatite C', normalRange: 'Positif/Négatif' },
    { name: 'syphilis', label: 'Syphilis (TPHA/VDRL)', normalRange: 'Positif/Négatif' },
  ],
  hormonologie: [
    { name: 'tsh', label: 'TSH', unit: 'mUI/L', normalRange: '0.4-4.0' },
    { name: 't4_libre', label: 'T4 libre', unit: 'ng/L', normalRange: '9-19' },
    { name: 't3_libre', label: 'T3 libre', unit: 'pg/mL', normalRange: '2.3-4.2' },
    { name: 'prolactine', label: 'Prolactine', unit: 'ng/mL', normalRange: '<25' },
    { name: 'fsh', label: 'FSH', unit: 'UI/L', normalRange: 'Variable selon cycle' },
    { name: 'lh', label: 'LH', unit: 'UI/L', normalRange: 'Variable selon cycle' },
    { name: 'oestradiol', label: 'Œstradiol', unit: 'pg/mL', normalRange: 'Variable selon cycle' },
    { name: 'progesterone', label: 'Progestérone', unit: 'ng/mL', normalRange: 'Variable selon cycle' },
  ],
}

export function ResultatLaboModal({ patientId, open, onClose, onSuccess }: ResultatLaboModalProps) {
  const [mode, setMode] = useState<'upload' | 'manuel'>('manuel')
  const [saisieMode, setSaisieMode] = useState<'tableau' | 'texte'>('tableau')
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [formData, setFormData] = useState({
    type: 'autre',
    nom: '',
    dateAnalyse: new Date().toISOString().split('T')[0],
    dateReception: '',
    resultatManuel: '',
    normal: '',
    commentaire: '',
    laboratoire: '',
    prescripteur: '',
  })
  const [biologyResults, setBiologyResults] = useState<Record<string, string>>({})
  const [file, setFile] = useState<File | null>(null)

  // Reset biology results when type changes
  useEffect(() => {
    setBiologyResults({})
    // Auto-set name based on type
    const typeNames: Record<string, string> = {
      nfs: 'Numération Formule Sanguine',
      biochimie: 'Bilan biochimique',
      serologie: 'Sérologies',
      hormonologie: 'Bilan hormonal',
    }
    if (typeNames[formData.type]) {
      setFormData(prev => ({ ...prev, nom: typeNames[formData.type] }))
    }
  }, [formData.type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = new FormData()
      data.append('patientId', patientId)

      // Format structured results if in tableau mode
      let resultatText = formData.resultatManuel
      if (mode === 'manuel' && saisieMode === 'tableau' && Object.keys(biologyResults).length > 0) {
        const template = BIOLOGY_TEMPLATES[formData.type]
        if (template) {
          const formattedResults = template
            .map(field => {
              const value = biologyResults[field.name]
              if (value) {
                return `${field.label}: ${value}${field.unit ? ' ' + field.unit : ''} (Norme: ${field.normalRange})`
              }
              return null
            })
            .filter(Boolean)
            .join('\n')
          resultatText = formattedResults
        }
      }

      // Append form data
      Object.entries({ ...formData, resultatManuel: resultatText }).forEach(([key, value]) => {
        if (value) data.append(key, value)
      })
      if (file) data.append('file', file)

      const res = await fetch('/api/resultats-labo', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()
      if (result.success) {
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          type: 'autre',
          nom: '',
          dateAnalyse: new Date().toISOString().split('T')[0],
          dateReception: '',
          resultatManuel: '',
          normal: '',
          commentaire: '',
          laboratoire: '',
          prescripteur: '',
        })
        setBiologyResults({})
        setFile(null)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setMode('upload')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un résultat de laboratoire</DialogTitle>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manuel">
              <FileText className="h-4 w-4 mr-2" />
              Saisie manuelle
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload PDF
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Champs communs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type d'examen *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nfs">NFS</SelectItem>
                    <SelectItem value="biochimie">Biochimie</SelectItem>
                    <SelectItem value="serologie">Sérologie</SelectItem>
                    <SelectItem value="hormonologie">Hormonologie</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nom de l'examen *</Label>
                <Input
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: TSH, Glycémie..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date d'analyse</Label>
                <Input
                  type="date"
                  value={formData.dateAnalyse}
                  onChange={(e) => setFormData({ ...formData, dateAnalyse: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Laboratoire</Label>
                <Input
                  value={formData.laboratoire}
                  onChange={(e) => setFormData({ ...formData, laboratoire: e.target.value })}
                  placeholder="Nom du laboratoire"
                />
              </div>
              <div className="space-y-2">
                <Label>Prescripteur</Label>
                <Input
                  value={formData.prescripteur}
                  onChange={(e) => setFormData({ ...formData, prescripteur: e.target.value })}
                  placeholder="Dr. Nom"
                />
              </div>
            </div>

            <TabsContent value="manuel" className="space-y-4 mt-0">
              {/* Mode de saisie */}
              {(formData.type === 'nfs' || formData.type === 'biochimie' || formData.type === 'serologie' || formData.type === 'hormonologie') && (
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    size="sm"
                    variant={saisieMode === 'tableau' ? 'default' : 'outline'}
                    onClick={() => setSaisieMode('tableau')}
                    className="flex items-center gap-2"
                  >
                    <Table2 className="h-4 w-4" />
                    Formulaire structuré
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={saisieMode === 'texte' ? 'default' : 'outline'}
                    onClick={() => setSaisieMode('texte')}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Texte libre
                  </Button>
                </div>
              )}

              {/* Formulaire structuré */}
              {saisieMode === 'tableau' && BIOLOGY_TEMPLATES[formData.type] ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto border rounded-lg p-4 bg-slate-50">
                  <p className="text-xs text-slate-600 mb-3">
                    Remplissez uniquement les champs dont vous disposez des résultats
                  </p>
                  {BIOLOGY_TEMPLATES[formData.type].map((field) => (
                    <div key={field.name} className="grid grid-cols-12 gap-3 items-center bg-white p-3 rounded border">
                      <Label className="col-span-5 text-sm font-medium">{field.label}</Label>
                      <div className="col-span-4">
                        <Input
                          type="text"
                          value={biologyResults[field.name] || ''}
                          onChange={(e) => setBiologyResults({ ...biologyResults, [field.name]: e.target.value })}
                          placeholder={field.unit ? `Ex: 15 ${field.unit}` : 'Valeur'}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-3 text-xs text-slate-500">
                        <span className="font-medium">Norme:</span> {field.normalRange}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Saisie texte libre */
                <div className="space-y-2">
                  <Label>Résultats</Label>
                  <Textarea
                    value={formData.resultatManuel}
                    onChange={(e) => setFormData({ ...formData, resultatManuel: e.target.value })}
                    placeholder="Saisir les résultats..."
                    rows={8}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Interprétation</Label>
                <Select value={formData.normal} onValueChange={(v) => setFormData({ ...formData, normal: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Normal</SelectItem>
                    <SelectItem value="false">Anormal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Fichier PDF</Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'}
                  `}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
                  {file ? (
                    <div>
                      <p className="text-sm font-medium text-slate-700">{file.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} Ko</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                        }}
                      >
                        Changer de fichier
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Glissez-déposez votre PDF ici
                      </p>
                      <p className="text-xs text-slate-500">
                        ou cliquez pour sélectionner un fichier
                      </p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </TabsContent>

            <div className="space-y-2">
              <Label>Commentaire</Label>
              <Textarea
                value={formData.commentaire}
                onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                placeholder="Commentaire médical..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Enregistrer
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
