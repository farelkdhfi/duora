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
      <section className="relative overflow-hidden">
        <div className="relative p-4 xs:p-5 sm:p-6 lg:p-7">
          <div className="animate-pulse">

            {/* Header */}

            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

                <div className="size-9 shrink-0 rounded-[12px] bg-neutral-100 sm:size-10 sm:rounded-[14px]" />

                <div className="min-w-0 space-y-2">
                  <div className="h-2 w-20 rounded-full bg-neutral-100" />
                  <div className="h-3.5 w-28 rounded-full bg-neutral-100 sm:h-4 sm:w-32" />
                </div>

              </div>

              <div className="h-7 w-11 shrink-0 rounded-full bg-neutral-100" />

            </div>

            {/* Amount */}

            <div className="mt-7 sm:mt-9">

              <div className="h-2.5 w-24 rounded-full bg-neutral-100" />

              <div className="mt-3 h-8 w-40 rounded-xl bg-neutral-100 sm:h-9 sm:w-48" />

            </div>

            {/* Progress */}

            <div className="mt-7 h-1.5 rounded-full bg-neutral-100 sm:mt-8" />

            <div className="mt-5 h-14 rounded-[14px] bg-neutral-100 sm:mt-6 sm:rounded-2xl" />

          </div>
        </div>
      </section>
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

      <div className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-blue-100/30 blur-[60px] sm:-right-20 sm:-top-20 sm:size-40 sm:blur-[70px]" />

      <div className="pointer-events-none absolute -bottom-16 -left-16 size-32 rounded-full bg-pink-100/20 blur-[60px] sm:-bottom-20 sm:-left-20 sm:size-40 sm:blur-[70px]" />

      <div className="relative p-4 xs:p-5 sm:p-6 lg:p-7">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between gap-3 sm:gap-4">

          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

            <div
              className="
                flex size-9 shrink-0
                items-center justify-center
                rounded-[12px]
                border border-black/[0.05]
                bg-neutral-50
                sm:size-10
                sm:rounded-[14px]
              "
            >
              <Wallet
                size={15}
                strokeWidth={2}
                className="text-neutral-700 sm:size-4"
              />
            </div>

            <div className="min-w-0">

              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-300 sm:text-[10px] sm:tracking-[0.16em]">
                Shared savings
              </p>

              <h2 className="mt-1 truncate text-[14px] font-semibold tracking-[-0.025em] text-neutral-800 sm:text-[15px]">
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
                px-2.5 py-1.5
                sm:px-3
                ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-neutral-100 text-neutral-600'
                }
              `}
            >
              <span className="text-[10px] font-semibold tabular-nums sm:text-[11px]">
                {percentage.toFixed(0)}%
              </span>
            </div>
          )}

        </div>

        {/* ================================================= */}
        {/* MAIN AMOUNT */}
        {/* ================================================= */}

        <div className="mt-7 sm:mt-9">

          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-neutral-300 sm:text-[10px] sm:tracking-[0.14em]">
            Saved together
          </p>

          <div className="mt-2.5 flex flex-col gap-3 xs:flex-row xs:items-end xs:justify-between xs:gap-4">

            {/* Total */}

            <p className="
              min-w-0
              overflow-hidden
              text-[clamp(1.65rem,7vw,2.125rem)]
              font-semibold
              leading-none
              tracking-[-0.055em]
              text-neutral-900
            ">
              {formatRupiah(total)}
            </p>

            {/* Target */}

            {targetAmount !== null && (
              <div className="shrink-0 xs:pb-0.5 xs:text-right">

                <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-neutral-300 sm:text-[9px]">
                  Target
                </p>

                <p className="mt-1 text-[11px] font-semibold tabular-nums text-neutral-500 sm:text-[12px]">
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

          <div className="mt-7 sm:mt-8">

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

            <div className="mt-2.5 flex items-center justify-between gap-3">

              <span className="min-w-0 truncate text-[8px] font-medium text-neutral-300 sm:text-[9px]">
                Rp 0
              </span>

              <span className="min-w-0 truncate text-right text-[8px] font-medium text-neutral-300 sm:text-[9px]">
                {formatRupiah(targetAmount)}
              </span>

            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* STATUS */}
        {/* ================================================= */}

        {targetAmount !== null && (

          <div className="mt-5 sm:mt-6">

            {isCompleted ? (

              <div
                className="
                  flex items-center gap-2.5
                  rounded-[14px]
                  border border-emerald-100
                  bg-emerald-50/60
                  px-3.5 py-3
                  sm:gap-3
                  sm:rounded-[16px]
                  sm:px-4 sm:py-3.5
                "
              >

                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white sm:size-8">

                  <Check
                    size={13}
                    strokeWidth={3}
                    className="sm:size-[14px]"
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[11px] font-semibold text-emerald-700 sm:text-[12px]">
                    Goal completed
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-emerald-600/60 sm:text-[11px]">
                    You made it together. ❤️
                  </p>

                </div>

              </div>

            ) : (

              <div
                className="
                  flex items-center gap-2.5
                  rounded-[14px]
                  border border-black/[0.05]
                  bg-neutral-50/70
                  px-3.5 py-3
                  sm:gap-3
                  sm:rounded-[16px]
                  sm:px-4 sm:py-3.5
                "
              >

                <div
                  className="
                    flex size-7 shrink-0
                    items-center justify-center
                    rounded-full
                    bg-white
                    shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                    sm:size-8
                  "
                >
                  <Heart
                    size={12}
                    strokeWidth={2}
                    className="text-pink-400 sm:size-[13px]"
                  />
                </div>

                <div className="min-w-0">

                  <p className="truncate text-[11px] font-semibold text-neutral-700 sm:text-[12px]">
                    {formatRupiah(remaining ?? 0)} to go
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-neutral-400 sm:text-[11px]">
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
              mt-5
              flex items-center gap-2.5
              rounded-[14px]
              border border-black/[0.05]
              bg-neutral-50/70
              px-3.5 py-3
              sm:mt-6
              sm:gap-3
              sm:rounded-[16px]
              sm:px-4 sm:py-3.5
            "
          >

            <div
              className="
                flex size-7 shrink-0
                items-center justify-center
                rounded-full
                bg-white
                shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                sm:size-8
              "
            >
              <Sparkles
                size={12}
                className="text-blue-400 sm:size-[13px]"
              />
            </div>

            <p className="text-[10px] leading-relaxed text-neutral-400 sm:text-[11px]">
              Keep saving together. Set a target
              to see your progress.
            </p>

          </div>

        )}

      </div>

    </section>
  )
}