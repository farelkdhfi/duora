import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Heart,
  Sparkles,
  Wallet,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] text-[#111111]">

      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-black/[0.06] bg-white/75 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">

          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.04em]"
          >
            duora
          </Link>

          <div className="hidden items-center gap-8 text-sm text-neutral-500 md:flex">
            <a
              href="#features"
              className="transition hover:text-black"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-black"
            >
              How it works
            </a>

            <a
              href="#together"
              className="transition hover:text-black"
            >
              Together
            </a>
          </div>

          <Link
            href="/login"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Get started
          </Link>

        </div>
      </nav>


      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative flex min-h-screen items-center justify-center px-6 pt-28">

        {/* Ambient background */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute left-1/2 top-[8%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-300/20 blur-[130px]" />

          <div className="absolute left-[10%] top-[35%] h-[260px] w-[260px] rounded-full bg-pink-300/20 blur-[120px]" />

          <div className="absolute right-[10%] top-[30%] h-[300px] w-[300px] rounded-full bg-blue-300/15 blur-[120px]" />

        </div>


        <div className="relative mx-auto max-w-5xl text-center">

          {/* Badge */}

          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/70 px-4 py-2 text-xs text-neutral-500 shadow-sm backdrop-blur">

            <Sparkles
              size={13}
              className="text-blue-500"
            />

            Built for two

          </div>


          {/* Heading */}

          <h1 className="mx-auto max-w-4xl text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.075em]">

            Grow closer.

            <br />

            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
              Together.
            </span>

          </h1>


          {/* Description */}

          <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-neutral-500 md:text-lg">
            Duora brings your goals, plans, savings,
            and everyday feelings into one beautiful
            space built for two.
          </p>


          {/* CTA */}

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Start growing together

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <a
              href="#features"
              className="rounded-full px-6 py-3.5 text-sm font-medium text-neutral-500 transition hover:text-black"
            >
              Explore Duora
            </a>

          </div>


          {/* Hero App Preview */}

          <div className="relative mx-auto mt-20 max-w-4xl">

            <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-r from-blue-200/30 via-white to-pink-200/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-blue-100/70 bg-white/80 p-3 shadow-[0_40px_100px_rgba(80,100,180,0.10)] backdrop-blur-xl">

              <div className="rounded-[1.5rem] border border-black/[0.05] bg-[#f7f7f5] p-5 md:p-8">

                {/* Fake app top bar */}

                <div className="mb-8 flex items-center justify-between">

                  <div className="text-sm font-semibold tracking-tight">
                    duora
                  </div>

                  <div className="flex items-center gap-2">

                    <div className="size-7 rounded-full bg-blue-100" />

                    <div className="size-7 rounded-full bg-pink-100" />

                  </div>

                </div>


                {/* Preview cards */}

                <div className="grid gap-4 md:grid-cols-3">

                  {/* Savings */}

                  <div className="rounded-2xl border border-black/[0.05] bg-white p-5 text-left">

                    <Wallet
                      size={18}
                      className="text-blue-500"
                    />

                    <p className="mt-8 text-xs text-neutral-400">
                      Shared savings
                    </p>

                    <p className="mt-1 text-xl font-semibold tracking-tight">
                      Rp 3.2M
                    </p>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-100">

                      <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-blue-500 to-pink-500" />

                    </div>

                    <p className="mt-2 text-[11px] text-neutral-400">
                      64% of your goal
                    </p>

                  </div>


                  {/* Check-in */}

                  <div className="rounded-2xl border border-black/[0.05] bg-white p-5 text-left">

                    <Heart
                      size={18}
                      className="text-pink-500"
                    />

                    <p className="mt-8 text-xs text-neutral-400">
                      Today
                    </p>

                    <p className="mt-1 text-xl font-semibold tracking-tight">
                      Feeling good
                    </p>

                    <p className="mt-2 text-xs text-neutral-400">
                      Both checked in today
                    </p>

                  </div>


                  {/* Planner */}

                  <div className="rounded-2xl border border-black/[0.05] bg-white p-5 text-left">

                    <CalendarDays
                      size={18}
                      className="text-blue-500"
                    />

                    <p className="mt-8 text-xs text-neutral-400">
                      Next together
                    </p>

                    <p className="mt-1 text-xl font-semibold tracking-tight">
                      Dinner
                    </p>

                    <p className="mt-2 text-xs text-neutral-400">
                      Tomorrow · 19:00
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* INTRO */}
      {/* ========================================================= */}

      <section
        id="together"
        className="px-6 py-32 md:py-44"
      >

        <div className="mx-auto max-w-5xl">

          <p className="text-sm font-medium text-blue-500">
            MORE THAN A SHARED APP
          </p>

          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.05em] md:text-6xl">

            A little space for

            <br />

            <span className="text-neutral-400">
              everything you build together.
            </span>

          </h2>

          <p className="mt-8 max-w-xl text-base leading-7 text-neutral-500">
            From saving for your next adventure to
            understanding how your partner feels today,
            Duora keeps the little things connected.
          </p>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FEATURES */}
      {/* ========================================================= */}

      <section
        id="features"
        className="px-6 pb-32"
      >

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-5 md:grid-cols-3">

            {/* Goals */}

            <FeatureCard
              icon={
                <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                  <Wallet size={20} />
                </div>
              }
              number="01"
              title="Build goals together."
              description="Save together for the things that matter. Every contribution brings you a little closer."
            />


            {/* Planner */}

            <FeatureCard
              icon={
                <div className="flex size-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
                  <CalendarDays size={20} />
                </div>
              }
              number="02"
              title="Make time for each other."
              description="Plan dates, trips, anniversaries, and all the little moments you don't want to forget."
            />


            {/* Check-in */}

            <FeatureCard
              icon={
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 text-pink-500">
                  <Heart size={20} />
                </div>
              }
              number="03"
              title="Understand each other."
              description="Check in every day. Share your mood, energy, stress, what you liked, and what you need."
            />

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* SHARED GOALS SHOWCASE */}
      {/* ========================================================= */}

      <section className="px-6 py-32">

        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">

          {/* Text */}

          <div>

            <p className="text-sm font-medium text-blue-500">
              SHARED GOALS
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">

              Dreams feel

              <br />

              better together.

            </h2>

            <p className="mt-6 max-w-md leading-7 text-neutral-500">
              Create something worth working toward.
              Track your progress and see every
              contribution from both of you in real time.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition hover:text-blue-500"
            >
              Create your first goal

              <ArrowUpRight size={15} />
            </Link>

          </div>


          {/* Card */}

          <div className="relative">

            <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-blue-200/30 to-pink-200/30 blur-3xl" />

            <div className="relative rounded-[2rem] border border-black/[0.06] bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.07)]">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs text-neutral-400">
                    SHARED GOAL
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    Japan, together.
                  </h3>

                </div>

                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-pink-50 text-pink-500">

                  <Heart size={17} />

                </div>

              </div>


              <div className="mt-12">

                <div className="flex items-end justify-between">

                  <div>

                    <p className="text-4xl font-semibold tracking-[-0.05em]">
                      Rp 3.2M
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      of Rp 5M
                    </p>

                  </div>

                  <p className="text-sm font-medium text-blue-500">
                    64%
                  </p>

                </div>


                <div className="mt-5 h-2 overflow-hidden rounded-full bg-neutral-100">

                  <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-blue-500 to-pink-500" />

                </div>

              </div>


              <div className="mt-8 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-blue-50/60 p-4">

                  <p className="text-xs text-neutral-400">
                    You
                  </p>

                  <p className="mt-1 font-medium">
                    Rp 1.8M
                  </p>

                </div>


                <div className="rounded-2xl bg-pink-50/60 p-4">

                  <p className="text-xs text-neutral-400">
                    Partner
                  </p>

                  <p className="mt-1 font-medium">
                    Rp 1.4M
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* DAILY CHECK-IN */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-[#111111] px-6 py-32 text-white md:py-40">

        {/* Dark section ambient */}

        <div className="pointer-events-none absolute left-[15%] top-[-100px] h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="pointer-events-none absolute bottom-[-100px] right-[10%] h-[350px] w-[350px] rounded-full bg-pink-500/10 blur-[120px]" />


        <div className="relative mx-auto max-w-6xl">

          <div className="grid items-center gap-16 md:grid-cols-2">

            {/* Card */}

            <div className="order-2 md:order-1">

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs text-white/40">
                      PARTNER'S CHECK-IN
                    </p>

                    <h3 className="mt-2 text-xl font-medium">
                      Today
                    </h3>

                  </div>

                  <span className="text-4xl">
                    😊
                  </span>

                </div>


                <div className="mt-8 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-white/[0.06] p-4">

                    <p className="text-xs text-white/40">
                      Energy
                    </p>

                    <p className="mt-2 text-lg font-medium">
                      8/10
                    </p>

                  </div>


                  <div className="rounded-2xl bg-white/[0.06] p-4">

                    <p className="text-xs text-white/40">
                      Stress
                    </p>

                    <p className="mt-2 text-lg font-medium">
                      3/10
                    </p>

                  </div>

                </div>


                <div className="mt-3 rounded-2xl bg-gradient-to-r from-blue-500/[0.08] to-pink-500/[0.08] p-4">

                  <p className="text-xs text-white/40">
                    LIKED TODAY
                  </p>

                  <p className="mt-2 text-sm text-white/80">
                    "You called me after work."
                  </p>

                </div>


                <div className="mt-3 rounded-2xl bg-gradient-to-r from-pink-500/[0.08] to-blue-500/[0.08] p-4">

                  <p className="text-xs text-white/40">
                    NEEDS FROM YOU
                  </p>

                  <p className="mt-2 text-sm text-white/80">
                    "Just some reassurance."
                  </p>

                </div>

              </div>

            </div>


            {/* Text */}

            <div className="order-1 md:order-2">

              <p className="text-sm font-medium text-pink-400">
                DAILY CHECK-IN
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">

                Know how they

                <br />

                really feel.

              </h2>

              <p className="mt-6 max-w-md leading-7 text-white/50">
                Sometimes "I'm fine" isn't enough.
                Duora gives both of you a simple,
                private space to express what's
                actually going on.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* PLANNER */}
      {/* ========================================================= */}

      <section
        id="how-it-works"
        className="px-6 py-32 md:py-40"
      >

        <div className="mx-auto max-w-6xl">

          <div className="max-w-2xl">

            <p className="text-sm font-medium text-pink-500">
              COUPLE PLANNER
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">

              Make memories

              <br />

              <span className="text-neutral-400">
                before they happen.
              </span>

            </h2>

          </div>


          <div className="mt-16 grid gap-4 md:grid-cols-2">

            <PlannerItem
              day="20"
              month="AUG"
              title="Anniversary Dinner"
              time="19:00"
            />

            <PlannerItem
              day="24"
              month="AUG"
              title="Movie Night"
              time="20:00"
            />

            <PlannerItem
              day="31"
              month="AUG"
              title="Weekend Getaway"
              time="09:00"
            />

            <PlannerItem
              day="12"
              month="SEP"
              title="Our Little Date"
              time="18:30"
            />

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="px-6 pb-16 pt-20">

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[3rem] bg-[#111111] px-6 py-24 text-center text-white md:px-10">

          {/* CTA ambient */}

          <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-pink-500/20 blur-[100px]" />


          <div className="relative">

            <Heart
              size={22}
              fill="currentColor"
              className="mx-auto mb-7 text-pink-400"
            />

            <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">

              Your relationship deserves

              <br />

              a place of its own.

            </h2>

            <p className="mx-auto mt-6 max-w-lg leading-7 text-white/50">
              Start building something beautiful,
              one day at a time.
            </p>

            <Link
              href="/register"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Start with Duora

              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="px-6 pb-10 pt-8">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-black/[0.06] pt-8 text-xs text-neutral-400 md:flex-row">

          <p>
            © 2026 Duora
          </p>

          <p>
            Built for two. ❤️
          </p>

        </div>

      </footer>

    </main>
  )
}


/* ============================================================= */
/* FEATURE CARD */
/* ============================================================= */

function FeatureCard({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode
  number: string
  title: string
  description: string
}) {
  return (
    <div className="group rounded-[2rem] border border-black/[0.06] bg-white p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.07)]">

      <div className="flex items-center justify-between">

        {icon}

        <span className="text-xs text-neutral-300">
          {number}
        </span>

      </div>


      <h3 className="mt-12 text-xl font-semibold tracking-[-0.03em]">
        {title}
      </h3>


      <p className="mt-3 text-sm leading-6 text-neutral-500">
        {description}
      </p>

    </div>
  )
}


/* ============================================================= */
/* PLANNER ITEM */
/* ============================================================= */

function PlannerItem({
  day,
  month,
  title,
  time,
}: {
  day: string
  month: string
  title: string
  time: string
}) {
  return (
    <div className="group flex items-center gap-5 rounded-[1.5rem] border border-black/[0.06] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">

      <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">

        <span className="text-[10px] font-medium text-neutral-400">
          {month}
        </span>

        <span className="text-xl font-semibold">
          {day}
        </span>

      </div>


      <div className="min-w-0">

        <h3 className="truncate font-medium">
          {title}
        </h3>

        <p className="mt-1 text-sm text-neutral-400">
          {time}
        </p>

      </div>


      <ArrowUpRight
        size={17}
        className="ml-auto shrink-0 text-neutral-300 transition group-hover:text-blue-500"
      />

    </div>
  )
}