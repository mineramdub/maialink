import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'
import { FileText, Search, Plus } from 'lucide-react'
import { Badge } from './ui/badge'
import type { ConsultationTextTemplate } from '../lib/consultationTemplates'

interface Props {
  templates: ConsultationTextTemplate[]
  onSelect: (text: string) => void
  label?: string
}

export function TextTemplateSelector({ templates, onSelect, label = "Templates" }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredTemplates = search
    ? templates.filter(
        (t) =>
          t.label.toLowerCase().includes(search.toLowerCase()) ||
          t.text.toLowerCase().includes(search.toLowerCase()) ||
          t.keywords?.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      )
    : templates

  const categories = Array.from(new Set(filteredTemplates.map((t) => t.category)))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <div className="flex items-center gap-2 p-3 border-b">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher un template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 h-8"
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {categories.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Aucun template trouvé
            </div>
          ) : (
            categories.map((category) => (
              <div key={category} className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 px-2">
                  {category}
                </h4>
                <div className="space-y-1">
                  {filteredTemplates
                    .filter((t) => t.category === category)
                    .map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          onSelect(template.text)
                          setOpen(false)
                          setSearch('')
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-slate-900 mb-1">
                              {template.label}
                            </div>
                            <div className="text-xs text-slate-600 line-clamp-2">
                              {template.text}
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-slate-400 shrink-0" />
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
