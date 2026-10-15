'use client'

import { useState } from 'react'
import { Plus, Target } from 'lucide-react'

import GoalCard from './goal-card'
import TotalSavingsCard, { TotalSavingsCardSkeleton } from './total-savings-card'

import { useGoalsWithSavingsSummary } from '@/features/savings/queries'
import EmptyGoals from './empty-goals'
import GoalSkeleton from './goal-skeleton'

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
  /* LOADING SKELETON */
  /* ========================================================= */

  if (isLoading) {
    return <GoalSkeleton />
  }

  /* ========================================================= */
  /* EMPTY */
  /* ========================================================= */

  if (!goals?.length) {
    return <EmptyGoals onCreate={onCreate} />
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
                  ? 'bg-subprimary text-secondary shadow-[0_2px_8px_-4px_rgba(0,0,0,0.2)]'
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
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-secondary transition-all duration-200 hover:scale-105 hover:bg-black active:scale-95"
        >
          <Plus
            size={15}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* GOALS */}

      {!filteredGoals.length ? (
        <div className="relative overflow-hidden rounded-[1.8rem] border border-black/[0.05] bg-primary px-6 py-12 text-center shadow-[0_15px_45px_-30px_rgba(0,0,0,0.15)]">
          <div className="pointer-events-none absolute -right-20 -top-20 size-44 rounded-full bg-pink-300/[0.06] blur-[70px]" />

          <div className="pointer-events-none absolute -left-20 bottom-[-50px] size-44 rounded-full bg-blue-300/[0.05] blur-[70px]" />

          <div className="relative">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-black">
              <Target
                size={20}
                strokeWidth={1.8}
                className="text-neutral-400"
              />
            </div>

            <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.03em] text-description">
              {activeFilter === 'under_1m'
                ? 'No goals under Rp1jt.'
                : activeFilter === 'over_1m'
                  ? 'No goals over Rp1jt.'
                  : 'No goals found.'}
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-neutral-400">
              Coba filter lain atau buat goal baru ya!.
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