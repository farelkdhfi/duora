'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  CalendarDays,
  Home,
  MoreHorizontal,
  Notebook,
  NotebookPen,
  PiggyBank,
  Target,
} from 'lucide-react'

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
    icon: PiggyBank,
  },
]

function AiTypographyIcon() {
  return (
    <span
      className="flex flex-col items-center justify-center leading-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[19px] w-[19px]"
      >
        <path
          d="M12 1.5C12.8 7.2 16.8 11.2 22.5 12C16.8 12.8 12.8 16.8 12 22.5C11.2 16.8 7.2 12.8 1.5 12C7.2 11.2 11.2 7.2 12 1.5Z"
          fill="currentColor"
        />
      </svg>

    </span>
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

  const debateActive =
    pathname === '/debates' || pathname?.startsWith('/debates/')

  return (
    <nav className="fixed inset-x-0 bottom-0 z-51 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="relative mx-auto h-[4.75rem] max-w-md rounded-[1.75rem] border border-black/[0.06] bg-white/95 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.22)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="absolute inset-x-0 bottom-0 h-full overflow-hidden rounded-[1.75rem]">
          <div className="absolute inset-0 bg-stone-50/30" />
          <div className="absolute left-1/2 top-0 h-[4rem] w-[5.75rem] -translate-x-1/2 rounded-b-[3rem] bg-black/[0.025]" />
          <div className="absolute inset-x-6 top-0 h-px bg-black/[0.06]" />
        </div>

        <div className="relative z-10 flex h-full items-center px-2">
          <div className="flex min-w-0 flex-1 items-center">
            {navigation.slice(0, 2).map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition-all duration-200 active:scale-95 ${
                    active
                      ? 'text-black'
                      : 'text-black/35 hover:text-black/65'
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.15 : 1.65}
                  />

                  <span
                    className={`text-[10px] leading-none ${
                      active
                        ? 'font-medium text-black'
                        : 'font-normal text-black/40'
                    }`}
                  >
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
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition-all duration-200 active:scale-95 ${
                    active
                      ? 'text-black'
                      : 'text-black/35 hover:text-black/65'
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.15 : 1.65}
                  />

                  <span
                    className={`text-[10px] leading-none ${
                      active
                        ? 'font-medium text-black'
                        : 'font-normal text-black/40'
                    }`}
                  >
                  </span>
                </Link>
              )
            })}

            <button
              type="button"
              onClick={onMore}
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 text-black/35 transition-all duration-200 hover:text-black/65 active:scale-95"
            >
              <MoreHorizontal size={21} strokeWidth={1.65} />
            </button>
          </div>
        </div>

        <Link
          href="/debates"
          aria-label="Duora AI Debates"
          className={`absolute left-1/2 top-1/2 z-20 flex size-[3rem] -translate-x-1/2 -translate-y-[calc(50%+1.55rem)] items-center justify-center rounded-full shadow-[0_12px_30px_-10px_rgba(0,0,0,0.28)] ring-[0.55rem] transition-all duration-200 active:scale-95 ${
            debateActive
              ? ' bg-primary text-white ring-white'
              : ' bg-neutral-100 text-black ring-white'
          }`}
        >
          <AiTypographyIcon />
        </Link>
      </div>
    </nav>
  )
}