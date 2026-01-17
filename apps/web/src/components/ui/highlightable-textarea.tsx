import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Highlighter } from "lucide-react"

interface HighlightColor {
  name: string
  color: string
  bgColor: string
}

const HIGHLIGHT_COLORS: HighlightColor[] = [
  { name: 'Jaune', color: 'text-yellow-900', bgColor: 'bg-yellow-200' },
  { name: 'Vert', color: 'text-green-900', bgColor: 'bg-green-200' },
  { name: 'Bleu', color: 'text-blue-900', bgColor: 'bg-blue-200' },
  { name: 'Rose', color: 'text-pink-900', bgColor: 'bg-pink-200' },
  { name: 'Orange', color: 'text-orange-900', bgColor: 'bg-orange-200' },
  { name: 'Violet', color: 'text-purple-900', bgColor: 'bg-purple-200' },
]

export interface HighlightableTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  error?: boolean
  disabled?: boolean
  id?: string
}

export const HighlightableTextarea = React.forwardRef<HTMLDivElement, HighlightableTextareaProps>(
  ({ value, onChange, placeholder, rows = 5, className, error, disabled, id }, ref) => {
    const [selectedColor, setSelectedColor] = React.useState<HighlightColor>(HIGHLIGHT_COLORS[0])
    const [showToolbar, setShowToolbar] = React.useState(false)
    const editableRef = React.useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = React.useState(false)

    // Handle text selection
    const handleTextSelect = () => {
      const selection = window.getSelection()
      if (selection && selection.toString().length > 0) {
        setShowToolbar(true)
      } else {
        setShowToolbar(false)
      }
    }

    // Apply highlight to selected text
    const applyHighlight = (color: HighlightColor) => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      if (!editableRef.current?.contains(range.commonAncestorContainer)) return

      // Create highlight span
      const span = document.createElement('span')
      span.className = `${color.bgColor} ${color.color} px-0.5 rounded`
      span.setAttribute('data-highlight', 'true')

      try {
        range.surroundContents(span)

        // Update value
        if (editableRef.current) {
          onChange(editableRef.current.innerHTML)
        }

        // Clear selection
        selection.removeAllRanges()
        setShowToolbar(false)
      } catch (e) {
        console.error('Failed to apply highlight:', e)
      }
    }

    // Remove highlight from selected text
    const removeHighlight = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer

      // If the container is a text node, check its parent
      let element: HTMLElement | null = null
      if (container.nodeType === Node.TEXT_NODE) {
        element = container.parentElement
      } else if (container.nodeType === Node.ELEMENT_NODE) {
        element = container as HTMLElement
      }

      // Remove highlight span
      if (element?.hasAttribute('data-highlight')) {
        const text = element.textContent || ''
        element.replaceWith(document.createTextNode(text))

        if (editableRef.current) {
          onChange(editableRef.current.innerHTML)
        }
      }

      selection.removeAllRanges()
      setShowToolbar(false)
    }

    // Handle input changes
    const handleInput = () => {
      if (editableRef.current) {
        onChange(editableRef.current.innerHTML)
      }
    }

    // Sync value to contentEditable
    React.useEffect(() => {
      if (editableRef.current && editableRef.current.innerHTML !== value) {
        editableRef.current.innerHTML = value
      }
    }, [value])

    // Handle click outside to hide toolbar
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (editableRef.current && !editableRef.current.contains(e.target as Node)) {
          setShowToolbar(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const minHeight = rows ? `${rows * 24}px` : '120px'

    return (
      <div className="relative">
        {/* Toolbar */}
        {showToolbar && isFocused && !disabled && (
          <div className="absolute -top-12 left-0 z-10 flex items-center gap-1 bg-white border border-slate-200 rounded-lg shadow-lg p-1">
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color)
                    applyHighlight(color)
                  }}
                  className={cn(
                    "w-7 h-7 rounded flex items-center justify-center transition-all hover:scale-110",
                    color.bgColor,
                    selectedColor.name === color.name && "ring-2 ring-slate-400"
                  )}
                  title={`Surligner en ${color.name}`}
                >
                  <div className={cn("w-4 h-4 rounded", color.bgColor)} />
                </button>
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={removeHighlight}
              className="h-7 px-2 text-xs"
              title="Enlever le surlignage"
            >
              <Highlighter className="h-3.5 w-3.5 mr-1" />
              Retirer
            </Button>
          </div>
        )}

        {/* Editable area */}
        <div
          ref={editableRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onMouseUp={handleTextSelect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            setTimeout(() => setShowToolbar(false), 200)
          }}
          className={cn(
            "w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 overflow-auto whitespace-pre-wrap",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-slate-300 focus-visible:ring-slate-500",
            disabled && "bg-slate-50",
            className
          )}
          style={{ minHeight }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />

        {/* Placeholder */}
        {!value && placeholder && !isFocused && (
          <div className="absolute top-2 left-3 text-sm text-slate-400 pointer-events-none">
            {placeholder}
          </div>
        )}

        {/* Helper text */}
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <Highlighter className="h-3 w-3" />
          <span>Sélectionnez du texte pour le surligner</span>
        </div>
      </div>
    )
  }
)

HighlightableTextarea.displayName = "HighlightableTextarea"
