'use client'

export default function ProfileSkeleton() {
  return (
    <div className="relative w-full animate-pulse overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_50px_-24px_rgba(0,0,0,0.16)]">

      {/* ================================================= */}
      {/* TOP ACCENT */}
      {/* ================================================= */}

      <div className="h-[3px] bg-neutral-100" />

      <div className="relative p-5 sm:p-8 lg:p-10">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative">

          <div className="h-3 w-16 rounded-full bg-neutral-200" />

          <div className="mt-2 h-6 w-72 max-w-full rounded-lg bg-neutral-200 sm:h-7 sm:w-96" />

          <div className="mt-2.5 h-3 w-56 max-w-full rounded-full bg-neutral-100" />

        </div>


        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <div className="my-7 h-px bg-black/[0.05] sm:my-9" />


        {/* ================================================= */}
        {/* AVATAR */}
        {/* ================================================= */}

        <div className="rounded-[22px] border border-black/[0.04] bg-neutral-50/80 p-5 sm:p-6">

          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">

            {/* Avatar */}

            <div className="size-24 shrink-0 rounded-full bg-neutral-200 ring-1 ring-black/[0.04]" />


            {/* Avatar info */}

            <div className="min-w-0 flex-1">

              <div className="mx-auto h-4 w-28 rounded-full bg-neutral-200 sm:mx-0" />

              <div className="mx-auto mt-2 h-3 w-20 rounded-full bg-neutral-100 sm:mx-0" />

              <div className="mx-auto mt-4 h-9 w-28 rounded-full bg-neutral-200 sm:mx-0" />

              <div className="mx-auto mt-2.5 h-2.5 w-36 rounded-full bg-neutral-100 sm:mx-0" />

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <div className="my-7 h-px bg-black/[0.05] sm:my-9" />


        {/* ================================================= */}
        {/* DISPLAY NAME */}
        {/* ================================================= */}

        <div>

          <div className="mb-3 flex items-center gap-2.5">

            <div className="size-8 shrink-0 rounded-[11px] bg-neutral-100" />

            <div>

              <div className="h-3.5 w-24 rounded-full bg-neutral-200" />

              <div className="mt-1.5 h-2.5 w-48 rounded-full bg-neutral-100" />

            </div>

          </div>


          {/* Input + Button */}

          <div className="flex flex-col gap-2.5 sm:flex-row">

            <div className="min-h-12 flex-1 rounded-[16px] border border-black/[0.05] bg-neutral-50" />

            <div className="min-h-12 w-full rounded-[16px] bg-neutral-200 sm:w-24" />

          </div>

        </div>

      </div>

    </div>
  )
}