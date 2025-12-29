'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Stethoscope,
  Calendar,
  Search,
  Loader2,
  User,
  Baby,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Consultation {
  id: string
  type: string
  date: string
  duree?: number
  saTerm?: number
  saJours?: number
  motif?: string
  conclusion?: string
  patient: {
    id: string
    firstName: string
    lastName: string
  }
  grossesse?: {
    id: string
  }
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  prenatale: { label: 'Prenatale', color: 'bg-pink-100 text-pink-700' },
  postnatale: { label: 'Postnatale', color: 'bg-purple-100 text-purple-700' },
  gyneco: { label: 'Gynecologie', color: 'bg-blue-100 text-blue-700' },
  reeducation: { label: 'Reeducation', color: 'bg-green-100 text-green-700' },
  preparation: { label: 'Preparation', color: 'bg-amber-100 text-amber-700' },
  monitoring: { label: 'Monitoring', color: 'bg-red-100 text-red-700' },
  autre: { label: 'Autre', color: 'bg-slate-100 text-slate-700' },
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchConsultations()
  }, [])

  const fetchConsultations = async () => {
    try {
      const res = await fetch('/api/consultations')
      const data = await res.json()
      if (data.success) {
        setConsultations(data.consultations)
      }
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConsultations = consultations.filter((c) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      c.patient.firstName.toLowerCase().includes(searchLower) ||
      c.patient.lastName.toLowerCase().includes(searchLower) ||
      c.motif?.toLowerCase().includes(searchLower)
    )
  })

  // Group consultations by date
  const groupedConsultations = filteredConsultations.reduce((acc, consultation) => {
    const date = consultation.date.split('T')[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(consultation)
    return acc
  }, {} as Record<string, Consultation[]>)

  const sortedDates = Object.keys(groupedConsultations).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Consultations</h1>
          <p className="text-slate-500 mt-1">
            {consultations.length} consultation{consultations.length > 1 ? 's' : ''} enregistree{consultations.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/consultations/new">
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle consultation
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Rechercher par nom de patiente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des consultations */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : consultations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Stethoscope className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucune consultation
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Enregistrez votre premiere consultation
            </p>
            <Button asChild>
              <Link href="/consultations/new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle consultation
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : filteredConsultations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucun resultat
            </h3>
            <p className="text-sm text-slate-500">
              Aucune consultation ne correspond a votre recherche
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-slate-500 mb-3">
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {groupedConsultations[date].map((consultation) => {
                  const typeInfo = TYPE_LABELS[consultation.type] || TYPE_LABELS.autre

                  return (
                    <Link key={consultation.id} href={`/consultations/${consultation.id}`}>
                      <Card className="hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                {consultation.grossesse ? (
                                  <Baby className="h-6 w-6 text-pink-600" />
                                ) : (
                                  <Stethoscope className="h-6 w-6 text-slate-600" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-900">
                                    {consultation.patient.firstName} {consultation.patient.lastName}
                                  </span>
                                  <Badge className={typeInfo.color}>
                                    {typeInfo.label}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(consultation.date).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  {consultation.duree && (
                                    <span>{consultation.duree} min</span>
                                  )}
                                  {consultation.saTerm && (
                                    <span className="text-pink-600 font-medium">
                                      {consultation.saTerm} SA + {consultation.saJours}j
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {consultation.motif && (
                              <p className="text-sm text-slate-500 max-w-xs truncate hidden md:block">
                                {consultation.motif}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
