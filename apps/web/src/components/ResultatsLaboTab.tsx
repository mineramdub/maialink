import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Upload, Loader2, Download, ChevronDown, ChevronUp, AlertCircle, FileText, Highlighter, Plus, X, History, Pencil, Check, FileDown } from 'lucide-react'
import { formatDate } from '../lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface TestResult {
  nom: string
  valeur: string
  unite?: string
  reference?: string
  statut: 'normal' | 'anormal' | 'critique'
}

interface DonneesExtraites {
  hematologie?: TestResult[]
  biochimie?: TestResult[]
  serologies?: TestResult[]
  hormones?: TestResult[]
  autres?: TestResult[]
}

interface Highlight {
  category: string
  testIndex: number
  color: string
}

interface ResultatLabo {
  id: string
  patientId: string
  dateExamen: string
  laboratoire?: string
  fichierName: string
  fichierUrl: string
  donneesExtraites?: DonneesExtraites
  notes?: string
  isProcessed: boolean
  processingError?: string
  highlights?: Highlight[]
  isReceived?: boolean
  isInformed?: boolean
  createdAt: string
}

interface ResultatsLaboTabProps {
  patientId: string
}

export function ResultatsLaboTab({ patientId }: ResultatsLaboTabProps) {
  const [resultats, setResultats] = useState<ResultatLabo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Saisie manuelle
  const [manualEntry, setManualEntry] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [manualTests, setManualTests] = useState<TestResult[]>([])
  const [currentTest, setCurrentTest] = useState({
    nom: '',
    valeur: '',
    unite: '',
    reference: '',
    statut: 'normal' as 'normal' | 'anormal' | 'critique'
  })
  const [showHistory, setShowHistory] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    dateExamen: new Date().toISOString().split('T')[0],
    laboratoire: '',
    prescripteur: '',
    notes: '',
  })

  useEffect(() => {
    fetchResultats()
  }, [patientId])

  const fetchResultats = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/resultats-labo/patient/${patientId}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch results')
      const data = await res.json()
      setResultats(data)
    } catch (error) {
      console.error('Error fetching lab results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else {
      alert('Veuillez sélectionner un fichier PDF')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)

      const formDataToSend = new FormData()
      formDataToSend.append('file', selectedFile)
      formDataToSend.append('patientId', patientId)
      formDataToSend.append('dateExamen', formData.dateExamen)
      if (formData.laboratoire) formDataToSend.append('laboratoire', formData.laboratoire)
      if (formData.prescripteur) formDataToSend.append('prescripteur', formData.prescripteur)
      if (formData.notes) formDataToSend.append('notes', formData.notes)

      const res = await fetch('/api/resultats-labo/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      })

      if (!res.ok) throw new Error('Upload failed')

      const { id } = await res.json()

      // Close dialog
      setUploadOpen(false)
      setSelectedFile(null)
      setFormData({
        dateExamen: new Date().toISOString().split('T')[0],
        laboratoire: '',
        prescripteur: '',
        notes: '',
      })

      // Start polling for status
      pollStatus(id)
      setProcessingIds(prev => new Set(prev).add(id))

      // Refresh list
      fetchResultats()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Erreur lors de l\'upload du fichier')
    } finally {
      setUploading(false)
    }
  }

  const handleManualSubmit = async () => {
    if (!selectedCategory || manualTests.length === 0) {
      alert('Veuillez sélectionner une catégorie et ajouter au moins un résultat')
      return
    }

    try {
      setUploading(true)

      const donneesExtraites: DonneesExtraites = {
        [selectedCategory]: manualTests
      }

      const res = await fetch('/api/resultats-labo/manual', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          dateExamen: formData.dateExamen,
          laboratoire: formData.laboratoire || 'Saisie manuelle',
          donneesExtraites,
          notes: formData.notes,
        })
      })

      if (!res.ok) throw new Error('Failed to save manual entry')

      // Reset form
      setUploadOpen(false)
      setManualEntry(false)
      setSelectedCategory('')
      setManualTests([])
      setCurrentTest({
        nom: '',
        valeur: '',
        unite: '',
        reference: '',
        statut: 'normal'
      })
      setFormData({
        dateExamen: new Date().toISOString().split('T')[0],
        laboratoire: '',
        prescripteur: '',
        notes: '',
      })

      // Refresh list
      fetchResultats()
    } catch (error) {
      console.error('Error saving manual entry:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setUploading(false)
    }
  }

  const addManualTest = () => {
    if (!currentTest.nom || !currentTest.valeur) {
      alert('Veuillez remplir au moins le nom et la valeur du test')
      return
    }

    setManualTests([...manualTests, { ...currentTest }])
    setCurrentTest({
      nom: '',
      valeur: '',
      unite: '',
      reference: '',
      statut: 'normal'
    })
  }

  const removeManualTest = (index: number) => {
    setManualTests(manualTests.filter((_, i) => i !== index))
  }

  const getPreviousResults = (testName: string, category: string): TestResult[] => {
    const previousResults: TestResult[] = []

    resultats.forEach(resultat => {
      if (resultat.donneesExtraites && resultat.donneesExtraites[category as keyof DonneesExtraites]) {
        const tests = resultat.donneesExtraites[category as keyof DonneesExtraites]
        const matchingTest = tests?.find(t => t.nom.toLowerCase() === testName.toLowerCase())
        if (matchingTest) {
          previousResults.push({
            ...matchingTest,
            // @ts-ignore - ajouter la date pour le tri
            dateExamen: resultat.dateExamen
          })
        }
      }
    })

    return previousResults.slice(0, 3) // Limiter aux 3 derniers
  }

  const pollStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/resultats-labo/${id}/status`, {
          credentials: 'include',
        })
        const data = await res.json()

        if (data.isProcessed || data.processingError) {
          clearInterval(interval)
          setProcessingIds(prev => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
          // Refresh list to get updated data
          fetchResultats()
        }
      } catch (error) {
        console.error('Error polling status:', error)
        clearInterval(interval)
      }
    }, 2000)

    // Stop polling after 2 minutes
    setTimeout(() => clearInterval(interval), 120000)
  }

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const downloadPDF = async (id: string, fileName: string) => {
    try {
      const res = await fetch(`/api/resultats-labo/${id}/download`, {
        credentials: 'include',
      })
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Erreur lors du téléchargement')
    }
  }

  const hasAbnormalValues = (resultat: ResultatLabo): boolean => {
    if (!resultat.donneesExtraites) return false

    const categories = [
      resultat.donneesExtraites.hematologie,
      resultat.donneesExtraites.biochimie,
      resultat.donneesExtraites.serologies,
      resultat.donneesExtraites.hormones,
      resultat.donneesExtraites.autres,
    ]

    return categories.some(category =>
      category?.some(test => test.statut === 'anormal' || test.statut === 'critique')
    )
  }

  const getStatutBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'normal':
        return 'default'
      case 'anormal':
        return 'warning'
      case 'critique':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'normal':
        return 'bg-green-50'
      case 'anormal':
        return 'bg-yellow-50'
      case 'critique':
        return 'bg-red-50'
      default:
        return ''
    }
  }

  const getHighlight = (resultatId: string, category: string, testIndex: number): string | undefined => {
    const resultat = resultats.find(r => r.id === resultatId)
    if (!resultat?.highlights) return undefined

    const highlight = resultat.highlights.find(
      h => h.category === category && h.testIndex === testIndex
    )
    return highlight?.color
  }

  const toggleHighlight = async (resultatId: string, category: string, testIndex: number, color: string) => {
    const resultat = resultats.find(r => r.id === resultatId)
    if (!resultat) return

    const existingHighlights = resultat.highlights || []
    const existingIndex = existingHighlights.findIndex(
      h => h.category === category && h.testIndex === testIndex
    )

    let newHighlights: Highlight[]
    if (existingIndex >= 0) {
      // Si déjà surligné avec la même couleur, on enlève
      if (existingHighlights[existingIndex].color === color) {
        newHighlights = existingHighlights.filter((_, i) => i !== existingIndex)
      } else {
        // Sinon on change la couleur
        newHighlights = [...existingHighlights]
        newHighlights[existingIndex] = { category, testIndex, color }
      }
    } else {
      // Nouveau surlignage
      newHighlights = [...existingHighlights, { category, testIndex, color }]
    }

    try {
      // Mettre à jour l'API
      const res = await fetch(`/api/resultats-labo/${resultatId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highlights: newHighlights }),
      })

      if (!res.ok) throw new Error('Failed to update highlights')

      // Mettre à jour l'état local
      setResultats(prev =>
        prev.map(r =>
          r.id === resultatId ? { ...r, highlights: newHighlights } : r
        )
      )
    } catch (error) {
      console.error('Error updating highlights:', error)
      alert('Erreur lors de la sauvegarde du surlignage')
    }
  }

  const toggleStatus = async (resultatId: string, field: 'isReceived' | 'isInformed') => {
    const resultat = resultats.find(r => r.id === resultatId)
    if (!resultat) return

    const newValue = !resultat[field]

    try {
      const res = await fetch(`/api/resultats-labo/${resultatId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newValue }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      // Mettre à jour l'état local
      setResultats(prev =>
        prev.map(r =>
          r.id === resultatId ? { ...r, [field]: newValue } : r
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Erreur lors de la sauvegarde du statut')
    }
  }

  const exportToCSV = () => {
    // Créer les en-têtes CSV
    const headers = ['Date', 'Laboratoire', 'Reçu', 'Informée', 'Notes']

    // Créer les lignes de données
    const rows = resultats.map(r => [
      formatDate(r.dateExamen),
      r.laboratoire || 'Non spécifié',
      r.isReceived ? 'Oui' : 'Non',
      r.isInformed ? 'Oui' : 'Non',
      r.notes || ''
    ])

    // Combiner en-têtes et données
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Créer le blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resultats_labo_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const renderTestCategory = (resultatId: string, category: string, title: string, tests?: TestResult[]) => {
    if (!tests || tests.length === 0) return null

    return (
      <div className="mb-6">
        <h4 className="font-semibold text-md mb-3 text-slate-700">{title}</h4>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-20">Surligner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test, idx) => {
                const highlightColor = getHighlight(resultatId, category, idx)
                return (
                  <TableRow
                    key={idx}
                    className={!highlightColor ? getStatutColor(test.statut) : ''}
                    style={highlightColor ? {
                      backgroundColor: `${highlightColor}60`,
                      borderLeft: `4px solid ${highlightColor}`,
                    } : undefined}
                  >
                    <TableCell className="font-medium">{test.nom}</TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {test.valeur} {test.unite}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {test.reference || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatutBadgeVariant(test.statut) as any}>
                        {test.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {/* Couleurs de surlignage prédéfinies */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleHighlight(resultatId, category, idx, '#FFFF00')
                          }}
                          className={`w-6 h-6 rounded border-2 hover:border-slate-700 transition-colors ${
                            highlightColor === '#FFFF00' ? 'border-slate-700 ring-2 ring-slate-400' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: '#FFFF00' }}
                          title="Jaune"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleHighlight(resultatId, category, idx, '#90EE90')
                          }}
                          className={`w-6 h-6 rounded border-2 hover:border-slate-700 transition-colors ${
                            highlightColor === '#90EE90' ? 'border-slate-700 ring-2 ring-slate-400' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: '#90EE90' }}
                          title="Vert"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleHighlight(resultatId, category, idx, '#FFA500')
                          }}
                          className={`w-6 h-6 rounded border-2 hover:border-slate-700 transition-colors ${
                            highlightColor === '#FFA500' ? 'border-slate-700 ring-2 ring-slate-400' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: '#FFA500' }}
                          title="Orange"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleHighlight(resultatId, category, idx, '#FFB6C1')
                          }}
                          className={`w-6 h-6 rounded border-2 hover:border-slate-700 transition-colors ${
                            highlightColor === '#FFB6C1' ? 'border-slate-700 ring-2 ring-slate-400' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: '#FFB6C1' }}
                          title="Rose"
                        />
                        <input
                          type="color"
                          onChange={(e) => {
                            e.stopPropagation()
                            toggleHighlight(resultatId, category, idx, e.target.value)
                          }}
                          className="w-6 h-6 rounded border-2 border-slate-300 cursor-pointer hover:border-slate-700"
                          title="Couleur personnalisée"
                          value={highlightColor || '#000000'}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Chargement...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Résultats de laboratoire</h3>
          <p className="text-sm text-slate-500">
            Uploadez un PDF et laissez l'IA extraire automatiquement les résultats
          </p>
        </div>
        <div className="flex gap-2">
          {resultats.length > 0 && (
            <Button variant="outline" onClick={exportToCSV}>
              <FileDown className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          )}
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Ajouter un résultat
          </Button>
        </div>
      </div>

      {/* Processing indicator */}
      {processingIds.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
              <div>
                <p className="font-medium text-blue-900">
                  Analyse en cours...
                </p>
                <p className="text-sm text-blue-700">
                  L'IA analyse le PDF et extrait les résultats. Cela peut prendre 30 à 60 secondes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results list */}
      {resultats.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>Aucun résultat de laboratoire</p>
              <p className="text-sm">Commencez par uploader un PDF de résultats</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {resultats.map(resultat => (
            <Card key={resultat.id} className="hover:shadow-md transition-shadow">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleExpanded(resultat.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">
                        {formatDate(resultat.dateExamen)}
                      </CardTitle>
                      {processingIds.has(resultat.id) && (
                        <Badge variant="secondary" className="animate-pulse">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Traitement...
                        </Badge>
                      )}
                      {resultat.processingError && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Erreur
                        </Badge>
                      )}
                      {resultat.isProcessed && hasAbnormalValues(resultat) && (
                        <Badge variant="warning">Valeurs anormales</Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      {resultat.laboratoire || 'Laboratoire non spécifié'}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`received-${resultat.id}`}
                          checked={resultat.isReceived || false}
                          onCheckedChange={() => toggleStatus(resultat.id, 'isReceived')}
                        />
                        <Label
                          htmlFor={`received-${resultat.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          Reçu
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`informed-${resultat.id}`}
                          checked={resultat.isInformed || false}
                          onCheckedChange={() => toggleStatus(resultat.id, 'isInformed')}
                        />
                        <Label
                          htmlFor={`informed-${resultat.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          Patiente informée
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadPDF(resultat.id, resultat.fichierName)
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {expandedIds.has(resultat.id) ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedIds.has(resultat.id) && (
                <CardContent className="pt-0">
                  {resultat.processingError ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium">Erreur lors du traitement</p>
                      <p className="text-red-600 text-sm mt-1">{resultat.processingError}</p>
                    </div>
                  ) : !resultat.isProcessed ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800">Le fichier est en cours de traitement...</p>
                    </div>
                  ) : !resultat.donneesExtraites ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-slate-600">Aucune donnée extraite</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {renderTestCategory(resultat.id, 'hematologie', 'Hématologie', resultat.donneesExtraites.hematologie)}
                      {renderTestCategory(resultat.id, 'biochimie', 'Biochimie', resultat.donneesExtraites.biochimie)}
                      {renderTestCategory(resultat.id, 'serologies', 'Sérologies', resultat.donneesExtraites.serologies)}
                      {renderTestCategory(resultat.id, 'hormones', 'Hormones', resultat.donneesExtraites.hormones)}
                      {renderTestCategory(resultat.id, 'autres', 'Autres examens', resultat.donneesExtraites.autres)}

                      {resultat.notes && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm font-medium text-slate-700">Notes</p>
                          <p className="text-sm text-slate-600 mt-1">{resultat.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un résultat de laboratoire</DialogTitle>
            <DialogDescription>
              Importez un PDF ou saisissez manuellement les résultats
            </DialogDescription>
          </DialogHeader>

          <Tabs value={manualEntry ? "manual" : "upload"} onValueChange={(v) => setManualEntry(v === "manual")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Importer PDF
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Pencil className="h-4 w-4 mr-2" />
                Saisie manuelle
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              {/* File input */}
            <div>
              <Label htmlFor="file">Fichier PDF</Label>
              <div className="mt-2">
                <Input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {selectedFile.name} ({Math.round(selectedFile.size / 1024)} Ko)
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="dateExamen">Date de l'examen *</Label>
              <Input
                id="dateExamen"
                type="date"
                value={formData.dateExamen}
                onChange={(e) => setFormData({ ...formData, dateExamen: e.target.value })}
                disabled={uploading}
              />
            </div>

            {/* Laboratoire */}
            <div>
              <Label htmlFor="laboratoire">Laboratoire</Label>
              <Input
                id="laboratoire"
                type="text"
                placeholder="ex: Biopath, Cerba..."
                value={formData.laboratoire}
                onChange={(e) => setFormData({ ...formData, laboratoire: e.target.value })}
                disabled={uploading}
              />
            </div>

            {/* Prescripteur */}
            <div>
              <Label htmlFor="prescripteur">Prescripteur</Label>
              <Input
                id="prescripteur"
                type="text"
                placeholder="Médecin prescripteur"
                value={formData.prescripteur}
                onChange={(e) => setFormData({ ...formData, prescripteur: e.target.value })}
                disabled={uploading}
              />
            </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Ajouter des notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={uploading}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              {/* Date */}
              <div>
                <Label htmlFor="dateExamenManual">Date de l'examen *</Label>
                <Input
                  id="dateExamenManual"
                  type="date"
                  value={formData.dateExamen}
                  onChange={(e) => setFormData({ ...formData, dateExamen: e.target.value })}
                  disabled={uploading}
                />
              </div>

              {/* Catégorie */}
              <div>
                <Label>Type de biologie *</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hematologie">Hématologie</SelectItem>
                    <SelectItem value="biochimie">Biochimie</SelectItem>
                    <SelectItem value="serologies">Sérologies</SelectItem>
                    <SelectItem value="hormones">Hormones</SelectItem>
                    <SelectItem value="autres">Autres examens</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && (
                <>
                  {/* Saisie du test */}
                  <div className="border rounded-lg p-4 bg-slate-50 space-y-3">
                    <h4 className="font-medium text-sm">Ajouter un résultat</h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <Label htmlFor="testNom">Nom du test *</Label>
                        <Input
                          id="testNom"
                          value={currentTest.nom}
                          onChange={(e) => {
                            setCurrentTest({ ...currentTest, nom: e.target.value })
                            if (e.target.value.length > 2) {
                              setShowHistory(e.target.value)
                            } else {
                              setShowHistory(null)
                            }
                          }}
                          placeholder="ex: Hémoglobine"
                        />

                        {/* Antériorité */}
                        {showHistory && currentTest.nom.length > 2 && (
                          (() => {
                            const history = getPreviousResults(currentTest.nom, selectedCategory)
                            if (history.length > 0) {
                              return (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                  <div className="flex items-center gap-2 text-xs font-medium text-blue-900 mb-2">
                                    <History className="h-3 w-3" />
                                    Antériorité trouvée :
                                  </div>
                                  <div className="space-y-1 text-xs">
                                    {history.map((prev: any, idx) => (
                                      <div key={idx} className="flex justify-between text-blue-700">
                                        <span>{formatDate(prev.dateExamen)}</span>
                                        <span className="font-mono font-medium">{prev.valeur} {prev.unite}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            }
                            return null
                          })()
                        )}
                      </div>

                      <div>
                        <Label htmlFor="testValeur">Valeur *</Label>
                        <Input
                          id="testValeur"
                          value={currentTest.valeur}
                          onChange={(e) => setCurrentTest({ ...currentTest, valeur: e.target.value })}
                          placeholder="ex: 13.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="testUnite">Unité</Label>
                        <Input
                          id="testUnite"
                          value={currentTest.unite}
                          onChange={(e) => setCurrentTest({ ...currentTest, unite: e.target.value })}
                          placeholder="ex: g/dL"
                        />
                      </div>

                      <div>
                        <Label htmlFor="testReference">Référence</Label>
                        <Input
                          id="testReference"
                          value={currentTest.reference}
                          onChange={(e) => setCurrentTest({ ...currentTest, reference: e.target.value })}
                          placeholder="ex: 12-16"
                        />
                      </div>

                      <div>
                        <Label htmlFor="testStatut">Statut</Label>
                        <Select
                          value={currentTest.statut}
                          onValueChange={(v: any) => setCurrentTest({ ...currentTest, statut: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="anormal">Anormal</SelectItem>
                            <SelectItem value="critique">Critique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={addManualTest}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter ce résultat
                    </Button>
                  </div>

                  {/* Liste des tests ajoutés */}
                  {manualTests.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-2">
                      <h4 className="font-medium text-sm mb-3">Résultats à enregistrer ({manualTests.length})</h4>
                      {manualTests.map((test, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{test.nom}</div>
                            <div className="text-xs text-slate-600">
                              {test.valeur} {test.unite}
                              {test.reference && ` (Réf: ${test.reference})`}
                              {' - '}
                              <Badge variant={getStatutBadgeVariant(test.statut) as any} className="text-xs">
                                {test.statut}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeManualTest(idx)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Laboratoire */}
              <div>
                <Label htmlFor="laboratoireManual">Laboratoire</Label>
                <Input
                  id="laboratoireManual"
                  type="text"
                  placeholder="ex: Biopath, Cerba..."
                  value={formData.laboratoire}
                  onChange={(e) => setFormData({ ...formData, laboratoire: e.target.value })}
                  disabled={uploading}
                />
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notesManual">Notes (optionnel)</Label>
                <Textarea
                  id="notesManual"
                  placeholder="Ajouter des notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={uploading}
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadOpen(false)
                setManualEntry(false)
                setSelectedCategory('')
                setManualTests([])
              }}
              disabled={uploading}
            >
              Annuler
            </Button>
            {manualEntry ? (
              <Button
                onClick={handleManualSubmit}
                disabled={!selectedCategory || manualTests.length === 0 || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Enregistrer ({manualTests.length} résultat{manualTests.length > 1 ? 's' : ''})
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader et analyser
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
