import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Check,
  X,
  AlertCircle,
  Edit,
  Droplet,
  Syringe,
  TestTube,
  Activity,
  Pill
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface RecapGrossesseProps {
  grossesseId: string
  patientId: string
}

interface RecapData {
  // Sérologies avec dates
  groupeSanguin?: string
  groupeSanguinDate?: string
  rhesus?: string
  rhesusDate?: string
  toxoplasmose?: 'immune' | 'non_immune' | 'nc'
  toxoplasmoseDate?: string
  rubeole?: 'immune' | 'non_immune' | 'nc'
  rubeoleDate?: string
  syphilis?: 'negatif' | 'positif' | 'nc'
  syphilisDate?: string
  vhb?: 'negatif' | 'positif' | 'nc'
  vhbDate?: string
  vhc?: 'negatif' | 'positif' | 'nc'
  vhcDate?: string
  vih?: 'negatif' | 'positif' | 'nc'
  vihDate?: string

  // Examens avec dates
  gaj?: string // Glycémie à jeun
  gajDate?: string
  hgpo?: 'normal' | 'patho' | 'nc'
  hgpoDate?: string
  echoT1?: boolean
  echoT1Date?: string
  echoT1Description?: string
  echoT2?: boolean
  echoT2Date?: string
  echoT2Description?: string
  echoT3?: boolean
  echoT3Date?: string
  echoT3Description?: string
  rai?: 'negatif' | 'positif' | 'nc'
  raiDate?: string
  nfs6mois?: 'normal' | 'anemie' | 'nc'
  nfs6moisDate?: string

  // À cocher avec dates
  vitD?: boolean
  vitDDate?: string
  vaccinCoqueluche?: boolean
  vaccinCoqelucheDate?: string
  pvStreptoB?: 'negatif' | 'positif' | 'nc'
  pvSteptoBDate?: string
}

export function RecapGrossesse({ grossesseId, patientId }: RecapGrossesseProps) {
  const [data, setData] = useState<RecapData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editData, setEditData] = useState<RecapData>({})

  useEffect(() => {
    fetchData()
  }, [grossesseId, patientId])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      // Fetch from patient and grossesse data
      const [patientRes, grossesseRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/patients/${patientId}`, {
          credentials: 'include'
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/grossesses/${grossesseId}`, {
          credentials: 'include'
        })
      ])

      const patientData = await patientRes.json()
      const grossesseData = await grossesseRes.json()

      if (patientData.success && grossesseData.success) {
        const patient = patientData.patient
        const grossesse = grossesseData.grossesse

        setData({
          groupeSanguin: patient.bloodType,
          rhesus: patient.rhesus,
          // Les autres données viendront des examens prénataux
          // Pour l'instant on les met depuis la grossesse si elles existent
          ...grossesse.recapMedical,
        })
      }
    } catch (error) {
      console.error('Error fetching recap data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Save to grossesse
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/grossesses/${grossesseId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            recapMedical: editData
          })
        }
      )

      if (res.ok) {
        setData(editData)
        setIsEditOpen(false)
        alert('Récapitulatif mis à jour !')
      }
    } catch (error) {
      console.error('Error saving recap:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const openEdit = () => {
    setEditData({ ...data })
    setIsEditOpen(true)
  }

  const getDisplayValue = (
    value: string | boolean | undefined,
    type: 'serologie' | 'exam' | 'checkbox'
  ) => {
    if (type === 'checkbox') {
      if (!value) return null
      return 'Fait'
    }

    if (type === 'exam') {
      if (value !== true) return null
      return 'Fait'
    }

    // Sérologie - Ne rien afficher si non renseigné
    if (!value || value === 'nc') {
      return null
    }

    // Conversion des valeurs en texte simple
    if (value === 'immune') return '+'
    if (value === 'non_immune') return '-'
    if (value === 'negatif') return 'Négatif'
    if (value === 'positif') return 'Positif'
    if (value === 'normal') return 'Normal'
    if (value === 'anemie') return 'Anémie'
    if (value === 'patho') return 'Pathologique'

    return value
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-slate-500">
          Chargement...
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card
        className="border-pink-200 bg-pink-50/50 cursor-pointer hover:bg-pink-100/50 transition-colors group"
        onClick={openEdit}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              Récapitulatif Grossesse
              <Edit className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-8 gap-x-3 gap-y-1">
            {/* Groupe sanguin & Rhésus */}
            {data.groupeSanguin && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">Groupe:</span>
                <span className="text-base font-bold">{data.groupeSanguin}</span>
              </div>
            )}
            {data.rhesus && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">Rhésus:</span>
                <span className="text-base font-bold">{data.rhesus === 'negatif' ? 'Négatif' : 'Positif'}</span>
              </div>
            )}

            {/* Sérologies */}
            {getDisplayValue(data.toxoplasmose, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">Toxo:</span>
                <span className="text-base font-bold">{getDisplayValue(data.toxoplasmose, 'serologie')}</span>
              </div>
            )}
            {getDisplayValue(data.rubeole, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">Rubéole:</span>
                <span className="text-base font-bold">{getDisplayValue(data.rubeole, 'serologie')}</span>
              </div>
            )}
            {getDisplayValue(data.syphilis, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">Syphilis:</span>
                <span className="text-base font-bold">{getDisplayValue(data.syphilis, 'serologie')}</span>
              </div>
            )}
            {getDisplayValue(data.vhb, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">VHB:</span>
                <span className="text-base font-bold">{getDisplayValue(data.vhb, 'serologie')}</span>
              </div>
            )}
            {getDisplayValue(data.vhc, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">VHC:</span>
                <span className="text-base font-bold">{getDisplayValue(data.vhc, 'serologie')}</span>
              </div>
            )}
            {getDisplayValue(data.vih, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">VIH:</span>
                <span className="text-base font-bold">{getDisplayValue(data.vih, 'serologie')}</span>
              </div>
            )}

            {/* Examens */}
            {data.gaj && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">GàJ:</span>
                <span className="text-base font-bold font-mono">{data.gaj}</span>
              </div>
            )}
            {getDisplayValue(data.hgpo, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">HGPO:</span>
                <span className="text-base font-bold">{getDisplayValue(data.hgpo, 'serologie')}</span>
              </div>
            )}
            {getDisplayValue(data.rai, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">RAI:</span>
                <span className="text-base font-bold">{getDisplayValue(data.rai, 'serologie')}</span>
              </div>
            )}
            {getDisplayValue(data.nfs6mois, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">NFS:</span>
                <span className="text-base font-bold">{getDisplayValue(data.nfs6mois, 'serologie')}</span>
              </div>
            )}
            {getDisplayValue(data.pvStreptoB, 'serologie') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">Strepto B:</span>
                <span className="text-base font-bold">{getDisplayValue(data.pvStreptoB, 'serologie')}</span>
              </div>
            )}

            {/* Échographies */}
            {getDisplayValue(data.echoT1, 'exam') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">T1:</span>
                <span className="text-base font-bold">{getDisplayValue(data.echoT1, 'exam')}</span>
              </div>
            )}
            {getDisplayValue(data.echoT2, 'exam') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">T2:</span>
                <span className="text-base font-bold">{getDisplayValue(data.echoT2, 'exam')}</span>
              </div>
            )}
            {getDisplayValue(data.echoT3, 'exam') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">T3:</span>
                <span className="text-base font-bold">{getDisplayValue(data.echoT3, 'exam')}</span>
              </div>
            )}

            {/* Prévention */}
            {getDisplayValue(data.vitD, 'checkbox') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">Vit D:</span>
                <span className="text-base font-bold">{getDisplayValue(data.vitD, 'checkbox')}</span>
              </div>
            )}
            {getDisplayValue(data.vaccinCoqueluche, 'checkbox') && (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-slate-700">Coqueluche:</span>
                <span className="text-base font-bold">{getDisplayValue(data.vaccinCoqueluche, 'checkbox')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le récapitulatif grossesse</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations clés de la grossesse
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Groupe sanguin */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Groupe sanguin</Label>
                <Input
                  value={editData.groupeSanguin || ''}
                  onChange={(e) => setEditData({ ...editData, groupeSanguin: e.target.value })}
                  placeholder="A, B, AB, O"
                />
              </div>
              <div className="space-y-2">
                <Label>Rhésus</Label>
                <Select
                  value={editData.rhesus || ''}
                  onValueChange={(v) => setEditData({ ...editData, rhesus: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positif">Positif</SelectItem>
                    <SelectItem value="negatif">Négatif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sérologies */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium text-sm">Sérologies</h4>

              {[
                { key: 'toxoplasmose', label: 'Toxoplasmose' },
                { key: 'rubeole', label: 'Rubéole' },
                { key: 'syphilis', label: 'Syphilis' },
                { key: 'vhb', label: 'VHB' },
                { key: 'vhc', label: 'VHC' },
                { key: 'vih', label: 'VIH' },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <Label className="text-xs">{item.label}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={(editData as any)[item.key] || 'nc'}
                      onValueChange={(v) => setEditData({ ...editData, [item.key]: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nc">Non renseigné</SelectItem>
                        {item.key === 'toxoplasmose' || item.key === 'rubeole' ? (
                          <>
                            <SelectItem value="immune">Immune</SelectItem>
                            <SelectItem value="non_immune">Non immune</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="negatif">Négatif</SelectItem>
                            <SelectItem value="positif">Positif</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={(editData as any)[item.key + 'Date'] || ''}
                      onChange={(e) => setEditData({ ...editData, [item.key + 'Date']: e.target.value })}
                      placeholder="Date"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Examens */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium text-sm">Examens</h4>

              <div className="space-y-2">
                <Label className="text-xs">GàJ</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={editData.gaj || ''}
                    onChange={(e) => setEditData({ ...editData, gaj: e.target.value })}
                    placeholder="0.85"
                  />
                  <Input
                    type="date"
                    value={editData.gajDate || ''}
                    onChange={(e) => setEditData({ ...editData, gajDate: e.target.value })}
                    placeholder="Date"
                  />
                </div>
              </div>

              {[
                { key: 'hgpo', label: 'HGPO' },
                { key: 'rai', label: 'RAI' },
                { key: 'nfs6mois', label: 'NFS 6ème mois' },
                { key: 'pvStreptoB', label: 'PV Strepto B' },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <Label className="text-xs">{item.label}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={(editData as any)[item.key] || 'nc'}
                      onValueChange={(v) => setEditData({ ...editData, [item.key]: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nc">Non renseigné</SelectItem>
                        {item.key === 'hgpo' ? (
                          <>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="patho">Pathologique</SelectItem>
                          </>
                        ) : item.key === 'nfs6mois' ? (
                          <>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="anemie">Anémie</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="negatif">Négatif</SelectItem>
                            <SelectItem value="positif">Positif</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={(editData as any)[item.key + 'Date'] || ''}
                      onChange={(e) => setEditData({ ...editData, [item.key + 'Date']: e.target.value })}
                      placeholder="Date"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Échographies */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium text-sm">Échographies</h4>

              {[
                { key: 'echoT1', label: 'Écho T1' },
                { key: 'echoT2', label: 'Écho T2' },
                { key: 'echoT3', label: 'Écho T3' },
              ].map((item) => (
                <div key={item.key} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={item.key}
                      checked={(editData as any)[item.key] || false}
                      onCheckedChange={(checked) =>
                        setEditData({ ...editData, [item.key]: checked })
                      }
                    />
                    <Label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                      {item.label}
                    </Label>
                  </div>
                  {(editData as any)[item.key] && (
                    <>
                      <Input
                        type="date"
                        value={(editData as any)[item.key + 'Date'] || ''}
                        onChange={(e) => setEditData({ ...editData, [item.key + 'Date']: e.target.value })}
                        placeholder="Date de l'échographie"
                      />
                      <Textarea
                        value={(editData as any)[item.key + 'Description'] || ''}
                        onChange={(e) => setEditData({ ...editData, [item.key + 'Description']: e.target.value })}
                        placeholder="Description de l'échographie (ex: biométrie, anomalies détectées...)"
                        rows={3}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* À cocher */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium text-sm">Prévention</h4>

              {[
                { key: 'vitD', label: 'Vitamine D prescrite' },
                { key: 'vaccinCoqueluche', label: 'Vaccin coqueluche fait' },
              ].map((item) => (
                <div key={item.key} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={item.key}
                      checked={(editData as any)[item.key] || false}
                      onCheckedChange={(checked) =>
                        setEditData({ ...editData, [item.key]: checked })
                      }
                    />
                    <Label htmlFor={item.key} className="text-sm font-medium cursor-pointer">
                      {item.label}
                    </Label>
                  </div>
                  {(editData as any)[item.key] && (
                    <Input
                      type="date"
                      value={(editData as any)[item.key + 'Date'] || ''}
                      onChange={(e) => setEditData({ ...editData, [item.key + 'Date']: e.target.value })}
                      placeholder="Date"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
