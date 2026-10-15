'use client'

import { useState } from 'react'
import { Plus, Target } from 'lucide-react'

import GoalCard from './goal-card'
import TotalSavingsCard, { TotalSavingsCardSkeleton } from './total-savings-card'

import { useGoalsWithSavingsSummary } from '@/features/savings/queries'

interface GoalListProps {
  relationshipId: string
  onCreate: () => void
}

type GoalFilter =
  | 'all'
  | 'newest'
  | 'under_1m'
  | 'over_1m'

function getGoalSavings(goal: any) {
  return (
    goal.savings?.reduce(
      (total: number, saving: any) =>
        total + Number(saving.amount ?? 0),
      0,
    ) ?? 0
  )
}

export default function GoalList({
  relationshipId,
  onCreate,
}: GoalListProps) {
  const {
    data: goals,
    isLoading,
    error,
  } = useGoalsWithSavingsSummary(relationshipId)

  const [activeFilter, setActiveFilter] =
    useState<GoalFilter>('all')

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TotalSavingsCardSkeleton />

        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]"
            >
              <div className="animate-pulse rounded-[1.7rem] bg-[#f8f8f7] p-5 md:p-7">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="h-2 w-20 rounded-full bg-neutral-200" />
                    <div className="h-5 w-40 rounded-lg bg-neutral-200" />
                  </div>

                  <div className="size-10 rounded-full bg-white" />
                </div>

                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full rounded-full bg-neutral-200" />
                  <div className="h-3 w-3/4 rounded-full bg-neutral-200" />
                </div>

                <div className="mt-8">
                  <div className="h-3 w-24 rounded-full bg-neutral-200" />
                  <div className="mt-3 h-7 w-32 rounded-lg bg-neutral-200" />
                  <div className="mt-5 h-1.5 w-full rounded-full bg-neutral-200" />
                </div>

                <div className="mt-6 border-t border-black/[0.05] pt-5">
                  <div className="h-3 w-28 rounded-full bg-neutral-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ========================================================= */
  /* ERROR */
  /* ========================================================= */

  if (error) {
    return (
      <div className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">
        <div className="rounded-[1.7rem] bg-[#f8f8f7] p-5 md:p-7">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <Target
                size={16}
                strokeWidth={2}
                className="text-neutral-500"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Error
              </p>

              <p className="mt-1 text-[13px] font-semibold text-neutral-900">
                Couldn't load your goals
              </p>

              <p className="mt-1 text-[12px] leading-relaxed text-neutral-400">
                {error.message}
              </p>
            </div>
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
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-neutral-100/80 p-1 scrollbar-none">
            <button
              type="button"
              className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-neutral-800 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.2)] sm:px-3.5 sm:text-xs"
            >
              All
            </button>

            <button
              type="button"
              disabled
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-300 sm:px-3.5 sm:text-xs"
            >
              Newest
            </button>

            <button
              type="button"
              disabled
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-300 sm:px-3.5 sm:text-xs"
            >
              &lt; Rp1jt
            </button>

            <button
              type="button"
              disabled
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-300 sm:px-3.5 sm:text-xs"
            >
              &gt; Rp1jt
            </button>
          </div>

          <button
            type="button"
            onClick={onCreate}
            aria-label="Create a new goal"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-white transition-all duration-200 hover:scale-105 hover:bg-black active:scale-95"
          >
            <Plus size={15} strokeWidth={1.8} />
          </button>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">
          <div className="relative overflow-hidden rounded-[1.7rem] bg-[#f8f8f7] p-10 text-center md:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/[0.05] blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-500/[0.06] blur-[80px]" />

            <div className="relative">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Target
                  size={21}
                  strokeWidth={1.8}
                  className="text-neutral-400"
                />
              </div>

              <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Nothing planned yet
              </p>

              <h3 className="mt-2 text-[16px] font-semibold tracking-[-0.02em] text-neutral-900">
                Build something together.
              </h3>

              <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-neutral-400">
                Create your first shared goal and start working toward it
                together.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ========================================================= */
  /* TOTAL SAVINGS */
  /* ========================================================= */

  const totalSavings = goals.reduce((total, goal) => {
    return total + getGoalSavings(goal)
  }, 0)

  /* ========================================================= */
  /* FILTER */
  /* ========================================================= */

  const filteredGoals = [...goals]
    .filter((goal) => {
      const savings = getGoalSavings(goal)

      if (activeFilter === 'all') {
        return true
      }

      if (activeFilter === 'under_1m') {
        return savings < 1_000_000
      }

      if (activeFilter === 'over_1m') {
        return savings > 1_000_000
      }

      return true
    })
    .sort((a, b) => {
      if (activeFilter === 'newest') {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        )
      }

      return 0
    })

  const filterOptions: {
    value: GoalFilter
    label: string
  }[] = [
    {
      value: 'all',
      label: 'All',
    },
    {
      value: 'newest',
      label: 'Newest',
    },
    {
      value: 'under_1m',
      label: '< Rp1jt',
    },
    {
      value: 'over_1m',
      label: '> Rp1jt',
    },
  ]

  /* ========================================================= */
  /* UI */
  /* ========================================================= */

  return (
    <div className="space-y-4">
      {/* TOTAL SAVINGS */}

      <TotalSavingsCard totalSavings={totalSavings} />

      {/* TOOLBAR */}

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-black p-1 scrollbar-none">
          {filterOptions.map((filter) => {
            const isActive =
              activeFilter === filter.value

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.value)
                }
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 sm:px-3.5 sm:text-xs ${isActive
                  ? 'bg-white text-neutral-800 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.2)]'
                  : 'text-neutral-400 hover:text-neutral-600'
                  }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onCreate}
          aria-label="Create a new goal"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-white transition-all duration-200 hover:scale-105 hover:bg-black active:scale-95"
        >
          <Plus
            size={15}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* GOALS */}

      {!filteredGoals.length ? (
        <div className="relative overflow-hidden rounded-[1.8rem] border border-black/[0.05] bg-white px-6 py-12 text-center shadow-[0_15px_45px_-30px_rgba(0,0,0,0.15)]">
          <div className="pointer-events-none absolute -right-20 -top-20 size-44 rounded-full bg-pink-300/[0.06] blur-[70px]" />

          <div className="pointer-events-none absolute -left-20 bottom-[-50px] size-44 rounded-full bg-blue-300/[0.05] blur-[70px]" />

          <div className="relative">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#faf9f6]">
              <Target
                size={20}
                strokeWidth={1.8}
                className="text-neutral-400"
              />
            </div>

            <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.03em] text-neutral-800">
              {activeFilter === 'under_1m'
                ? 'No goals under Rp1jt.'
                : activeFilter === 'over_1m'
                  ? 'No goals over Rp1jt.'
                  : 'No goals found.'}
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-neutral-400">
              Try another filter or create a new shared goal.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-xs text-neutral-400">
              {filteredGoals.length}{' '}
              {filteredGoals.length === 1
                ? 'goal'
                : 'goals'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                savings={goal.savings}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}