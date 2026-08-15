'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import {
  CalendarDays,
  CheckCircle2,
  Goal,
  Heart,
  Home,
  Lock,
  LogOut,
  Logs,
  NotebookPen,
  Pin,
  User2,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import Image from 'next/image'

import logoImage from '@/assets/duora-logo3.png'


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
    label: 'Activities',
    href: '/activities',
    icon: Logs,
  },
  {
    label: 'Notes',
    href: '/notes',
    icon: NotebookPen,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User2,
  },
]


interface SidebarNavProps {
  onNavigate?: () => void
}


export default function SidebarNav({ onNavigate }: SidebarNavProps) {

  const pathname = usePathname()
  const router = useRouter()

  const { data, isLoading } = useMyRelationshipDetails()

  const memberCount = data?.members?.length ?? 0
  const locked = isLoading || memberCount < 2

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }


  return (
    <div className="flex h-full flex-col">


      {/* ===================================================== */}
      {/* BRAND */}
      {/* ===================================================== */}

      <div className="px-5 pb-7 pt-6">

        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="group flex items-center gap-3"
        >

          <div>
            <div className='flex items-center gap-1'>
              <Image src={logoImage} width={20} height={20} alt='logo' />
            <p className="text-[17px] uppercase font-bold tracking-[-0.04em] text-[#111111]">
              duora
            </p>
            </div>

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
              !locked &&
              (
                pathname === item.href ||
                (
                  item.href !== '/dashboard' &&
                  pathname?.startsWith(item.href)
                )
              )


            if (locked) {
              return (
                <div
                  key={item.href}
                  className="group relative flex cursor-not-allowed items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-medium text-neutral-300"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl text-neutral-300">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>

                  <span>{item.label}</span>

                  <Lock
                    size={12}
                    className="ml-auto text-neutral-300"
                  />
                </div>
              )
            }


            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
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

                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-500 to-pink-500" />
                )}

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

                <span>
                  {item.label}
                </span>

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

      <div className="px-4 py-4">

        {locked ? (
          <div className="relative overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-neutral-50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-xl bg-white shadow-sm">
                <Lock size={12} className="text-neutral-400" />
              </div>

              <span className="text-[11px] font-semibold text-neutral-500">
                Waiting for partner
              </span>
            </div>

            <p className="mt-3 text-[12px] leading-5 text-neutral-400">
              Your space unlocks once your
              partner joins with the invite code.
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-gradient-to-br from-blue-50/70 via-white to-pink-50/70 p-4">

            <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-pink-200/30 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 size-24 rounded-full bg-blue-200/30 blur-2xl" />

            <div className="relative">

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

              <p className="mt-4 text-[12px] leading-5 text-neutral-500">
                Every little moment you share
                becomes part of your story.
              </p>

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
        )}

      </div>


      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="border-t border-black/[0.04] px-3 py-3">

        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-medium text-neutral-500 transition-all duration-200 hover:bg-rose-50/70 hover:text-rose-600"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl text-neutral-400 transition group-hover:text-rose-500">
            <LogOut size={17} strokeWidth={1.9} />
          </span>

          <span>Log out</span>
        </button>

        <p className="mt-2 px-3.5 text-[10px] text-neutral-300">
          Grow together with DUORA
        </p>

      </div>

    </div>
  )
}