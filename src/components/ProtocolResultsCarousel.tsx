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
    <Card className="border border-blue-300 bg-blue-50">
      <CardContent className="p-2">
        {/* HEADER compact */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-blue-900">
              {currentIndex + 1}/{allResults.length}
            </span>
            <span className="text-xs text-blue-700 truncate max-w-[120px]">
              {currentResult.protocolName}
            </span>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
              p.{currentResult.pageNumber}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {allResults.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className="h-6 w-6 p-0 hover:bg-blue-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  className="h-6 w-6 p-0 hover:bg-blue-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* EXTRAIT - Plus compact */}
        <div className="bg-white p-2 rounded border border-blue-200 mb-2">
          <p className="text-xs text-gray-700 leading-snug line-clamp-2">
            {currentResult.excerpt}
          </p>
        </div>

        {/* BOUTON - Plus compact */}
        <Button
          onClick={handleOpenPDF}
          size="sm"
          className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700"
        >
          <ExternalLink className="h-3 w-3 mr-1.5" />
          Ouvrir PDF
        </Button>

        {/* DOTS - Plus compact */}
        {allResults.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {allResults.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${
                  idx === currentIndex
                    ? 'bg-blue-600 w-4 h-1.5'
                    : 'bg-blue-300 hover:bg-blue-400 w-1.5 h-1.5'
                }`}
                aria-label={`Aller au résultat ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
