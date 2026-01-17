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
  ChevronLeft,
  ChevronRight,
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
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
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
        body: JSON.stringify({ question: input }),
      })

      const data = await res.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          structured: data.structured,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Désolé, impossible de se connecter au serveur.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Floating toggle button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
        title="Ouvrir l'Assistant Protocoles"
      >
        <Sparkles className="h-6 w-6" />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
            {messages.length}
          </span>
        )}
      </button>
    )
  }

  // Drawer panel
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold text-lg">Assistant Protocoles</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            title="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-slate-50 to-purple-50/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4">
                <Bot className="h-10 w-10 text-violet-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 text-xl">
                Assistant Protocoles IA
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-sm">
                Posez-moi vos questions sur vos protocoles médicaux.
                Je rechercherai les informations dans vos documents et vous donnerai une réponse claire.
              </p>
              <div className="space-y-3 w-full max-w-md">
                <p className="text-xs text-slate-500 font-medium mb-3">💡 Exemples de questions :</p>
                <button
                  onClick={() => setInput('Quelle est la conduite à tenir en cas de pré-éclampsie ?')}
                  className="w-full text-left text-sm p-4 rounded-xl bg-white hover:bg-violet-50 text-slate-700 transition-colors border border-violet-200 hover:border-violet-300 shadow-sm"
                >
                  "Conduite à tenir en cas de pré-éclampsie ?"
                </button>
                <button
                  onClick={() => setInput('Quels sont les examens du 1er trimestre ?')}
                  className="w-full text-left text-sm p-4 rounded-xl bg-white hover:bg-violet-50 text-slate-700 transition-colors border border-violet-200 hover:border-violet-300 shadow-sm"
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
                        ? 'bg-slate-200'
                        : 'bg-gradient-to-br from-violet-500 to-purple-600'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-slate-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 max-w-[85%]">
                    {message.role === 'user' ? (
                      <div className="rounded-2xl px-4 py-3 bg-slate-100 text-slate-900">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    ) : message.structured ? (
                      <div className="rounded-2xl px-4 py-3 bg-white border border-violet-200">
                        <StructuredResponse data={message.structured} />
                      </div>
                    ) : (
                      <>
                        <div className="rounded-2xl px-4 py-3 bg-white border border-violet-200 text-slate-900">
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3">
                            <ProtocolResultsCarousel sources={message.sources} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-4 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Posez votre question sur vos protocoles..."
              className="flex-1 min-h-[48px] max-h-32 resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
