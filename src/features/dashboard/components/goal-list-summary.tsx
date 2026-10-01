'use client'

import { ArrowUpRight, Target } from 'lucide-react'

import GoalSummaryCard from './goal-summary-card'
import { useGoalsWithSavingsSummary } from '@/features/savings/queries'
import Link from 'next/link'

interface GoalListProps {
  relationshipId: string
}

function CardShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.045] bg-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.18)]">
      <svg
        className="pointer-events-none absolute -right-20 -top-28 h-[330px] w-[430px] opacity-[0.8]"
        viewBox="0 0 430 330"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M450 42C390 5 313 12 276 66C241 116 263 157 221 190C185 218 116 196 83 239C55 275 79 314 121 342"
          stroke="#e9a8bd"
          strokeOpacity=".28"
          strokeWidth="1.2"
        />

        <path
          d="M456 66C394 31 331 42 302 87C275 129 294 160 260 185C220 214 157 202 120 238C91 266 102 301 135 326"
          stroke="#9eb9df"
          strokeOpacity=".3"
          strokeWidth="1.2"
        />

        <path
          d="M442 91C399 66 352 69 328 104C306 137 318 159 293 181C263 207 212 207 180 232C150 255 151 287 174 311"
          stroke="#e9a8bd"
          strokeOpacity=".18"
          strokeWidth="1"
          strokeDasharray="2 7"
        />

        <circle
          cx="335"
          cy="102"
          r="3"
          fill="#9eb9df"
          fillOpacity=".55"
        />

        <circle
          cx="276"
          cy="184"
          r="2.5"
          fill="#e9a8bd"
          fillOpacity=".6"
        />

        <circle
          cx="175"
          cy="232"
          r="2"
          fill="#9eb9df"
          fillOpacity=".5"
        />
      </svg>

      <svg
        className="pointer-events-none absolute -bottom-28 -left-20 h-[220px] w-[300px] opacity-[0.65]"
        viewBox="0 0 300 220"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-20 181C37 153 72 161 103 189C134 217 170 229 209 203C246 178 253 135 316 111"
          stroke="#9eb9df"
          strokeOpacity=".22"
          strokeWidth="1.1"
        />

        <path
          d="M-17 157C36 135 73 140 104 166C136 193 171 204 207 180C242 156 252 117 311 94"
          stroke="#e9a8bd"
          strokeOpacity=".22"
          strokeWidth="1.1"
        />

        <circle
          cx="103"
          cy="166"
          r="2.5"
          fill="#e9a8bd"
          fillOpacity=".55"
        />

        <circle
          cx="207"
          cy="180"
          r="2"
          fill="#9eb9df"
          fillOpacity=".55"
        />
      </svg>

      <svg
        className="pointer-events-none absolute right-8 top-8 size-16 opacity-[0.45]"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r="23"
          stroke="#171717"
          strokeOpacity=".07"
        />

        <circle
          cx="32"
          cy="32"
          r="17"
          stroke="#e9a8bd"
          strokeOpacity=".3"
          strokeDasharray="2 6"
        />

        <circle
          cx="32"
          cy="32"
          r="10"
          stroke="#9eb9df"
          strokeOpacity=".28"
        />

        <circle
          cx="48"
          cy="21"
          r="2"
          fill="#e9a8bd"
        />

        <circle
          cx="20"
          cy="46"
          r="1.7"
          fill="#9eb9df"
        />
      </svg>

      <div className="relative p-5 sm:p-6">
        {children}
      </div>
    </div>
  )
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
      <CardShell>
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="h-2.5 w-20 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-2 h-4 w-44 animate-pulse rounded-lg bg-neutral-200" />
              <div className="mt-1.5 h-3 w-32 animate-pulse rounded-full bg-neutral-100" />
            </div>

            <div className="size-9 animate-pulse rounded-full bg-neutral-100" />
          </div>

          <div className="mt-6 divide-y divide-black/[0.06]">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="py-4 first:pt-0 last:pb-0"
              >
                <div className="animate-pulse">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="h-3 w-28 rounded-full bg-neutral-200" />
                      <div className="mt-2 h-2.5 w-20 rounded-full bg-neutral-100" />
                    </div>

                    <div className="h-2.5 w-10 rounded-full bg-neutral-100" />
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardShell>
    )
  }

  if (error) {
    return (
      <CardShell>
        <div className="relative flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.04] bg-white shadow-[0_8px_20px_-14px_rgba(0,0,0,0.25)]">
            <Target
              size={15}
              strokeWidth={1.6}
              className="text-pink-300"
            />
          </div>

          <div className="min-w-0">
            <h3 className="mt-1 text-sm font-medium tracking-[-0.04em] text-neutral-800">
              Couldn't load goals
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
              {error.message}
            </p>
          </div>
        </div>
      </CardShell>
    )
  }

  if (!goals?.length) {
    return (
      <CardShell>
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mt-1 text-sm font-medium tracking-[-0.055em] text-neutral-800">
                What are you building together?
              </h2>

              <p className="mt-1 text-[11px] text-neutral-400">
                Start something meaningful together.
              </p>
            </div>

            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.04] bg-white shadow-[0_8px_20px_-14px_rgba(0,0,0,0.25)]">
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
                  stroke="#171717"
                  strokeOpacity=".05"
                />

                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  stroke="#e9a8bd"
                  strokeOpacity=".22"
                  strokeDasharray="2 6"
                />

                <circle
                  cx="14"
                  cy="25"
                  r="1.7"
                  fill="#9eb9df"
                  fillOpacity=".6"
                />

                <circle
                  cx="49"
                  cy="40"
                  r="1.7"
                  fill="#e9a8bd"
                  fillOpacity=".6"
                />
              </svg>

              <Target
                size={19}
                strokeWidth={1.4}
                className="relative text-neutral-400"
              />
            </div>

            <h3 className="mt-3 text-sm font-medium tracking-[-0.03em] text-neutral-800">
              Nothing here yet.
            </h3>

            <p className="mt-1 max-w-xs text-xs leading-relaxed text-neutral-400">
              Create your first shared goal and start building it together.
            </p>
          </div>
        </div>
      </CardShell>
    )
  }

  return (
    <CardShell>
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="mt-1 text-sm font-medium tracking-[-0.055em] text-neutral-800">
              What are you building together?
            </h2>

            <p className="mt-1 text-[11px] text-neutral-400">
              A little progress, together.
            </p>
          </div>

          <Link href="/goals" aria-label="Open goals" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-neutral-500 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-neutral-900 hover:text-white">
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </Link>
        </div>

        <div className="relative mt-5 divide-y divide-black/[0.06]">
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
    </CardShell>
  )
}
