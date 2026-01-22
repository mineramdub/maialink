import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  Loader2,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

interface ShareManagementProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Share {
  id: string
  shareType: 'patient' | 'grossesse' | 'documents' | 'synthetic_pdf'
  shareToken: string
  permissions: {
    read: boolean
    write: boolean
    download: boolean
  }
  recipientName?: string
  recipientEmail?: string
  recipientNote?: string
  isActive: boolean
  currentAccessCount: number
  maxAccessCount?: number
  lastAccessAt?: string
  createdAt: string
  revokedAt?: string
  revokedBy?: string
  revocationReason?: string
  patient?: {
    id: string
    firstName: string
    lastName: string
  }
  grossesse?: {
    id: string
    ddr: string
    patient: {
      firstName: string
      lastName: string
    }
  }
}

interface ShareLog {
  id: string
  action: 'access_granted' | 'access_denied' | 'data_read' | 'data_modified' | 'revoked'
  resourceType?: string
  resourceId?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export function ShareManagement({ open, onOpenChange }: ShareManagementProps) {
  const [shares, setShares] = useState<Share[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showInactive, setShowInactive] = useState(false)
  const [selectedShare, setSelectedShare] = useState<Share | null>(null)
  const [shareLogsDialog, setShareLogsDialog] = useState(false)
  const [shareLogs, setShareLogs] = useState<ShareLog[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const [revokeDialog, setRevokeDialog] = useState(false)
  const [revokeReason, setRevokeReason] = useState('')
  const [isRevoking, setIsRevoking] = useState(false)

  useEffect(() => {
    if (open) {
      fetchShares()
    }
  }, [open, showInactive])

  const fetchShares = async () => {
    setIsLoading(true)
    try {
      const activeParam = showInactive ? '' : '?active=true'
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/share/list${activeParam}`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setShares(data.shares)
      }
    } catch (error) {
      console.error('Error fetching shares:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchShareLogs = async (shareId: string) => {
    setIsLoadingLogs(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/share/${shareId}/logs`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setShareLogs(data.logs)
      }
    } catch (error) {
      console.error('Error fetching share logs:', error)
    } finally {
      setIsLoadingLogs(false)
    }
  }

  const handleViewLogs = (share: Share) => {
    setSelectedShare(share)
    setShareLogsDialog(true)
    fetchShareLogs(share.id)
  }

  const handleRevoke = async () => {
    if (!selectedShare) return

    setIsRevoking(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/share/${selectedShare.id}/revoke`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ reason: revokeReason || null }),
        }
      )

      const data = await res.json()

      if (data.success) {
        setRevokeDialog(false)
        setRevokeReason('')
        setSelectedShare(null)
        fetchShares()
      } else {
        alert(data.error || 'Erreur lors de la révocation')
      }
    } catch (error) {
      console.error('Error revoking share:', error)
      alert('Erreur lors de la révocation')
    } finally {
      setIsRevoking(false)
    }
  }

  const openRevokeDialog = (share: Share) => {
    setSelectedShare(share)
    setRevokeDialog(true)
  }

  const formatShareType = (type: string) => {
    switch (type) {
      case 'patient':
        return 'Dossier complet'
      case 'grossesse':
        return 'Grossesse'
      case 'documents':
        return 'Documents'
      case 'synthetic_pdf':
        return 'PDF synthèse'
      default:
        return type
    }
  }

  const formatAction = (action: string) => {
    switch (action) {
      case 'access_granted':
        return 'Accès accordé'
      case 'access_denied':
        return 'Accès refusé'
      case 'data_read':
        return 'Données consultées'
      case 'data_modified':
        return 'Données modifiées'
      case 'revoked':
        return 'Révoqué'
      default:
        return action
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'access_granted':
        return 'text-green-600'
      case 'access_denied':
        return 'text-red-600'
      case 'data_read':
        return 'text-blue-600'
      case 'data_modified':
        return 'text-orange-600'
      case 'revoked':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const getPatientName = (share: Share) => {
    if (share.patient) {
      return `${share.patient.firstName} ${share.patient.lastName}`
    }
    if (share.grossesse?.patient) {
      return `${share.grossesse.patient.firstName} ${share.grossesse.patient.lastName}`
    }
    return 'N/A'
  }

  const formatPermissions = (permissions: Share['permissions']) => {
    const perms = []
    if (permissions.read) perms.push('L')
    if (permissions.write) perms.push('E')
    if (permissions.download) perms.push('T')
    return perms.join('+')
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gestion des partages
            </DialogTitle>
            <DialogDescription>
              Consultez, gérez et révoquez vos partages de dossiers médicaux
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filtres */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showInactive"
                  checked={showInactive}
                  onCheckedChange={(checked) => setShowInactive(!!checked)}
                />
                <Label htmlFor="showInactive" className="cursor-pointer">
                  Afficher les partages révoqués
                </Label>
              </div>
            </div>

            {/* Tableau des partages */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : shares.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Aucun partage {showInactive ? '' : 'actif'} trouvé</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patiente</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Destinataire</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Accès</TableHead>
                      <TableHead>Créé le</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shares.map((share) => (
                      <TableRow key={share.id}>
                        <TableCell className="font-medium">{getPatientName(share)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{formatShareType(share.shareType)}</Badge>
                        </TableCell>
                        <TableCell>
                          {share.recipientName || (
                            <span className="text-slate-400 italic">Non spécifié</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs">{formatPermissions(share.permissions)}</span>
                          {share.permissions.write && (
                            <AlertTriangle className="inline-block h-3 w-3 ml-1 text-orange-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {share.currentAccessCount}
                            {share.maxAccessCount && ` / ${share.maxAccessCount}`}
                          </span>
                          {share.lastAccessAt && (
                            <div className="text-xs text-slate-500">
                              {new Date(share.lastAccessAt).toLocaleString('fr-FR')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {new Date(share.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          {share.isActive ? (
                            <Badge className="bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Actif
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Révoqué
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewLogs(share)}
                              title="Voir les logs"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {share.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openRevokeDialog(share)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Révoquer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog des logs */}
      <Dialog open={shareLogsDialog} onOpenChange={setShareLogsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Journaux d'accès
            </DialogTitle>
            <DialogDescription>
              Historique des accès et modifications pour ce partage
            </DialogDescription>
          </DialogHeader>

          {selectedShare && (
            <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600">Patiente :</span>{' '}
                  <span className="font-medium">{getPatientName(selectedShare)}</span>
                </div>
                <div>
                  <span className="text-slate-600">Type :</span>{' '}
                  <span className="font-medium">{formatShareType(selectedShare.shareType)}</span>
                </div>
                {selectedShare.recipientName && (
                  <div>
                    <span className="text-slate-600">Destinataire :</span>{' '}
                    <span className="font-medium">{selectedShare.recipientName}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-600">Accès :</span>{' '}
                  <span className="font-medium">{selectedShare.currentAccessCount}</span>
                </div>
              </div>
            </div>
          )}

          {isLoadingLogs ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : shareLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Aucun journal d'accès</div>
          ) : (
            <div className="space-y-3">
              {shareLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className={`font-medium ${getActionColor(log.action)}`}>
                        {formatAction(log.action)}
                      </div>
                      {log.resourceType && (
                        <div className="text-sm text-slate-600 mt-1">
                          Ressource : {log.resourceType}
                          {log.resourceId && ` (${log.resourceId.substring(0, 8)}...)`}
                        </div>
                      )}
                      <div className="text-xs text-slate-500 mt-2 space-y-1">
                        <div>
                          <Calendar className="inline-block h-3 w-3 mr-1" />
                          {new Date(log.createdAt).toLocaleString('fr-FR')}
                        </div>
                        {log.ipAddress && (
                          <div>
                            <User className="inline-block h-3 w-3 mr-1" />
                            IP: {log.ipAddress}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de révocation */}
      <Dialog open={revokeDialog} onOpenChange={setRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Révoquer le partage
            </DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Le destinataire perdra immédiatement l'accès aux
              données partagées.
            </DialogDescription>
          </DialogHeader>

          {selectedShare && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg text-sm">
                <div className="font-medium mb-2">Partage à révoquer :</div>
                <div className="space-y-1 text-slate-600">
                  <div>Patiente : {getPatientName(selectedShare)}</div>
                  <div>Type : {formatShareType(selectedShare.shareType)}</div>
                  {selectedShare.recipientName && (
                    <div>Destinataire : {selectedShare.recipientName}</div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="revokeReason">Raison de la révocation (optionnel)</Label>
                <Textarea
                  id="revokeReason"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="Ex: Fin du suivi partagé, erreur de manipulation..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRevokeDialog(false)
                    setRevokeReason('')
                  }}
                  disabled={isRevoking}
                >
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleRevoke} disabled={isRevoking}>
                  {isRevoking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Révocation...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Révoquer définitivement
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
