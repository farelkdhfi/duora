'use client'

import {
  Target,
} from 'lucide-react'

import GoalCard from './goal-card'

import {
  useGoalsWithSavingsSummary,
} from '@/features/savings/queries'

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
  } = useGoalsWithSavingsSummary(relationshipId)


  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">

        {[1, 2].map((item) => (
          <div
            key={item}
            className="
              overflow-hidden
              rounded-[2rem]
              border border-black/[0.06]
              bg-white
              p-3
              shadow-[0_25px_70px_rgba(0,0,0,0.05)]
            "
          >

            <div className="
              animate-pulse
              rounded-[1.7rem]
              bg-[#f8f8f7]
              p-5
              md:p-7
            ">

              {/* Header */}

              <div className="
                flex
                items-start
                justify-between
              ">

                <div className="space-y-3">

                  <div className="
                    h-2
                    w-20
                    rounded-full
                    bg-neutral-200
                  " />

                  <div className="
                    h-5
                    w-40
                    rounded-lg
                    bg-neutral-200
                  " />

                </div>

                <div className="
                  size-10
                  rounded-full
                  bg-white
                " />

              </div>


              {/* Description */}

              <div className="mt-3 space-y-2">

                <div className="
                  h-3
                  w-full
                  rounded-full
                  bg-neutral-200
                " />

                <div className="
                  h-3
                  w-3/4
                  rounded-full
                  bg-neutral-200
                " />

              </div>


              {/* Progress */}

              <div className="mt-8">

                <div className="
                  h-3
                  w-24
                  rounded-full
                  bg-neutral-200
                " />

                <div className="
                  mt-3
                  h-7
                  w-32
                  rounded-lg
                  bg-neutral-200
                " />

                <div className="
                  mt-5
                  h-1.5
                  w-full
                  rounded-full
                  bg-neutral-200
                " />

              </div>


              {/* Footer */}

              <div className="
                mt-6
                border-t
                border-black/[0.05]
                pt-5
              ">

                <div className="
                  h-3
                  w-28
                  rounded-full
                  bg-neutral-200
                " />

              </div>

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
      <div className="
        rounded-[2rem]
        border border-black/[0.06]
        bg-white
        p-3
        shadow-[0_25px_70px_rgba(0,0,0,0.05)]
      ">

        <div className="
          rounded-[1.7rem]
          bg-[#f8f8f7]
          p-5
          md:p-7
        ">

          <div className="
            flex
            items-start
            gap-3
          ">

            <div className="
              flex size-9 shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-sm
            ">
              <Target
                size={16}
                strokeWidth={2}
                className="text-neutral-500"
              />
            </div>


            <div>

              <p className="
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-neutral-400
              ">
                Error
              </p>

              <p className="
                mt-1
                text-[13px]
                font-semibold
                text-neutral-900
              ">
                Couldn't load your goals
              </p>

              <p className="
                mt-1
                text-[12px]
                leading-relaxed
                text-neutral-400
              ">
                {error.message}
              </p>

            </div>

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
      <div className="
        rounded-[2rem]
        border border-black/[0.06]
        bg-white
        p-3
        shadow-[0_25px_70px_rgba(0,0,0,0.05)]
      ">

        <div className="
          relative
          overflow-hidden
          rounded-[1.7rem]
          bg-[#f8f8f7]
          p-10
          text-center
          md:p-12
        ">

          {/* Ambient */}

          <div className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            size-40
            rounded-full
            bg-blue-500/[0.05]
            blur-[80px]
          " />

          <div className="
            pointer-events-none
            absolute
            -bottom-16
            -left-16
            size-40
            rounded-full
            bg-pink-500/[0.06]
            blur-[80px]
          " />


          <div className="relative">

            <div className="
              mx-auto
              flex size-14
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-sm
            ">

              <Target
                size={21}
                strokeWidth={1.8}
                className="text-neutral-400"
              />

            </div>


            <p className="
              mt-5
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-neutral-400
            ">
              Nothing planned yet
            </p>


            <h3 className="
              mt-2
              text-[16px]
              font-semibold
              tracking-[-0.02em]
              text-neutral-900
            ">
              Build something together.
            </h3>


            <p className="
              mx-auto
              mt-1.5
              max-w-xs
              text-[13px]
              leading-relaxed
              text-neutral-400
            ">
              Create your first shared goal and
              start working toward it together.
            </p>

          </div>

        </div>

      </div>
    )
  }


  /* ========================================================= */
  /* GOALS */
  /* ========================================================= */

  return (
    <div className="grid gap-4 md:grid-cols-2">

      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          savings={goal.savings}
        />
      ))}

    </div>
  )
}