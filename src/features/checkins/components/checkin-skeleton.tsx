'use client'

export default function CheckinSkeleton() {
  return (
    <div className="mt-6 grid animate-pulse gap-5 sm:mt-8 lg:grid-cols-2 lg:items-start">

      {/* ================================================= */}
      {/* CHECK-IN FORM */}
      {/* ================================================= */}

      <section className="rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_50px_-24px_rgba(0,0,0,0.12)] sm:p-7">

        <div>
          <div className="h-3 w-20 rounded-full bg-neutral-200" />

          <div className="mt-2 h-6 w-40 rounded-lg bg-neutral-200" />

          <div className="mt-2 h-3 w-56 rounded-full bg-neutral-100" />
        </div>


        {/* Mood */}

        <div className="mt-7">

          <div className="h-3 w-20 rounded-full bg-neutral-200" />

          <div className="mt-3 grid grid-cols-5 gap-2">

            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-14 rounded-[16px] bg-neutral-100"
              />
            ))}

          </div>

        </div>


        {/* Fields */}

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
        </div>


        {/* Note */}

        <div className="mt-6">

          <div className="mb-3 h-3 w-28 rounded-full bg-neutral-200" />

          <div className="h-28 rounded-[18px] border border-black/[0.05] bg-neutral-50" />

        </div>


        {/* Submit */}

        <div className="mt-6 h-12 w-full rounded-[16px] bg-neutral-200" />

      </section>


      {/* ================================================= */}
      {/* HISTORY */}
      {/* ================================================= */}

      <section>

        <div className="mb-4">

          <div className="h-3 w-16 rounded-full bg-neutral-100" />

          <div className="mt-2 h-6 w-28 rounded-lg bg-neutral-200" />

          <div className="mt-2 h-3 w-64 max-w-full rounded-full bg-neutral-100" />

        </div>


        <div className="space-y-3.5 sm:space-y-4">

          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCheckinCard key={index} />
          ))}

        </div>

      </section>

    </div>
  )
}


function SkeletonField() {
  return (
    <div>
      <div className="mb-3 h-3 w-20 rounded-full bg-neutral-200" />

      <div className="h-12 rounded-[16px] border border-black/[0.05] bg-neutral-50" />
    </div>
  )
}


function SkeletonCheckinCard() {
  return (
    <div className="rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:p-6">

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="size-10 shrink-0 rounded-full bg-neutral-100" />

          <div className="min-w-0">
            <div className="h-3.5 w-24 rounded-full bg-neutral-200" />
            <div className="mt-2 h-2.5 w-32 rounded-full bg-neutral-100" />
          </div>

        </div>

        <div className="size-8 shrink-0 rounded-full bg-neutral-100" />

      </div>


      <div className="mt-5 flex items-center gap-3">

        <div className="size-10 rounded-[14px] bg-neutral-100" />

        <div className="h-4 w-20 rounded-full bg-neutral-200" />

      </div>


      <div className="mt-5 space-y-2">

        <div className="h-3 w-full rounded-full bg-neutral-100" />

        <div className="h-3 w-4/5 rounded-full bg-neutral-100" />

      </div>

    </div>
  )
}