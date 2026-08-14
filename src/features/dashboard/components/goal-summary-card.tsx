'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import type { GoalWithSavings } from '@/features/goals/types'

interface GoalCardProps {
  goal: GoalWithSavings
}

const categoryLabels: Record<GoalWithSavings['category'], string> = {
  wedding: 'Wedding',
  house: 'House',
  vacation: 'Vacation',
  education: 'Education',
  business: 'Business',
  savings: 'Shared Goal',
  personal: 'Personal',
  other: 'Goal',
}

const categoryAccent: Record<GoalWithSavings['category'], string> = {
  wedding: 'bg-pink-400',
  house: 'bg-blue-400',
  vacation: 'bg-blue-400',
  education: 'bg-blue-400',
  business: 'bg-neutral-400',
  savings: 'bg-pink-400',
  personal: 'bg-pink-400',
  other: 'bg-neutral-400',
}

function formatRupiah(amount: number) {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }

  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  }

  return `Rp ${amount.toLocaleString('id-ID')}`
}

export default function GoalSummaryCard({
  goal,
}: GoalCardProps) {
  const target = goal.target_amount ?? 0

  const totalSaved = goal.savings.reduce(
    (sum, saving) => sum + saving.amount,
    0,
  )

  const progress =
    target > 0
      ? Math.min(100, Math.round((totalSaved / target) * 100))
      : 0

  const accent = categoryAccent[goal.category]

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="
        group block rounded-[2rem]
        border border-black/[0.06]
        bg-white p-3
        shadow-[0_20px_60px_rgba(0,0,0,0.05)]
        transition hover:-translate-y-0.5
      "
    >
      <div className="
        relative overflow-hidden
        rounded-[1.6rem]
        bg-[#f8f8f7]
        p-5
      ">

        {/* Ambient */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-pink-500/[0.05] blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-44 rounded-full bg-blue-500/[0.04] blur-[70px]" />

        <div className="relative">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`size-1.5 rounded-full ${accent}`} />
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                  {categoryLabels[goal.category]}
                </p>
              </div>

              <h3 className="mt-3 truncate text-lg font-semibold tracking-[-0.04em] text-neutral-900">
                {goal.title}
              </h3>
            </div>

            <div className="
              flex size-9 shrink-0 items-center justify-center
              rounded-full bg-white shadow-sm
              text-neutral-400 transition
              group-hover:bg-black group-hover:text-white
            ">
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Progress */}
          <div className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                  Saved
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-neutral-900">
                  {formatRupiah(totalSaved)}
                </p>
              </div>

              <p className="text-lg font-semibold tracking-[-0.04em] text-neutral-700">
                {progress}%
              </p>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className="h-full rounded-full bg-black transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400">
              <span>{formatRupiah(target)}</span>
              <span>Shared goal</span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}