'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  ClipboardList,
  Calendar,
  AlertCircle,
  Pill,
  FileText,
} from 'lucide-react'

export default function GynecologiePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Gynecologie de prevention</h1>
          <p className="text-slate-500 mt-1">
            Suivi gynecologique, contraception, depistages
          </p>
        </div>
        <Button asChild>
          <Link href="/consultations/new?type=gyneco">
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle consultation
          </Link>
        </Button>
      </div>

      {/* Actions rapides */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <FileText className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="font-medium">Frottis</p>
                <p className="text-sm text-slate-500">FCU / depistage HPV</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Contraception</p>
                <p className="text-sm text-slate-500">Pose / renouvellement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <ClipboardList className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Consultation</p>
                <p className="text-sm text-slate-500">Suivi gynecologique</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">IVG</p>
                <p className="text-sm text-slate-500">Medicamenteuse</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rappels depistages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Rappels de depistages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-8">
            Les rappels de depistage (frottis, mammographie) seront affiches ici
            pour les patientes concernees.
          </p>
        </CardContent>
      </Card>

      {/* Cotations gyneco */}
      <Card>
        <CardHeader>
          <CardTitle>Cotations gynecologie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between">
                <Badge variant="outline">C</Badge>
                <span className="font-semibold">25.00 EUR</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">Consultation</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between">
                <Badge variant="outline">SF 9,5</Badge>
                <span className="font-semibold">29.93 EUR</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">Frottis cervico-uterin</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between">
                <Badge variant="outline">SF 4,4</Badge>
                <span className="font-semibold">38.40 EUR</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">Pose DIU</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between">
                <Badge variant="outline">SF 2,2</Badge>
                <span className="font-semibold">6.93 EUR</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">Retrait DIU</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between">
                <Badge variant="outline">SF 4,3</Badge>
                <span className="font-semibold">17.20 EUR</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">Pose implant</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between">
                <Badge variant="outline">FHV</Badge>
                <span className="font-semibold">187.92 EUR</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">IVG medicamenteuse</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Derniers suivis gyneco */}
      <Card>
        <CardHeader>
          <CardTitle>Dernieres consultations gyneco</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-8">
            Aucune consultation gynecologique recente
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
