import { Heart, Sparkles } from 'lucide-react'

interface RelationshipCardProps {
  userName: string
  partnerName: string
  userAvatarUrl?: string | null
  partnerAvatarUrl?: string | null
  connectedAt?: string | null
}

export default function RelationshipCard({
  userName,
  partnerName,
  userAvatarUrl,
  partnerAvatarUrl,
  connectedAt,
}: RelationshipCardProps) {
  const daysTogether = connectedAt
    ? Math.max(
      1,
      Math.floor(
        (Date.now() -
          new Date(connectedAt).getTime()) /
        (1000 * 60 * 60 * 24),
      ),
    )
    : null

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/80 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl">

      {/* ===================================================== */}
      {/* AMBIENT BACKGROUND */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-blue-200/90 blur-[80px]" />

      <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-pink-200/90 blur-[80px]" />

      <div className="relative p-7 sm:p-8">

        {/* =================================================== */}
        {/* HEADER */}
        {/* =================================================== */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-800">
              Your relationship
            </p>

            <p className="mt-1 text-sm text-neutral-400">
              A little space for both of you.
            </p>

          </div>

          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50">
            <Sparkles
              size={15}
              className="text-pink-400"
            />
          </div>

        </div>


        {/* =================================================== */}
        {/* COUPLE */}
        {/* =================================================== */}

        <div className="mt-8 flex items-center justify-center">

          {/* USER */}

          <div className="text-center">

            <div className="relative mx-auto flex size-[68px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-blue-50 shadow-sm ring-4 ring-white">

              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-blue-500">
                  {userName
                    .slice(0, 1)
                    .toUpperCase()}
                </span>
              )}

            </div>

            <p className="mt-3 text-sm font-semibold text-neutral-800">
              {userName}
            </p>

            <p className="mt-0.5 text-[11px] text-neutral-400">
              You
            </p>

          </div>


          {/* CONNECTION */}

          <div className="mx-5 flex items-center">

            <div className="hidden h-px w-10 bg-black sm:block" />

            <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-pink-500 text-white shadow-[0_8px_20px_-8px_rgba(236,72,153,0.5)]">
              <div className='bg-white rounded-full size-10 relative flex shrink-0 items-center justify-center'>
                <Heart
                  size={17}
                  fill="#fb64b6"
                  strokeWidth={0}
                />
              </div>
            </div>

            <div className="hidden h-px w-10 bg-black sm:block" />

          </div>


          {/* PARTNER */}

          <div className="text-center">

            <div className="relative mx-auto flex size-[68px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-100 to-pink-50 shadow-sm ring-4 ring-white">

              {partnerAvatarUrl ? (
                <img
                  src={partnerAvatarUrl}
                  alt={partnerName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-pink-500">
                  {partnerName
                    .slice(0, 1)
                    .toUpperCase()}
                </span>
              )}

            </div>

            <p className="mt-3 text-sm font-semibold text-neutral-800">
              {partnerName}
            </p>

            <p className="mt-0.5 text-[11px] text-neutral-400">
              Partner
            </p>

          </div>

        </div>


        {/* =================================================== */}
        {/* DAYS TOGETHER */}
        {/* =================================================== */}

        {daysTogether && (
          <div className="mt-8 flex justify-center">

            <div className="rounded-full border border-black/[0.04] bg-neutral-50/80 px-4 py-2">

              <p className="text-xs text-neutral-400">
                Together for{' '}
                <span className="font-semibold text-neutral-700">
                  {daysTogether} days
                </span>
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  )
}