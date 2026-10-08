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
    <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.045] bg-indigo-100 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.18)]">
      <svg className="pointer-events-none absolute -right-20 -top-28 h-[330px] w-[430px] opacity-[0.8]" viewBox="0 0 430 330" fill="none" aria-hidden="true">
        <path d="M450 42C390 5 313 12 276 66C241 116 263 157 221 190C185 218 116 196 83 239C55 275 79 314 121 342" stroke="#e9a8bd" strokeOpacity=".28" strokeWidth="1.2" />
        <path d="M456 66C394 31 331 42 302 87C275 129 294 160 260 185C220 214 157 202 120 238C91 266 102 301 135 326" stroke="#9eb9df" strokeOpacity=".3" strokeWidth="1.2" />
        <path d="M442 91C399 66 352 69 328 104C306 137 318 159 293 181C263 207 212 207 180 232C150 255 151 287 174 311" stroke="#e9a8bd" strokeOpacity=".18" strokeWidth="1" strokeDasharray="2 7" />
        <circle cx="335" cy="102" r="3" fill="#9eb9df" fillOpacity=".55" />
        <circle cx="276" cy="184" r="2.5" fill="#e9a8bd" fillOpacity=".6" />
        <circle cx="175" cy="232" r="2" fill="#9eb9df" fillOpacity=".5" />
      </svg>

      <svg className="pointer-events-none absolute -bottom-28 -left-20 h-[220px] w-[300px] opacity-[0.65]" viewBox="0 0 300 220" fill="none" aria-hidden="true">
        <path d="M-20 181C37 153 72 161 103 189C134 217 170 229 209 203C246 178 253 135 316 111" stroke="#9eb9df" strokeOpacity=".22" strokeWidth="1.1" />
        <path d="M-17 157C36 135 73 140 104 166C136 193 171 204 207 180C242 156 252 117 311 94" stroke="#e9a8bd" strokeOpacity=".22" strokeWidth="1.1" />
        <circle cx="103" cy="166" r="2.5" fill="#e9a8bd" fillOpacity=".55" />
        <circle cx="207" cy="180" r="2" fill="#9eb9df" fillOpacity=".55" />
      </svg>

      <svg className="pointer-events-none absolute right-8 top-8 size-16 opacity-[0.45]" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="23" stroke="#171717" strokeOpacity=".07" />
        <circle cx="32" cy="32" r="17" stroke="#e9a8bd" strokeOpacity=".3" strokeDasharray="2 6" />
        <circle cx="32" cy="32" r="10" stroke="#9eb9df" strokeOpacity=".28" />
        <circle cx="48" cy="21" r="2" fill="#e9a8bd" />
        <circle cx="20" cy="46" r="1.7" fill="#9eb9df" />
      </svg>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>

            <h2 className="mt-2 text-sm font-medium tracking-[-0.055em] text-neutral-800">
              What are you planning together?
            </h2>

            <p className="mt-1 text-[11px] text-neutral-400">
              A little plan, a little memory.
            </p>
          </div>

          <Link href="/planner" aria-label="Open planner" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-neutral-500 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-neutral-900 hover:text-white">
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </Link>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-[1.5rem] bg-[#f8f8f7] p-4">
          <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-blue-500/[0.05] blur-[55px]" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 size-32 rounded-full bg-pink-500/[0.05] blur-[55px]" />

          <div className="relative flex items-center gap-4">
            <div className="relative flex size-[68px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl bg-white text-black">
              <div className="pointer-events-none absolute -right-5 -top-5 size-14 rounded-full bg-pink-500/[0.12] blur-[25px]" />

              <p className="relative text-[9px] uppercase tracking-[0.16em] text-black">
                {formatDay(date)}
              </p>

              <p className="relative mt-1 text-xl font-semibold leading-none tracking-[-0.04em]">
                {parsedDate.getDate()}
              </p>

              <p className="relative mt-1 text-[9px] uppercase tracking-[0.12em] text-black">
                {parsedDate.toLocaleDateString('en-US', {
                  month: 'short',
                })}
              </p>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium tracking-[-0.035em] text-neutral-900">
                {title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <CalendarDays size={12} strokeWidth={2} />
                  {formatDate(date)}
                </span>

                {startTime && (
                  <>
                    <span className="size-0.5 rounded-full bg-neutral-300" />

                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
                      <Clock size={12} strokeWidth={2} />
                      {formatTime(startTime)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {description && (
            <div className="relative mt-4 border-t border-black/[0.05] pt-3">
              <p className="line-clamp-2 text-[11px] leading-relaxed text-neutral-400">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}