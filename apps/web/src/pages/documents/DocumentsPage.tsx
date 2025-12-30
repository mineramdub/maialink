import { Card, CardContent } from '../../components/ui/card'
import { FileText } from 'lucide-react'

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Documents</h1>
        <p className="text-slate-500 mt-1">Gérer les documents patients</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Gestion documentaire
          </h3>
          <p className="text-sm text-slate-500 text-center max-w-md">
            Cette fonctionnalité permet de gérer tous les documents liés aux patientes
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
