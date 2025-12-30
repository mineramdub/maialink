import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  ArrowLeft,
  User,
  Calendar,
  Receipt,
  Loader2,
  FileText,
  Download,
  Send,
  CheckCircle2,
  Edit,
} from 'lucide-react'
import { formatDate } from '../../lib/utils'

interface Invoice {
  id: string
  numero: string
  date: string
  dateEcheance?: string
  montantHT: string
  montantTTC: string
  montantPaye: string
  status: string
  paymentMethod?: string
  notes?: string
  cotations: Array<{
    code: string
    libelle: string
    montant: number
    quantity: number
  }>
  patient: {
    id: string
    firstName: string
    lastName: string
    email?: string
  }
  consultation?: {
    id: string
    type: string
    date: string
  }
}

export default function FacturationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchInvoice()
    }
  }, [id])

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices/${id}`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        setInvoice(data.invoice)
      }
    } catch (error) {
      console.error('Error fetching invoice:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()
      if (data.success) {
        setInvoice(data.invoice)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      brouillon: { variant: 'secondary', label: 'Brouillon' },
      envoyee: { variant: 'default', label: 'Envoyée' },
      payee: { variant: 'default', label: 'Payée', className: 'bg-green-600' },
      impayee: { variant: 'destructive', label: 'Impayée' },
      annulee: { variant: 'outline', label: 'Annulée' },
    }
    const config = variants[status] || variants.brouillon
    return <Badge {...config}>{config.label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/facturation')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Facture introuvable
            </h3>
            <p className="text-sm text-slate-500">
              Cette facture n'existe pas ou a été supprimée
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/facturation')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">
                {invoice.numero}
              </h1>
              {getStatusBadge(invoice.status)}
            </div>
            <p className="text-slate-500 mt-1">
              Facture du {formatDate(invoice.date)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Télécharger
          </Button>
          {invoice.status === 'brouillon' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/facturation/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button
                size="sm"
                onClick={() => updateStatus('envoyee')}
              >
                <Send className="h-4 w-4 mr-1" />
                Envoyer
              </Button>
            </>
          )}
          {invoice.status === 'envoyee' && (
            <Button
              size="sm"
              onClick={() => updateStatus('payee')}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Marquer comme payée
            </Button>
          )}
        </div>
      </div>

      {/* Informations patient */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patiente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <Link
                to={`/patients/${invoice.patient.id}`}
                className="text-lg font-medium text-slate-900 hover:text-blue-600"
              >
                {invoice.patient.firstName} {invoice.patient.lastName}
              </Link>
            </div>
            {invoice.patient.email && (
              <p className="text-sm text-slate-600">{invoice.patient.email}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Détails facture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Détails de la facture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Numéro</p>
              <p className="font-medium text-slate-900">{invoice.numero}</p>
            </div>

            <div>
              <p className="text-slate-600">Date</p>
              <p className="font-medium text-slate-900">{formatDate(invoice.date)}</p>
            </div>

            {invoice.dateEcheance && (
              <div>
                <p className="text-slate-600">Date d'échéance</p>
                <p className="font-medium text-slate-900">
                  {formatDate(invoice.dateEcheance)}
                </p>
              </div>
            )}

            {invoice.paymentMethod && (
              <div>
                <p className="text-slate-600">Moyen de paiement</p>
                <p className="font-medium text-slate-900 capitalize">
                  {invoice.paymentMethod}
                </p>
              </div>
            )}
          </div>

          {invoice.consultation && (
            <div className="pt-4 border-t">
              <p className="text-sm text-slate-600 mb-2">Consultation associée</p>
              <Link
                to={`/consultations/${invoice.consultation.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {invoice.consultation.type} du {formatDate(invoice.consultation.date)}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cotations */}
      <Card>
        <CardHeader>
          <CardTitle>Cotations NGAP</CardTitle>
        </CardHeader>
        <CardContent>
          {invoice.cotations && invoice.cotations.length > 0 ? (
            <div className="space-y-2">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-600 border-b">
                    <th className="text-left pb-2">Code</th>
                    <th className="text-left pb-2">Libellé</th>
                    <th className="text-right pb-2">Montant</th>
                    <th className="text-right pb-2">Qté</th>
                    <th className="text-right pb-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.cotations.map((cot, index) => (
                    <tr key={index} className="text-sm border-b">
                      <td className="py-2 font-medium">{cot.code}</td>
                      <td className="py-2">{cot.libelle}</td>
                      <td className="py-2 text-right">{cot.montant.toFixed(2)} €</td>
                      <td className="py-2 text-right">{cot.quantity}</td>
                      <td className="py-2 text-right font-medium">
                        {(cot.montant * cot.quantity).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-4 space-y-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total HT</span>
                  <span className="font-medium">{parseFloat(invoice.montantHT).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total TTC</span>
                  <span>{parseFloat(invoice.montantTTC).toFixed(2)} €</span>
                </div>
                {parseFloat(invoice.montantPaye) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Montant payé</span>
                    <span className="font-medium">
                      {parseFloat(invoice.montantPaye).toFixed(2)} €
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Aucune cotation</p>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {invoice.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
