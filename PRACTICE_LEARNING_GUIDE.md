# Guide d'utilisation du Système d'Apprentissage de la Pratique

## 📋 Vue d'ensemble

Le système d'apprentissage analyse vos habitudes de pratique médicale de manière **100% anonymisée** pour vous proposer des suggestions personnalisées.

### ✅ Conformité RGPD/HDS

- ✓ Toutes les données restent sur votre serveur
- ✓ Aucun transfert vers des services tiers (OpenAI, Claude, etc.)
- ✓ Anonymisation complète (pas de nom, prénom, date de naissance)
- ✓ Seuls des profils génériques sont analysés (âge, parité, SA)
- ✓ Contrôle total : désactivation et suppression à tout moment

---

## 🏗️ Architecture

### Tables créées

1. **`practice_patterns`** : Stocke les actions récurrentes (prescriptions, examens, conseils)
2. **`smart_suggestions`** : Génère des suggestions basées sur les patterns
3. **`practice_learning_events`** : Audit trail de toutes les interactions

### API Endpoints

- `GET /api/practice-learning/stats` - Statistiques d'apprentissage
- `POST /api/practice-learning/suggestions` - Obtenir des suggestions
- `POST /api/practice-learning/capture/prescription` - Capturer une prescription
- `POST /api/practice-learning/capture/examen` - Capturer un examen
- `POST /api/practice-learning/capture/conseil` - Capturer un conseil
- `DELETE /api/practice-learning/data` - Supprimer toutes les données

---

## 🎯 Utilisation dans les formulaires

### 1. Afficher des suggestions

```tsx
import { SmartSuggestions } from '@/components/SmartSuggestions'
import { usePracticeLearning } from '@/hooks/usePracticeLearning'

function ConsultationForm() {
  const { createContext } = usePracticeLearning()
  const [consultationData, setConsultationData] = useState({
    type: 'prenatale',
    sa: 25,
    motif: 'Suivi',
    patientAge: 32,
    parite: 1,
  })

  // Créer le contexte anonymisé
  const context = createContext(consultationData)

  // Handlers pour les suggestions
  const handleAcceptSuggestion = (suggestion) => {
    if (suggestion.type === 'prescription') {
      // Pré-remplir le champ prescription
      setPrescription(suggestion.data.prescription)
    } else if (suggestion.type === 'examen') {
      // Ajouter l'examen à la liste
      addExamen(suggestion.data.examen)
    }
  }

  const handleRejectSuggestion = (suggestionId) => {
    console.log('Suggestion refusée:', suggestionId)
  }

  return (
    <div className="space-y-6">
      {/* Afficher les suggestions en haut du formulaire */}
      <SmartSuggestions
        context={context}
        onAccept={handleAcceptSuggestion}
        onReject={handleRejectSuggestion}
      />

      {/* Reste du formulaire */}
      {/* ... */}
    </div>
  )
}
```

### 2. Capturer les actions après soumission

```tsx
import { usePracticeLearning } from '@/hooks/usePracticeLearning'

function ConsultationForm() {
  const { captureConsultation } = usePracticeLearning()

  const handleSubmit = async (formData) => {
    // 1. Sauvegarder la consultation normalement
    await saveConsultation(formData)

    // 2. Capturer automatiquement toutes les actions pour l'apprentissage
    await captureConsultation({
      type: formData.type,
      sa: formData.sa,
      motif: formData.motif,
      patientAge: calculateAge(patient.dateNaissance),
      parite: patient.parite,
      prescriptions: formData.prescriptions, // [{ medicament, dosage, duree }]
      examens: formData.examens, // [{ type, libelle }]
      conseils: formData.conseils, // ["Repos si contractions", ...]
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  )
}
```

### 3. Capture manuelle d'une action spécifique

```tsx
import { usePracticeLearning } from '@/hooks/usePracticeLearning'

function PrescriptionField() {
  const { createContext, capturePrescription } = usePracticeLearning()

  const handleAddPrescription = async (medicament, dosage, duree) => {
    // Ajouter la prescription au formulaire
    addPrescription({ medicament, dosage, duree })

    // Capturer immédiatement pour l'apprentissage
    const context = createContext({
      consultationType: 'prenatale',
      sa: 25,
      motif: 'Suivi',
      patientAge: 32,
      parite: 1,
    })

    await capturePrescription(context, {
      medicament,
      dosage,
      duree,
    })
  }

  return (
    <div>
      {/* Champ de saisie prescription */}
    </div>
  )
}
```

---

## ⚙️ Configuration utilisateur

Les utilisateurs peuvent gérer le système depuis **Paramètres → Apprentissage de ma pratique** :

- ✅ Activer/Désactiver l'apprentissage
- ✅ Voir les statistiques (patterns détectés, taux d'acceptation)
- ✅ Consulter les top 5 patterns les plus fréquents
- ✅ Supprimer toutes les données d'apprentissage

---

## 📊 Exemples de patterns détectés

Le système identifie automatiquement :

### Prescriptions fréquentes
- "Vous prescrivez souvent **Magnésium 300mg** à 20-30 SA (85% des cas)"
- "Vous associez toujours **Spasfon + Magnésium** en cas de contractions"

### Examens récurrents
- "Vous prescrivez **HGPO + NFS + Ferritine** ensemble à 24-28 SA (90% des cas)"
- "Vous demandez systématiquement un **PV Strepto B** à 35-37 SA"

### Conseils standards
- "Vous donnez souvent le conseil **'Repos en cas de contractions'** lors du 2ème trimestre"
- "Vous recommandez **'Éviter station debout prolongée'** en cas d'HTA"

---

## 🔒 Sécurité & Anonymisation

### Données anonymisées

✅ **Ce qui est stocké** :
- Type de consultation : "prenatale"
- SA : 25
- Tranche d'âge : "30-40"
- Parité : 1
- Action : "Prescription Magnésium 300mg"

❌ **Ce qui N'est PAS stocké** :
- Nom de la patiente
- Prénom
- Date de naissance exacte
- Adresse
- Numéro de sécurité sociale
- Identifiant patiente

### Exemple de contexte stocké

```json
{
  "consultationType": "prenatale",
  "sa": 25,
  "ageGroupe": "30-40",
  "parite": 1,
  "trimestre": 2
}
```

---

## 🧪 Tests

Pour tester le système :

1. **Créer plusieurs consultations** avec des patterns similaires (ex: toujours prescrire Magnésium à 25 SA)
2. **Attendre 3-5 consultations** similaires (seuil de détection)
3. **Ouvrir une nouvelle consultation** dans le même contexte
4. **Vérifier** que le composant `<SmartSuggestions>` affiche Magnésium
5. **Cliquer sur Accepter** → le pattern se renforce
6. **Cliquer sur Refuser** → le pattern diminue en pertinence

---

## 📈 Métriques de succès

Le système suit automatiquement :
- **Fréquence** : Nombre de fois qu'une action est réalisée
- **Taux d'acceptation** : % de suggestions acceptées
- **Confiance** : Score de 0-100% basé sur la fréquence et le contexte
- **Désactivation automatique** : Si taux d'acceptation < 20% après 5 affichages

---

## 🛠️ Maintenance

### Supprimer les patterns obsolètes

Les patterns sont automatiquement désactivés si :
- Taux d'acceptation < 20% après 5 affichages
- Non utilisés depuis > 6 mois (à implémenter)

### Exporter les données

```typescript
const stats = await fetch('/api/practice-learning/stats').then(r => r.json())
console.log(stats.topPatterns) // Top 10 patterns
```

---

## ❓ FAQ

### Le système envoie-t-il des données à OpenAI/Claude ?
**Non.** Toutes les données restent sur votre serveur. Aucun appel API externe n'est effectué.

### Les patients peuvent-ils voir mes patterns ?
**Non.** Les patterns sont privés et uniquement visibles par vous.

### Puis-je désactiver l'apprentissage temporairement ?
**Oui.** Dans Paramètres → Apprentissage, désactivez le switch "Capture automatique".

### Comment supprimer mes données ?
Dans Paramètres → Apprentissage → Zone de danger → "Supprimer toutes mes données d'apprentissage".

### Le système apprend-il des erreurs ?
**Non.** Le système ne fait que détecter des fréquences. Il ne juge pas si une action est bonne ou mauvaise. Vous restez responsable de valider chaque suggestion.

---

## 🚀 Roadmap future (optionnelle)

- [ ] Détection de co-occurrences ("si A alors souvent B")
- [ ] Suggestions contextuelles avancées (météo, saison, épidémies)
- [ ] Comparaison avec les guidelines HAS/CNGOF
- [ ] Export des patterns pour formation continue
- [ ] Suggestions collaboratives (anonymisées entre praticiens consentants)

---

## 📞 Support

Pour toute question ou bug concernant le système d'apprentissage, ouvrez une issue sur le repo GitHub ou contactez le support technique.

**Important** : Ce système est une aide à la décision, pas un remplacement du jugement clinique. Vous restez pleinement responsable de toutes vos décisions médicales.
