import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Sidebar } from '../components/layout/sidebar'
import { Header } from '../components/layout/header'
import { ChatBubble } from '../components/chat-bubble'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { EnhancedCommandPalette } from '../components/EnhancedCommandPalette'
import { ShortcutsDialog } from '../components/ShortcutsDialog'
import { QuickConsultationModal } from '../components/QuickConsultationModal'
import { SmartNotifications } from '../components/SmartNotifications'
import { MobileNav } from '../components/layout/MobileNav'
import { Toaster } from '../components/ui/toaster'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { FloatingWidget } from '../components/FloatingWidget'
import { Button } from '../components/ui/button'
import { Wrench } from 'lucide-react'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useQuery } from '@tanstack/react-query'

export function DashboardLayout() {
  const { user } = useAuth()
  const [showWidget, setShowWidget] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(288) // Default w-72

  // Load widget visibility from localStorage
  useEffect(() => {
    const savedVisibility = localStorage.getItem('maialink_widget_visible')
    if (savedVisibility === 'true') {
      setShowWidget(true)
    }

    // Load sidebar width
    const savedWidth = localStorage.getItem('maialink_sidebar_width')
    if (savedWidth) {
      const width = parseInt(savedWidth)
      if (!isNaN(width)) {
        setSidebarWidth(width)
      }
    }

    // Listen for sidebar resize events
    const handleSidebarResize = (e: CustomEvent) => {
      setSidebarWidth(e.detail.width)
    }
    window.addEventListener('sidebar-resize', handleSidebarResize as EventListener)
    return () => {
      window.removeEventListener('sidebar-resize', handleSidebarResize as EventListener)
    }
  }, [])

  // Save widget visibility to localStorage
  const toggleWidget = () => {
    const newState = !showWidget
    setShowWidget(newState)
    localStorage.setItem('maialink_widget_visible', String(newState))
  }

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
      {/* Global Dialogs & Notifications */}
      <EnhancedCommandPalette />
      <ShortcutsDialog />
      <QuickConsultationModal />
      <SmartNotifications />
      <Toaster />

      <div className="flex h-screen bg-gray-50 pb-16 md:pb-0">
        <Sidebar />
        <div
          className="flex-1 flex flex-col overflow-hidden transition-all duration-150"
          style={{ paddingLeft: `${sidebarWidth}px` }}
        >
          <Header user={user!} />
          <main className="flex-1 overflow-y-auto p-6">
            <Breadcrumbs />
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav alertCount={alertData?.count || 0} />

      {/* Global Components */}
      <FloatingActionButton />
      <ChatBubble />

      {/* Widget toggle button */}
      {!showWidget && (
        <Button
          onClick={toggleWidget}
          className="fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          size="icon"
          title="Ouvrir les outils"
        >
          <Wrench className="h-6 w-6" />
        </Button>
      )}

      {/* Floating Widget */}
      {showWidget && <FloatingWidget onClose={() => toggleWidget()} />}
    </>
  )
}
