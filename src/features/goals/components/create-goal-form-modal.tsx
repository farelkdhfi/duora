'use client'

import {
  CalendarDays,
  Loader2,
  Target,
  Tag,
  Wallet,
  X,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  createGoalSchema,
  type CreateGoalFormValues,
} from '../schemas'

import { useCreateGoal } from '../queries'

interface CreateGoalFormModalProps {
  relationshipId: string
  open: boolean
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

export default function CreateGoalFormModal({
  relationshipId,
  open,
  onClose,
}: CreateGoalFormModalProps) {
  const mutation = useCreateGoal()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGoalFormValues>({
    resolver: zodResolver(createGoalSchema),

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
            SCROLL AREA
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
                    Shared goal
                  </p>

                </div>

                <h2 className="mt-5 text-3xl font-semibold leading-none tracking-[-0.055em] text-neutral-900 sm:text-4xl">
                  Build something together.
                </h2>

                <p className="mt-4 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
                  Turn something you both want into a goal worth working toward.
                </p>

              </div>


              {/* Close */}

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
                    GOAL DETAILS
                ============================================= */}

                <div>

                  <div className="mb-4 flex items-center gap-2">

                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-300">
                      Details
                    </span>

                    <div className="h-px flex-1 bg-black/[0.05]" />

                  </div>


                  <div className="grid gap-5 sm:grid-cols-2">


                    {/* Goal name */}

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
                        placeholder="Our dream vacation"
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
                        placeholder="Save together for our trip..."
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
                    TARGET
                ============================================= */}

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
                          placeholder="10.000.000"
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


                {/* =============================================
                    ERROR
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
                      Small steps. Shared dreams.
                    </p>

                  </div>


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

                        Creating...
                      </>
                    ) : (
                      'Create goal'
                    )}

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      </div>


      {/* =====================================================
          SCROLLBAR
      ===================================================== */}

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