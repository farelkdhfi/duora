'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  CalendarDays,
  Heart,
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

export default function MobileBottomNav({ onMore }: MobileBottomNavProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }

    return pathname === href || pathname?.startsWith(`${href}/`)
  }

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

                  <span className={`text-[10px] leading-none ${active ? 'font-medium text-white' : 'font-normal text-white/45'}`}>
                    {item.label}
                  </span>
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

                  <span className={`text-[10px] leading-none ${active ? 'font-medium text-white' : 'font-normal text-white/45'}`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}

            <button type="button" onClick={onMore} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 text-white/45 transition-all duration-200 hover:text-white/75 active:scale-95">
              <MoreHorizontal size={21} strokeWidth={1.7} />

              <span className="text-[10px] leading-none font-normal">
                More
              </span>
            </button>
          </div>
        </div>

        <Link href="/check-in" aria-label="Check-in" className="absolute left-1/2 top-1/2 z-20 flex size-[3rem] -translate-x-1/2 -translate-y-[calc(50%+1.55rem)] items-center justify-center rounded-full border border-white/15 bg-white text-black shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)] ring-[0.55rem] ring-white/75 transition-transform duration-200 active:scale-95">
          <Heart fill="black" size={19} />
        </Link>
      </div>
    </nav>
  )
}
