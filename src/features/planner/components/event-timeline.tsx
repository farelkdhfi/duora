'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { useFormatter, useTimeZone, useTranslations } from 'next-intl'

import { parseDateOnly, UTC, wallClock, zonedNow } from '@/lib/date'

import type { PlannerEvent } from '../types'
import EventCard from './event-card'
import type { EventStatus, Participant } from './event-card'

interface EventTimelineProps {
  events: PlannerEvent[]
  /** Tanggal terpilih, format `YYYY-MM-DD` */
  selectedDate: string
  participants?: Participant[]
}

/** Plan tanpa jam selesai dianggap berlangsung 1 jam. */
const DEFAULT_DURATION_MIN = 60

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

function getStatus(
  event: PlannerEvent,
  now: Date,
  timeZone?: string,
): EventStatus {
  // "Sekarang" menurut timezone user, bukan timezone mesin
  const { dateKey: todayKey, minutes: nowMin } = zonedNow(timeZone, now)

  if (event.event_date > todayKey) return 'upcoming'
  if (event.event_date < todayKey) return 'done'

  // hari ini
  if (event.is_all_day || !event.start_time) return 'in-progress'

  const start = toMinutes(event.start_time)
  const end = event.end_time
    ? toMinutes(event.end_time)
    : start + DEFAULT_DURATION_MIN

  if (nowMin < start) return 'upcoming'
  if (nowMin < end) return 'in-progress'
  return 'done'
}

export default function EventTimeline({
  events,
  selectedDate,
  participants,
}: EventTimelineProps) {
  const t = useTranslations('planner.timeline')
  const format = useFormatter()
  const timeZone = useTimeZone()

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  // perbarui status (Upcoming / In Progress / Done) tiap menit
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  // semua plan di tanggal terpilih; all-day dulu, lalu urut jam mulai
  const dayEvents = useMemo(() => {
    const sortKey = (event: PlannerEvent) =>
      event.is_all_day || !event.start_time ? '' : event.start_time

    return events
      .filter((event) => event.event_date === selectedDate)
      .sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
  }, [events, selectedDate])

  /** "13:30:00" -> "1 PM" (en) / "13.00" (id) */
  const hourLabel = (time: string) =>
    format.dateTime(wallClock(Number(time.split(':')[0])), {
      hour: 'numeric',
      ...UTC,
    })

  const dateLabel = format.dateTime(parseDateOnly(selectedDate), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...UTC,
  })

  return (
    <section aria-label={t('ariaLabel', { date: dateLabel })}>
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h3 className="text-[13px] font-medium text-neutral-200">{dateLabel}</h3>

        <span className="text-[11px] text-neutral-500">
          {t('count', { count: dayEvents.length })}
        </span>
      </div>

      {dayEvents.length === 0 ? (
        <div className="mt-6 flex flex-col items-center py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-dashed border-white/[0.12] text-neutral-500">
            <CalendarDays size={18} strokeWidth={1.5} />
          </div>

          <p className="mt-3 text-[14px] font-medium text-neutral-100">
            {t('emptyDayTitle')}
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">
            {t('emptyDayDescription')}
          </p>
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {dayEvents.map((event) => {
            const expanded = expandedId === event.id
            const label =
              event.is_all_day || !event.start_time
                ? t('allDay')
                : hourLabel(event.start_time)

            return (
              <li key={event.id} className="flex items-start gap-3">
                {/* rail jam: jadi pill saat card dibuka */}
                <div className="w-14 shrink-0 pt-3.5">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors duration-300 ${
                      expanded
                        ? 'bg-white/[0.14] text-white'
                        : 'text-neutral-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <EventCard
                    event={event}
                    status={getStatus(event, now, timeZone)}
                    expanded={expanded}
                    onToggle={() =>
                      setExpandedId((current) =>
                        current === event.id ? null : event.id,
                      )
                    }
                    participants={participants}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}