import Link from 'next/link'
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Plus,
} from 'lucide-react'

import DarkCardShell from '@/components/ui/dark-card-shell'

interface PlannerSummaryCardProps {
  title?: string | null
  date?: string | null
  startTime?: string | null
  description?: string | null
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

function formatDay(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
  })
}

function formatTime(time: string) {
  return time.slice(0, 5)
}

const openButtonClass =
  'flex size-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/10 text-neutral-300 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900'

export default function PlannerSummaryCard({
  title,
  date,
  startTime,
  description,
}: PlannerSummaryCardProps) {
  const isEmpty = !title || !date

  if (isEmpty) {
    return (
      <DarkCardShell>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="mt-2 text-sm font-medium tracking-[-0.055em] text-neutral-50">
              What are you planning together?
            </h2>

            <p className="mt-1 text-[11px] text-neutral-400">
              A little plan, a little memory.
            </p>
          </div>

          <Link href="/planner" aria-label="Open planner" className={openButtonClass}>
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </Link>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-white/[0.04] px-4 py-7">
          <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-blue-500/[0.12] blur-[55px]" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 size-32 rounded-full bg-pink-500/[0.12] blur-[55px]" />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative flex size-14 items-center justify-center">
              <svg
                className="pointer-events-none absolute inset-0 size-full"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="32" cy="32" r="22" stroke="#ffffff" strokeOpacity=".1" />
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  stroke="#e9a8bd"
                  strokeOpacity=".35"
                  strokeDasharray="2 6"
                />
                <circle cx="14" cy="25" r="1.7" fill="#9eb9df" fillOpacity=".7" />
                <circle cx="49" cy="40" r="1.7" fill="#e9a8bd" fillOpacity=".7" />
              </svg>

              <CalendarDays
                size={19}
                strokeWidth={1.4}
                className="relative text-neutral-400"
              />
            </div>

            <h3 className="mt-3 text-sm font-medium tracking-[-0.03em] text-neutral-50">
              Nothing planned yet.
            </h3>

            <p className="mt-1 max-w-xs text-xs leading-relaxed text-neutral-400">
              Add a date night, a trip, or a small ritual to look forward to together.
            </p>

            <Link
              href="/planner"
              className="group mt-4 inline-flex h-9 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/10 px-4 text-[11px] font-semibold tracking-[-0.01em] text-neutral-200 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900"
            >
              <Plus size={13} strokeWidth={2.2} />
              Plan something
            </Link>
          </div>
        </div>
      </DarkCardShell>
    )
  }

  const parsedDate = new Date(`${date}T00:00:00`)

  return (
    <DarkCardShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="mt-2 text-sm font-medium tracking-[-0.055em] text-neutral-50">
            What are you planning together?
          </h2>

          <p className="mt-1 text-[11px] text-neutral-400">
            A little plan, a little memory.
          </p>
        </div>

        <Link href="/planner" aria-label="Open planner" className={openButtonClass}>
          <ArrowUpRight size={14} strokeWidth={2.2} />
        </Link>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-white/[0.04] p-4">
        <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-blue-500/[0.12] blur-[55px]" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 size-32 rounded-full bg-pink-500/[0.12] blur-[55px]" />

        <div className="relative flex items-center gap-4">
          <div className="relative flex size-[68px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.07] text-neutral-50">
            <div className="pointer-events-none absolute -right-5 -top-5 size-14 rounded-full bg-pink-500/[0.2] blur-[25px]" />

            <p className="relative text-[9px] uppercase tracking-[0.16em] text-neutral-400">
              {formatDay(date)}
            </p>

            <p className="relative mt-1 text-xl font-semibold leading-none tracking-[-0.04em]">
              {parsedDate.getDate()}
            </p>

            <p className="relative mt-1 text-[9px] uppercase tracking-[0.12em] text-neutral-400">
              {parsedDate.toLocaleDateString('en-US', {
                month: 'short',
              })}
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium tracking-[-0.035em] text-neutral-50">
              {title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <CalendarDays size={12} strokeWidth={2} />
                {formatDate(date)}
              </span>

              {startTime && (
                <>
                  <span className="size-0.5 rounded-full bg-neutral-600" />

                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-300">
                    <Clock size={12} strokeWidth={2} />
                    {formatTime(startTime)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {description && (
          <div className="relative mt-4 border-t border-white/[0.06] pt-3">
            <p className="line-clamp-2 text-[11px] leading-relaxed text-neutral-400">
              {description}
            </p>
          </div>
        )}
      </div>
    </DarkCardShell>
  )
}