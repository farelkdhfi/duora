'use client'

export default function PlannerSkeleton() {
  return (
    <div className="relative animate-pulse">

      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <header>
        <div className="flex items-start justify-between gap-4">

          <div>

            {/* Label */}

            <div className="h-3 w-14 rounded-full bg-neutral-200" />

            {/* Title */}

            <div className="mt-2 h-8 w-32 rounded-xl bg-neutral-200 sm:h-9 sm:w-40" />

            {/* Description */}

            <div className="mt-2 h-3.5 w-64 rounded-full bg-neutral-100 sm:w-72" />

          </div>


          {/* Action */}

          <div className="hidden h-10 w-32 rounded-full bg-neutral-100 sm:block" />

        </div>
      </header>


      {/* =================================================== */}
      {/* PLANNER CONTENT */}
      {/* =================================================== */}

      <section className="mt-6 sm:mt-8">

        {/* Section heading */}

        <div className="mb-4">

          <div className="h-3 w-20 rounded-full bg-neutral-100" />

          <div className="mt-2 h-6 w-40 rounded-lg bg-neutral-200" />

        </div>


        {/* ================================================= */}
        {/* CALENDAR + EVENTS */}
        {/* ================================================= */}

        <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">

          {/* ================================================= */}
          {/* CALENDAR */}
          {/* ================================================= */}

          <div className="relative overflow-hidden rounded-[2rem] bg-[#111111] p-7 shadow-[0_25px_70px_rgba(0,0,0,0.10)] md:p-9">

            {/* Ambient */}

            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/[0.03] blur-[90px]" />

            <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/[0.02] blur-[90px]" />


            <div className="relative">

              {/* Calendar header */}

              <div className="flex items-center justify-between">

                <div>

                  <div className="h-2.5 w-16 rounded-full bg-white/10" />

                  <div className="mt-3 h-5 w-32 rounded-lg bg-white/10" />

                </div>


                {/* Navigation */}

                <div className="flex items-center gap-1">

                  <div className="size-8 rounded-full bg-white/[0.06]" />

                  <div className="size-8 rounded-full bg-white/[0.06]" />

                </div>

              </div>


              {/* Calendar */}

              <div className="mt-10">

                {/* Week days */}

                <div className="grid grid-cols-7 gap-1">

                  {Array.from({ length: 7 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="flex justify-center py-2"
                      >
                        <div className="h-2 w-2.5 rounded-full bg-white/[0.08]" />
                      </div>
                    ),
                  )}

                </div>


                {/* Dates */}

                <div className="mt-1 grid grid-cols-7 gap-y-2">

                  {Array.from({ length: 35 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="flex justify-center"
                      >
                        <div className="size-8 rounded-full bg-white/[0.05]" />
                      </div>
                    ),
                  )}

                </div>

              </div>


              {/* Footer */}

              <div className="mt-10 flex items-center gap-3 border-t border-white/[0.07] pt-5">

                <div className="flex -space-x-2">

                  <div className="size-7 rounded-full border-2 border-[#111111] bg-white/[0.07]" />

                  <div className="size-7 rounded-full border-2 border-[#111111] bg-white/[0.05]" />

                </div>

                <div className="h-2.5 w-28 rounded-full bg-white/[0.07]" />

              </div>

            </div>

          </div>


          {/* ================================================= */}
          {/* UPCOMING EVENTS */}
          {/* ================================================= */}

          <div className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">

            <div className="rounded-[1.7rem] bg-[#f8f8f7] p-5 md:p-7">

              {/* Header */}

              <div className="flex items-center justify-between">

                <div>

                  <div className="h-2.5 w-28 rounded-full bg-neutral-200" />

                  <div className="mt-3 h-5 w-56 rounded-lg bg-neutral-200" />

                </div>


                <div className="size-10 rounded-full bg-white" />

              </div>


              {/* Events */}

              <div className="mt-8 space-y-2">

                {Array.from({ length: 4 }).map(
                  (_, index) => (
                    <SkeletonEvent key={index} />
                  ),
                )}

              </div>


              {/* Bottom */}

              <div className="mt-4 flex items-center justify-between rounded-[1.4rem] bg-white p-4">

                <div>

                  <div className="h-2.5 w-10 rounded-full bg-neutral-100" />

                  <div className="mt-2 h-3.5 w-32 rounded-full bg-neutral-100" />

                </div>

                <div className="size-9 rounded-full bg-neutral-100" />

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}


/* ============================================================= */
/* EVENT SKELETON */
/* ============================================================= */

function SkeletonEvent() {
  return (
    <div className="flex items-center gap-4 rounded-[1.25rem] bg-white p-4">

      {/* Date */}

      <div className="size-12 shrink-0 rounded-[1rem] bg-neutral-100" />


      {/* Content */}

      <div className="min-w-0 flex-1">

        <div className="h-2 w-20 rounded-full bg-neutral-100" />

        <div className="mt-2 h-3.5 w-36 rounded-full bg-neutral-100" />

        <div className="mt-2 h-2.5 w-28 rounded-full bg-neutral-100" />

      </div>


      {/* Action */}

      <div className="size-8 shrink-0 rounded-full bg-neutral-100" />

    </div>
  )
}