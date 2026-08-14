'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  CalendarDays,
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
        group relative block overflow-hidden
        rounded-[2rem]
        border border-black/[0.06]
        bg-white p-3
        shadow-[0_25px_70px_rgba(0,0,0,0.05)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_30px_80px_rgba(0,0,0,0.07)]
      "
    >
      {/* ===================================================== */}
      {/* INNER SURFACE */}
      {/* ===================================================== */}

      <div className="
        relative overflow-hidden
        rounded-[1.7rem]
        bg-[#f8f8f7]
        p-5
        md:p-7
      ">

        {/* ================================================= */}
        {/* AMBIENT */}
        {/* ================================================= */}

        <div className="
          pointer-events-none
          absolute -right-20 -top-20
          size-56
          rounded-full
          bg-pink-500/[0.055]
          blur-[80px]
          transition-transform duration-700
          group-hover:scale-125
        " />

        <div className="
          pointer-events-none
          absolute -bottom-20 -left-20
          size-56
          rounded-full
          bg-blue-500/[0.045]
          blur-[80px]
        " />


        <div className="relative">


          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              {/* Category */}

              <div className="flex items-center gap-2">

                <span
                  className={`size-1.5 shrink-0 rounded-full ${accent}`}
                />

                <p className="
                  truncate
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                ">
                  {categoryLabels[goal.category]}
                </p>

              </div>


              {/* Title */}

              <h3 className="
                mt-3
                truncate
                text-xl
                font-semibold
                leading-tight
                tracking-[-0.04em]
                text-neutral-900
              ">
                {goal.title}
              </h3>


              {/* Description */}

              {goal.description && (
                <p className="
                  mt-2
                  line-clamp-2
                  max-w-lg
                  text-[13px]
                  leading-5
                  text-neutral-500
                ">
                  {goal.description}
                </p>
              )}

            </div>


            {/* Open */}

            <div className="
              flex size-10 shrink-0
              items-center justify-center
              rounded-full
              bg-white
              text-neutral-400
              shadow-sm
              transition-all duration-300
              group-hover:bg-black
              group-hover:text-white
            ">
              <ArrowUpRight
                size={15}
                strokeWidth={2}
                className="
                  transition-transform duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </div>

          </div>


          {/* ================================================= */}
          {/* PROGRESS */}
          {/* ================================================= */}

          {target > 0 ? (
            <div className="mt-8">

              <div className="
                flex
                items-end
                justify-between
                gap-4
              ">

                {/* Saved */}

                <div className="min-w-0">

                  <p className="
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    text-neutral-400
                  ">
                    Saved together
                  </p>

                  <p className="
                    mt-2
                    truncate
                    text-[27px]
                    font-semibold
                    leading-none
                    tracking-[-0.055em]
                    text-neutral-900
                  ">
                    {formatRupiah(totalSaved)}
                  </p>

                  <p className="
                    mt-2
                    text-[11px]
                    text-neutral-400
                  ">
                    of {formatRupiah(target)}
                  </p>

                </div>


                {/* Percentage */}

                <div className="shrink-0 text-right">

                  <p className="
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    text-neutral-400
                  ">
                    Progress
                  </p>

                  <p className="
                    mt-2
                    text-xl
                    font-semibold
                    tracking-[-0.04em]
                    text-neutral-800
                  ">
                    {progress}%
                  </p>

                </div>

              </div>


              {/* Progress bar */}

              <div className="mt-6">

                <div className="
                  h-1.5
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-black/[0.06]
                ">

                  <div
                    className="
                      h-full
                      rounded-full
                      bg-black
                      transition-all
                      duration-700
                      ease-out
                    "
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

            </div>
          ) : (

            /* ================================================= */
            /* NO TARGET */
            /* ================================================= */

            <div className="
              mt-7
              rounded-[1.4rem]
              bg-white
              p-5
            ">

              <div className="flex items-center gap-3">

                <div className="
                  flex size-9 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-neutral-100
                ">
                  <Target
                    size={15}
                    className="text-neutral-400"
                  />
                </div>

                <div>

                  <p className="
                    text-[11px]
                    font-medium
                    text-neutral-600
                  ">
                    No target set yet
                  </p>

                  <p className="
                    mt-0.5
                    text-[10px]
                    text-neutral-400
                  ">
                    Add a target to start tracking.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ================================================= */}
          {/* CONTRIBUTORS */}
          {/* ================================================= */}

          {contributors.length > 0 && (
            <div className="
              mt-6
              border-t
              border-black/[0.05]
              pt-5
            ">

              <div className="
                flex
                items-center
                justify-between
              ">

                <p className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                ">
                  Contributions
                </p>

                <Heart
                  size={12}
                  fill="currentColor"
                  strokeWidth={0}
                  className="text-pink-300"
                />

              </div>


              <div className="
                mt-3
                flex
                flex-wrap
                gap-2
              ">

                {contributors.map((contributor) => (
                  <div
                    key={contributor.userId}
                    className="
                      flex
                      min-w-0
                      max-w-full
                      items-center
                      gap-2
                      rounded-full
                      bg-white
                      py-1.5
                      pl-1.5
                      pr-3
                      shadow-sm
                    "
                  >

                    {/* Avatar */}

                    <div className="
                      flex size-6 shrink-0
                      items-center justify-center
                      rounded-full
                      bg-neutral-100
                    ">
                      <span className="
                        text-[8px]
                        font-semibold
                        text-neutral-600
                      ">
                        {contributor.name
                          .slice(0, 1)
                          .toUpperCase()}
                      </span>
                    </div>


                    {/* Name */}

                    <span className="
                      max-w-[80px]
                      truncate
                      text-[10px]
                      font-medium
                      text-neutral-500
                      sm:max-w-[100px]
                    ">
                      {contributor.name}
                    </span>


                    {/* Amount */}

                    <span className="
                      text-[10px]
                      font-semibold
                      text-neutral-800
                    ">
                      {formatRupiah(contributor.amount)}
                    </span>

                  </div>
                ))}

              </div>

            </div>
          )}


          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          {goal.deadline && (
            <div className="
              mt-5
              flex
              items-center
              justify-between
              border-t
              border-black/[0.05]
              pt-5
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="
                  flex size-8
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  shadow-sm
                ">
                  <CalendarDays
                    size={13}
                    strokeWidth={2}
                    className="text-neutral-500"
                  />
                </div>

                <div>

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-neutral-400
                  ">
                    Deadline
                  </p>

                  <p className="
                    mt-0.5
                    text-[11px]
                    font-medium
                    text-neutral-600
                  ">
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
                  </p>

                </div>

              </div>


              <span className="
                text-[10px]
                font-medium
                text-neutral-400
                transition-colors
                group-hover:text-neutral-700
              ">
                View goal
              </span>

            </div>
          )}

        </div>
      </div>
    </Link>
  )
}