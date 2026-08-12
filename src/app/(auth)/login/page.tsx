import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Heart,
  Sparkles,
  Wallet,
} from 'lucide-react'

import LoginForm from '@/features/auth/components/login-form'

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa] text-[#111111]">

      {/* ========================================================= */}
      {/* AMBIENT BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-300/20 blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-pink-300/20 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/10 blur-[120px]" />

      </div>


      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <nav className="relative z-20 px-6 py-5">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <Link
            href="/"
            className="text-xl font-semibold tracking-[-0.05em]"
          >
            duora
          </Link>


          <Link
            href="/"
            className="group flex items-center gap-2 text-sm text-neutral-400 transition hover:text-black"
          >

            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            Back to website

          </Link>

        </div>

      </nav>


      {/* ========================================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 pb-12 pt-8">

        <div className="grid w-full items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">


          {/* ===================================================== */}
          {/* LEFT — BRAND STORY */}
          {/* ===================================================== */}

          <div className="hidden lg:block">

            {/* Small badge */}

            <div className="mb-8 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/60 px-4 py-2 text-xs text-neutral-500 backdrop-blur">

              <Sparkles
                size={13}
                className="text-blue-500"
              />

              A space made for two

            </div>


            {/* Heading */}

            <h1 className="max-w-2xl text-6xl font-semibold leading-[0.95] tracking-[-0.07em] xl:text-7xl">

              Your relationship,

              <br />

              <span className="text-neutral-400">
                in one place.
              </span>

            </h1>


            {/* Description */}

            <p className="mt-8 max-w-lg text-base leading-7 text-neutral-500">

              The little things become the big things.
              Save for your dreams, make plans together,
              and understand each other a little better
              every day.

            </p>


            {/* Feature list */}

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">

              {/* Goal */}

              <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-4 backdrop-blur">

                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">

                  <Wallet size={17} />

                </div>

                <p className="mt-4 text-sm font-medium">
                  Save together
                </p>

                <p className="mt-1 text-[11px] leading-4 text-neutral-400">
                  Build shared goals
                </p>

              </div>


              {/* Planner */}

              <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-4 backdrop-blur">

                <div className="flex size-9 items-center justify-center rounded-xl bg-pink-50 text-pink-500">

                  <CalendarDays size={17} />

                </div>

                <p className="mt-4 text-sm font-medium">
                  Plan together
                </p>

                <p className="mt-1 text-[11px] leading-4 text-neutral-400">
                  Make time for each other
                </p>

              </div>


              {/* Check-in */}

              <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-4 backdrop-blur">

                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50 text-pink-500">

                  <Heart size={17} />

                </div>

                <p className="mt-4 text-sm font-medium">
                  Check in
                </p>

                <p className="mt-1 text-[11px] leading-4 text-neutral-400">
                  Understand each other
                </p>

              </div>

            </div>


            {/* Quote / visual */}

            <div className="relative mt-8 max-w-xl overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/60 p-6 backdrop-blur-xl">

              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200/30 to-pink-200/30 blur-3xl" />


              <div className="relative flex items-center gap-5">

                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">

                  <Heart
                    size={20}
                    className="text-pink-500"
                    fill="currentColor"
                  />

                </div>


                <div>

                  <p className="text-sm font-medium">
                    “Growing together,
                    one day at a time.”
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    Your little corner of the relationship.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ===================================================== */}
          {/* RIGHT — LOGIN */}
          {/* ===================================================== */}

          <div className="w-full max-w-md justify-self-center lg:justify-self-end">

            {/* Mobile logo */}

            <div className="mb-8 text-center lg:hidden">

              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">

                <Heart
                  size={20}
                  className="text-pink-500"
                  fill="currentColor"
                />

              </div>

              <p className="text-sm text-neutral-400">
                A space made for two
              </p>

            </div>


            {/* Login heading */}

            <div className="mb-8">

              <div className="mb-5 hidden size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50 lg:flex">

                <Heart
                  size={17}
                  className="text-pink-500"
                  fill="currentColor"
                />

              </div>


              <h2 className="text-4xl font-semibold tracking-[-0.055em]">
                Welcome back.
              </h2>


              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Continue where you left off
                and keep growing together.
              </p>

            </div>


            {/* Login card */}

            <div className="relative">

              {/* Card glow */}

              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-r from-blue-200/20 via-transparent to-pink-200/20 blur-2xl" />


              <div className="relative rounded-[2rem] border border-black/[0.06] bg-white/85 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8">

                <LoginForm />

              </div>

            </div>


            {/* Register */}

            <p className="mt-7 text-center text-sm text-neutral-400">

              Don't have an account?

              {' '}

              <Link
                href="/register"
                className="font-medium text-neutral-900 transition hover:text-blue-500"
              >
                Create one
              </Link>

            </p>


            {/* Small bottom message */}

            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-neutral-300">

              <span>
                Securely connected
              </span>

              <span>·</span>

              <span>
                Built for two
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* BOTTOM AMBIENT ORBS */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute bottom-10 left-[8%] size-2 rounded-full bg-blue-400/40 blur-[1px]" />

      <div className="pointer-events-none absolute right-[12%] top-[30%] size-2 rounded-full bg-pink-400/40 blur-[1px]" />

    </main>
  )
}