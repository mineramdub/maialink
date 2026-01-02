import { useState } from 'react'
import { Plus, Calendar, UserPlus, FileText, Stethoscope } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const actions = [
    {
      icon: Calendar,
      label: 'Nouveau RDV',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => {
        navigate('/agenda?action=new')
        setIsOpen(false)
      }
    },
    {
      icon: UserPlus,
      label: 'Nouvelle patiente',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => {
        navigate('/patients/new')
        setIsOpen(false)
      }
    },
    {
      icon: Stethoscope,
      label: 'Nouvelle consultation',
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => {
        document.dispatchEvent(new CustomEvent('open-quick-consultation'))
        setIsOpen(false)
      }
    },
    {
      icon: FileText,
      label: 'Créer document',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {
        navigate('/documents/new')
        setIsOpen(false)
      }
    }
  ]

  return (
    <>
      {/* Overlay noir semi-transparent */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu des actions (slide up) */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 flex flex-col gap-3",
          "transition-all duration-300",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={cn(
              action.color,
              "text-white px-4 py-3 rounded-full shadow-lg",
              "flex items-center gap-3 font-medium",
              "transition-transform hover:scale-105",
              "animate-in slide-in-from-bottom-2"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <action.icon className="w-5 h-5" />
            <span className="pr-1">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-14 h-14 rounded-full shadow-lg",
          "flex items-center justify-center",
          "transition-all duration-300",
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-45"
            : "bg-blue-600 hover:bg-blue-700 hover:scale-110"
        )}
        aria-label={isOpen ? "Fermer" : "Actions rapides"}
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </>
  )
}
