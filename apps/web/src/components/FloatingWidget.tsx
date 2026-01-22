import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import {
  X,
  GripVertical,
  Calculator,
  Plus,
  StickyNote,
  Maximize2,
  Minimize2,
  ExternalLink,
  Pill,
  Calendar,
  BookOpen,
  FileText,
  MessageSquare,
  CheckCircle,
  Bell,
  ListTodo,
  AlertTriangle,
  CheckCheck,
  Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { addDays, differenceInDays, format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface FloatingWidgetProps {
  onClose?: () => void
}

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export function FloatingWidget({ onClose }: FloatingWidgetProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Position and size state
  const [position, setPosition] = useState({ x: 20, y: 100 })
  const [size, setSize] = useState({ width: 360, height: 500 })
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  // Bloc-notes state (persisted in localStorage)
  const [notes, setNotes] = useState('')

  // Tâches state (persisted in localStorage)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState('')

  // Calculatrice SA state
  const [ddr, setDdr] = useState('')
  const [dateConsultation, setDateConsultation] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [resultatSA, setResultatSA] = useState<{
    sa: number
    jours: number
    dpa: string
    evenements?: Array<{ titre: string; date: string; sa: string }>
  } | null>(null)

  // Question rapide state
  const [questionSA, setQuestionSA] = useState('')
  const [reponseQuestion, setReponseQuestion] = useState<string | null>(null)

  const widgetRef = useRef<HTMLDivElement>(null)

  // Fetch alerts
  const { data: alertsData } = useQuery({
    queryKey: ['alerts-widget'],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/alertes`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch alerts')
      return res.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const alerts = alertsData?.alertes || []

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('maialink_widget_notes')
    if (savedNotes) {
      setNotes(savedNotes)
    }

    // Load saved tasks
    const savedTasks = localStorage.getItem('maialink_widget_tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    // Load saved position
    const savedPosition = localStorage.getItem('maialink_widget_position')
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition))
    }

    // Load saved size
    const savedSize = localStorage.getItem('maialink_widget_size')
    if (savedSize) {
      setSize(JSON.parse(savedSize))
    }
  }, [])

  // Save notes to localStorage on change
  const handleNotesChange = (value: string) => {
    setNotes(value)
    localStorage.setItem('maialink_widget_notes', value)
  }

  // Tasks management
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks)
    localStorage.setItem('maialink_widget_tasks', JSON.stringify(newTasks))
  }

  const addTask = () => {
    if (!newTaskText.trim()) return
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    saveTasks([...tasks, newTask])
    setNewTaskText('')
  }

  const toggleTask = (taskId: string) => {
    saveTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (taskId: string) => {
    saveTasks(tasks.filter((task) => task.id !== taskId))
  }

  const clearCompletedTasks = () => {
    saveTasks(tasks.filter((task) => !task.completed))
  }

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('maialink_widget_position', JSON.stringify(position))
  }, [position])

  // Save size to localStorage
  useEffect(() => {
    localStorage.setItem('maialink_widget_size', JSON.stringify(size))
  }, [size])

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
    } else if (isResizing) {
      const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x))
      const newHeight = Math.max(400, resizeStart.height + (e.clientY - resizeStart.y))
      setSize({ width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart])

  // Resize handler
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
  }

  // Calculatrice SA avec jalons de grossesse
  const calculerSA = () => {
    if (!ddr || !dateConsultation) {
      alert('Veuillez renseigner les deux dates')
      return
    }

    const dateDDR = parseISO(ddr)
    const dateConsult = parseISO(dateConsultation)

    // Calculate SA
    const joursGrossesse = differenceInDays(dateConsult, dateDDR)
    const sa = Math.floor(joursGrossesse / 7)
    const jours = joursGrossesse % 7

    // Calculate DPA (DDR + 280 jours)
    const dpa = addDays(dateDDR, 280)

    // Calculer les jalons importants de grossesse
    const jalons = [
      { titre: 'Écho T1 (11-13 SA)', date: addDays(dateDDR, 11 * 7), sa: '11-13 SA' },
      { titre: 'Écho T2 (22-24 SA)', date: addDays(dateDDR, 22 * 7), sa: '22-24 SA' },
      { titre: 'HGPO (24-28 SA)', date: addDays(dateDDR, 24 * 7), sa: '24-28 SA' },
      { titre: 'Rhophylac (28 SA)', date: addDays(dateDDR, 28 * 7), sa: '28 SA' },
      { titre: 'Écho T3 (32-34 SA)', date: addDays(dateDDR, 32 * 7), sa: '32-34 SA' },
      { titre: 'PV Strepto B (35-37 SA)', date: addDays(dateDDR, 35 * 7), sa: '35-37 SA' },
      { titre: 'Terme (37 SA)', date: addDays(dateDDR, 37 * 7), sa: '37 SA' },
      { titre: 'DPA (41 SA)', date: dpa, sa: '41 SA' },
    ]

    const evenements = jalons.map(jalon => ({
      titre: jalon.titre,
      date: format(jalon.date, 'dd/MM/yyyy', { locale: fr }),
      sa: jalon.sa
    }))

    setResultatSA({
      sa,
      jours,
      dpa: format(dpa, 'dd MMMM yyyy', { locale: fr }),
      evenements
    })
  }

  // Répondre aux questions sur les SA
  const repondreQuestion = () => {
    if (!ddr || !questionSA.trim()) {
      alert('Veuillez renseigner la DDR et poser une question')
      return
    }

    const dateDDR = parseISO(ddr)
    const question = questionSA.toLowerCase()

    // Parser la question pour extraire le nombre de SA
    const matchSA = question.match(/(\d+)\s*sa/)

    if (matchSA) {
      const saRecherche = parseInt(matchSA[1])
      const dateRecherchee = addDays(dateDDR, saRecherche * 7)

      // Détecter le type d'événement mentionné
      let evenement = ''
      if (question.includes('rhophylac') || question.includes('rophylac')) {
        evenement = 'Rhophylac'
      } else if (question.includes('echo') || question.includes('écho')) {
        evenement = 'Échographie'
      } else if (question.includes('hgpo')) {
        evenement = 'HGPO'
      } else if (question.includes('strepto')) {
        evenement = 'PV Streptocoque B'
      } else if (question.includes('terme')) {
        evenement = 'Terme'
      } else if (question.includes('dpa')) {
        evenement = 'DPA'
      }

      const reponse = `${evenement ? evenement + ' à' : 'À'} ${saRecherche} SA, la date est le ${format(dateRecherchee, 'dd MMMM yyyy', { locale: fr })}`
      setReponseQuestion(reponse)
    } else {
      // Essayer de détecter un événement sans SA explicite
      if (question.includes('rhophylac') || question.includes('rophylac')) {
        const dateRhophylac = addDays(dateDDR, 28 * 7)
        setReponseQuestion(`Le Rhophylac se fait à 28 SA, soit le ${format(dateRhophylac, 'dd MMMM yyyy', { locale: fr })}`)
      } else if (question.includes('terme')) {
        const dateTerme = addDays(dateDDR, 37 * 7)
        setReponseQuestion(`Le terme est à 37 SA, soit le ${format(dateTerme, 'dd MMMM yyyy', { locale: fr })}`)
      } else {
        setReponseQuestion('Je n\'ai pas compris la question. Essayez par exemple : "à quelle date ça fait 28SA pour le rophylac ?"')
      }
    }
  }

  // Reset calculatrice
  const resetCalculatrice = () => {
    setDdr('')
    setDateConsultation(new Date().toISOString().split('T')[0])
    setResultatSA(null)
    setReponseQuestion(null)
  }

  // Reset question
  const resetQuestion = () => {
    setQuestionSA('')
    setReponseQuestion(null)
  }

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
        }}
        className="cursor-move"
        onMouseDown={handleMouseDown}
      >
        <Card className="shadow-xl border-2 border-blue-400">
          <div className="flex items-center gap-2 p-3">
            <GripVertical className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-sm">Outils</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(false)
              }}
              className="h-6 w-6 p-0 ml-auto"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div
      ref={widgetRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 9999,
      }}
      className="cursor-move"
      onMouseDown={handleMouseDown}
    >
      <Card className="h-full flex flex-col shadow-2xl border-2 border-blue-400">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b cursor-move">
          <div className="flex items-center gap-2">
            <GripVertical className="h-5 w-5 text-slate-400" />
            <CardTitle className="text-base">Mes Outils</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(true)
              }}
              className="h-7 w-7 p-0 no-drag"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="h-7 w-7 p-0 no-drag"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 overflow-hidden p-0 no-drag">
          <Tabs defaultValue="outils" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 rounded-none">
              <TabsTrigger value="outils" className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Actions
              </TabsTrigger>
              <TabsTrigger value="alertes" className="text-xs relative">
                <Bell className="h-3 w-3 mr-1" />
                Alertes
                {alerts.length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 px-1 text-[10px]">
                    {alerts.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="taches" className="text-xs relative">
                <ListTodo className="h-3 w-3 mr-1" />
                Tâches
                {tasks.filter(t => !t.completed).length > 0 && (
                  <Badge className="ml-1 h-4 px-1 text-[10px]">
                    {tasks.filter(t => !t.completed).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="calculatrice" className="text-xs">
                <Calculator className="h-3 w-3 mr-1" />
                SA/DPA
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">
                <StickyNote className="h-3 w-3 mr-1" />
                Notes
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              {/* Outils rapides */}
              <TabsContent value="outils" className="p-4 space-y-3 m-0">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-slate-700">
                    Actions rapides
                  </h4>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => navigate('/consultations/new')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle consultation
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 text-slate-700">
                    Ressources médicales
                  </h4>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => window.open('https://www.lecrat.fr/', '_blank')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      CRAT
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>

                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => window.open('https://www.vidal.fr/', '_blank')}
                    >
                      <Pill className="h-4 w-4 mr-2" />
                      Vidal
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>

                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => window.open('https://www.omnidoc.fr/', '_blank')}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Omnidoc
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>

                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => window.open('https://www.doctolib.fr/', '_blank')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Doctolib
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Alertes */}
              <TabsContent value="alertes" className="p-4 space-y-3 m-0">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700">
                      Alertes actives
                    </h4>
                    <Badge variant="destructive" className="h-5">
                      {alerts.length}
                    </Badge>
                  </div>

                  {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                      <p className="text-sm text-slate-600 font-medium">
                        Aucune alerte
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Tout va bien !
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {alerts.map((alert: any) => (
                        <div
                          key={alert.id}
                          className="p-3 rounded-lg border-2 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                          style={{
                            borderColor:
                              alert.type === 'critique'
                                ? '#ef4444'
                                : alert.type === 'important'
                                ? '#f59e0b'
                                : '#3b82f6',
                          }}
                          onClick={() => navigate(`/alertes`)}
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle
                              className="h-4 w-4 flex-shrink-0 mt-0.5"
                              style={{
                                color:
                                  alert.type === 'critique'
                                    ? '#ef4444'
                                    : alert.type === 'important'
                                    ? '#f59e0b'
                                    : '#3b82f6',
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-900">
                                {alert.patientNom}
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                {alert.message}
                              </p>
                              {alert.dateCreation && (
                                <p className="text-[10px] text-slate-400 mt-1">
                                  {format(
                                    new Date(alert.dateCreation),
                                    'dd/MM/yyyy à HH:mm',
                                    { locale: fr }
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    className="w-full mt-3"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/alertes')}
                  >
                    Voir toutes les alertes
                  </Button>
                </div>
              </TabsContent>

              {/* Tâches */}
              <TabsContent value="taches" className="p-4 space-y-3 m-0">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700">
                      Mes tâches
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge className="h-5">
                        {tasks.filter(t => !t.completed).length}/{tasks.length}
                      </Badge>
                      {tasks.some(t => t.completed) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={clearCompletedTasks}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Nettoyer
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Add task input */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Nouvelle tâche..."
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTask()}
                      className="text-sm h-9"
                    />
                    <Button
                      size="sm"
                      onClick={addTask}
                      disabled={!newTaskText.trim()}
                      className="h-9 px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Tasks list */}
                  {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <ListTodo className="h-12 w-12 text-slate-300 mb-2" />
                      <p className="text-sm text-slate-600 font-medium">
                        Aucune tâche
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Ajoutez votre première tâche ci-dessus
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-start gap-2 p-2 rounded-lg border transition-all ${
                            task.completed
                              ? 'bg-slate-50 border-slate-200'
                              : 'bg-white border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTask(task.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm ${
                                task.completed
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-900'
                              }`}
                            >
                              {task.text}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {format(new Date(task.createdAt), 'dd/MM/yyyy HH:mm', {
                                locale: fr,
                              })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="h-3 w-3 text-slate-400 hover:text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Calculatrice SA/DPA */}
              <TabsContent value="calculatrice" className="p-4 space-y-4 m-0">
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-slate-700">
                    Calculateur SA et DPA
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="ddr" className="text-xs">
                        Date des dernières règles (DDR)
                      </Label>
                      <Input
                        id="ddr"
                        type="date"
                        value={ddr}
                        onChange={(e) => setDdr(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dateConsultation" className="text-xs">
                        Date de consultation
                      </Label>
                      <Input
                        id="dateConsultation"
                        type="date"
                        value={dateConsultation}
                        onChange={(e) => setDateConsultation(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={calculerSA} className="flex-1" size="sm">
                        <Calculator className="h-3 w-3 mr-2" />
                        Calculer
                      </Button>
                      <Button
                        onClick={resetCalculatrice}
                        variant="outline"
                        size="sm"
                      >
                        Réinitialiser
                      </Button>
                    </div>

                    {resultatSA && (
                      <div className="mt-4 space-y-3">
                        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-slate-600">
                                Semaines d'aménorrhée
                              </p>
                              <p className="text-2xl font-bold text-blue-900">
                                {resultatSA.sa} SA + {resultatSA.jours} jours
                              </p>
                            </div>
                            <div className="pt-2 border-t border-blue-300">
                              <p className="text-xs text-slate-600">
                                Date prévue d'accouchement (DPA)
                              </p>
                              <p className="text-lg font-semibold text-blue-800">
                                {resultatSA.dpa}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Jalons de grossesse */}
                        {resultatSA.evenements && resultatSA.evenements.length > 0 && (
                          <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-lg">
                            <h5 className="text-xs font-bold text-purple-900 mb-2">
                              Jalons importants
                            </h5>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                              {resultatSA.evenements.map((evt, i) => (
                                <div key={i} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-purple-100">
                                  <span className="font-medium text-purple-900">{evt.titre}</span>
                                  <span className="text-purple-700 font-semibold">{evt.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Questions rapides */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3 text-slate-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Question rapide
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="questionSA" className="text-xs">
                        Posez votre question
                      </Label>
                      <Input
                        id="questionSA"
                        type="text"
                        placeholder="Ex: à quelle date ça fait 28SA pour le rophylac ?"
                        value={questionSA}
                        onChange={(e) => setQuestionSA(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && repondreQuestion()}
                        className="mt-1 text-sm"
                      />
                    </div>

                    <Button
                      onClick={repondreQuestion}
                      className="w-full"
                      size="sm"
                      variant="secondary"
                    >
                      <MessageSquare className="h-3 w-3 mr-2" />
                      Répondre
                    </Button>

                    {reponseQuestion && (
                      <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-green-900 font-medium">
                            {reponseQuestion}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Bloc-notes */}
              <TabsContent value="notes" className="p-4 m-0 h-full">
                <div className="h-full flex flex-col">
                  <h4 className="text-sm font-semibold mb-2 text-slate-700">
                    Bloc-notes personnel
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Vos notes sont sauvegardées automatiquement
                  </p>
                  <Textarea
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Écrivez vos notes ici..."
                    className="flex-1 resize-none font-mono text-sm"
                    style={{ minHeight: '300px' }}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>

        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize no-drag"
          onMouseDown={handleResizeStart}
          style={{
            background:
              'linear-gradient(135deg, transparent 50%, #94a3b8 50%)',
          }}
        />
      </Card>
    </div>
  )
}
