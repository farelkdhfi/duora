import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Heart,
  Plane,
  Sparkles,
} from 'lucide-react'

import Image from 'next/image'
import duoraLogo from '@/assets/duora-logo3.png'

export default function LandingPage() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#faf9f7] text-[#171717]">
      {/* ATMOSPHERE */}
      <div className="pointer-events-none absolute -left-[18vw] -top-[22vw] h-[48vw] w-[48vw] rounded-full bg-pink-200/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[24vw] -right-[18vw] h-[48vw] w-[48vw] rounded-full bg-pink-100/30 blur-[120px]" />

      {/* SUBTLE SVG GRAIN / ORNAMENT */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="grain"
            width="90"
            height="90"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="12" r="0.7" fill="currentColor" />
            <circle cx="52" cy="38" r="0.6" fill="currentColor" />
            <circle cx="82" cy="71" r="0.7" fill="currentColor" />
            <circle cx="30" cy="78" r="0.5" fill="currentColor" />
          </pattern>
        </defs>

        <rect width="1200" height="800" fill="url(#grain)" />
      </svg>

      <section className="relative mx-auto flex min-h-dvh w-full max-w-[1500px] flex-col px-4 py-4 sm:px-8 sm:py-7 lg:min-h-dvh lg:px-12 lg:py-8 xl:px-16">
        {/* HEADER — DESKTOP ONLY */}
        <header className="hidden shrink-0 items-center justify-between sm:flex">
          <Link href="/" className="group flex items-center gap-1">
            <Image
              src={duoraLogo}
              alt="Duora"
              width={30}
              height={30}
              priority
              className="size-7 object-contain"
            />

            <span className="text-sm font-bold uppercase">duora</span>
          </Link>

          <div className="flex items-center gap-5">
            <span className="hidden text-[8px] uppercase tracking-[0.22em] text-neutral-400 sm:block">
              Private for two
            </span>

            <Link
              href="/login"
              className="group flex items-center gap-1.5 text-[10px] font-medium text-neutral-500 transition hover:text-black"
            >
              Sign in

              <ArrowUpRight
                size={11}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row lg:items-center">
          <div className="grid min-h-0 w-full flex-1 grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-6 xl:gap-14">
            {/* RIGHT — SVG ART */}
            <div className="relative order-first flex min-h-0 flex-[0.95] items-center justify-center pb-0 pt-0 sm:flex-1 sm:pb-5 sm:pt-3 lg:order-last lg:h-[min(72vh,700px)] lg:flex-none lg:py-0">
              <svg
                viewBox="0 0 700 700"
                className="h-[min(39vh,250px)] w-[min(76vw,250px)] max-w-full sm:h-[min(56vh,440px)] sm:w-[min(76vw,440px)] lg:h-[clamp(560px,68vh,820px)] lg:w-[clamp(560px,68vh,820px)]"
                fill="none"
                aria-label="Romantic abstract illustration"
              >
                <defs>
                  <linearGradient
                    id="pinkLine"
                    x1="120"
                    y1="180"
                    x2="580"
                    y2="520"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#f3a6bd" />
                    <stop offset="0.5" stopColor="#eab7c7" />
                    <stop offset="1" stopColor="#f5d9e2" />
                  </linearGradient>

                  <radialGradient
                    id="softPink"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(350 350) rotate(90) scale(280)"
                  >
                    <stop stopColor="#f9dce5" stopOpacity=".72" />
                    <stop
                      offset="1"
                      stopColor="#f9dce5"
                      stopOpacity="0"
                    />
                  </radialGradient>

                  <filter
                    id="blur"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="28" />
                  </filter>
                </defs>

                <circle
                  cx="350"
                  cy="350"
                  r="250"
                  fill="url(#softPink)"
                />

                <ellipse
                  cx="350"
                  cy="350"
                  rx="250"
                  ry="185"
                  transform="rotate(-28 350 350)"
                  stroke="#171717"
                  strokeOpacity=".07"
                  strokeWidth="1"
                />

                <ellipse
                  cx="350"
                  cy="350"
                  rx="205"
                  ry="145"
                  transform="rotate(28 350 350)"
                  stroke="#171717"
                  strokeOpacity=".06"
                  strokeWidth="1"
                  strokeDasharray="3 8"
                />

                <path
                  d="M145 470C218 350 247 242 350 242C453 242 482 350 555 230"
                  stroke="url(#pinkLine)"
                  strokeWidth="1.5"
                  strokeDasharray="5 8"
                  strokeLinecap="round"
                />

                <g transform="translate(125 450)">
                  <circle
                    r="34"
                    fill="#fff"
                    fillOpacity=".7"
                    stroke="#171717"
                    strokeOpacity=".08"
                  />

                  <circle
                    r="25"
                    fill="#f8dce5"
                    fillOpacity=".55"
                  />

                  <path
                    d="M0 9S-12 1-12-6C-12-11-8-14-4-14C-1-14 1-12 0-9C1-12 3-14 6-14C10-14 12-11 12-6C12 1 0 9 0 9Z"
                    fill="#e9a8bd"
                  />
                </g>

                <g transform="translate(555 210)">
                  <circle
                    r="34"
                    fill="#fff"
                    fillOpacity=".7"
                    stroke="#171717"
                    strokeOpacity=".08"
                  />

                  <circle
                    r="25"
                    fill="#f8dce5"
                    fillOpacity=".55"
                  />

                  <path
                    d="M0 9S-12 1-12-6C-12-11-8-14-4-14C-1-14 1-12 0-9C1-12 3-14 6-14C10-14 12-11 12-6C12 1 0 9 0 9Z"
                    fill="#e9a8bd"
                  />
                </g>

                <g transform="translate(350 350)">
                  <circle
                    r="54"
                    fill="#fff"
                    fillOpacity=".58"
                    stroke="#171717"
                    strokeOpacity=".06"
                  />

                  <circle
                    r="40"
                    fill="#f7d9e3"
                    fillOpacity=".35"
                    filter="url(#blur)"
                  />

                  <path
                    d="M0 18S-25 3-25-12C-25-22-18-29-9-29C-3-29 0-25 0-20C0-25 3-29 9-29C18-29 25-22 25-12C25 3 0 18 0 18Z"
                    fill="#e6a1b8"
                    fillOpacity=".9"
                  />
                </g>

                <circle
                  cx="350"
                  cy="145"
                  r="3"
                  fill="#e7a5ba"
                />

                <circle
                  cx="505"
                  cy="475"
                  r="3"
                  fill="#e7a5ba"
                />

                <circle
                  cx="195"
                  cy="270"
                  r="2.5"
                  fill="#e7a5ba"
                />

                <g stroke="#d994ad" strokeLinecap="round">
                  <path d="M472 115V133" />
                  <path d="M463 124H481" />

                  <path d="M205 560V574" />
                  <path d="M198 567H212" />

                  <path d="M585 400V414" />
                  <path d="M578 407H592" />
                </g>

                <path
                  d="M85 245C112 207 147 197 172 212C144 219 120 234 85 245Z"
                  fill="#efbfd0"
                  fillOpacity=".45"
                />

                <path
                  d="M570 535C596 499 627 488 650 499C625 509 603 523 570 535Z"
                  fill="#efbfd0"
                  fillOpacity=".4"
                />

                <path
                  d="M150 125C165 104 185 94 201 101C184 109 170 118 150 125Z"
                  fill="#f1cad7"
                  fillOpacity=".5"
                />
              </svg>

              {/* DISTANCE LABEL — HIDDEN MOBILE */}
              <div className="absolute bottom-[1%] left-[5%] hidden sm:block sm:bottom-[5%] sm:left-[10%] lg:bottom-[10%] lg:left-[7%]">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-pink-300" />

                  <span className="text-[7px] uppercase tracking-[0.2em] text-neutral-400">
                    Somewhere between
                  </span>
                </div>

                <p className="mt-1 text-[clamp(1.15rem,3vw,2.2rem)] font-medium tracking-[-0.07em] text-neutral-800 sm:mt-2">
                  1,247 km
                </p>

                <div className="mt-1 flex items-center gap-2 text-[8px] text-neutral-400">
                  <span>Jakarta</span>
                  <span className="h-px w-5 bg-neutral-300" />
                  <span>Bandung</span>
                </div>
              </div>

              {/* FLOATING DATE */}
              <div className="absolute right-[3%] top-[4%] hidden sm:block lg:right-[4%] lg:top-[10%]">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={11}
                    strokeWidth={1.5}
                    className="text-pink-300"
                  />

                  <span className="text-[7px] uppercase tracking-[0.18em] text-neutral-400">
                    Next chapter
                  </span>
                </div>

                <p className="mt-2 text-sm font-medium tracking-[-0.04em]">
                  September 1
                </p>

                <p className="mt-0.5 text-[8px] text-neutral-400">
                  18 days until together
                </p>
              </div>

              <Sparkles
                size={13}
                strokeWidth={1.3}
                className="absolute right-[10%] bottom-[15%] text-pink-300/70 sm:right-[14%] sm:bottom-[22%]"
              />
            </div>

            {/* LEFT — TEXT */}
            <div className="relative z-10 order-last mt-0 flex min-w-0 flex-col justify-end pb-0 lg:order-first lg:mt-0 lg:justify-center lg:pb-0">
              {/* MOBILE BRAND */}
              <Link
                href="/"
                className="mb-2 flex w-fit items-center gap-1 sm:hidden"
              >
                <Image
                  src={duoraLogo}
                  alt="Duora"
                  width={30}
                  height={30}
                  priority
                  className="size-7 object-contain"
                />

                <span className="text-sm font-bold uppercase">duora</span>
              </Link>

              {/* EYEBROW — DESKTOP ONLY */}
              <div className="mb-3 hidden items-center gap-3 sm:flex sm:mb-7">
                <span className="h-px w-7 bg-pink-300 sm:w-10" />

                <span className="text-[7px] font-medium uppercase tracking-[0.2em] text-neutral-400 sm:text-[9px] sm:tracking-[0.24em]">
                  For couples living apart
                </span>
              </div>

              {/* TITLE */}
              <h1 className="max-w-[760px] text-[clamp(2.9rem,12vw,8rem)] font-medium leading-[0.84] tracking-[-0.085em] sm:text-[clamp(3.7rem,8.2vw,8rem)]">
                Love
                <br />
                lives{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 bg-clip-text text-transparent">
                    here.
                  </span>

                  <svg
                    className="absolute -bottom-1 left-0 h-2.5 w-full sm:-bottom-3 sm:h-4"
                    viewBox="0 0 240 16"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 10.5C49 3 94 14 139 7.5C174 2.5 205 3.5 238 6"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      className="text-pink-300/70"
                    />
                  </svg>
                </span>
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-2 max-w-[390px] text-[10px] leading-4 text-neutral-500 sm:mt-8 sm:text-xs sm:leading-6 lg:mt-9 lg:text-sm">
                A quiet place for two people to stay close, even when distance
                puts them in different places.
              </p>

              {/* CTA */}
              <div className="mt-3 flex w-full flex-col items-stretch gap-2 sm:mt-8 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/register"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#171717] px-4 py-3 text-[9px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 sm:w-auto sm:justify-center sm:gap-3 sm:px-6 sm:py-3.5 sm:text-[11px]"
                >
                  Start your LDR

                  <span className="flex size-4.5 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5 sm:size-5">
                    <ArrowRight size={10} />
                  </span>
                </Link>

                <span className="text-center text-[8px] text-neutral-400 sm:text-left sm:text-[9px]">
                  Free to start
                </span>
              </div>

              {/* SMALL VALUES — HIDDEN MOBILE */}
              <div className="mt-5 hidden max-w-[560px] items-center gap-3 overflow-hidden sm:mt-12 sm:flex sm:gap-8">
                <MiniFeature
                  icon={<Plane size={12} strokeWidth={1.5} />}
                  label="Distance"
                  text="Give it an end date."
                />

                <span className="h-7 w-px shrink-0 bg-black/[0.07] sm:h-8" />

                <MiniFeature
                  icon={<Heart size={12} strokeWidth={1.5} />}
                  label="Connection"
                  text="Know their day."
                />

                <span className="hidden h-8 w-px shrink-0 bg-black/[0.07] sm:block" />

                <MiniFeature
                  icon={<CalendarDays size={12} strokeWidth={1.5} />}
                  label="Moments"
                  text="Have something ahead."
                  className="hidden sm:flex"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function MiniFeature({
  icon,
  label,
  text,
  className = '',
}: {
  icon: React.ReactNode
  label: string
  text: string
  className?: string
}) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <span className="flex size-6 shrink-0 items-center justify-center text-pink-300">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[7px] font-medium uppercase tracking-[0.15em] text-neutral-400">
          {label}
        </p>

        <p className="mt-0.5 whitespace-nowrap text-[8px] text-neutral-500">
          {text}
        </p>
      </div>
    </div>
  )
}