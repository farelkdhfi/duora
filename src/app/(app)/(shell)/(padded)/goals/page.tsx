'use client'

import { useState } from 'react'
import { Target } from 'lucide-react'
import { useTranslations } from 'next-intl'

import CreateGoalFormModal from '@/features/goals/components/create-goal-form-modal'
import GoalList from '@/features/goals/components/goal-list'

import { useMyRelationshipDetails } from '@/features/relationship/queries'
import Header from '@/components/layout/header'

export default function GoalsPage() {
  const t = useTranslations('goals.page')
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading } = useMyRelationshipDetails()

  /* ========================================================= */
  /* LOADING SKELETON */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="min-h-screen animate-pulse bg-primary">
        {/* Header */}
        <div>
          <div className="h-7 w-40 rounded-lg bg-subprimary" />
          <div className="mt-3 h-3 w-52 rounded-full bg-subprimary" />
        </div>

        {/* Total Savings Card */}
        <div className="relative mt-7 h-[186px] overflow-hidden rounded-[2rem] border border-white/[0.06] bg-subprimary p-5">
          {/* Decorative glow */}
          <div className="absolute -right-8 -top-10 size-36 rounded-full bg-white/[0.03] blur-3xl" />
          <div className="absolute -bottom-12 -left-8 size-36 rounded-full bg-white/[0.04] blur-3xl" />

          {/* Label */}
          <div className="relative flex h-9 w-36 items-center gap-2 rounded-full border border-white/[0.06] bg-primary/50 px-3">
            <div className="size-5 rounded-full bg-white/10" />
            <div className="h-3 w-20 rounded-full bg-white/10" />
          </div>

          {/* Total amount */}
          <div className="relative mt-5 flex items-center gap-2">
            <div className="h-4 w-5 rounded bg-white/10" />
            <div className="h-8 w-32 rounded-lg bg-white/10" />
          </div>

          {/* Description */}
          <div className="relative mt-4 flex items-center gap-2">
            <div className="size-2 rounded-full bg-white/10" />
            <div className="h-3 w-44 rounded-full bg-white/10" />
          </div>

          {/* Decorative hearts */}
          <div className="absolute right-6 top-9 size-2 rounded-full bg-white/[0.08]" />
          <div className="absolute right-10 top-20 size-3 rounded-full bg-white/[0.06]" />
        </div>

        {/* Filters + Add Button */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4 overflow-hidden rounded-full bg-subprimary px-4 py-3">
            <div className="h-4 w-7 rounded-full bg-white/10" />
            <div className="h-3 w-12 rounded-full bg-white/[0.08]" />
            <div className="h-3 w-12 rounded-full bg-white/[0.08]" />
            <div className="h-3 w-12 rounded-full bg-white/[0.08]" />
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-subprimary">
            <div className="size-4 rounded bg-white/10" />
          </div>
        </div>

        {/* Goal count */}
        <div className="mt-5 h-3 w-14 rounded-full bg-subprimary" />

        {/* Goal Cards */}
        <div className="mt-3 space-y-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-[1.65rem] border border-white/[0.07] bg-subprimary p-4"
            >
              {/* Goal title + action buttons */}
              <div className="flex items-center justify-between gap-3">
                <div className="h-4 w-28 rounded-md bg-white/[0.10]" />

                <div className="flex shrink-0 items-center gap-2">
                  <div className="size-7 rounded-full border border-white/[0.06] bg-primary/50" />
                  <div className="size-7 rounded-full border border-white/[0.06] bg-primary/50" />
                </div>
              </div>

              {/* Amount + percentage */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="h-4 w-24 rounded-md bg-white/[0.10]" />
                <div className="h-3 w-8 rounded-full bg-white/[0.08]" />
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-[7px] overflow-hidden rounded-full bg-primary">
                <div
                  className={`h-full rounded-full bg-white/15 ${
                    item === 1 ? 'w-[47%]' : 'w-[10%]'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Space reserved for bottom navigation */}
        <div className="h-36" />
      </div>
    )
  }

  /* ========================================================= */
  /* NO RELATIONSHIP */
  /* ========================================================= */

  if (!data) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />

        <div className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white/80 p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-100/40 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 sm:size-12">
              <Target size={19} strokeWidth={1.8} className="text-blue-500" />
            </div>

            <h1 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-neutral-800 sm:text-xl">
              {t('noRelationshipTitle')}
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-neutral-400 sm:text-sm">
              {t('noRelationshipDescription')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const relationshipId = data.relationship.id

  return (
    <div className="relative">
      <Header
        title={t('title')}
        description={t('description')}
      />

      <section className="mt-6 sm:mt-8">
        <GoalList
          relationshipId={relationshipId}
          onCreate={() => setShowCreate(true)}
        />
      </section>

      <CreateGoalFormModal
        relationshipId={relationshipId}
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  )
}