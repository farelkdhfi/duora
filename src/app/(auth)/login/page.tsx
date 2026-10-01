import Link from 'next/link'
import Image from 'next/image'

import LoginForm from '@/features/auth/components/login-form'
import duoraLogo from '@/assets/logo.png'

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f7] text-[#171717]">

      {/* BACKGROUND ATMOSPHERE */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -right-[220px] bottom-[0%] size-[460px] rounded-full bg-blue-200/15 blur-[150px] lg:-right-[280px] lg:size-[560px] lg:bg-blue-200/25" />


        <div className="absolute right-[25%] top-[45%] size-[220px] rounded-full bg-blue-100/15 blur-[120px] lg:size-[300px] lg:bg-blue-100/20" />
      </div>

      {/* DESKTOP SVG — DOMINANT ON RIGHT */}
      <svg
        className="pointer-events-none fixed inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="desktopAccent"
            x1="760"
            y1="180"
            x2="1320"
            y2="720"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f3a6bd" />
            <stop offset=".5" stopColor="#d9c3d2" />
            <stop offset="1" stopColor="#9eb9df" />
          </linearGradient>

          <linearGradient
            id="desktopHeart"
            x1="-35"
            y1="0"
            x2="35"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e9a8bd" />
            <stop offset=".5" stopColor="#eac0d0" />
            <stop offset="1" stopColor="#9eb9df" />
          </linearGradient>

          <filter
            id="desktopBlur"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="25" />
          </filter>
        </defs>

        {/* RIGHT SIDE ATMOSPHERE */}
        <circle
          cx="1080"
          cy="450"
          r="300"
          fill="#f8dce5"
          fillOpacity=".18"
          filter="url(#desktopBlur)"
        />

        <circle
          cx="1190"
          cy="390"
          r="250"
          fill="#dce8f7"
          fillOpacity=".16"
          filter="url(#desktopBlur)"
        />

        {/* MAIN ORBIT */}
        <ellipse
          cx="1080"
          cy="450"
          rx="355"
          ry="235"
          transform="rotate(-25 1080 450)"
          fill="none"
          stroke="#171717"
          strokeOpacity=".055"
          strokeWidth="1"
        />

        <ellipse
          cx="1080"
          cy="450"
          rx="300"
          ry="190"
          transform="rotate(28 1080 450)"
          fill="none"
          stroke="#171717"
          strokeOpacity=".04"
          strokeWidth="1"
          strokeDasharray="3 11"
        />

        {/* ACCENT ORBIT */}
        <ellipse
          cx="1080"
          cy="450"
          rx="400"
          ry="125"
          transform="rotate(-38 1080 450)"
          fill="none"
          stroke="url(#desktopAccent)"
          strokeOpacity=".16"
          strokeWidth="1"
        />

        {/* MAIN FLOW */}
        <path
          d="M705 640C830 500 875 270 1070 275C1225 280 1245 500 1410 220"
          fill="none"
          stroke="url(#desktopAccent)"
          strokeWidth="1.3"
          strokeDasharray="5 10"
          strokeLinecap="round"
          opacity=".7"
        />

        {/* CENTER HEART */}
        <g transform="translate(1080 450)">
          <circle
            r="62"
            fill="#fff"
            fillOpacity=".38"
            stroke="#171717"
            strokeOpacity=".045"
          />

          <path
            d="M0 22S-30 5-30-13C-30-25-22-34-11-34C-4-34 0-29 0-23C0-29 4-34 11-34C22-34 30-25 30-13C30 5 0 22 0 22Z"
            fill="url(#desktopHeart)"
          />
        </g>

        {/* NODES */}
        <g transform="translate(765 635)">
          <circle
            r="25"
            fill="#fff"
            fillOpacity=".65"
            stroke="#e9a8bd"
            strokeOpacity=".25"
          />

          <path
            d="M0 7S-10 1-10-5C-10-10-7-12-3-12C0-12 1-10 0-7C1-10 3-12 6-12C9-12 11-10 11-5C11 1 0 7 0 7Z"
            fill="#e9a8bd"
          />
        </g>

        <g transform="translate(1400 220)">
          <circle
            r="25"
            fill="#fff"
            fillOpacity=".65"
            stroke="#9eb9df"
            strokeOpacity=".3"
          />

          <path
            d="M0 7S-10 1-10-5C-10-10-7-12-3-12C0-12 1-10 0-7C1-10 3-12 6-12C9-12 11-10 11-5C11 1 0 7 0 7Z"
            fill="#9eb9df"
          />
        </g>

        {/* SMALL DETAILS */}
        <circle
          cx="820"
          cy="190"
          r="2"
          fill="#e9a8bd"
          fillOpacity=".65"
        />

        <circle
          cx="1330"
          cy="570"
          r="2"
          fill="#9eb9df"
          fillOpacity=".7"
        />

        <circle
          cx="895"
          cy="710"
          r="1.5"
          fill="#e9a8bd"
          fillOpacity=".55"
        />

        <circle
          cx="1370"
          cy="390"
          r="1.5"
          fill="#9eb9df"
          fillOpacity=".65"
        />

        {/* PLUS */}
        <g
          strokeLinecap="round"
          strokeWidth="1"
        >
          <g stroke="#e3a6b9" strokeOpacity=".55">
            <path d="M855 180V194" />
            <path d="M848 187H862" />
          </g>

          <g stroke="#9eb9df" strokeOpacity=".6">
            <path d="M1325 545V559" />
            <path d="M1318 552H1332" />
          </g>
        </g>

        {/* SIMPLE LEAVES */}
        <path
          d="M730 250C755 215 785 208 808 219C782 225 758 238 730 250Z"
          fill="#efbfd0"
          fillOpacity=".35"
        />

        <path
          d="M1300 680C1325 650 1355 645 1375 656C1351 663 1327 672 1300 680Z"
          fill="#b9cce8"
          fillOpacity=".4"
        />
      </svg>

      {/* CONTENT */}
      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 lg:px-10">

        <div className="grid w-full gap-16 lg:grid-cols-[1fr_0.72fr] lg:items-center">

          {/* LEFT */}
          <div className="hidden lg:block">

            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <Image
                src={duoraLogo}
                alt="Duora"
                width={30}
                height={30}
                className="rounded-full"
              />

              <span className="text-base font-bold uppercase tracking-[-0.05em]">
                duora
              </span>
            </Link>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-pink-300 to-blue-300" />

              <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-neutral-400">
                one for two
              </span>
            </div>

            <h1 className="mt-7 max-w-3xl text-[clamp(4rem,6vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
              Keep the
              <br />
              <span className="bg-gradient-to-t from-pink-400 via-[#c9bdd1] to-blue-400 bg-clip-text text-transparent">
                dist
              </span>
              <span className="bg-gradient-to-b from-pink-400 via-[#c9bdd1] to-blue-400 bg-clip-text text-transparent">
                ance
              </span>
              <span className="bg-gradient-to-t ml-3 from-pink-400 via-[#c9bdd1] to-blue-400 bg-clip-text text-transparent">
                close.
              </span>
            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-[#8f8588]">
              A private space for two people to stay connected,
              share little moments, and make distance feel closer.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-pink-300" />
              <span className="h-px w-10 bg-gradient-to-r from-pink-200 to-blue-200" />
              <span className="size-1.5 rounded-full bg-blue-300" />
            </div>

          </div>

          {/* LOGIN */}
          <div className="w-full max-w-[430px] justify-self-center lg:justify-self-end">

            <div className="mb-8">

              <div className="flex items-center justify-center gap-2 lg:hidden">
                <Image
                  src={duoraLogo}
                  alt="Duora"
                  width={70}
                  height={70}
                  className="rounded-full"
                />
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 lg:hidden">
                <span className="h-px w-6 bg-gradient-to-r from-transparent to-pink-300" />

                <span className="text-[8px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                  one for two
                </span>

                <span className="h-px w-6 bg-gradient-to-l from-transparent to-blue-300" />
              </div>

              <h2 className="mt-4 text-center text-3xl font-semibold leading-[0.95] tracking-[-0.065em] md:text-4xl">
                <span>welcome</span>
                
                <span className='text-transparent bg-clip-text bg-linear-to-t from-pink-400 via-[#c9bdd1] to-blue-400 ml-2'>ba</span>
                <span className='text-transparent bg-clip-text bg-linear-to-b from-pink-400 via-[#c9bdd1] to-blue-400'>ck</span>
              </h2>

            </div>

            <div className="relative">

              <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-pink-200/20 via-white/5 to-blue-200/20 blur-[60px] lg:-inset-10 lg:from-pink-200/35 lg:via-white/10 lg:to-blue-200/35" />

              <div className="relative">
                <LoginForm />
              </div>

              <p className="mt-4 text-center text-[12px] leading-5 text-[#8f8588]">
                By continuing, you agree to Duora{' '}
                <Link
                  href="/terms"
                  className="text-blue-500 underline decoration-pink-200 underline-offset-2 transition hover:text-pink-500 hover:decoration-pink-400"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/policy"
                  className="text-blue-500 underline decoration-pink-200 underline-offset-2 transition hover:text-pink-500 hover:decoration-pink-400"
                >
                  Privacy Policy
                </Link>
                . Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-pink-500 underline decoration-blue-200 underline-offset-2 transition hover:text-blue-500 hover:decoration-blue-400"
                >
                  Sign up
                </Link>
                .
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}