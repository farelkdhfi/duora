'use client'

import {
  CalendarDays,
  Loader2,
  Tag,
  Target,
  Wallet,
  X,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  createGoalSchema,
  type CreateGoalFormValues,
} from '../schemas'

import { useUpdateGoal } from '../queries'
import type { Goal } from '../types'

interface EditGoalFormProps {
  goal: Goal
  onClose: () => void
}

const categories = [
  { value: 'personal', label: 'Personal' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'house', label: 'House' },
  { value: 'education', label: 'Education' },
  { value: 'business', label: 'Business' },
  { value: 'savings', label: 'Savings' },
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

export default function EditGoalForm({
  goal,
  onClose,
}: EditGoalFormProps) {
  const mutation = useUpdateGoal(
    goal.relationship_id,
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGoalFormValues>({
    resolver: zodResolver(createGoalSchema),

    defaultValues: {
      title: goal.title,
      description: goal.description ?? undefined,
      category: goal.category,
      targetAmount: goal.target_amount ?? undefined,
      deadline: goal.deadline ?? undefined,
    },
  })

  function onSubmit(values: CreateGoalFormValues) {
    mutation.mutate(
      {
        goalId: goal.id,
        values,
      },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_20px_70px_-35px_rgba(0,0,0,0.18)]">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-100/40 blur-[90px]" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-pink-100/30 blur-[90px]" />

      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#FFD166] via-[#FF6B8A] to-[#007AFF]" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-neutral-400">
              Editing goal
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-neutral-900 sm:text-3xl">
              Update the details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f8f8f7] text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8"
        >
          <div className="space-y-7">
            {/* DETAILS */}

            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-300">
                  Details
                </span>

                <div className="h-px flex-1 bg-black/[0.05]" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Title */}

                <div>
                  <FieldLabel
                    icon={
                      <Target
                        size={13}
                        className="text-pink-400"
                      />
                    }
                  >
                    Goal name
                  </FieldLabel>

                  <input
                    id="title"
                    {...register('title')}
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

            {/* TARGET */}

            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-300">
                  Target
                </span>

                <div className="h-px flex-1 bg-black/[0.05]" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Amount */}

                <div>
                  <FieldLabel
                    icon={
                      <Wallet
                        size={13}
                        className="text-blue-400"
                      />
                    }
                  >
                    Target amount
                  </FieldLabel>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-neutral-400">
                      Rp
                    </span>

                    <input
                      id="targetAmount"
                      {...register(
                        'targetAmount',
                        {
                          setValueAs: (
                            value,
                          ) =>
                            value === ''
                              ? undefined
                              : Number(
                                  value,
                                ),
                        },
                      )}
                      type="number"
                      min="0"
                      className={`${inputClass} pl-10`}
                    />
                  </div>

                  {errors.targetAmount && (
                    <p className={errorClass}>
                      {
                        errors.targetAmount
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Deadline */}

                <div>
                  <FieldLabel
                    icon={
                      <CalendarDays
                        size={13}
                        className="text-pink-400"
                      />
                    }
                  >
                    Deadline
                  </FieldLabel>

                  <input
                    id="deadline"
                    {...register('deadline')}
                    type="date"
                    className={inputClass}
                  />

                  {errors.deadline && (
                    <p className={errorClass}>
                      {errors.deadline.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ERROR */}

            {mutation.error && (
              <div className="rounded-[1.25rem] border border-rose-500/10 bg-rose-500/[0.04] px-4 py-3">
                <p className="text-[11px] font-medium text-rose-500">
                  {mutation.error.message}
                </p>
              </div>
            )}

            {/* FOOTER */}

            <div className="flex flex-col gap-3 border-t border-black/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={mutation.isPending}
                className="flex h-11 items-center justify-center rounded-full border border-black/[0.08] px-6 text-[12px] font-medium text-neutral-500 transition hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-black px-7 text-[12px] font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}