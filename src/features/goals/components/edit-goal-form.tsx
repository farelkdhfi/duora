'use client'

import { useMemo } from 'react'
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
import { useTranslations } from 'next-intl'

import {
  createGoalSchema,
  type CreateGoalFormValues,
} from '../schemas'

import { useUpdateGoal } from '../queries'
import { getGoalErrorKey } from '../errors'
import type { Goal } from '../types'

interface EditGoalFormProps {
  goal: Goal
  onClose: () => void
}

const categoryValues = [
  'personal',
  'vacation',
  'wedding',
  'house',
  'education',
  'business',
  'savings',
  'other',
] as const

const inputClass =
  'mt-2 w-full rounded-[1rem] border border-white/[0.06] bg-subprimary px-4 py-3.5 text-[13px] text-secondary outline-none transition placeholder:text-description focus:border-white/20 focus:bg-subprimary focus:ring-4 focus:ring-white/[0.05] disabled:cursor-not-allowed disabled:bg-subprimary/50 disabled:text-description'

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
      <div className="flex size-7 items-center justify-center rounded-full bg-subprimary shadow-sm">
        {icon}
      </div>

      <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-description">
        {children}
      </label>
    </div>
  )
}

export default function EditGoalForm({
  goal,
  onClose,
}: EditGoalFormProps) {
  const t = useTranslations('goals.editForm')
  const tf = useTranslations('goals.form')
  const tv = useTranslations('goals.validation')
  const tc = useTranslations('goals.categories')
  const te = useTranslations('goals.errors')
  const tCommon = useTranslations('common')

  const schema = useMemo(() => createGoalSchema(tv), [tv])

  const mutation = useUpdateGoal(
    goal.relationship_id,
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGoalFormValues>({
    resolver: zodResolver(schema),

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
    <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-primary shadow-[0_20px_70px_-35px_rgba(0,0,0,0.18)]">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-[90px]" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-pink-500/10 blur-[90px]" />

      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#FFD166] via-[#FF6B8A] to-[#007AFF]" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-description">
              {t('eyebrow')}
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-secondary sm:text-3xl">
              {t('title')}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={tCommon('close')}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-subprimary text-description transition hover:bg-secondary hover:text-primary"
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
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-description">
                  {tf('sections.details')}
                </span>

                <div className="h-px flex-1 bg-white/[0.06]" />
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
                    {tf('fields.title')}
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
                        className="text-description"
                      />
                    }
                  >
                    {tf('fields.category')}
                  </FieldLabel>

                  <select
                    id="category"
                    {...register('category')}
                    className={`${inputClass} cursor-pointer appearance-none`}
                  >
                    {categoryValues.map((value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {tc(value)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}

                <div className="sm:col-span-2">
                  <FieldLabel
                    icon={
                      <Tag
                        size={13}
                        className="text-description"
                      />
                    }
                  >
                    {tf('fields.description')}
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
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-description">
                  {tf('sections.target')}
                </span>

                <div className="h-px flex-1 bg-white/[0.06]" />
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
                    {tf('fields.targetAmount')}
                  </FieldLabel>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-description">
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
                    {tf('fields.deadline')}
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
                  {te(getGoalErrorKey(mutation.error))}
                </p>
              </div>
            )}

            {/* FOOTER */}

            <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={mutation.isPending}
                className="flex h-11 items-center justify-center rounded-full border border-white/[0.08] px-6 text-[12px] font-medium text-description transition hover:bg-subprimary hover:text-secondary disabled:opacity-50"
              >
                {tCommon('cancel')}
              </button>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-subprimary px-7 text-[12px] font-medium text-secondary transition hover:bg-subprimary/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                    {t('saving')}
                  </>
                ) : (
                  t('save')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}