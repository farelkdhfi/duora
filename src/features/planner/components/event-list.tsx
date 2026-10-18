'use client'

import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { useFormatter, useTimeZone, useTranslations } from 'next-intl'

import { parseDateOnly, UTC, zonedNow } from '@/lib/date'


import { useGetMyProfile } from '@/features/profiles/queries'
import { useGetPartnerName } from '@/features/checkins/queries'

import { usePlannerEvents } from '../queries'
import { getPlannerErrorKey } from '../errors'

import type { PlannerEvent } from '../types'
import EventCalendar, { EventCalendarSkeleton } from './event-calendar'
import EventTimeline from './event-timeline'

interface EventListProps {
  relationshipId: string
}

export default function EventList({ relationshipId }: EventListProps) {
  const t = useTranslations('planner')
  const te = useTranslations('planner.errors')

  const format = useFormatter()
  const timeZone = useTimeZone()

  const [selectedDate, setSelectedDate] = useState(
    () => zonedNow(timeZone).dateKey,
  )

  const { data, isLoading, error } = usePlannerEvents(relationshipId)
  const { data: user } = useGetMyProfile()
  const { data: partner } = useGetPartnerName()

  const events = useMemo(() => (data ?? []) as PlannerEvent[], [data])

  /* =========================================================
     EVENT DATES (titik di kalender)
  ========================================================= */

  const eventDates = useMemo(
    () => new Set(events.map((event) => event.event_date)),
    [events],
  )

  /** Tanggal plan terdekat setelah tanggal yang sedang dilihat */
  const nextDate = useMemo(
    () => Array.from(eventDates).sort().find((date) => date > selectedDate),
    [eventDates, selectedDate],
  )

  /** Avatar di tiap card: kamu + partner */
  const participants = useMemo(
    () => [
      {
        id: user?.id,
        name: user?.display_name ?? t('people.you'),
        avatarUrl: user?.avatar_url,
      },
      {
        name: partner?.display_name ?? t('people.partner'),
        avatarUrl: partner?.avatar_url,
      },
    ],
    [user, partner, t],
  )

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div>
        {/* Calendar skeleton */}
        <EventCalendarSkeleton />

        {/* Timeline skeleton */}
        <div className="mt-6 animate-pulse">
          <div className="flex items-baseline justify-between px-1">
            <div className="h-3.5 w-40 rounded-full bg-white/[0.08]" />
            <div className="h-2.5 w-10 rounded-full bg-white/[0.06]" />
          </div>

          <div className="mt-3 space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-3.5 h-4 w-14 shrink-0 rounded-full bg-white/[0.06]" />

                <div className="h-[104px] min-w-0 flex-1 rounded-[1.4rem] border border-white/[0.06] bg-white/[0.04] p-4">
                  <div className="h-3 w-40 rounded-full bg-white/[0.1]" />
                  <div className="mt-2 h-2.5 w-20 rounded-full bg-white/[0.06]" />

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      <div className="size-6 rounded-full bg-white/[0.1]" />
                      <div className="size-6 rounded-full bg-white/[0.08]" />
                    </div>

                    <div className="h-2.5 w-24 rounded-full bg-white/[0.06]" />
                  </div>
                </div>
              </div>
            ))}
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
      <div className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FF3B30]/10">
            <CalendarDays size={16} className="text-[#FF3B30]" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              {t('list.errorLabel')}
            </p>

            <p className="mt-1 text-sm font-semibold tracking-[-0.02em] text-neutral-50">
              {t('list.errorTitle')}
            </p>

            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
              {te(getPlannerErrorKey(error))}
            </p>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================================
     EMPTY (belum ada plan sama sekali)
  ========================================================= */

  if (events.length === 0) {
    return (
      <div>
        <EventCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          eventDates={eventDates}
        />

        <div className="relative mt-6 flex min-h-[300px] items-center justify-center overflow-hidden px-6 py-10">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/[0.08] blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-500/[0.09] blur-[80px]" />

          <div className="relative text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-dashed border-white/[0.14] text-neutral-400">
              <CalendarDays size={22} strokeWidth={1.6} />
            </div>

            <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              {t('list.emptyLabel')}
            </p>

            <h3 className="mt-2 text-[16px] font-semibold tracking-[-0.025em] text-neutral-50">
              {t('list.emptyTitle')}
            </h3>
          </div>
        </div>
      </div>
    )
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  const dayHasEvents = eventDates.has(selectedDate)

  return (
    <div>
      {/* Strip mingguan */}
      <EventCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        eventDates={eventDates}
      />

      {/* Timeline plan di tanggal terpilih */}
      <div className="mt-6">
        <EventTimeline
          events={events}
          selectedDate={selectedDate}
          participants={participants}
        />

        {/* Hari ini kosong tapi ada plan di hari berikutnya */}
        {!dayHasEvents && nextDate && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setSelectedDate(nextDate)}
              className="inline-flex h-8 items-center rounded-full border border-white/[0.08] bg-white/10 px-4 text-[11px] font-medium text-neutral-200 transition hover:bg-white hover:text-neutral-900"
            >
              {t('list.nextPlan', {
                date: format.dateTime(parseDateOnly(nextDate), {
                  month: 'short',
                  day: 'numeric',
                  ...UTC,
                }),
              })}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}