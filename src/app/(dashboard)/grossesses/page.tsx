'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Plus,
  Baby,
  Calendar,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { formatDate, calculateSA } from '@/lib/utils'

interface Grossesse {
  id: string
  ddr: string
  dpa: string
  status: string
  grossesseMultiple: boolean
  nombreFoetus: number
  facteursRisque?: string[]
  patient: {
    id: string
    firstName: string
    lastName: string
  }
}

export default function GrossessesPage() {
  const [grossesses, setGrossesses] = useState<Grossesse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGrossesses()
  }, [])

  const fetchGrossesses = async () => {
    try {
      const res = await fetch('/api/grossesses?status=en_cours')
      const data = await res.json()
      if (data.success) {
        setGrossesses(data.grossesses)
      }
    } catch (error) {
      console.error('Error fetching grossesses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Grossesses</h1>
          <p className="text-slate-500 mt-1">
            {grossesses.length} grossesse{grossesses.length > 1 ? 's' : ''} en cours
          </p>
        </div>
        <Button asChild>
          <Link href="/grossesses/new">
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle grossesse
          </Link>
        </Button>
      </div>

      {/* Liste des grossesses */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : grossesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Baby className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucune grossesse en cours
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Declarez une nouvelle grossesse pour commencer le suivi
            </p>
            <Button asChild>
              <Link href="/grossesses/new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle grossesse
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grossesses.map((grossesse) => {
            const sa = calculateSA(grossesse.ddr)
            const progress = Math.min((sa.total / 280) * 100, 100)

            return (
              <Link key={grossesse.id} href={`/grossesses/${grossesse.id}`}>
                <Card className="hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                          <Baby className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">
                            {grossesse.patient.firstName} {grossesse.patient.lastName}
                          </h3>
                          <p className="text-2xl font-bold text-pink-600">
                            {sa.weeks} SA + {sa.days}j
                          </p>
                        </div>
                      </div>
                      {grossesse.grossesseMultiple && (
                        <Badge variant="info">{grossesse.nombreFoetus}</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Progression</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" indicatorClassName="bg-pink-500" />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Calendar className="h-3 w-3" />
                        DPA: {formatDate(grossesse.dpa)}
                      </div>
                      {grossesse.facteursRisque && grossesse.facteursRisque.length > 0 && (
                        <Badge variant="warning" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Risque
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
