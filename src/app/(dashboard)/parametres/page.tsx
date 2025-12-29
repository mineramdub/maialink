'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  Building,
  Shield,
  Bell,
  Save,
  Loader2,
  Key,
  FileText,
} from 'lucide-react'

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  rpps?: string
  adeli?: string
  phone?: string
  twoFactorEnabled: boolean
}

export default function ParametresPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rpps: '',
    adeli: '',
    // Cabinet
    cabinetNom: '',
    cabinetAdresse: '',
    cabinetCodePostal: '',
    cabinetVille: '',
    cabinetTel: '',
    cabinetSiret: '',
  })

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
        setFormData({
          ...formData,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          rpps: data.user.rpps || '',
          adeli: data.user.adeli || '',
          phone: data.user.phone || '',
        })
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Implement save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Parametres</h1>
        <p className="text-slate-500 mt-1">
          Gerez vos informations et preferences
        </p>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profil" className="gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="cabinet" className="gap-2">
            <Building className="h-4 w-4" />
            Cabinet
          </TabsTrigger>
          <TabsTrigger value="securite" className="gap-2">
            <Shield className="h-4 w-4" />
            Securite
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Profil */}
        <TabsContent value="profil">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Vos informations de sage-femme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Prenom</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Telephone</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>N RPPS</Label>
                  <Input
                    value={formData.rpps}
                    onChange={(e) =>
                      setFormData({ ...formData, rpps: e.target.value })
                    }
                    placeholder="10..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>N ADELI</Label>
                  <Input
                    value={formData.adeli}
                    onChange={(e) =>
                      setFormData({ ...formData, adeli: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cabinet */}
        <TabsContent value="cabinet">
          <Card>
            <CardHeader>
              <CardTitle>Informations du cabinet</CardTitle>
              <CardDescription>
                Ces informations apparaitront sur vos documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nom du cabinet</Label>
                <Input
                  value={formData.cabinetNom}
                  onChange={(e) =>
                    setFormData({ ...formData, cabinetNom: e.target.value })
                  }
                  placeholder="Cabinet de sage-femme..."
                />
              </div>

              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input
                  value={formData.cabinetAdresse}
                  onChange={(e) =>
                    setFormData({ ...formData, cabinetAdresse: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Code postal</Label>
                  <Input
                    value={formData.cabinetCodePostal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cabinetCodePostal: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input
                    value={formData.cabinetVille}
                    onChange={(e) =>
                      setFormData({ ...formData, cabinetVille: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Telephone</Label>
                  <Input
                    value={formData.cabinetTel}
                    onChange={(e) =>
                      setFormData({ ...formData, cabinetTel: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>N SIRET</Label>
                  <Input
                    value={formData.cabinetSiret}
                    onChange={(e) =>
                      setFormData({ ...formData, cabinetSiret: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Securite */}
        <TabsContent value="securite">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mot de passe</CardTitle>
                <CardDescription>
                  Modifiez votre mot de passe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mot de passe actuel</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer le nouveau mot de passe</Label>
                  <Input type="password" />
                </div>
                <Button>
                  <Key className="h-4 w-4 mr-2" />
                  Modifier le mot de passe
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentification a deux facteurs</CardTitle>
                <CardDescription>
                  Renforcez la securite de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">2FA par application</p>
                    <p className="text-sm text-slate-500">
                      Utilisez une application comme Google Authenticator
                    </p>
                  </div>
                  <Button variant="outline">
                    {user?.twoFactorEnabled ? 'Desactiver' : 'Activer'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions actives</CardTitle>
                <CardDescription>
                  Gerez vos connexions actives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                    <div>
                      <p className="font-medium text-green-800">Session actuelle</p>
                      <p className="text-sm text-green-600">
                        Connecte maintenant
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Modeles de documents</CardTitle>
              <CardDescription>
                Personnalisez vos modeles d ordonnances et certificats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 text-center py-8">
                Fonctionnalite a venir
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
