'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  motion,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
  type Variants,
} from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

interface EventCalendarProps {
  /** Set berisi tanggal event dengan format `YYYY-MM-DD` */
  eventDates?: Set<string>
  /** Tampilkan tombol navigasi bulan sebelumnya / berikutnya */
  showNavigation?: boolean
}

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const EMPTY_DATES = new Set<string>()

/** 6 baris x 7 kolom, supaya tinggi kartu tidak loncat saat ganti bulan */
const TOTAL_CELLS = 42

/** Section di dalam kartu: 0 = kalender, 1 = ringkasan plan */
const SECTION_LABELS = ['Calendar', 'Plan summary']
const SECTION_MS = 6000

/** Maksimal baris plan yang tampil di section ringkasan */
const MAX_ROWS = 3

/* ========================================================= */
/* HELPERS */
/* ========================================================= */

function getMonthName(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function toDateKey(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(
    day,
  ).padStart(2, '0')}`
}

/** Selisih hari kalender (to - from), aman dari masalah jam/DST */
function daysBetween(from: Date, to: Date) {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b - a) / 86400000)
}

function formatDistance(days: number) {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  return days > 0 ? `In ${days} days` : `${Math.abs(days)} days ago`
}

/* ========================================================= */
/* MOTION HELPERS */
/* ========================================================= */

/** Transition loop tanpa henti */
const loop = (
  duration: number,
  delay = 0,
  ease: Transition['ease'] = 'easeInOut',
): Transition => ({ duration, delay, ease, repeat: Infinity })

/** Mengembalikan props animasi, atau objek kosong kalau user pilih reduce motion */
function useLoop() {
  const reduce = useReducedMotion()
  return (animate: TargetAndTransition, transition: Transition) =>
    reduce ? {} : { animate, transition }
}

/** Satu section masuk/keluar; `custom` = jarak geser (0 kalau reduce motion) */
const sectionVariants: Variants = {
  hidden: (shift: number) => ({
    opacity: 0,
    y: shift,
    transition: { duration: 0.25 },
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.07,
      delayChildren: 0.12,
    },
  },
}

/** Elemen di dalam section ringkasan muncul berurutan */
const rowVariants: Variants = {
  hidden: (shift: number) => ({ opacity: 0, x: -shift }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

/* ========================================================= */
/* CALENDAR */
/* ========================================================= */

export default function EventCalendar({
  eventDates = EMPTY_DATES,
  showNavigation = true,
}: EventCalendarProps) {
  const play = useLoop()
  const reduce = useReducedMotion()
  const shift = reduce ? 0 : 10

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()

    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  /** Auto-ganti section, berhenti saat hover/fokus keyboard atau reduce motion */
  const autoPlay = !reduce && !hovered && !focused

  useEffect(() => {
    if (!autoPlay) return

    const id = setTimeout(
      () => setActive((current) => (current + 1) % SECTION_LABELS.length),
      SECTION_MS,
    )

    return () => clearTimeout(id)
  }, [active, autoPlay])

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: (number | null)[] = [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ]

    while (days.length < TOTAL_CELLS) days.push(null)

    return days
  }, [year, month])

  /** Hari-hari (1-31) yang punya plan di bulan yang sedang dilihat */
  const eventDays = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`

    return Array.from(eventDates)
      .filter((key) => key.startsWith(prefix))
      .map((key) => Number(key.slice(8, 10)))
      .filter((day) => Number.isInteger(day) && day >= 1 && day <= 31)
      .sort((a, b) => a - b)
  }, [eventDates, year, month])

  const today = new Date()

  const plans = eventDays.map((day) => {
    const date = new Date(year, month, day)

    return {
      day,
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      distance: daysBetween(today, date),
    }
  })

  /** Plan terdekat yang belum lewat */
  const nextIndex = plans.findIndex((plan) => plan.distance >= 0)
  const maxStart = Math.max(0, plans.length - MAX_ROWS)
  const start = Math.min(nextIndex === -1 ? maxStart : nextIndex, maxStart)
  const shownPlans = plans.slice(start, start + MAX_ROWS)
  const hiddenCount = plans.length - shownPlans.length

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth()
  const monthLabel = isCurrentMonth
    ? 'this month'
    : `in ${currentMonth.toLocaleDateString('en-US', { month: 'long' })}`

  function previousMonth() {
    setCurrentMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    )
  }

  function nextMonth() {
    setCurrentMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    )
  }

  return (
    <div
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => {
        if (event.target.matches(':focus-visible')) setFocused(true)
      }}
      onBlur={() => setFocused(false)}
      className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-linear-to-br from-[#c389b0] via-[#89a3cd] to-[#7493c5] p-5 text-white shadow-[0_30px_30px_-25px_rgba(139,92,246,0.6),inset_0_1px_0_rgba(255,255,255,0.5)] [text-shadow:0_1px_2px_rgba(90,50,130,0.35)] md:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-[-0.04em]">
          {getMonthName(currentMonth)}
        </h3>

        {showNavigation && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={previousMonth}
              aria-label="Previous month"
              className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Sections (ditumpuk di satu sel grid, jadi tinggi kartu tidak berubah) */}
      <div className="mt-5 grid">
        {/* SECTION 1: Kalender */}
        <motion.div
          className={`col-start-1 row-start-1 ${
            active === 0 ? '' : 'pointer-events-none'
          }`}
          variants={sectionVariants}
          custom={shift}
          initial={false}
          animate={active === 0 ? 'visible' : 'hidden'}
          aria-hidden={active !== 0}
        >
          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEK_DAYS.map((day, index) => (
              <span
                key={`${day}-${index}`}
                className="py-2 text-[10px] font-medium text-white/85"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Dates */}
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="mt-1 grid grid-cols-7 gap-y-1.5 text-center"
          >
            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div key={`empty-${index}`} className="flex justify-center">
                    <div className="size-8" />
                  </div>
                )
              }

              const date = new Date(year, month, day)
              const hasEvent = eventDates.has(toDateKey(year, month, day))
              const isToday = isSameDay(date, today)

              const tone = isToday
                ? 'bg-white font-semibold text-[#a8397f] [text-shadow:none]'
                : hasEvent
                  ? 'bg-white/20 font-medium text-white'
                  : 'text-white/90 hover:bg-white/15'

              return (
                <div key={`day-${day}`} className="flex justify-center">
                  <div
                    aria-current={isToday ? 'date' : undefined}
                    className={`relative flex size-8 items-center justify-center rounded-full text-[11px] tabular-nums transition-colors ${tone}`}
                  >
                    {/* Hari ini: riak air */}
                    {isToday &&
                      [0, 1.1].map((delay) => (
                        <motion.span
                          key={delay}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-full border border-white"
                          initial={{ opacity: 0 }}
                          {...play(
                            { scale: [1, 1.8], opacity: [0.7, 0] },
                            loop(2.2, delay, 'easeOut'),
                          )}
                        />
                      ))}

                    {/* Ada plan: cincin putus-putus berputar */}
                    {hasEvent && !isToday && (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-0.5 rounded-full border border-dashed border-white/90"
                        {...play({ rotate: 360 }, loop(10, 0, 'linear'))}
                      />
                    )}

                    {day}

                    {/* Ada plan: titik berdenyut */}
                    {hasEvent && (
                      <>
                        <span className="sr-only">, has event</span>
                        <motion.span
                          aria-hidden="true"
                          className={`absolute bottom-1 size-1 rounded-full ${
                            isToday ? 'bg-[#cd67ab]' : 'bg-white'
                          }`}
                          {...play(
                            { scale: [1, 1.7, 1], opacity: [0.7, 1, 0.7] },
                            loop(2.2, (day % 5) * 0.3),
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* SECTION 2: Ringkasan plan */}
        <motion.div
          className={`col-start-1 row-start-1 flex flex-col justify-center ${
            active === 1 ? '' : 'pointer-events-none'
          }`}
          variants={sectionVariants}
          custom={shift}
          initial={false}
          animate={active === 1 ? 'visible' : 'hidden'}
          aria-hidden={active !== 1}
        >
          {plans.length === 0 ? (
            <motion.div
              variants={rowVariants}
              custom={shift}
              className="text-center"
            >
              <p className="text-[15px] font-semibold">No plans {monthLabel}</p>
              <p className="mt-1 text-[12px] text-white/90">
                Dates with a plan will show up here.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={rowVariants}
                custom={shift}
                className="flex items-end gap-3 px-1"
              >
                <span className="text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                  {plans.length}
                </span>
                <span className="pb-1 text-[13px] leading-tight text-white/95">
                  {plans.length === 1 ? 'plan' : 'plans'}
                  <br />
                  {monthLabel}
                </span>
              </motion.div>

              <ul className="mt-3 space-y-1.5">
                {shownPlans.map((plan, index) => {
                  const isNext = start + index === nextIndex
                  const isPast = plan.distance < 0

                  return (
                    <motion.li
                      key={plan.day}
                      variants={rowVariants}
                      custom={shift}
                      className={`flex items-center gap-3 rounded-2xl px-2.5 py-2 ${
                        isNext
                          ? 'bg-white/20 ring-1 ring-inset ring-white/40'
                          : ''
                      } ${isPast ? 'opacity-80' : ''}`}
                    >
                      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[13px] font-semibold tabular-nums">
                        {isNext && (
                          <motion.span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-xl border border-white"
                            initial={{ opacity: 0 }}
                            {...play(
                              { scale: [1, 1.5], opacity: [0.7, 0] },
                              loop(2.2, 0, 'easeOut'),
                            )}
                          />
                        )}
                        {plan.day}
                      </span>

                      <span className="min-w-0 flex-1 truncate text-[12px] font-medium">
                        {plan.weekday}
                      </span>

                      <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium tabular-nums">
                        {formatDistance(plan.distance)}
                      </span>
                    </motion.li>
                  )
                })}
              </ul>

              {hiddenCount > 0 && (
                <p className="mt-2 px-1 text-[11px] text-white/90">
                  +{hiddenCount} more {hiddenCount === 1 ? 'plan' : 'plans'}
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Indikator section (klik untuk pindah, bar terisi = hitung mundur ke section berikutnya) */}
      <div className="flex items-center justify-center gap-1.5">
        {SECTION_LABELS.map((label, index) => {
          const isActive = index === active

          return (
            <button
              key={label}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show ${label.toLowerCase()}`}
              aria-current={isActive ? 'true' : undefined}
              className="group flex h-5 items-center px-0.5 focus-visible:outline-none"
            >
              <motion.span
                className="relative block h-1.5 overflow-hidden rounded-full bg-white/35 group-focus-visible:ring-2 group-focus-visible:ring-white"
                initial={false}
                animate={{ width: isActive ? 28 : 6 }}
                transition={{ duration: 0.3 }}
              >
                {isActive && (
                  <motion.span
                    key={`${index}-${autoPlay}`}
                    className="absolute inset-0 origin-left rounded-full bg-white"
                    initial={{ scaleX: autoPlay ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: autoPlay ? SECTION_MS / 1000 : 0,
                      ease: 'linear',
                    }}
                  />
                )}
              </motion.span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ========================================================= */
/* SKELETON */
/* ========================================================= */

export function EventCalendarSkeleton() {
  return (
    <div className="animate-pulse rounded-[2rem] border border-white/40 bg-linear-to-br from-[#cd67ab]/60 via-[#7493c5]/60 to-[#7493c5]/60 p-5 shadow-[0_30px_30px_-25px_rgba(139,92,246,0.4)] md:p-6">
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 rounded-lg bg-white/30" />

        <div className="flex items-center gap-1">
          <div className="size-8 rounded-full bg-white/25" />
          <div className="size-8 rounded-full bg-white/25" />
        </div>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex justify-center py-2">
              <div className="h-2 w-2.5 rounded-full bg-white/25" />
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-y-1.5">
          {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
            <div key={index} className="flex justify-center">
              <div className="size-8 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="h-1.5 w-12 rounded-full bg-white/25" />
      </div>
    </div>
  )
}