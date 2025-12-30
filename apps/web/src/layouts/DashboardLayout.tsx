import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sidebar } from '../components/layout/sidebar'
import { Header } from '../components/layout/header'
import { ChatBubble } from '../components/chat-bubble'

export function DashboardLayout() {
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        <Header user={user!} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ChatBubble />
    </div>
  )
}
