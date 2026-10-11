'use client'

import { CalendarDays } from 'lucide-react'
import { useMemo } from 'react'

import { usePlannerEvents } from '../queries'
import EventCalendar, { EventCalendarSkeleton } from './event-calendar'
import EventCard from './event-card'

interface EventListProps {
  relationshipId: string
}

export default function EventList({ relationshipId }: EventListProps) {
  const {
    data: events,
    isLoading,
    error,
  } = usePlannerEvents(relationshipId)

  /* =========================================================
     EVENT DATES
  ========================================================= */

  const eventDates = useMemo(() => {
    if (!events) return new Set<string>()

    return new Set(events.map((event) => event.event_date))
  }, [events])

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT — CALENDAR SKELETON */}

        <EventCalendarSkeleton />

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

        <EventCalendar showNavigation={false} />

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
      {/* LEFT — CALENDAR */}

      <EventCalendar eventDates={eventDates} />

      {/* RIGHT — UPCOMING EVENTS */}

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