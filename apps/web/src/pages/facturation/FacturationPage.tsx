import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Plus, Receipt, Loader2, Calendar, Euro } from 'lucide-react'
import { formatDate } from '../../lib/utils'

export default function FacturationPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices`, {
        credentials: 'include'
      })
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Facturation</h1>
          <p className="text-slate-500 mt-1">
            {invoices.length} facture{invoices.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link to="/facturation/new">
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle facture
          </Link>
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total HT</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {parseFloat(stats.totalHT || 0).toFixed(2)} €
                  </p>
                </div>
                <Euro className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total payé</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {parseFloat(stats.totalPaye || 0).toFixed(2)} €
                  </p>
                </div>
                <Euro className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Nombre</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.count || 0}
                  </p>
                </div>
                <Receipt className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Aucune facture
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Commencez par créer une nouvelle facture
            </p>
            <Button asChild>
              <Link to="/facturation/new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle facture
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Link key={invoice.id} to={`/facturation/${invoice.id}`}>
              <Card className="hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                        <Receipt className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-900">
                            {invoice.numero}
                          </h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(invoice.date)}
                          </div>
                          <span>
                            {invoice.patient.firstName} {invoice.patient.lastName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-slate-900">
                        {parseFloat(invoice.montantTTC).toFixed(2)} €
                      </div>
                      {invoice.cotations && invoice.cotations.length > 0 && (
                        <div className="text-sm text-slate-600">
                          {invoice.cotations.length} cotation{invoice.cotations.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
