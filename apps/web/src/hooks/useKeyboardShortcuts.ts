import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      if (!modifier) return

      // Ignore si focus dans input/textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Sauf pour Cmd+K qui override
        if (e.key !== 'k') return
      }

      // Navigation rapide (Cmd+1/2/3/4)
      if (e.key === '1') {
        e.preventDefault()
        navigate('/dashboard')
      } else if (e.key === '2') {
        e.preventDefault()
        navigate('/patients')
      } else if (e.key === '3') {
        e.preventDefault()
        navigate('/agenda')
      } else if (e.key === '4') {
        e.preventDefault()
        navigate('/documents')
      }

      // Actions avec Shift
      if (e.shiftKey) {
        if (e.key === 'P') {
          e.preventDefault()
          navigate('/patients/new')
        } else if (e.key === 'C') {
          e.preventDefault()
          document.dispatchEvent(new CustomEvent('open-quick-consultation'))
        } else if (e.key === 'D') {
          e.preventDefault()
          navigate('/documents/new')
        } else if (e.key === 'S') {
          e.preventDefault()
          navigate('/surveillance')
        }
      }

      // Éditer (Cmd+E) - contexte actuel
      if (e.key === 'e' && !e.shiftKey) {
        const match = location.pathname.match(/\/(patients|consultations|documents)\/([a-f0-9-]+)$/)
        if (match) {
          e.preventDefault()
          navigate(`${match[0]}/edit`)
        }
      }

      // Aide (Cmd+/)
      if (e.key === '/') {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('show-keyboard-shortcuts'))
      }

      // Palette de commandes (Cmd+K)
      if (e.key === 'k') {
        e.preventDefault()
        const event = new CustomEvent('open-command-palette')
        window.dispatchEvent(event)
      }

      // Nouvelle consultation (Cmd+N)
      if (e.key === 'n' && !e.shiftKey) {
        e.preventDefault()
        navigate('/consultations/new')
      }

      // Nouvelle ordonnance (Cmd+O)
      if (e.key === 'o' && !e.shiftKey) {
        e.preventDefault()
        navigate('/ordonnances/new')
      }

      // Générer document (Cmd+D)
      if (e.key === 'd' && !e.shiftKey) {
        e.preventDefault()
        navigate('/documents/generate')
      }

      // Recherche patient (Cmd+P)
      if (e.key === 'p' && !e.shiftKey) {
        e.preventDefault()
        navigate('/patients')
        // Focus sur le champ de recherche après navigation
        setTimeout(() => {
          const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
          if (searchInput) searchInput.focus()
        }, 100)
      }

      // Grossesses (Cmd+G)
      if (e.key === 'g' && !e.shiftKey) {
        e.preventDefault()
        navigate('/grossesses')
      }

      // Dashboard (Cmd+H)
      if (e.key === 'h' && !e.shiftKey) {
        e.preventDefault()
        navigate('/dashboard')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate, location])
}
