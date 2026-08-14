'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'

interface MobileTopbarProps {
  onOpen: () => void
}

export default function MobileTopbar({ onOpen }: MobileTopbarProps) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/[0.05] bg-white/80 px-4 py-3 backdrop-blur-xl md:hidden">

      <Link href="/dashboard" className="flex items-center gap-2">
        <p className="text-[16px] uppercase font-bold tracking-[-0.04em] text-[#111111]">
          duora
        </p>
      </Link>

      <button
        type="button"
        onClick={onOpen}
        className="flex size-9 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-black/[0.03] hover:text-neutral-900"
      >
        <Menu size={20} strokeWidth={1.9} />
      </button>

    </div>
  )
}