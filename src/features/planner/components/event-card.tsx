'use client'

import {
  CalendarDays,
  Clock,
  Trash2,
} from 'lucide-react'

import type { PlannerEvent } from '../types'
import { useDeletePlannerEvent } from '../queries'
import { useState } from 'react'

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
  const [isConfirmingDelete, setIsConfirmingDelete] =
    useState(false)

  const deleteMutation = useDeletePlannerEvent()

  const accent = categoryAccent[event.category]

  const handleDelete = () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }

    deleteMutation.mutate(event.id)
  }

  const handleCancelDelete = () => {
    if (deleteMutation.isPending) return

    setIsConfirmingDelete(false)
  }

  return (
    <div
      className="
        group
        w-full
        overflow-hidden
        rounded-[1.25rem]
        border
        border-black/[0.05]
        bg-white
        shadow-[0_8px_25px_-20px_rgba(0,0,0,0.18)]
        transition-all
        duration-300
        hover:shadow-[0_15px_35px_-20px_rgba(0,0,0,0.16)]
        sm:rounded-[1.35rem]
      "
    >
      {isConfirmingDelete ? (
        /* ===================================================== */
        /* DELETE CONFIRMATION */
        /* ===================================================== */

        <div
          className="
            flex
            min-h-[116px]
            w-full
            flex-col
            items-center
            justify-center
            px-4
            py-5
            text-center

            sm:min-h-[104px]
            sm:flex-row
            sm:justify-between
            sm:px-5
            sm:text-left

            lg:px-6
          "
        >
          <div className="min-w-0">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <div
                className="
                  flex
                  size-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-red-50
                  text-red-500
                "
              >
                <Trash2
                  size={12}
                  strokeWidth={2}
                />
              </div>

              <p
                className="
                  text-[12px]
                  font-semibold
                  tracking-[-0.02em]
                  text-neutral-900

                  sm:text-[13px]
                "
              >
                Delete this event?
              </p>
            </div>

            <p
              className="
                mt-1
                text-[9px]
                leading-5
                text-neutral-400

                sm:ml-9
                sm:text-[10px]
              "
            >
              This action cannot be undone.
            </p>
          </div>

          <div
            className="
              mt-4
              flex
              shrink-0
              items-center
              gap-1.5

              sm:mt-0
              sm:ml-5
            "
          >
            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={deleteMutation.isPending}
              className="
                inline-flex
                min-h-8.5
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.06]
                bg-neutral-50
                px-4
                text-[10px]
                font-semibold
                text-neutral-500
                transition-all
                duration-200
                hover:bg-neutral-100
                hover:text-neutral-700
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:px-4.5
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="
                inline-flex
                min-h-8.5
                items-center
                justify-center
                gap-1.5
                rounded-full
                bg-red-500
                px-4
                text-[10px]
                font-semibold
                text-white
                transition-all
                duration-200
                hover:bg-red-600
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:px-4.5
              "
            >
              <Trash2
                size={11}
                strokeWidth={2}
              />

              {deleteMutation.isPending
                ? 'Deleting...'
                : 'Yes, delete'}
            </button>
          </div>
        </div>
      ) : (
        /* ===================================================== */
        /* NORMAL CARD */
        /* ===================================================== */

        <div
          className="
            flex
            w-full
            items-start
            gap-3
            p-3

            sm:items-center
            sm:gap-4
            sm:p-4

            lg:gap-5
            lg:p-4.5
          "
        >
          {/* DATE */}

          <div
            className="
              flex
              size-11
              shrink-0
              flex-col
              items-center
              justify-center
              rounded-[0.9rem]
              bg-[#f8f8f7]

              sm:size-12
              sm:rounded-[1rem]

              lg:size-13
            "
          >
            <span
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-neutral-400

                sm:text-[9px]
              "
            >
              {new Date(
                `${event.event_date}T00:00:00`,
              ).toLocaleDateString('en-US', {
                month: 'short',
              })}
            </span>

            <span
              className="
                mt-0.5
                text-[17px]
                font-semibold
                leading-none
                tracking-[-0.04em]
                text-neutral-900

                sm:text-lg
              "
            >
              {new Date(
                `${event.event_date}T00:00:00`,
              ).getDate()}
            </span>
          </div>

          {/* CONTENT */}

          <div className="min-w-0 flex-1 pt-0.5 sm:pt-0">
            {/* CATEGORY */}

            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`
                  size-1.5
                  shrink-0
                  rounded-full
                  ${accent}
                `}
              />

              <p
                className="
                  truncate
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-neutral-400

                  sm:text-[9px]
                  lg:text-[10px]
                "
              >
                {categoryLabels[event.category]}
              </p>
            </div>

            {/* TITLE */}

            <h4
              className="
                mt-1.5
                truncate
                text-[13px]
                font-semibold
                tracking-[-0.025em]
                text-neutral-900

                sm:text-[14px]
                lg:text-[15px]
              "
            >
              {event.title}
            </h4>

            {/* META */}

            <div
              className="
                mt-1.5
                flex
                min-w-0
                flex-wrap
                items-center
                gap-x-3
                gap-y-1.5
                text-[9px]
                text-neutral-400

                sm:text-[10px]
                lg:text-[10.5px]
              "
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <CalendarDays
                  size={10}
                  strokeWidth={2}
                  className="shrink-0"
                />

                <span className="truncate">
                  {formatDate(event.event_date)}
                </span>
              </span>

              {!event.is_all_day &&
                event.start_time && (
                  <span className="flex shrink-0 items-center gap-1.5">
                    <Clock
                      size={10}
                      strokeWidth={2}
                    />

                    {formatTime(
                      event.start_time,
                    )}

                    {event.end_time &&
                      ` – ${formatTime(
                        event.end_time,
                      )}`}
                  </span>
                )}

              {event.is_all_day && (
                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-[#f8f8f7]
                    px-2
                    py-0.5
                    text-[8.5px]
                    font-medium
                    text-neutral-500

                    sm:text-[9.5px]
                  "
                >
                  All day
                </span>
              )}
            </div>
          </div>

          {/* DELETE */}

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            aria-label="Delete event"
            className="
              group/delete
              flex
              size-8
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-neutral-200/80
              bg-white
              text-neutral-300
              shadow-[0_2px_8px_rgba(0,0,0,0.035)]
              transition-all
              duration-200

              hover:border-red-100
              hover:bg-red-50
              hover:text-red-500
              active:scale-95

              sm:size-7.5
              sm:border-transparent
              sm:bg-neutral-50/70
              sm:opacity-70
              sm:group-hover:opacity-100
              sm:focus:opacity-100
            "
          >
            <Trash2
              size={12}
              strokeWidth={2}
              className="
                transition-transform
                duration-200
                group-hover/delete:scale-105
              "
            />
          </button>
        </div>
      )}
    </div>
  )
}