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

export default function PlannerSummaryCard({
  title,
  date,
  startTime,
  description,
}: PlannerSummaryCardProps) {
  const parsedDate = new Date(`${date}T00:00:00`)

  return (
    <div className="
      rounded-[2rem]
      border border-black/[0.06]
      bg-white
      p-3
      shadow-[0_20px_60px_rgba(0,0,0,0.05)]
    ">
      <div className="
        group relative overflow-hidden
        rounded-[1.6rem]
        bg-[#f8f8f7]
        p-5
      ">
        {/* Ambient */}
        <div className="
          pointer-events-none absolute
          -right-16 -top-16
          size-40 rounded-full
          bg-blue-500/[0.05]
          blur-[70px]
        " />

        <div className="
          pointer-events-none absolute
          -bottom-16 -left-16
          size-40 rounded-full
          bg-pink-500/[0.05]
          blur-[70px]
        " />

        <div className="relative">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles
                size={11}
                className="text-pink-400"
                strokeWidth={2.2}
              />

              <p className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-neutral-400
              ">
                Next plan
              </p>
            </div>

            <Link
              href="/planner"
              aria-label="Open planner"
              className="
                flex size-8 shrink-0
                items-center justify-center
                rounded-full
                bg-white
                text-neutral-300
                shadow-sm
                transition-all duration-300
                hover:bg-neutral-900
                hover:text-white
              "
            >
              <ArrowUpRight
                size={14}
                strokeWidth={2.2}
                className="
                  transition-transform duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>

          {/* Main */}
          <div className="mt-5 flex items-center gap-4">

            {/* Date block */}
            <div className="
              relative flex
              size-[72px]
              shrink-0
              flex-col
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              bg-[#111111]
              text-white
            ">
              {/* Date ambient */}
              <div className="
                pointer-events-none absolute
                -right-5 -top-5
                size-14 rounded-full
                bg-pink-500/[0.12]
                blur-[25px]
              " />

              <p className="
                relative
                text-[9px]
                uppercase
                tracking-[0.16em]
                text-white/40
              ">
                {formatDay(date)}
              </p>

              <p className="
                relative
                mt-1
                text-xl
                font-semibold
                leading-none
                tracking-[-0.04em]
              ">
                {parsedDate.getDate()}
              </p>

              <p className="
                relative
                mt-1
                text-[9px]
                uppercase
                tracking-[0.12em]
                text-white/40
              ">
                {parsedDate.toLocaleDateString('en-US', {
                  month: 'short',
                })}
              </p>
            </div>

            {/* Event info */}
            <div className="min-w-0 flex-1">
              <h2 className="
                truncate
                text-[16px]
                font-semibold
                tracking-[-0.025em]
                text-neutral-900
              ">
                {title}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="
                  flex items-center gap-1.5
                  text-[11px]
                  text-neutral-400
                ">
                  <CalendarDays
                    size={12}
                    strokeWidth={2}
                  />

                  {formatDate(date)}
                </span>

                {startTime && (
                  <>
                    <span className="size-0.5 rounded-full bg-neutral-300" />

                    <span className="
                      flex items-center gap-1.5
                      text-[11px]
                      font-medium
                      text-neutral-500
                    ">
                      <Clock
                        size={12}
                        strokeWidth={2}
                      />

                      {formatTime(startTime)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="
              mt-5
              border-t
              border-black/[0.05]
              pt-4
            ">
              <p className="
                line-clamp-2
                text-[12px]
                leading-relaxed
                text-neutral-400
              ">
                {description}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="
            mt-4
            flex
            items-center
            justify-between
            border-t
            border-black/[0.05]
            pt-3
          ">
            <span className="
              text-[10px]
              uppercase
              tracking-[0.14em]
              text-neutral-300
            ">
              Shared planner
            </span>

            <span className="
              text-[10px]
              font-medium
              text-neutral-300
              transition-colors
              group-hover:text-neutral-500
            ">
              View planner
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}