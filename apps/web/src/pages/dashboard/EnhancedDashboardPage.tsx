import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { StatsWidget } from '../../components/widgets/StatsWidget'
import { TodayAppointmentsWidget } from '../../components/widgets/TodayAppointmentsWidget'
import { SurveillanceWidget } from '../../components/surveillance/SurveillanceWidget'
import { RecentPatientsWidget } from '../../components/widgets/RecentPatientsWidget'

export default function EnhancedDashboardPage() {
  const [customizing, setCustomizing] = useState(false)

  // Configuration des widgets (pourrait être sauvegardée dans localStorage ou API)
  const [widgetConfig, setWidgetConfig] = useState({
    stats: { enabled: true, order: 0 },
    surveillance: { enabled: true, order: 1 },
    todayAppointments: { enabled: true, order: 2 },
    recentPatients: { enabled: true, order: 3 },
  })

  const widgets = [
    {
      id: 'stats',
      component: <StatsWidget />,
      title: 'Statistiques',
      gridClass: 'col-span-full',
    },
    {
      id: 'surveillance',
      component: <SurveillanceWidget />,
      title: 'Surveillance',
      gridClass: 'lg:col-span-1',
    },
    {
      id: 'todayAppointments',
      component: <TodayAppointmentsWidget />,
      title: 'RDV du jour',
      gridClass: 'lg:col-span-1',
    },
    {
      id: 'recentPatients',
      component: <RecentPatientsWidget />,
      title: 'Patientes récentes',
      gridClass: 'lg:col-span-1',
    },
  ]

  const enabledWidgets = widgets
    .filter((w) => widgetConfig[w.id as keyof typeof widgetConfig]?.enabled)
    .sort(
      (a, b) =>
        widgetConfig[a.id as keyof typeof widgetConfig].order -
        widgetConfig[b.id as keyof typeof widgetConfig].order
    )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Vue d'ensemble de votre activité
          </p>
        </div>
        <Button
          variant={customizing ? 'default' : 'outline'}
          onClick={() => setCustomizing(!customizing)}
        >
          <Settings className="h-4 w-4 mr-2" />
          {customizing ? 'Terminer' : 'Personnaliser'}
        </Button>
      </div>

      {customizing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">
            Personnaliser le dashboard
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {widgets.map((widget) => (
              <label
                key={widget.id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={widgetConfig[widget.id as keyof typeof widgetConfig]?.enabled}
                  onChange={(e) =>
                    setWidgetConfig({
                      ...widgetConfig,
                      [widget.id]: {
                        ...widgetConfig[widget.id as keyof typeof widgetConfig],
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">{widget.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enabledWidgets.map((widget) => (
          <div key={widget.id} className={widget.gridClass}>
            {widget.component}
          </div>
        ))}
      </div>

      {enabledWidgets.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <p className="text-slate-600 mb-3">
            Aucun widget activé. Cliquez sur "Personnaliser" pour choisir ce que vous souhaitez afficher.
          </p>
          <Button onClick={() => setCustomizing(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Personnaliser le dashboard
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction
          href="/consultations/new"
          icon="📋"
          label="Nouvelle consultation"
          description="Créer une consultation"
          color="bg-blue-50 hover:bg-blue-100 border-blue-200"
        />
        <QuickAction
          href="/patients/new"
          icon="👤"
          label="Nouvelle patiente"
          description="Ajouter une patiente"
          color="bg-green-50 hover:bg-green-100 border-green-200"
        />
        <QuickAction
          href="/ordonnances/new"
          icon="💊"
          label="Ordonnance"
          description="Rédiger une ordonnance"
          color="bg-purple-50 hover:bg-purple-100 border-purple-200"
        />
        <QuickAction
          href="/documents/generate"
          icon="📄"
          label="Document"
          description="Générer un document"
          color="bg-orange-50 hover:bg-orange-100 border-orange-200"
        />
      </div>
    </div>
  )
}

function QuickAction({
  href,
  icon,
  label,
  description,
  color,
}: {
  href: string
  icon: string
  label: string
  description: string
  color: string
}) {
  return (
    <a
      href={href}
      className={`block p-4 rounded-lg border-2 transition-all ${color}`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-semibold text-sm text-slate-900">{label}</div>
      <div className="text-xs text-slate-600 mt-0.5">{description}</div>
    </a>
  )
}
