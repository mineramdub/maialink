import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sidebar } from '../components/layout/sidebar'
import { Header } from '../components/layout/header'
import { ChatBubble } from '../components/chat-bubble'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { CommandPalette } from '../components/CommandPalette'
import { ShortcutsDialog } from '../components/ShortcutsDialog'
import { QuickConsultationModal } from '../components/QuickConsultationModal'
import { MobileNav } from '../components/layout/MobileNav'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useQuery } from '@tanstack/react-query'

export function DashboardLayout() {
  const { user } = useAuth()

  // Enable keyboard shortcuts globally
  useKeyboardShortcuts()

  // Fetch alert count for mobile nav badge
  const { data: alertData } = useQuery({
    queryKey: ['alerts-count'],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/alertes/count`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch alert count')
      return res.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  return (
    <>
      {/* Global Dialogs */}
      <CommandPalette />
      <ShortcutsDialog />
      <QuickConsultationModal />

      <div className="flex h-screen bg-gray-50 pb-16 md:pb-0">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
          <Header user={user!} />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav alertCount={alertData?.count || 0} />

      {/* Global Components */}
      <FloatingActionButton />
      <ChatBubble />
    </>
  )
}
