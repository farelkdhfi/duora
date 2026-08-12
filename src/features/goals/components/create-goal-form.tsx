'use client'

import {
  CalendarDays,
  ChevronDown,
  FileText,
  Loader2,
  Target,
  Wallet,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  createGoalSchema,
  type CreateGoalFormValues,
} from '../schemas'

import { useCreateGoal } from '../queries'


interface CreateGoalFormProps {
  relationshipId: string
  onSuccess?: () => void
}


const inputClass =
  'mt-2 h-11 w-full rounded-xl border border-black/[0.07] bg-neutral-50/70 px-3.5 text-[13px] text-neutral-700 outline-none transition placeholder:text-neutral-300 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/[0.06]'

const textareaClass =
  'mt-2 min-h-[100px] w-full resize-none rounded-xl border border-black/[0.07] bg-neutral-50/70 px-3.5 py-3 text-[13px] text-neutral-700 outline-none transition placeholder:text-neutral-300 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/[0.06]'


function FieldLabel({
  children,
  icon,
}: {
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
      {icon}
      {children}
    </label>
  )
}


export default function CreateGoalForm({
  relationshipId,
  onSuccess,
}: CreateGoalFormProps) {
  const mutation = useCreateGoal()

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<CreateGoalFormValues>({
    resolver: zodResolver(
      createGoalSchema,
    ),

    defaultValues: {
      category: 'personal',
    },
  })


  function onSubmit(
    values: CreateGoalFormValues,
  ) {
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
      onSubmit={handleSubmit(
        onSubmit,
      )}
      className="space-y-5"
    >

      {/* ===================================================== */}
      {/* GOAL NAME */}
      {/* ===================================================== */}

      <div>

        <FieldLabel
          icon={
            <Target
              size={12}
              strokeWidth={2.5}
            />
          }
        >
          Goal name
        </FieldLabel>

        <input
          {...register('title')}
          placeholder="Our dream vacation"
          className={inputClass}
        />

        {errors.title && (
          <p className="mt-1.5 text-[11px] font-medium text-red-400">
            {errors.title.message}
          </p>
        )}

      </div>


      {/* ===================================================== */}
      {/* DESCRIPTION */}
      {/* ===================================================== */}

      <div>

        <FieldLabel
          icon={
            <FileText
              size={12}
              strokeWidth={2.5}
            />
          }
        >
          Description
        </FieldLabel>

        <textarea
          {...register(
            'description',
          )}
          placeholder="Save together for our trip..."
          className={textareaClass}
        />

        {errors.description && (
          <p className="mt-1.5 text-[11px] font-medium text-red-400">
            {
              errors
                .description
                .message
            }
          </p>
        )}

      </div>


      {/* ===================================================== */}
      {/* CATEGORY */}
      {/* ===================================================== */}

      <div>

        <FieldLabel>
          Category
        </FieldLabel>

        <div className="relative">

          <select
            {...register(
              'category',
            )}
            className={`${inputClass} appearance-none pr-10`}
          >

            <option value="personal">
              Personal
            </option>

            <option value="vacation">
              Vacation
            </option>

            <option value="wedding">
              Wedding
            </option>

            <option value="house">
              House
            </option>

            <option value="education">
              Education
            </option>

            <option value="business">
              Business
            </option>

            <option value="savings">
              Savings
            </option>

            <option value="other">
              Other
            </option>

          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-300"
          />

        </div>

      </div>


      {/* ===================================================== */}
      {/* TARGET + DEADLINE */}
      {/* ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2">

        {/* TARGET */}

        <div>

          <FieldLabel
            icon={
              <Wallet
                size={12}
                strokeWidth={2.5}
              />
            }
          >
            Target amount
          </FieldLabel>

          <div className="relative">

            <span className="pointer-events-none absolute left-3.5 top-1/2 mt-1 -translate-y-1/2 text-[12px] font-medium text-neutral-300">
              Rp
            </span>

            <input
              {...register(
                'targetAmount',
                {
                  setValueAs:
                    (value) =>
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
            <p className="mt-1.5 text-[11px] font-medium text-red-400">
              {
                errors
                  .targetAmount
                  .message
              }
            </p>
          )}

        </div>


        {/* DEADLINE */}

        <div>

          <FieldLabel
            icon={
              <CalendarDays
                size={12}
                strokeWidth={2.5}
              />
            }
          >
            Deadline
          </FieldLabel>

          <input
            {...register(
              'deadline',
            )}
            type="date"
            className={inputClass}
          />

          {errors.deadline && (
            <p className="mt-1.5 text-[11px] font-medium text-red-400">
              {
                errors
                  .deadline
                  .message
              }
            </p>
          )}

        </div>

      </div>


      {/* ===================================================== */}
      {/* ERROR */}
      {/* ===================================================== */}

      {mutation.error && (
        <div className="rounded-xl border border-red-500/10 bg-red-50 px-3.5 py-3">

          <p className="text-[11px] font-medium leading-relaxed text-red-500">
            {mutation.error.message}
          </p>

        </div>
      )}


      {/* ===================================================== */}
      {/* SUBMIT */}
      {/* ===================================================== */}

      <button
        type="submit"
        disabled={
          mutation.isPending
        }
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 text-[12px] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >

        {mutation.isPending ? (
          <>
            <Loader2
              size={14}
              className="animate-spin"
            />

            Creating goal...
          </>
        ) : (
          <>
            <Target
              size={14}
              strokeWidth={2.5}
            />

            Create Goal
          </>
        )}

      </button>


      <p className="text-center text-[10px] leading-relaxed text-neutral-300">
        Create a goal and start building
        something together.
      </p>

    </form>
  )
}