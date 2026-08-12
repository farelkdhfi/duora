'use client'

import { CalendarDays, Clock, Trash2 } from 'lucide-react'

import type { PlannerEvent } from '../types'

import { useDeletePlannerEvent } from '../queries'

interface EventCardProps {
  event: PlannerEvent
}

const categoryLabels: Record<PlannerEvent['category'], string> = {
  relationship: 'Relationship',
  finance: 'Finance',
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  travel: 'Travel',
  health: 'Health',
  work: 'Work',
  other: 'Other',
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':')
  return `${hours}:${minutes}`
}

export default function EventCard({ event }: EventCardProps) {
  const deleteMutation = useDeletePlannerEvent()

  const date = new Date(`${event.event_date}T00:00:00`)

  return (
    <div className="group flex gap-4 rounded-[24px] border border-neutral-200/70 bg-white/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_10px_28px_-14px_rgba(0,0,0,0.08)] backdrop-blur-xl transition hover:border-neutral-300/70">
      <div className="flex h-13 w-13 h-13 shrink-0 flex-col items-center justify-center rounded-2xl bg-neutral-50 px-1 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
          {date.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-[19px] font-semibold tracking-[-0.02em] text-neutral-900">
          {date.getDate()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              {categoryLabels[event.category]}
            </p>
            <h3 className="mt-1 truncate text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
              {event.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => deleteMutation.mutate(event.id)}
            disabled={deleteMutation.isPending}
            aria-label="Delete event"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {event.description && (
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-500">
            {event.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[12.5px] text-neutral-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13.5} />
            {formatDate(event.event_date)}
          </span>

          {event.is_all_day ? (
            <span className="rounded-full bg-neutral-50 px-2 py-0.5 text-[11.5px] font-medium text-neutral-500">
              All day
            </span>
          ) : (
            event.start_time && (
              <span className="flex items-center gap-1.5">
                <Clock size={13.5} />
                {formatTime(event.start_time)}
                {event.end_time && ` – ${formatTime(event.end_time)}`}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}