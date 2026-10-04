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
        className="group flex w-full items-center gap-3.5 rounded-[1.25rem] border border-amber-200/70 bg-amber-50/60 px-3.5 py-3.5 transition-all duration-200 active:bg-amber-50"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100/80 text-amber-500">
          <AlertTriangle size={17} strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-amber-800">
              {trial ? 'Trial' : planType === 'pro' ? 'Pro' : 'Plus'}
            </p>

            <span className="size-1 rounded-full bg-amber-400" />
          </div>

          <p className="mt-0.5 truncate text-[10px] text-amber-600/70">
            {daysLeft === 0 ? 'Berakhir hari ini' : `${daysLeft} hari lagi`}
          </p>
        </div>

        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100/70 text-amber-500 transition-transform group-active:translate-x-0.5">
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
        className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[1.25rem] border border-pink-200/70 bg-pink-50/50 px-3.5 py-3.5 transition-all duration-300 active:bg-pink-50"
      >
        <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl bg-pink-100/80 text-pink-500">
          <Sparkles size={17} strokeWidth={1.7} />
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-[#171717]">
              Trial
            </p>

            <span className="size-1 rounded-full bg-pink-400" />
          </div>

          <p className="mt-0.5 truncate text-[10px] text-pink-500/70">
            Trial active
          </p>
        </div>

        <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-pink-100/80 text-pink-500 transition-transform duration-200 group-active:translate-x-0.5">
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
        className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[#171717] px-3.5 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition-all duration-300 active:bg-[#1d1d1d]"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-pink-400/15 blur-[55px]" />

        <div className="pointer-events-none absolute -bottom-20 -left-16 size-44 rounded-full bg-blue-400/10 blur-[55px]" />

        <div className="pointer-events-none absolute right-[25%] top-[-30px] size-24 rounded-full bg-pink-300/[0.06] blur-[35px]" />

        <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-pink-100 shadow-inner">
          <Crown size={17} strokeWidth={1.7} />
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-white/90">
              Duora+
            </p>

            <span className="size-1 rounded-full bg-pink-300" />
          </div>

          <p className="mt-0.5 truncate text-[10px] text-white/40">
            Pro active
          </p>
        </div>

        <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-white/70 transition-transform duration-200 group-active:translate-x-0.5">
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
        className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[1.25rem] border border-pink-200/70 bg-pink-50/50 px-3.5 py-3.5 transition-all duration-300 active:bg-pink-50"
      >
        <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl bg-pink-100/80 text-pink-500">
          <Sparkles size={17} strokeWidth={1.7} />
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-[#171717]">
              Duora+
            </p>

            <span className="size-1 rounded-full bg-pink-400" />
          </div>

          <p className="mt-0.5 truncate text-[10px] text-pink-500/70">
            Plus active
          </p>
        </div>

        <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-pink-100/80 text-pink-500 transition-transform duration-200 group-active:translate-x-0.5">
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
      className="group flex w-full items-center gap-3.5 rounded-[1.25rem] border border-black/[0.06] bg-white/65 px-3.5 py-3.5 transition-all duration-200 active:bg-black/[0.04]"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.035] text-black/45">
        <Sparkles size={17} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[12px] font-medium text-black/70">
            Free
          </p>

          <span className="size-1 rounded-full bg-black/15" />
        </div>

        <p className="mt-0.5 truncate text-[10px] text-black/35">
          Upgrade to unlock more
        </p>
      </div>

      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white transition-transform group-active:translate-x-0.5">
        <ArrowUpRight size={12} strokeWidth={1.8} />
      </div>
    </Link>
  )
}