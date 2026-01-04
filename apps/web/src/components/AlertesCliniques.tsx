import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { AlertTriangle, AlertCircle, Info, TrendingUp, Calculator } from 'lucide-react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface AlertesClinitiquesProps {
  type: string
  poids?: string
  taille?: string
  tensionSystolique?: string
  tensionDiastolique?: string
  hauteurUterine?: string
  saTerm?: string
  bdc?: string
  poidsInitial?: number // Poids en début de grossesse
  taillePatiente?: number // Taille de la patiente
  lastPoids?: number // Poids dernière consultation
  lastDate?: string // Date dernière consultation
}

interface Alerte {
  type: 'danger' | 'warning' | 'info'
  title: string
  message: string
  icon: any
}

interface Calcul {
  label: string
  value: string
  interpretation?: string
  color?: string
}

export function AlertesCliniques({
  type,
  poids,
  taille,
  tensionSystolique,
  tensionDiastolique,
  hauteurUterine,
  saTerm,
  bdc,
  poidsInitial,
  taillePatiente,
  lastPoids,
  lastDate
}: AlertesClinitiquesProps) {
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [calculs, setCalculs] = useState<Calcul[]>([])

  useEffect(() => {
    const newAlertes: Alerte[] = []
    const newCalculs: Calcul[] = []

    // ========== CALCULS ==========

    // IMC
    if (poids && taillePatiente) {
      const imc = parseFloat(poids) / ((taillePatiente / 100) ** 2)
      let interpretation = ''
      let color = 'text-green-600'

      if (imc < 18.5) {
        interpretation = 'Maigreur'
        color = 'text-orange-600'
      } else if (imc < 25) {
        interpretation = 'Poids normal'
        color = 'text-green-600'
      } else if (imc < 30) {
        interpretation = 'Surpoids'
        color = 'text-orange-600'
      } else {
        interpretation = 'Obésité'
        color = 'text-red-600'
      }

      newCalculs.push({
        label: 'IMC',
        value: `${imc.toFixed(1)} kg/m²`,
        interpretation,
        color
      })

      // Alerte si IMC anormal et grossesse
      if (type === 'prenatale') {
        if (imc < 18.5) {
          newAlertes.push({
            type: 'warning',
            title: 'IMC faible',
            message: 'Maigreur - Surveillance nutritionnelle recommandée. Prise de poids cible : 12,5-18 kg',
            icon: AlertTriangle
          })
        } else if (imc >= 30) {
          newAlertes.push({
            type: 'warning',
            title: 'IMC élevé',
            message: 'Obésité - Risque accru de diabète gestationnel, HTA, macrosomie. HGPO systématique. Prise de poids cible : 5-9 kg',
            icon: AlertTriangle
          })
        }
      }
    }

    // Prise de poids
    if (poids && poidsInitial && type === 'prenatale') {
      const prisePoids = parseFloat(poids) - poidsInitial
      const prisePoidsCible = getPrisePoidsCible(poidsInitial, taillePatiente || 165)

      newCalculs.push({
        label: 'Prise de poids totale',
        value: `${prisePoids >= 0 ? '+' : ''}${prisePoids.toFixed(1)} kg`,
        interpretation: `Cible : ${prisePoidsCible}`,
        color: 'text-blue-600'
      })

      // Prise de poids hebdomadaire
      if (lastPoids && lastDate) {
        const joursDepuis = Math.floor(
          (new Date().getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
        )
        const semainesDepuis = joursDepuis / 7
        const prisePoidsSemaine = (parseFloat(poids) - lastPoids) / semainesDepuis

        if (semainesDepuis > 0) {
          newCalculs.push({
            label: 'Prise de poids hebdomadaire',
            value: `${prisePoidsSemaine >= 0 ? '+' : ''}${prisePoidsSemaine.toFixed(2)} kg/sem`,
            interpretation: prisePoidsSemaine > 0.5 ? 'Rapide' : 'Normale',
            color: prisePoidsSemaine > 0.5 ? 'text-orange-600' : 'text-green-600'
          })

          // Alerte si prise de poids excessive
          if (prisePoidsSemaine > 0.5) {
            newAlertes.push({
              type: 'warning',
              title: 'Prise de poids rapide',
              message: `+${prisePoidsSemaine.toFixed(2)} kg/sem (> 500g/sem). Rechercher œdèmes, pré-éclampsie. Conseils diététiques.`,
              icon: TrendingUp
            })
          }
        }
      }
    }

    // ========== ALERTES PRÉNATALES ==========

    if (type === 'prenatale') {
      // HTA
      const tas = tensionSystolique ? parseInt(tensionSystolique) : null
      const tad = tensionDiastolique ? parseInt(tensionDiastolique) : null

      if (tas && tad) {
        if (tas >= 160 || tad >= 110) {
          newAlertes.push({
            type: 'danger',
            title: '🚨 HTA SÉVÈRE - URGENCE',
            message: `TA: ${tas}/${tad} mmHg. Hospitalisation URGENTE recommandée. Risque pré-éclampsie sévère/éclampsie. Bilan complet + traitement antihypertenseur.`,
            icon: AlertTriangle
          })
        } else if (tas >= 140 || tad >= 90) {
          newAlertes.push({
            type: 'warning',
            title: 'HTA gravidique',
            message: `TA: ${tas}/${tad} mmHg (≥140/90). Prescrire : protéinurie 24h, bilan rénal, hépatique, NFS. RDV rapproché 48-72h. Auto-surveillance TA domicile.`,
            icon: AlertTriangle
          })
        }

        // Hypotension
        if (tas < 90 || tad < 60) {
          newAlertes.push({
            type: 'info',
            title: 'Hypotension',
            message: `TA: ${tas}/${tad} mmHg. Rechercher malaise, vertiges. Hydratation, éviter station debout prolongée.`,
            icon: Info
          })
        }
      }

      // Hauteur utérine
      const hu = hauteurUterine ? parseFloat(hauteurUterine) : null
      const sa = saTerm ? parseInt(saTerm) : null

      if (hu && sa && sa >= 20) {
        // HU normale : SA ± 2-3 cm
        if (hu < sa - 4) {
          newAlertes.push({
            type: 'warning',
            title: 'HU insuffisante',
            message: `HU ${hu}cm < ${sa}cm - 4. Suspicion RCIU. Prescrire : échographie + Doppler ombilical urgents. Courbe de croissance.`,
            icon: AlertTriangle
          })
        } else if (hu > sa + 3) {
          newAlertes.push({
            type: 'warning',
            title: 'HU excessive',
            message: `HU ${hu}cm > ${sa}cm + 3. Causes : macrosomie (diabète?), hydramnios, grossesse multiple?, erreur terme. Échographie + glycémie.`,
            icon: AlertTriangle
          })
        }
      }

      // BDC
      const bdcValue = bdc ? parseInt(bdc) : null
      if (bdcValue) {
        if (bdcValue < 110 || bdcValue > 160) {
          newAlertes.push({
            type: 'warning',
            title: 'BDC anormal',
            message: `BDC ${bdcValue} bpm (normal: 110-160). ${bdcValue < 110 ? 'Bradycardie fœtale' : 'Tachycardie fœtale'}. Monitoring fœtal + échographie recommandés.`,
            icon: AlertCircle
          })
        }
      }
    }

    // ========== ALERTES POSTNATALES ==========

    if (type === 'postnatale') {
      const tas = tensionSystolique ? parseInt(tensionSystolique) : null
      const tad = tensionDiastolique ? parseInt(tensionDiastolique) : null

      if (tas && tad) {
        if (tas >= 150 || tad >= 100) {
          newAlertes.push({
            type: 'danger',
            title: 'HTA post-partum',
            message: `TA: ${tas}/${tad} mmHg. Rechercher pré-éclampsie retardée (< 6 semaines post-partum). Bilan rénal, protéinurie. Traitement si persistant.`,
            icon: AlertTriangle
          })
        }
      }
    }

    setAlertes(newAlertes)
    setCalculs(newCalculs)
  }, [
    type,
    poids,
    taille,
    tensionSystolique,
    tensionDiastolique,
    hauteurUterine,
    saTerm,
    bdc,
    poidsInitial,
    taillePatiente,
    lastPoids,
    lastDate
  ])

  if (alertes.length === 0 && calculs.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Calculs automatiques */}
      {calculs.length > 0 && (
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calculator className="h-4 w-4 text-purple-600" />
              Calculs automatiques
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {calculs.map((calcul, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-lg border border-purple-200"
                >
                  <p className="text-xs text-slate-600 mb-1">{calcul.label}</p>
                  <p className={`text-lg font-bold ${calcul.color || 'text-slate-900'}`}>
                    {calcul.value}
                  </p>
                  {calcul.interpretation && (
                    <p className="text-xs text-slate-500 mt-1">{calcul.interpretation}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertes cliniques */}
      {alertes.length > 0 && (
        <div className="space-y-2">
          {alertes.map((alerte, index) => (
            <Alert
              key={index}
              variant={alerte.type === 'danger' ? 'destructive' : 'default'}
              className={
                alerte.type === 'danger'
                  ? 'border-red-500 bg-red-50'
                  : alerte.type === 'warning'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-blue-500 bg-blue-50'
              }
            >
              <alerte.icon className="h-4 w-4" />
              <AlertTitle className="font-semibold">{alerte.title}</AlertTitle>
              <AlertDescription className="text-sm mt-1">
                {alerte.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  )
}

// Fonction helper pour calculer la prise de poids cible selon IMC initial
function getPrisePoidsCible(poidsInitial: number, taille: number): string {
  const imc = poidsInitial / ((taille / 100) ** 2)

  if (imc < 18.5) return '12,5-18 kg'
  if (imc < 25) return '11,5-16 kg'
  if (imc < 30) return '7-11,5 kg'
  return '5-9 kg'
}
