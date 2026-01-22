import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ProtocolResultsCarousel } from '@/components/ProtocolResultsCarousel'
import { StructuredResponse } from '@/components/StructuredResponse'
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  FileText,
  Minimize2,
  GripVertical,
} from 'lucide-react'

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

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: ProtocolSource[]
  structured?: any
  timestamp: Date
}

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Position state for draggable functionality
  const [position, setPosition] = useState({ x: window.innerWidth - 480, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen, isMinimized])

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('maialink_chatbubble_position')
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition))
    }
  }, [])

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('maialink_chatbubble_position', JSON.stringify(position))
  }, [position])

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question: userMessage.content }),
      })

      const data = await res.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || data.error || 'Erreur lors de la generation de la reponse',
        sources: data.sources,
        structured: data.structured,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Erreur de connexion. Veuillez reessayer.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 group cursor-move"
        title="Poser une question sur vos protocoles"
      >
        <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
      </button>
    )
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
        }}
        className="flex items-center gap-2 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all px-4 py-3 cursor-move"
      >
        <Sparkles className="h-5 w-5" />
        <span className="text-sm font-medium">Assistant IA</span>
        {messages.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
            {messages.length}
          </span>
        )}
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
      }}
      className="flex flex-col w-[450px] h-[calc(100vh-40px)] max-h-[700px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5" />
          <span className="font-semibold">Assistant Protocoles</span>
        </div>
        <div className="flex items-center gap-1 no-drag">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-drag">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-violet-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2 text-lg">
              Assistant Protocoles IA
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Posez-moi vos questions sur vos protocoles médicaux.
              Je rechercherai les informations dans vos documents et vous donnerai une réponse claire.
            </p>
            <div className="space-y-2 w-full">
              <p className="text-xs text-slate-500 font-medium mb-2">💡 Exemples de questions :</p>
              <button
                onClick={() => setInput('Quelle est la conduite a tenir en cas de pre-eclampsie ?')}
                className="w-full text-left text-sm p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-slate-700 transition-colors border border-violet-200"
              >
                "Conduite à tenir en cas de pré-éclampsie ?"
              </button>
              <button
                onClick={() => setInput('Quels sont les examens du 1er trimestre ?')}
                className="w-full text-left text-sm p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-slate-700 transition-colors border border-violet-200"
              >
                "Examens du 1er trimestre ?"
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === 'user'
                      ? 'bg-slate-100'
                      : 'bg-gradient-to-br from-violet-500 to-purple-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  {/* Message utilisateur ou réponse structurée */}
                  {message.role === 'user' ? (
                    <div className="rounded-2xl px-4 py-2.5 bg-slate-100 text-slate-900">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ) : message.structured ? (
                    /* Réponse structurée avec IA */
                    <div className="rounded-2xl px-4 py-3 bg-gradient-to-br from-violet-50 to-purple-50">
                      <StructuredResponse data={message.structured} />
                    </div>
                  ) : (
                    /* Réponse simple - LA RÉPONSE IA EN PREMIER */
                    <>
                      <div className="rounded-2xl px-4 py-3 bg-gradient-to-br from-violet-50 to-purple-50 text-slate-900">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-slate-500 mb-1 px-1">📚 Sources dans vos protocoles :</div>
                          <ProtocolResultsCarousel sources={message.sources} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                </div>
                <div className="flex-1 rounded-2xl px-4 py-3 bg-gradient-to-br from-violet-50 to-purple-50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
                      <Sparkles className="h-4 w-4" />
                      Analyse en cours...
                    </div>
                    <p className="text-xs text-violet-600">
                      Je recherche dans vos protocoles médicaux
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 no-drag">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question..."
            rows={1}
            className="resize-none min-h-[44px] max-h-[120px]"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
