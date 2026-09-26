'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  Activity,
  BarChart3,
  Clock3,
  FileText,
  Goal,
  LogOut,
  User2,
  X,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { PlanBadge } from '@/features/subscription/components/plan-badge'

interface MobileMoreSheetProps {
  open: boolean
  onClose: () => void
}

const moreNavigation = [
  {
    label: 'Goals',
    description: 'Things you want to achieve together',
    href: '/goals',
    icon: Goal,
  },
  {
    label: 'Debates',
    description: 'Talk things through together',
    href: '/debates',
    icon: BarChart3,
  },
  {
    label: 'Countdown',
    description: 'Count down to your next moment',
    href: '/countdown',
    icon: Clock3,
  },
  {
    label: 'Wrapped',
    description: 'Look back at your relationship',
    href: '/wrapped',
    icon: FileText,
  },
  {
    label: 'Activities',
    description: 'Everything that happened recently',
    href: '/activities',
    icon: Activity,
  },
  {
    label: 'Profile',
    description: 'Your account and relationship',
    href: '/profile',
    icon: User2,
  },
]

export default function MobileMoreSheet({ open, onClose }: MobileMoreSheetProps) {
  const pathname = usePathname()
  const router = useRouter()

  const { data, isLoading } = useMyRelationshipDetails()

  const memberCount = data?.members?.length ?? 0
  const locked = isLoading || memberCount < 2

  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  async function handleLogout() {
    const supabase = createClient()

    await supabase.auth.signOut()

    onClose()

    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-52 md:hidden">
      {/* BACKDROP */}
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-black/25 backdrop-blur-[3px]" />

      {/* SHEET */}
      <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[2rem] border-t border-black/[0.05] bg-[#fafafa] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-300">
        {/* HANDLE */}
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-neutral-200" />
        </div>

        {/* HEADER */}
        <div className="flex items-start justify-between px-5 pb-4 pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Workspace
            </p>

            <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.04em] text-neutral-950">
              More
            </h2>
          </div>

          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm transition hover:text-neutral-800 active:scale-95">
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        {/* PLAN */}
        <div className="px-5 pb-4">
          <div className="rounded-[1.35rem] border border-black/[0.05] bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-300">
                  Your plan
                </p>

                <div className="mt-1">
                  <PlanBadge />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="px-4">
          <div className="grid grid-cols-2 gap-2">
            {moreNavigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              const disabled = locked

              if (disabled) {
                return (
                  <div key={item.href} className="relative rounded-[1.35rem] border border-black/[0.04] bg-white/60 p-3.5 opacity-45">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                      <Icon size={17} strokeWidth={1.8} />
                    </div>

                    <p className="mt-3 text-[13px] font-semibold text-neutral-700">
                      {item.label}
                    </p>

                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group relative rounded-[1.35rem] border p-3.5 transition-all duration-200 active:scale-[0.98] ${active ? 'border-black/[0.06] bg-white shadow-[0_8px_25px_-15px_rgba(0,0,0,0.2)]' : 'border-black/[0.04] bg-white/70 hover:bg-white'}`}
                >
                  <div className={`flex size-9 items-center justify-center rounded-xl transition ${active ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-800'}`}>
                    <Icon size={17} strokeWidth={active ? 2.1 : 1.8} />
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-[13px] font-semibold ${active ? 'text-neutral-950' : 'text-neutral-700'}`}>
                        {item.label}
                      </p>

                      {active && (
                        <span className="size-1 rounded-full bg-neutral-950" />
                      )}
                    </div>

                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* LOCKED MESSAGE */}
        {locked && (
          <div className="px-5 pt-4">
            <div className="rounded-[1.35rem] border border-black/[0.04] bg-neutral-100/70 px-4 py-3">
              <p className="text-[11px] font-medium leading-5 text-neutral-400">
                Your workspace will unlock once your partner joins with the invite code.
              </p>
            </div>
          </div>
        )}

        {/* LOGOUT */}
        <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] border border-rose-100 bg-rose-50/60 px-4 py-3 text-[12px] font-medium text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 active:scale-[0.99]"
          >
            <LogOut size={15} strokeWidth={1.8} />
            <span>Log out</span>
          </button>

          <p className="mt-3 text-center text-[9px] tracking-wide text-neutral-300">
            Grow together with DUORA
          </p>
        </div>
      </div>
    </div>
  )
}