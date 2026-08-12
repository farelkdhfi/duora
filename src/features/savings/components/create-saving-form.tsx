'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, Check, Loader2, MessageSquare, Wallet } from 'lucide-react'

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


const inputClass =
  'mt-2 w-full rounded-2xl border border-black/[0.06] bg-[#F7F7F9] px-4 py-3.5 text-[14px] font-medium text-neutral-800 outline-none transition-all placeholder:text-neutral-300 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-500/[0.06]'


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
    resolver: zodResolver(
      createSavingSchema,
    ),
  })


  function onSubmit(
    values: CreateSavingFormValues,
  ) {

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
    <form
      onSubmit={handleSubmit(
        onSubmit,
      )}
      className="space-y-5"
    >

      {/* ================================================== */}
      {/* AMOUNT */}
      {/* ================================================== */}

      <div>

        <label
          htmlFor="amount"
          className="flex items-center gap-2 text-[12px] font-semibold text-neutral-500"
        >

          <Wallet
            size={14}
            strokeWidth={2.2}
            className="text-blue-500"
          />

          Amount

        </label>


        <div className="relative">

          <span className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-[13px] font-semibold text-neutral-300">
            Rp
          </span>


          <input
            id="amount"
            {...register(
              'amount',
              {
                setValueAs:
                  (value) =>
                    value === ''
                      ? undefined
                      : Number(value),
              },
            )}
            type="number"
            min="1"
            placeholder="500.000"
            className={`${inputClass} pl-11`}
          />

        </div>


        {errors.amount && (
          <p className="mt-2 px-1 text-[12px] font-medium text-rose-500">
            {errors.amount.message}
          </p>
        )}

      </div>


      {/* ================================================== */}
      {/* NOTE */}
      {/* ================================================== */}

      <div>

        <label
          htmlFor="note"
          className="flex items-center gap-2 text-[12px] font-semibold text-neutral-500"
        >

          <MessageSquare
            size={14}
            strokeWidth={2.2}
            className="text-pink-500"
          />

          Note

          <span className="font-normal text-neutral-300">
            Optional
          </span>

        </label>


        <input
          id="note"
          {...register('note')}
          placeholder="Tabungan minggu ini..."
          className={inputClass}
        />


        {errors.note && (
          <p className="mt-2 px-1 text-[12px] font-medium text-rose-500">
            {errors.note.message}
          </p>
        )}

      </div>


      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {mutation.error && (

        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3">

          <p className="text-[12px] font-medium leading-relaxed text-rose-500">
            {mutation.error.message}
          </p>

        </div>

      )}


      {/* ================================================== */}
      {/* SUCCESS */}
      {/* ================================================== */}

      {mutation.isSuccess && (

        <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">

          <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">

            <Check
              size={12}
              strokeWidth={3}
            />

          </div>


          <p className="text-[12px] font-medium text-emerald-600">
            Savings added successfully.
          </p>

        </div>

      )}


      {/* ================================================== */}
      {/* SUBMIT */}
      {/* ================================================== */}

      <button
        type="submit"
        disabled={
          mutation.isPending
        }
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all duration-200 hover:bg-neutral-800 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
      >

        {mutation.isPending ? (
          <>
            <Loader2
              size={15}
              className="animate-spin"
            />

            Adding savings...
          </>
        ) : (
          <>
            Add savings

            <ArrowUpRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </>
        )}

      </button>


      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <p className="text-center text-[11px] leading-relaxed text-neutral-300">
        Every contribution brings you two
        a little closer to your goal.
      </p>

    </form>
  )
}