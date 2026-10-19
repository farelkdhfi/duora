'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import {
  Heart,
  Loader2,
  Lock,
  LogOut,
  Pin,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { PlanBadge } from '@/features/subscription/components/plan-badge'
import { LanguageSwitcher } from '@/components/language-switcher'
import { sidebarNavigation } from './nav-config'
import Image from 'next/image'

import logoImage from '@/assets/DUONEAR-logo3.png'


interface SidebarNavProps {
  onNavigate?: () => void
}


export default function SidebarNav({ onNavigate }: SidebarNavProps) {

  const t = useTranslations('nav')
  const tc = useTranslations('common')

  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { data, isLoading } = useMyRelationshipDetails()

  const memberCount = data?.members?.length ?? 0
  const locked = isLoading || memberCount < 2

  async function handleLogout() {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      setIsLoggingOut(false)
    }
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
              <Image src={logoImage} width={20} height={20} alt='DUONEAR' />
              <p className="text-[17px] uppercase font-bold tracking-[-0.04em] text-secondary">
                DUONEAR
              </p>
            </div>

            <p className="mt-0.5 text-[11px] text-description">
              {t('brandTagline')}
            </p>

          </div>

        </Link>

        {/* PLAN BADGE */}
        <div className="mt-3">
          <PlanBadge />
        </div>

      </div>


      {/* ===================================================== */}
      {/* NAVIGATION */}
      {/* ===================================================== */}

      <nav className="flex-1 px-3">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-description/60">
          {t('workspace')}
        </p>


        <div className="space-y-1">

          {sidebarNavigation.map((item) => {

            const Icon = item.icon
            const label = t(`items.${item.key}`)


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
                  className="group relative flex cursor-not-allowed items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-medium text-description/60"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl text-description/60">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>

                  <span>{label}</span>

                  <Lock
                    size={12}
                    className="ml-auto text-description/60"
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
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-pink-500/10 text-secondary shadow-[0_4px_15px_-8px_rgba(99,102,241,0.25)]'
                    : 'text-description hover:bg-white/[0.04] hover:text-secondary'
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
                    ${isActive
                      ? 'bg-subprimary text-secondary shadow-sm'
                      : 'text-description group-hover:text-secondary'
                    }
                  `}
                >

                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.3 : 1.9}
                  />

                </span>

                <span>
                  {label}
                </span>

                {isActive && (
                  <span className="ml-auto size-1.5 rounded-full bg-secondary" />
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
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-subprimary/40 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-xl bg-subprimary shadow-sm">
                <Lock size={12} className="text-description" />
              </div>

              <span className="text-[11px] font-semibold text-description">
                {t('waitingForPartner')}
              </span>
            </div>

            <p className="mt-3 text-[12px] leading-5 text-description">
              {t('lockedHint')}
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-blue-500/10 via-subprimary/40 to-pink-500/10 p-4">

            <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-pink-400/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 size-24 rounded-full bg-blue-400/15 blur-2xl" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex size-7 items-center justify-center rounded-xl bg-subprimary shadow-sm">
                    <Heart
                      size={13}
                      fill="currentColor"
                      className="text-pink-500"
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-secondary">
                    {t('yourRelationship')}
                  </span>

                </div>

                <Pin
                  size={13}
                  className="text-secondary"
                />

              </div>

              <p className="mt-4 text-[12px] leading-5 text-description">
                {t('relationshipQuote')}
              </p>

              <div className="mt-4 flex items-center">

                <div className="flex size-7 items-center justify-center rounded-full border-2 border-primary bg-blue-500/20 text-[10px] font-semibold text-blue-400">
                  {t('youInitial')}
                </div>

                <div className="-ml-2 flex size-7 items-center justify-center rounded-full border-2 border-primary bg-pink-500/20 text-[10px] font-semibold text-pink-400">
                  {t('partnerInitial')}
                </div>

                <span className="ml-2 text-[10px] text-description">
                  {t('growingTogether')}
                </span>

              </div>

            </div>

          </div>
        )}

      </div>


      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="border-t border-white/[0.06] px-3 py-3">

        {/* LANGUAGE */}
        <div className="mb-2 flex items-center justify-between px-3.5 py-1">
          <span className="text-[13px] font-medium text-description">
            {tc('language')}
          </span>

          <LanguageSwitcher />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-medium text-description transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-description"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl text-description transition group-hover:text-rose-400">
            {isLoggingOut ? (
              <Loader2 size={17} strokeWidth={1.9} className="animate-spin" />
            ) : (
              <LogOut size={17} strokeWidth={1.9} />
            )}
          </span>

          <span>{isLoggingOut ? t('loggingOut') : t('logout')}</span>
        </button>

        <p className="mt-2 px-3.5 text-[10px] text-description/60">
          {t('footer')}
        </p>

      </div>

    </div>
  )
}