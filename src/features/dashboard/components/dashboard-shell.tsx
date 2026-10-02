'use client'

import { useState } from 'react'

import SidebarDesktop from './sidebar-desktop'
import MobileBottomNav from './mobile-bottom-nav'
import MobileMoreSheet from './mobile-more-sheet'

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111]">
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* DESKTOP SIDEBAR */}
        <SidebarDesktop />

        {/* MAIN CONTENT */}
        <main className="relative min-w-0 flex-1 bg-neutral-50 pb-24 md:pb-0">
          {children}
        </main>

        {/* MOBILE BOTTOM NAV */}
        <MobileBottomNav onMore={() => setMobileMoreOpen(true)} />

        {/* MOBILE MORE SHEET */}
        <MobileMoreSheet
          open={mobileMoreOpen}
          onClose={() => setMobileMoreOpen(false)}
        />
      </div>
    </div>
  )
}