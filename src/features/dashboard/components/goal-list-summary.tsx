'use client'

import { Target } from 'lucide-react'

import GoalSummaryCard from './goal-summary-card'
import { useGoalsWithSavingsSummary } from '@/features/savings/queries'

interface GoalListProps {
  relationshipId: string
}

export default function GoalListSummary({
  relationshipId,
}: GoalListProps) {
  const {
    data: goals,
    isLoading,
    error,
  } = useGoalsWithSavingsSummary(relationshipId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]"
          >
            <div className="animate-pulse rounded-[1.6rem] bg-[#f8f8f7] p-5">
              <div className="flex justify-between">
                <div>
                  <div className="h-2 w-20 rounded-full bg-neutral-200" />
                  <div className="mt-3 h-5 w-40 rounded-lg bg-neutral-200" />
                </div>
                <div className="size-9 rounded-full bg-white" />
              </div>

              <div className="mt-8">
                <div className="h-3 w-24 rounded-full bg-neutral-200" />
                <div className="mt-3 h-7 w-32 rounded-lg bg-neutral-200" />
                <div className="mt-5 h-1.5 rounded-full bg-neutral-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">
        <div className="rounded-[1.6rem] bg-[#f8f8f7] p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
              <Target size={16} className="text-neutral-500" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Error
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-900">
                Couldn't load goals
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!goals?.length) {
    return (
      <div className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-[#f8f8f7] p-10 text-center">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/[0.05] blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-500/[0.06] blur-[80px]" />

          <div className="relative mx-auto flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
            <Target size={22} className="text-neutral-400" />
          </div>

          <p className="relative mt-5 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            Shared goals
          </p>

          <h3 className="relative mt-2 text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">
            Nothing here yet.
          </h3>

          <p className="relative mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-neutral-400">
            Create your first shared goal and start building it together.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.slice(0, 2).map((goal) => (
        <GoalSummaryCard
          key={goal.id}
          goal={goal}
        />
      ))}
    </div>
  )
}