import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
          >
            Deconnexion
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Bienvenue, {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-600">Email: {user?.email}</p>
          <p className="text-gray-600">Role: {user?.role}</p>
          {user?.rpps && <p className="text-gray-600">RPPS: {user.rpps}</p>}
          {user?.adeli && <p className="text-gray-600">ADELI: {user.adeli}</p>}
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">
            Migration Next.js → React + Vite reussie!
          </h3>
          <p className="text-gray-600">
            Le backend Express et le frontend Vite fonctionnent correctement.
          </p>
          <p className="mt-2 text-gray-600">
            Les prochaines etapes: migrer toutes les routes API et les pages.
          </p>
        </div>
      </div>
    </div>
  )
}
