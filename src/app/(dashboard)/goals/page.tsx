'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Plus,
  Target,
  X,
} from 'lucide-react'

import CreateGoalForm from '@/features/goals/components/create-goal-form'
import GoalList from '@/features/goals/components/goal-list'

import {
  useMyRelationshipDetails,
} from '@/features/relationship/queries'


export default function GoalsPage() {
  const [showCreate, setShowCreate] =
    useState(false)

  const {
    data,
    isLoading,
  } = useMyRelationshipDetails()


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
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">

        {/* Ambient */}

        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />


        <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/80 p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl">

          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-100/50 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-100/40 blur-3xl" />


          <div className="relative">

            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">

              <Target
                size={21}
                strokeWidth={1.8}
                className="text-blue-500"
              />

            </div>


            <h1 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-neutral-800">
              Connect with your partner
            </h1>


            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-400">
              You need to connect your relationship
              before creating shared goals.
            </p>

          </div>

        </div>

      </div>
    )
  }


  const relationshipId =
    data.relationship.id


  return (
    <div className="relative">

      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <div className="relative overflow-hidden">
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Heading */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50">
                <Target
                  size={15}
                  strokeWidth={2}
                  className="text-blue-500"
                />
              </div>


              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Together
              </p>

            </div>


            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-neutral-800 sm:text-4xl">
              Shared Goals
            </h1>


            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">
              Build something meaningful together,
              one goal at a time.
            </p>

          </div>


          {/* Create button */}

          <button
            type="button"
            onClick={() =>
              setShowCreate(true)
            }
            className="group flex h-11 items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0"
          >

            <Plus
              size={16}
              strokeWidth={2.4}
            />

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

      <section className="mt-8">

        <div className="mb-4 flex items-center justify-between">

          <div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
              Your goals
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
              What you're building together
            </h2>

          </div>

        </div>


        <GoalList
          relationshipId={relationshipId}
        />

      </section>


      {/* ===================================================== */}
      {/* CREATE GOAL MODAL */}
      {/* ===================================================== */}

      {showCreate && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/20 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCreate(false)
            }
          }}
        >

          <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.3)] backdrop-blur-xl">

            {/* Ambient */}

            <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-blue-100/40 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-pink-100/30 blur-3xl" />


            <div className="relative p-6 md:p-7">

              {/* ================================================= */}
              {/* MODAL HEADER */}
              {/* ================================================= */}

              <div className="flex items-start justify-between">

                <div className="flex items-start gap-3">

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-blue-50 to-pink-50">

                    <Target
                      size={17}
                      strokeWidth={2}
                      className="text-blue-500"
                    />

                  </div>


                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
                      Shared goal
                    </p>


                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
                      Create a new goal
                    </h2>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(false)
                  }
                  aria-label="Close"
                  className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
                >

                  <X
                    size={15}
                    strokeWidth={2.3}
                  />

                </button>

              </div>


              {/* ================================================= */}
              {/* FORM */}
              {/* ================================================= */}

              <div className="mt-7">

                <CreateGoalForm
                  relationshipId={
                    relationshipId
                  }
                  onSuccess={() =>
                    setShowCreate(false)
                  }
                />

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}