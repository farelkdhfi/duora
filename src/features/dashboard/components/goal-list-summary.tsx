'use client'

import { Target } from 'lucide-react'

import { useGoals } from '@/features/goals/queries'
import GoalSummaryCard from './goal-summary-card'


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
  } = useGoals(relationshipId)


  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)]">

        <div className="animate-pulse">

          <div className="flex items-center justify-between">

            <div className="space-y-2">

              <div className="h-3 w-20 rounded-full bg-neutral-100" />

              <div className="h-5 w-32 rounded-lg bg-neutral-100" />

            </div>


            <div className="size-9 rounded-xl bg-neutral-100" />

          </div>


          <div className="mt-7 space-y-3">

            <div className="h-3 w-full rounded-full bg-neutral-100" />

            <div className="h-3 w-3/4 rounded-full bg-neutral-100" />

          </div>

        </div>

      </div>
    )
  }


  /* ========================================================= */
  /* ERROR */
  /* ========================================================= */

  if (error) {
    return (
      <div className="rounded-[1.75rem] border border-rose-100 bg-rose-50/50 p-6">

        <div className="flex items-center gap-3">

          <div className="flex size-9 items-center justify-center rounded-xl bg-white">

            <Target
              size={16}
              className="text-rose-400"
            />

          </div>


          <div>

            <p className="text-sm font-medium text-rose-600">
              Couldn't load goals
            </p>

            <p className="mt-0.5 text-xs text-rose-400">
              {error.message || 'Something went wrong.'}
            </p>

          </div>

        </div>

      </div>
    )
  }


  /* ========================================================= */
  /* EMPTY */
  /* ========================================================= */

  if (!goals?.length) {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)]">

        {/* Ambient */}

        <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-12 -left-12 size-32 rounded-full bg-pink-100/40 blur-3xl" />


        <div className="relative">

          <div className="flex size-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-blue-50 to-pink-50">

            <Target
              size={18}
              className="text-blue-500"
              strokeWidth={1.8}
            />

          </div>


          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
            Shared goals
          </p>


          <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
            Nothing here yet.
          </h3>


          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-400">
            Set something meaningful to work
            toward together.
          </p>

        </div>

      </div>
    )
  }


  /* ========================================================= */
  /* GOALS */
  /* ========================================================= */

  return (
    <div className="grid gap-4">

      {goals.slice(0, 2).map((goal) => (
        <GoalSummaryCard
          key={goal.id}
          goal={goal}
        />
      ))}

    </div>
  )
}