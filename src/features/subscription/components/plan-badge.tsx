'use client'

import Link from 'next/link'
import { Crown, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { useMySubscription } from '../queries'
import {
  isPremium,
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

  const premium = isPremium(subscription ?? null)
  const trial = isOnTrial(subscription ?? null)
  const nearingExpiry = isNearingExpiry(subscription ?? null)
  const daysLeft = getDaysUntilExpiry(subscription ?? null)

  if (premium && nearingExpiry) {
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
              {trial ? 'Trial' : 'Premium'}
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

  if (premium) {
    return (
      <Link
        href="/subscription"
        onClick={onNavigate}
        className={`group flex w-full items-center gap-3.5 rounded-[1.25rem] border px-3.5 py-3.5 transition-all duration-200 active:bg-black/[0.04] ${
          trial
            ? 'border-pink-200/70 bg-pink-50/50'
            : 'border-black/[0.07] bg-linear-to-tl from-pink-100 via-white to-blue-100'
        }`}
      >
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
            trial
              ? 'bg-pink-100/80 text-pink-500'
              : 'bg-white text-neutral-800'
          }`}
        >
          {trial ? (
            <Sparkles size={17} strokeWidth={1.7} />
          ) : (
            <Crown size={17} strokeWidth={1.7} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className={`text-[12px] font-medium ${
                trial ? 'text-[#171717]' : 'text-neutral-800'
              }`}
            >
              Duora+
            </p>

            <span
              className={`size-1 rounded-full ${
                trial ? 'bg-pink-400' : 'bg-pink-300'
              }`}
            />
          </div>

          <p
            className={`mt-0.5 truncate text-[10px] ${
              trial ? 'text-pink-500/70' : 'text-neutral-600'
            }`}
          >
            {trial ? 'Trial active' : 'Premium active'}
          </p>
        </div>

        <div
          className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
            trial
              ? 'bg-pink-100/80 text-pink-500'
              : 'bg-white text-neutral-800'
          } transition-transform group-active:translate-x-0.5`}
        >
          <ArrowUpRight size={12} strokeWidth={1.8} />
        </div>
      </Link>
    )
  }

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