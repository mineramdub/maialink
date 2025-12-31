import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { ArrowLeft, Loader2, Save, Plus, X } from 'lucide-react'

export default function PatientEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [patient, setPatient] = useState<any>(null)

  // État pour les antécédents (listes dynamiques)
  const [antecedentsMedicaux, setAntecedentsMedicaux] = useState<string[]>([])
  const [antecedentsChirurgicaux, setAntecedentsChirurgicaux] = useState<string[]>([])
  const [antecedentsFamiliaux, setAntecedentsFamiliaux] = useState<string[]>([])

  // État pour antécédents gynéco
  const [antecedentsGyneco, setAntecedentsGyneco] = useState({
    dateReglesMenarches: '',
    dureeCycle: '',
    dureeRegles: '',
    dysmenorrhees: false,
    dysmenorrheesDetails: '',
    dyspareunies: false,
    dyspareuniesDétails: '',
    contraception: '',
    contraceptionDetails: '',
    dateDernierFrottis: '',
    resultatDernierFrottis: '',
    pathologiesGyneco: [] as string[],
    chirurgiesGyneco: [] as string[],
    autres: ''
  })

  useEffect(() => {
    fetchPatient()
  }, [id])

  const fetchPatient = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (data.success) {
        const p = data.patient
        setPatient(p)

        // Initialiser les antécédents
        setAntecedentsMedicaux(p.antecedentsMedicaux || [])
        setAntecedentsChirurgicaux(p.antecedentsChirurgicaux || [])
        setAntecedentsFamiliaux(p.antecedentsFamiliaux || [])

        // Initialiser les antécédents gynéco
        if (p.antecedentsGynecologiques) {
          setAntecedentsGyneco({
            ...antecedentsGyneco,
            ...p.antecedentsGynecologiques
          })
        }
      } else {
        navigate('/patients')
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
      navigate('/patients')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const updatedData: any = {}

    // Récupérer tous les champs du formulaire
    formData.forEach((value, key) => {
      updatedData[key] = value
    })

    // Ajouter les antécédents
    updatedData.antecedentsMedicaux = antecedentsMedicaux.filter(a => a.trim())
    updatedData.antecedentsChirurgicaux = antecedentsChirurgicaux.filter(a => a.trim())
    updatedData.antecedentsFamiliaux = antecedentsFamiliaux.filter(a => a.trim())
    updatedData.antecedentsGynecologiques = {
      ...antecedentsGyneco,
      pathologiesGyneco: antecedentsGyneco.pathologiesGyneco.filter(p => p.trim()),
      chirurgiesGyneco: antecedentsGyneco.chirurgiesGyneco.filter(c => c.trim())
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      })

      const data = await res.json()

      if (data.success) {
        navigate(`/patients/${id}`)
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving patient:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const addItem = (list: string[], setList: (items: string[]) => void) => {
    setList([...list, ''])
  }

  const updateItem = (list: string[], setList: (items: string[]) => void, index: number, value: string) => {
    const newList = [...list]
    newList[index] = value
    setList(newList)
  }

  const removeItem = (list: string[], setList: (items: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!patient) return null

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/patients/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Modifier la fiche patient
            </h1>
            <p className="text-slate-500 mt-1">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* IDENTITÉ */}
        <Card>
          <CardHeader>
            <CardTitle>Identité</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input id="firstName" name="firstName" defaultValue={patient.firstName} required />
            </div>
            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input id="lastName" name="lastName" defaultValue={patient.lastName} required />
            </div>
            <div>
              <Label htmlFor="maidenName">Nom de jeune fille</Label>
              <Input id="maidenName" name="maidenName" defaultValue={patient.maidenName || ''} />
            </div>
            <div>
              <Label htmlFor="birthDate">Date de naissance *</Label>
              <Input id="birthDate" name="birthDate" type="date" defaultValue={patient.birthDate} required />
            </div>
            <div>
              <Label htmlFor="birthPlace">Lieu de naissance</Label>
              <Input id="birthPlace" name="birthPlace" defaultValue={patient.birthPlace || ''} />
            </div>
            <div>
              <Label htmlFor="socialSecurityNumber">Numéro de sécurité sociale</Label>
              <Input id="socialSecurityNumber" name="socialSecurityNumber" defaultValue={patient.socialSecurityNumber || ''} />
            </div>
          </CardContent>
        </Card>

        {/* CONTACT */}
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={patient.email || ''} />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone fixe</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={patient.phone || ''} />
            </div>
            <div>
              <Label htmlFor="mobilePhone">Téléphone portable</Label>
              <Input id="mobilePhone" name="mobilePhone" type="tel" defaultValue={patient.mobilePhone || ''} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" name="address" defaultValue={patient.address || ''} />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal</Label>
              <Input id="postalCode" name="postalCode" defaultValue={patient.postalCode || ''} />
            </div>
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input id="city" name="city" defaultValue={patient.city || ''} />
            </div>
          </CardContent>
        </Card>

        {/* INFORMATIONS MÉDICALES DE BASE */}
        <Card>
          <CardHeader>
            <CardTitle>Informations médicales de base</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bloodType">Groupe sanguin</Label>
              <Select name="bloodType" defaultValue={patient.bloodType || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Non renseigné" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="AB">AB</SelectItem>
                  <SelectItem value="O">O</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rhesus">Rhésus</Label>
              <Select name="rhesus" defaultValue={patient.rhesus || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Non renseigné" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+">Positif (+)</SelectItem>
                  <SelectItem value="-">Négatif (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gravida">Gravida (nombre de grossesses)</Label>
              <Input id="gravida" name="gravida" type="number" min="0" defaultValue={patient.gravida || 0} />
            </div>
            <div>
              <Label htmlFor="para">Para (nombre d'accouchements)</Label>
              <Input id="para" name="para" type="number" min="0" defaultValue={patient.para || 0} />
            </div>
          </CardContent>
        </Card>

        {/* ALLERGIES */}
        <Card>
          <CardHeader>
            <CardTitle>Allergies</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="allergies"
              placeholder="Liste des allergies connues..."
              defaultValue={patient.allergies || ''}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* ANTÉCÉDENTS MÉDICAUX */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Antécédents médicaux</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={() => addItem(antecedentsMedicaux, setAntecedentsMedicaux)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {antecedentsMedicaux.length === 0 && (
              <p className="text-sm text-slate-500">Aucun antécédent médical renseigné</p>
            )}
            {antecedentsMedicaux.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateItem(antecedentsMedicaux, setAntecedentsMedicaux, index, e.target.value)}
                  placeholder="Ex: Diabète de type 2, Hypertension..."
                  className="flex-1"
                />
                <Button type="button" size="icon" variant="ghost" onClick={() => removeItem(antecedentsMedicaux, setAntecedentsMedicaux, index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ANTÉCÉDENTS CHIRURGICAUX */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Antécédents chirurgicaux</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={() => addItem(antecedentsChirurgicaux, setAntecedentsChirurgicaux)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {antecedentsChirurgicaux.length === 0 && (
              <p className="text-sm text-slate-500">Aucun antécédent chirurgical renseigné</p>
            )}
            {antecedentsChirurgicaux.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateItem(antecedentsChirurgicaux, setAntecedentsChirurgicaux, index, e.target.value)}
                  placeholder="Ex: Appendicectomie (2015), Césarienne (2020)..."
                  className="flex-1"
                />
                <Button type="button" size="icon" variant="ghost" onClick={() => removeItem(antecedentsChirurgicaux, setAntecedentsChirurgicaux, index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ANTÉCÉDENTS GYNÉCOLOGIQUES DÉTAILLÉS */}
        <Card>
          <CardHeader>
            <CardTitle>Antécédents gynécologiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cycle menstruel */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Cycle menstruel</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateReglesMenarches">Âge des ménarches</Label>
                  <Input
                    id="dateReglesMenarches"
                    value={antecedentsGyneco.dateReglesMenarches}
                    onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, dateReglesMenarches: e.target.value})}
                    placeholder="Ex: 13 ans"
                  />
                </div>
                <div>
                  <Label htmlFor="dureeCycle">Durée du cycle (jours)</Label>
                  <Input
                    id="dureeCycle"
                    type="number"
                    value={antecedentsGyneco.dureeCycle}
                    onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, dureeCycle: e.target.value})}
                    placeholder="Ex: 28"
                  />
                </div>
                <div>
                  <Label htmlFor="dureeRegles">Durée des règles (jours)</Label>
                  <Input
                    id="dureeRegles"
                    type="number"
                    value={antecedentsGyneco.dureeRegles}
                    onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, dureeRegles: e.target.value})}
                    placeholder="Ex: 5"
                  />
                </div>
              </div>
            </div>

            {/* Dysménorrhées */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dysmenorrhees"
                  checked={antecedentsGyneco.dysmenorrhees}
                  onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, dysmenorrhees: e.target.checked})}
                  className="h-4 w-4"
                />
                <Label htmlFor="dysmenorrhees">Dysménorrhées</Label>
              </div>
              {antecedentsGyneco.dysmenorrhees && (
                <Input
                  value={antecedentsGyneco.dysmenorrheesDetails}
                  onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, dysmenorrheesDetails: e.target.value})}
                  placeholder="Précisions..."
                />
              )}
            </div>

            {/* Dyspareunies */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dyspareunies"
                  checked={antecedentsGyneco.dyspareunies}
                  onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, dyspareunies: e.target.checked})}
                  className="h-4 w-4"
                />
                <Label htmlFor="dyspareunies">Dyspareunies</Label>
              </div>
              {antecedentsGyneco.dyspareunies && (
                <Input
                  value={antecedentsGyneco.dyspareuniesDétails}
                  onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, dyspareuniesDétails: e.target.value})}
                  placeholder="Précisions..."
                />
              )}
            </div>

            {/* Contraception */}
            <div className="space-y-2">
              <Label htmlFor="contraception">Contraception actuelle</Label>
              <Input
                id="contraception"
                value={antecedentsGyneco.contraception}
                onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, contraception: e.target.value})}
                placeholder="Ex: Pilule, DIU, Implant, Aucune..."
              />
              {antecedentsGyneco.contraception && (
                <Input
                  value={antecedentsGyneco.contraceptionDetails}
                  onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, contraceptionDetails: e.target.value})}
                  placeholder="Détails (nom, posologie, date de pose...)"
                />
              )}
            </div>

            {/* Frottis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateDernierFrottis">Date du dernier frottis</Label>
                <Input
                  id="dateDernierFrottis"
                  type="date"
                  value={antecedentsGyneco.dateDernierFrottis}
                  onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, dateDernierFrottis: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="resultatDernierFrottis">Résultat</Label>
                <Input
                  id="resultatDernierFrottis"
                  value={antecedentsGyneco.resultatDernierFrottis}
                  onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, resultatDernierFrottis: e.target.value})}
                  placeholder="Ex: Normal, ASCUS..."
                />
              </div>
            </div>

            {/* Pathologies gynéco */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Pathologies gynécologiques</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setAntecedentsGyneco({
                    ...antecedentsGyneco,
                    pathologiesGyneco: [...antecedentsGyneco.pathologiesGyneco, '']
                  })}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter
                </Button>
              </div>
              {antecedentsGyneco.pathologiesGyneco.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newList = [...antecedentsGyneco.pathologiesGyneco]
                      newList[index] = e.target.value
                      setAntecedentsGyneco({...antecedentsGyneco, pathologiesGyneco: newList})
                    }}
                    placeholder="Ex: Endométriose, SOPK, Fibromes..."
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setAntecedentsGyneco({
                      ...antecedentsGyneco,
                      pathologiesGyneco: antecedentsGyneco.pathologiesGyneco.filter((_, i) => i !== index)
                    })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Chirurgies gynéco */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Chirurgies gynécologiques</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setAntecedentsGyneco({
                    ...antecedentsGyneco,
                    chirurgiesGyneco: [...antecedentsGyneco.chirurgiesGyneco, '']
                  })}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter
                </Button>
              </div>
              {antecedentsGyneco.chirurgiesGyneco.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newList = [...antecedentsGyneco.chirurgiesGyneco]
                      newList[index] = e.target.value
                      setAntecedentsGyneco({...antecedentsGyneco, chirurgiesGyneco: newList})
                    }}
                    placeholder="Ex: Hystérectomie (2018), Kystectomie ovarienne (2020)..."
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setAntecedentsGyneco({
                      ...antecedentsGyneco,
                      chirurgiesGyneco: antecedentsGyneco.chirurgiesGyneco.filter((_, i) => i !== index)
                    })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Autres informations gynéco */}
            <div>
              <Label htmlFor="autresGyneco">Autres informations gynécologiques</Label>
              <Textarea
                id="autresGyneco"
                value={antecedentsGyneco.autres}
                onChange={(e) => setAntecedentsGyneco({...antecedentsGyneco, autres: e.target.value})}
                placeholder="Autres informations pertinentes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* ANTÉCÉDENTS FAMILIAUX */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Antécédents familiaux</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={() => addItem(antecedentsFamiliaux, setAntecedentsFamiliaux)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {antecedentsFamiliaux.length === 0 && (
              <p className="text-sm text-slate-500">Aucun antécédent familial renseigné</p>
            )}
            {antecedentsFamiliaux.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateItem(antecedentsFamiliaux, setAntecedentsFamiliaux, index, e.target.value)}
                  placeholder="Ex: Mère - cancer du sein, Père - diabète..."
                  className="flex-1"
                />
                <Button type="button" size="icon" variant="ghost" onClick={() => removeItem(antecedentsFamiliaux, setAntecedentsFamiliaux, index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* TRAITEMENTS EN COURS */}
        <Card>
          <CardHeader>
            <CardTitle>Traitements en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="traitementEnCours"
              placeholder="Liste des médicaments et traitements en cours avec posologie..."
              defaultValue={patient.traitementEnCours || ''}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* AUTRES INFORMATIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Autres informations</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mutuelle">Mutuelle</Label>
              <Input id="mutuelle" name="mutuelle" defaultValue={patient.mutuelle || ''} />
            </div>
            <div>
              <Label htmlFor="numeroMutuelle">Numéro de mutuelle</Label>
              <Input id="numeroMutuelle" name="numeroMutuelle" defaultValue={patient.numeroMutuelle || ''} />
            </div>
            <div>
              <Label htmlFor="medecinTraitant">Médecin traitant</Label>
              <Input id="medecinTraitant" name="medecinTraitant" defaultValue={patient.medecinTraitant || ''} />
            </div>
            <div>
              <Label htmlFor="personneConfiance">Personne de confiance</Label>
              <Input id="personneConfiance" name="personneConfiance" defaultValue={patient.personneConfiance || ''} />
            </div>
            <div>
              <Label htmlFor="telephoneConfiance">Téléphone personne de confiance</Label>
              <Input id="telephoneConfiance" name="telephoneConfiance" type="tel" defaultValue={patient.telephoneConfiance || ''} />
            </div>
          </CardContent>
        </Card>

        {/* BOUTONS DE SAUVEGARDE */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(`/patients/${id}`)} disabled={isSaving}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
