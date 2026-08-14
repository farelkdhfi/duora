'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Target,
  Wallet,
} from 'lucide-react'

import { useGoal } from '@/features/goals/queries'

import CreateSavingForm from '@/features/savings/components/create-saving-form'
import SavingsProgress from '@/features/savings/components/savings-progress'
import SavingsHistory from '@/features/savings/components/savings-history'
import Checklist from '@/features/goals/components/checklist'

import { useMyRelationshipDetails } from '@/features/relationship/queries'

interface GoalDetailProps {
  goalId: string
}

const categoryLabels: Record<string, string> = {
  wedding: 'Wedding',
  house: 'House',
  vacation: 'Vacation',
  education: 'Education',
  business: 'Business',
  savings: 'Shared Goal',
  personal: 'Personal',
  other: 'Goal',
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function GoalDetail({
  goalId,
}: GoalDetailProps) {
  const {
    data: goal,
    isLoading,
    error,
  } = useGoal(goalId)

  const { data: relationship } = useMyRelationshipDetails()

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="animate-pulse pb-10">
        <div className="h-4 w-28 rounded-full bg-neutral-100" />

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-black/[0.04] bg-white p-6 sm:p-8">
          <div className="h-2.5 w-20 rounded-full bg-neutral-100" />

          <div className="mt-5 h-10 w-80 max-w-full rounded-xl bg-neutral-100" />

          <div className="mt-4 h-4 w-96 max-w-full rounded-full bg-neutral-100" />

          <div className="mt-7 flex gap-2">
            <div className="h-8 w-28 rounded-full bg-neutral-100" />
            <div className="h-8 w-32 rounded-full bg-neutral-100" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <div className="h-48 rounded-[2rem] bg-neutral-100" />
            <div className="h-52 rounded-[2rem] bg-neutral-100" />
            <div className="h-48 rounded-[2rem] bg-neutral-100" />
          </div>

          <div className="h-96 rounded-[2rem] bg-neutral-100" />
        </div>
      </div>
    )
  }

  /* ========================================================= */
  /* ERROR */
  /* ========================================================= */

  if (error || !goal) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-100/30 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-100/30 blur-[100px]" />

        <div className="relative w-full max-w-md rounded-[2rem] border border-black/[0.05] bg-white p-8 text-center shadow-[0_25px_70px_-30px_rgba(0,0,0,0.2)]">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-neutral-100">
            <Target
              size={19}
              strokeWidth={1.8}
              className="text-neutral-500"
            />
          </div>

          <h1 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-neutral-900">
            Goal not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            {error?.message ??
              'This goal may have been deleted or is no longer available.'}
          </p>

          <Link
            href="/goals"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-black"
          >
            <ArrowLeft size={14} />
            Back to goals
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-12">
      {/* ===================================================== */}
      {/* BACK */}
      {/* ===================================================== */}

      <Link
        href="/goals"
        className="group inline-flex items-center gap-2 text-[13px] font-medium text-neutral-400 transition-colors hover:text-neutral-900"
      >
        <ArrowLeft
          size={15}
          strokeWidth={2}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />

        Back to goals
      </Link>

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative mt-5 overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_20px_70px_-35px_rgba(0,0,0,0.18)]">
        {/* Ambient */}

        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-100/40 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-pink-100/30 blur-[90px]" />

        {/* Accent */}

        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#FFD166] via-[#FF6B8A] to-[#007AFF]" />

        {/* Background icon */}

        <Target
          size={360}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-32 -right-24 text-neutral-900/[0.025] sm:size-[430px]"
        />

        <div className="relative p-6 sm:p-8 lg:p-10">
          {/* Header */}

          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              {/* Category */}

              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-[11px] bg-neutral-100">
                  <Target
                    size={14}
                    strokeWidth={2}
                    className="text-neutral-500"
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-neutral-400">
                  {categoryLabels[goal.category] ?? goal.category}
                </span>
              </div>

              {/* Title */}

              <h1 className="mt-5 max-w-3xl break-words text-3xl font-semibold leading-[1.04] tracking-[-0.055em] text-neutral-900 sm:text-4xl lg:text-[46px]">
                {goal.title}
              </h1>

              {/* Description */}

              {goal.description && (
                <p className="mt-4 max-w-2xl text-[13px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">
                  {goal.description}
                </p>
              )}
            </div>

            {/* Action */}

            <div className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-black/[0.05] bg-neutral-50 text-neutral-300 sm:flex">
              <ArrowUpRight
                size={16}
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Meta */}

          <div className="mt-8 flex flex-wrap gap-2">
            {goal.target_amount !== null && (
              <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.05] bg-neutral-50 px-3.5 py-2">
                <Wallet
                  size={12}
                  strokeWidth={2}
                  className="text-neutral-500"
                />

                <span className="text-[11px] font-medium text-neutral-600">
                  Target Rp{' '}
                  {goal.target_amount.toLocaleString('id-ID')}
                </span>
              </div>
            )}

            {goal.deadline && (
              <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.05] bg-neutral-50 px-3.5 py-2">
                <CalendarDays
                  size={12}
                  strokeWidth={2}
                  className="text-neutral-500"
                />

                <span className="text-[11px] font-medium text-neutral-600">
                  {formatDate(goal.deadline)}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* ================================================= */}
        {/* LEFT */}
        {/* ================================================= */}

        <main className="min-w-0 space-y-7">
          {/* ================================================= */}
          {/* CHECKLIST */}
          {/* ================================================= */}

          <section>
            <div className="mb-3 px-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Progress
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-[-0.035em] text-neutral-900">
                Things to accomplish
              </h2>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_15px_50px_-30px_rgba(0,0,0,0.15)]">
              <Checklist goalId={goal.id} />
            </div>
          </section>

          {relationship && (
            <>
              {/* ================================================= */}
              {/* SAVINGS */}
              {/* ================================================= */}

              <section>
                <div className="mb-3 px-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                    Shared savings
                  </p>

                  <h2 className="mt-1 text-lg font-semibold tracking-[-0.035em] text-neutral-900">
                    Growing together
                  </h2>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_15px_50px_-30px_rgba(0,0,0,0.15)]">
                  <SavingsProgress
                    goalId={goal.id}
                    targetAmount={goal.target_amount}
                  />
                </div>
              </section>

              {/* ================================================= */}
              {/* CONTRIBUTE */}
              {/* ================================================= */}

              <section className="relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-neutral-950 p-6 text-white shadow-[0_25px_70px_-35px_rgba(0,0,0,0.35)] sm:p-8">
                {/* Ambient */}

                <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-blue-500/10 blur-[90px]" />

                <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-pink-500/10 blur-[90px]" />

                <div className="relative">
                  <div className="flex items-start gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-white/[0.08]">
                      <Wallet
                        size={17}
                        strokeWidth={1.9}
                        className="text-white/80"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        Contribute
                      </p>

                      <h2 className="mt-1 text-lg font-semibold tracking-[-0.035em]">
                        Add to shared savings
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 max-w-md text-[13px] leading-6 text-white/40">
                    Every contribution brings you both
                    one step closer to this goal.
                  </p>

                  <div className="mt-6">
                    <CreateSavingForm
                      relationshipId={
                        relationship.relationship.id
                      }
                      goalId={goal.id}
                    />
                  </div>
                </div>
              </section>
            </>
          )}
        </main>

        {/* ================================================= */}
        {/* RIGHT — ACTIVITY */}
        {/* ================================================= */}

        {relationship && (
          <aside className="min-w-0 lg:sticky lg:top-6">
            <div className="mb-3 px-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Activity
              </p>

              <div className="mt-1 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold tracking-[-0.035em] text-neutral-900">
                  Savings history
                </h2>

                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-50">
                  <Wallet
                    size={13}
                    strokeWidth={1.9}
                    className="text-neutral-400"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_15px_50px_-30px_rgba(0,0,0,0.15)]">
              <div className="lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                <SavingsHistory goalId={goal.id} />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}