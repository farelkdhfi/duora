'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  CalendarDays,
  Home,
  MoreHorizontal,
  Wallet,
} from 'lucide-react'

import LoveWave from '@/components/ui/love-wave'
import { useMyRelationshipDetails } from '@/features/relationship/queries'

interface MobileBottomNavProps {
  onMore: () => void
}

const navigation = [
  {
    href: '/dashboard',
    icon: Home,
  },
  {
    href: '/planner',
    icon: CalendarDays,
  },
  {
    href: '/goals',
    icon: Wallet,
  },
]

export default function MobileBottomNav({ onMore }: MobileBottomNavProps) {
  const pathname = usePathname()

  const { data, isLoading } = useMyRelationshipDetails()

  const memberCount = data?.members?.length ?? 0
  const locked = isLoading || memberCount < 2

  function isActive(href: string) {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }

    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  const aiActive =
    pathname === '/ai-assistant' ||
    pathname?.startsWith('/ai-assistant/')

  function renderNavItem(item: (typeof navigation)[number]) {
    const Icon = item.icon
    const active = isActive(item.href)

    if (locked) {
      return (
        <div
          key={item.href}
          aria-disabled="true"
          className="flex min-w-0 flex-1 cursor-not-allowed flex-col items-center justify-center gap-1.5 rounded-2xl py-2 text-white/35 opacity-40"
        >
          <Icon size={20} strokeWidth={1.65} />

          <span className="text-[10px] leading-none">
            &nbsp;
          </span>
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition-all duration-200 active:scale-95 ${
          active
            ? 'text-white'
            : 'text-white/35 hover:text-white/65'
        }`}
      >
        <Icon
          size={20}
          strokeWidth={active ? 2.15 : 1.65}
        />

        <span className="text-[10px] leading-none">
          &nbsp;
        </span>
      </Link>
    )
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-51 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="relative mx-auto h-[4.75rem] max-w-md rounded-[1.75rem] border border-white/10 bg-black/80 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="absolute inset-x-0 bottom-0 h-full overflow-hidden rounded-[1.75rem]">
          <div className="absolute inset-0 bg-white/[0.03]" />
          <div className="absolute left-1/2 top-0 h-[4rem] w-[5.75rem] -translate-x-1/2 rounded-b-[3rem] bg-white/[0.04]" />
          <div className="absolute inset-x-6 top-0 h-px bg-white/10" />
        </div>

        <div className="relative z-10 flex h-full items-center px-2">
          <div className="flex min-w-0 flex-1 items-center">
            {navigation.slice(0, 2).map(renderNavItem)}
          </div>

          <div className="w-[5.75rem] shrink-0" />

          <div className="flex min-w-0 flex-1 items-center">
            {navigation.slice(2).map(renderNavItem)}

            {/* Tombol More tetap aktif agar user bisa akses Subscription & Log out */}
            <button
              type="button"
              onClick={onMore}
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 text-white/35 transition-all duration-200 hover:text-white/65 active:scale-95"
            >
              <MoreHorizontal size={21} strokeWidth={1.65} />
            </button>
          </div>
        </div>

        {locked ? (
          <div
            aria-label="Duora AI Assistant (terkunci)"
            aria-disabled="true"
            className="absolute left-1/2 top-1/2 z-20 flex size-[3.15rem] -translate-x-1/2 -translate-y-[calc(50%+1.55rem)] cursor-not-allowed items-center justify-center rounded-full bg-neutral-900 opacity-50 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)] ring-[0.55rem] ring-black/80"
          >
            <div className="pointer-events-none flex size-[3rem] items-center justify-center overflow-hidden rounded-full grayscale">
              <LoveWave size={54} />
            </div>
          </div>
        ) : (
          <Link
            href="/ai-assistant"
            aria-label="Duora AI Assistant"
            className={`absolute left-1/2 top-1/2 z-20 flex size-[3.15rem] -translate-x-1/2 -translate-y-[calc(50%+1.55rem)] items-center justify-center rounded-full shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)] ring-[0.55rem] ring-black/80 transition-all duration-200 active:scale-95 bg-black`}
          >
            <div className="pointer-events-none flex size-[3rem] items-center justify-center overflow-hidden rounded-full">
              <LoveWave size={54} />
            </div>
          </Link>
        )}
      </div>
    </nav>
  )
}