import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Lightbulb, Check, X, ChevronDown, ChevronUp } from 'lucide-react'

interface Suggestion {
  id: string
  type: string
  data: any
  confidence: number
  explanation: string
}

interface SmartSuggestionsProps {
  context: {
    consultationType?: string
    sa?: number
    motif?: string
    ageGroupe?: string
    parite?: number
  }
  onAccept: (suggestion: Suggestion) => void
  onReject: (suggestionId: string, feedback?: string) => void
}

export function SmartSuggestions({ context, onAccept, onReject }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  // Fetch suggestions when context changes
  useEffect(() => {
    if (!context.consultationType) return

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/practice-learning/suggestions`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ context }),
          }
        )

        if (res.ok) {
          const data = await res.json()
          setSuggestions(data.suggestions || [])
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [context.consultationType, context.sa, context.motif])

  const handleAccept = async (suggestion: Suggestion) => {
    // Call parent handler
    onAccept(suggestion)

    // Track acceptance
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/practice-learning/suggestions/${suggestion.id}/accept`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
    } catch (error) {
      console.error('Error tracking acceptance:', error)
    }

    // Remove from list
    setDismissedIds(prev => new Set(prev).add(suggestion.id))
  }

  const handleReject = async (suggestion: Suggestion) => {
    // Call parent handler
    onReject(suggestion.id)

    // Track rejection
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/practice-learning/suggestions/${suggestion.id}/reject`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
    } catch (error) {
      console.error('Error tracking rejection:', error)
    }

    // Remove from list
    setDismissedIds(prev => new Set(prev).add(suggestion.id))
  }

  const getSuggestionLabel = (type: string): string => {
    const labels: Record<string, string> = {
      prescription: 'Prescription',
      examen: 'Examen',
      conseil: 'Conseil',
      diagnostic: 'Diagnostic',
    }
    return labels[type] || type
  }

  const getSuggestionBadgeColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-300'
    if (confidence >= 0.6) return 'bg-blue-100 text-blue-800 border-blue-300'
    return 'bg-slate-100 text-slate-800 border-slate-300'
  }

  const getSuggestionContent = (suggestion: Suggestion): string => {
    if (suggestion.type === 'prescription' && suggestion.data.prescription) {
      const { medicament, dosage, duree } = suggestion.data.prescription
      return `${medicament}${dosage ? ` - ${dosage}` : ''}${duree ? ` pendant ${duree}` : ''}`
    }
    if (suggestion.type === 'examen' && suggestion.data.examen) {
      return suggestion.data.examen.libelle
    }
    if (suggestion.type === 'conseil' && suggestion.data.conseil) {
      return suggestion.data.conseil
    }
    return 'Suggestion'
  }

  const visibleSuggestions = suggestions.filter(s => !dismissedIds.has(s.id))

  if (visibleSuggestions.length === 0) return null

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-base">
              Suggestions intelligentes
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {visibleSuggestions.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Basées sur vos habitudes de pratique
        </p>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-2">
          {isLoading ? (
            <div className="text-center py-4 text-sm text-slate-500">
              Chargement des suggestions...
            </div>
          ) : (
            visibleSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={getSuggestionBadgeColor(suggestion.confidence)}
                      >
                        {getSuggestionLabel(suggestion.type)}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {Math.round(suggestion.confidence * 100)}% de confiance
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-900 mb-1">
                      {getSuggestionContent(suggestion)}
                    </p>

                    <p className="text-xs text-slate-600">
                      {suggestion.explanation}
                    </p>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleAccept(suggestion)}
                      title="Accepter"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(suggestion)}
                      title="Refuser"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      )}
    </Card>
  )
}
