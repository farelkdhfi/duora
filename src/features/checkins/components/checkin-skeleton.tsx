'use client'

export default function CheckinSkeleton() {
  return (
    <div className="flex min-h-dvh animate-pulse flex-col bg-primary px-4 pb-6 pt-6 sm:px-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">
          <div className="h-2.5 w-24 rounded-full bg-subprimary" />

          <div className="mt-3 h-7 w-64 max-w-full rounded-lg bg-subprimary" />

          <div className="mt-3 h-2.5 w-40 rounded-full bg-subprimary" />
        </div>

        <div className="size-10 shrink-0 rounded-full bg-subprimary" />

      </div>


      {/* ================================================= */}
      {/* MOOD */}
      {/* ================================================= */}

      <div className="flex flex-1 flex-col items-center justify-center py-8">

        <div className="size-52 rounded-full bg-subprimary sm:size-60" />

        <div className="mt-12 h-8 w-36 rounded-lg bg-subprimary" />

        <div className="mt-4 h-3 w-28 rounded-full bg-subprimary" />

        {/* Dots */}

        <div className="mt-8 flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-subprimary" />
          <div className="h-1.5 w-6 rounded-full bg-subprimary" />
          <div className="size-1.5 rounded-full bg-subprimary" />
          <div className="size-1.5 rounded-full bg-subprimary" />
          <div className="size-1.5 rounded-full bg-subprimary" />
        </div>

      </div>


      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div className="grid grid-cols-3 gap-2.5">
        <div className="h-11 rounded-full border border-white/[0.06] bg-subprimary" />
        <div className="h-11 rounded-full border border-white/[0.06] bg-subprimary" />
        <div className="h-11 rounded-full border border-white/[0.06] bg-subprimary" />
      </div>


      {/* ================================================= */}
      {/* SUBMIT */}
      {/* ================================================= */}

      <div className="mt-4 h-14 w-full rounded-full bg-subprimary" />

    </div>
  )
}