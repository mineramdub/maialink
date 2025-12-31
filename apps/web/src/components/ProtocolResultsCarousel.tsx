import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface ProtocolResult {
  chunkId: string
  excerpt: string
  pageNumber: number
}

interface ProtocolSource {
  protocolId: string
  protocolName: string
  fileUrl: string
  results: ProtocolResult[]
}

interface Props {
  sources: ProtocolSource[]
}

export function ProtocolResultsCarousel({ sources }: Props) {
  // Aplatir tous les résultats dans un seul tableau pour le carrousel
  const allResults = sources.flatMap(source =>
    source.results.map(result => ({
      ...result,
      protocolName: source.protocolName,
      fileUrl: source.fileUrl,
      protocolId: source.protocolId
    }))
  )

  const [currentIndex, setCurrentIndex] = useState(0)

  if (allResults.length === 0) {
    return null
  }

  const currentResult = allResults[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allResults.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allResults.length - 1 ? 0 : prev + 1))
  }

  const handleOpenPDF = () => {
    // Ouvrir le PDF à la page spécifique
    // Format: /uploads/protocols/file.pdf#page=23
    const pdfUrl = `${import.meta.env.VITE_API_URL}${currentResult.fileUrl}#page=${currentResult.pageNumber}`
    window.open(pdfUrl, '_blank')
  }

  // RACCOURCIS CLAVIER pour navigation rapide en situation clinique
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Flèche gauche ou P (Previous) = résultat précédent
      if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        handlePrevious()
      }
      // Flèche droite ou N (Next) = résultat suivant
      else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        handleNext()
      }
      // Entrée ou O (Open) = ouvrir PDF
      else if (e.key === 'Enter' || e.key === 'o' || e.key === 'O') {
        e.preventDefault()
        handleOpenPDF()
      }
      // Chiffre 1-9 = aller directement au résultat
      else if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1
        if (index < allResults.length) {
          e.preventDefault()
          setCurrentIndex(index)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [allResults.length, currentIndex])

  return (
    <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
      <CardContent className="p-4">
        {/* HEADER - Compact mais informatif */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-blue-900">
              {currentIndex + 1}/{allResults.length}
            </span>
            <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded">
              {currentResult.protocolName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={allResults.length === 1}
              className="h-10 w-10 p-0 border-2 border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={allResults.length === 1}
              className="h-10 w-10 p-0 border-2 border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* PAGE NUMBER - TRÈS visible */}
        <div className="mb-3">
          <span className="inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold bg-green-500 text-white shadow-md">
            📄 Page {currentResult.pageNumber}
          </span>
        </div>

        {/* EXTRAIT - Lecture rapide */}
        <div className="bg-white p-4 rounded-lg border-2 border-blue-300 mb-3 shadow-sm">
          <p className="text-base text-gray-800 leading-relaxed">
            {currentResult.excerpt.substring(0, 250)}
            {currentResult.excerpt.length > 250 && <span className="text-gray-400">...</span>}
          </p>
        </div>

        {/* BOUTON PRINCIPAL - TRÈS visible et gros */}
        <Button
          onClick={handleOpenPDF}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
        >
          <ExternalLink className="h-6 w-6 mr-2" />
          Ouvrir le PDF (Page {currentResult.pageNumber})
        </Button>

        {/* DOTS DE NAVIGATION - Si plusieurs résultats */}
        {allResults.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {allResults.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${
                  idx === currentIndex
                    ? 'bg-blue-600 w-8 h-3'
                    : 'bg-blue-300 hover:bg-blue-400 w-3 h-3'
                }`}
                aria-label={`Aller au résultat ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* RACCOURCIS CLAVIER - Info */}
        <div className="mt-3 pt-3 border-t border-blue-300">
          <p className="text-xs text-blue-700 text-center font-medium">
            ⌨️ Raccourcis: ← → (navigation) • Entrée (ouvrir) • 1-9 (résultat direct)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
