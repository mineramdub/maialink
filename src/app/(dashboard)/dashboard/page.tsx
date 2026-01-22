import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { patients, consultations, appointments, grossesses, alertes } from '@/lib/schema'
import { eq, and, gte, lte, desc, count } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  Baby,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Stethoscope,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

async function getDashboardData(userId: string) {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  // Stats
  const [patientsCount] = await db
    .select({ count: count() })
    .from(patients)
    .where(and(eq(patients.userId, userId), eq(patients.status, 'active')))

  const [grossessesEnCours] = await db
    .select({ count: count() })
    .from(grossesses)
    .where(and(eq(grossesses.userId, userId), eq(grossesses.status, 'en_cours')))

  const [consultationsMonth] = await db
    .select({ count: count() })
    .from(consultations)
    .where(and(eq(consultations.userId, userId), gte(consultations.date, startOfMonth)))

  // RDV du jour
  const todayAppointments = await db.query.appointments.findMany({
    where: and(
      eq(appointments.userId, userId),
      gte(appointments.startTime, startOfDay),
      lte(appointments.startTime, endOfDay)
    ),
    with: {
      patient: true,
    },
    orderBy: [appointments.startTime],
    limit: 5,
  })

  // Alertes non lues
  const unrealAlertes = await db.query.alertes.findMany({
    where: and(
      eq(alertes.userId, userId),
      eq(alertes.isRead, false)
    ),
    with: {
      patient: true,
    },
    orderBy: [desc(alertes.createdAt)],
    limit: 5,
  })

  // Dernières patientes
  const recentPatients = await db.query.patients.findMany({
    where: eq(patients.userId, userId),
    orderBy: [desc(patients.updatedAt)],
    limit: 5,
  })

  return {
    stats: {
      patients: patientsCount?.count || 0,
      grossessesEnCours: grossessesEnCours?.count || 0,
      consultationsMonth: consultationsMonth?.count || 0,
      alertes: unrealAlertes.length,
    },
    todayAppointments,
    unrealAlertes,
    recentPatients,
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const data = await getDashboardData(user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Bonjour {user.firstName}
          </h1>
          <p className="text-slate-500 mt-1">
            Voici le resume de votre activite
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/patients/new">
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle patiente
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Patientes actives</p>
                <p className="text-2xl font-semibold">{data.stats.patients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <Baby className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Grossesses en cours</p>
                <p className="text-2xl font-semibold">{data.stats.grossessesEnCours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Consultations ce mois</p>
                <p className="text-2xl font-semibold">{data.stats.consultationsMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Alertes</p>
                <p className="text-2xl font-semibold">{data.stats.alertes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/documents/new?type=ordonnance">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Créer une ordonnance</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/consultations/new">
                <Stethoscope className="h-6 w-6" />
                <span className="text-sm">Nouvelle consultation</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/patients/new">
                <Users className="h-6 w-6" />
                <span className="text-sm">Ajouter une patiente</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/documents">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Mes documents</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* RDV du jour */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              <Calendar className="h-4 w-4 inline mr-2" />
              Rendez-vous du jour
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/agenda">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.todayAppointments.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                Aucun rendez-vous aujourdhui
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.todayAppointments.map((apt) => (
                  <li key={apt.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-medium">
                        {apt.patient?.firstName?.[0]}{apt.patient?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {apt.patient?.firstName} {apt.patient?.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{apt.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {new Date(apt.startTime).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Alertes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              Alertes recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.unrealAlertes.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                Aucune alerte en attente
              </p>
            ) : (
              <ul className="space-y-3">
                {data.unrealAlertes.map((alerte) => (
                  <li
                    key={alerte.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50"
                  >
                    <Badge
                      variant={
                        alerte.severity === 'critical'
                          ? 'destructive'
                          : alerte.severity === 'warning'
                          ? 'warning'
                          : 'info'
                      }
                      className="mt-0.5"
                    >
                      {alerte.severity === 'critical'
                        ? 'Critique'
                        : alerte.severity === 'warning'
                        ? 'Attention'
                        : 'Info'}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">{alerte.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {alerte.patient?.firstName} {alerte.patient?.lastName}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Patientes recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">
            <Stethoscope className="h-4 w-4 inline mr-2" />
            Dernieres patientes consultees
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/patients">
              Voir toutes
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {data.recentPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-medium">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(patient.birthDate)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
