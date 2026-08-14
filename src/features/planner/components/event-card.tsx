'use client'

import {
  CalendarDays,
  Clock,
  Trash2,
} from 'lucide-react'

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

const categoryAccent: Record<
  PlannerEvent['category'],
  string
> = {
  relationship: 'bg-pink-400',
  finance: 'bg-blue-400',
  birthday: 'bg-pink-400',
  anniversary: 'bg-pink-400',
  travel: 'bg-blue-400',
  health: 'bg-blue-400',
  work: 'bg-neutral-400',
  other: 'bg-neutral-400',
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  )
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':')
  return `${hours}:${minutes}`
}

export default function EventCard({
  event,
}: EventCardProps) {
  const deleteMutation = useDeletePlannerEvent()

  const accent = categoryAccent[event.category]

  return (
    <div className="group flex items-center gap-4 rounded-[1.25rem] bg-white p-4 transition hover:shadow-sm">

      {/* DATE */}

      <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-[1rem] bg-[#f8f8f7]">
        <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400">
          {new Date(
            `${event.event_date}T00:00:00`,
          ).toLocaleDateString('en-US', {
            month: 'short',
          })}
        </span>

        <span className="mt-0.5 text-lg font-semibold leading-none tracking-[-0.04em] text-neutral-900">
          {new Date(
            `${event.event_date}T00:00:00`,
          ).getDate()}
        </span>
      </div>


      {/* CONTENT */}

      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-2">

          <span
            className={`size-1.5 shrink-0 rounded-full ${accent}`}
          />

          <p className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            {categoryLabels[event.category]}
          </p>

        </div>

        <h4 className="mt-1.5 truncate text-[14px] font-semibold tracking-[-0.025em] text-neutral-900">
          {event.title}
        </h4>

        <div className="mt-1.5 flex items-center gap-3 text-[10.5px] text-neutral-400">

          <span className="flex items-center gap-1.5">
            <CalendarDays size={11} />
            {formatDate(event.event_date)}
          </span>

          {!event.is_all_day && event.start_time && (
            <span className="flex items-center gap-1.5">
              <Clock size={11} />

              {formatTime(event.start_time)}

              {event.end_time &&
                ` – ${formatTime(event.end_time)}`}
            </span>
          )}

          {event.is_all_day && (
            <span className="rounded-full bg-[#f8f8f7] px-2 py-0.5 text-[9.5px] font-medium text-neutral-500">
              All day
            </span>
          )}

        </div>

      </div>


      {/* DELETE */}

      <button
        type="button"
        onClick={() =>
          deleteMutation.mutate(event.id)
        }
        disabled={deleteMutation.isPending}
        aria-label="Delete event"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8f8f7] text-neutral-300 opacity-100 transition hover:bg-black hover:text-white md:opacity-0 md:group-hover:opacity-100"
      >
        <Trash2 size={13} />
      </button>

    </div>
  )
}