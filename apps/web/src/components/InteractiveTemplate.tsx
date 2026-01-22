import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

interface ParsedSection {
  type: 'text' | 'checkbox' | 'choice' | 'input'
  content: string
  options?: string[]
  selected?: string | boolean
  id: string
}

interface InteractiveTemplateProps {
  template: string
  onChange: (result: string) => void
  className?: string
}

/**
 * Composant qui transforme un template texte avec checkboxes/options
 * en interface interactive cliquable
 */
export function InteractiveTemplate({ template, onChange, className = '' }: InteractiveTemplateProps) {
  const [sections, setSections] = useState<ParsedSection[]>([])

  useEffect(() => {
    const parsed = parseTemplate(template)
    setSections(parsed)
  }, [template])

  // Parser le template
  const parseTemplate = (text: string): ParsedSection[] => {
    const lines = text.split('\n')
    const parsed: ParsedSection[] = []
    let idCounter = 0

    for (const line of lines) {
      const trimmed = line.trim()

      // Checkbox: ☐ Option
      if (trimmed.startsWith('☐')) {
        const content = trimmed.replace('☐', '').trim()
        parsed.push({
          type: 'checkbox',
          content,
          selected: false,
          id: `cb-${idCounter++}`
        })
      }
      // Options entre crochets: [option1/option2/option3]
      else if (trimmed.includes('[') && trimmed.includes(']')) {
        const match = trimmed.match(/^(.+?):\s*\[(.+?)\](.*)$/)
        if (match) {
          const [, label, optionsStr, suffix] = match
          const options = optionsStr.split('/').map(o => o.trim())
          parsed.push({
            type: 'choice',
            content: label.trim(),
            options,
            selected: '',
            id: `choice-${idCounter++}`
          })
        } else {
          // Texte normal qui contient des crochets mais pas formaté
          parsed.push({
            type: 'text',
            content: line,
            id: `text-${idCounter++}`
          })
        }
      }
      // Texte normal
      else {
        parsed.push({
          type: 'text',
          content: line,
          id: `text-${idCounter++}`
        })
      }
    }

    return parsed
  }

  // Toggle checkbox
  const toggleCheckbox = (id: string) => {
    const updated = sections.map(s =>
      s.id === id && s.type === 'checkbox'
        ? { ...s, selected: !s.selected }
        : s
    )
    setSections(updated)
    updateResult(updated)
  }

  // Select choice
  const selectChoice = (id: string, option: string) => {
    const updated = sections.map(s =>
      s.id === id && s.type === 'choice'
        ? { ...s, selected: option }
        : s
    )
    setSections(updated)
    updateResult(updated)
  }

  // Générer le résultat final
  const updateResult = (updatedSections: ParsedSection[]) => {
    const result = updatedSections.map(section => {
      if (section.type === 'checkbox') {
        // Seulement inclure les checkboxes cochées
        return section.selected ? `• ${section.content}` : ''
      } else if (section.type === 'choice') {
        // Inclure le label + option sélectionnée
        if (section.selected) {
          return `${section.content}: ${section.selected}`
        }
        return ''
      } else {
        // Texte normal
        return section.content
      }
    }).filter(Boolean).join('\n')

    onChange(result)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {sections.map((section) => {
        if (section.type === 'text') {
          // Texte normal - headers, descriptions, etc.
          const isHeader = section.content.startsWith('===') ||
                          section.content.endsWith('===') ||
                          section.content.toUpperCase() === section.content && section.content.length > 0

          return (
            <div
              key={section.id}
              className={`
                ${isHeader ? 'font-semibold text-slate-900 text-sm uppercase tracking-wide' : 'text-slate-600 text-sm'}
                ${section.content === '' ? 'h-2' : ''}
              `}
            >
              {section.content.replace(/===/g, '').trim()}
            </div>
          )
        }

        if (section.type === 'checkbox') {
          return (
            <button
              key={section.id}
              onClick={() => toggleCheckbox(section.id)}
              className={`
                w-full text-left px-4 py-2.5 rounded-lg border-2 transition-all
                flex items-center gap-3 group hover:shadow-sm
                ${section.selected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }
              `}
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                ${section.selected
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-slate-300 group-hover:border-slate-400'
                }
              `}>
                {section.selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
              </div>
              <span className="flex-1 text-sm font-medium">{section.content}</span>
            </button>
          )
        }

        if (section.type === 'choice' && section.options) {
          return (
            <div key={section.id} className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {section.content}
              </label>
              <div className="flex flex-wrap gap-2">
                {section.options.map((option, idx) => {
                  const isSelected = section.selected === option
                  return (
                    <button
                      key={idx}
                      onClick={() => selectChoice(section.id, option)}
                      className={`
                        px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium
                        ${isSelected
                          ? 'border-green-500 bg-green-50 text-green-900 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }
                      `}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

/**
 * Version simplifiée pour la carte Examen Clinique
 * Clic sur un mot = seul qui reste
 */
export function InteractiveExamenClinique({
  defaultText = '',
  onChange
}: {
  defaultText?: string
  onChange: (text: string) => void
}) {
  const [selections, setSelections] = useState<Record<string, string>>({})

  const categories = [
    {
      title: 'État général',
      field: 'etatGeneral',
      options: ['Bon', 'Moyen', 'Altéré', 'Fatigué']
    },
    {
      title: 'État physique',
      field: 'etatPhysique',
      options: ['Bon', 'Surveillance', 'Préoccupant']
    },
    {
      title: 'Conscience',
      field: 'conscience',
      options: ['Normale', 'Confuse', 'Somnolente']
    },
    {
      title: 'Coloration',
      field: 'coloration',
      options: ['Normale', 'Pâle', 'Cyanosée', 'Ictérique']
    },
    {
      title: 'Auscultation pulmonaire',
      field: 'poumons',
      options: ['Normale', 'Crépitants', 'Sibilants', 'Diminuée']
    },
    {
      title: 'Auscultation cardiaque',
      field: 'coeur',
      options: ['Normale', 'Souffle', 'Irrégulière', 'Tachycardie']
    },
    {
      title: 'Abdomen',
      field: 'abdomen',
      options: ['Souple', 'Ballonné', 'Douloureux', 'Défense']
    },
    {
      title: 'Membres inférieurs',
      field: 'membresInf',
      options: ['Normaux', 'Œdèmes', 'Varices', 'Douleur mollet']
    },
  ]

  const updateSelection = (field: string, value: string) => {
    const newSelections = { ...selections, [field]: value }
    setSelections(newSelections)

    // Générer le texte formaté
    const text = Object.entries(newSelections)
      .map(([key, val]) => {
        const category = categories.find(c => c.field === key)
        if (category && val) {
          return `${category.title}: ${val}`
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')

    onChange(text)
  }

  return (
    <Card className="p-5 bg-gradient-to-br from-blue-50/30 to-white border-blue-100">
      <div className="space-y-3.5">
        {categories.map((category) => (
          <div key={category.field} className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-blue-500" />
              {category.title}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {category.options.map((option) => {
                const isSelected = selections[category.field] === option
                return (
                  <button
                    key={option}
                    onClick={() => updateSelection(category.field, option)}
                    className={`
                      px-3 py-1.5 rounded-md border transition-all text-sm font-mono font-medium
                      ${isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
                      }
                    `}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Zone de texte libre pour compléments */}
        <div className="pt-3 border-t border-slate-200">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
            Notes complémentaires
          </label>
          <textarea
            placeholder="Ajoutez des observations supplémentaires..."
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all resize-none text-sm font-mono"
            rows={3}
            onChange={(e) => {
              const baseText = Object.entries(selections)
                .map(([key, val]) => {
                  const category = categories.find(c => c.field === key)
                  if (category && val) {
                    return `${category.title}: ${val}`
                  }
                  return ''
                })
                .filter(Boolean)
                .join('\n')

              const fullText = e.target.value
                ? `${baseText}\n\nNotes:\n${e.target.value}`
                : baseText

              onChange(fullText)
            }}
          />
        </div>
      </div>
    </Card>
  )
}
