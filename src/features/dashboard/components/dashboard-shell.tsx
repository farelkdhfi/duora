'use client'

import { useState } from 'react'

import SidebarDesktop from './sidebar-desktop'
import MobileTopbar from './mobile-topbar'
import MobileDrawer from './mobile-drawer'

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({
  children,
}: DashboardShellProps) {

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111]">

      <div className="flex min-h-screen flex-col md:flex-row">

        <MobileTopbar onOpen={() => setMobileOpen(true)} />

        <SidebarDesktop />

        <MobileDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <main className="min-w-0 flex-1 bg-neutral-50 p-6">
          {children}
        </main>

      </div>

    </div>
  )
}