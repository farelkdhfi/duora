'use client'

import { useState } from 'react'
import { Target } from 'lucide-react'

import CreateGoalFormModal from '@/features/goals/components/create-goal-form-modal'
import GoalList from '@/features/goals/components/goal-list'

import { useMyRelationshipDetails } from '@/features/relationship/queries'
import Header from '@/components/layout/header'

export default function GoalsPage() {
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading } = useMyRelationshipDetails()

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-3 w-24 rounded-full bg-neutral-100" />
        <div className="mt-3 h-8 w-48 rounded-xl bg-neutral-100" />
        <div className="mt-2 h-4 w-72 rounded-full bg-neutral-100" />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="h-44 rounded-[1.75rem] bg-neutral-100" />
          <div className="h-44 rounded-[1.75rem] bg-neutral-100" />
        </div>
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
              Connect with your partner
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-neutral-400 sm:text-sm">
              You need to connect your relationship before creating shared
              goals.
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
        title="Shared Goals"
        description="Build something meaningful together, one goal at a time."
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