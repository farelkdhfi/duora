'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

import SidebarDesktop from './sidebar-desktop'
import MobileBottomNav from './mobile-bottom-nav'
import MobileMoreSheet from './mobile-more-sheet'

import { ExpiryWarningModal } from '@/features/subscription/components/expiry-warning-modal'
import { ScreenTimeTracker } from '@/features/screen-time/components/screen-time-tracker'

interface DashboardShellProps {
  children: React.ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname()
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)

  const isDebateDetail = /^\/debates\/[^/]+$/.test(pathname)

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111]">
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* DESKTOP SIDEBAR */}
        {!isDebateDetail && <SidebarDesktop />}

        {/* MAIN CONTENT */}
        <main
          className={
            isDebateDetail
              ? 'relative min-h-screen min-w-0 flex-1 bg-neutral-50'
              : 'relative min-w-0 flex-1 bg-neutral-50 p-4 pb-24 sm:p-5 sm:pb-24 md:p-6 md:pb-6'
          }
        >
          {children}
        </main>

        {/* MOBILE BOTTOM NAV */}
        {!isDebateDetail && (
          <MobileBottomNav onMore={() => setMobileMoreOpen(true)} />
        )}

        {/* MOBILE MORE SHEET */}
        {!isDebateDetail && (
          <MobileMoreSheet
            open={mobileMoreOpen}
            onClose={() => setMobileMoreOpen(false)}
          />
        )}

        {/* SUBSCRIPTION */}
        <ExpiryWarningModal />

        <ScreenTimeTracker />
      </div>
    </div>
  )
}