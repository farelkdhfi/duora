// MobileBottomNav.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  CalendarDays,
  Home,
  MoreHorizontal,
  NotebookPen,
} from 'lucide-react'

interface MobileBottomNavProps {
  onMore: () => void
}

const navigation = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Planner',
    href: '/planner',
    icon: CalendarDays,
  },
  {
    label: 'Notes',
    href: '/notes',
    icon: NotebookPen,
  },
]

function AiBotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-[20px]" aria-hidden="true">
      <path d="M12 3.5V5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="2.8" r="1" fill="currentColor" />
      <rect x="4.5" y="5.5" width="15" height="13" rx="4.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 12.25C8.5 11.7 8.95 11.25 9.5 11.25C10.05 11.25 10.5 11.7 10.5 12.25C10.5 12.8 10.05 13.25 9.5 13.25C8.95 13.25 8.5 12.8 8.5 12.25Z" fill="currentColor" />
      <path d="M13.5 12.25C13.5 11.7 13.95 11.25 14.5 11.25C15.05 11.25 15.5 11.7 15.5 12.25C15.5 12.8 15.05 13.25 14.5 13.25C13.95 13.25 13.5 12.8 13.5 12.25Z" fill="currentColor" />
      <path d="M9 15.5C9.8 16.25 10.8 16.65 12 16.65C13.2 16.65 14.2 16.25 15 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.5 11H3.25C2.56 11 2 11.56 2 12.25V13.25C2 13.94 2.56 14.5 3.25 14.5H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19.5 11H20.75C21.44 11 22 11.56 22 12.25V13.25C22 13.94 21.44 14.5 20.75 14.5H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function MobileBottomNav({ onMore }: MobileBottomNavProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }

    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  const debateActive = pathname === '/debates' || pathname?.startsWith('/debates/')

  return (
    <nav className="fixed inset-x-0 bottom-0 z-51 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="relative mx-auto h-[4.75rem] max-w-md rounded-[1.75rem] border border-white/10 bg-black/75 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.65)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="absolute inset-x-0 bottom-0 h-full overflow-hidden rounded-[1.75rem]">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute left-1/2 top-0 h-[4rem] w-[5.75rem] -translate-x-1/2 rounded-b-[3rem] bg-black/10" />
          <div className="absolute inset-x-6 top-0 h-px bg-white/10" />
        </div>

        <div className="relative z-10 flex h-full items-center px-2">
          <div className="flex min-w-0 flex-1 items-center">
            {navigation.slice(0, 2).map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link key={item.href} href={item.href} className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition-all duration-200 active:scale-95 ${active ? 'text-white' : 'text-white/45 hover:text-white/75'}`}>
                  <Icon size={20} strokeWidth={active ? 2.2 : 1.7} />
                  <span className={`text-[10px] leading-none ${active ? 'font-medium text-white' : 'font-normal text-white/45'}`}>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="w-[5.75rem] shrink-0" />

          <div className="flex min-w-0 flex-1 items-center">
            {navigation.slice(2).map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link key={item.href} href={item.href} className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition-all duration-200 active:scale-95 ${active ? 'text-white' : 'text-white/45 hover:text-white/75'}`}>
                  <Icon size={20} strokeWidth={active ? 2.2 : 1.7} />
                  <span className={`text-[10px] leading-none ${active ? 'font-medium text-white' : 'font-normal text-white/45'}`}>{item.label}</span>
                </Link>
              )
            })}

            <button type="button" onClick={onMore} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 text-white/45 transition-all duration-200 hover:text-white/75 active:scale-95">
              <MoreHorizontal size={21} strokeWidth={1.7} />
              <span className="text-[10px] font-normal leading-none">More</span>
            </button>
          </div>
        </div>

        <Link href="/debates" aria-label="Duora AI Debates" className={`absolute left-1/2 top-1/2 z-20 flex size-[3rem] -translate-x-1/2 -translate-y-[calc(50%+1.55rem)] items-center justify-center rounded-full border shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)] ring-[0.55rem] transition-all duration-200 active:scale-95 ${debateActive ? 'border-black bg-black text-white ring-white/75' : 'border-white/15 bg-white text-black ring-white/75'}`}>
          <AiBotIcon />
        </Link>
      </div>
    </nav>
  )
}