'use client'

import {
  Check,
  Heart,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useRupiah } from '@/lib/use-rupiah'

import { useGoalSavings } from '../queries'
import { useSavingsRealtime } from '../use-savings-realtime'

interface SavingsProgressProps {
  goalId: string
  targetAmount: number | null
}

export default function SavingsProgress({
  goalId,
  targetAmount,
}: SavingsProgressProps) {
  const t = useTranslations('savings.progress')
  const { rupiah } = useRupiah()

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

                <div className="size-9 shrink-0 rounded-[12px] bg-subprimary sm:size-10 sm:rounded-[14px]" />

                <div className="min-w-0 space-y-2">
                  <div className="h-2 w-20 rounded-full bg-subprimary" />
                  <div className="h-3.5 w-28 rounded-full bg-subprimary sm:h-4 sm:w-32" />
                </div>

              </div>

              <div className="h-7 w-11 shrink-0 rounded-full bg-subprimary" />

            </div>

            {/* Amount */}

            <div className="mt-7 sm:mt-9">

              <div className="h-2.5 w-24 rounded-full bg-subprimary" />

              <div className="mt-3 h-8 w-40 rounded-xl bg-subprimary sm:h-9 sm:w-48" />

            </div>

            {/* Progress */}

            <div className="mt-7 h-1.5 rounded-full bg-subprimary sm:mt-8" />

            <div className="mt-5 h-14 rounded-[14px] bg-subprimary sm:mt-6 sm:rounded-2xl" />

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

      <div className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-blue-500/10 blur-[60px] sm:-right-20 sm:-top-20 sm:size-40 sm:blur-[70px]" />

      <div className="pointer-events-none absolute -bottom-16 -left-16 size-32 rounded-full bg-pink-500/10 blur-[60px] sm:-bottom-20 sm:-left-20 sm:size-40 sm:blur-[70px]" />

      <div className="relative p-4 xs:p-5 sm:p-6 lg:p-7">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between gap-3 sm:gap-4">

          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

            <div className="flex size-9 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.06] bg-subprimary sm:size-10 sm:rounded-[14px]">
              <Wallet
                size={15}
                strokeWidth={2}
                className="text-secondary sm:size-4"
              />
            </div>

            <div className="min-w-0">

              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-description sm:text-[10px] sm:tracking-[0.16em]">
                {t('eyebrow')}
              </p>

              <h2 className="mt-1 truncate text-[14px] font-semibold tracking-[-0.025em] text-secondary sm:text-[15px]">
                {t('title')}
              </h2>

            </div>

          </div>

          {/* Percentage */}

          {targetAmount !== null && (
            <div className={`shrink-0 rounded-full px-2.5 py-1.5 sm:px-3 ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-subprimary text-description'}`}>
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

          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-description sm:text-[10px] sm:tracking-[0.14em]">
            {t('savedTogether')}
          </p>

          <div className="mt-2.5 flex flex-col gap-3 xs:flex-row xs:items-end xs:justify-between xs:gap-4">

            {/* Total */}

            <p className="min-w-0 overflow-hidden text-[clamp(1.65rem,7vw,2.125rem)] font-semibold leading-none tracking-[-0.055em] text-secondary">
              {rupiah(total)}
            </p>

            {/* Target */}

            {targetAmount !== null && (
              <div className="shrink-0 xs:pb-0.5 xs:text-right">

                <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-description sm:text-[9px]">
                  {t('target')}
                </p>

                <p className="mt-1 text-[11px] font-semibold tabular-nums text-description sm:text-[12px]">
                  {rupiah(targetAmount)}
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

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-subprimary">

              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-pink-400'}`}
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>

            <div className="mt-2.5 flex items-center justify-between gap-3">

              <span className="min-w-0 truncate text-[8px] font-medium text-description sm:text-[9px]">
                {rupiah(0)}
              </span>

              <span className="min-w-0 truncate text-right text-[8px] font-medium text-description sm:text-[9px]">
                {rupiah(targetAmount)}
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

              <div className="flex items-center gap-2.5 rounded-[14px] border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-3 sm:gap-3 sm:rounded-[16px] sm:px-4 sm:py-3.5">

                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-secondary sm:size-8">

                  <Check
                    size={13}
                    strokeWidth={3}
                    className="sm:size-[14px]"
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[11px] font-semibold text-emerald-400 sm:text-[12px]">
                    {t('completedTitle')}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-emerald-400/60 sm:text-[11px]">
                    {t('completedHint')}
                  </p>

                </div>

              </div>

            ) : (

              <div className="flex items-center gap-2.5 rounded-[14px] border border-white/[0.06] bg-subprimary px-3.5 py-3 sm:gap-3 sm:rounded-[16px] sm:px-4 sm:py-3.5">

                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary shadow-[0_2px_8px_rgba(0,0,0,0.05)] sm:size-8">
                  <Heart
                    size={12}
                    strokeWidth={2}
                    className="text-pink-400 sm:size-[13px]"
                  />
                </div>

                <div className="min-w-0">

                  <p className="truncate text-[11px] font-semibold text-secondary sm:text-[12px]">
                    {t('remaining', { amount: rupiah(remaining ?? 0) })}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-description sm:text-[11px]">
                    {t('keepGrowing')}
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

          <div className="mt-5 flex items-center gap-2.5 rounded-[14px] border border-white/[0.06] bg-subprimary px-3.5 py-3 sm:mt-6 sm:gap-3 sm:rounded-[16px] sm:px-4 sm:py-3.5">

            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary shadow-[0_2px_8px_rgba(0,0,0,0.05)] sm:size-8">
              <Sparkles
                size={12}
                className="text-blue-400 sm:size-[13px]"
              />
            </div>

            <p className="text-[10px] leading-relaxed text-description sm:text-[11px]">
              {t('noTarget')}
            </p>

          </div>

        )}

      </div>

    </section>
  )
}