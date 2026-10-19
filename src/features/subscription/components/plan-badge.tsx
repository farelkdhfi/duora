'use client'

import Link from 'next/link'
import { Crown, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { useMySubscription } from '../queries'
import {
  getActivePlanType,
  isOnTrial,
  isNearingExpiry,
  getDaysUntilExpiry,
} from '../utils'

interface PlanBadgeProps {
  onNavigate?: () => void
}

export function PlanBadge({ onNavigate }: PlanBadgeProps) {
  const { data: subscription, isLoading } = useMySubscription()

  if (isLoading) return null

  const planType = getActivePlanType(subscription ?? null)
  const trial = isOnTrial(subscription ?? null)
  const nearingExpiry = isNearingExpiry(subscription ?? null)
  const daysLeft = getDaysUntilExpiry(subscription ?? null)

  const isPaid = planType === 'plus' || planType === 'pro'

  // ============================================================
  // TRIAL / PLUS / PRO - NEARING EXPIRY
  // ============================================================

  if ((trial || isPaid) && nearingExpiry) {
    return (
      <Link
        href="/subscription"
        onClick={onNavigate}
        className="group flex w-full items-center gap-3.5 rounded-[1.25rem] border border-amber-500/20 bg-amber-500/10 px-3.5 py-3.5 transition-all duration-200 active:bg-amber-500/15"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
          <AlertTriangle size={17} strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-amber-300">
              {trial ? 'Trial' : planType === 'pro' ? 'Pro' : 'Plus'}
            </p>

            <span className="size-1 rounded-full bg-amber-400" />
          </div>

          <p className="mt-0.5 truncate text-[10px] text-amber-400/70">
            {daysLeft === 0 ? 'Berakhir hari ini' : `${daysLeft} hari lagi`}
          </p>
        </div>

        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 transition-transform group-active:translate-x-0.5">
          <ArrowUpRight size={12} strokeWidth={1.8} />
        </div>
      </Link>
    )
  }

  // ============================================================
  // TRIAL
  // ============================================================

  if (trial) {
    return (
      <Link
        href="/subscription"
        onClick={onNavigate}
        className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[1.25rem] border border-pink-500/20 bg-pink-500/10 px-3.5 py-3.5 transition-all duration-300 active:bg-pink-500/15"
      >
        <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
          <Sparkles size={17} strokeWidth={1.7} />
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-secondary">
              Trial
            </p>

            <span className="size-1 rounded-full bg-pink-400" />
          </div>

          <p className="mt-0.5 truncate text-[10px] text-pink-400/70">
            Trial active
          </p>
        </div>

        <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-pink-500/15 text-pink-400 transition-transform duration-200 group-active:translate-x-0.5">
          <ArrowUpRight size={12} strokeWidth={1.8} />
        </div>
      </Link>
    )
  }

  // ============================================================
  // PRO
  // ============================================================

  if (planType === 'pro') {
    return (
      <Link
        href="/subscription"
        onClick={onNavigate}
        className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-subprimary px-3.5 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition-all duration-300 active:bg-primary"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-pink-400/15 blur-[55px]" />

        <div className="pointer-events-none absolute -bottom-20 -left-16 size-44 rounded-full bg-blue-400/10 blur-[55px]" />

        <div className="pointer-events-none absolute right-[25%] top-[-30px] size-24 rounded-full bg-pink-300/[0.06] blur-[35px]" />

        <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-pink-100 shadow-inner">
          <Crown size={17} strokeWidth={1.7} />
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-secondary">
              DUONEAR+
            </p>

            <span className="size-1 rounded-full bg-pink-300" />
          </div>

          <p className="mt-0.5 truncate text-[10px] text-description">
            Pro active
          </p>
        </div>

        <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-secondary transition-transform duration-200 group-active:translate-x-0.5">
          <ArrowUpRight size={12} strokeWidth={1.8} />
        </div>
      </Link>
    )
  }

  // ============================================================
  // PLUS
  // ============================================================

  if (planType === 'plus') {
    return (
      <Link
        href="/subscription"
        onClick={onNavigate}
        className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[1.25rem] border border-pink-500/20 bg-pink-500/10 px-3.5 py-3.5 transition-all duration-300 active:bg-pink-500/15"
      >
        <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
          <Sparkles size={17} strokeWidth={1.7} />
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-secondary">
              DUONEAR+
            </p>

            <span className="size-1 rounded-full bg-pink-400" />
          </div>

          <p className="mt-0.5 truncate text-[10px] text-pink-400/70">
            Plus active
          </p>
        </div>

        <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-pink-500/15 text-pink-400 transition-transform duration-200 group-active:translate-x-0.5">
          <ArrowUpRight size={12} strokeWidth={1.8} />
        </div>
      </Link>
    )
  }

  // ============================================================
  // FREE + UPGRADE
  // ============================================================

  return (
    <Link
      href="/subscription"
      onClick={onNavigate}
      className="group flex w-full items-center gap-3.5 rounded-[1.25rem] border border-white/[0.08] bg-subprimary/40 px-3.5 py-3.5 transition-all duration-200 active:bg-white/[0.04]"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-description">
        <Sparkles size={17} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[12px] font-medium text-secondary">
            Free
          </p>

          <span className="size-1 rounded-full bg-white/20" />
        </div>

        <p className="mt-0.5 truncate text-[10px] text-description">
          Upgrade to unlock more
        </p>
      </div>

      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-subprimary text-secondary transition-transform group-active:translate-x-0.5">
        <ArrowUpRight size={12} strokeWidth={1.8} />
      </div>
    </Link>
  )
}