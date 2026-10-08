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
          (Date.now() - new Date(connectedAt).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null

  return (
    <section className="relative overflow-hidden rounded-b-[2.75rem] bg-[#000000] px-5 py-8 shadow-[0_30px_80px_-40px_rgba(20,10,30,0.8)] sm:rounded-[2rem] sm:px-8 sm:py-10">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Ambient light */}

        <div className="absolute -left-[20%] -top-[35%] size-[420px] rounded-full bg-[#e987ad]/20 blur-[120px]" />

        <div className="absolute -right-[20%] -top-[30%] size-[400px] rounded-full bg-[#789fe5]/20 blur-[120px]" />

        <div className="absolute bottom-[-45%] left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-[#a879bd]/10 blur-[130px]" />

        {/* Subtle vertical gradient */}

        <div className="absolute inset-0 bg-linear-to-b from-white/[0.025] via-transparent to-black/10" />

        {/* Elegant flowing lines */}

        <svg
          className="absolute inset-0 h-full w-full opacity-60"
          viewBox="0 0 900 500"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="elegant-wave"
              x1="0"
              y1="0"
              x2="900"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8ebcff" stopOpacity="0" />
              <stop offset=".25" stopColor="#8ebcff" stopOpacity=".28" />
              <stop offset=".5" stopColor="#ffafd0" stopOpacity=".4" />
              <stop offset=".75" stopColor="#c49bea" stopOpacity=".28" />
              <stop offset="1" stopColor="#ffafd0" stopOpacity="0" />
            </linearGradient>

            <filter
              id="soft-wave"
              x="-20%"
              y="-100%"
              width="140%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <path
            d="M-80 145C90 65 170 90 300 150C430 210 520 220 650 145C760 82 850 95 980 145"
            stroke="url(#elegant-wave)"
            strokeWidth="34"
            strokeOpacity=".1"
            filter="url(#soft-wave)"
          />

          <path
            d="M-80 250C70 195 165 200 290 250C410 300 500 315 625 250C750 185 850 200 980 250"
            stroke="url(#elegant-wave)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          <path
            d="M-80 385C70 325 170 340 300 395C420 445 520 450 650 385C770 325 850 335 980 390"
            stroke="url(#elegant-wave)"
            strokeWidth="18"
            strokeOpacity=".06"
            filter="url(#soft-wave)"
          />
        </svg>

        {/* Minimal grain */}

        <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(rgba(255,255,255,0.8)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
      </div>

      {/* CONTENT */}

      <div className="relative z-10">
        {/* TOP LABEL */}

        <div className="mb-7 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-linear-to-r from-transparent to-white/20" />

            <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/35">
              Your relationship
            </span>

            <span className="h-px w-8 bg-linear-to-l from-transparent to-white/20" />
          </div>
        </div>

        {/* PEOPLE */}

        <div className="relative flex items-center justify-center gap-5 sm:gap-14">
          {/* CONNECTION LINE */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-[270px] -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-[#8ebcff]/20 via-[#ffafd0]/60 to-[#ffafd0]/20 sm:block md:w-[340px]" />

          <Person
            name={userName}
            role="You"
            avatarUrl={userAvatarUrl}
            accent="blue"
          />

          {/* CENTER */}

          <div className="relative z-20 flex shrink-0 items-center justify-center">
            <div className="relative flex size-[58px] items-center justify-center sm:size-[68px]">
              {/* Outer glow */}

              <div className="absolute inset-0 rounded-full bg-[#e99aba]/10 blur-xl" />

              {/* Thin ring */}

              <div className="absolute inset-0 rounded-full border border-white/10" />

              {/* Gradient ring */}

              <div className="absolute inset-[5px] rounded-full border border-[#ffb0cd]/20" />

              {/* Core */}

              <div className="relative flex size-10 items-center justify-center rounded-full border border-white/10 bg-[#2b2335]/90 shadow-[0_15px_35px_-15px_rgba(0,0,0,.9)] backdrop-blur-xl sm:size-12">
                <RelationshipHeart />
              </div>
            </div>
          </div>

          <Person
            name={partnerName}
            role="Partner"
            avatarUrl={partnerAvatarUrl}
            accent="pink"
          />
        </div>

        {/* RELATIONSHIP INFO */}

        {daysTogether && (
          <div className="mt-5 flex flex-col items-center">
            <div className="flex items-baseline gap-2">
              <span className="bg-linear-to-r from-[#ffb2ce] via-[#d5b0ed] to-[#9bc5ff] bg-clip-text text-[30px] font-semibold tracking-[-0.05em] text-transparent sm:text-[34px]">
                {daysTogether}
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                days together
              </span>
            </div>

            <div className="mt-2 h-px w-14 bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </div>
        )}
      </div>
    </section>
  )
}

/* ============================================================= */
/* PERSON */
/* ============================================================= */

function Person({
  name,
  role,
  avatarUrl,
  accent,
}: {
  name: string
  role: string
  avatarUrl?: string | null
  accent: 'blue' | 'pink'
}) {
  const isBlue = accent === 'blue'

  return (
    <div className="relative z-10 min-w-0 text-center">
      <div
        className={`relative mx-auto size-[82px] rounded-full p-[2px] sm:size-[104px] sm:p-[3px] ${
          isBlue
            ? 'bg-linear-to-br from-[#9fcaff] via-[#789fda]/70 to-[#526989]/20'
            : 'bg-linear-to-br from-[#ffb7d1] via-[#d586a9]/70 to-[#74445b]/20'
        }`}
      >
        {/* Outer glow */}

        <div
          className={`absolute -inset-2 rounded-full opacity-30 blur-xl ${
            isBlue ? 'bg-[#82b5f5]' : 'bg-[#ef91b5]'
          }`}
        />

        {/* Avatar */}

        <div className="relative h-full w-full overflow-hidden rounded-full bg-[#27202f] p-[3px] sm:p-1">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center rounded-full ${
                isBlue
                  ? 'bg-linear-to-br from-[#334766] to-[#1b2433]'
                  : 'bg-linear-to-br from-[#593348] to-[#2b2028]'
              }`}
            >
              <span
                className={`text-[25px] font-medium tracking-[-0.06em] sm:text-[30px] ${
                  isBlue ? 'text-[#b7d5ff]' : 'text-[#ffc1d8]'
                }`}
              >
                {name.slice(0, 1).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Online indicator */}

        <span
          className={`absolute bottom-1.5 right-1.5 size-3 rounded-full border-[2px] border-[#211b2b] sm:bottom-2 sm:right-2 ${
            isBlue ? 'bg-[#9bc6ff]' : 'bg-[#ffafd0]'
          }`}
        />
      </div>

      <div className="mt-3">
        <p className="mx-auto max-w-[105px] truncate text-[12px] font-semibold tracking-[-0.02em] text-white/85 sm:max-w-[135px] sm:text-[13px]">
          {name}
        </p>

        <p
          className={`mt-1 text-[8px] font-medium uppercase tracking-[0.22em] ${
            isBlue ? 'text-[#9bc6ff]/45' : 'text-[#ffafd0]/45'
          }`}
        >
          {role}
        </p>
      </div>
    </div>
  )
}

/* ============================================================= */
/* RELATIONSHIP HEART */
/* ============================================================= */

function RelationshipHeart() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="size-6 sm:size-7"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="relationship-heart-gradient"
          x1="9"
          y1="10"
          x2="39"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff9fc3" />
          <stop offset=".5" stopColor="#d4a8eb" />
          <stop offset="1" stopColor="#91c4ff" />
        </linearGradient>
      </defs>

      <path
        d="M24 37C21.5 34.9 10 27.5 10 18.5C10 13.8 13.2 10.5 17.5 10.5C20.3 10.5 22.6 12 24 14.3C25.4 12 27.7 10.5 30.5 10.5C34.8 10.5 38 13.8 38 18.5C38 27.5 26.5 34.9 24 37Z"
        fill="url(#relationship-heart-gradient)"
      />

      <path
        d="M15 17C15.5 14.5 17.2 13.5 19 13.8"
        stroke="white"
        strokeOpacity=".75"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}