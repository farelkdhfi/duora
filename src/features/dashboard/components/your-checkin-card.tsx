import { CheckCircle2, Heart } from "lucide-react"

export default function YourCheckinCard({
  hasCheckedIn,
}: {
  hasCheckedIn: boolean
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[1.75rem]
        border
        border-black/[0.06]
        bg-neutral-900
        p-6
        shadow-[0_18px_45px_-25px_rgba(0,0,0,0.35)]
        sm:p-7
      "
    >

      {/* ================================================== */}
      {/* AMBIENT */}
      {/* ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          size-40
          rounded-full
          bg-pink-500/[0.08]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-16
          size-40
          rounded-full
          bg-blue-500/[0.06]
          blur-3xl
        "
      />


      {/* ================================================== */}
      {/* BIG HEART */}
      {/* ================================================== */}

      <Heart
        size={180}
        strokeWidth={1}
        className="
          pointer-events-none
          absolute
          -bottom-12
          -right-10
          rotate-[-12deg]
          text-white/[0.035]
          transition-transform
          duration-500
          group-hover:scale-105
        "
        fill="currentColor"
      />


      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <div className="relative">

        {/* Header */}

        <div className="flex items-start justify-between">

          <div
            className={`
              flex
              size-10
              items-center
              justify-center
              rounded-[13px]
              border
              transition-colors
              duration-300
              ${hasCheckedIn
                ? 'border-emerald-400/10 bg-emerald-400/10 text-emerald-400'
                : 'border-pink-400/10 bg-pink-400/10 text-pink-400'
              }
            `}
          >

            <CheckCircle2
              size={17}
              strokeWidth={2.2}
            />

          </div>


          {/* Status */}

          <div
            className={`
              flex
              items-center
              gap-1.5
              rounded-full
              border
              px-2.5
              py-1
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.12em]
              ${hasCheckedIn
                ? 'border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-400/80'
                : 'border-white/[0.06] bg-white/[0.04] text-neutral-500'
              }
            `}
          >

            <span
              className={`
                size-1.5
                rounded-full
                ${hasCheckedIn
                  ? 'bg-emerald-400'
                  : 'bg-neutral-600'
                }
              `}
            />

            {hasCheckedIn
              ? 'Completed'
              : 'Today'}

          </div>

        </div>


        {/* Label */}

        <p
          className="
            mt-6
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-neutral-500
          "
        >
          Your check-in
        </p>


        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        {hasCheckedIn ? (

          <div className="mt-2.5">

            <p
              className="
                text-[17px]
                font-semibold
                tracking-[-0.025em]
                text-white
              "
            >
              You're checked in
            </p>

            <p
              className="
                mt-1.5
                max-w-[280px]
                text-[12px]
                leading-relaxed
                text-neutral-400
              "
            >
              Thanks for sharing how you're
              feeling today.
            </p>

          </div>

        ) : (

          <div className="mt-2.5">

            <p
              className="
                text-[17px]
                font-semibold
                tracking-[-0.025em]
                text-white
              "
            >
              How are you feeling?
            </p>

            <p
              className="
                mt-1.5
                max-w-[280px]
                text-[12px]
                leading-relaxed
                text-neutral-400
              "
            >
              Take a small moment to check
              in with yourself today.
            </p>

          </div>

        )}


        {/* ================================================= */}
        {/* BOTTOM */}
        {/* ================================================= */}

        <div className="mt-6 flex items-center gap-2">

          <div
            className="
              flex
              size-6
              items-center
              justify-center
              rounded-full
              bg-white/[0.05]
            "
          >
            <Heart
              size={11}
              strokeWidth={0}
              fill="currentColor"
              className="text-pink-400"
            />
          </div>

          <p className="text-[10px] text-neutral-500">
            A little moment for yourself.
          </p>

        </div>

      </div>
    </div>
  )
}