# Documentation Sécurité & Conformité HDS

## Vue d'ensemble

Cette application médicale est conçue pour être conforme aux exigences de l'**Hébergement de Données de Santé (HDS)** et du **RGPD**.

**Date de dernière mise à jour**: 31 Décembre 2025
**Version**: 1.0

---

## 1. Traçabilité et Audit (Conformité HDS Article R1111-8-9)

### 1.1 Middleware d'Audit Automatique

**Fichier**: `/apps/api/src/middleware/audit.ts`

**Fonctionnalités**:
- ✅ Traçabilité de **TOUS les accès** aux données sensibles
- ✅ Log automatique des opérations CRUD (Create, Read, Update, Delete)
- ✅ Capture de l'IP et du User-Agent pour chaque action
- ✅ Stockage des données avant/après modification

**Tables auditées**:
- `patients` - Données démographiques et médicales
- `grossesses` - Suivi de grossesse
- `consultations` - Consultations médicales
- `examens_prenataux` - Examens et résultats
- `suivi_post_partum` - Suivi post-accouchement
- `seances_reeducation` - Séances de rééducation périnéale
- `consultations_gyneco` - Consultations gynécologiques

### 1.2 Actions Auditées

| Action | Description | Données capturées |
|--------|-------------|-------------------|
| `read` | Consultation d'un dossier | userId, recordId, IP, timestamp |
| `create` | Création d'un nouvel enregistrement | userId, newData, IP, timestamp |
| `update` | Modification d'un enregistrement | userId, oldData, newData, IP, timestamp |
| `delete` | Suppression d'un enregistrement | userId, oldData, IP, timestamp |
| `export` | Export de données | userId, recordIds[], IP, timestamp |

### 1.3 API d'Audit

**Routes disponibles** (Admin uniquement):

```
GET /api/audit                          # Liste tous les logs
GET /api/audit/stats                    # Statistiques d'accès
GET /api/audit/sensitive-access/:id     # Historique d'accès à un dossier
GET /api/audit/my-data                  # Export RGPD pour l'utilisateur
```

**Exemple de requête**:
```bash
# Voir tous les accès au dossier d'une patiente
GET /api/audit/sensitive-access/{patientId}

# Statistiques sur 30 jours
GET /api/audit/stats?startDate=2025-01-01&endDate=2025-01-31
```

---

## 2. Chiffrement des Données Sensibles

### 2.1 Algorithme

**Fichier**: `/apps/api/src/lib/encryption.ts`

- **Algorithme**: AES-256-GCM (recommandé par l'ANSSI)
- **Longueur de clé**: 256 bits
- **IV**: 16 octets aléatoires par chiffrement
- **Tag d'authentification**: 16 octets (GCM)

### 2.2 Champs Chiffrés

**Patients**:
- `notes` - Notes cliniques
- `antecedentsMedicaux` - Antécédents médicaux
- `antecedentsFamiliaux` - Antécédents familiaux
- `allergies` - Allergies

**Consultations**:
- `motif` - Motif de consultation
- `examenClinique` - Résultats d'examen
- `conclusion` - Conclusion et prescriptions
- `notes` - Notes additionnelles

**Grossesses**:
- `notes` - Notes de suivi
- `facteursRisque` - Facteurs de risque

### 2.3 Gestion des Clés

**IMPORTANT - Configuration Production**:

1. **Variable d'environnement**:
   ```bash
   ENCRYPTION_KEY=votre-clé-32-caractères-minimum
   ```

2. **Recommandations HDS**:
   - ✅ Utiliser un gestionnaire de secrets (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
   - ✅ Rotation des clés tous les 6 mois
   - ✅ Clés stockées en dehors de l'application
   - ✅ Accès aux clés limité par IAM/RBAC

3. **Procédure de rotation des clés**:
   ```typescript
   // 1. Déchiffrer avec l'ancienne clé
   // 2. Rechiffrer avec la nouvelle clé
   // 3. Mettre à jour les enregistrements en batch
   ```

### 2.4 Utilisation

```typescript
import { encrypt, decrypt, encryptSensitiveFields } from './lib/encryption'

// Chiffrement manuel
const encrypted = encrypt('Données sensibles')

// Chiffrement automatique d'un objet
const patient = encryptSensitiveFields({
  firstName: 'Marie',
  lastName: 'Dupont',
  notes: 'Antécédents cardiaques' // Ce champ sera chiffré
}, 'patients')
```

---

## 3. Conformité RGPD

### 3.1 Droits des Patients

| Droit RGPD | Implémentation | API |
|------------|----------------|-----|
| Droit d'accès (Art. 15) | Export complet des données | `GET /api/audit/my-data` |
| Droit de rectification (Art. 16) | Modification des données | `PATCH /api/patients/:id` |
| Droit à l'oubli (Art. 17) | Suppression ou anonymisation | `DELETE /api/patients/:id` |
| Droit à la portabilité (Art. 20) | Export JSON structuré | `GET /api/patients/:id/export` |

### 3.2 Anonymisation

**Fonction**: `anonymizePersonalData()`

Transforme les données personnelles pour les rendre non identifiantes:
- Noms/prénoms → Hash SHA-256 tronqué
- Email → Hash + domaine anonymisé
- Téléphone → Format masqué (+33*****1234)
- Adresse → `[ANONYMISÉ]`
- Code postal → Département uniquement (75***)

### 3.3 Durée de Conservation

**Conformément à l'Article L1111-7 du Code de la Santé Publique**:

| Type de donnée | Durée | Justification |
|----------------|-------|---------------|
| Dossier médical complet | 20 ans | Art. L1111-7 CSP |
| Dossier patient décédé | 10 ans après décès | Art. L1111-7 CSP |
| Logs d'audit | 3 ans minimum | HDS + RGPD |
| Données de facturation | 10 ans | Code du Commerce |

---

## 4. Authentification et Contrôle d'Accès

### 4.1 Authentification

**Fichier**: `/apps/api/src/middleware/auth.ts`

- ✅ JWT stocké dans cookie HttpOnly (protection XSS)
- ✅ Sessions avec expiration (24h par défaut)
- ✅ Vérification de session en base de données
- ✅ Révocation instantanée possible

### 4.2 Contrôle d'Accès (RBAC)

**Rôles disponibles**:

| Rôle | Permissions |
|------|-------------|
| `admin` | Accès complet + logs d'audit |
| `sage_femme` | CRUD sur propres patientes + consultations |
| `secretaire` | Lecture patientes + gestion RDV |

**Middleware de vérification**:
```typescript
// Admin uniquement
router.get('/audit', adminOnly, handler)

// Vérification propriétaire des données
router.get('/patients/:id', async (req, res) => {
  const patient = await db.query.patients.findFirst({
    where: and(
      eq(patients.id, req.params.id),
      eq(patients.userId, req.user.id) // Propriétaire uniquement
    )
  })
})
```

---

## 5. Mesures de Sécurité Réseau

### 5.1 HTTPS Obligatoire

**Production uniquement**:
- ✅ TLS 1.3 recommandé (minimum TLS 1.2)
- ✅ Certificats valides (Let's Encrypt ou CA reconnu)
- ✅ HSTS activé

### 5.2 CORS

**Configuration**: `/apps/api/src/server.ts`

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL, // Domaine spécifique uniquement
  credentials: true, // Cookies autorisés
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### 5.3 Protection contre les Attaques

- ✅ **Rate Limiting**: À implémenter avec `express-rate-limit`
- ✅ **Injection SQL**: Protection via Drizzle ORM (requêtes paramétrées)
- ✅ **XSS**: Cookie HttpOnly + sanitization des entrées
- ✅ **CSRF**: SameSite cookies + tokens si nécessaire

---

## 6. Sauvegarde et Reprise d'Activité (PRA/PCA)

### 6.1 Sauvegarde

**Recommandations HDS**:
- ✅ Sauvegarde quotidienne automatique de la base de données
- ✅ Rétention: 30 jours minimum
- ✅ Sauvegarde chiffrée (AES-256)
- ✅ Stockage géographiquement distribué
- ✅ Test de restauration mensuel

**Provider recommandés HDS**:
- AWS (avec conformité HDS)
- Azure (Health Data Services)
- OVH (HDS certifié)
- Outscale (HDS certifié)

### 6.2 Plan de Reprise d'Activité

**Objectifs**:
- **RTO** (Recovery Time Objective): < 4 heures
- **RPO** (Recovery Point Objective): < 24 heures

---

## 7. Surveillance et Monitoring

### 7.1 Logs Applicatifs

**Types de logs**:
- Logs d'audit (base de données)
- Logs d'erreurs (console + fichiers)
- Logs d'accès (nginx/apache)

### 7.2 Alertes de Sécurité

**À implémenter**:
- ⚠️ Tentatives de connexion échouées (> 5 en 10 min)
- ⚠️ Accès à des données sensibles en dehors des heures de travail
- ⚠️ Export massif de données
- ⚠️ Modifications en masse
- ⚠️ Erreurs de déchiffrement répétées

---

## 8. Checklist de Conformité HDS

### Exigences Techniques

- [x] Traçabilité complète des accès
- [x] Chiffrement AES-256-GCM des données sensibles
- [x] Authentification forte (JWT + sessions)
- [x] Contrôle d'accès basé sur les rôles (RBAC)
- [x] Audit logs conservés 3 ans minimum
- [ ] Chiffrement en transit (HTTPS en production)
- [ ] Sauvegarde chiffrée quotidienne
- [ ] Plan de Reprise d'Activité documenté
- [ ] Tests de sécurité réguliers (pentest annuel)

### Exigences Organisationnelles

- [ ] Désignation d'un DPO (Data Protection Officer)
- [ ] Registre des traitements (RGPD)
- [ ] Analyse d'impact (AIPD/DPIA) si nécessaire
- [ ] Politique de sécurité documentée
- [ ] Formation du personnel à la sécurité
- [ ] Procédures de notification de violation (72h)

### Exigences Contractuelles

- [ ] Contrat d'hébergement HDS certifié
- [ ] Clauses de sous-traitance RGPD
- [ ] Assurance cyber-risques
- [ ] Contrat de maintenance et support

---

## 9. Procédures en Cas d'Incident

### 9.1 Violation de Données

**Délai**: 72 heures pour notifier la CNIL

**Procédure**:
1. **Détection**: Monitoring automatique + signalement
2. **Confinement**: Isolation du système compromis
3. **Évaluation**: Analyse de l'étendue de la violation
4. **Notification**: CNIL + patients concernés si risque élevé
5. **Remédiation**: Correction de la faille
6. **Documentation**: Rapport détaillé dans le registre

### 9.2 Contacts d'Urgence

```
DPO: [À DÉFINIR]
CNIL: +33 1 53 73 22 22
ANSSI: cybermalveillance.gouv.fr
```

---

## 10. Évolutions Futures

### Améliorations Planifiées

1. **Authentification 2FA** (Q1 2026)
   - TOTP (Google Authenticator)
   - SMS backup

2. **Chiffrement de bout-en-bout** (Q2 2026)
   - Chiffrement côté client
   - Clés par utilisateur

3. **Blockchain pour l'audit** (Q3 2026)
   - Immuabilité des logs
   - Horodatage certifié

4. **IA de détection d'anomalies** (Q4 2026)
   - Détection automatique d'accès suspects
   - Alertes en temps réel

---

## Références Légales

- **Code de la Santé Publique**: Articles L1110-4, L1111-7, R1111-8-9
- **RGPD**: Règlement (UE) 2016/679
- **Certification HDS**: Décret n°2018-137 du 26 février 2018
- **ANSSI**: Recommandations de sécurité pour un système GNU/Linux

---

**Document maintenu par**: Équipe de développement MaiaLink
**Prochaine révision**: 30 Juin 2026
