'use client'

import { X } from 'lucide-react'

import SidebarNav from './sidebar-nav'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <>

      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw]
          bg-white shadow-2xl
          transition-transform duration-300 ease-out
          md:hidden overflow-y-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-black/[0.03] hover:text-neutral-700"
          >
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="-mt-3">
          <SidebarNav onNavigate={onClose} />
        </div>

      </aside>

    </>
  )
}