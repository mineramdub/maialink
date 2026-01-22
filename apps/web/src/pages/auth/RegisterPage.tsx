import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card } from '../../components/ui/card'
import { Heart, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rpps: '',
    adeli: '',
    numeroAM: '',
    phone: '',
    specialite: '',
    typeStructure: '',
    nomStructure: '',
    cabinetAddress: '',
    cabinetPostalCode: '',
    cabinetCity: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          rpps: formData.rpps || undefined,
          adeli: formData.adeli || undefined,
          numeroAM: formData.numeroAM || undefined,
          phone: formData.phone || undefined,
          specialite: formData.specialite || undefined,
          typeStructure: formData.typeStructure || undefined,
          nomStructure: formData.nomStructure || undefined,
          cabinetAddress: formData.cabinetAddress || undefined,
          cabinetPostalCode: formData.cabinetPostalCode || undefined,
          cabinetCity: formData.cabinetCity || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription')
      }

      // Redirection vers login après inscription réussie
      navigate('/login', {
        state: { message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' }
      })
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 mb-4">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MaiaLink</h1>
          <p className="mt-2 text-sm text-slate-600">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="sage-femme@exemple.fr"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Min. 6 caractères"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Informations professionnelles</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="rpps">N° RPPS *</Label>
                <Input
                  id="rpps"
                  name="rpps"
                  type="text"
                  value={formData.rpps}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Ex: 10001234567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adeli">N° ADELI</Label>
                <Input
                  id="adeli"
                  name="adeli"
                  type="text"
                  value={formData.adeli}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Optionnel"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="numeroAM">N° Assurance Maladie *</Label>
                <Input
                  id="numeroAM"
                  name="numeroAM"
                  type="text"
                  value={formData.numeroAM}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Ex: 891234567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Ex: 06 12 34 56 78"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialite">Spécialité / Activité</Label>
              <Input
                id="specialite"
                name="specialite"
                type="text"
                value={formData.specialite}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Ex: Suivi de grossesse et post-partum"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Informations du cabinet</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="typeStructure">Type de structure</Label>
                <Input
                  id="typeStructure"
                  name="typeStructure"
                  type="text"
                  value={formData.typeStructure}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Ex: MAISON DE SANTE"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomStructure">Nom de la structure</Label>
                <Input
                  id="nomStructure"
                  name="nomStructure"
                  type="text"
                  value={formData.nomStructure}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Ex: Maison de Santé de..."
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="cabinetAddress">Adresse du cabinet *</Label>
              <Input
                id="cabinetAddress"
                name="cabinetAddress"
                type="text"
                value={formData.cabinetAddress}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Ex: 123, rue des Belles Feuilles"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cabinetPostalCode">Code postal *</Label>
                <Input
                  id="cabinetPostalCode"
                  name="cabinetPostalCode"
                  type="text"
                  value={formData.cabinetPostalCode}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Ex: 69400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cabinetCity">Ville *</Label>
                <Input
                  id="cabinetCity"
                  name="cabinetCity"
                  type="text"
                  value={formData.cabinetCity}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Ex: Villefranche-sur-Saône"
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création du compte...
              </>
            ) : (
              'Créer mon compte'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-slate-900 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  )
}
