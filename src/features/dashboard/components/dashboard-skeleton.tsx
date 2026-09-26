'use client'

export default function DashboardSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto animate-pulse">

        {/* =================================================== */}
        {/* HEADER */}
        {/* =================================================== */}

        <header>
          <div className="h-4 w-24 rounded-full bg-neutral-200" />

          <div className="mt-2 flex items-center justify-between gap-4">
            <div>
              <div className="h-9 w-44 rounded-xl bg-neutral-200 sm:h-10 sm:w-52" />
              <div className="mt-3 h-4 w-64 rounded-full bg-neutral-100" />
            </div>

            <div className="size-5 rounded-full bg-neutral-200" />
          </div>
        </header>


        {/* =================================================== */}
        {/* RELATIONSHIP */}
        {/* =================================================== */}

        <section className="mt-8">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)] sm:p-7">

            <div className="flex items-center gap-5">

              <div className="size-14 shrink-0 rounded-full bg-neutral-200" />

              <div className="min-w-0 flex-1">
                <div className="h-4 w-32 rounded-full bg-neutral-200" />
                <div className="mt-2 h-3 w-24 rounded-full bg-neutral-100" />
              </div>

              <div className="hidden sm:block">
                <div className="h-3 w-20 rounded-full bg-neutral-100" />
              </div>

            </div>

            <div className="mt-6 h-px w-full bg-neutral-100" />

            <div className="mt-5 flex items-center justify-between">
              <div className="h-3 w-28 rounded-full bg-neutral-100" />
              <div className="h-3 w-20 rounded-full bg-neutral-100" />
            </div>

          </div>
        </section>


        {/* =================================================== */}
        {/* YOUR SPACE */}
        {/* =================================================== */}

        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="h-3 w-20 rounded-full bg-neutral-100" />
              <div className="mt-2 h-6 w-40 rounded-lg bg-neutral-200" />
            </div>

            <div className="size-5 rounded-full bg-neutral-100" />
          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* Partner Check-in */}

            <SkeletonCard>
              <SkeletonIcon />

              <div className="mt-5 h-3 w-24 rounded-full bg-neutral-100" />
              <div className="mt-2 h-5 w-40 rounded-lg bg-neutral-200" />
              <div className="mt-2 h-3 w-56 rounded-full bg-neutral-100" />

              <div className="mt-6 h-3 w-28 rounded-full bg-neutral-100" />
            </SkeletonCard>


            {/* Goals */}

            <SkeletonCard>
              <SkeletonIcon />

              <div className="mt-5 h-3 w-16 rounded-full bg-neutral-100" />
              <div className="mt-2 h-5 w-32 rounded-lg bg-neutral-200" />

              <div className="mt-5 space-y-3">
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </div>
            </SkeletonCard>


            {/* Planner */}

            <SkeletonCard>
              <SkeletonIcon />

              <div className="mt-5 h-3 w-20 rounded-full bg-neutral-100" />
              <div className="mt-2 h-5 w-44 rounded-lg bg-neutral-200" />
              <div className="mt-2 h-3 w-60 rounded-full bg-neutral-100" />

              <div className="mt-5 h-3 w-32 rounded-full bg-neutral-100" />
            </SkeletonCard>


            {/* Your Check-in */}

            <div className="relative overflow-hidden rounded-[1.75rem] bg-neutral-900 p-6 sm:p-7">

              <div className="flex items-start justify-between">

                <div className="size-10 rounded-[13px] bg-white/[0.08]" />

                <div className="h-6 w-20 rounded-full bg-white/[0.06]" />

              </div>

              <div className="mt-6 h-3 w-24 rounded-full bg-white/[0.06]" />

              <div className="mt-3 h-5 w-40 rounded-lg bg-white/[0.08]" />

              <div className="mt-2 h-3 w-64 max-w-full rounded-full bg-white/[0.05]" />

              <div className="mt-6 h-6 w-36 rounded-full bg-white/[0.05]" />

            </div>

          </div>

        </section>


        {/* =================================================== */}
        {/* TODAY */}
        {/* =================================================== */}

        <section className="mt-10">

          <div className="mb-4">
            <div className="h-3 w-12 rounded-full bg-neutral-100" />
            <div className="mt-2 h-6 w-44 rounded-lg bg-neutral-200" />
          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* Reminder */}

            <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)] sm:p-7">

              <div className="size-10 rounded-[13px] bg-neutral-100" />

              <div className="mt-5 h-3 w-28 rounded-full bg-neutral-100" />

              <div className="mt-2 h-5 w-48 rounded-lg bg-neutral-200" />

              <div className="mt-2 h-3 w-64 max-w-full rounded-full bg-neutral-100" />

            </div>


            {/* Quick Stats */}

            <div className="grid grid-cols-2 gap-4">

              <SkeletonMiniStat />

              <SkeletonMiniStat />

            </div>

          </div>

        </section>

      </div>
    </main>
  )
}


/* ============================================================= */
/* SKELETON CARD */
/* ============================================================= */

function SkeletonCard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)] sm:p-7">
      {children}
    </div>
  )
}


/* ============================================================= */
/* SKELETON ICON */
/* ============================================================= */

function SkeletonIcon() {
  return (
    <div className="size-10 rounded-[13px] bg-neutral-100" />
  )
}


/* ============================================================= */
/* SKELETON LINE */
/* ============================================================= */

function SkeletonLine() {
  return (
    <div className="flex items-center gap-3">
      <div className="size-7 rounded-lg bg-neutral-100" />
      <div className="h-3 flex-1 rounded-full bg-neutral-100" />
    </div>
  )
}


/* ============================================================= */
/* MINI STAT SKELETON */
/* ============================================================= */

function SkeletonMiniStat() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white p-5 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)]">

      <div className="size-9 rounded-[11px] bg-neutral-100" />

      <div className="mt-4 h-3 w-20 rounded-full bg-neutral-100" />

      <div className="mt-2 h-4 w-24 rounded-lg bg-neutral-200" />

    </div>
  )
}