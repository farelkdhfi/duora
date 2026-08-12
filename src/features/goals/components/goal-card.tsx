import Link from 'next/link'

import {
  ArrowUpRight,
  CalendarDays,
  Target,
} from 'lucide-react'

import type { Goal } from '../types'


interface GoalCardProps {
  goal: Goal
}


export default function GoalCard({
  goal,
}: GoalCardProps) {

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="group relative block overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-25px_rgba(0,0,0,0.2)]"
    >

      {/* ===================================================== */}
      {/* AMBIENT */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-100/40 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />

      <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-100/30 blur-3xl" />


      <div className="relative">

        {/* =================================================== */}
        {/* HEADER */}
        {/* =================================================== */}

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
              {goal.category}
            </p>


            <h3 className="mt-2 truncate text-lg font-semibold tracking-[-0.03em] text-neutral-800">
              {goal.title}
            </h3>

          </div>


          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-200 group-hover:bg-neutral-900 group-hover:text-white">

            <ArrowUpRight
              size={15}
              strokeWidth={2.3}
            />

          </div>

        </div>


        {/* =================================================== */}
        {/* DESCRIPTION */}
        {/* =================================================== */}

        {goal.description && (

          <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-400">
            {goal.description}
          </p>

        )}


        {/* =================================================== */}
        {/* GOAL DETAILS */}
        {/* =================================================== */}

        <div className="mt-6 flex flex-wrap gap-2">

          {goal.target_amount !== null && (

            <div className="flex items-center gap-1.5 rounded-full bg-blue-50/80 px-3 py-1.5">

              <Target
                size={12}
                strokeWidth={2.4}
                className="text-blue-500"
              />


              <span className="text-[11px] font-semibold text-blue-600">

                Rp{' '}
                {goal.target_amount.toLocaleString(
                  'id-ID',
                )}

              </span>

            </div>

          )}


          {goal.deadline && (

            <div className="flex items-center gap-1.5 rounded-full bg-pink-50/80 px-3 py-1.5">

              <CalendarDays
                size={12}
                strokeWidth={2.4}
                className="text-pink-500"
              />


              <span className="text-[11px] font-medium text-pink-600">

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


        {/* =================================================== */}
        {/* BOTTOM LINE */}
        {/* =================================================== */}

        <div className="mt-6 border-t border-black/[0.04] pt-4">

          <p className="text-[11px] text-neutral-400">
            Tap to view goal details
          </p>

        </div>

      </div>

    </Link>
  )
}