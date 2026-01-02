import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Baby, Loader2 } from 'lucide-react'

interface AccouchementFormProps {
  grossesseId: string
  patientId: string
  onSuccess: () => void
  onCancel: () => void
}

export function AccouchementForm({ grossesseId, patientId, onSuccess, onCancel }: AccouchementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Informations générales
    dateAccouchement: '',
    lieuAccouchement: '',
    termeSemaines: '',
    termeJours: '',

    // Travail
    dateDebutTravail: '',
    dureeTravailHeures: '',
    dureeTravailMinutes: '',

    // Poche des eaux
    ruptureMembranes: '',
    dateRuptureMembranes: '',
    aspectLiquideAmniotique: '',

    // Analgésie
    apd: false,
    dateApd: '',
    autreAnalgesie: '',

    // Accouchement
    modeAccouchement: '',
    typeInstrumental: '',
    indicationInstrumental: '',
    indicationCesarienne: '',

    // Présentation et position
    presentation: '',
    variete: '',

    // Périnée
    perinee: '',
    degre: '',
    suture: false,
    typeFilSuture: '',

    // Délivrance
    typeDelivrance: '',
    dureeDelivranceMinutes: '',
    placentaComplet: false,
    poidsPlacenta: '',
    anomaliesPlacenta: '',

    // Hémorragie
    perteSanguine: '',
    hemorragie: false,
    traitementHemorragie: '',

    // Post-partum
    examenPostPartum: '',
    complications: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert form data to proper types
      const submitData = {
        grossesseId,
        patientId,
        dateAccouchement: formData.dateAccouchement,
        lieuAccouchement: formData.lieuAccouchement || null,
        termeSemaines: formData.termeSemaines ? parseInt(formData.termeSemaines) : null,
        termeJours: formData.termeJours ? parseInt(formData.termeJours) : null,
        dateDebutTravail: formData.dateDebutTravail || null,
        dureeTravailHeures: formData.dureeTravailHeures ? parseInt(formData.dureeTravailHeures) : null,
        dureeTravailMinutes: formData.dureeTravailMinutes ? parseInt(formData.dureeTravailMinutes) : null,
        ruptureMembranes: formData.ruptureMembranes || null,
        dateRuptureMembranes: formData.dateRuptureMembranes || null,
        aspectLiquideAmniotique: formData.aspectLiquideAmniotique || null,
        apd: formData.apd,
        dateApd: formData.dateApd || null,
        autreAnalgesie: formData.autreAnalgesie || null,
        modeAccouchement: formData.modeAccouchement,
        typeInstrumental: formData.typeInstrumental || null,
        indicationInstrumental: formData.indicationInstrumental || null,
        indicationCesarienne: formData.indicationCesarienne || null,
        presentation: formData.presentation || null,
        variete: formData.variete || null,
        perinee: formData.perinee || null,
        degre: formData.degre || null,
        suture: formData.suture,
        typeFilSuture: formData.typeFilSuture || null,
        typeDelivrance: formData.typeDelivrance || null,
        dureeDelivranceMinutes: formData.dureeDelivranceMinutes ? parseInt(formData.dureeDelivranceMinutes) : null,
        placentaComplet: formData.placentaComplet,
        poidsPlacenta: formData.poidsPlacenta ? parseInt(formData.poidsPlacenta) : null,
        anomaliesPlacenta: formData.anomaliesPlacenta || null,
        perteSanguine: formData.perteSanguine ? parseInt(formData.perteSanguine) : null,
        hemorragie: formData.hemorragie,
        traitementHemorragie: formData.traitementHemorragie || null,
        examenPostPartum: formData.examenPostPartum || null,
        complications: formData.complications || null,
        notes: formData.notes || null,
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accouchements`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      const data = await res.json()

      if (data.success) {
        // Also update grossesse status
        await fetch(`${import.meta.env.VITE_API_URL}/api/grossesses/${grossesseId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'terminee' }),
        })

        onSuccess()
      } else {
        alert('Erreur: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving accouchement:', error)
      alert('Erreur lors de l\'enregistrement')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations générales */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateAccouchement">Date d'accouchement *</Label>
            <Input
              id="dateAccouchement"
              type="datetime-local"
              value={formData.dateAccouchement}
              onChange={(e) => setFormData({ ...formData, dateAccouchement: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lieuAccouchement">Lieu d'accouchement</Label>
            <Input
              id="lieuAccouchement"
              value={formData.lieuAccouchement}
              onChange={(e) => setFormData({ ...formData, lieuAccouchement: e.target.value })}
              placeholder="Ex: Maternité de l'hôpital..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termeSemaines">Terme (semaines)</Label>
            <Input
              id="termeSemaines"
              type="number"
              value={formData.termeSemaines}
              onChange={(e) => setFormData({ ...formData, termeSemaines: e.target.value })}
              placeholder="Ex: 39"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termeJours">Terme (jours)</Label>
            <Input
              id="termeJours"
              type="number"
              max="6"
              value={formData.termeJours}
              onChange={(e) => setFormData({ ...formData, termeJours: e.target.value })}
              placeholder="Ex: 2"
            />
          </div>
        </div>
      </div>

      {/* Travail */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Travail</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateDebutTravail">Début du travail</Label>
            <Input
              id="dateDebutTravail"
              type="datetime-local"
              value={formData.dateDebutTravail}
              onChange={(e) => setFormData({ ...formData, dateDebutTravail: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Durée du travail</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={formData.dureeTravailHeures}
                onChange={(e) => setFormData({ ...formData, dureeTravailHeures: e.target.value })}
                placeholder="Heures"
              />
              <Input
                type="number"
                value={formData.dureeTravailMinutes}
                onChange={(e) => setFormData({ ...formData, dureeTravailMinutes: e.target.value })}
                placeholder="Minutes"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Poche des eaux */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Poche des eaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ruptureMembranes">Type de rupture</Label>
            <Select
              value={formData.ruptureMembranes}
              onValueChange={(value) => setFormData({ ...formData, ruptureMembranes: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spontanee">Spontanée</SelectItem>
                <SelectItem value="artificielle">Artificielle</SelectItem>
                <SelectItem value="avant_travail">Avant travail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateRuptureMembranes">Date/heure de rupture</Label>
            <Input
              id="dateRuptureMembranes"
              type="datetime-local"
              value={formData.dateRuptureMembranes}
              onChange={(e) => setFormData({ ...formData, dateRuptureMembranes: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="aspectLiquideAmniotique">Aspect du liquide amniotique</Label>
            <Input
              id="aspectLiquideAmniotique"
              value={formData.aspectLiquideAmniotique}
              onChange={(e) => setFormData({ ...formData, aspectLiquideAmniotique: e.target.value })}
              placeholder="Ex: Clair, méconial, teinté..."
            />
          </div>
        </div>
      </div>

      {/* Analgésie */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Analgésie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="apd"
                checked={formData.apd}
                onCheckedChange={(checked) => setFormData({ ...formData, apd: checked as boolean })}
              />
              <Label htmlFor="apd" className="cursor-pointer">APD (Analgésie péridurale)</Label>
            </div>
          </div>

          {formData.apd && (
            <div className="space-y-2">
              <Label htmlFor="dateApd">Date/heure de l'APD</Label>
              <Input
                id="dateApd"
                type="datetime-local"
                value={formData.dateApd}
                onChange={(e) => setFormData({ ...formData, dateApd: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="autreAnalgesie">Autre analgésie</Label>
            <Input
              id="autreAnalgesie"
              value={formData.autreAnalgesie}
              onChange={(e) => setFormData({ ...formData, autreAnalgesie: e.target.value })}
              placeholder="Ex: Protoxyde d'azote, acupuncture..."
            />
          </div>
        </div>
      </div>

      {/* Mode d'accouchement */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Mode d'accouchement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="modeAccouchement">Mode d'accouchement *</Label>
            <Select
              value={formData.modeAccouchement}
              onValueChange={(value) => setFormData({ ...formData, modeAccouchement: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voie_basse_spontanee">Voie basse spontanée</SelectItem>
                <SelectItem value="voie_basse_instrumentale">Voie basse instrumentale</SelectItem>
                <SelectItem value="cesarienne_programmee">Césarienne programmée</SelectItem>
                <SelectItem value="cesarienne_urgence">Césarienne en urgence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.modeAccouchement === 'voie_basse_instrumentale' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="typeInstrumental">Type d'instrument</Label>
                <Select
                  value={formData.typeInstrumental}
                  onValueChange={(value) => setFormData({ ...formData, typeInstrumental: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forceps">Forceps</SelectItem>
                    <SelectItem value="ventouse">Ventouse</SelectItem>
                    <SelectItem value="spatules">Spatules</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="indicationInstrumental">Indication</Label>
                <Input
                  id="indicationInstrumental"
                  value={formData.indicationInstrumental}
                  onChange={(e) => setFormData({ ...formData, indicationInstrumental: e.target.value })}
                  placeholder="Ex: Non progression, ARCF..."
                />
              </div>
            </>
          )}

          {(formData.modeAccouchement === 'cesarienne_programmee' || formData.modeAccouchement === 'cesarienne_urgence') && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="indicationCesarienne">Indication césarienne</Label>
              <Input
                id="indicationCesarienne"
                value={formData.indicationCesarienne}
                onChange={(e) => setFormData({ ...formData, indicationCesarienne: e.target.value })}
                placeholder="Ex: Présentation siège, utérus cicatriciel..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Présentation */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Présentation et position</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="presentation">Présentation</Label>
            <Select
              value={formData.presentation}
              onValueChange={(value) => setFormData({ ...formData, presentation: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cephalique">Céphalique</SelectItem>
                <SelectItem value="siege">Siège</SelectItem>
                <SelectItem value="transverse">Transverse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variete">Variété de position</Label>
            <Input
              id="variete"
              value={formData.variete}
              onChange={(e) => setFormData({ ...formData, variete: e.target.value })}
              placeholder="Ex: OIGA, OIDP..."
            />
          </div>
        </div>
      </div>

      {/* Périnée */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Périnée</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="perinee">État du périnée</Label>
            <Select
              value={formData.perinee}
              onValueChange={(value) => setFormData({ ...formData, perinee: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intact">Intact</SelectItem>
                <SelectItem value="dechirure">Déchirure</SelectItem>
                <SelectItem value="episiotomie">Épisiotomie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.perinee === 'dechirure' || formData.perinee === 'episiotomie') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="degre">Degré</Label>
                <Select
                  value={formData.degre}
                  onValueChange={(value) => setFormData({ ...formData, degre: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1er degré</SelectItem>
                    <SelectItem value="2">2ème degré</SelectItem>
                    <SelectItem value="3">3ème degré</SelectItem>
                    <SelectItem value="4">4ème degré</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="suture"
                    checked={formData.suture}
                    onCheckedChange={(checked) => setFormData({ ...formData, suture: checked as boolean })}
                  />
                  <Label htmlFor="suture" className="cursor-pointer">Suture effectuée</Label>
                </div>
              </div>

              {formData.suture && (
                <div className="space-y-2">
                  <Label htmlFor="typeFilSuture">Type de fil</Label>
                  <Input
                    id="typeFilSuture"
                    value={formData.typeFilSuture}
                    onChange={(e) => setFormData({ ...formData, typeFilSuture: e.target.value })}
                    placeholder="Ex: Vicryl 2-0"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Délivrance */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Délivrance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="typeDelivrance">Type de délivrance</Label>
            <Select
              value={formData.typeDelivrance}
              onValueChange={(value) => setFormData({ ...formData, typeDelivrance: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spontanee">Spontanée</SelectItem>
                <SelectItem value="dirigee">Dirigée</SelectItem>
                <SelectItem value="artificielle">Artificielle (délivrance artificielle)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dureeDelivranceMinutes">Durée (minutes)</Label>
            <Input
              id="dureeDelivranceMinutes"
              type="number"
              value={formData.dureeDelivranceMinutes}
              onChange={(e) => setFormData({ ...formData, dureeDelivranceMinutes: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="placentaComplet"
                checked={formData.placentaComplet}
                onCheckedChange={(checked) => setFormData({ ...formData, placentaComplet: checked as boolean })}
              />
              <Label htmlFor="placentaComplet" className="cursor-pointer">Placenta complet</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="poidsPlacenta">Poids placenta (g)</Label>
            <Input
              id="poidsPlacenta"
              type="number"
              value={formData.poidsPlacenta}
              onChange={(e) => setFormData({ ...formData, poidsPlacenta: e.target.value })}
              placeholder="Ex: 600"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="anomaliesPlacenta">Anomalies placentaires</Label>
            <Input
              id="anomaliesPlacenta"
              value={formData.anomaliesPlacenta}
              onChange={(e) => setFormData({ ...formData, anomaliesPlacenta: e.target.value })}
              placeholder="Ex: Cotylédons aberrants, infarctus..."
            />
          </div>
        </div>
      </div>

      {/* Hémorragie */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Hémorragie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="perteSanguine">Perte sanguine estimée (ml)</Label>
            <Input
              id="perteSanguine"
              type="number"
              value={formData.perteSanguine}
              onChange={(e) => setFormData({ ...formData, perteSanguine: e.target.value })}
              placeholder="Ex: 300"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hemorragie"
                checked={formData.hemorragie}
                onCheckedChange={(checked) => setFormData({ ...formData, hemorragie: checked as boolean })}
              />
              <Label htmlFor="hemorragie" className="cursor-pointer">Hémorragie du post-partum</Label>
            </div>
          </div>

          {formData.hemorragie && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="traitementHemorragie">Traitement de l'hémorragie</Label>
              <Textarea
                id="traitementHemorragie"
                value={formData.traitementHemorragie}
                onChange={(e) => setFormData({ ...formData, traitementHemorragie: e.target.value })}
                placeholder="Ex: Oxytocine, révision utérine, tamponnement..."
                rows={3}
              />
            </div>
          )}
        </div>
      </div>

      {/* Post-partum */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Post-partum immédiat</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="examenPostPartum">Examen post-partum</Label>
            <Textarea
              id="examenPostPartum"
              value={formData.examenPostPartum}
              onChange={(e) => setFormData({ ...formData, examenPostPartum: e.target.value })}
              placeholder="État de la mère, constantes, globe utérin..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complications">Complications</Label>
            <Textarea
              id="complications"
              value={formData.complications}
              onChange={(e) => setFormData({ ...formData, complications: e.target.value })}
              placeholder="Complications éventuelles..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Remarques complémentaires..."
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Baby className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
