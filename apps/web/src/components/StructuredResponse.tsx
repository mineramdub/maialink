import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { Pill, ClipboardList, Stethoscope, AlertCircle, Check } from 'lucide-react'

interface MedicamentInfo {
  nom: string
  dci?: string
  dosage: string
  forme: string
  posologie: string
  duree: string
  contrindications?: string[]
  effetsSecondaires?: string[]
}

interface EtapeProcedure {
  numero: number
  action: string
  details?: string
  prerequis?: string
}

interface ExamenInfo {
  nom: string
  periode: string
  timing: string
  objectif: string
  valeursNormales?: Record<string, string>
  conduiteAnormal?: string
}

interface PathologieInfo {
  nom: string
  definition: string
  symptomes: string[]
  facteursRisque?: string[]
  diagnostic: string[]
  traitement: string
  surveillance: string[]
}

interface StructuredData {
  type: 'medicament' | 'procedure' | 'examen' | 'pathologie' | 'general'
  resume: string
  medicaments?: MedicamentInfo[]
  procedure?: {
    nom: string
    indication: string
    etapes: EtapeProcedure[]
    materiel?: string[]
    precautions?: string[]
  }
  examens?: ExamenInfo[]
  pathologie?: PathologieInfo
  recommandations?: string[]
  sources: Array<{
    protocole: string
    page: number
  }>
}

interface StructuredResponseProps {
  data: StructuredData
}

export function StructuredResponse({ data }: StructuredResponseProps) {
  return (
    <div className="space-y-3">
      {/* Résumé */}
      <div className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">
        {data.resume}
      </div>

      {/* Médicaments */}
      {data.medicaments && data.medicaments.length > 0 && (
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-slate-900">Médicaments</h4>
          </div>
          <div className="space-y-3">
            {data.medicaments.map((med, i) => (
              <div key={i} className="bg-blue-50 rounded-lg p-3 space-y-2">
                <div>
                  <div className="font-medium text-blue-900">{med.nom}</div>
                  {med.dci && <div className="text-xs text-blue-600">{med.dci}</div>}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-600">Dosage:</span>
                    <div className="font-medium">{med.dosage}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Forme:</span>
                    <div className="font-medium">{med.forme}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-600">Posologie:</span>
                    <div className="font-medium">{med.posologie}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-600">Durée:</span>
                    <div className="font-medium">{med.duree}</div>
                  </div>
                </div>
                {med.contrindications && med.contrindications.length > 0 && (
                  <div className="text-xs">
                    <span className="text-red-600 font-medium">⚠️ Contre-indications:</span>
                    <ul className="list-disc list-inside text-red-700">
                      {med.contrindications.map((ci, idx) => (
                        <li key={idx}>{ci}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Procédure */}
      {data.procedure && (
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-slate-900">{data.procedure.nom}</h4>
          </div>
          <div className="text-sm text-slate-600 mb-3">{data.procedure.indication}</div>
          <div className="space-y-2">
            {data.procedure.etapes.map((etape) => (
              <div key={etape.numero} className="flex gap-3 bg-purple-50 rounded-lg p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">
                  {etape.numero}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{etape.action}</div>
                  {etape.details && <div className="text-xs text-slate-600 mt-1">{etape.details}</div>}
                  {etape.prerequis && (
                    <div className="text-xs text-purple-700 mt-1">
                      <span className="font-medium">Prérequis:</span> {etape.prerequis}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {data.procedure.materiel && data.procedure.materiel.length > 0 && (
            <div className="mt-3 text-xs">
              <span className="font-medium text-slate-700">Matériel nécessaire:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.procedure.materiel.map((mat, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{mat}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Examens */}
      {data.examens && data.examens.length > 0 && (
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-slate-900">Examens</h4>
          </div>
          <div className="space-y-3">
            {data.examens.map((examen, i) => (
              <div key={i} className="bg-green-50 rounded-lg p-3 space-y-2">
                <div>
                  <div className="font-medium text-green-900">{examen.nom}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{examen.periode}</Badge>
                    <Badge variant="outline" className="text-xs">{examen.timing}</Badge>
                  </div>
                </div>
                <div className="text-sm text-slate-700">{examen.objectif}</div>
                {examen.valeursNormales && Object.keys(examen.valeursNormales).length > 0 && (
                  <div className="text-xs bg-white rounded p-2">
                    <div className="font-medium text-slate-700 mb-1">Valeurs normales:</div>
                    {Object.entries(examen.valeursNormales).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {examen.conduiteAnormal && (
                  <div className="text-xs text-orange-700 bg-orange-50 rounded p-2">
                    <span className="font-medium">Si anormal:</span> {examen.conduiteAnormal}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pathologie */}
      {data.pathologie && (
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h4 className="font-semibold text-slate-900">{data.pathologie.nom}</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs font-medium text-slate-600 mb-1">Définition</div>
              <div className="text-sm text-slate-700">{data.pathologie.definition}</div>
            </div>
            {data.pathologie.symptomes.length > 0 && (
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">Symptômes</div>
                <div className="flex flex-wrap gap-1">
                  {data.pathologie.symptomes.map((symptome, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{symptome}</Badge>
                  ))}
                </div>
              </div>
            )}
            {data.pathologie.diagnostic.length > 0 && (
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">Diagnostic</div>
                <ul className="text-sm space-y-1">
                  {data.pathologie.diagnostic.map((diag, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                      <span>{diag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <div className="text-xs font-medium text-slate-600 mb-1">Traitement</div>
              <div className="text-sm text-slate-700 bg-red-50 rounded p-2">{data.pathologie.traitement}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Recommandations */}
      {data.recommandations && data.recommandations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="font-medium text-amber-900 text-sm mb-2">📌 Recommandations</div>
          <ul className="text-xs text-amber-800 space-y-1">
            {data.recommandations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources */}
      {data.sources.length > 0 && (
        <div className="text-xs text-slate-500">
          <div className="font-medium mb-1">Sources:</div>
          <div className="flex flex-wrap gap-1">
            {data.sources.map((source, i) => (
              <span key={i} className="bg-slate-100 rounded px-2 py-0.5">
                {source.protocole} (p.{source.page})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
