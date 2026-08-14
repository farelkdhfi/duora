'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowUpRight,
  Check,
  Loader2,
  MessageSquare,
  Wallet,
} from 'lucide-react'

import {
  createSavingSchema,
  type CreateSavingFormValues,
} from '../schemas'

import {
  useCreateSaving,
} from '../queries'

interface CreateSavingFormProps {
  relationshipId: string
  goalId: string
}

const inputClass = `
  mt-2
  h-12
  w-full
  rounded-[14px]
  border border-white/[0.08]
  bg-white/[0.06]
  px-4
  text-[13px]
  font-medium
  text-white
  outline-none
  transition-all
  duration-200
  placeholder:text-white/25
  hover:border-white/[0.14]
  hover:bg-white/[0.08]
  focus:border-white/20
  focus:bg-white/[0.1]
  focus:ring-4
  focus:ring-white/[0.05]
`

export default function CreateSavingForm({
  relationshipId,
  goalId,
}: CreateSavingFormProps) {
  const mutation = useCreateSaving()

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<CreateSavingFormValues>({
    resolver: zodResolver(createSavingSchema),
  })

  function onSubmit(values: CreateSavingFormValues) {
    mutation.mutate(
      {
        relationshipId,
        goalId,
        amount: values.amount,
        note: values.note,
      },
      {
        onSuccess: () => {
          reset()
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">

        {/* ================================================= */}
        {/* AMOUNT */}
        {/* ================================================= */}

        <div>

          <div className="flex items-center justify-between">

            <label
              htmlFor="amount"
              className="
                flex items-center gap-2
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-white/40
              "
            >

              <span
                className="
                  flex size-7
                  items-center justify-center
                  rounded-[9px]
                  bg-white/[0.07]
                "
              >
                <Wallet
                  size={12}
                  strokeWidth={2.2}
                  className="text-white/70"
                />
              </span>

              Amount

            </label>

            <span className="text-[9px] font-medium text-white/25">
              Required
            </span>

          </div>


          <div className="relative">

            <span
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[12px]
                font-semibold
                text-white/30
              "
            >
              Rp
            </span>

            <input
              id="amount"
              {...register('amount', {
                setValueAs: (value) =>
                  value === ''
                    ? undefined
                    : Number(value),
              })}
              type="number"
              min="1"
              placeholder="500.000"
              className={`${inputClass} pl-11 pr-4 text-[15px]`}
            />

          </div>


          {errors.amount && (
            <p className="mt-2 px-1 text-[10px] font-medium text-rose-300">
              {errors.amount.message}
            </p>
          )}

        </div>


        {/* ================================================= */}
        {/* NOTE */}
        {/* ================================================= */}

        <div>

          <div className="flex items-center justify-between">

            <label
              htmlFor="note"
              className="
                flex items-center gap-2
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-white/40
              "
            >

              <span
                className="
                  flex size-7
                  items-center justify-center
                  rounded-[9px]
                  bg-white/[0.07]
                "
              >
                <MessageSquare
                  size={12}
                  strokeWidth={2.2}
                  className="text-white/70"
                />
              </span>

              Note

            </label>

            <span className="text-[9px] font-medium text-white/25">
              Optional
            </span>

          </div>


          <input
            id="note"
            {...register('note')}
            placeholder="Tabungan minggu ini..."
            className={inputClass}
          />


          {errors.note && (
            <p className="mt-2 px-1 text-[10px] font-medium text-rose-300">
              {errors.note.message}
            </p>
          )}

        </div>


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {mutation.error && (
          <div
            className="
              flex items-start gap-3
              rounded-[14px]
              border border-rose-400/10
              bg-rose-400/[0.06]
              px-4 py-3
            "
          >

            <div
              className="
                flex size-6 shrink-0
                items-center justify-center
                rounded-full
                bg-rose-400/10
              "
            >
              <span className="text-[10px] font-bold text-rose-300">
                !
              </span>
            </div>

            <p className="pt-0.5 text-[10px] font-medium leading-relaxed text-rose-300">
              {mutation.error.message}
            </p>

          </div>
        )}


        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {mutation.isSuccess && (
          <div
            className="
              flex items-center gap-3
              rounded-[14px]
              border border-emerald-400/10
              bg-emerald-400/[0.06]
              px-4 py-3
            "
          >

            <div
              className="
                flex size-7 shrink-0
                items-center justify-center
                rounded-full
                bg-emerald-500
                text-white
              "
            >
              <Check
                size={13}
                strokeWidth={3}
              />
            </div>

            <div>

              <p className="text-[11px] font-semibold text-emerald-300">
                Savings added
              </p>

              <p className="mt-0.5 text-[10px] text-emerald-300/50">
                Another little step toward your goal.
              </p>

            </div>

          </div>
        )}


        {/* ================================================= */}
        {/* SUBMIT */}
        {/* ================================================= */}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="
            group
            relative
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            overflow-hidden
            rounded-[14px]
            bg-white
            px-5
            text-[12px]
            font-semibold
            text-neutral-900
            shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-neutral-50
            hover:shadow-[0_18px_35px_-12px_rgba(0,0,0,0.55)]
            active:translate-y-0
            active:scale-[0.985]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          <span
            className="
              pointer-events-none
              absolute
              -right-8
              -top-10
              size-24
              rounded-full
              bg-blue-100/40
              blur-2xl
            "
          />

          <span className="relative flex items-center gap-2">

            {mutation.isPending ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />

                Adding savings...
              </>
            ) : (
              <>
                Add savings

                <span
                  className="
                    flex size-6
                    items-center justify-center
                    rounded-full
                    bg-neutral-900/[0.06]
                  "
                >
                  <ArrowUpRight
                    size={13}
                    strokeWidth={2.5}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </span>
              </>
            )}

          </span>

        </button>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <p className="pt-0.5 text-center text-[9px] leading-relaxed text-white/20">
          Every contribution brings you two
          a little closer.
        </p>

      </div>
    </form>
  )
}