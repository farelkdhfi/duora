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
    <section className="relative overflow-hidden rounded-b-[7rem] border border-white/[0.07] bg-neutral-900 px-5 py-7 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.8)] sm:rounded-2xl sm:px-8 sm:py-9">
      {/* DARK WAVE BACKGROUND */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 900 500"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="wave-pink-blue"
            x1="0"
            y1="0"
            x2="900"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e49ab5" stopOpacity=".85" />
            <stop offset=".45" stopColor="#a9a1b3" stopOpacity=".7" />
            <stop offset="1" stopColor="#91afd4" stopOpacity=".85" />
          </linearGradient>

          <linearGradient
            id="wave-blue-pink"
            x1="900"
            y1="0"
            x2="0"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#91afd4" stopOpacity=".85" />
            <stop offset=".5" stopColor="#aaa2b3" stopOpacity=".65" />
            <stop offset="1" stopColor="#e49ab5" stopOpacity=".85" />
          </linearGradient>

          <radialGradient id="pink-bubble">
            <stop offset="0" stopColor="#e9a8bd" stopOpacity=".34" />
            <stop offset=".65" stopColor="#e9a8bd" stopOpacity=".1" />
            <stop offset="1" stopColor="#e9a8bd" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="blue-bubble">
            <stop offset="0" stopColor="#9eb9df" stopOpacity=".34" />
            <stop offset=".65" stopColor="#9eb9df" stopOpacity=".1" />
            <stop offset="1" stopColor="#9eb9df" stopOpacity="0" />
          </radialGradient>

          <filter
            id="wave-blur"
            x="-20%"
            y="-50%"
            width="140%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* SOFT WAVE GLOW */}

        <path
          d="M-100 90C40 15 135 45 245 100C355 155 430 175 535 115C650 48 765 45 1000 125"
          stroke="url(#wave-pink-blue)"
          strokeWidth="20"
          strokeOpacity=".1"
          filter="url(#wave-blur)"
        />

        <path
          d="M-100 390C40 315 145 345 255 400C365 455 440 465 545 405C660 338 775 330 1000 415"
          stroke="url(#wave-blue-pink)"
          strokeWidth="20"
          strokeOpacity=".09"
          filter="url(#wave-blur)"
        />
        

        {/* MIDDLE FLOWING WAVES */}

        <path
          d="M-100 235C45 175 140 205 250 242C365 281 445 290 545 245C650 198 770 192 1000 240"
          stroke="url(#wave-pink-blue)"
          strokeWidth="1"
          strokeOpacity=".32"
          strokeLinecap="round"
        />

        <path
          d="M-100 260C45 200 140 230 250 267C365 306 445 315 545 270C650 223 770 217 1000 265"
          stroke="url(#wave-blue-pink)"
          strokeWidth=".8"
          strokeOpacity=".27"
          strokeLinecap="round"
        />

        <path
          d="M-100 285C45 225 140 255 250 292C365 331 445 340 545 295C650 248 770 242 1000 290"
          stroke="#b8b1c0"
          strokeWidth=".65"
          strokeOpacity=".22"
          strokeDasharray="3 10"
          strokeLinecap="round"
        />

        {/* BUBBLES — LEFT */}

        <circle
          cx="72"
          cy="92"
          r="34"
          fill="url(#pink-bubble)"
        />

        <circle
          cx="72"
          cy="92"
          r="16"
          stroke="#e4a5bb"
          strokeWidth=".9"
          strokeOpacity=".38"
        />

        <circle
          cx="72"
          cy="92"
          r="4"
          fill="#e4a5bb"
          fillOpacity=".32"
        />

        <circle
          cx="145"
          cy="205"
          r="22"
          fill="url(#blue-bubble)"
        />

        <circle
          cx="145"
          cy="205"
          r="10"
          stroke="#9eb9df"
          strokeWidth=".8"
          strokeOpacity=".34"
        />

        <circle
          cx="145"
          cy="205"
          r="2.5"
          fill="#9eb9df"
          fillOpacity=".36"
        />

        <circle
          cx="48"
          cy="330"
          r="12"
          fill="url(#pink-bubble)"
        />

        {/* BUBBLES — RIGHT */}

        <circle
          cx="830"
          cy="92"
          r="38"
          fill="url(#blue-bubble)"
        />

        <circle
          cx="830"
          cy="92"
          r="18"
          stroke="#9eb9df"
          strokeWidth=".9"
          strokeOpacity=".38"
        />

        <circle
          cx="830"
          cy="92"
          r="4"
          fill="#9eb9df"
          fillOpacity=".32"
        />

        <circle
          cx="755"
          cy="205"
          r="20"
          fill="url(#pink-bubble)"
        />

        <circle
          cx="755"
          cy="205"
          r="9"
          stroke="#e4a5bb"
          strokeWidth=".8"
          strokeOpacity=".34"
        />

        <circle
          cx="755"
          cy="205"
          r="2.5"
          fill="#e4a5bb"
          fillOpacity=".36"
        />

        <circle
          cx="855"
          cy="345"
          r="14"
          fill="url(#blue-bubble)"
        />

        {/* SMALL FLOATING BUBBLES */}

        <circle
          cx="210"
          cy="65"
          r="3"
          fill="#e4a5bb"
          fillOpacity=".55"
        />

        <circle
          cx="275"
          cy="180"
          r="2"
          fill="#9eb9df"
          fillOpacity=".55"
        />

        <circle
          cx="650"
          cy="70"
          r="3"
          fill="#9eb9df"
          fillOpacity=".55"
        />

        <circle
          cx="700"
          cy="185"
          r="2"
          fill="#e4a5bb"
          fillOpacity=".55"
        />

        <circle
          cx="110"
          cy="395"
          r="2.5"
          fill="#e4a5bb"
          fillOpacity=".48"
        />

        <circle
          cx="790"
          cy="405"
          r="2.5"
          fill="#9eb9df"
          fillOpacity=".48"
        />
      </svg>

      {/* SOFT TOP RIGHT WAVE */}

      <svg
        className="pointer-events-none absolute -right-16 -top-10 h-[230px] w-[430px] sm:-right-20 sm:-top-16 sm:h-[280px] sm:w-[520px]"
        viewBox="0 0 520 280"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="top-wave-gradient"
            x1="0"
            y1="0"
            x2="520"
            y2="280"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a8c1df" stopOpacity=".1" />
            <stop offset=".5" stopColor="#cfc2d3" stopOpacity=".4" />
            <stop offset="1" stopColor="#e8a7bd" stopOpacity=".5" />
          </linearGradient>
        </defs>

        <path
          d="M-30 105C80 30 155 100 250 78C345 55 390 112 475 85C505 76 525 65 550 50"
          stroke="url(#top-wave-gradient)"
          strokeWidth="1.1"
        />

        <path
          d="M-35 130C75 58 160 123 252 102C345 81 395 138 478 110C510 100 530 88 555 73"
          stroke="#bdb8c6"
          strokeWidth=".7"
          strokeOpacity=".28"
        />

        <path
          d="M-35 155C75 83 165 148 255 127C350 105 398 163 482 136C510 127 532 115 555 100"
          stroke="#e8a7bd"
          strokeWidth=".65"
          strokeOpacity=".26"
          strokeDasharray="3 8"
        />
      </svg>

      {/* CONTENT */}

      <div className="relative z-10">
        {/* HEADER */}

        <div className="flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-px w-5 bg-[#e4a5bb]" />

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">
                Your relationship
              </p>
            </div>

            <h2 className="text-[20px] font-medium tracking-[-0.055em] text-white sm:text-[22px]">
              Together, always.
            </h2>
          </div>

          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="size-1 rounded-full bg-pink-300" />
            <span className="size-1 rounded-full bg-blue-300" />
          </div>
        </div>

        {/* PEOPLE */}

        <div className="relative mt-9 flex items-start justify-center gap-2 sm:gap-8">
          {/* CONNECTING WAVE */}

          <svg
            className="pointer-events-none absolute left-1/2 top-[42px] hidden h-20 w-[360px] -translate-x-1/2 sm:block md:w-[430px]"
            viewBox="0 0 430 80"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="relationship-connection-wave"
                x1="20"
                y1="40"
                x2="410"
                y2="40"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9eb9df" stopOpacity=".35" />
                <stop offset=".5" stopColor="#d2c1d2" stopOpacity=".75" />
                <stop offset="1" stopColor="#e5a5bb" stopOpacity=".35" />
              </linearGradient>
            </defs>

            <path
              d="M10 40C65 12 110 15 145 40C180 65 205 65 215 40C225 15 250 15 285 40C320 65 365 68 420 40"
              stroke="url(#relationship-connection-wave)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            <path
              d="M10 47C65 20 108 22 143 47C177 70 205 72 215 47C225 22 253 22 287 47C322 72 365 75 420 47"
              stroke="#bdb7c5"
              strokeWidth=".55"
              strokeOpacity=".25"
              strokeDasharray="3 8"
              strokeLinecap="round"
            />
          </svg>

          <Person
            name={userName}
            role="You"
            avatarUrl={userAvatarUrl}
            fallbackClass="text-blue-300"
            ringClass="border-[#292c31]"
            accent="blue"
          />

          {/* CENTER CONNECTION */}

          <div className="relative z-20 flex shrink-0 flex-col items-center pt-8 sm:pt-11">
            <div className="relative flex size-[64px] items-center justify-center sm:size-[76px]">
              <div className="absolute inset-0 rounded-full border border-pink-300/30" />

              <div className="absolute inset-[5px] rounded-full border border-blue-300/25 border-dashed" />

              <div className="absolute inset-3 rounded-full border border-pink-200/15" />

              <div className="relative flex size-11 items-center justify-center rounded-full border border-white/[0.1] bg-[#1c1e22]/90 shadow-[0_12px_35px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md sm:size-14">
                <RelationshipHeart />
              </div>

              <span className="absolute right-[5px] top-[9px] size-1.5 rounded-full bg-pink-300" />

              <span className="absolute bottom-[8px] left-[3px] size-1 rounded-full bg-blue-300" />
            </div>
          </div>

          <Person
            name={partnerName}
            role="Partner"
            avatarUrl={partnerAvatarUrl}
            fallbackClass="text-pink-300"
            ringClass="border-[#292c31]"
            accent="pink"
          />
        </div>

        {/* LOWER INFO */}

        {daysTogether && (
          <div className="mt-5 flex justify-center">
            <div className="relative overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 shadow-[0_8px_25px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md">
              <div className="relative flex items-center gap-2.5">
                <span className="relative flex size-5 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-pink-200/25" />

                  <svg
                    viewBox="0 0 24 24"
                    className="relative size-2.5"
                    fill="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="mini-heart-gradient"
                        x1="5"
                        y1="5"
                        x2="19"
                        y2="19"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#e9a8bd" />
                        <stop offset="1" stopColor="#9eb9df" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M12 19S4.5 14.5 4.5 9.3C4.5 6.7 6.2 5 8.5 5C10.1 5 11.3 5.9 12 7.1C12.7 5.9 13.9 5 15.5 5C17.8 5 19.5 6.7 19.5 9.3C19.5 14.5 12 19 12 19Z"
                      fill="url(#mini-heart-gradient)"
                    />
                  </svg>
                </span>

                <p className="text-[10px] text-white/45">
                  Together for
                  <span className="ml-1 font-semibold text-white/75">
                    {daysTogether} days
                  </span>
                </p>
              </div>
            </div>
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
  fallbackClass,
  ringClass,
  accent,
}: {
  name: string
  role: string
  avatarUrl?: string | null
  fallbackClass: string
  ringClass: string
  accent: 'blue' | 'pink'
}) {
  const isBlue = accent === 'blue'

  return (
    <div className="relative z-10 min-w-0 text-center">
      <div
        className={`relative mx-auto flex size-[82px] items-center justify-center rounded-full border-[3px] bg-[#191b1f] p-1 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:size-[104px] sm:border-4 sm:p-1.5 ${ringClass}`}
      >
        <div
          className={`absolute inset-1.5 rounded-full border border-dashed ${
            isBlue ? 'border-blue-300/35' : 'border-pink-300/35'
          }`}
        />

        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="relative h-full w-full rounded-full object-cover"
          />
        ) : (
          <div
            className={`relative flex h-full w-full items-center justify-center rounded-full ${
              isBlue ? 'bg-[#171d27]' : 'bg-[#241a20]'
            }`}
          >
            <span
              className={`text-2xl font-medium tracking-[-0.05em] sm:text-3xl ${fallbackClass}`}
            >
              {name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}

        <span
          className={`absolute right-0.5 top-2 size-2 rounded-full border-2 border-[#191b1f] ${
            isBlue ? 'bg-blue-300' : 'bg-pink-300'
          }`}
        />
      </div>

      <p className="mx-auto mt-3 max-w-[95px] truncate text-[12px] font-semibold tracking-[-0.015em] text-white/90 sm:max-w-[125px] sm:text-[13px]">
        {name}
      </p>

      <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-white/35">
        {role}
      </p>
    </div>
  )
}

/* ============================================================= */
/* RELATIONSHIP HEART SVG */
/* ============================================================= */

function RelationshipHeart() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="size-7 sm:size-8"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="relationship-heart-gradient"
          x1="8"
          y1="9"
          x2="40"
          y2="39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e9a8bd" />
          <stop offset=".45" stopColor="#efbfd0" />
          <stop offset=".58" stopColor="#c9bdd1" />
          <stop offset="1" stopColor="#9eb9df" />
        </linearGradient>

        <filter
          id="relationship-heart-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
      </defs>

      <path
        d="M24 37C21.5 34.9 10 27.5 10 18.5C10 13.8 13.2 10.5 17.5 10.5C20.3 10.5 22.6 12 24 14.3C25.4 12 27.7 10.5 30.5 10.5C34.8 10.5 38 13.8 38 18.5C38 27.5 26.5 34.9 24 37Z"
        fill="#efbfd0"
        fillOpacity=".22"
        filter="url(#relationship-heart-glow)"
      />

      <path
        d="M24 37C21.5 34.9 10 27.5 10 18.5C10 13.8 13.2 10.5 17.5 10.5C20.3 10.5 22.6 12 24 14.3C25.4 12 27.7 10.5 30.5 10.5C34.8 10.5 38 13.8 38 18.5C38 27.5 26.5 34.9 24 37Z"
        fill="url(#relationship-heart-gradient)"
        fillOpacity=".95"
      />

      <path
        d="M15 17C15.5 14.5 17.2 13.5 19 13.8"
        stroke="white"
        strokeOpacity=".75"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      <circle
        cx="24"
        cy="20"
        r="1.2"
        fill="white"
        fillOpacity=".6"
      />
    </svg>
  )
}