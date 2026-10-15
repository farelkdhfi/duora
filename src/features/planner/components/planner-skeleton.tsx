'use client'

export default function PlannerSkeleton() {
  return (
    <div className="relative min-h-screen animate-pulse bg-primary text-white">
      {/* HEADER */}
      <header className="flex items-start justify-between gap-4">
        <div>
          {/* Title */}
          <div className="h-6 w-20 rounded-md bg-subprimary" />

          {/* Description */}
          <div className="mt-3 h-3 w-60 max-w-full rounded-full bg-subprimary" />
        </div>

        {/* Add plan button */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-subprimary">
          <div className="size-4 rounded-full bg-primary" />
        </div>
      </header>

      {/* WEEKLY CALENDAR */}
      <section className="mt-7">
        {/* Month & navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-32 rounded-md bg-subprimary" />
            <div className="h-3 w-3 rounded-sm bg-subprimary" />
          </div>

          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-subprimary" />
            <div className="size-8 rounded-full bg-subprimary" />
          </div>
        </div>

        {/* Week dates */}
        <div className="mt-4 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`flex h-[75px] flex-col items-center justify-center gap-3 rounded-2xl ${
                index === 4
                  ? 'border border-white/10 bg-subprimary'
                  : ''
              }`}
            >
              <div className="h-2.5 w-5 rounded-full bg-subprimary" />
              <div className="h-4 w-6 rounded-md bg-subprimary" />
            </div>
          ))}
        </div>
      </section>

      {/* SELECTED DATE */}
      <section className="mt-7">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="h-3.5 w-36 rounded-full bg-subprimary" />
          <div className="h-2.5 w-10 rounded-full bg-subprimary" />
        </div>

        {/* EMPTY STATE */}
        <div className="flex min-h-[420px] flex-col items-center justify-center px-4 text-center">
          {/* Calendar icon placeholder */}
          <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-subprimary">
            <div className="size-4 rounded-sm border border-white/20" />
          </div>

          {/* Empty state title */}
          <div className="mt-5 h-4 w-36 rounded-full bg-subprimary" />

          {/* Empty state description */}
          <div className="mt-3 h-3 w-52 max-w-full rounded-full bg-subprimary" />

          {/* Next plan button */}
          <div className="mt-10 h-9 w-44 rounded-full bg-subprimary" />
        </div>
      </section>
    </div>
  )
}