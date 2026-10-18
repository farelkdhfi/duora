'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'

import {
  createGoalSchema,
  type CreateGoalFormValues,
} from '../schemas'

import { useCreateGoal } from '../queries'
import { getGoalErrorKey } from '../errors'

interface CreateGoalFormModalProps {
  relationshipId: string
  open: boolean
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

export default function CreateGoalFormModal({
  relationshipId,
  open,
  onClose,
}: CreateGoalFormModalProps) {
  const t = useTranslations('goals.form')
  const tv = useTranslations('goals.validation')
  const tc = useTranslations('goals.categories')
  const te = useTranslations('goals.errors')
  const tCommon = useTranslations('common')

  const schema = useMemo(() => createGoalSchema(tv), [tv])

  const mutation = useCreateGoal()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGoalFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'personal',
    },
  })

  if (!open) {
    return null
  }

  function onSubmit(values: CreateGoalFormValues) {
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
                  {t('eyebrow')}
                </p>

                <h2 className="mt-4 text-3xl font-semibold leading-none tracking-[-0.055em] text-secondary sm:text-4xl">
                  {t('title')}
                </h2>

                <p className="mt-4 max-w-md text-[13px] leading-6 text-description sm:text-sm">
                  {t('description')}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full bg-subprimary px-4 py-2 text-[12px] font-medium text-description transition hover:text-secondary"
              >
                {tCommon('close')}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-9">
              <div className="space-y-7">

                {/* Details */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-description">
                      {t('sections.details')}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Goal name */}
                    <div>
                      <FieldLabel htmlFor="title">
                        {t('fields.title')}
                      </FieldLabel>

                      <input
                        id="title"
                        {...register('title')}
                        placeholder={t('placeholders.title')}
                        className={inputClass}
                      />

                      {errors.title && (
                        <p className={errorClass}>{errors.title.message}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <FieldLabel htmlFor="category">
                        {t('fields.category')}
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
                            className="bg-primary text-secondary"
                          >
                            {tc(value)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <FieldLabel htmlFor="description">
                        {t('fields.description')}
                      </FieldLabel>

                      <textarea
                        id="description"
                        {...register('description')}
                        placeholder={t('placeholders.description')}
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

                {/* Target */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-description">
                      {t('sections.target')}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    {/* Amount */}
                    <div>
                      <FieldLabel htmlFor="targetAmount">
                        {t('fields.targetAmount')}
                      </FieldLabel>

                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-[12px] font-medium text-description">
                          Rp
                        </span>

                        <input
                          id="targetAmount"
                          {...register('targetAmount', {
                            setValueAs: (value) =>
                              value === '' ? undefined : Number(value),
                          })}
                          type="number"
                          min="0"
                          placeholder={t('placeholders.targetAmount')}
                          className={`${inputClass} pl-10`}
                        />
                      </div>

                      {errors.targetAmount && (
                        <p className={errorClass}>
                          {errors.targetAmount.message}
                        </p>
                      )}
                    </div>

                    {/* Deadline */}
                    <div>
                      <FieldLabel htmlFor="deadline">
                        {t('fields.deadline')}
                      </FieldLabel>

                      <input
                        id="deadline"
                        {...register('deadline')}
                        type="date"
                        className={`${inputClass} [color-scheme:dark]`}
                      />

                      {errors.deadline && (
                        <p className={errorClass}>{errors.deadline.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error */}
                {mutation.error && (
                  <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3">
                    <p className="text-[11px] font-medium text-rose-400">
                      {te(getGoalErrorKey(mutation.error))}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] text-description">
                    {t('footerNote')}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-11 rounded-full bg-subprimary px-6 text-[12px] font-medium text-secondary transition hover:bg-white/10"
                    >
                      {tCommon('cancel')}
                    </button>

                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="h-11 rounded-full bg-subprimary px-7 text-[12px] font-medium text-secondary transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {mutation.isPending ? t('submitting') : t('submit')}
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