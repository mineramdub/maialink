import { useMemo } from 'react'

interface ConsultationData {
  type: string
  saTerm?: string
  saJours?: string
  tensionSystolique?: string
  tensionDiastolique?: string
  hauteurUterine?: string
  poids?: string
  bdc?: string
  proteineUrinaire?: string
  glucoseUrinaire?: string
  temperature?: string
}

interface Alert {
  type: 'danger' | 'warning' | 'info'
  message: string
  recommendations?: string[]
}

interface Suggestion {
  field: string
  text: string
  category: 'normal' | 'attention' | 'urgent'
}

export function useConsultationSuggestions(data: ConsultationData) {
  const alerts = useMemo(() => {
    const alertList: Alert[] = []
    
    // Alertes tension artérielle
    if (data.tensionSystolique && data.tensionDiastolique) {
      const sys = parseInt(data.tensionSystolique)
      const dias = parseInt(data.tensionDiastolique)
      
      if (sys >= 160 || dias >= 110) {
        alertList.push({
          type: 'danger',
          message: 'HTA sévère détectée',
          recommendations: [
            'Rechercher signes de pré-éclampsie (céphalées, troubles visuels, barre épigastrique)',
            'Protéinurie ? Bilan biologique (NFS, plaquettes, transaminases, créatinine)',
            'Orienter vers maternité si confirmation',
            'Repos strict, surveillance rapprochée'
          ]
        })
      } else if (sys >= 140 || dias >= 90) {
        alertList.push({
          type: 'warning',
          message: 'Hypertension artérielle détectée',
          recommendations: [
            'Vérifier protéinurie',
            'Surveillance rapprochée de la TA',
            'Rechercher signes fonctionnels',
            'Consultation obstétricale sous 48h si persistance'
          ]
        })
      } else if (sys < 90 || dias < 60) {
        alertList.push({
          type: 'info',
          message: 'Tension basse',
          recommendations: [
            'Vérifier symptômes (vertiges, malaises)',
            'Conseiller hydratation suffisante',
            'Éviter stations debout prolongées'
          ]
        })
      }
    }

    // Alertes hauteur utérine (si type prénatale et SA renseigné)
    if (data.type === 'prenatale' && data.saTerm && data.hauteurUterine) {
      const sa = parseInt(data.saTerm)
      const hu = parseInt(data.hauteurUterine)
      
      // Règle approximative : HU (cm) ≈ SA entre 20-35 SA
      if (sa >= 20 && sa <= 35) {
        const expectedHU = sa
        const diff = Math.abs(hu - expectedHU)
        
        if (diff > 3) {
          if (hu < expectedHU - 3) {
            alertList.push({
              type: 'warning',
              message: 'Hauteur utérine inférieure à la normale',
              recommendations: [
                'RCIU à rechercher - échographie de croissance',
                'Vérifier terme de grossesse',
                'Oligoamnios ?',
                'Consultation obstétricale'
              ]
            })
          } else if (hu > expectedHU + 3) {
            alertList.push({
              type: 'warning',
              message: 'Hauteur utérine supérieure à la normale',
              recommendations: [
                'Macrosomie à rechercher',
                'Hydramnios ?',
                'Grossesse multiple ?',
                'Échographie de contrôle'
              ]
            })
          }
        }
      }
    }

    // Alertes protéinurie
    if (data.proteineUrinaire && data.proteineUrinaire !== 'negatif' && data.proteineUrinaire !== 'traces') {
      alertList.push({
        type: 'warning',
        message: 'Protéinurie détectée',
        recommendations: [
          'Éliminer infection urinaire (ECBU)',
          'Rechercher signes de pré-éclampsie',
          'Bilan rénal (créatinine, protéinurie des 24h)',
          'Surveillance rapprochée'
        ]
      })
    }

    // Alertes glycosurie
    if (data.glucoseUrinaire && data.glucoseUrinaire !== 'negatif') {
      alertList.push({
        type: 'info',
        message: 'Glycosurie détectée',
        recommendations: [
          'Vérifier glycémie à jeun',
          'Si persistent : HGPO si non fait',
          'Rechercher diabète gestationnel'
        ]
      })
    }

    // Alertes température
    if (data.temperature) {
      const temp = parseFloat(data.temperature)
      if (temp >= 38) {
        alertList.push({
          type: 'danger',
          message: 'Fièvre détectée',
          recommendations: [
            'Rechercher foyer infectieux',
            'Rechercher infection urinaire (ECBU)',
            'Envisager paracétamol',
            'Surveiller signes de gravité'
          ]
        })
      }
    }

    // Alertes BDC (battements cardiaques foetaux)
    if (data.bdc) {
      const bdc = parseInt(data.bdc)
      if (bdc < 110) {
        alertList.push({
          type: 'danger',
          message: 'Bradycardie fœtale',
          recommendations: [
            'URGENCE - Orienter vers maternité',
            'Monitoring fœtal immédiat',
            'Rechercher souffrance fœtale'
          ]
        })
      } else if (bdc > 160) {
        alertList.push({
          type: 'warning',
          message: 'Tachycardie fœtale',
          recommendations: [
            'Rechercher fièvre maternelle',
            'Vérifier hydratation',
            'Surveillance rapprochée',
            'Consultation si persistance'
          ]
        })
      }
    }

    return alertList
  }, [data])

  const suggestions = useMemo(() => {
    const suggestionList: Suggestion[] = []

    // Suggestions pour examen clinique selon les données
    if (data.tensionSystolique && data.tensionDiastolique) {
      const sys = parseInt(data.tensionSystolique)
      const dias = parseInt(data.tensionDiastolique)
      
      if (sys >= 120 && sys < 140 && dias >= 80 && dias < 90) {
        suggestionList.push({
          field: 'examenClinique',
          text: 'Tension artérielle normale.',
          category: 'normal'
        })
      }
    }

    if (data.hauteurUterine && data.saTerm) {
      const sa = parseInt(data.saTerm)
      const hu = parseInt(data.hauteurUterine)
      
      if (sa >= 20 && Math.abs(hu - sa) <= 2) {
        suggestionList.push({
          field: 'examenClinique',
          text: `Hauteur utérine en accord avec le terme (${hu} cm pour ${sa} SA).`,
          category: 'normal'
        })
      }
    }

    if (data.bdc) {
      const bdc = parseInt(data.bdc)
      if (bdc >= 120 && bdc <= 160) {
        suggestionList.push({
          field: 'examenClinique',
          text: `Bruits du cœur fœtaux bien perçus, réguliers à ${bdc} bpm.`,
          category: 'normal'
        })
      }
    }

    // Suggestions pour conclusion
    if (alerts.length === 0) {
      suggestionList.push({
        field: 'conclusion',
        text: 'Consultation sans particularité. Grossesse évolutive normale. Prochain rendez-vous dans 1 mois.',
        category: 'normal'
      })
    } else if (alerts.some(a => a.type === 'danger')) {
      suggestionList.push({
        field: 'conclusion',
        text: 'Situation nécessitant une prise en charge urgente. Orientation vers la maternité.',
        category: 'urgent'
      })
    } else if (alerts.some(a => a.type === 'warning')) {
      suggestionList.push({
        field: 'conclusion',
        text: 'Situation nécessitant une surveillance rapprochée et des examens complémentaires.',
        category: 'attention'
      })
    }

    return suggestionList
  }, [data, alerts])

  return { alerts, suggestions }
}
