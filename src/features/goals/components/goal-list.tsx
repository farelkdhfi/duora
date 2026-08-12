'use client'

import {
  Target,
} from 'lucide-react'

import GoalCard from './goal-card'

import {
  useGoals,
} from '../queries'


interface GoalListProps {
  relationshipId: string
}


export default function GoalList({
  relationshipId,
}: GoalListProps) {

  const {
    data: goals,
    isLoading,
    error,
  } = useGoals(
    relationshipId,
  )


  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2">

        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-56 animate-pulse rounded-[1.75rem] border border-black/[0.05] bg-white p-6"
          >

            <div className="flex items-start justify-between">

              <div className="space-y-3">

                <div className="h-2.5 w-16 rounded-full bg-neutral-100" />

                <div className="h-5 w-40 rounded-lg bg-neutral-100" />

              </div>


              <div className="size-8 rounded-full bg-neutral-100" />

            </div>


            <div className="mt-6 space-y-2">

              <div className="h-3 w-full rounded-full bg-neutral-100" />

              <div className="h-3 w-3/4 rounded-full bg-neutral-100" />

            </div>


            <div className="mt-7 flex gap-2">

              <div className="h-7 w-28 rounded-full bg-neutral-100" />

              <div className="h-7 w-24 rounded-full bg-neutral-100" />

            </div>

          </div>
        ))}

      </div>
    )
  }


  /* ========================================================= */
  /* ERROR */
  /* ========================================================= */

  if (error) {
    return (
      <div className="rounded-[1.75rem] border border-rose-100 bg-rose-50/50 p-6">

        <div className="flex items-center gap-3">

          <div className="flex size-9 items-center justify-center rounded-xl bg-white">

            <Target
              size={16}
              className="text-rose-400"
            />

          </div>


          <div>

            <p className="text-sm font-medium text-rose-600">
              Couldn't load your goals
            </p>

            <p className="mt-0.5 text-xs text-rose-400">
              {error.message}
            </p>

          </div>

        </div>

      </div>
    )
  }


  /* ========================================================= */
  /* EMPTY */
  /* ========================================================= */

  if (!goals?.length) {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-black/[0.08] bg-white/70 p-10 text-center">

        <div className="pointer-events-none absolute -right-16 -top-16 size-36 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-16 -left-16 size-36 rounded-full bg-pink-100/30 blur-3xl" />


        <div className="relative">

          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">

            <Target
              size={21}
              strokeWidth={1.8}
              className="text-blue-500"
            />

          </div>


          <h3 className="mt-5 text-base font-semibold tracking-[-0.02em] text-neutral-800">
            No goals yet
          </h3>


          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-400">
            Create your first shared goal and
            start building something together.
          </p>

        </div>

      </div>
    )
  }


  /* ========================================================= */
  /* GOALS */
  /* ========================================================= */

  return (
    <div className="grid gap-5 md:grid-cols-2">

      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
        />
      ))}

    </div>
  )
}