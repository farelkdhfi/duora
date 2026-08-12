'use client'

import { CalendarDays, Clock3, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  createPlannerEventSchema,
  type CreatePlannerEventFormValues,
} from '../schemas'

import { useCreatePlannerEvent } from '../queries'

interface CreateEventFormProps {
  relationshipId: string
  onSuccess?: () => void
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
  'mt-2 w-full rounded-2xl border border-black/[0.07] bg-[#F9F9FB] px-4 py-3 text-[14px] text-[#1C1C1E] outline-none transition-all placeholder:text-[#AEAEB2] focus:border-[#007AFF]/30 focus:bg-white focus:ring-4 focus:ring-[#007AFF]/[0.07] disabled:cursor-not-allowed disabled:bg-[#F2F2F7] disabled:text-[#AEAEB2]'

const labelClass =
  'block text-[12px] font-semibold tracking-wide text-[#48484A]'

const errorClass =
  'mt-1.5 text-[12px] font-medium text-[#FF3B30]'

export default function CreateEventForm({
  relationshipId,
  onSuccess,
}: CreateEventFormProps) {
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

  function onSubmit(values: CreatePlannerEventFormValues) {
    mutation.mutate(
      {
        relationshipId,
        values,
      },
      {
        onSuccess: () => {
          reset()
          onSuccess?.()
        },
      },
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className={labelClass}
        >
          Event name
        </label>

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

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className={labelClass}
        >
          Description
        </label>

        <textarea
          id="description"
          {...register('description')}
          placeholder="Dinner at our favorite restaurant..."
          className={`${inputClass} min-h-[92px] resize-none`}
        />

        {errors.description && (
          <p className={errorClass}>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <div className="flex items-center gap-1.5">
          <Tag
            size={13}
            strokeWidth={2.25}
            className="text-[#8E8E93]"
          />

          <label
            htmlFor="category"
            className={labelClass}
          >
            Category
          </label>
        </div>

        <select
          id="category"
          {...register('category')}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          {categories.map((category) => (
            <option
              key={category.value}
              value={category.value}
            >
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <div className="flex items-center gap-1.5">
          <CalendarDays
            size={13}
            strokeWidth={2.25}
            className="text-[#8E8E93]"
          />

          <label
            htmlFor="eventDate"
            className={labelClass}
          >
            Date
          </label>
        </div>

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
      <label className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-black/[0.05] bg-[#F9F9FB] px-4 py-3.5 transition hover:bg-[#F5F5F7]">
        <div>
          <p className="text-[13px] font-semibold text-[#1C1C1E]">
            All day
          </p>

          <p className="mt-0.5 text-[11px] text-[#8E8E93]">
            This event doesn't have a specific time
          </p>
        </div>

        <div className="relative">
          <input
            {...register('isAllDay')}
            type="checkbox"
            className="peer sr-only"
          />

          <div className="h-6 w-10 rounded-full bg-[#D1D1D6] transition peer-checked:bg-[#007AFF]" />

          <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform peer-checked:translate-x-4" />
        </div>
      </label>

      {/* Time */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <Clock3
            size={13}
            strokeWidth={2.25}
            className="text-[#8E8E93]"
          />

          <p className={labelClass}>
            Time
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="startTime"
              className="text-[11px] font-medium text-[#8E8E93]"
            >
              Start
            </label>

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

          <div>
            <label
              htmlFor="endTime"
              className="text-[11px] font-medium text-[#8E8E93]"
            >
              End
            </label>

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

      {/* Error */}
      {mutation.error && (
        <div className="rounded-2xl border border-[#FF3B30]/10 bg-[#FF3B30]/[0.04] px-4 py-3">
          <p className="text-[12px] font-medium leading-relaxed text-[#FF3B30]">
            {mutation.error.message}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-2xl bg-[#1C1C1E] py-3.5 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_8px_20px_-8px_rgba(0,0,0,0.4)] transition-all duration-200 hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mutation.isPending
          ? 'Creating…'
          : 'Create Event'}
      </button>
    </form>
  )
}