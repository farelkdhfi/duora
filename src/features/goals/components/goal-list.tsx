'use client'

import { useState } from 'react'
import { PiggyBank, Plus, Target } from 'lucide-react'

import GoalCard from './goal-card'

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
        <div className="overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">
          <div className="animate-pulse rounded-[1.7rem] bg-[#f8f8f7] p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-2 w-24 rounded-full bg-neutral-200" />
                <div className="h-8 w-44 rounded-lg bg-neutral-200" />
              </div>

              <div className="size-11 rounded-full bg-white" />
            </div>
          </div>
        </div>

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

  const formattedTotalSavings = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalSavings)

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

      <div className="overflow-hidden rounded-[2rem] border border-black/[0.06] bg-linear-to-tr from-neutral-300 via-neutral-200 to-neutral-100 p-1 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">
        <div className="relative min-h-[190px] overflow-hidden rounded-[1.7rem] bg-[#f7f7f5] p-6 md:p-8">
          {/* Background glow */}
          <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-blue-400/[0.10] blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-28 left-1/4 size-64 rounded-full bg-pink-400/[0.10] blur-[90px]" />
          <div className="pointer-events-none absolute -left-20 top-1/3 size-40 rounded-full bg-violet-400/[0.06] blur-[70px]" />

          {/* Decorative SVG */}
          <svg
            className="pointer-events-none absolute -right-4 -top-8 h-[220px] w-[300px] text-neutral-900/[0.055]"
            viewBox="0 0 300 220"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="220"
              cy="90"
              r="82"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="220"
              cy="90"
              r="58"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 7"
            />
            <circle
              cx="220"
              cy="90"
              r="32"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M138 90h164M220 8v164"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
            <path
              d="M164 36c28-22 66-22 94 0M164 144c28 22 66 22 94 0"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>

          {/* Decorative SVG — small orbit */}
          <svg
            className="pointer-events-none absolute -bottom-8 -right-2 h-28 w-44 text-pink-500/[0.10]"
            viewBox="0 0 180 110"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 80C35 15 105 2 172 38"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M25 101C48 47 108 30 174 55"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 6"
              strokeLinecap="round"
            />
            <circle
              cx="38"
              cy="56"
              r="3"
              fill="currentColor"
            />
            <circle
              cx="126"
              cy="25"
              r="2"
              fill="currentColor"
            />
            <circle
              cx="158"
              cy="61"
              r="2.5"
              fill="currentColor"
            />
          </svg>

          {/* Decorative SVG — gradient floating hearts */}
          <svg
            className="pointer-events-none absolute -right-8 top-4 h-[150px] w-[180px]"
            viewBox="0 0 180 150"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="floatingHeartGradient"
                x1="25"
                y1="25"
                x2="150"
                y2="120"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#ec4899" stopOpacity="0.22" />
                <stop offset="0.48" stopColor="#c084fc" stopOpacity="0.16" />
                <stop offset="1" stopColor="#60a5fa" stopOpacity="0.22" />
              </linearGradient>
            </defs>

            <path
              d="M42 38C42 29.7 48.4 23 56.3 23C61.1 23 65.4 25.5 68 29.4C70.6 25.5 74.9 23 79.7 23C87.6 23 94 29.7 94 38C94 51.7 79.2 61.8 68 69C56.8 61.8 42 51.7 42 38Z"
              fill="url(#floatingHeartGradient)"
            />

            <path
              d="M103 78C103 72.1 107.6 67.3 113.3 67.3C116.8 67.3 120 69.1 121.8 72C123.7 69.1 126.8 67.3 130.3 67.3C136.1 67.3 140.7 72.1 140.7 78C140.7 87.7 130.2 94.8 121.8 99.8C113.5 94.8 103 87.7 103 78Z"
              fill="url(#floatingHeartGradient)"
            />

            <path
              d="M27 102C27 97.4 30.6 93.7 35.1 93.7C37.9 93.7 40.4 95.1 41.9 97.4C43.4 95.1 45.9 93.7 48.7 93.7C53.2 93.7 56.8 97.4 56.8 102C56.8 109.7 48.6 115.3 41.9 119.3C35.2 115.3 27 109.7 27 102Z"
              fill="url(#floatingHeartGradient)"
            />

            <circle
              cx="137"
              cy="32"
              r="5"
              fill="#ec4899"
              fillOpacity="0.16"
            />

            <circle
              cx="158"
              cy="55"
              r="3"
              fill="#60a5fa"
              fillOpacity="0.2"
            />

            <circle
              cx="86"
              cy="112"
              r="3.5"
              fill="#a78bfa"
              fillOpacity="0.14"
            />
          </svg>

          {/* Decorative curved line */}
          <svg
            className="pointer-events-none absolute -bottom-12 left-12 h-32 w-56 text-blue-500/[0.08]"
            viewBox="0 0 220 120"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 100C40 20 120 10 220 70"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M-10 116C35 36 120 28 230 88"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 7"
              strokeLinecap="round"
            />
          </svg>

          {/* Content */}
          <div className="relative z-10 flex min-h-[138px] items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-white/80 shadow-[0_5px_18px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                  <PiggyBank
                    size={14}
                    strokeWidth={1.7}
                    className="text-neutral-700"
                  />
                </span>

                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Total savings
                </p>
              </div>

              <p className="mt-4 text-[30px] font-semibold tracking-[-0.045em] text-neutral-900 md:text-[38px]">
                {formattedTotalSavings}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />

                <p className="text-[12px] text-neutral-400">
                  Saved together across all goals
                </p>
              </div>
            </div>

            {/* Visual centerpiece */}
            <div className="relative hidden size-28 shrink-0 md:block">
              <div className="absolute inset-0 rounded-full border border-black/[0.06]" />
              <div className="absolute inset-3 rounded-full border border-dashed border-black/[0.07]" />
              <div className="absolute inset-6 flex items-center justify-center rounded-full bg-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm">
                <PiggyBank
                  size={27}
                  strokeWidth={1.45}
                  className="text-neutral-700"
                />
              </div>

              <span className="absolute right-2 top-1 size-2 rounded-full bg-blue-400/70" />
              <span className="absolute bottom-3 left-1 size-1.5 rounded-full bg-pink-400/70" />
              <span className="absolute bottom-7 right-0 size-1 rounded-full bg-neutral-400/50" />
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-neutral-100 p-1 scrollbar-none">
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