'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const monthNames = [
    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
  ]

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const today = new Date()
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border border-slate-100" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <div
        key={day}
        className={`h-24 border border-slate-100 p-2 cursor-pointer hover:bg-slate-50 transition-colors ${
          isToday(day) ? 'bg-blue-50 border-blue-200' : ''
        }`}
      >
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
            isToday(day) ? 'bg-blue-600 text-white' : 'text-slate-700'
          }`}
        >
          {day}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Agenda</h1>
          <p className="text-slate-500 mt-1">
            Synchronise avec Doctolib pour la prise de rendez-vous
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open('https://pro.doctolib.fr', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Ouvrir Doctolib
          </Button>
        </div>
      </div>

      {/* Info Doctolib */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Calendar className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">
                Gestion des rendez-vous via Doctolib
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Votre agenda est synchronise avec Doctolib. Cliquez sur le bouton ci-dessus
                pour gerer vos rendez-vous, creneaux et prise de RDV en ligne.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendrier */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Aujourdhui
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-0">
            {dayNames.map((day) => (
              <div
                key={day}
                className="h-10 flex items-center justify-center text-sm font-medium text-slate-500 border-b border-slate-200"
              >
                {day}
              </div>
            ))}
            {days}
          </div>
        </CardContent>
      </Card>

      {/* Prochains RDV */}
      <Card>
        <CardHeader>
          <CardTitle>Prochains rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-8">
            Les rendez-vous sont geres directement dans Doctolib.
            <br />
            <Button
              variant="link"
              className="mt-2"
              onClick={() => window.open('https://pro.doctolib.fr', '_blank')}
            >
              Acceder a Doctolib
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
