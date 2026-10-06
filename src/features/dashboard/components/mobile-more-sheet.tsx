'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  Loader2,
  LogOut,
  X,
} from 'lucide-react'

import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { PlanBadge } from '@/features/subscription/components/plan-badge'
import logoImg from '@/assets/logo.png'

interface MobileMoreSheetProps {
  open: boolean
  onClose: () => void
}

const moreNavigation = [
  {
    label: 'Notes',
    description: 'Keep little things worth remembering',
    href: '/notes',
  },
  {
    label: 'Check-in',
    description: 'Share how you feel today',
    href: '/check-in',
  },
  {
    label: 'Debates',
    description: 'Talk things through together',
    href: '/debates',
  },
  {
    label: 'Q&A',
    description: 'Discover more about each other',
    href: '/qna',
  },
  {
    label: 'Countdown',
    description: 'Count down to your next moment',
    href: '/countdown',
  },
  {
    label: 'Wrapped',
    description: 'Look back at your relationship',
    href: '/wrapped',
  },
  {
    label: 'Activities',
    description: 'Everything that happened recently',
    href: '/activities',
  },
  {
    label: 'Profile',
    description: 'Your account and relationship',
    href: '/profile',
  },
]

export default function MobileMoreSheet({
  open,
  onClose,
}: MobileMoreSheetProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      const supabase = createClient()
      await supabase.auth.signOut()

      onClose()

      router.push('/login')
      router.refresh()
    } catch (error) {
      setIsLoggingOut(false)
    }
  }

  function isActive(href: string) {
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-52 md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/15 backdrop-blur-[6px]"
      />

      <div className="absolute inset-x-3 bottom-3 max-h-[88dvh] overflow-y-auto rounded-[2rem] border border-black/[0.07] bg-white shadow-[0_-25px_70px_-25px_rgba(0,0,0,0.18)] backdrop-blur-2xl backdrop-saturate-150 animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 z-20 bg-white px-5 pb-3 pt-3 backdrop-blur-xl">
          <div className="mx-auto h-1 w-9 rounded-full bg-black/10" />

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-x-1">
              <Image
                src={logoImg}
                height={20}
                width={20}
                alt="logo"
              />

              <p className="text-[16px] font-bold uppercase text-[#111111]">
                DUORA
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-full border border-black/[0.07] bg-black/[0.025] text-black/40 transition hover:bg-black/[0.06] hover:text-black/80 active:scale-95"
            >
              <X size={16} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-black/30">
              Subscription
            </p>

            <span className="text-[9px] text-black/25">
              Manage plan
            </span>
          </div>

          <PlanBadge onNavigate={onClose} />
        </div>

        <div className="px-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-black/30">
              Workspace
            </p>

            {locked && (
              <span className="text-[9px] text-black/30">
                Waiting for partner
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white/65 shadow-sm">
            {moreNavigation.map((item, index) => {
              const active = isActive(item.href)
              const disabled = locked

              if (disabled) {
                return (
                  <div
                    key={item.href}
                    className={`flex items-center px-3.5 py-3.5 opacity-40 ${
                      index !== moreNavigation.length - 1
                        ? 'border-b border-black/[0.05]'
                        : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-black/65">
                        {item.label}
                      </p>
                    </div>

                    <div className="size-1.5 shrink-0 rounded-full bg-black/15" />
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-3.5 py-3.5 transition-all duration-200 active:bg-black/[0.04] ${
                    index !== moreNavigation.length - 1
                      ? 'border-b border-black/[0.05]'
                      : ''
                  } ${
                    active
                      ? 'bg-black/[0.035]'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[12px] font-medium ${
                          active
                            ? 'text-neutral-800'
                            : 'text-neutral-500'
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`size-1.5 shrink-0 rounded-full transition ${
                      active
                        ? 'bg-neutral-800'
                        : 'bg-black/10 group-hover:bg-black/20'
                    }`}
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {locked && (
          <div className="px-5 pt-4">
            <div className="rounded-[1.25rem] border border-black/[0.05] bg-white/60 px-4 py-3.5 shadow-sm">
              <p className="text-[10px] leading-5 text-black/35">
                Your workspace will unlock once your partner joins with the invite code.
              </p>
            </div>
          </div>
        )}

        <div className="px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-[1.2rem] border border-black/[0.06] bg-white/60 px-4 py-3 text-[11px] font-medium text-black/40 shadow-sm transition hover:border-red-400/20 hover:bg-red-50 hover:text-red-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-black/[0.06] disabled:hover:bg-white/60 disabled:hover:text-black/40"
          >
            {isLoggingOut ? (
              <>
                <Loader2
                  size={14}
                  strokeWidth={1.7}
                  className="animate-spin"
                />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={14} strokeWidth={1.7} />
                <span>Log out</span>
              </>
            )}
          </button>

          <p className="mt-4 text-center text-[9px] tracking-[0.12em] text-black/20">
            GROW TOGETHER WITH DUORA
          </p>
        </div>
      </div>
    </div>
  )
}