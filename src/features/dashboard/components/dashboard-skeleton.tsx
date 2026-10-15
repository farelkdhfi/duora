'use client'

export default function DashboardSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-primary text-white">
      <div className="relative mx-auto w-full max-w-7xl animate-pulse px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex shrink-0 -space-x-3">
              <div className="size-9 rounded-full bg-subprimary ring-2 ring-primary sm:size-10" />
              <div className="size-9 rounded-full bg-subprimary ring-2 ring-primary sm:size-10" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-4 w-10 rounded bg-subprimary" />
                <div className="h-2 w-24 rounded-full bg-subprimary sm:w-28" />
              </div>
              <div className="mt-1.5 h-2 w-28 rounded-full bg-subprimary sm:w-32" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="size-9 rounded-full border border-white/10 bg-subprimary sm:size-10" />
            <div className="size-9 rounded-full border border-white/10 bg-subprimary sm:size-10" />
          </div>
        </header>

        {/* RELATIONSHIP CHECK-IN */}
        <section className="mt-12 sm:mt-14">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-36 rounded bg-subprimary sm:w-40" />
            <div className="size-9 rounded-full bg-subprimary" />
          </div>

          {/* Partner mood */}
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-8">
            {/* You */}
            <div className="flex flex-col gap-4">
              <div>
                <div className="h-2 w-12 rounded-full bg-subprimary" />
                <div className="mt-1.5 h-0.5 w-full max-w-20 bg-white/10" />
              </div>
              <div>
                <div className="h-2 w-14 rounded-full bg-subprimary" />
                <div className="mt-1.5 h-0.5 w-full max-w-20 bg-white/10" />
              </div>
            </div>

            {/* Mood actions */}
            <div className="flex items-start gap-5 sm:gap-10">
              <div className="flex flex-col items-center">
                <div className="size-12 rounded-full border border-white/[0.06] bg-subprimary sm:size-14" />
                <div className="mt-3 h-2 w-12 rounded-full bg-subprimary" />
                <div className="mt-2 h-3 w-8 rounded bg-subprimary" />
              </div>

              <div className="flex flex-col items-center">
                <div className="size-12 rounded-full border border-white/[0.06] bg-subprimary sm:size-14" />
                <div className="mt-3 h-2 w-12 rounded-full bg-subprimary" />
                <div className="mt-2 h-3 w-12 rounded bg-subprimary" />
              </div>
            </div>

            {/* Partner mood stats */}
            <div className="flex flex-col gap-4">
              <div className="ml-auto w-full max-w-20">
                <div className="ml-auto h-2 w-12 rounded-full bg-subprimary" />
                <div className="mt-1.5 h-0.5 w-full bg-white/10" />
              </div>
              <div className="ml-auto w-full max-w-20">
                <div className="ml-auto h-2 w-14 rounded-full bg-subprimary" />
                <div className="mt-1.5 h-0.5 w-full bg-white/10" />
              </div>
            </div>
          </div>

          {/* Weekly semicircle timeline */}
          <div className="relative mt-8 h-28 overflow-hidden sm:mt-10 sm:h-32">
            <div className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center">
              <div className="h-3 w-8 rounded-full bg-subprimary" />
              <div className="mt-2 h-3 w-12 rounded bg-subprimary" />
            </div>

            <div className="absolute left-1/2 top-7 h-48 w-[145%] -translate-x-1/2 rounded-[50%] border-[18px] border-[#37373d] bg-transparent sm:w-[120%]" />

            {/* Timeline markers */}
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-around px-1 sm:px-12">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === 6 ? 'h-4 w-1.5 rounded-full bg-white' : 'bg-white/25'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="-mt-1 flex flex-col items-center">
            <div className="h-3 w-28 rounded bg-subprimary" />
            <div className="mt-2 h-2 w-12 rounded-full bg-subprimary" />
          </div>
        </section>

        {/* PLANNING */}
        <section className="mt-12 sm:mt-14">
          <SectionHeading titleWidth="w-24" />

          <div className="mt-4 overflow-hidden rounded-2xl bg-subprimary p-3 sm:rounded-3xl sm:p-4">
            {/* Planner pagination */}
            <div className="flex items-center gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                    index === 0 ? 'bg-white/15' : 'bg-primary'
                  }`}
                >
                  <div className="size-2 rounded-full bg-white/20" />
                </div>
              ))}
              <div className="ml-auto h-7 w-14 shrink-0 rounded-full bg-primary" />
            </div>

            {/* Planner event */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary sm:size-[72px]">
                <div className="h-2 w-6 rounded-full bg-subprimary" />
                <div className="mt-1.5 h-6 w-8 rounded bg-subprimary" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="h-2 w-28 max-w-full rounded-full bg-white/10" />
                <div className="mt-2 h-3 w-32 max-w-full rounded bg-white/10" />
                <div className="mt-2 h-2 w-24 max-w-full rounded-full bg-white/[0.06]" />
              </div>

              <div className="hidden h-8 w-20 shrink-0 rounded-full bg-primary sm:block" />
            </div>
          </div>
        </section>

        {/* WORKSPACE */}
        <section className="mt-10 sm:mt-12">
          <SectionHeading titleWidth="w-32" />

          {/* Goals */}
          <div className="relative mt-4 min-h-52 overflow-hidden rounded-[1.75rem] bg-subprimary p-5 sm:min-h-56 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="h-3 w-28 rounded bg-white/10" />
              <div className="size-8 rounded-full bg-white/[0.06]" />
            </div>

            <div className="mt-8">
              <div className="h-2 w-20 rounded-full bg-white/[0.08]" />
              <div className="mt-3 h-5 w-32 rounded bg-white/10" />
            </div>

            {/* Decorative goal progress */}
            <div className="absolute -bottom-10 right-5 size-24 rounded-full border-[10px] border-white/[0.05] sm:right-10 sm:size-28" />
            <div className="absolute -bottom-12 right-7 size-24 rounded-full border-[3px] border-white/[0.08] sm:right-12 sm:size-28" />
          </div>

          {/* Latest activity */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5">
            <ActivitySkeleton />
            <ActivitySkeleton />
          </div>

          {/* More workspace items */}
          <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-5">
            <WorkspaceMiniSkeleton />
            <WorkspaceMiniSkeleton />
          </div>
        </section>

        {/* TODAY / SUMMARY */}
        <section className="mt-10 sm:mt-12">
          <SectionHeading titleWidth="w-28" />

          <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-5">
            <div className="rounded-2xl bg-subprimary p-5 sm:rounded-3xl sm:p-6">
              <div className="size-9 rounded-full bg-primary" />
              <div className="mt-5 h-2 w-24 rounded-full bg-white/[0.08]" />
              <div className="mt-2 h-4 w-40 max-w-full rounded bg-white/10" />
              <div className="mt-2 h-2 w-52 max-w-full rounded-full bg-white/[0.06]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MiniStatSkeleton />
              <MiniStatSkeleton />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function SectionHeading({ titleWidth }: { titleWidth: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`h-3 shrink-0 rounded bg-subprimary ${titleWidth}`} />
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-subprimary p-3 sm:rounded-3xl sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="h-3 w-20 max-w-full rounded bg-white/10" />
        <div className="size-7 shrink-0 rounded-full bg-primary" />
      </div>
      <div className="mt-5 h-20 rounded-xl bg-primary/70 sm:h-24" />
      <div className="mt-4 h-3 w-28 max-w-full rounded bg-white/10" />
      <div className="mt-2 h-2 w-20 max-w-full rounded-full bg-white/[0.06]" />
    </div>
  )
}

function WorkspaceMiniSkeleton() {
  return (
    <div className="min-w-0 rounded-2xl bg-subprimary p-3 sm:rounded-3xl sm:p-5">
      <div className="size-8 rounded-xl bg-primary" />
      <div className="mt-4 h-3 w-24 max-w-full rounded bg-white/10" />
      <div className="mt-2 h-2 w-16 max-w-full rounded-full bg-white/[0.06]" />
    </div>
  )
}

function MiniStatSkeleton() {
  return (
    <div className="min-w-0 rounded-2xl bg-subprimary p-3 sm:rounded-3xl sm:p-5">
      <div className="size-8 rounded-xl bg-primary" />
      <div className="mt-4 h-2 w-14 max-w-full rounded-full bg-white/[0.08]" />
      <div className="mt-2 h-4 w-16 max-w-full rounded bg-white/10" />
    </div>
  )
}