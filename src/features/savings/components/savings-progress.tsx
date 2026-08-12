'use client'

import {
  Check,
  Heart,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react'

import {
  useGoalSavings,
} from '../queries'

import {
  useSavingsRealtime,
} from '../use-savings-realtime'


interface SavingsProgressProps {
  goalId: string
  targetAmount: number | null
}


export default function SavingsProgress({
  goalId,
  targetAmount,
}: SavingsProgressProps) {

  useSavingsRealtime({
    goalId,
  })


  const {
    data: savings,
    isLoading,
  } = useGoalSavings(goalId)


  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-[1.75rem] border border-black/[0.05] bg-white p-6">

        <div className="flex items-center gap-3">

          <div className="size-10 rounded-[14px] bg-neutral-100" />

          <div className="space-y-2">

            <div className="h-2.5 w-20 rounded-full bg-neutral-100" />

            <div className="h-4 w-32 rounded-full bg-neutral-100" />

          </div>

        </div>


        <div className="mt-7 h-9 w-44 rounded-xl bg-neutral-100" />

        <div className="mt-6 h-3 rounded-full bg-neutral-100" />

      </div>
    )
  }


  /* ========================================================= */
  /* CALCULATION */
  /* ========================================================= */

  const total =
    savings?.reduce(
      (
        sum,
        transaction,
      ) =>
        sum +
        Number(
          transaction.amount,
        ),
      0,
    ) ?? 0


  const percentage =
    targetAmount &&
    targetAmount > 0
      ? Math.min(
          (total /
            targetAmount) *
            100,
          100,
        )
      : 0


  const isCompleted =
    targetAmount !== null &&
    targetAmount > 0 &&
    total >= targetAmount


  const remaining =
    targetAmount !== null
      ? Math.max(
          targetAmount -
            total,
          0,
        )
      : null


  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)]">

      {/* ===================================================== */}
      {/* AMBIENT */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-pink-100/30 blur-3xl" />


      <div className="relative">


        {/* =================================================== */}
        {/* HEADER */}
        {/* =================================================== */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="flex size-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-blue-50 to-pink-50">

              <Wallet
                size={17}
                strokeWidth={2}
                className="text-blue-500"
              />

            </div>


            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
                Shared savings
              </p>


              <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-neutral-800">
                Your progress together
              </h2>

            </div>

          </div>


          {/* Percentage */}

          {targetAmount !== null && (

            <div
              className={`rounded-full px-3 py-1.5 ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-blue-50 text-blue-600'
              }`}
            >

              <span className="text-[11px] font-bold tabular-nums">
                {percentage.toFixed(0)}%
              </span>

            </div>

          )}

        </div>


        {/* =================================================== */}
        {/* AMOUNT */}
        {/* =================================================== */}

        <div className="mt-7">

          <div className="flex flex-wrap items-end justify-between gap-4">

            <div>

              <p className="text-[11px] font-medium text-neutral-300">
                Saved together
              </p>


              <p className="mt-1 text-3xl font-semibold tracking-[-0.045em] text-neutral-800">

                Rp{' '}

                {total.toLocaleString(
                  'id-ID',
                )}

              </p>

            </div>


            {targetAmount !== null && (

              <div className="text-right">

                <p className="text-[11px] font-medium text-neutral-300">
                  Target
                </p>


                <p className="mt-1 text-sm font-semibold text-neutral-500">

                  Rp{' '}

                  {targetAmount.toLocaleString(
                    'id-ID',
                  )}

                </p>

              </div>

            )}

          </div>

        </div>


        {/* =================================================== */}
        {/* PROGRESS BAR */}
        {/* =================================================== */}

        {targetAmount !== null && (

          <div className="mt-6">

            <div className="h-3 overflow-hidden rounded-full bg-neutral-100">

              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    : 'bg-gradient-to-r from-blue-500 via-blue-400 to-pink-400'
                }`}
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>


            {/* Progress labels */}

            <div className="mt-2.5 flex items-center justify-between">

              <p className="text-[10px] font-medium text-neutral-300">
                0
              </p>


              <p className="text-[10px] font-medium text-neutral-300">
                {targetAmount.toLocaleString(
                  'id-ID',
                )}
              </p>

            </div>

          </div>

        )}


        {/* =================================================== */}
        {/* STATUS */}
        {/* =================================================== */}

        {targetAmount !== null && (

          <div className="mt-5">

            {isCompleted ? (

              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/80 px-4 py-3">

                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">

                  <Check
                    size={15}
                    strokeWidth={3}
                  />

                </div>


                <div>

                  <p className="text-[12px] font-semibold text-emerald-700">
                    Goal completed
                  </p>


                  <p className="mt-0.5 text-[11px] text-emerald-600/70">
                    You made it together. ❤️
                  </p>

                </div>

              </div>

            ) : (

              <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3">

                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">

                  <Heart
                    size={14}
                    strokeWidth={2}
                    className="text-pink-400"
                  />

                </div>


                <div>

                  <p className="text-[12px] font-semibold text-neutral-600">

                    Rp{' '}

                    {remaining?.toLocaleString(
                      'id-ID',
                    )}

                    {' '}to go

                  </p>


                  <p className="mt-0.5 text-[11px] text-neutral-300">
                    Keep growing together.
                  </p>

                </div>

              </div>

            )}

          </div>

        )}


        {/* =================================================== */}
        {/* NO TARGET */}
        {/* =================================================== */}

        {targetAmount === null && (

          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3">

            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">

              <Sparkles
                size={14}
                className="text-blue-400"
              />

            </div>


            <p className="text-[12px] leading-relaxed text-neutral-400">
              Keep saving together. Set a target
              to see your progress.
            </p>

          </div>

        )}

      </div>

    </section>
  )
}