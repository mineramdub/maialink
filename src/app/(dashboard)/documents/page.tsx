'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Plus,
  FileSignature,
  ClipboardList,
  Mail,
  Baby,
  Pill,
} from 'lucide-react'

const documentTemplates = [
  {
    id: 'ordonnance',
    icon: Pill,
    title: 'Ordonnance',
    description: 'Prescription de medicaments, examens, etc.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'certificat',
    icon: FileSignature,
    title: 'Certificat medical',
    description: 'Certificat de grossesse, arret de travail, etc.',
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'declaration_grossesse',
    icon: Baby,
    title: 'Declaration de grossesse',
    description: 'Declaration CAF et Securite sociale',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    id: 'courrier',
    icon: Mail,
    title: 'Courrier confere',
    description: 'Courrier a destination d\'un medecin ou specialiste',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'compte_rendu',
    icon: ClipboardList,
    title: 'Compte-rendu',
    description: 'Compte-rendu de consultation ou d\'examen',
    color: 'bg-amber-100 text-amber-600',
  },
]

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Documents</h1>
          <p className="text-slate-500 mt-1">
            Modeles et documents a generer
          </p>
        </div>
      </div>

      {/* Modeles */}
      <Card>
        <CardHeader>
          <CardTitle>Creer un document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/documents/new?type=${template.id}`}
                className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${template.color}`}>
                  <template.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{template.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modeles d'ordonnances types */}
      <Card>
        <CardHeader>
          <CardTitle>Ordonnances types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: 'Fer + Acide folique', desc: 'Supplementation grossesse' },
              { name: 'Vitamines prenatales', desc: 'Grossesse' },
              { name: 'Bilan sanguin T1', desc: '1er trimestre' },
              { name: 'HGPO 75g', desc: 'Depistage diabete gestationnel' },
              { name: 'Prelevement vaginal', desc: 'Strepto B' },
              { name: 'Bilan post-partum', desc: 'Suivi post-natal' },
            ].map((item, i) => (
              <button
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Badge variant="outline">Utiliser</Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents recents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents recents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-8">
            Aucun document recent
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
