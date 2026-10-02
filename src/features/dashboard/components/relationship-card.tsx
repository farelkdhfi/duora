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
    <section className="relative overflow-hidden rounded-b-[2rem] border border-black/5 bg-neutral-800 px-5 py-7 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.18)] sm:rounded-2xl sm:px-8 sm:py-9">
      {/* SVG LINE ART BACKGROUND */}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 900 500"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="relationship-dots"
            width="42"
            height="42"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="5" cy="7" r="1" fill="#171717" fillOpacity=".07" />
            <circle cx="25" cy="18" r=".8" fill="#9eb9df" fillOpacity=".2" />
            <circle cx="38" cy="34" r=".9" fill="#e7a5ba" fillOpacity=".18" />
          </pattern>

          <linearGradient
            id="line-pink-blue"
            x1="0"
            y1="0"
            x2="900"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e7a5ba" stopOpacity=".7" />
            <stop offset=".5" stopColor="#b9b7c9" stopOpacity=".5" />
            <stop offset="1" stopColor="#9eb9df" stopOpacity=".7" />
          </linearGradient>

          <linearGradient
            id="line-blue-pink"
            x1="900"
            y1="0"
            x2="0"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9eb9df" stopOpacity=".7" />
            <stop offset=".5" stopColor="#b9b7c9" stopOpacity=".45" />
            <stop offset="1" stopColor="#e7a5ba" stopOpacity=".7" />
          </linearGradient>
        </defs>

        {/* DOT FIELD */}

        <rect width="900" height="500" fill="url(#relationship-dots)" />

        {/* LEFT FLOWING LINES */}

        <path
          d="M-80 90C80 10 145 130 270 72C365 28 405 55 470 20"
          stroke="url(#line-pink-blue)"
          strokeWidth="1.2"
          strokeOpacity=".55"
        />

        <path
          d="M-70 125C65 52 150 160 265 105C350 64 410 83 500 42"
          stroke="#e7a5ba"
          strokeWidth=".8"
          strokeOpacity=".42"
          strokeDasharray="5 8"
        />

        <path
          d="M-40 165C65 112 130 190 230 150C325 112 380 126 455 90"
          stroke="#171717"
          strokeWidth=".65"
          strokeOpacity=".16"
        />

        {/* RIGHT FLOWING LINES */}

        <path
          d="M940 55C815 5 755 90 650 55C560 25 520 65 450 42"
          stroke="url(#line-blue-pink)"
          strokeWidth="1.2"
          strokeOpacity=".55"
        />

        <path
          d="M940 92C820 45 755 125 660 92C570 61 520 100 450 78"
          stroke="#9eb9df"
          strokeWidth=".8"
          strokeOpacity=".45"
          strokeDasharray="5 8"
        />

        <path
          d="M930 132C825 92 760 165 665 130C580 100 525 135 470 118"
          stroke="#171717"
          strokeWidth=".65"
          strokeOpacity=".15"
        />

        {/* TOP CENTRAL CURVES */}

        <path
          d="M170 -30C225 45 315 65 385 25C450 -12 520 10 585 68C650 126 730 105 790 35"
          stroke="url(#line-pink-blue)"
          strokeWidth="1"
          strokeOpacity=".38"
        />

        <path
          d="M120 -20C190 62 280 82 365 40C450 -4 535 25 600 82C665 138 755 115 820 35"
          stroke="#171717"
          strokeWidth=".65"
          strokeOpacity=".12"
          strokeDasharray="4 9"
        />

        {/* LARGE LEFT ORBIT */}

        <ellipse
          cx="120"
          cy="330"
          rx="155"
          ry="92"
          transform="rotate(-24 120 330)"
          stroke="#e7a5ba"
          strokeWidth="1"
          strokeOpacity=".42"
        />

        <ellipse
          cx="120"
          cy="330"
          rx="120"
          ry="70"
          transform="rotate(24 120 330)"
          stroke="#171717"
          strokeWidth=".7"
          strokeOpacity=".13"
          strokeDasharray="3 8"
        />

        {/* LARGE RIGHT ORBIT */}

        <ellipse
          cx="790"
          cy="330"
          rx="160"
          ry="94"
          transform="rotate(24 790 330)"
          stroke="#9eb9df"
          strokeWidth="1"
          strokeOpacity=".44"
        />

        <ellipse
          cx="790"
          cy="330"
          rx="122"
          ry="70"
          transform="rotate(-24 790 330)"
          stroke="#171717"
          strokeWidth=".7"
          strokeOpacity=".13"
          strokeDasharray="3 8"
        />

        {/* BOTTOM FLOW */}

        <path
          d="M-30 455C90 390 170 480 285 438C390 400 450 430 540 468C645 510 745 425 930 450"
          stroke="url(#line-pink-blue)"
          strokeWidth="1.1"
          strokeOpacity=".5"
        />

        <path
          d="M-30 485C90 420 180 505 295 462C395 426 455 455 545 492C660 535 755 452 930 475"
          stroke="#171717"
          strokeWidth=".65"
          strokeOpacity=".12"
          strokeDasharray="4 9"
        />

        {/* SMALL GEOMETRIC DETAILS */}

        <circle
          cx="78"
          cy="78"
          r="4"
          stroke="#e7a5ba"
          strokeWidth="1"
          strokeOpacity=".55"
        />

        <circle
          cx="78"
          cy="78"
          r="1.5"
          fill="#e7a5ba"
          fillOpacity=".75"
        />

        <circle
          cx="822"
          cy="78"
          r="4"
          stroke="#9eb9df"
          strokeWidth="1"
          strokeOpacity=".55"
        />

        <circle
          cx="822"
          cy="78"
          r="1.5"
          fill="#9eb9df"
          fillOpacity=".75"
        />

        <circle
          cx="70"
          cy="420"
          r="2.5"
          fill="#e7a5ba"
          fillOpacity=".65"
        />

        <circle
          cx="835"
          cy="415"
          r="2.5"
          fill="#9eb9df"
          fillOpacity=".65"
        />

        <path
          d="M55 245L65 235L75 245L65 255Z"
          stroke="#e7a5ba"
          strokeWidth=".8"
          strokeOpacity=".5"
        />

        <path
          d="M825 245L835 235L845 245L835 255Z"
          stroke="#9eb9df"
          strokeWidth=".8"
          strokeOpacity=".5"
        />

        {/* SIDE VERTICAL DETAILS */}

        <path
          d="M35 210C55 230 55 270 35 290"
          stroke="#e7a5ba"
          strokeWidth=".8"
          strokeOpacity=".38"
        />

        <path
          d="M865 210C845 230 845 270 865 290"
          stroke="#9eb9df"
          strokeWidth=".8"
          strokeOpacity=".38"
        />

        <circle cx="42" cy="250" r="1.5" fill="#e7a5ba" fillOpacity=".7" />
        <circle cx="858" cy="250" r="1.5" fill="#9eb9df" fillOpacity=".7" />
      </svg>

      {/* DECORATIVE TOP RIGHT ORBIT */}

      <svg
        className="pointer-events-none absolute -right-16 -top-20 size-[300px] sm:-right-20 sm:-top-24 sm:size-[360px]"
        viewBox="0 0 360 360"
        fill="none"
        aria-hidden="true"
      >
        <ellipse
          cx="180"
          cy="180"
          rx="135"
          ry="82"
          transform="rotate(-28 180 180)"
          stroke="#171717"
          strokeOpacity=".09"
        />

        <ellipse
          cx="180"
          cy="180"
          rx="105"
          ry="64"
          transform="rotate(28 180 180)"
          stroke="#9eb9df"
          strokeOpacity=".25"
          strokeDasharray="2 9"
        />

        <ellipse
          cx="180"
          cy="180"
          rx="78"
          ry="46"
          transform="rotate(-18 180 180)"
          stroke="#e7a5ba"
          strokeOpacity=".22"
          strokeDasharray="3 7"
        />

        <circle
          cx="282"
          cy="90"
          r="3"
          fill="#9eb9df"
          fillOpacity=".7"
        />

        <circle
          cx="88"
          cy="245"
          r="2.5"
          fill="#e7a5ba"
          fillOpacity=".65"
        />

        <circle
          cx="244"
          cy="72"
          r="1.5"
          fill="#171717"
          fillOpacity=".35"
        />
      </svg>

      {/* CONTENT */}

      <div className="relative z-10">
        {/* HEADER */}

        <div className="flex items-end justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-px w-5 bg-[#e7a5ba]" />

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">
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
          {/* DECORATIVE CONNECTING PATH */}

          <svg
            className="pointer-events-none absolute left-1/2 top-[42px] hidden h-20 w-[360px] -translate-x-1/2 sm:block md:w-[430px]"
            viewBox="0 0 430 80"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20 40C95 8 130 72 215 40C300 8 335 72 410 40"
              stroke="url(#relationship-path)"
              strokeWidth="1"
              strokeDasharray="3 8"
              strokeLinecap="round"
            />

            <defs>
              <linearGradient
                id="relationship-path"
                x1="20"
                y1="40"
                x2="410"
                y2="40"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#e9a8bd" stopOpacity=".4" />
                <stop offset=".5" stopColor="#c9bdd1" stopOpacity=".7" />
                <stop offset="1" stopColor="#9eb9df" stopOpacity=".4" />
              </linearGradient>
            </defs>
          </svg>

          <Person
            name={userName}
            role="You"
            avatarUrl={userAvatarUrl}
            fallbackClass="text-blue-500"
            ringClass="border-black"
            accent="blue"
          />

          {/* CENTER CONNECTION */}

          <div className="relative z-20 flex shrink-0 flex-col items-center pt-8 sm:pt-11">
            <div className="relative flex size-[64px] items-center justify-center sm:size-[76px]">
              <div className="absolute inset-0 rounded-full border border-pink-200/70" />

              <div className="absolute inset-[5px] rounded-full border border-blue-200/60 border-dashed" />

              <div className="absolute inset-3 rounded-full border border-pink-100/60" />

              <div className="relative flex size-11 items-center justify-center rounded-full border border-white/80 bg-neutral-800 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md sm:size-14">
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
            fallbackClass="text-pink-500"
            ringClass="border-black"
            accent="pink"
          />
        </div>

        {/* LOWER INFO */}

        {daysTogether && (
          <div className="mt-5 flex justify-center">
            <div className="relative overflow-hidden rounded-full border border-black/[0.045] bg-black px-4 py-2.5 shadow-[0_8px_25px_-18px_rgba(0,0,0,0.2)] backdrop-blur-md">
              <div className="relative flex items-center gap-2.5">
                <span className="relative flex size-5 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-pink-200/60" />

                  <svg
                    viewBox="0 0 24 24"
                    className="relative size-2.5"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 19S4.5 14.5 4.5 9.3C4.5 6.7 6.2 5 8.5 5C10.1 5 11.3 5.9 12 7.1C12.7 5.9 13.9 5 15.5 5C17.8 5 19.5 6.7 19.5 9.3C19.5 14.5 12 19 12 19Z"
                      fill="url(#mini-heart-gradient)"
                    />

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
                  </svg>
                </span>

                <p className="text-[10px] text-neutral-400">
                  Together for
                  <span className="ml-1 font-semibold text-neutral-100">
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
        className={`relative mx-auto flex size-[82px] items-center justify-center rounded-full border-[3px] bg-neutral-800 p-1 shadow-[0_15px_35px_-20px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:size-[104px] sm:border-4 sm:p-1.5 ${ringClass}`}
      >
        <div
          className={`absolute inset-1.5 rounded-full border border-dashed ${
            isBlue ? 'border-blue-200/60' : 'border-pink-200/60'
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
              isBlue
                ? 'bg-[#f5f8fc]'
                : 'bg-[#fdf5f8]'
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
          className={`absolute right-0.5 top-2 size-2 rounded-full border-2 border-white ${
            isBlue ? 'bg-blue-300' : 'bg-pink-300'
          }`}
        />
      </div>

      <p className="mx-auto mt-3 max-w-[95px] truncate text-[12px] font-semibold tracking-[-0.015em] text-white sm:max-w-[125px] sm:text-[13px]">
        {name}
      </p>

      <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-500">
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
        fillOpacity=".25"
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
        strokeOpacity=".7"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      <circle
        cx="24"
        cy="20"
        r="1.2"
        fill="white"
        fillOpacity=".55"
      />
    </svg>
  )
}