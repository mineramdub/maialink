import { AlertTriangle, Info, AlertCircle, Lightbulb, Copy } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface AlertItem {
  type: 'danger' | 'warning' | 'info'
  message: string
  recommendations?: string[]
}

interface Suggestion {
  field: string
  text: string
  category: 'normal' | 'attention' | 'urgent'
}

interface Props {
  alerts: AlertItem[]
  suggestions: Suggestion[]
  onApplySuggestion: (field: string, text: string) => void
}

export function ConsultationSuggestions({ alerts, suggestions, onApplySuggestion }: Props) {
  if (alerts.length === 0 && suggestions.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Alertes */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Alertes cliniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, index) => (
              <Alert
                key={index}
                variant={alert.type === 'danger' ? 'destructive' : 'default'}
                className={
                  alert.type === 'warning'
                    ? 'border-orange-300 bg-orange-50'
                    : alert.type === 'info'
                    ? 'border-blue-300 bg-blue-50'
                    : ''
                }
              >
                {alert.type === 'danger' && <AlertCircle className="h-4 w-4" />}
                {alert.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                {alert.type === 'info' && <Info className="h-4 w-4" />}
                <AlertTitle>{alert.message}</AlertTitle>
                {alert.recommendations && (
                  <AlertDescription>
                    <div className="mt-2 space-y-1">
                      <strong>Conduite à tenir :</strong>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {alert.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                )}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-blue-900">
              <Lightbulb className="h-5 w-5" />
              Suggestions IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        suggestion.category === 'urgent'
                          ? 'destructive'
                          : suggestion.category === 'attention'
                          ? 'default'
                          : 'secondary'
                      }
                      className="text-xs"
                    >
                      {suggestion.field === 'examenClinique'
                        ? 'Examen'
                        : suggestion.field === 'conclusion'
                        ? 'Conclusion'
                        : suggestion.field}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700">{suggestion.text}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onApplySuggestion(suggestion.field, suggestion.text)}
                  className="shrink-0"
                  title="Copier dans le champ"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
