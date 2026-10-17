'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  createPlannerEventSchema,
  type CreatePlannerEventFormValues,
} from '../schemas'

import { useCreatePlannerEvent } from '../queries'

interface CreateEventFormModalProps {
  relationshipId: string
  open: boolean
  onClose: () => void
}

const categories = [
  { value: 'relationship', label: 'Relationship' },
  { value: 'finance', label: 'Finance' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'travel', label: 'Travel' },
  { value: 'health', label: 'Health' },
  { value: 'work', label: 'Work' },
  { value: 'other', label: 'Other' },
] as const

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-subprimary px-4 py-3.5 text-[13px] text-secondary outline-none transition placeholder:text-description focus:border-white/25 focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:opacity-50'

const errorClass = 'mt-2 text-[11px] font-medium text-rose-400'

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-medium uppercase tracking-[0.14em] text-description"
    >
      {children}
    </label>
  )
}

export default function CreateEventFormModal({
  relationshipId,
  open,
  onClose,
}: CreateEventFormModalProps) {
  const mutation = useCreatePlannerEvent()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreatePlannerEventFormValues>({
    resolver: zodResolver(createPlannerEventSchema),
    defaultValues: {
      category: 'relationship',
      isAllDay: false,
      eventDate: '',
      startTime: '',
      endTime: '',
    },
  })

  const isAllDay = watch('isAllDay')

  if (!open) {
    return null
  }

  function onSubmit(values: CreatePlannerEventFormValues) {
    mutation.mutate(
      {
        relationshipId,
        values,
      },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
      },
    )
  }

  return (
    <div
      className="fixed inset-0 z-[53] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full overflow-hidden rounded-t-[2rem] border-x-0 border-b-0 border-t border-white/10 bg-primary">

        {/* Gradient halus di bagian atas */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.06] to-transparent" />

        {/* Handle */}
        <div className="relative flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-white/15" />
        </div>

        {/* Scroll area */}
        <div className="modal-scroll relative max-h-[calc(90vh-1.75rem)] overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl p-5 sm:p-7 md:p-8">

            {/* Header */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-description">
                  Couple planner
                </p>

                <h2 className="mt-4 text-3xl font-semibold leading-none tracking-[-0.055em] text-secondary sm:text-4xl">
                  Create a moment.
                </h2>

                <p className="mt-4 max-w-md text-[13px] leading-6 text-description sm:text-sm">
                  Add something worth remembering to your shared calendar.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full bg-subprimary px-4 py-2 text-[12px] font-medium text-description transition hover:text-secondary"
              >
                Close
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-9">
              <div className="space-y-7">

                {/* Details */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-description">
                      Details
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Event name */}
                    <div>
                      <FieldLabel htmlFor="title">Event name</FieldLabel>

                      <input
                        id="title"
                        {...register('title')}
                        placeholder="Anniversary dinner"
                        className={inputClass}
                      />

                      {errors.title && (
                        <p className={errorClass}>{errors.title.message}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <FieldLabel htmlFor="category">Category</FieldLabel>

                      <select
                        id="category"
                        {...register('category')}
                        className={`${inputClass} cursor-pointer appearance-none`}
                      >
                        {categories.map((category) => (
                          <option
                            key={category.value}
                            value={category.value}
                            className="bg-primary text-secondary"
                          >
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <FieldLabel htmlFor="description">Description</FieldLabel>

                      <textarea
                        id="description"
                        {...register('description')}
                        placeholder="Dinner at our favorite restaurant..."
                        className={`${inputClass} min-h-[100px] resize-none`}
                      />

                      {errors.description && (
                        <p className={errorClass}>
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* When */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-description">
                      When
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Date */}
                    <div>
                      <FieldLabel htmlFor="eventDate">Date</FieldLabel>

                      <input
                        id="eventDate"
                        {...register('eventDate')}
                        type="date"
                        className={`${inputClass} [color-scheme:dark]`}
                      />

                      {errors.eventDate && (
                        <p className={errorClass}>
                          {errors.eventDate.message}
                        </p>
                      )}
                    </div>

                    {/* All day */}
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-description">
                        Schedule
                      </p>

                      <label className="mt-2 flex h-[50px] cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-subprimary px-4 transition hover:border-white/25">
                        <div>
                          <p className="text-[12px] font-medium text-secondary">
                            All day
                          </p>

                          <p className="mt-0.5 text-[10px] text-description">
                            No specific time
                          </p>
                        </div>

                        <div className="relative">
                          <input
                            {...register('isAllDay')}
                            type="checkbox"
                            className="peer sr-only"
                          />

                          <div className="h-6 w-10 rounded-full bg-white/10 transition peer-checked:bg-secondary" />

                          <div className="absolute left-0.5 top-0.5 size-5 rounded-full bg-secondary transition-transform peer-checked:translate-x-4 peer-checked:bg-primary" />
                        </div>
                      </label>
                    </div>

                    {/* Start */}
                    <div>
                      <FieldLabel htmlFor="startTime">Start time</FieldLabel>

                      <input
                        id="startTime"
                        {...register('startTime')}
                        type="time"
                        disabled={isAllDay}
                        className={`${inputClass} [color-scheme:dark]`}
                      />

                      {errors.startTime && (
                        <p className={errorClass}>
                          {errors.startTime.message}
                        </p>
                      )}
                    </div>

                    {/* End */}
                    <div>
                      <FieldLabel htmlFor="endTime">End time</FieldLabel>

                      <input
                        id="endTime"
                        {...register('endTime')}
                        type="time"
                        disabled={isAllDay}
                        className={`${inputClass} [color-scheme:dark]`}
                      />

                      {errors.endTime && (
                        <p className={errorClass}>{errors.endTime.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mutation error */}
                {mutation.error && (
                  <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3">
                    <p className="text-[11px] font-medium text-rose-400">
                      {mutation.error.message}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] text-description">
                    Make memories together.
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-11 rounded-full bg-subprimary px-6 text-[12px] font-medium text-secondary transition hover:bg-white/10"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="h-11 rounded-full bg-subprimary px-7 text-[12px] font-medium text-secondary transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {mutation.isPending ? 'Creating...' : 'Create moment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }

        .modal-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 999px;
        }

        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  )
}