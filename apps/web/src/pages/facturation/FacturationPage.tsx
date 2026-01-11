import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Plus, Receipt, Loader2, Calendar, Euro, FileSpreadsheet } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { useInvoices, usePrefetchInvoice } from '../../hooks/useInvoices'

export default function FacturationPage() {
  const prefetchInvoice = usePrefetchInvoice()

  // React Query with cache - data fetched in background
  const { data, isLoading, error } = useInvoices()
  const invoices = data?.invoices || []
  const stats = data?.stats

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
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/facturation/export">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export comptable
            </Link>
          </Button>
          <Button asChild>
            <Link to="/facturation/new">
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle facture
            </Link>
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 shadow-lg card-premium animate-slide-up">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600/80 uppercase tracking-wide mb-2">Total HT</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {parseFloat(stats.totalHT || 0).toFixed(2)} €
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Euro className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-50 via-white to-green-50/50 shadow-lg card-premium animate-slide-up" style={{animationDelay: '50ms'}}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-600/80 uppercase tracking-wide mb-2">Total payé</p>
                  <p className="text-3xl font-bold text-green-900">
                    {parseFloat(stats.totalPaye || 0).toFixed(2)} €
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Euro className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-50 via-white to-purple-50/50 shadow-lg card-premium animate-slide-up" style={{animationDelay: '100ms'}}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-600/80 uppercase tracking-wide mb-2">Factures</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {stats.count || 0}
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Receipt className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="py-8 text-center text-red-600">
            Erreur lors du chargement
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && invoices.length === 0 && (
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
      )}

      {!isLoading && !error && invoices.length > 0 && (
        <div className="space-y-3">
          {invoices.map((invoice: any, index: number) => (
            <Link
              key={invoice.id}
              to={`/facturation/${invoice.id}`}
              onMouseEnter={() => prefetchInvoice(invoice.id)}
              onFocus={() => prefetchInvoice(invoice.id)}
              className="block animate-slide-up"
              style={{animationDelay: `${index * 30}ms`}}
            >
              <Card className="card-premium border-0 bg-gradient-to-r from-white via-purple-50/20 to-pink-50/20 hover:shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.01]">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shadow-purple-500/30">
                        <Receipt className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 text-base">
                            {invoice.numero}
                          </h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {formatDate(invoice.date)}
                          </div>
                          <span>
                            {invoice.patient?.firstName} {invoice.patient?.lastName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {parseFloat(invoice.montantTTC).toFixed(2)} €
                      </div>
                      {invoice.cotations && invoice.cotations.length > 0 && (
                        <div className="text-sm text-slate-600 font-medium mt-1">
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
