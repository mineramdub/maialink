import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AuthLayout } from './layouts/AuthLayout'

// Pages
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import PatientsPage from './pages/patients/PatientsPage'
import NewPatientPage from './pages/patients/NewPatientPage'
import PatientDetailPage from './pages/patients/PatientDetailPage'
import GrossessesPage from './pages/grossesses/GrossessesPage'
import NewGrossessePage from './pages/grossesses/NewGrossessePage'
import GrosesseDetailPage from './pages/grossesses/GrosesseDetailPage'
import ConsultationsPage from './pages/consultations/ConsultationsPage'
import NewConsultationPage from './pages/consultations/NewConsultationPage'
import ConsultationDetailPage from './pages/consultations/ConsultationDetailPage'
import FacturationPage from './pages/facturation/FacturationPage'
import NewFacturationPage from './pages/facturation/NewFacturationPage'
import FacturationDetailPage from './pages/facturation/FacturationDetailPage'
import ProtocolesPage from './pages/protocoles/ProtocolesPage'
import DocumentsPage from './pages/documents/DocumentsPage'
import AgendaPage from './pages/agenda/AgendaPage'
import StatistiquesPage from './pages/statistiques/StatistiquesPage'
import ParametresPage from './pages/parametres/ParametresPage'
import GynecologiePage from './pages/gynecologie/GynecologiePage'
import ReeducationPage from './pages/reeducation/ReeducationPage'

export const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
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
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/patients', element: <PatientsPage /> },
          { path: '/patients/new', element: <NewPatientPage /> },
          { path: '/patients/:id', element: <PatientDetailPage /> },
          { path: '/patients/:id/edit', element: <div>Patient Edit - TODO</div> },
          { path: '/grossesses', element: <GrossessesPage /> },
          { path: '/grossesses/new', element: <NewGrossessePage /> },
          { path: '/grossesses/:id', element: <GrosesseDetailPage /> },
          { path: '/consultations', element: <ConsultationsPage /> },
          { path: '/consultations/new', element: <NewConsultationPage /> },
          { path: '/consultations/:id', element: <ConsultationDetailPage /> },
          { path: '/reeducation', element: <ReeducationPage /> },
          { path: '/reeducation/new', element: <div>Reeducation New - TODO</div> },
          { path: '/gynecologie', element: <GynecologiePage /> },
          { path: '/documents', element: <DocumentsPage /> },
          { path: '/documents/new', element: <div>Document New - TODO</div> },
          { path: '/facturation', element: <FacturationPage /> },
          { path: '/facturation/new', element: <NewFacturationPage /> },
          { path: '/facturation/:id', element: <FacturationDetailPage /> },
          { path: '/agenda', element: <AgendaPage /> },
          { path: '/statistiques', element: <StatistiquesPage /> },
          { path: '/protocoles', element: <ProtocolesPage /> },
          { path: '/parametres', element: <ParametresPage /> },
        ]
      }
    ]
  }
])
