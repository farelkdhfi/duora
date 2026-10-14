import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Clock, Plus } from 'lucide-react'

import DarkCardShell from '@/components/ui/dark-card-shell'

interface PlannerSummaryCardProps {
  title?: string | null
  date?: string | null
  startTime?: string | null
  description?: string | null
}

function formatTime(time: string) {
  return time.slice(0, 5)
}

const openButtonClass =
  'flex size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/10 text-neutral-300 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900'

function CardHeader() {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <h2 className="break-words text-sm font-medium  text-neutral-50">
          Planning
        </h2>

      </div>

      <Link href="/planner" aria-label="Open planner" className={openButtonClass}>
        <ArrowUpRight size={14} strokeWidth={2.2} />
      </Link>
    </div>
  )
}

export default function PlannerSummaryCard({
  title,
  date,
  startTime,
  description,
}: PlannerSummaryCardProps) {
  const isEmpty = !title || !date

  if (isEmpty) {
    return (
      <DarkCardShell variant="rose" compact>
        <CardHeader />

        <div className="relative mt-4 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] px-3 py-5 text-center">
          <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-rose-500/[0.10] blur-[40px]" />

          <div className="relative flex size-12 items-center justify-center">
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
                stroke="#f3b6cd"
                strokeOpacity=".35"
                strokeDasharray="2 6"
              />
              <circle cx="14" cy="25" r="1.7" fill="#f3b6cd" fillOpacity=".7" />
              <circle cx="49" cy="40" r="1.7" fill="#cfb4f0" fillOpacity=".7" />
            </svg>

            <CalendarDays
              size={17}
              strokeWidth={1.4}
              className="relative text-neutral-400"
            />
          </div>

          <h3 className="relative mt-3 text-[13px] font-medium tracking-[-0.03em] text-neutral-50">
            Nothing planned yet.
          </h3>

          <p className="relative mt-1 text-[11px] leading-relaxed text-neutral-400">
            Add a date night or a trip.
          </p>

          <Link
            href="/planner"
            className="relative mt-3 inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/10 px-3.5 text-[11px] font-semibold tracking-[-0.01em] text-neutral-200 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900"
          >
            <Plus size={12} strokeWidth={2.2} />
            Plan
          </Link>
        </div>
      </DarkCardShell>
    )
  }

  const parsedDate = new Date(`${date}T00:00:00`)
  const weekday = parsedDate.toLocaleDateString('en-US', { weekday: 'short' })
  const month = parsedDate.toLocaleDateString('en-US', { month: 'short' })

  return (
    <DarkCardShell variant="rose" compact>
      <CardHeader />

      <div className="relative mt-4 flex-1 overflow-hidden p-3">
        <div className="relative flex items-center gap-2.5">
          <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.07]">
            <p className="text-[8px] uppercase tracking-[0.14em] text-neutral-400">
              {month}
            </p>
            <p className="text-lg font-semibold leading-none tracking-[-0.04em] text-neutral-50">
              {parsedDate.getDate()}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">
              {weekday}
            </p>

            {startTime && (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-neutral-200">
                <Clock size={11} strokeWidth={2} />
                {formatTime(startTime)}
              </p>
            )}
          </div>
        </div>

        <h3 className="relative mt-3 line-clamp-2 text-sm font-medium tracking-[-0.035em] text-neutral-50">
          {title}
        </h3>

        {description && (
          <p className="relative mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-400">
            {description}
          </p>
        )}
      </div>
    </DarkCardShell>
  )
}