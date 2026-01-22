import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ShortcutsDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener('show-keyboard-shortcuts', handler)
    return () => document.removeEventListener('show-keyboard-shortcuts', handler)
  }, [])

  const shortcuts = [
    {
      category: 'Général',
      items: [
        { keys: ['⌘', 'K'], description: 'Ouvrir la palette de commandes' },
        { keys: ['⌘', '/'], description: 'Afficher les raccourcis' },
        { keys: ['Esc'], description: 'Fermer modal/dialog' },
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['⌘', 'H'], description: 'Tableau de bord' },
        { keys: ['⌘', '1'], description: 'Tableau de bord (alt)' },
        { keys: ['⌘', 'P'], description: 'Recherche patient' },
        { keys: ['⌘', '2'], description: 'Patientes' },
        { keys: ['⌘', 'G'], description: 'Grossesses' },
        { keys: ['⌘', '3'], description: 'Agenda' },
        { keys: ['⌘', '4'], description: 'Documents' },
      ]
    },
    {
      category: 'Actions Rapides',
      items: [
        { keys: ['⌘', 'N'], description: 'Nouvelle consultation' },
        { keys: ['⌘', 'O'], description: 'Nouvelle ordonnance' },
        { keys: ['⌘', 'D'], description: 'Générer un document' },
        { keys: ['⌘', '⇧', 'P'], description: 'Nouveau patient' },
        { keys: ['⌘', '⇧', 'C'], description: 'Consultation rapide (modal)' },
        { keys: ['⌘', 'E'], description: 'Éditer (page détail)' },
      ]
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Raccourcis clavier</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {shortcuts.map(category => (
            <div key={category.category}>
              <h3 className="font-semibold text-lg mb-3">{category.category}</h3>
              <div className="space-y-2">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-700">
                      {item.description}
                    </span>
                    <div className="flex gap-1">
                      {item.keys.map((key, j) => (
                        <kbd
                          key={j}
                          className="px-2.5 py-1.5 text-sm font-mono bg-slate-100 border border-slate-300 rounded shadow-sm"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t">
          <p className="text-sm text-slate-600">
            💡 Astuce : Utilisez <kbd className="px-2 py-1 bg-slate-100 rounded">⌘ K</kbd> pour accéder rapidement à toutes les actions
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
