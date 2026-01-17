import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { Loader2 } from 'lucide-react'

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
)

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/dashboard/EnhancedDashboardPage'))
const PatientsPage = lazy(() => import('./pages/patients/PatientsPage'))
const NewPatientPage = lazy(() => import('./pages/patients/NewPatientPage'))
const PatientDetailPage = lazy(() => import('./pages/patients/PatientDetailPage'))
const PatientEditPage = lazy(() => import('./pages/patients/PatientEditPage'))
const GrossessesPage = lazy(() => import('./pages/grossesses/GrossessesPage'))
const NewGrossessePage = lazy(() => import('./pages/grossesses/NewGrossessePage'))
const GrosesseDetailPage = lazy(() => import('./pages/grossesses/GrosesseDetailPage'))
const ConsultationsPage = lazy(() => import('./pages/consultations/ConsultationsPage'))
const NewConsultationPage = lazy(() => import('./pages/consultations/NewConsultationPage'))
const ConsultationDetailPage = lazy(() => import('./pages/consultations/ConsultationDetailPage'))
const FacturationPage = lazy(() => import('./pages/facturation/FacturationPage'))
const NewFacturationPage = lazy(() => import('./pages/facturation/NewFacturationPage'))
const FacturationDetailPage = lazy(() => import('./pages/facturation/FacturationDetailPage'))
const ProtocolesPage = lazy(() => import('./pages/protocoles/ProtocolesPage'))
const ProtocolDetailPage = lazy(() => import('./pages/protocoles/ProtocolDetailPage'))
const ProtocolUploadWizard = lazy(() => import('./pages/protocoles/ProtocolUploadWizard'))
const DocumentsPage = lazy(() => import('./pages/documents/DocumentsPage'))
const DocumentGeneratorPage = lazy(() => import('./pages/documents/DocumentGeneratorPage'))
const AgendaPage = lazy(() => import('./pages/agenda/AgendaPage'))
const StatistiquesPage = lazy(() => import('./pages/statistiques/StatistiquesPage'))
const ParametresPage = lazy(() => import('./pages/parametres/ParametresPage'))
const PractitionerSettingsPage = lazy(() => import('./pages/parametres/PractitionerSettingsPage'))
const GynecologiePage = lazy(() => import('./pages/gynecologie/GynecologiePage'))
const ReeducationPage = lazy(() => import('./pages/reeducation/ReeducationPage'))
const NewReeducationPage = lazy(() => import('./pages/reeducation/NewReeducationPage'))
const ReeducationDetailPage = lazy(() => import('./pages/reeducation/ReeducationDetailPage'))
const SeanceEditPage = lazy(() => import('./pages/reeducation/SeanceEditPage'))
const SuiviGynecoPage = lazy(() => import('./pages/suivi-gyneco/SuiviGynecoPage'))
const SurveillancePage = lazy(() => import('./pages/surveillance/SurveillancePage'))
const OrdonnanceDetailPage = lazy(() => import('./pages/ordonnances/OrdonnanceDetailPage'))
const NewOrdonnancePage = lazy(() => import('./pages/ordonnances/NewOrdonnancePage'))
const RoulettePage = lazy(() => import('./pages/roulette/RoulettePage'))
const AlertesPage = lazy(() => import('./pages/alertes/AlertesPage'))
const TemplatesPage = lazy(() => import('./pages/templates/TemplatesPage'))
const TemplateEditorPage = lazy(() => import('./pages/templates/TemplateEditorPage'))
const OrdonnanceTemplatesPage = lazy(() => import('./pages/admin/OrdonnanceTemplatesPage').then(m => ({ default: m.OrdonnanceTemplatesPage })))
const RessourcesMedicalesPage = lazy(() => import('./pages/RessourcesMedicalesPage'))
const NumerosUtilesPage = lazy(() => import('./pages/NumerosUtilesPage'))

// Wrapper component to add Suspense to lazy loaded routes
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: withSuspense(LoginPage) },
      { path: '/register', element: withSuspense(RegisterPage) },
    ]
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: withSuspense(DashboardPage) },
          { path: '/patients', element: withSuspense(PatientsPage) },
          { path: '/patients/new', element: withSuspense(NewPatientPage) },
          { path: '/patients/:id', element: withSuspense(PatientDetailPage) },
          { path: '/patients/:id/edit', element: withSuspense(PatientEditPage) },
          { path: '/grossesses', element: withSuspense(GrossessesPage) },
          { path: '/grossesses/new', element: withSuspense(NewGrossessePage) },
          { path: '/grossesses/:id', element: withSuspense(GrosesseDetailPage) },
          { path: '/consultations', element: withSuspense(ConsultationsPage) },
          { path: '/consultations/new', element: withSuspense(NewConsultationPage) },
          { path: '/consultations/edit/:id', element: withSuspense(NewConsultationPage) },
          { path: '/consultations/:id', element: withSuspense(ConsultationDetailPage) },
          { path: '/reeducation', element: withSuspense(ReeducationPage) },
          { path: '/reeducation/new', element: withSuspense(NewReeducationPage) },
          { path: '/reeducation/:id', element: withSuspense(ReeducationDetailPage) },
          { path: '/reeducation/:parcoursId/seance/:seanceId', element: withSuspense(SeanceEditPage) },
          { path: '/suivi-gyneco', element: withSuspense(SuiviGynecoPage) },
          { path: '/surveillance', element: withSuspense(SurveillancePage) },
          { path: '/gynecologie', element: withSuspense(GynecologiePage) },
          { path: '/documents', element: withSuspense(DocumentsPage) },
          { path: '/documents/generate', element: withSuspense(DocumentGeneratorPage) },
          { path: '/facturation', element: withSuspense(FacturationPage) },
          { path: '/facturation/new', element: withSuspense(NewFacturationPage) },
          { path: '/facturation/:id', element: withSuspense(FacturationDetailPage) },
          { path: '/agenda', element: withSuspense(AgendaPage) },
          { path: '/statistiques', element: withSuspense(StatistiquesPage) },
          { path: '/protocoles', element: withSuspense(ProtocolesPage) },
          { path: '/protocoles/new', element: withSuspense(ProtocolUploadWizard) },
          { path: '/protocoles/:id', element: withSuspense(ProtocolDetailPage) },
          { path: '/alertes', element: withSuspense(AlertesPage) },
          { path: '/ordonnances/new', element: withSuspense(NewOrdonnancePage) },
          { path: '/ordonnances/:id', element: withSuspense(OrdonnanceDetailPage) },
          { path: '/roulette', element: withSuspense(RoulettePage) },
          { path: '/templates', element: withSuspense(TemplatesPage) },
          { path: '/templates/new', element: withSuspense(TemplateEditorPage) },
          { path: '/templates/:id/edit', element: withSuspense(TemplateEditorPage) },
          { path: '/ressources-medicales', element: withSuspense(RessourcesMedicalesPage) },
          { path: '/numeros-utiles', element: withSuspense(NumerosUtilesPage) },
          { path: '/admin/ordonnance-templates', element: withSuspense(OrdonnanceTemplatesPage) },
          { path: '/parametres', element: withSuspense(ParametresPage) },
          { path: '/parametres/praticien', element: withSuspense(PractitionerSettingsPage) },
        ]
      }
    ]
  }
])
