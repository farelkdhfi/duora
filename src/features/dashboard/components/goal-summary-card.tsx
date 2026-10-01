'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import type { GoalWithSavings } from '@/features/goals/types'

interface GoalCardProps {
  goal: GoalWithSavings
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

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="group block py-4 first:pt-0 last:pb-0"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="min-w-0 truncate text-sm font-medium tracking-[-0.035em] text-neutral-800">
          {goal.title}
        </h3>

        <ArrowUpRight
          size={14}
          strokeWidth={1.7}
          className="shrink-0 text-neutral-300 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700"
        />
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold tracking-[-0.035em] text-neutral-900">
          {formatRupiah(totalSaved)}
        </p>

        <p className="text-[10px] text-neutral-400">
          of {formatRupiah(target)}
        </p>
      </div>

      <div className="relative mt-3 h-5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-200 to-pink-200 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Link>
  )
}