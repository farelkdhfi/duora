'use client'

import { useState } from 'react'
import { ArrowUpRight, Plus, Target } from 'lucide-react'

import CreateGoalFormModal from '@/features/goals/components/create-goal-form-modal'
import GoalList from '@/features/goals/components/goal-list'

import { useMyRelationshipDetails } from '@/features/relationship/queries'

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
              <Target
                size={19}
                strokeWidth={1.8}
                className="text-blue-500"
              />
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
      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <div className="relative overflow-hidden">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50 sm:size-8">
                <Target
                  size={13}
                  strokeWidth={2}
                  className="text-blue-500 sm:hidden"
                />
                <Target
                  size={15}
                  strokeWidth={2}
                  className="hidden text-blue-500 sm:block"
                />
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Together
              </p>
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-800 sm:mt-4 sm:text-3xl lg:text-4xl">
              Shared Goals
            </h1>

            <p className="mt-2 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
              Build something meaningful together, one goal at a time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0 sm:w-auto"
          >
            <Plus size={16} strokeWidth={2.4} />
            Create goal
            <ArrowUpRight
              size={14}
              className="ml-0.5 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>

      {/* =================================================== */}
      {/* GOALS */}
      {/* =================================================== */}

      <section className="mt-6 sm:mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
              Your goals
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-neutral-800 sm:text-lg">
              What you're building together
            </h2>
          </div>
        </div>

        <GoalList relationshipId={relationshipId} />
      </section>

      {/* ===================================================== */}
      {/* CREATE GOAL MODAL */}
      {/* ===================================================== */}

      <CreateGoalFormModal
        relationshipId={relationshipId}
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  )
}