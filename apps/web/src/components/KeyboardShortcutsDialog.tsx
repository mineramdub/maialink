import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Badge } from './ui/badge'
import { Command, Keyboard } from 'lucide-react'

interface Shortcut {
  keys: string[]
  description: string
  category: string
}

const shortcuts: Shortcut[] = [
  // Palette de commandes
  { keys: ['⌘', 'K'], description: 'Ouvrir la palette de commandes', category: 'Général' },
  { keys: ['⌘', '/'], description: 'Afficher ce guide', category: 'Général' },
  { keys: ['Esc'], description: 'Fermer les dialogs', category: 'Général' },

  // Navigation
  { keys: ['⌘', 'H'], description: 'Tableau de bord', category: 'Navigation' },
  { keys: ['⌘', '1'], description: 'Tableau de bord', category: 'Navigation' },
  { keys: ['⌘', '2'], description: 'Patients', category: 'Navigation' },
  { keys: ['⌘', '3'], description: 'Agenda', category: 'Navigation' },
  { keys: ['⌘', '4'], description: 'Documents', category: 'Navigation' },
  { keys: ['⌘', 'P'], description: 'Recherche patient', category: 'Navigation' },
  { keys: ['⌘', 'G'], description: 'Grossesses', category: 'Navigation' },

  // Actions rapides
  { keys: ['⌘', 'N'], description: 'Nouvelle consultation', category: 'Actions' },
  { keys: ['⌘', 'O'], description: 'Nouvelle ordonnance', category: 'Actions' },
  { keys: ['⌘', 'D'], description: 'Générer un document', category: 'Actions' },
  { keys: ['⌘', '⇧', 'P'], description: 'Nouveau patient', category: 'Actions' },
  { keys: ['⌘', '⇧', 'C'], description: 'Consultation rapide', category: 'Actions' },

  // Édition
  { keys: ['⌘', 'E'], description: 'Éditer (contexte actuel)', category: 'Édition' },
]

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleShow = () => setOpen(true)
    document.addEventListener('show-keyboard-shortcuts', handleShow)
    return () => document.removeEventListener('show-keyboard-shortcuts', handleShow)
  }, [])

  const categories = Array.from(new Set(shortcuts.map(s => s.category)))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Raccourcis Clavier
          </DialogTitle>
          <DialogDescription>
            Gagnez du temps avec ces raccourcis clavier. Sur Mac, utilisez ⌘ (Cmd). Sur Windows/Linux, utilisez Ctrl.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">{category}</h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm text-slate-700">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <kbd className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded shadow-sm">
                              {key}
                            </kbd>
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-slate-400 text-xs">+</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Command className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Astuce</p>
              <p className="text-blue-700">
                Appuyez sur <kbd className="px-1.5 py-0.5 bg-blue-100 rounded">⌘K</kbd> pour ouvrir la palette de commandes et accéder rapidement à toutes les fonctionnalités.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
