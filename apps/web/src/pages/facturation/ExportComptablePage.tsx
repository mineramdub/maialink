import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  TrendingUp,
  Calendar,
  Receipt,
  Euro,
  Loader2,
} from 'lucide-react'

export default function ExportComptablePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [exportData, setExportData] = useState<any>(null)

  // Date filters
  const [periode, setPeriode] = useState('mois-courant')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Load initial data
  useEffect(() => {
    calculateDateRange()
  }, [periode])

  useEffect(() => {
    if (startDate && endDate) {
      fetchExportData()
    }
  }, [startDate, endDate])

  const calculateDateRange = () => {
    const now = new Date()
    let start: Date
    let end: Date = now

    switch (periode) {
      case 'mois-courant':
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'mois-precedent':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        end = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case 'trimestre-courant':
        const currentQuarter = Math.floor(now.getMonth() / 3)
        start = new Date(now.getFullYear(), currentQuarter * 3, 1)
        break
      case 'annee-courante':
        start = new Date(now.getFullYear(), 0, 1)
        break
      case 'annee-precedente':
        start = new Date(now.getFullYear() - 1, 0, 1)
        end = new Date(now.getFullYear() - 1, 11, 31)
        break
      case 'personnalise':
        return // Don't auto-calculate for custom range
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }

  const fetchExportData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoices/export/accounting?startDate=${startDate}&endDate=${endDate}`,
        { credentials: 'include' }
      )
      const data = await res.json()
      if (data.success) {
        setExportData(data.export)
      }
    } catch (error) {
      console.error('Error fetching export data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (!exportData) return

    // Convert to CSV
    const csvData = generateCSV(exportData)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `export-comptable-${startDate}-${endDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateCSV = (data: any) => {
    let csv = 'EXPORT COMPTABLE\n\n'

    // Summary
    csv += 'RÉCAPITULATIF\n'
    csv += `Période,${data.summary.periode.debut},${data.summary.periode.fin}\n`
    csv += `Total factures,${data.summary.totalFactures}\n`
    csv += `Montant HT,${data.summary.montantTotalHT.toFixed(2)} €\n`
    csv += `Montant TTC,${data.summary.montantTotalTTC.toFixed(2)} €\n`
    csv += `Montant payé,${data.summary.montantTotalPaye.toFixed(2)} €\n`
    csv += `En attente,${data.summary.montantEnAttente.toFixed(2)} €\n\n`

    // Procedures
    csv += 'DÉTAIL PAR ACTE (CODES NGAP)\n'
    csv += 'Code,Libellé,Quantité,Montant unitaire,Montant total\n'
    data.detailProcedures.forEach((proc: any) => {
      csv += `${proc.code || ''},${proc.libelle},${proc.quantite},${proc.montantUnitaire.toFixed(2)},${proc.montantTotal.toFixed(2)}\n`
    })
    csv += '\n'

    // Revenue journal
    csv += 'JOURNAL DES RECETTES\n'
    csv += 'Date,N° Facture,Patient,Désignation,Montant HT,Montant TTC,Montant payé,Mode paiement\n'
    data.journalRecettes.forEach((rec: any) => {
      csv += `${rec.date},${rec.numeroFacture},${rec.patient},"${rec.designation}",${rec.montantHT.toFixed(2)},${rec.montantTTC.toFixed(2)},${rec.montantPaye.toFixed(2)},${rec.modePaiement}\n`
    })

    return csv
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/facturation')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Export Comptable</h1>
            <p className="text-sm text-slate-500 mt-1">
              Récapitulatif et export pour votre expert-comptable
            </p>
          </div>
        </div>

        {exportData && (
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
            <Button onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Période
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Période prédéfinie</Label>
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mois-courant">Mois en cours</SelectItem>
                  <SelectItem value="mois-precedent">Mois précédent</SelectItem>
                  <SelectItem value="trimestre-courant">Trimestre en cours</SelectItem>
                  <SelectItem value="annee-courante">Année en cours</SelectItem>
                  <SelectItem value="annee-precedente">Année précédente</SelectItem>
                  <SelectItem value="personnalise">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date de début</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setPeriode('personnalise')
                }}
              />
            </div>

            <div>
              <Label>Date de fin</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setPeriode('personnalise')
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {!isLoading && exportData && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Factures</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {exportData.summary.totalFactures}
                    </p>
                  </div>
                  <Receipt className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total HT</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {exportData.summary.montantTotalHT.toFixed(2)} €
                    </p>
                  </div>
                  <Euro className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Payé</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {exportData.summary.montantTotalPaye.toFixed(2)} €
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">En attente</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      {exportData.summary.montantEnAttente.toFixed(2)} €
                    </p>
                  </div>
                  <Euro className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown by status */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Object.entries(exportData.summary.parStatut).map(([status, montant]: [string, any]) => (
                  <Badge key={status} variant="outline" className="text-sm px-4 py-2">
                    <span className="capitalize">{status}</span>: {montant.toFixed(2)} €
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detail by procedure */}
          <Card>
            <CardHeader>
              <CardTitle>Détail par acte (Codes NGAP)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead className="text-right">Montant unitaire</TableHead>
                    <TableHead className="text-right">Montant total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportData.detailProcedures.map((proc: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{proc.code || 'N/A'}</TableCell>
                      <TableCell>{proc.libelle}</TableCell>
                      <TableCell className="text-right">{proc.quantite}</TableCell>
                      <TableCell className="text-right">{proc.montantUnitaire.toFixed(2)} €</TableCell>
                      <TableCell className="text-right font-semibold">{proc.montantTotal.toFixed(2)} €</TableCell>
                    </TableRow>
                  ))}
                  {exportData.detailProcedures.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500">
                        Aucun acte enregistré pour cette période
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Revenue journal */}
          <Card>
            <CardHeader>
              <CardTitle>Journal des recettes (factures payées)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Désignation</TableHead>
                    <TableHead className="text-right">Montant HT</TableHead>
                    <TableHead className="text-right">Montant TTC</TableHead>
                    <TableHead className="text-right">Mode paiement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportData.journalRecettes.map((rec: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(rec.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="font-medium">{rec.numeroFacture}</TableCell>
                      <TableCell>{rec.patient}</TableCell>
                      <TableCell className="max-w-xs truncate">{rec.designation}</TableCell>
                      <TableCell className="text-right">{rec.montantHT.toFixed(2)} €</TableCell>
                      <TableCell className="text-right font-semibold">{rec.montantTTC.toFixed(2)} €</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{rec.modePaiement}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {exportData.journalRecettes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500">
                        Aucune recette pour cette période
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {!isLoading && !exportData && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileSpreadsheet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Sélectionnez une période pour voir les données</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
