'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  CalendarDays,
  CheckCircle2,
  Goal,
  Heart,
  Home,
  Pin,
  Sparkles,
  User2,
} from 'lucide-react'


const navigation = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Goals',
    href: '/goals',
    icon: Goal,
  },
  {
    label: 'Planner',
    href: '/planner',
    icon: CalendarDays,
  },
  {
    label: 'Daily Check-in',
    href: '/check-in',
    icon: CheckCircle2,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User2,
  },
]


export default function Sidebar() {

  const pathname = usePathname()


  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-black/[0.05] bg-white/80 backdrop-blur-xl md:block">

      <div className="flex h-full flex-col">


        {/* ===================================================== */}
        {/* BRAND */}
        {/* ===================================================== */}

        <div className="px-5 pb-7 pt-6">

          <Link
            href="/dashboard"
            className="group flex items-center gap-3"
          >

            {/* Brand */}
            <div>
              <p className="text-[17px] uppercase font-bold tracking-[-0.04em] text-[#111111]">
                duora
              </p>

              <p className="mt-0.5 text-[11px] text-neutral-400">
                Grow together.
              </p>

            </div>

          </Link>

        </div>


        {/* ===================================================== */}
        {/* NAVIGATION */}
        {/* ===================================================== */}

        <nav className="flex-1 px-3">

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300">
            Workspace
          </p>


          <div className="space-y-1">

            {navigation.map((item) => {

              const Icon = item.icon


              const isActive =
                pathname === item.href ||
                (
                  item.href !== '/dashboard' &&
                  pathname?.startsWith(item.href)
                )


              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3
                    rounded-2xl px-3.5 py-3
                    text-[13px] font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-pink-50/70 text-neutral-900 shadow-[0_4px_15px_-8px_rgba(99,102,241,0.25)]'
                        : 'text-neutral-500 hover:bg-black/[0.025] hover:text-neutral-900'
                    }
                  `}
                >

                  {/* Active indicator */}

                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-500 to-pink-500" />
                  )}


                  {/* Icon */}

                  <span
                    className={`
                      flex size-8 shrink-0 items-center justify-center
                      rounded-xl transition
                      ${
                        isActive
                          ? 'bg-white text-black shadow-sm'
                          : 'text-neutral-400 group-hover:text-neutral-700'
                      }
                    `}
                  >

                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2.3 : 1.9}
                    />

                  </span>


                  {/* Label */}

                  <span>
                    {item.label}
                  </span>


                  {/* Active dot */}

                  {isActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-black" />
                  )}

                </Link>
              )

            })}

          </div>

        </nav>


        {/* ===================================================== */}
        {/* RELATIONSHIP CARD */}
        {/* ===================================================== */}

        <div className="px-4 pb-4">

          <div className="relative overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-gradient-to-br from-blue-50/70 via-white to-pink-50/70 p-4">

            {/* Ambient */}

            <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-pink-200/30 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-8 -left-8 size-24 rounded-full bg-blue-200/30 blur-2xl" />


            <div className="relative">

              {/* Header */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex size-7 items-center justify-center rounded-xl bg-white shadow-sm">

                    <Heart
                      size={13}
                      fill="currentColor"
                      className="text-pink-500"
                    />

                  </div>

                  <span className="text-[11px] font-semibold text-neutral-600">
                    Your relationship
                  </span>

                </div>


                <Pin
                  size={13}
                  className="text-black"
                />

              </div>


              {/* Message */}

              <p className="mt-4 text-[12px] leading-5 text-neutral-500">

                Every little moment you share
                becomes part of your story.

              </p>


              {/* Couple avatars */}

              <div className="mt-4 flex items-center">

                <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-[10px] font-semibold text-blue-500">
                  Y
                </div>

                <div className="-ml-2 flex size-7 items-center justify-center rounded-full border-2 border-white bg-pink-100 text-[10px] font-semibold text-pink-500">
                  P
                </div>


                <span className="ml-2 text-[10px] text-neutral-400">
                  Growing together
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================== */}
        {/* FOOTER */}
        {/* ===================================================== */}

        <div className="border-t border-black/[0.04] px-5 py-4">

          <p className="text-[10px] text-neutral-300">
            Duora
          </p>

        </div>

      </div>

    </aside>
  )
}