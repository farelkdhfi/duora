'use client'

import Link from 'next/link'
import { ArrowUpRight, Target } from 'lucide-react'

import DarkCardShell from '@/components/ui/dark-card-shell'
import GoalSummaryCard from './goal-summary-card'
import { useGoalsWithSavingsSummary } from '@/features/savings/queries'

interface GoalListProps {
  relationshipId: string
}

const iconBubbleClass =
  'flex shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] backdrop-blur-sm'

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
      <DarkCardShell>
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/[0.08]" />
              <div className="mt-2 h-4 w-44 animate-pulse rounded-lg bg-white/[0.08]" />
              <div className="mt-1.5 h-3 w-32 animate-pulse rounded-full bg-white/[0.05]" />
            </div>

            <div className="size-9 animate-pulse rounded-full bg-white/[0.05]" />
          </div>

          <div className="mt-6 divide-y divide-white/[0.06]">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="py-4 first:pt-0 last:pb-0"
              >
                <div className="animate-pulse">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="h-3 w-28 rounded-full bg-white/[0.08]" />
                      <div className="mt-2 h-2.5 w-20 rounded-full bg-white/[0.05]" />
                    </div>

                    <div className="h-2.5 w-10 rounded-full bg-white/[0.05]" />
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DarkCardShell>
    )
  }

  if (error) {
    return (
      <DarkCardShell>
        <div className="relative flex items-start gap-3">
          <div className={`size-9 ${iconBubbleClass}`}>
            <Target
              size={15}
              strokeWidth={1.6}
              className="text-pink-300"
            />
          </div>

          <div className="min-w-0">
            <h3 className="mt-1 text-sm font-medium tracking-[-0.04em] text-neutral-50">
              Couldn't load goals
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
              {error.message}
            </p>
          </div>
        </div>
      </DarkCardShell>
    )
  }

  if (!goals?.length) {
    return (
      <DarkCardShell>
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mt-1 text-sm font-medium tracking-[-0.055em] text-neutral-50">
                What are you building together?
              </h2>

              <p className="mt-1 text-[11px] text-neutral-400">
                Start something meaningful together.
              </p>
            </div>

            <div className={`size-9 ${iconBubbleClass}`}>
              <Target
                size={16}
                strokeWidth={1.5}
                className="text-pink-300"
              />
            </div>
          </div>

          <div className="mt-7 flex flex-col items-center text-center">
            <div className="relative flex size-14 items-center justify-center">
              <svg
                className="pointer-events-none absolute inset-0 size-full"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="22"
                  stroke="#ffffff"
                  strokeOpacity=".1"
                />

                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  stroke="#e9a8bd"
                  strokeOpacity=".35"
                  strokeDasharray="2 6"
                />

                <circle
                  cx="14"
                  cy="25"
                  r="1.7"
                  fill="#9eb9df"
                  fillOpacity=".7"
                />

                <circle
                  cx="49"
                  cy="40"
                  r="1.7"
                  fill="#e9a8bd"
                  fillOpacity=".7"
                />
              </svg>

              <Target
                size={19}
                strokeWidth={1.4}
                className="relative text-neutral-400"
              />
            </div>

            <h3 className="mt-3 text-sm font-medium tracking-[-0.03em] text-neutral-50">
              Nothing here yet.
            </h3>

            <p className="mt-1 max-w-xs text-xs leading-relaxed text-neutral-400">
              Create your first shared goal and start building it together.
            </p>
          </div>
        </div>
      </DarkCardShell>
    )
  }

  return (
    <DarkCardShell>
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="mt-1 text-sm font-medium tracking-[-0.055em] text-neutral-50">
              What are you building together?
            </h2>

            <p className="mt-1 text-[11px] text-neutral-400">
              A little progress, together.
            </p>
          </div>

          <Link
            href="/goals"
            aria-label="Open goals"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/10 text-neutral-300 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900"
          >
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </Link>
        </div>

        <div className="relative mt-5 divide-y divide-white/[0.06]">
          {goals.slice(0, 2).map((goal) => (
            <div
              key={goal.id}
              className="relative py-4 first:pt-0 last:pb-0"
            >
              <GoalSummaryCard goal={goal} />
            </div>
          ))}
        </div>
      </div>
    </DarkCardShell>
  )
}