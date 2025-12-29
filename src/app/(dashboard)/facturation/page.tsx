'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  Receipt,
  Euro,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Send,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Invoice {
  id: string
  numero: string
  date: string
  montantTTC: string
  montantPaye: string
  status: string
  patient: {
    id: string
    firstName: string
    lastName: string
  }
  cotations?: Array<{ code: string; montant: number }>
}

interface Stats {
  totalHT: number
  totalPaye: number
  count: number
}

export default function FacturationPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchInvoices()
  }, [statusFilter])

  const fetchInvoices = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const res = await fetch(`/api/invoices?${params}`)
      const data = await res.json()

      if (data.success) {
        setInvoices(data.invoices)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInvoices = invoices.filter((inv) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      inv.numero.toLowerCase().includes(searchLower) ||
      inv.patient.firstName.toLowerCase().includes(searchLower) ||
      inv.patient.lastName.toLowerCase().includes(searchLower)
    )
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'payee':
        return <Badge variant="success">Payee</Badge>
      case 'envoyee':
        return <Badge variant="info">Envoyee</Badge>
      case 'impayee':
        return <Badge variant="destructive">Impayee</Badge>
      case 'annulee':
        return <Badge variant="secondary">Annulee</Badge>
      default:
        return <Badge variant="warning">Brouillon</Badge>
    }
  }

  const totalImpaye = invoices
    .filter((i) => i.status !== 'payee' && i.status !== 'annulee')
    .reduce((acc, i) => acc + parseFloat(i.montantTTC) - parseFloat(i.montantPaye || '0'), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Facturation</h1>
          <p className="text-slate-500 mt-1">
            Gestion des factures et cotations NGAP
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button asChild>
            <Link href="/facturation/new">
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle facture
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Euro className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">CA total</p>
                <p className="text-2xl font-semibold">
                  {stats?.totalHT?.toFixed(2) || '0.00'} EUR
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Encaisse</p>
                <p className="text-2xl font-semibold">
                  {stats?.totalPaye?.toFixed(2) || '0.00'} EUR
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">En attente</p>
                <p className="text-2xl font-semibold">
                  {totalImpaye.toFixed(2)} EUR
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <Receipt className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Factures</p>
                <p className="text-2xl font-semibold">{stats?.count || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher par numero ou patiente..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="brouillon">Brouillons</SelectItem>
            <SelectItem value="envoyee">Envoyees</SelectItem>
            <SelectItem value="payee">Payees</SelectItem>
            <SelectItem value="impayee">Impayees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des factures */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : filteredInvoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucune facture
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Creez votre premiere facture
            </p>
            <Button asChild>
              <Link href="/facturation/new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle facture
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Factures ({filteredInvoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <Receipt className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{invoice.numero}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-slate-500">
                        {invoice.patient.firstName} {invoice.patient.lastName} -{' '}
                        {formatDate(invoice.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{parseFloat(invoice.montantTTC).toFixed(2)} EUR</p>
                      {invoice.cotations && invoice.cotations.length > 0 && (
                        <p className="text-xs text-slate-500">
                          {invoice.cotations.map((c) => c.code).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {invoice.status === 'brouillon' && (
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/facturation/${invoice.id}`}>
                          Voir
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
