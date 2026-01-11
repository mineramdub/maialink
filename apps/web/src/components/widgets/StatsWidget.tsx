import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Baby, Stethoscope, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatItem {
  label: string
  value: number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: any
  color: string
}

export function StatsWidget() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setStats([
          {
            label: 'Patientes',
            value: data.stats.totalPatients || 0,
            change: data.stats.newPatientsThisMonth || 0,
            changeType: 'increase',
            icon: Users,
            color: 'blue',
          },
          {
            label: 'Grossesses actives',
            value: data.stats.activeGrossesses || 0,
            icon: Baby,
            color: 'pink',
          },
          {
            label: 'Consultations ce mois',
            value: data.stats.consultationsThisMonth || 0,
            change: data.stats.consultationsChange || 0,
            changeType:
              (data.stats.consultationsChange || 0) > 0
                ? 'increase'
                : (data.stats.consultationsChange || 0) < 0
                ? 'decrease'
                : 'neutral',
            icon: Stethoscope,
            color: 'green',
          },
        ])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  {stat.change !== undefined && stat.changeType && (
                    <div
                      className={cn(
                        'flex items-center gap-0.5 text-xs font-medium',
                        stat.changeType === 'increase' && 'text-green-600',
                        stat.changeType === 'decrease' && 'text-red-600',
                        stat.changeType === 'neutral' && 'text-slate-500'
                      )}
                    >
                      {stat.changeType === 'increase' && (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {stat.changeType === 'decrease' && (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stat.changeType === 'neutral' && <Minus className="h-3 w-3" />}
                      <span>
                        {stat.changeType === 'increase' && '+'}
                        {stat.change}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  'h-12 w-12 rounded-xl flex items-center justify-center',
                  stat.color === 'blue' && 'bg-blue-100',
                  stat.color === 'pink' && 'bg-pink-100',
                  stat.color === 'green' && 'bg-green-100'
                )}
              >
                <stat.icon
                  className={cn(
                    'h-6 w-6',
                    stat.color === 'blue' && 'text-blue-600',
                    stat.color === 'pink' && 'text-pink-600',
                    stat.color === 'green' && 'text-green-600'
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
