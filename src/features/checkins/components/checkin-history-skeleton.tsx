'use client'

export default function CheckinHistorySkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse px-5 py-7 sm:px-8 sm:py-10">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-7 sm:mb-9">
        <div className="mb-6 flex items-center gap-2">
          <div className="size-3.5 rounded-full bg-subprimary" />
          <div className="h-2.5 w-24 rounded-full bg-subprimary" />
        </div>

        <div className="h-7 w-56 rounded-lg bg-subprimary sm:h-8 sm:w-72" />

        <div className="mt-3 h-3 w-full max-w-md rounded-full bg-subprimary" />
      </div>


      {/* ================================================= */}
      {/* FILTER */}
      {/* ================================================= */}

      <div className="mb-7 flex sm:justify-start">
        <div className="inline-flex gap-1 rounded-full border border-white/[0.06] bg-primary p-1">
          <div className="h-9 min-w-[76px] rounded-full bg-subprimary sm:min-w-[88px]" />
          <div className="h-9 min-w-[76px] rounded-full bg-subprimary/50 sm:min-w-[88px]" />
          <div className="h-9 min-w-[76px] rounded-full bg-subprimary/50 sm:min-w-[88px]" />
        </div>
      </div>


      {/* ================================================= */}
      {/* LIST */}
      {/* ================================================= */}

      <div className="space-y-5 sm:space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCheckinCard key={index} />
        ))}
      </div>

    </div>
  )
}


function SkeletonCheckinCard() {
  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-primary sm:rounded-[2rem]">
      <div className="p-5 sm:p-7 lg:p-8">
        <div className="flex w-full items-center gap-4">

          {/* Mood */}

          <div className="size-20 shrink-0 rounded-full bg-subprimary sm:size-9" />

          {/* Name + date */}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-24 rounded-full bg-subprimary" />
              <div className="h-2.5 w-10 rounded-full bg-subprimary" />
            </div>

            <div className="mt-2 h-2.5 w-20 rounded-full bg-subprimary" />
          </div>

          {/* Expand */}

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden h-2.5 w-24 rounded-full bg-subprimary sm:block" />
            <div className="size-8 rounded-full bg-subprimary" />
          </div>

        </div>
      </div>
    </div>
  )
}