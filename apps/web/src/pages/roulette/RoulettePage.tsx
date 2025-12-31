import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Calendar, Baby, Activity, CheckCircle2, Clock } from 'lucide-react'
import { format, addDays, differenceInDays, addWeeks } from 'date-fns'
import { fr } from 'date-fns/locale'

interface BilanItem {
  titre: string
  semaines: string
  description: string
  items: string[]
  completed?: boolean
}

const BILANS_PRENATAL: BilanItem[] = [
  {
    titre: 'Consultation préconceptionnelle',
    semaines: 'Avant la grossesse',
    description: 'Bilan avant conception',
    items: [
      'Groupe sanguin ABO + Rhésus + RAI',
      'Sérologies: Toxoplasmose, Rubéole, VIH, VHB, VHC, Syphilis',
      'Frottis cervico-vaginal si > 3 ans',
      'Supplémentation acide folique (3 mois avant)',
      'Vérification vaccinations (rubéole, coqueluche)'
    ]
  },
  {
    titre: 'Déclaration de grossesse',
    semaines: 'Avant 15 SA',
    description: 'Première consultation',
    items: [
      'Confirmation grossesse (dosage βHCG)',
      'Examen clinique complet',
      'Groupe sanguin (2 déterminations) + RAI',
      'Sérologies obligatoires: Toxo, Rubéole, Syphilis',
      'Recherche Ag HBs, proposition sérologie VIH',
      'ECBU',
      'Glycémie à jeun',
      'NFS (dépistage anémie)',
      'Déclaration de grossesse (avant 15 SA)'
    ]
  },
  {
    titre: 'Échographie T1 + Dépistage T21',
    semaines: '11-14 SA',
    description: 'Échographie du 1er trimestre',
    items: [
      'Échographie de datation',
      'Mesure clarté nucale',
      'Dépistage trisomie 21 (T1)',
      'Marqueurs sériques si souhaité',
      'Vérifier sérologie Toxoplasmose si négative'
    ]
  },
  {
    titre: 'Consultation 4ème mois',
    semaines: '16-18 SA',
    description: 'Suivi mensuel',
    items: [
      'Examen clinique',
      'HU (hauteur utérine)',
      'Bruits du cœur fœtal',
      'Bandelette urinaire (protéinurie, glycosurie)',
      'TA',
      'RAI si rhésus négatif',
      'Proposition 2ème détermination T21 si non fait'
    ]
  },
  {
    titre: 'Échographie T2 (morphologique)',
    semaines: '20-22 SA',
    description: 'Échographie morphologique',
    items: [
      'Échographie morphologique complète',
      'Biométrie fœtale',
      'Étude morphologique des organes',
      'Localisation placentaire',
      'Quantité liquide amniotique'
    ]
  },
  {
    titre: 'Consultation 6ème mois',
    semaines: '24-26 SA',
    description: 'Suivi + Dépistage diabète',
    items: [
      'Examen clinique',
      'HGPO 75g (dépistage diabète gestationnel)',
      'RAI si rhésus négatif',
      'NFS (anémie)',
      'Sérologie Toxoplasmose si négative',
      'Recherche Ag HBs si non immun'
    ]
  },
  {
    titre: 'Consultation 7ème mois',
    semaines: '28-30 SA',
    description: 'Début 3ème trimestre',
    items: [
      'Examen clinique',
      'Injection immunoglobulines anti-D si Rhésus -',
      'RAI',
      'Sérologie Toxoplasmose si négative',
      'Prévention prématurité (col court)',
      'Préparation à la naissance (début)'
    ]
  },
  {
    titre: 'Consultation 8ème mois',
    semaines: '32-34 SA',
    description: 'Surveillance rapprochée',
    items: [
      'Examen clinique',
      'Échographie T3 (croissance + doppler)',
      'NFS',
      'RAI si rhésus négatif',
      'Prélèvement vaginal strepto B (34-36 SA)',
      'Consultation anesthésie obligatoire'
    ]
  },
  {
    titre: 'Échographie T3',
    semaines: '32-34 SA',
    description: 'Échographie de croissance',
    items: [
      'Biométrie fœtale',
      'Estimation poids fœtal',
      'Doppler (si pathologie)',
      'Quantité liquide amniotique',
      'Position fœtale',
      'Localisation placentaire définitive'
    ]
  },
  {
    titre: 'Consultation 9ème mois',
    semaines: '36-38 SA',
    description: 'Préparation accouchement',
    items: [
      'Examen clinique',
      'Évaluation présentation fœtale',
      'Toucher vaginal (évaluation col)',
      'RAI',
      'Enregistrement RCF (monitoring)',
      'Projet de naissance',
      'Valise maternité'
    ]
  },
  {
    titre: 'Surveillance post-terme',
    semaines: '> 41 SA',
    description: 'Si dépassement terme',
    items: [
      'Monitoring 2x/semaine',
      'Échographie (liquide amniotique)',
      'Déclenchement discuté à 41 SA',
      'Déclenchement systématique à 42 SA'
    ]
  }
]

export default function RoulettePage() {
  const [ddr, setDdr] = useState<string>('')
  const [currentTerm, setCurrentTerm] = useState<{ weeks: number; days: number } | null>(null)
  const [dpa, setDpa] = useState<Date | null>(null)
  const [daysUntilDPA, setDaysUntilDPA] = useState<number | null>(null)

  useEffect(() => {
    if (!ddr) {
      setCurrentTerm(null)
      setDpa(null)
      setDaysUntilDPA(null)
      return
    }

    const ddrDate = new Date(ddr)
    const today = new Date()

    // Calculer le terme actuel
    const diffDays = differenceInDays(today, ddrDate)
    const weeks = Math.floor(diffDays / 7)
    const days = diffDays % 7

    setCurrentTerm({ weeks, days })

    // Calculer la DPA (DDR + 280 jours)
    const dpaDate = addDays(ddrDate, 280)
    setDpa(dpaDate)

    // Jours restants jusqu'à la DPA
    const daysLeft = differenceInDays(dpaDate, today)
    setDaysUntilDPA(daysLeft)
  }, [ddr])

  const getBilanStatus = (semaines: string): 'completed' | 'current' | 'upcoming' => {
    if (!currentTerm) return 'upcoming'

    // Parser la plage de semaines (ex: "11-14 SA" ou "32-34 SA")
    const match = semaines.match(/(\d+)-?(\d+)?\s*SA/)
    if (!match) {
      // Cas spéciaux
      if (semaines.includes('Avant')) return 'completed'
      if (semaines.includes('> 41')) return currentTerm.weeks > 41 ? 'current' : 'upcoming'
      return 'upcoming'
    }

    const startWeek = parseInt(match[1])
    const endWeek = match[2] ? parseInt(match[2]) : startWeek

    if (currentTerm.weeks > endWeek) return 'completed'
    if (currentTerm.weeks >= startWeek && currentTerm.weeks <= endWeek) return 'current'
    return 'upcoming'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'current':
        return 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
      case 'upcoming':
        return 'bg-slate-50 border-slate-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Effectué</Badge>
      case 'current':
        return <Badge className="bg-blue-600"><Clock className="h-3 w-3 mr-1" />À faire maintenant</Badge>
      case 'upcoming':
        return <Badge variant="outline">À venir</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Roulette Obstétricale</h1>
        <p className="text-slate-500 mt-1">
          Calcul du terme, DPA et suivi prénatal
        </p>
      </div>

      {/* Calculateur */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Calculateur de grossesse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="ddr">Date des dernières règles (DDR)</Label>
            <Input
              id="ddr"
              type="date"
              value={ddr}
              onChange={(e) => setDdr(e.target.value)}
              className="mt-2"
            />
          </div>

          {currentTerm && dpa && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Terme actuel */}
              <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  <Activity className="h-5 w-5" />
                  <p className="text-sm font-medium">Terme actuel</p>
                </div>
                <p className="text-3xl font-bold text-purple-900">
                  {currentTerm.weeks} SA
                </p>
                <p className="text-lg text-purple-700">+ {currentTerm.days} jour{currentTerm.days > 1 ? 's' : ''}</p>
                <p className="text-xs text-slate-600 mt-2">
                  {currentTerm.weeks < 14 && '1er trimestre'}
                  {currentTerm.weeks >= 14 && currentTerm.weeks < 28 && '2ème trimestre'}
                  {currentTerm.weeks >= 28 && '3ème trimestre'}
                </p>
              </div>

              {/* DPA */}
              <div className="bg-white rounded-lg p-4 border-2 border-pink-300">
                <div className="flex items-center gap-2 text-pink-700 mb-2">
                  <Baby className="h-5 w-5" />
                  <p className="text-sm font-medium">Date prévue d'accouchement</p>
                </div>
                <p className="text-xl font-bold text-pink-900">
                  {format(dpa, 'dd MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-sm text-pink-700 mt-1">
                  {daysUntilDPA !== null && (
                    <>
                      {daysUntilDPA > 0 && `Dans ${daysUntilDPA} jours`}
                      {daysUntilDPA === 0 && "Aujourd'hui !"}
                      {daysUntilDPA < 0 && `Dépassement de ${Math.abs(daysUntilDPA)} jours`}
                    </>
                  )}
                </p>
              </div>

              {/* Semaines restantes */}
              <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Clock className="h-5 w-5" />
                  <p className="text-sm font-medium">Temps restant</p>
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  {Math.max(0, 40 - currentTerm.weeks)} SA
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {currentTerm.weeks < 40 ? 'jusqu\'au terme' : 'Post-terme'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline des bilans */}
      {currentTerm && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Calendrier de suivi prénatal
          </h2>
          <div className="space-y-4">
            {BILANS_PRENATAL.map((bilan, index) => {
              const status = getBilanStatus(bilan.semaines)
              return (
                <Card
                  key={index}
                  className={`border-2 transition-all ${getStatusColor(status)} ${
                    status === 'current' ? 'shadow-lg' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{bilan.titre}</CardTitle>
                          {getStatusBadge(status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Badge variant="outline">{bilan.semaines}</Badge>
                          <span>•</span>
                          <span>{bilan.description}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {bilan.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-slate-400 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {!ddr && (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">
              Entrez la date des dernières règles (DDR) pour calculer le terme et afficher le calendrier de suivi
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
