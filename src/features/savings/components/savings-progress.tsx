'use client'

import {
  Check,
  Heart,
  Sparkles,
  Wallet,
} from 'lucide-react'

import { useGoalSavings } from '../queries'
import { useSavingsRealtime } from '../use-savings-realtime'

interface SavingsProgressProps {
  goalId: string
  targetAmount: number | null
}

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`
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
      <div className="p-5 sm:p-6">
        <div className="animate-pulse">

          {/* Header */}

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="size-10 rounded-[14px] bg-neutral-100" />

              <div className="space-y-2">
                <div className="h-2.5 w-20 rounded-full bg-neutral-100" />
                <div className="h-4 w-32 rounded-full bg-neutral-100" />
              </div>

            </div>

            <div className="h-7 w-12 rounded-full bg-neutral-100" />

          </div>


          {/* Amount */}

          <div className="mt-9">

            <div className="h-2.5 w-24 rounded-full bg-neutral-100" />

            <div className="mt-3 h-9 w-48 rounded-xl bg-neutral-100" />

          </div>


          {/* Progress */}

          <div className="mt-8 h-1.5 rounded-full bg-neutral-100" />

          <div className="mt-6 h-14 rounded-2xl bg-neutral-100" />

        </div>
      </div>
    )
  }

  /* ========================================================= */
  /* CALCULATION */
  /* ========================================================= */

  const total =
    savings?.reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0,
    ) ?? 0

  const percentage =
    targetAmount && targetAmount > 0
      ? Math.min((total / targetAmount) * 100, 100)
      : 0

  const isCompleted =
    targetAmount !== null &&
    targetAmount > 0 &&
    total >= targetAmount

  const remaining =
    targetAmount !== null
      ? Math.max(targetAmount - total, 0)
      : null

  return (
    <section className="relative overflow-hidden">

      {/* =================================================== */}
      {/* SUBTLE AMBIENT */}
      {/* =================================================== */}

      <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-blue-100/30 blur-[70px]" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 size-40 rounded-full bg-pink-100/20 blur-[70px]" />


      <div className="relative p-5 sm:p-6">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div
              className="
                flex size-10 shrink-0
                items-center justify-center
                rounded-[14px]
                border border-black/[0.05]
                bg-neutral-50
              "
            >
              <Wallet
                size={16}
                strokeWidth={2}
                className="text-neutral-700"
              />
            </div>

            <div className="min-w-0">

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Shared savings
              </p>

              <h2 className="mt-1 truncate text-[15px] font-semibold tracking-[-0.025em] text-neutral-800">
                Your progress together
              </h2>

            </div>

          </div>


          {/* Percentage */}

          {targetAmount !== null && (
            <div
              className={`
                shrink-0
                rounded-full
                px-3 py-1.5
                ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-neutral-100 text-neutral-600'
                }
              `}
            >
              <span className="text-[11px] font-semibold tabular-nums">
                {percentage.toFixed(0)}%
              </span>
            </div>
          )}

        </div>


        {/* ================================================= */}
        {/* MAIN AMOUNT */}
        {/* ================================================= */}

        <div className="mt-9">

          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
            Saved together
          </p>


          <div className="mt-2 flex items-end justify-between gap-4">

            <p className="min-w-0 truncate text-[30px] font-semibold leading-none tracking-[-0.055em] text-neutral-900 sm:text-[34px]">
              {formatRupiah(total)}
            </p>


            {targetAmount !== null && (
              <div className="shrink-0 pb-0.5 text-right">

                <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-300">
                  Target
                </p>

                <p className="mt-1 text-[12px] font-semibold tabular-nums text-neutral-500">
                  {formatRupiah(targetAmount)}
                </p>

              </div>
            )}

          </div>

        </div>


        {/* ================================================= */}
        {/* PROGRESS */}
        {/* ================================================= */}

        {targetAmount !== null && (

          <div className="mt-8">

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">

              <div
                className={`
                  h-full
                  rounded-full
                  transition-all
                  duration-700
                  ease-out
                  ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-blue-500 to-pink-400'
                  }
                `}
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>


            <div className="mt-2.5 flex items-center justify-between">

              <span className="text-[9px] font-medium text-neutral-300">
                Rp 0
              </span>

              <span className="text-[9px] font-medium text-neutral-300">
                {formatRupiah(targetAmount)}
              </span>

            </div>

          </div>
        )}


        {/* ================================================= */}
        {/* STATUS */}
        {/* ================================================= */}

        {targetAmount !== null && (

          <div className="mt-6">

            {isCompleted ? (

              <div
                className="
                  flex items-center gap-3
                  rounded-[16px]
                  border border-emerald-100
                  bg-emerald-50/60
                  px-4 py-3.5
                "
              >

                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">

                  <Check
                    size={14}
                    strokeWidth={3}
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[12px] font-semibold text-emerald-700">
                    Goal completed
                  </p>

                  <p className="mt-0.5 text-[11px] text-emerald-600/60">
                    You made it together. ❤️
                  </p>

                </div>

              </div>

            ) : (

              <div
                className="
                  flex items-center gap-3
                  rounded-[16px]
                  border border-black/[0.05]
                  bg-neutral-50/70
                  px-4 py-3.5
                "
              >

                <div
                  className="
                    flex size-8 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-white
                    shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                  "
                >
                  <Heart
                    size={13}
                    strokeWidth={2}
                    className="text-pink-400"
                  />
                </div>

                <div className="min-w-0">

                  <p className="text-[12px] font-semibold text-neutral-700">
                    {formatRupiah(remaining ?? 0)} to go
                  </p>

                  <p className="mt-0.5 text-[11px] text-neutral-400">
                    Keep growing together.
                  </p>

                </div>

              </div>

            )}

          </div>
        )}


        {/* ================================================= */}
        {/* NO TARGET */}
        {/* ================================================= */}

        {targetAmount === null && (

          <div
            className="
              mt-6
              flex items-center gap-3
              rounded-[16px]
              border border-black/[0.05]
              bg-neutral-50/70
              px-4 py-3.5
            "
          >

            <div
              className="
                flex size-8 shrink-0
                items-center justify-center
                rounded-full
                bg-white
                shadow-[0_2px_8px_rgba(0,0,0,0.05)]
              "
            >
              <Sparkles
                size={13}
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