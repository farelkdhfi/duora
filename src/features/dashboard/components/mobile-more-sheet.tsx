'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  Activity,
  BarChart3,
  Clock3,
  FileText,
  Goal,
  Heart,
  Loader2,
  LogOut,
  User2,
  X,
} from 'lucide-react'

import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { PlanBadge } from '@/features/subscription/components/plan-badge'
import logoImg from '@/assets/duora-logo3.png'

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
    label: 'Check-in',
    description: 'Share how you feel today',
    href: '/check-in',
    icon: Heart,
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
        className="absolute inset-0 bg-black/30 backdrop-blur-[6px]"
      />

      <div className="absolute inset-x-3 bottom-3 max-h-[88dvh] overflow-y-auto rounded-[2rem] border border-white/[0.12] bg-[#101010]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_-25px_70px_-25px_rgba(0,0,0,0.75)] backdrop-blur-2xl backdrop-saturate-150 animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 z-20 bg-transparent px-5 pb-3 pt-3">
          <div className="mx-auto h-1 w-9 rounded-full bg-white/15" />

          <div className="mt-5 flex items-center justify-between">
            <div className='flex items-center gap-x-1'>
              <Image src={logoImg} height={20} width={20} alt='logo' className='invert-100'/>
              <p className="text-[16px] font-bold uppercase text-white">
                DUORA
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/45 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              <X size={16} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center justify-between rounded-[1.25rem] border border-white/[0.08] bg-white/[0.045] px-4 py-3 backdrop-blur-md">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/25">
                Current plan
              </p>

              <div className="mt-3">
                <PlanBadge />
              </div>
            </div>

            <div className="size-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        <div className="px-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/25">
              Workspace
            </p>

            {locked && (
              <span className="text-[9px] text-white/25">
                Waiting for partner
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] backdrop-blur-md">
            {moreNavigation.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.href)
              const disabled = locked

              if (disabled) {
                return (
                  <div
                    key={item.href}
                    className={`flex items-center gap-3.5 px-3.5 py-3.5 opacity-35 ${index !== moreNavigation.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/50">
                      <Icon size={17} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-white/70">
                        {item.label}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-white/30">
                        {item.description}
                      </p>
                    </div>

                    <div className="size-1.5 shrink-0 rounded-full bg-white/20" />
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3.5 px-3.5 py-3.5 transition-all duration-200 active:bg-white/[0.08] ${index !== moreNavigation.length - 1 ? 'border-b border-white/[0.06]' : ''} ${active ? 'bg-white/[0.07]' : 'hover:bg-white/[0.045]'}`}
                >
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${active ? 'bg-white text-black' : 'bg-white/[0.06] text-white/45 group-hover:bg-white/10 group-hover:text-white'}`}
                  >
                    <Icon size={17} strokeWidth={active ? 2 : 1.7} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[12px] font-medium ${active ? 'text-white' : 'text-white/75'}`}
                      >
                        {item.label}
                      </p>

                      {active && (
                        <span className="size-1 rounded-full bg-white" />
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-[10px] text-white/30">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`size-1.5 shrink-0 rounded-full transition ${active ? 'bg-white' : 'bg-white/10 group-hover:bg-white/25'}`}
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {locked && (
          <div className="px-5 pt-4">
            <div className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.025] px-4 py-3.5 backdrop-blur-md">
              <p className="text-[10px] leading-5 text-white/30">
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
            className="flex w-full items-center justify-center gap-2 rounded-[1.2rem] border border-white/[0.07] bg-white/[0.035] px-4 py-3 text-[11px] font-medium text-white/35 transition hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-white/[0.07] disabled:hover:bg-white/[0.035] disabled:hover:text-white/35"
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={14} strokeWidth={1.7} className="animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={14} strokeWidth={1.7} />
                <span>Log out</span>
              </>
            )}
          </button>

          <p className="mt-4 text-center text-[9px] tracking-[0.12em] text-white/15">
            GROW TOGETHER WITH DUORA
          </p>
        </div>
      </div>
    </div>
  )
}