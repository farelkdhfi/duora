'use client'

import {
  CalendarDays,
  Clock3,
  Tag,
  X,
} from 'lucide-react'
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
  'mt-2 w-full rounded-[1rem] border border-black/[0.06] bg-[#f8f8f7] px-4 py-3.5 text-[13px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/[0.12] focus:bg-white focus:ring-4 focus:ring-black/[0.03] disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400'

const errorClass =
  'mt-2 text-[11px] font-medium text-rose-500'

function FieldLabel({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-full bg-white shadow-sm">
        {icon}
      </div>

      <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
        {children}
      </label>
    </div>
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

  function onSubmit(
    values: CreatePlannerEventFormValues,
  ) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.16)]">

        {/* =====================================================
            AMBIENT
        ===================================================== */}

        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-pink-100/50 blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-blue-100/40 blur-[100px]" />


        {/* =====================================================
            CONTENT SCROLL
        ===================================================== */}

        <div className="modal-scroll relative max-h-[90vh] overflow-y-auto">

          <div className="p-5 sm:p-7 md:p-8">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-start justify-between gap-6">

              <div>

                <div className="flex items-center gap-3">

                  <div className="size-1.5 rounded-full bg-pink-500" />

                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    Couple planner
                  </p>

                </div>

                <h2 className="mt-5 text-3xl font-semibold leading-none tracking-[-0.055em] text-neutral-900 sm:text-4xl">
                  Create a moment.
                </h2>

                <p className="mt-4 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
                  Add something worth remembering to your shared calendar.
                </p>

              </div>


              <button
                type="button"
                onClick={onClose}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f8f8f7] text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
              >
                <X size={15} />
              </button>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-9"
            >

              <div className="space-y-7">


                {/* =============================================
                    BASIC INFORMATION
                ============================================= */}

                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-300">
                      Details
                    </span>

                    <div className="h-px flex-1 bg-black/[0.05]" />

                  </div>


                  <div className="grid gap-5 sm:grid-cols-2">


                    {/* Event name */}

                    <div>

                      <FieldLabel
                        icon={
                          <CalendarDays
                            size={13}
                            className="text-neutral-500"
                          />
                        }
                      >
                        Event name
                      </FieldLabel>

                      <input
                        id="title"
                        {...register('title')}
                        placeholder="Anniversary dinner"
                        className={inputClass}
                      />

                      {errors.title && (
                        <p className={errorClass}>
                          {errors.title.message}
                        </p>
                      )}

                    </div>


                    {/* Category */}

                    <div>

                      <FieldLabel
                        icon={
                          <Tag
                            size={13}
                            className="text-neutral-500"
                          />
                        }
                      >
                        Category
                      </FieldLabel>

                      <select
                        id="category"
                        {...register('category')}
                        className={`${inputClass} cursor-pointer appearance-none`}
                      >

                        {categories.map(
                          (category) => (
                            <option
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </option>
                          ),
                        )}

                      </select>

                    </div>


                    {/* Description */}

                    <div className="sm:col-span-2">

                      <FieldLabel
                        icon={
                          <Tag
                            size={13}
                            className="text-neutral-500"
                          />
                        }
                      >
                        Description
                      </FieldLabel>

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


                {/* =============================================
                    DATE & TIME
                ============================================= */}

                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-300">
                      When
                    </span>

                    <div className="h-px flex-1 bg-black/[0.05]" />

                  </div>


                  <div className="grid gap-5 sm:grid-cols-2">


                    {/* Date */}

                    <div>

                      <FieldLabel
                        icon={
                          <CalendarDays
                            size={13}
                            className="text-blue-400"
                          />
                        }
                      >
                        Date
                      </FieldLabel>

                      <input
                        id="eventDate"
                        {...register('eventDate')}
                        type="date"
                        className={inputClass}
                      />

                      {errors.eventDate && (
                        <p className={errorClass}>
                          {errors.eventDate.message}
                        </p>
                      )}

                    </div>


                    {/* All day */}

                    <div>

                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                        Schedule
                      </p>

                      <label className="mt-2 flex h-[50px] cursor-pointer items-center justify-between rounded-[1rem] border border-black/[0.06] bg-[#f8f8f7] px-4 transition hover:bg-white">

                        <div>

                          <p className="text-[12px] font-medium text-neutral-700">
                            All day
                          </p>

                          <p className="mt-0.5 text-[10px] text-neutral-400">
                            No specific time
                          </p>

                        </div>


                        <div className="relative">

                          <input
                            {...register('isAllDay')}
                            type="checkbox"
                            className="peer sr-only"
                          />

                          <div className="h-6 w-10 rounded-full bg-neutral-200 transition peer-checked:bg-neutral-900" />

                          <div className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />

                        </div>

                      </label>

                    </div>


                    {/* Start */}

                    <div>

                      <FieldLabel
                        icon={
                          <Clock3
                            size={13}
                            className="text-pink-400"
                          />
                        }
                      >
                        Start time
                      </FieldLabel>

                      <input
                        id="startTime"
                        {...register('startTime')}
                        type="time"
                        disabled={isAllDay}
                        className={inputClass}
                      />

                      {errors.startTime && (
                        <p className={errorClass}>
                          {errors.startTime.message}
                        </p>
                      )}

                    </div>


                    {/* End */}

                    <div>

                      <FieldLabel
                        icon={
                          <Clock3
                            size={13}
                            className="text-blue-400"
                          />
                        }
                      >
                        End time
                      </FieldLabel>

                      <input
                        id="endTime"
                        {...register('endTime')}
                        type="time"
                        disabled={isAllDay}
                        className={inputClass}
                      />

                      {errors.endTime && (
                        <p className={errorClass}>
                          {errors.endTime.message}
                        </p>
                      )}

                    </div>

                  </div>

                </div>


                {/* =============================================
                    MUTATION ERROR
                ============================================= */}

                {mutation.error && (
                  <div className="rounded-[1.25rem] border border-rose-500/10 bg-rose-500/[0.04] px-4 py-3">

                    <p className="text-[11px] font-medium text-rose-500">
                      {mutation.error.message}
                    </p>

                  </div>
                )}


                {/* =============================================
                    FOOTER
                ============================================= */}

                <div className="flex flex-col gap-3 border-t border-black/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-2">

                    <span className="size-1.5 rounded-full bg-pink-400" />

                    <p className="text-[10px] text-neutral-400">
                      Make memories together.
                    </p>

                  </div>


                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex h-11 items-center justify-center rounded-full bg-black px-7 text-[12px] font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {mutation.isPending
                      ? 'Creating...'
                      : 'Create moment'}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      </div>


      <style jsx global>{`
        .modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.12) transparent;
        }

        .modal-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.12);
          border-radius: 999px;
        }

        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>

    </div>
  )
}