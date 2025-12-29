'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Plus,
  Activity,
  User,
  Calendar,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

interface ReeducationSuivi {
  patientId: string
  patient: Patient
  seancesTotal: number
  seancesRealisees: number
  derniereSeance?: string
  testingInitial?: number
  testingActuel?: number
}

export default function ReeducationPage() {
  const [suivis, setSuivis] = useState<ReeducationSuivi[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simule le chargement - a remplacer par un vrai appel API
    setIsLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reeducation perineale</h1>
          <p className="text-slate-500 mt-1">
            Suivi des seances de reeducation
          </p>
        </div>
        <Button asChild>
          <Link href="/reeducation/new">
            <Plus className="h-4 w-4 mr-1" />
            Nouveau suivi
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Suivis en cours</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Seances ce mois</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Suivis termines</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des suivis */}
      <Card>
        <CardHeader>
          <CardTitle>Suivis en cours</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : suivis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">
                Aucun suivi en cours
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Commencez un nouveau suivi de reeducation
              </p>
              <Button asChild>
                <Link href="/reeducation/new">
                  <Plus className="h-4 w-4 mr-1" />
                  Nouveau suivi
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {suivis.map((suivi) => (
                <div
                  key={suivi.patientId}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-medium">
                      {suivi.patient.firstName[0]}
                      {suivi.patient.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium">
                        {suivi.patient.firstName} {suivi.patient.lastName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {suivi.seancesRealisees} / {suivi.seancesTotal} seances
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <Progress
                        value={(suivi.seancesRealisees / suivi.seancesTotal) * 100}
                        className="h-2"
                      />
                    </div>
                    <Badge variant="secondary">
                      Testing: {suivi.testingActuel}/5
                    </Badge>
                    <Button size="sm" variant="outline">
                      Seance
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cotations */}
      <Card>
        <CardHeader>
          <CardTitle>Cotations reeducation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between">
                <Badge variant="outline">SF 8</Badge>
                <span className="font-semibold">25.20 EUR</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">Bilan perineal initial</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between">
                <Badge variant="outline">SF 7</Badge>
                <span className="font-semibold">22.05 EUR</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Seance de reeducation (10 seances remboursees)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
