import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { patients, consultations, invoices, grossesses } from '@/lib/schema'
import { eq, and, gte, count, sql } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Baby,
  Stethoscope,
  Euro,
  TrendingUp,
  Calendar,
  Activity,
  BarChart3,
} from 'lucide-react'

async function getStats(userId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Patientes
  const [totalPatients] = await db
    .select({ count: count() })
    .from(patients)
    .where(and(eq(patients.userId, userId), eq(patients.status, 'active')))

  // Grossesses en cours
  const [grossessesEnCours] = await db
    .select({ count: count() })
    .from(grossesses)
    .where(and(eq(grossesses.userId, userId), eq(grossesses.status, 'en_cours')))

  // Consultations ce mois
  const [consultationsMonth] = await db
    .select({ count: count() })
    .from(consultations)
    .where(and(eq(consultations.userId, userId), gte(consultations.date, startOfMonth)))

  // Consultations mois dernier (pour comparaison)
  const [consultationsLastMonth] = await db
    .select({ count: count() })
    .from(consultations)
    .where(
      and(
        eq(consultations.userId, userId),
        gte(consultations.date, lastMonth),
        sql`${consultations.date} < ${startOfMonth}`
      )
    )

  // CA ce mois
  const [caMonth] = await db
    .select({ total: sql<number>`COALESCE(sum(${invoices.montantTTC}::numeric), 0)` })
    .from(invoices)
    .where(and(eq(invoices.userId, userId), gte(invoices.date, startOfMonth.toISOString().split('T')[0])))

  // CA annee
  const [caYear] = await db
    .select({ total: sql<number>`COALESCE(sum(${invoices.montantTTC}::numeric), 0)` })
    .from(invoices)
    .where(and(eq(invoices.userId, userId), gte(invoices.date, startOfYear.toISOString().split('T')[0])))

  // Repartition par type de consultation
  const consultationsByType = await db
    .select({
      type: consultations.type,
      count: count(),
    })
    .from(consultations)
    .where(and(eq(consultations.userId, userId), gte(consultations.date, startOfYear)))
    .groupBy(consultations.type)

  // Consultations par mois (12 derniers mois)
  const consultationsByMonth = await db
    .select({
      month: sql<string>`to_char(${consultations.date}, 'YYYY-MM')`,
      count: count(),
    })
    .from(consultations)
    .where(eq(consultations.userId, userId))
    .groupBy(sql`to_char(${consultations.date}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${consultations.date}, 'YYYY-MM')`)
    .limit(12)

  return {
    totalPatients: totalPatients?.count || 0,
    grossessesEnCours: grossessesEnCours?.count || 0,
    consultationsMonth: consultationsMonth?.count || 0,
    consultationsLastMonth: consultationsLastMonth?.count || 0,
    caMonth: caMonth?.total || 0,
    caYear: caYear?.total || 0,
    consultationsByType,
    consultationsByMonth,
  }
}

export default async function StatistiquesPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const stats = await getStats(user.id)

  const consultationTypes: Record<string, { label: string; color: string }> = {
    prenatale: { label: 'Prenatale', color: 'bg-pink-500' },
    postnatale: { label: 'Postnatale', color: 'bg-purple-500' },
    gyneco: { label: 'Gyneco', color: 'bg-blue-500' },
    reeducation: { label: 'Reeducation', color: 'bg-green-500' },
    preparation: { label: 'Preparation', color: 'bg-amber-500' },
    monitoring: { label: 'Monitoring', color: 'bg-red-500' },
    autre: { label: 'Autre', color: 'bg-slate-500' },
  }

  const evolutionConsultations =
    stats.consultationsLastMonth > 0
      ? Math.round(
          ((stats.consultationsMonth - stats.consultationsLastMonth) /
            stats.consultationsLastMonth) *
            100
        )
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Statistiques</h1>
        <p className="text-slate-500 mt-1">
          Vue d'ensemble de votre activite
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Patientes actives</p>
                <p className="text-2xl font-semibold">{stats.totalPatients}</p>
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
                <p className="text-sm text-slate-500">Grossesses suivies</p>
                <p className="text-2xl font-semibold">{stats.grossessesEnCours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Consultations ce mois</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold">{stats.consultationsMonth}</p>
                  {evolutionConsultations !== 0 && (
                    <Badge variant={evolutionConsultations > 0 ? 'success' : 'destructive'}>
                      {evolutionConsultations > 0 ? '+' : ''}
                      {evolutionConsultations}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Euro className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">CA ce mois</p>
                <p className="text-2xl font-semibold">
                  {Number(stats.caMonth).toFixed(0)} EUR
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Repartition par type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Repartition par type de consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.consultationsByType.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Pas de donnees disponibles
              </p>
            ) : (
              <div className="space-y-4">
                {stats.consultationsByType.map((item) => {
                  const typeInfo = consultationTypes[item.type] || {
                    label: item.type,
                    color: 'bg-slate-500',
                  }
                  const total = stats.consultationsByType.reduce((acc, i) => acc + Number(i.count), 0)
                  const percentage = total > 0 ? Math.round((Number(item.count) / total) * 100) : 0

                  return (
                    <div key={item.type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{typeInfo.label}</span>
                        <span className="font-medium">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${typeInfo.color} rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evolution mensuelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolution mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.consultationsByMonth.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Pas de donnees disponibles
              </p>
            ) : (
              <div className="space-y-3">
                {stats.consultationsByMonth.slice(-6).map((item) => {
                  const maxCount = Math.max(
                    ...stats.consultationsByMonth.map((i) => Number(i.count))
                  )
                  const percentage = maxCount > 0 ? (Number(item.count) / maxCount) * 100 : 0

                  return (
                    <div key={item.month} className="flex items-center gap-4">
                      <span className="text-sm text-slate-500 w-20">{item.month}</span>
                      <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded transition-all flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(percentage, 10)}%` }}
                        >
                          <span className="text-xs text-white font-medium">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CA annuel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Chiffre d'affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Ce mois</p>
                <p className="text-2xl font-bold mt-1">
                  {Number(stats.caMonth).toFixed(2)} EUR
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Cette annee</p>
                <p className="text-2xl font-bold mt-1">
                  {Number(stats.caYear).toFixed(2)} EUR
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-500">Moyenne mensuelle</p>
                <p className="text-2xl font-bold mt-1">
                  {(Number(stats.caYear) / (new Date().getMonth() + 1)).toFixed(2)} EUR
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
