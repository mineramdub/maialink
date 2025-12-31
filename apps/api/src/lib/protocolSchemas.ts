// Schémas de réponses structurées pour l'extraction d'informations médicales

export interface MedicamentInfo {
  nom: string
  dci?: string
  dosage: string
  forme: string
  posologie: string
  duree: string
  contrindications?: string[]
  effetsSecondaires?: string[]
}

export interface EtapeProcedure {
  numero: number
  action: string
  details?: string
  prerequis?: string
}

export interface ExamenInfo {
  nom: string
  periode: string
  timing: string // "11-13 SA", "16-18 SA"
  objectif: string
  valeursNormales?: Record<string, string>
  conduiteAnormal?: string
}

export interface PathologieInfo {
  nom: string
  definition: string
  symptomes: string[]
  facteursRisque?: string[]
  diagnostic: string[]
  traitement: string
  surveillance: string[]
}

export interface ProtocolResponseStructured {
  type: 'medicament' | 'procedure' | 'examen' | 'pathologie' | 'general'
  resume: string

  // Selon le type, un de ces champs sera rempli
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

  // Toujours présent
  recommandations?: string[]
  sources: Array<{
    protocole: string
    page: number
  }>
}

// Fonction pour créer le JSON Schema pour Gemini
export function getResponseSchema(): any {
  return {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["medicament", "procedure", "examen", "pathologie", "general"],
        description: "Type de réponse selon la question posée"
      },
      resume: {
        type: "string",
        description: "Résumé court et clair de la réponse (2-3 phrases)"
      },
      medicaments: {
        type: "array",
        description: "Liste des médicaments si la question concerne un traitement",
        items: {
          type: "object",
          properties: {
            nom: { type: "string" },
            dci: { type: "string" },
            dosage: { type: "string" },
            forme: { type: "string" },
            posologie: { type: "string" },
            duree: { type: "string" },
            contrindications: {
              type: "array",
              items: { type: "string" }
            },
            effetsSecondaires: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["nom", "dosage", "posologie"]
        }
      },
      procedure: {
        type: "object",
        description: "Détails d'une procédure médicale si applicable",
        properties: {
          nom: { type: "string" },
          indication: { type: "string" },
          etapes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                numero: { type: "number" },
                action: { type: "string" },
                details: { type: "string" },
                prerequis: { type: "string" }
              },
              required: ["numero", "action"]
            }
          },
          materiel: {
            type: "array",
            items: { type: "string" }
          },
          precautions: {
            type: "array",
            items: { type: "string" }
          }
        }
      },
      examens: {
        type: "array",
        description: "Liste des examens si la question concerne le suivi",
        items: {
          type: "object",
          properties: {
            nom: { type: "string" },
            periode: { type: "string" },
            timing: { type: "string" },
            objectif: { type: "string" },
            valeursNormales: {
              type: "object",
              additionalProperties: { type: "string" }
            },
            conduiteAnormal: { type: "string" }
          },
          required: ["nom", "periode", "objectif"]
        }
      },
      pathologie: {
        type: "object",
        description: "Informations sur une pathologie si la question concerne un diagnostic",
        properties: {
          nom: { type: "string" },
          definition: { type: "string" },
          symptomes: {
            type: "array",
            items: { type: "string" }
          },
          facteursRisque: {
            type: "array",
            items: { type: "string" }
          },
          diagnostic: {
            type: "array",
            items: { type: "string" }
          },
          traitement: { type: "string" },
          surveillance: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["nom", "definition", "traitement"]
      },
      recommandations: {
        type: "array",
        description: "Recommandations importantes issues des protocoles",
        items: { type: "string" }
      },
      sources: {
        type: "array",
        description: "Sources des informations extraites",
        items: {
          type: "object",
          properties: {
            protocole: { type: "string" },
            page: { type: "number" }
          },
          required: ["protocole", "page"]
        }
      }
    },
    required: ["type", "resume", "sources"]
  }
}

// Fonction pour déterminer le type de question
export function detectQuestionType(question: string): string {
  const lowerQ = question.toLowerCase()

  // Détection médicament/traitement
  if (lowerQ.match(/médicament|traitement|prescription|posologie|dosage|prescrire/)) {
    return 'medicament'
  }

  // Détection procédure
  if (lowerQ.match(/comment faire|procédure|protocole|conduite à tenir|étapes|déroulement/)) {
    return 'procedure'
  }

  // Détection examen
  if (lowerQ.match(/examen|bilan|analyse|échographie|écho|dépistage|test|contrôle/)) {
    return 'examen'
  }

  // Détection pathologie
  if (lowerQ.match(/qu'est-ce|définition|symptômes|diagnostic|maladie|pathologie|syndrome/)) {
    return 'pathologie'
  }

  return 'general'
}
