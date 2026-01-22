import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { PDFExportService } from '@/services/pdfExportService'
import { useToast } from '@/hooks/use-toast'

interface ExportPDFButtonProps {
  type: 'consultation' | 'grossesse' | 'ordonnance' | 'custom'
  data: any
  patient?: any
  consultations?: any[]
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function ExportPDFButton({
  type,
  data,
  patient,
  consultations = [],
  variant = 'outline',
  size = 'default',
  className,
}: ExportPDFButtonProps) {
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setExporting(true)
    try {
      switch (type) {
        case 'consultation':
          await PDFExportService.exportConsultation(data, patient)
          break
        case 'grossesse':
          await PDFExportService.exportGrossesse(data, patient, consultations)
          break
        case 'ordonnance':
          await PDFExportService.exportOrdonnance(data, patient)
          break
        default:
          throw new Error('Type d\'export non supporté')
      }

      toast({
        title: 'Export réussi',
        description: 'Le PDF a été généré et téléchargé avec succès.',
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur d\'export',
        description: 'Une erreur est survenue lors de la génération du PDF.',
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={exporting}
      className={className}
    >
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Export en cours...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Exporter PDF
        </>
      )}
    </Button>
  )
}
