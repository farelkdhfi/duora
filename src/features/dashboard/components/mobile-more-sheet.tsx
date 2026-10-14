'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  Loader2,
  Lock,
  LogOut,
  X,
} from 'lucide-react'

import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { PlanBadge } from '@/features/subscription/components/plan-badge'
import logo from '@/assets/logo-white.png'

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
        className="absolute inset-0 bg-black/40 backdrop-blur-[6px]"
      />

      <div className="absolute inset-x-3 bottom-3 max-h-[88dvh] overflow-y-auto rounded-[2rem] border border-white/10 bg-black/80 shadow-[0_-25px_70px_-25px_rgba(0,0,0,0.9)] backdrop-blur-2xl backdrop-saturate-150 animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 z-20 bg-black/80 px-5 pb-3 pt-3 backdrop-blur-xl">
          <div className="mx-auto h-1 w-9 rounded-full bg-white/15" />

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={logo}
                height={20}
                width={20}
                alt="logo"
              />

              <p className="text-[16px] font-semibold uppercase text-white">
                DUORA
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40 transition hover:bg-white/10 hover:text-white/80 active:scale-95"
            >
              <X size={16} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/30">
              Subscription
            </p>

            <span className="text-[9px] text-white/25">
              {locked ? 'Locked' : 'Manage plan'}
            </span>
          </div>

          {/*
            Saat terkunci: tidak bisa diklik (pointer-events-none),
            dan klik via keyboard (Enter/Space) juga diblok lewat onClickCapture.
          */}
          <div
            aria-disabled={locked}
            onClickCapture={
              locked
                ? (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }
                : undefined
            }
            className={
              locked
                ? 'pointer-events-none select-none opacity-40 grayscale'
                : undefined
            }
          >
            <PlanBadge onNavigate={onClose} />
          </div>
        </div>

        <div className="px-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/30">
              Workspace
            </p>

            {locked && (
              <span className="text-[9px] text-white/30">
                Waiting for partner
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04]">
            {moreNavigation.map((item, index) => {
              const active = isActive(item.href)
              const disabled = locked

              if (disabled) {
                return (
                  <div
                    key={item.href}
                    className={`flex items-center px-3.5 py-3.5 opacity-40 ${
                      index !== moreNavigation.length - 1
                        ? 'border-b border-white/[0.06]'
                        : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-white/65">
                        {item.label}
                      </p>
                    </div>

                    <div className="size-1.5 shrink-0 rounded-full bg-white/15" />
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-3.5 py-3.5 transition-all duration-200 active:bg-white/[0.06] ${
                    index !== moreNavigation.length - 1
                      ? 'border-b border-white/[0.06]'
                      : ''
                  } ${
                    active
                      ? 'bg-white/[0.07]'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[12px] font-medium ${
                          active
                            ? 'text-white'
                            : 'text-neutral-400'
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`size-1.5 shrink-0 rounded-full transition ${
                      active
                        ? 'bg-white'
                        : 'bg-white/15 group-hover:bg-white/30'
                    }`}
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {locked && (
          <div className="px-5 pt-4">
            <div className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.04] px-4 py-3.5">
              <p className="text-xs flex items-center gap-3 leading-5 text-white/50">
              <Lock width={20} height={20} />
                Ruang kalian akan terbuka setelah pasangan bergabung menggunakan kode undangan.
              </p>
            </div>
          </div>
        )}

        <div className="px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-[1.2rem] border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[11px] font-medium text-white/40 transition hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-white/[0.08] disabled:hover:bg-white/[0.04] disabled:hover:text-white/40"
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

          <p className="mt-4 text-center text-[9px] tracking-[0.12em] text-white/20">
            GROW TOGETHER WITH DUORA
          </p>
        </div>
      </div>
    </div>
  )
}