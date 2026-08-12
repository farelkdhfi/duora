import Link from 'next/link'

import {
  ArrowUpRight,
  CalendarDays,
  Sparkles,
  Target,
} from 'lucide-react'

import type { Goal } from '@/features/goals/types'


interface GoalCardProps {
  goal: Goal
}


export default function GoalSummaryCard({
  goal,
}: GoalCardProps) {

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="group relative block overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-25px_rgba(0,0,0,0.2)]"
    >

      {/* ===================================================== */}
      {/* AMBIENT */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute -right-16 -top-16 size-36 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-16 -left-16 size-36 rounded-full bg-pink-100/30 blur-3xl" />


      <div className="relative">

        {/* =================================================== */}
        {/* HEADER */}
        {/* =================================================== */}

        <div className="flex items-start justify-between">

          <div className="flex size-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-blue-50 to-pink-50">

            <Target
              size={17}
              strokeWidth={2.2}
              className="text-emerald-500"
            />

          </div>


          <div className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-200 group-hover:bg-neutral-900 group-hover:text-white">

            <ArrowUpRight
              size={15}
              strokeWidth={2.3}
            />

          </div>

        </div>


        {/* =================================================== */}
        {/* TITLE */}
        {/* =================================================== */}

        <div className="mt-6">

          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
              {goal.category}
            </p>

          </div>


          <h2 className="mt-2 truncate text-lg font-semibold tracking-[-0.03em] text-neutral-800">
            {goal.title}
          </h2>

        </div>


        {/* =================================================== */}
        {/* DETAILS */}
        {/* =================================================== */}

        <div className="mt-5 flex flex-wrap items-center gap-3">

          {goal.target_amount !== null && (

            <div className="rounded-2xl border border-black/[0.04] bg-neutral-50/80 px-4 py-2.5">

              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                Target
              </p>


              <p className="mt-0.5 text-sm font-semibold tracking-[-0.01em] text-neutral-800">
                Rp{' '}
                {goal.target_amount.toLocaleString(
                  'id-ID',
                )}
              </p>

            </div>

          )}


          {goal.deadline && (

            <div className="flex items-center gap-1.5 rounded-full bg-pink-50/70 px-3 py-1.5">

              <CalendarDays
                size={12}
                strokeWidth={2.4}
                className="text-pink-500"
              />

              <span className="text-[11px] font-semibold text-pink-600">
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

    </Link>
  )
}