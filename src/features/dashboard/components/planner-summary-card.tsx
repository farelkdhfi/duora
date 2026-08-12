import Link from 'next/link'
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Sparkles,
} from 'lucide-react'


interface PlannerSummaryCardProps {
  title: string
  date: string
  startTime?: string | null
  description?: string | null
}


function formatDate(date: string) {
  return new Date(
    `${date}T00:00:00`,
  ).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
  })
}


function formatDay(date: string) {
  return new Date(
    `${date}T00:00:00`,
  ).toLocaleDateString('id-ID', {
    weekday: 'long',
  })
}


function formatTime(time: string) {
  return time.slice(0, 5)
}


export default function PlannerSummaryCard({
  title,
  date,
  startTime,
  description,
}: PlannerSummaryCardProps) {

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl">

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

            <CalendarDays
              size={17}
              strokeWidth={2.2}
              className="text-blue-500"
            />

          </div>


          <Link
            href="/planner"
            aria-label="Open planner"
            className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-200 hover:bg-neutral-900 hover:text-white"
          >

            <ArrowUpRight
              size={15}
              strokeWidth={2.3}
            />

          </Link>

        </div>


        {/* =================================================== */}
        {/* TITLE */}
        {/* =================================================== */}

        <div className="mt-6">

          <div className="flex items-center gap-1.5">

            <Sparkles
              size={11}
              className="text-blue-400"
            />

            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
              Next plan
            </p>

          </div>


          <h2 className="mt-2 truncate text-lg font-semibold tracking-[-0.03em] text-neutral-800">
            {title}
          </h2>

        </div>


        {/* =================================================== */}
        {/* DATE + TIME */}
        {/* =================================================== */}

        <div className="mt-5 flex items-center gap-3">

          {/* Date */}

          <div className="rounded-2xl border border-black/[0.04] bg-neutral-50/80 px-4 py-2.5">

            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
              {formatDay(date)}
            </p>


            <p className="mt-0.5 text-sm font-semibold tracking-[-0.01em] text-neutral-800">
              {formatDate(date)}
            </p>

          </div>


          {/* Time */}

          {startTime && (

            <div className="flex items-center gap-1.5 rounded-full bg-blue-50/70 px-3 py-1.5">

              <Clock
                size={12}
                strokeWidth={2.4}
                className="text-blue-500"
              />

              <span className="text-[11px] font-semibold text-blue-600">
                {formatTime(startTime)}
              </span>

            </div>

          )}

        </div>


        {/* =================================================== */}
        {/* DESCRIPTION */}
        {/* =================================================== */}

        {description && (

          <div className="mt-5 border-t border-black/[0.04] pt-4">

            <p className="line-clamp-2 text-[13px] leading-5 text-neutral-400">
              {description}
            </p>

          </div>

        )}

      </div>

    </div>
  )
}