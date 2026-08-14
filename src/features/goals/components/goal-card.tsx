'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Heart,
  Target,
} from 'lucide-react'

import type { Goal } from '../types'
import type { SavingTransactionWithProfile } from '@/features/savings/types'

interface GoalCardProps {
  goal: Goal
  savings?: SavingTransactionWithProfile[]
}

const categoryLabels: Record<Goal['category'], string> = {
  wedding: 'Wedding',
  house: 'House',
  vacation: 'Vacation',
  education: 'Education',
  business: 'Business',
  savings: 'Shared Goal',
  personal: 'Personal',
  other: 'Goal',
}

const categoryAccent: Record<Goal['category'], string> = {
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
    return `Rp ${(amount / 1_000_000)
      .toFixed(1)
      .replace(/\.0$/, '')}M`
  }

  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000)
      .toFixed(1)
      .replace(/\.0$/, '')}K`
  }

  return `Rp ${amount.toLocaleString('id-ID')}`
}

interface Contributor {
  userId: string
  name: string
  amount: number
}

function getContributors(
  savings: SavingTransactionWithProfile[],
): Contributor[] {
  const byUser = new Map<string, Contributor>()

  for (const saving of savings) {
    const name =
      saving.profile?.display_name ??
      saving.profile?.username ??
      'Unknown'

    const existing = byUser.get(saving.user_id)

    if (existing) {
      existing.amount += saving.amount
    } else {
      byUser.set(saving.user_id, {
        userId: saving.user_id,
        name,
        amount: saving.amount,
      })
    }
  }

  return Array.from(byUser.values()).sort(
    (a, b) => b.amount - a.amount,
  )
}

export default function GoalCard({
  goal,
  savings = [],
}: GoalCardProps) {
  const target = goal.target_amount ?? 0

  const totalSaved = savings.reduce(
    (sum, saving) => sum + saving.amount,
    0,
  )

  const progress =
    target > 0
      ? Math.min(100, Math.round((totalSaved / target) * 100))
      : 0

  const contributors = getContributors(savings)
  const accent = categoryAccent[goal.category]

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="
        group
        relative
        block h-fit
        w-full
        overflow-hidden
        rounded-[1.35rem]
        border
        border-black/[0.07]
        bg-white
        p-3
        shadow-[0_12px_15px_rgba(0,0,0,0.06)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.09)]
        active:scale-[0.99]
      "
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-[1.15rem]
          bg-neutral-50
          px-4
          py-4
          sm:px-5
          sm:py-5
        "
      >
        <div className="relative flex h-full flex-col">
          {/* TOP */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`
                  size-1.5
                  shrink-0
                  rounded-full
                  ${accent}
                `}
              />

              <span
                className="
                  truncate
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-neutral-400
                "
              >
                {categoryLabels[goal.category]}
              </span>
            </div>

            <div
              className="
                flex
                size-7
                items-center
                justify-center
                rounded-full
                bg-white
                text-neutral-400
                shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                transition-all
                duration-300
                group-hover:bg-neutral-900
                group-hover:text-white
              "
            >
              <ArrowUpRight
                size={13}
                strokeWidth={2}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </div>
          </div>          

          {/* TITLE */}
          <div className="mt-3 min-w-0">
            <h3
              className="
                truncate
                text-[17px]
                font-semibold
                leading-tight
                text-neutral-900
                sm:text-[19px]
                mb-5
              "
            >
              {goal.title}
            </h3>
          </div>

          {/* BOTTOM */}
          <div className="mt-auto">
            {target > 0 ? (
              <>
                <div className="flex items-end justify-between gap-3">
                  {/* SAVED */}
                  <div className="min-w-0">
                    <p
                      className="
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[0.18em]
                        text-neutral-400
                      "
                    >
                      Saved together
                    </p>

                    <p
                      className="
                        mt-2
                        truncate
                        text-[20px]
                        font-semibold
                        leading-none
                        tracking-[-0.05em]
                        text-neutral-900
                        sm:text-[23px]
                      "
                    >
                      {formatRupiah(totalSaved)}
                    </p>
                  </div>

                  {/* PROGRESS */}
                  <div className="shrink-0 text-right">
                    <p
                      className="
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[0.18em]
                        text-neutral-400
                      "
                    >
                      Progress
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        tracking-[-0.03em]
                        text-neutral-800
                        sm:text-base
                      "
                    >
                      {progress}%
                    </p>
                  </div>
                </div>

                {/* PROGRESS */}
                <div
                  className="
                    mt-5
                    h-2
                    w-full
                    overflow-hidden
                    rounded-full
                    bg-black/[0.07]
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-linear-90 from-blue-200 via-pink-200 to-neutral-500
                      transition-all
                      duration-700
                      ease-out
                    "
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-white/70
                  px-3
                  py-2
                "
              >
                <div
                  className="
                    flex
                    size-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-neutral-100
                  "
                >
                  <Target
                    size={12}
                    className="text-neutral-400"
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-[9px]
                      font-medium
                      text-neutral-600
                    "
                  >
                    No target set yet
                  </p>

                  <p
                    className="
                      truncate
                      text-[8px]
                      text-neutral-400
                    "
                  >
                    Add a target to start tracking
                  </p>
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="mt-3 flex items-center justify-between gap-3">
              {/* CONTRIBUTORS */}
              <div className="flex min-w-0 items-center">
                {contributors.length > 0 ? (
                  <>
                    <div className="flex -space-x-1.5">
                      {contributors
                        .slice(0, 3)
                        .map((contributor) => (
                          <div
                            key={contributor.userId}
                            title={contributor.name}
                            className="
                              flex
                              size-6
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border-2
                              border-[#f5f5f4]
                              bg-neutral-200
                            "
                          >
                            <span
                              className="
                                text-[7px]
                                font-semibold
                                text-neutral-600
                              "
                            >
                              {contributor.name
                                .slice(0, 1)
                                .toUpperCase()}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div className="ml-2 flex min-w-0 items-center gap-1">
                      <Heart
                        size={9}
                        fill="currentColor"
                        strokeWidth={0}
                        className="shrink-0 text-pink-300"
                      />

                      <span
                        className="
                          truncate
                          text-[8px]
                          text-neutral-400
                        "
                      >
                        {contributors.length === 1
                          ? contributors[0].name
                          : `${contributors.length} contributors`}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-[8px] text-neutral-400">
                    Shared goal
                  </span>
                )}
              </div>

              {/* DEADLINE */}
              {goal.deadline && (
                <div className="flex shrink-0 items-center gap-1.5">
                  <CalendarDays
                    size={10}
                    strokeWidth={2}
                    className="text-neutral-400"
                  />

                  <span
                    className="
                      text-[8px]
                      font-medium
                      text-neutral-500
                    "
                  >
                    {new Date(
                      goal.deadline,
                    ).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      },
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}