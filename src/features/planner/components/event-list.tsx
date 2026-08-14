'use client'

import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
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

function getMonthShort(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
  })
}

function isSameDay(
  first: Date,
  second: Date,
) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

export default function EventList({
  relationshipId,
}: EventListProps) {
  const {
    data: events,
    isLoading,
    error,
  } = usePlannerEvents(relationshipId)

  const [currentMonth, setCurrentMonth] =
    useState(() => {
      const now = new Date()

      return new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      )
    })


  /* =========================================================
     CALENDAR DATA
  ========================================================= */

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(
      year,
      month,
      1,
    ).getDay()

    const daysInMonth = new Date(
      year,
      month + 1,
      0,
    ).getDate()

    const previousMonthDays = Array.from(
      { length: firstDay },
      () => '',
    )

    const currentMonthDays = Array.from(
      { length: daysInMonth },
      (_, index) => String(index + 1),
    )

    return [
      ...previousMonthDays,
      ...currentMonthDays,
    ]
  }, [currentMonth])


  /* =========================================================
     EVENT DATES
  ========================================================= */

  const eventDates = useMemo(() => {
    if (!events) return new Set<string>()

    return new Set(
      events.map((event) => event.event_date),
    )
  }, [events])


  const today = new Date()


  /* =========================================================
     NAVIGATION
  ========================================================= */

  function previousMonth() {
    setCurrentMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1,
        ),
    )
  }

  function nextMonth() {
    setCurrentMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1,
        ),
    )
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">

        {/* Calendar skeleton */}

        <div className="animate-pulse rounded-[2rem] bg-[#111111] p-7 md:p-9">

          <div className="h-2.5 w-16 rounded-full bg-white/10" />

          <div className="mt-3 h-5 w-32 rounded-lg bg-white/10" />

          <div className="mt-10 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex justify-center"
                >
                  <div className="size-8 rounded-full bg-white/[0.06]" />
                </div>
              ),
            )}
          </div>

          <div className="mt-10 border-t border-white/[0.07] pt-5">
            <div className="h-2.5 w-32 rounded-full bg-white/[0.08]" />
          </div>

        </div>


        {/* Event skeleton */}

        <div className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">

          <div className="rounded-[1.7rem] bg-[#f8f8f7] p-5 md:p-7">

            <div className="h-2.5 w-28 rounded-full bg-neutral-200" />

            <div className="mt-3 h-5 w-56 rounded-lg bg-neutral-200" />

            <div className="mt-8 space-y-2">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-[1.25rem] bg-white p-4"
                  >
                    <div className="size-12 rounded-[1rem] bg-neutral-100" />

                    <div className="flex-1">
                      <div className="h-2 w-20 rounded-full bg-neutral-100" />
                      <div className="mt-2 h-3 w-36 rounded-full bg-neutral-100" />
                      <div className="mt-2 h-2 w-28 rounded-full bg-neutral-100" />
                    </div>
                  </div>
                ),
              )}

            </div>

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

        <div className="rounded-[1.7rem] bg-[#f8f8f7] p-6 md:p-8">

          <div className="flex items-start gap-3">

            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FF3B30]/10">
              <CalendarDays
                size={16}
                className="text-[#FF3B30]"
              />
            </div>

            <div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Error
              </p>

              <p className="mt-1 text-sm font-semibold tracking-[-0.02em]">
                Couldn't load your plans
              </p>

              <p className="mt-1 text-xs leading-relaxed text-neutral-400">
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

        {/* Calendar */}

        <div className="relative overflow-hidden rounded-[2rem] bg-[#111111] p-7 text-white shadow-[0_25px_70px_rgba(0,0,0,0.10)] md:p-9">

          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-pink-500/[0.10] blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-blue-500/[0.08] blur-[90px]" />

          <div className="relative">

            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Your month
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              {getMonthName(currentMonth)}
            </h3>

            <div className="mt-10 grid grid-cols-7 gap-1 text-center">

              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
                (day, index) => (
                  <span
                    key={`${day}-${index}`}
                    className="py-2 text-[9px] font-medium text-white/25"
                  >
                    {day}
                  </span>
                ),
              )}

              {calendarDays.map(
                (day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="flex justify-center"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full text-[10px] text-white/30">
                      {day}
                    </div>
                  </div>
                ),
              )}

            </div>

          </div>

        </div>


        {/* Empty content */}

        <div className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">

          <div className="relative overflow-hidden rounded-[1.7rem] bg-[#f8f8f7] p-10 text-center md:p-12">

            <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/[0.06] blur-[80px]" />

            <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-500/[0.07] blur-[80px]" />

            <div className="relative mx-auto flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
              <CalendarDays
                size={22}
                strokeWidth={1.8}
                className="text-neutral-400"
              />
            </div>

            <p className="relative mt-5 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              Nothing planned yet
            </p>

            <h3 className="relative mt-2 text-[16px] font-semibold tracking-[-0.025em]">
              Give yourselves something to look forward to.
            </h3>

            <p className="relative mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-neutral-400">
              Create your first plan and start filling your calendar together.
            </p>

            <div className="relative mt-5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-neutral-400">
              <Sparkles
                size={12}
                className="text-pink-400"
              />
              <span>Make memories together</span>
            </div>

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

      <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-[#111111] p-7 text-white shadow-[0_25px_70px_rgba(0,0,0,0.10)] md:p-9">

        {/* Ambient */}

        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-pink-500/[0.10] blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-blue-500/[0.08] blur-[90px]" />


        <div className="relative">

          {/* Header */}

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                Your month
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                {getMonthName(currentMonth)}
              </h3>

            </div>


            {/* Navigation */}

            <div className="flex items-center gap-1">

              <button
                type="button"
                onClick={previousMonth}
                className="flex size-8 items-center justify-center rounded-full bg-white/[0.06] text-white/40 transition hover:bg-white/[0.1] hover:text-white"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                onClick={nextMonth}
                className="flex size-8 items-center justify-center rounded-full bg-white/[0.06] text-white/40 transition hover:bg-white/[0.1] hover:text-white"
              >
                <ChevronRight size={14} />
              </button>

            </div>

          </div>


          {/* Calendar */}

          <div className="mt-10">

            {/* Week days */}

            <div className="grid grid-cols-7 gap-1 text-center">

              {[
                'S',
                'M',
                'T',
                'W',
                'T',
                'F',
                'S',
              ].map((day, index) => (
                <span
                  key={`${day}-${index}`}
                  className="py-2 text-[9px] font-medium text-white/25"
                >
                  {day}
                </span>
              ))}

            </div>


            {/* Dates */}

            <div className="mt-1 grid grid-cols-7 gap-y-2 text-center">

              {calendarDays.map(
                (day, index) => {

                  if (!day) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="flex justify-center"
                      >
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
                  ).padStart(2, '0')}-${String(dayNumber).padStart(
                    2,
                    '0',
                  )}`

                  const hasEvent =
                    eventDates.has(dateKey)

                  const isToday =
                    isSameDay(date, today)

                  return (
                    <div
                      key={`${day}-${index}`}
                      className="flex justify-center"
                    >

                      <div
                        className={`
                          relative flex size-8 items-center justify-center
                          rounded-full text-[10px]
                          transition
                          ${
                            isToday
                              ? 'bg-white font-semibold text-black'
                              : hasEvent
                                ? 'bg-white/[0.08] text-white'
                                : 'text-white/45'
                          }
                        `}
                      >

                        {day}

                        {hasEvent && !isToday && (
                          <span className="absolute bottom-1 size-1 rounded-full bg-pink-400" />
                        )}

                      </div>

                    </div>
                  )
                },
              )}

            </div>

          </div>


          {/* Footer */}

          <div className="mt-10 flex items-center gap-3 border-t border-white/[0.07] pt-5">

            <div className="flex -space-x-2">

              <div className="flex size-7 items-center justify-center rounded-full border-2 border-[#111111] bg-blue-400/20 text-[9px]">
                F
              </div>

              <div className="flex size-7 items-center justify-center rounded-full border-2 border-[#111111] bg-pink-400/20 text-[9px]">
                Y
              </div>

            </div>

            <p className="text-[10px] text-white/30">
              {events.length} moments planned
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          RIGHT — UPCOMING EVENTS
      ===================================================== */}

      <div className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">

        <div className="rounded-[1.7rem] bg-[#f8f8f7] p-5 md:p-7">

          {/* Header */}

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Upcoming moments
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                Things to look forward to.
              </h3>

            </div>


            <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">

              <CalendarDays
                size={16}
                className="text-neutral-500"
              />

            </div>

          </div>


          {/* Events */}

          <div className="mt-8 space-y-2">

            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}

          </div>


          {/* Bottom */}

          <div className="mt-4 flex items-center justify-between rounded-[1.4rem] bg-white p-4">

            <div>

              <p className="text-[10px] text-neutral-400">
                {getMonthShort(currentMonth)}
              </p>

              <p className="mt-1 text-sm font-medium tracking-[-0.02em]">
                {events.length} moments together
              </p>

            </div>


            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800"
            >
              <ArrowUpRight size={14} />
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}