import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Progress } from '../../components/ui/progress'
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Cpu,
  X,
  Clock,
  File,
  Zap
} from 'lucide-react'

type Step = 'upload' | 'analyze' | 'validate'

interface AnalysisResult {
  category: string
  description: string
  pageCount: number
  textLength: number
}

interface FileInfo {
  path: string
  originalName: string
  size: number
  sizeHuman: string
  filename: string
  mimeType: string
  isValidPdf: boolean
}

interface Timing {
  step: string
  durationMs: number
}

interface LogEntry {
  timestamp: Date
  message: string
  type: 'info' | 'success' | 'error' | 'progress'
}

export default function ProtocolUploadWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('upload')

  // Upload state
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  // Validation state
  const [nom, setNom] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingMessage, setProcessingMessage] = useState('')
  const [, setProtocolId] = useState<string | null>(null)

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date(), message, type }])
  }

  // File drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
      setNom(droppedFile.name.replace('.pdf', '').replace(/_/g, ' '))
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setNom(selectedFile.name.replace('.pdf', '').replace(/_/g, ' '))
    }
  }

  // Helper to format duration
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  // Start analysis
  const startAnalysis = async () => {
    if (!file) return

    setStep('analyze')
    setIsAnalyzing(true)
    setAnalysisError(null)
    setLogs([])

    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info')
    addLog('🚀 Démarrage de l\'import', 'info')
    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info')
    addLog('', 'info')
    addLog(`📄 Fichier: ${file.name}`, 'info')
    addLog(`📁 Type: ${file.type || 'application/pdf'}`, 'info')
    addLog(`📊 Taille: ${formatFileSize(file.size)}`, 'info')
    addLog('', 'info')

    try {
      const formData = new FormData()
      formData.append('file', file)

      addLog('⬆️  Upload vers le serveur...', 'progress')

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const uploadStart = Date.now()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/protocols/analyze`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const uploadDuration = Date.now() - uploadStart

      const data = await response.json()

      if (!response.ok || !data.success) {
        const errorMsg = data.details || data.error || 'Erreur lors de l\'analyse'

        // Log specific error type
        if (response.status === 429) {
          addLog('❌ Quota API dépassé', 'error')
          addLog(data.details || 'Réessayez dans quelques minutes', 'error')
        } else if (response.status === 503) {
          addLog('❌ Service IA indisponible', 'error')
        }

        throw new Error(errorMsg)
      }

      addLog(`✅ Upload terminé (${formatDuration(uploadDuration)})`, 'success')
      addLog('', 'info')

      // Show detailed file info from server
      addLog('━━━ Informations fichier ━━━', 'info')
      addLog(`📄 Nom: ${data.file.originalName}`, 'info')
      addLog(`📁 Type MIME: ${data.file.mimeType}`, 'info')
      addLog(`📊 Taille: ${data.file.sizeHuman}`, 'info')
      addLog(`✅ PDF valide: ${data.file.isValidPdf ? 'Oui' : 'Non'}`, data.file.isValidPdf ? 'success' : 'error')
      addLog('', 'info')

      // Show parsing info
      addLog('━━━ Extraction du texte ━━━', 'info')
      const parseTime = data.timings?.find((t: Timing) => t.step === 'pdf_parse')
      addLog(`📑 Pages extraites: ${data.analysis.pageCount}`, 'success')
      addLog(`📝 Caractères extraits: ${data.analysis.textLength.toLocaleString()}`, 'success')
      if (parseTime) {
        addLog(`⏱️  Temps d'extraction: ${formatDuration(parseTime.durationMs)}`, 'info')
      }
      addLog('', 'info')

      // Show Claude analysis info
      addLog('━━━ Analyse Claude IA ━━━', 'info')
      const claudeTime = data.timings?.find((t: Timing) => t.step === 'claude_analysis')
      addLog(`🤖 Appel Claude CLI...`, 'progress')
      if (claudeTime) {
        addLog(`⏱️  Temps d'analyse: ${formatDuration(claudeTime.durationMs)}`, 'info')
      }
      addLog(`🏷️  Catégorie: ${data.analysis.category}`, 'success')
      addLog(`📝 Description générée`, 'success')
      addLog('', 'info')

      // Show total time
      addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info')
      addLog(`✅ Analyse terminée en ${formatDuration(data.totalDurationMs || uploadDuration)}`, 'success')
      addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info')

      setAnalysisResult(data.analysis)
      setFileInfo(data.file)
      setCategory(data.analysis.category)
      setDescription(data.analysis.description)

      setStep('validate')

    } catch (error: any) {
      console.error('Analysis error:', error)
      addLog('', 'info')
      addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'error')
      addLog(`❌ ${error.message || 'Erreur lors de l\'analyse'}`, 'error')
      addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'error')
      setAnalysisError(error.message || 'Erreur lors de l\'analyse')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Create and process protocol
  const createAndProcess = async () => {
    if (!fileInfo || !category) return

    setIsProcessing(true)
    setLogs([])
    addLog('Création du protocole...', 'info')

    try {
      // Create protocol
      const createResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/protocols`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          description,
          category,
          filename: fileInfo.filename,
          pageCount: analysisResult?.pageCount,
        }),
      })

      const createData = await createResponse.json()

      if (!createData.success) {
        throw new Error(createData.error || 'Erreur lors de la création')
      }

      addLog('Protocole créé', 'success')
      const newProtocolId = createData.protocol.id
      setProtocolId(newProtocolId)

      // Start processing in background
      addLog('Démarrage du traitement des embeddings...', 'info')

      fetch(`${import.meta.env.VITE_API_URL}/api/protocols/${newProtocolId}/process`, {
        method: 'POST',
        credentials: 'include',
      }).catch(console.error)

      // Poll for progress
      const pollProgress = async () => {
        try {
          const statusResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/protocols/${newProtocolId}/status`,
            { credentials: 'include' }
          )
          const statusData = await statusResponse.json()

          if (statusData.success) {
            if (statusData.progress && statusData.progress.length > 0) {
              const lastProgress = statusData.progress[statusData.progress.length - 1]
              setProcessingMessage(lastProgress.message)

              if (lastProgress.total > 0) {
                const pct = Math.round((lastProgress.progress / lastProgress.total) * 100)
                setProcessingProgress(pct)
              }

              // Update logs with new messages
              if (lastProgress.step !== 'init') {
                addLog(lastProgress.message, lastProgress.step === 'done' ? 'success' : 'progress')
              }
            }

            if (statusData.status === 'completed') {
              addLog('Traitement terminé avec succès!', 'success')
              setIsProcessing(false)
              // Navigate to protocol detail after short delay
              setTimeout(() => {
                navigate(`/protocoles/${newProtocolId}`)
              }, 1500)
              return
            }

            if (statusData.status === 'error') {
              throw new Error(statusData.error || 'Erreur lors du traitement')
            }

            // Continue polling
            setTimeout(pollProgress, 1000)
          }
        } catch (error: any) {
          console.error('Status poll error:', error)
          addLog(error.message || 'Erreur lors du suivi', 'error')
          setIsProcessing(false)
        }
      }

      // Start polling after a short delay
      setTimeout(pollProgress, 1000)

    } catch (error: any) {
      console.error('Create error:', error)
      addLog(error.message || 'Erreur lors de la création', 'error')
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Importer un protocole</h1>
          <p className="text-slate-500 mt-1">
            {step === 'upload' && 'Étape 1/3 : Sélection du fichier'}
            {step === 'analyze' && 'Étape 2/3 : Analyse IA'}
            {step === 'validate' && 'Étape 3/3 : Validation et traitement'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/protocoles')}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        <div className={`flex-1 h-2 rounded-full ${step === 'upload' ? 'bg-blue-500' : 'bg-green-500'}`} />
        <div className={`flex-1 h-2 rounded-full ${step === 'upload' ? 'bg-slate-200' : step === 'analyze' ? 'bg-blue-500' : 'bg-green-500'}`} />
        <div className={`flex-1 h-2 rounded-full ${step === 'validate' ? 'bg-blue-500' : 'bg-slate-200'}`} />
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Sélectionnez votre fichier PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : file
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-3">
                  <FileText className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                    Changer de fichier
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Glissez-déposez votre fichier PDF ici
                    </p>
                    <p className="text-sm text-slate-500">ou cliquez pour sélectionner</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Parcourir
                    </label>
                  </Button>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-6 flex justify-end">
                <Button onClick={startAnalysis}>
                  Analyser avec l'IA
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Analyze */}
      {step === 'analyze' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Analyse en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAnalyzing && (
              <>
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="font-medium">Analyse du document...</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </>
            )}

            {/* Logs */}
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`py-1 ${
                    log.type === 'success'
                      ? 'text-green-400'
                      : log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'progress'
                      ? 'text-blue-400'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-500">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>{' '}
                  {log.message}
                </div>
              ))}
              {isAnalyzing && (
                <div className="py-1 text-slate-400 animate-pulse">▌</div>
              )}
            </div>

            {analysisError && (
              <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{analysisError}</span>
              </div>
            )}

            {analysisError && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <Button onClick={startAnalysis}>
                  Réessayer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Validate */}
      {step === 'validate' && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Validation des informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Analysis Summary */}
            {analysisResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Résultat de l'analyse IA
                </h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Pages :</strong> {analysisResult.pageCount}</p>
                  <p><strong>Caractères :</strong> {analysisResult.textLength.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Editable Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du protocole *</Label>
                <Input
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Protocole suivi grossesse T1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie (détectée par l'IA) *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Grossesse, Post-partum, Gynécologie..."
                />
                <p className="text-xs text-slate-500">
                  Catégorie libre suggérée par l'IA. Vous pouvez la modifier.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (générée par l'IA)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Description du protocole..."
                />
              </div>
            </div>

            <div className="flex gap-2 justify-between">
              <Button variant="outline" onClick={() => setStep('upload')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <Button onClick={createAndProcess} disabled={!nom || !category}>
                <Cpu className="h-4 w-4 mr-2" />
                Valider et traiter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 animate-pulse text-blue-500" />
              Traitement en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{processingMessage || 'Initialisation...'}</span>
                <span className="font-medium">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="h-3" />
            </div>

            {/* Processing Logs */}
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`py-1 ${
                    log.type === 'success'
                      ? 'text-green-400'
                      : log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'progress'
                      ? 'text-blue-400'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-500">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>{' '}
                  {log.message}
                </div>
              ))}
              <div className="py-1 text-slate-400 animate-pulse">▌</div>
            </div>

            <p className="text-sm text-slate-500 text-center">
              Le traitement peut prendre quelques minutes selon la taille du document.
              <br />
              Vous serez redirigé automatiquement une fois terminé.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
