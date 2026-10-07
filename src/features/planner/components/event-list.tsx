'use client'

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { usePlannerEvents } from '../queries'
import EventCard from './event-card'

interface EventListProps {
  relationshipId: string
}

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

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function EventList({ relationshipId }: EventListProps) {
  const {
    data: events,
    isLoading,
    error,
  } = usePlannerEvents(relationshipId)

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()

    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  /* =========================================================
     CALENDAR DATA
  ========================================================= */

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1).getDay()

    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const previousMonthDays = Array.from({ length: firstDay }, () => '')

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, index) =>
      String(index + 1),
    )

    return [...previousMonthDays, ...currentMonthDays]
  }, [currentMonth])

  /* =========================================================
     EVENT DATES
  ========================================================= */

  const eventDates = useMemo(() => {
    if (!events) return new Set<string>()

    return new Set(events.map((event) => event.event_date))
  }, [events])

  const today = new Date()

  /* =========================================================
     NAVIGATION
  ========================================================= */

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

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT — CALENDAR SKELETON */}

        <div className="animate-pulse rounded-[2rem] border border-black/[0.06] bg-white p-7 shadow-[0_25px_70px_rgba(0,0,0,0.05)] md:p-9">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-2.5 w-16 rounded-full bg-neutral-100" />

              <div className="mt-3 h-5 w-32 rounded-lg bg-neutral-200" />
            </div>

            <div className="flex items-center gap-1">
              <div className="size-8 rounded-full bg-neutral-100" />

              <div className="size-8 rounded-full bg-neutral-100" />
            </div>
          </div>

          <div className="mt-10">
            {/* Week days */}

            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex justify-center py-2">
                  <div className="h-2 w-2.5 rounded-full bg-neutral-100" />
                </div>
              ))}
            </div>

            {/* Dates */}

            <div className="mt-1 grid grid-cols-7 gap-y-2">
              {Array.from({ length: 35 }).map((_, index) => (
                <div key={index} className="flex justify-center">
                  <div className="size-8 rounded-full bg-neutral-100" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — UPCOMING EVENTS SKELETON */}

        <div className="animate-pulse p-1 md:p-2">
          {/* Header */}

          <div className="flex items-center justify-between">
            <div>
              <div className="h-2.5 w-28 rounded-full bg-neutral-200" />

              <div className="mt-3 h-5 w-56 rounded-lg bg-neutral-200" />
            </div>

            <div className="size-10 rounded-full bg-neutral-100" />
          </div>

          {/* Event list */}

          <div className="mt-8 space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-[1.25rem] border border-black/[0.06] bg-white p-4"
              >
                <div className="size-12 shrink-0 rounded-[1rem] bg-neutral-100" />

                <div className="min-w-0 flex-1">
                  <div className="h-2 w-20 rounded-full bg-neutral-100" />

                  <div className="mt-2 h-3 w-36 rounded-full bg-neutral-200" />

                  <div className="mt-2 h-2 w-28 rounded-full bg-neutral-100" />
                </div>

                <div className="size-8 shrink-0 rounded-full bg-neutral-100" />
              </div>
            ))}
          </div>

          {/* Bottom */}

          <div className="mt-4 flex items-center justify-between rounded-[1.4rem] border border-black/[0.06] bg-white p-4">
            <div>
              <div className="h-2.5 w-8 rounded-full bg-neutral-100" />

              <div className="mt-2 h-3 w-36 rounded-full bg-neutral-200" />
            </div>

            <div className="size-9 rounded-full bg-neutral-200" />
          </div>
        </div>
      </div>
    )
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">
        <div className="rounded-[1.7rem] bg-neutral-50 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FF3B30]/10">
              <CalendarDays size={16} className="text-[#FF3B30]" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Error
              </p>

              <p className="mt-1 text-sm font-semibold tracking-[-0.02em] text-neutral-900">
                Couldn't load your plans
              </p>

              <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================================
     EMPTY
  ========================================================= */

  if (!events?.length) {
    return (
      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT — CALENDAR */}

        <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-7 shadow-[0_25px_70px_rgba(0,0,0,0.05)] md:p-9">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-pink-500/[0.07] blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-blue-500/[0.06] blur-[90px]" />

          <div className="relative">
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-neutral-900">
              {getMonthName(currentMonth)}
            </h3>

            <div className="mt-10 grid grid-cols-7 gap-1 text-center">
              {WEEK_DAYS.map((day, index) => (
                <span
                  key={`${day}-${index}`}
                  className="py-2 text-[9px] font-medium text-neutral-400"
                >
                  {day}
                </span>
              ))}

              {calendarDays.map((day, index) => (
                <div key={`${day}-${index}`} className="flex justify-center">
                  <div className="flex size-8 items-center justify-center rounded-full text-[10px] text-neutral-400">
                    {day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — EMPTY */}

        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden p-6 md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/[0.06] blur-[80px]" />

          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-500/[0.07] blur-[80px]" />

          <div className="relative text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
              <CalendarDays
                size={22}
                strokeWidth={1.8}
                className="text-neutral-400"
              />
            </div>

            <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Nothing planned yet
            </p>

            <h3 className="mt-2 text-[16px] font-semibold tracking-[-0.025em] text-neutral-900">
              Give yourselves something to look forward to.
            </h3>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
      {/* =====================================================
          LEFT — CALENDAR
      ===================================================== */}

      <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-7 shadow-[0_25px_70px_rgba(0,0,0,0.05)] md:p-9">
        {/* Ambient */}

        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-pink-500/[0.07] blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-blue-500/[0.06] blur-[90px]" />

        <div className="relative">
          {/* Header */}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-neutral-900">
                {getMonthName(currentMonth)}
              </h3>
            </div>

            {/* Navigation */}

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={previousMonth}
                aria-label="Previous month"
                className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Calendar */}

          <div className="mt-10">
            {/* Week days */}

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEK_DAYS.map((day, index) => (
                <span
                  key={`${day}-${index}`}
                  className="py-2 text-[9px] font-medium text-neutral-400"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Dates */}

            <div className="mt-1 grid grid-cols-7 gap-y-2 text-center">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return (
                    <div key={`empty-${index}`} className="flex justify-center">
                      <div className="size-8" />
                    </div>
                  )
                }

                const dayNumber = Number(day)

                const date = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  dayNumber,
                )

                const dateKey = `${currentMonth.getFullYear()}-${String(
                  currentMonth.getMonth() + 1,
                ).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`

                const hasEvent = eventDates.has(dateKey)

                const isToday = isSameDay(date, today)

                return (
                  <div key={`${day}-${index}`} className="flex justify-center">
                    <div
                      className={`
                        relative flex size-8 items-center justify-center
                        rounded-full text-[10px]
                        transition
                        ${
                          isToday
                            ? 'bg-neutral-900 font-semibold text-white'
                            : hasEvent
                              ? 'bg-pink-50 font-medium text-neutral-900'
                              : 'text-neutral-500 hover:bg-neutral-100'
                        }
                      `}
                    >
                      {day}

                      {hasEvent && !isToday && (
                        <span className="absolute bottom-1 size-1 rounded-full bg-pink-500" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT — UPCOMING EVENTS
      ===================================================== */}

      <div className="p-1 md:p-2">
        <div className="space-y-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}