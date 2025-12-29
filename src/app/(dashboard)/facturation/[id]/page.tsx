'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Loader2,
  Calendar,
  User,
  CreditCard,
  Printer,
  Send,
  Euro,
  CheckCircle,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Invoice {
  id: string
  numero: string
  patientId: string
  date: string
  dateEcheance?: string
  montantHT: string
  montantTTC: string
  montantPaye: string
  status: string
  paymentMethod?: string
  datePaiement?: string
  telettransmise: boolean
  cotations: { code: string; coefficient: number; montant: number }[]
  patient: {
    id: string
    firstName: string
    lastName: string
    socialSecurityNumber?: string
  }
}

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  brouillon: { label: 'Brouillon', variant: 'secondary' },
  envoyee: { label: 'Envoyee', variant: 'default' },
  payee: { label: 'Payee', variant: 'success' },
  impayee: { label: 'Impayee', variant: 'destructive' },
  annulee: { label: 'Annulee', variant: 'secondary' },
}

const PAYMENT_LABELS: Record<string, string> = {
  especes: 'Especes',
  cheque: 'Cheque',
  carte: 'Carte bancaire',
  virement: 'Virement',
  tiers_payant: 'Tiers payant',
}

export default function FactureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInvoice()
  }, [resolvedParams.id])

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${resolvedParams.id}`)
      const data = await res.json()

      if (data.success) {
        setInvoice(data.invoice)
      } else {
        router.push('/facturation')
      }
    } catch (error) {
      console.error('Error fetching invoice:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkPaid = async () => {
    // TODO: Implement mark as paid
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!invoice) {
    return null
  }

  const statusInfo = STATUS_LABELS[invoice.status] || STATUS_LABELS.brouillon

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/facturation">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">
                Facture {invoice.numero}
              </h1>
              <Badge variant={statusInfo.variant as 'default' | 'secondary' | 'destructive' | 'outline'}>
                {statusInfo.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-4 w-4" />
              {formatDate(invoice.date)}
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-12 sm:ml-0 no-print">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" />
            Imprimer
          </Button>
          {!invoice.telettransmise && invoice.status !== 'annulee' && (
            <Button variant="outline" size="sm">
              <Send className="h-4 w-4 mr-1" />
              Teletransmettre
            </Button>
          )}
          {invoice.status !== 'payee' && invoice.status !== 'annulee' && (
            <Button size="sm" onClick={handleMarkPaid}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Marquer payee
            </Button>
          )}
        </div>
      </div>

      {/* Patient info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <User className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <Link
                  href={`/patients/${invoice.patient.id}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {invoice.patient.firstName} {invoice.patient.lastName}
                </Link>
                {invoice.patient.socialSecurityNumber && (
                  <p className="text-sm text-slate-500">
                    N SS: {invoice.patient.socialSecurityNumber}
                  </p>
                )}
              </div>
            </div>
            {invoice.telettransmise && (
              <Badge variant="success">Teletransmise</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cotations */}
      <Card>
        <CardHeader>
          <CardTitle>Detail des actes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Code</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Coefficient</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Montant</th>
                </tr>
              </thead>
              <tbody>
                {invoice.cotations?.map((cotation, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <span className="font-mono font-medium">{cotation.code}</span>
                    </td>
                    <td className="py-3 px-4 text-right">{cotation.coefficient}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      {cotation.montant.toFixed(2)} EUR
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50">
                  <td colSpan={2} className="py-3 px-4 font-medium">Total TTC</td>
                  <td className="py-3 px-4 text-right text-lg font-bold text-slate-900">
                    {parseFloat(invoice.montantTTC).toFixed(2)} EUR
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Paiement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-500" />
            Paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Montant total</p>
              <p className="text-2xl font-bold text-slate-900">
                {parseFloat(invoice.montantTTC).toFixed(2)} EUR
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Montant paye</p>
              <p className="text-2xl font-bold text-green-600">
                {parseFloat(invoice.montantPaye).toFixed(2)} EUR
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Reste a payer</p>
              <p className={`text-2xl font-bold ${
                parseFloat(invoice.montantTTC) - parseFloat(invoice.montantPaye) > 0
                  ? 'text-amber-600'
                  : 'text-slate-400'
              }`}>
                {(parseFloat(invoice.montantTTC) - parseFloat(invoice.montantPaye)).toFixed(2)} EUR
              </p>
            </div>
          </div>

          {invoice.paymentMethod && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-slate-500">Mode de paiement</span>
                <span className="font-medium">{PAYMENT_LABELS[invoice.paymentMethod] || invoice.paymentMethod}</span>
              </div>
              {invoice.datePaiement && (
                <div className="flex justify-between mt-2">
                  <span className="text-slate-500">Date de paiement</span>
                  <span className="font-medium">{formatDate(invoice.datePaiement)}</span>
                </div>
              )}
            </div>
          )}

          {invoice.dateEcheance && invoice.status !== 'payee' && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-slate-500">Date d echeance</span>
                <span className={`font-medium ${
                  new Date(invoice.dateEcheance) < new Date() ? 'text-red-600' : ''
                }`}>
                  {formatDate(invoice.dateEcheance)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between no-print">
        <Button variant="outline" asChild>
          <Link href="/facturation">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux factures
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/patients/${invoice.patientId}`}>
            Voir le dossier patient
          </Link>
        </Button>
      </div>
    </div>
  )
}
