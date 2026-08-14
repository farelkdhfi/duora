import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Heart,
  Sparkles,
  Wallet,
} from 'lucide-react'

import Image from 'next/image'
import heroImage from '@/assets/heo/heroImage.jpg'
import duoraLogo from '@/assets/duora-logo3.png'

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] text-[#111111]">

      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-black/[0.06] bg-white/20 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">

          <Link
            href="/"
            className="flex justify-center items-center gap-1"
          >
            <Image
              src={duoraLogo}
              alt="Duora logo"
              width={27}
              height={27}
              className="rounded-full"
            />

            <span className="text-lg uppercase font-bold tracking-[-0.04em]">
              duora
            </span>
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

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28">

        {/* Background Image */}
        <div className="absolute inset-0 z-10">
          <Image
            src={heroImage}
            alt="Couple together"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-white" />
        </div>


        <div className="relative mx-auto max-w-5xl text-center z-20">
          {/* Heading */}

          <h1 className="mx-auto max-w-4xl text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.075em]">

            Grow closer.

            <br className='bg-pink' />

            <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
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

          <div className="relative mx-auto mt-20 max-w-5xl">

            {/* Ambient glow */}

            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-t-[4rem] bg-gradient-to-r from-blue-200/20 via-white/40 to-pink-200/20 blur-3xl" />


            {/* Browser / App Window */}

            <div className="relative overflow-hidden rounded-t-[2.25rem]  bg-white/80 p-2 shadow-[0_50px_120px_rgba(0,0,0,0.12)] backdrop-blur-2xl">

              <div className="overflow-hidden rounded-[1.8rem] border border-black/[0.05] bg-[#f8f8f7]">


                {/* ===================================================== */}
                {/* WINDOW BAR */}
                {/* ===================================================== */}

                <div className="flex h-12 items-center border-b border-black/[0.05] bg-white/70 px-5">

                  {/* Traffic lights */}

                  <div className="flex items-center gap-1.5">

                    <div className="size-2.5 rounded-full bg-black/10" />
                    <div className="size-2.5 rounded-full bg-black/10" />
                    <div className="size-2.5 rounded-full bg-black/10" />

                  </div>


                  {/* Center title */}

                  <div className="absolute left-1/2 -translate-x-1/2">

                    <span className="text-[11px] uppercase font-medium tracking-wide text-neutral-400">
                      duora
                    </span>

                  </div>

                </div>


                {/* ===================================================== */}
                {/* APP */}
                {/* ===================================================== */}

                <div className="flex min-h-[470px]">


                  {/* =================================================== */}
                  {/* SIDEBAR */}
                  {/* =================================================== */}

                  <aside className="hidden w-44 shrink-0 border-r border-black/[0.05] bg-white/50 p-4 md:block">

                    {/* Logo */}

                    <div className="flex items-center gap-2 px-2">

                      <span className="text-sm uppercase font-semibold tracking-[-0.04em]">
                        duora
                      </span>

                    </div>


                    {/* Navigation */}

                    <div className="mt-8 space-y-1">

                      <div className="flex items-center gap-2.5 rounded-xl bg-black/[0.05] px-3 py-2.5 text-[11px] font-medium text-neutral-800">

                        <div className="size-1.5 rounded-full bg-black" />

                        Overview

                      </div>


                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] text-neutral-400">

                        <Wallet size={13} />

                        Goals

                      </div>


                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] text-neutral-400">

                        <CalendarDays size={13} />

                        Planner

                      </div>


                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] text-neutral-400">

                        <Heart size={13} />

                        Check-in

                      </div>

                    </div>


                    {/* Couple */}

                    <div className="absolute bottom-7 flex items-center gap-2 px-2">

                      <div className="flex -space-x-2">

                        <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-neutral-200 text-[9px]">
                          Y
                        </div>

                        <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-neutral-300 text-[9px]">
                          F
                        </div>

                      </div>

                      <div>

                        <p className="text-[10px] font-medium">
                          You two
                        </p>

                        <p className="text-[9px] text-neutral-400">
                          Together
                        </p>

                      </div>

                    </div>

                  </aside>


                  {/* =================================================== */}
                  {/* MAIN DASHBOARD */}
                  {/* =================================================== */}

                  <div className="flex-1 p-5 md:p-7">


                    {/* Header */}

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                          Thursday, August 14
                        </p>

                        <h3 className="mt-1 text-xl font-semibold tracking-[-0.04em] md:text-2xl">
                          Good morning, Farel.
                        </h3>

                      </div>


                      <div className="flex items-center gap-2">

                        <div className="flex size-8 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[10px] font-medium shadow-sm">
                          F
                        </div>

                        <Heart
                          size={13}
                          fill="currentColor"
                          className="text-pink-400"
                        />

                        <div className="flex size-8 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[10px] font-medium shadow-sm">
                          Y
                        </div>

                      </div>

                    </div>


                    {/* ================================================= */}
                    {/* TOP CARDS */}
                    {/* ================================================= */}

                    <div className="mt-7 grid gap-3 md:grid-cols-[1.4fr_1fr]">


                      {/* Savings */}

                      <div className="relative overflow-hidden rounded-[1.4rem] bg-[#111111] p-5 text-white">

                        {/* Glow */}

                        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-blue-500/20 blur-3xl" />

                        <div className="pointer-events-none absolute -bottom-12 right-10 size-32 rounded-full bg-pink-500/10 blur-3xl" />


                        <div className="relative">

                          <div className="flex items-center justify-between">

                            <div>

                              <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                                Shared savings
                              </p>

                              <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                                Rp 3.2M
                              </p>

                            </div>


                            <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.08]">

                              <Wallet size={15} className="text-white/70" />

                            </div>

                          </div>


                          <div className="mt-8">

                            <div className="flex items-center justify-between text-[10px]">

                              <span className="text-white/40">
                                Japan trip
                              </span>

                              <span className="text-white/60">
                                Rp 5M
                              </span>

                            </div>


                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">

                              <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-blue-400 to-pink-400" />

                            </div>


                            <div className="mt-2 flex items-center justify-between">

                              <span className="text-[10px] text-white/35">
                                64% completed
                              </span>

                              <span className="text-[10px] font-medium text-white/60">
                                + Rp 250K this week
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* Check-in */}

                      <div className="rounded-[1.4rem] border border-black/[0.05] bg-white p-5">

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                              Daily check-in
                            </p>

                            <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                              Feeling good
                            </p>

                          </div>


                          <div className="flex size-9 items-center justify-center rounded-xl bg-pink-50">

                            <Heart
                              size={15}
                              fill="currentColor"
                              className="text-pink-400"
                            />

                          </div>

                        </div>


                        <div className="mt-7 flex items-center gap-2">

                          <div className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-xs">
                            😊
                          </div>

                          <div className="flex size-8 items-center justify-center rounded-full bg-pink-50 text-xs">
                            ❤️
                          </div>

                          <span className="ml-1 text-[10px] text-neutral-400">
                            Both checked in
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* ================================================= */}
                    {/* BOTTOM */}
                    {/* ================================================= */}

                    <div className="mt-3 grid gap-3 md:grid-cols-2">


                      {/* Upcoming */}

                      <div className="rounded-[1.4rem] border border-black/[0.05] bg-white p-5">

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                              Upcoming
                            </p>

                            <p className="mt-2 text-base font-semibold tracking-[-0.03em]">
                              Anniversary Dinner
                            </p>

                          </div>


                          <div className="flex size-10 flex-col items-center justify-center rounded-xl bg-neutral-50">

                            <span className="text-[8px] font-medium text-neutral-400">
                              AUG
                            </span>

                            <span className="text-sm font-semibold">
                              20
                            </span>

                          </div>

                        </div>


                        <div className="mt-5 flex items-center gap-2 text-[10px] text-neutral-400">

                          <CalendarDays size={12} />

                          Tomorrow · 19:00

                        </div>

                      </div>


                      {/* Activity */}

                      <div className="rounded-[1.4rem] border border-black/[0.05] bg-white p-5">

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                              This week
                            </p>

                            <p className="mt-2 text-base font-semibold tracking-[-0.03em]">
                              12 moments together
                            </p>

                          </div>


                          <Sparkles
                            size={16}
                            className="text-blue-400"
                          />

                        </div>


                        <div className="mt-5 flex gap-1">

                          {[1, 2, 3, 4, 5, 6, 7].map((day, index) => (

                            <div
                              key={day}
                              className={`h-1.5 flex-1 rounded-full ${index < 5
                                ? 'bg-black'
                                : 'bg-neutral-100'
                                }`}
                            />

                          ))}

                        </div>


                        <p className="mt-2 text-[10px] text-neutral-400">
                          You're building a beautiful streak.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* Reflection / bottom glow */}

            <div className="pointer-events-none absolute -bottom-20 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full bg-black/[0.06] blur-3xl" />

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* INTRO + FEATURES */}
      {/* ========================================================= */}

      <section
        id="features"
        className="relative overflow-hidden px-6 py-20"
      >

        {/* Ambient */}

        <div className="pointer-events-none absolute left-[-180px] top-[20%] size-[420px] rounded-full bg-blue-200/20 blur-[130px]" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[-120px] size-[420px] rounded-full bg-pink-200/20 blur-[130px]" />


        <div className="relative mx-auto max-w-6xl">


          {/* ===================================================== */}
          {/* INTRO */}
          {/* ===================================================== */}

          <div className="max-w-4xl">

            <div className="flex items-center gap-3">

              <div className="size-1.5 rounded-full bg-black" />

              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                Built for two
              </p>

            </div>


            <h2 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.065em] md:text-7xl">

              Everything you build

              <br />

              <span className="text-neutral-300">
                together, in one place.
              </span>

            </h2>


            <p className="mt-8 max-w-xl text-base leading-7 text-neutral-500 md:text-lg">

              Duora brings your goals, plans, savings,
              and everyday feelings into one quiet space
              designed for the two of you.

            </p>

          </div>


          {/* ===================================================== */}
          {/* FEATURES */}
          {/* ===================================================== */}

          <div className="mt-20 grid gap-4 md:grid-cols-2">


            {/* =================================================== */}
            {/* SHARED GOALS — LARGE CARD */}
            {/* =================================================== */}

            <div className="group relative min-h-[440px] overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,0.04)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(0,0,0,0.08)] md:row-span-2 md:p-9">


              {/* Background ambient */}

              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue-100/50 blur-[90px]" />

              <div className="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-pink-100/30 blur-[90px]" />


              <div className="relative flex h-full flex-col">


                {/* Header */}

                <div className="flex items-start justify-between">

                  <div>

                    <span className="text-[10px] font-medium tracking-[0.18em] text-neutral-300">
                      01
                    </span>

                    <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-blue-500">
                      Shared goals
                    </p>

                  </div>


                  <div className="flex size-10 items-center justify-center rounded-full border border-black/[0.06] bg-neutral-50">

                    <Wallet
                      size={16}
                      className="text-neutral-600"
                    />

                  </div>

                </div>


                {/* Content */}

                <div className="mt-auto pt-20">

                  <h3 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.05em] md:text-4xl">

                    Build something

                    <br />

                    worth working toward.

                  </h3>


                  <p className="mt-5 max-w-md text-sm leading-6 text-neutral-500">

                    Save together for the things that matter.
                    Track every contribution and watch your
                    shared goal slowly become real.

                  </p>


                  {/* Mini goal */}

                  <div className="mt-10 max-w-md rounded-[1.5rem] border border-black/[0.05] bg-[#f8f8f7] p-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                          Japan, together
                        </p>

                        <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                          Rp 3.2M
                        </p>

                      </div>


                      <span className="text-xs font-medium text-blue-500">
                        64%
                      </span>

                    </div>


                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-neutral-200">

                      <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-blue-400 to-pink-400 transition-all duration-700 group-hover:w-[70%]" />

                    </div>


                    <div className="mt-2 flex justify-between">

                      <span className="text-[10px] text-neutral-400">
                        Rp 1.8M you
                      </span>

                      <span className="text-[10px] text-neutral-400">
                        Rp 1.4M partner
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================== */}
            {/* PLANNER */}
            {/* =================================================== */}

            <div className="group relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-[#111111] p-7 text-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.15)] md:p-9">


              {/* Ambient */}

              <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-blue-500/10 blur-[80px]" />


              <div className="relative flex items-start justify-between">

                <div>

                  <span className="text-[10px] font-medium tracking-[0.18em] text-white/20">
                    02
                  </span>

                  <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-blue-400">
                    Couple planner
                  </p>

                </div>


                <div className="flex size-10 items-center justify-center rounded-full bg-white/[0.07]">

                  <CalendarDays
                    size={16}
                    className="text-white/70"
                  />

                </div>

              </div>


              <div className="relative mt-14">

                <h3 className="text-2xl font-semibold tracking-[-0.04em] md:text-3xl">

                  Make time for

                  <br />

                  each other.

                </h3>


                <p className="mt-4 max-w-sm text-sm leading-6 text-white/45">

                  Dates, trips, anniversaries, and all
                  the little moments worth remembering.

                </p>


                {/* Date preview */}

                <div className="mt-8 flex items-center gap-4">

                  <div className="flex size-12 flex-col items-center justify-center rounded-xl bg-white/[0.07]">

                    <span className="text-[8px] font-medium text-white/40">
                      AUG
                    </span>

                    <span className="text-lg font-semibold">
                      20
                    </span>

                  </div>


                  <div>

                    <p className="text-sm font-medium">
                      Anniversary Dinner
                    </p>

                    <p className="mt-1 text-[10px] text-white/35">
                      19:00 · Tomorrow
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================== */}
            {/* CHECK-IN */}
            {/* =================================================== */}

            <div className="group relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] md:p-9">


              {/* Ambient */}

              <div className="pointer-events-none absolute -bottom-20 -right-10 size-48 rounded-full bg-pink-100/50 blur-[70px]" />


              <div className="relative flex items-start justify-between">

                <div>

                  <span className="text-[10px] font-medium tracking-[0.18em] text-neutral-300">
                    03
                  </span>

                  <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-pink-500">
                    Daily check-in
                  </p>

                </div>


                <div className="flex size-10 items-center justify-center rounded-full bg-pink-50">

                  <Heart
                    size={16}
                    fill="currentColor"
                    className="text-pink-400"
                  />

                </div>

              </div>


              <div className="relative mt-14">

                <h3 className="text-2xl font-semibold tracking-[-0.04em] md:text-3xl">

                  Understand each

                  <br />

                  other a little better.

                </h3>


                <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-500">

                  A simple private space to share
                  how you're feeling, what you liked,
                  and what you need.

                </p>


                {/* Checkin preview */}

                <div className="mt-8 flex items-center justify-between rounded-2xl bg-[#f8f8f7] p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex size-9 items-center justify-center rounded-full bg-white text-sm shadow-sm">
                      😊
                    </div>

                    <div>

                      <p className="text-xs font-medium">
                        Feeling good
                      </p>

                      <p className="mt-0.5 text-[10px] text-neutral-400">
                        Both checked in today
                      </p>

                    </div>

                  </div>


                  <div className="flex -space-x-2">

                    <div className="flex size-7 items-center justify-center rounded-full border-2 border-[#f8f8f7] bg-blue-100 text-[9px]">
                      F
                    </div>

                    <div className="flex size-7 items-center justify-center rounded-full border-2 border-[#f8f8f7] bg-pink-100 text-[9px]">
                      Y
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ===================================================== */}
          {/* BOTTOM STATEMENT */}
          {/* ===================================================== */}

          <div className="mt-16 flex flex-col gap-5 border-t border-black/[0.06] pt-7 md:flex-row md:items-center md:justify-between">

            <p className="max-w-md text-sm leading-6 text-neutral-400">
              Not another productivity app.
              Just a quiet little space for the two of you.
            </p>


            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">

              <span className="flex size-6 items-center justify-center rounded-full bg-black text-white">
                <Heart
                  size={10}
                  fill="currentColor"
                />
              </span>

              Built for two.

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* SHARED GOALS SHOWCASE */}
      {/* ========================================================= */}

      {/* ========================================================= */}
      {/* SHARED GOALS SHOWCASE */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden px-6 py-20">

        {/* Ambient */}

        <div className="pointer-events-none absolute left-[-180px] top-[30%] size-[420px] rounded-full bg-blue-100/40 blur-[130px]" />

        <div className="pointer-events-none absolute bottom-[-160px] right-[-100px] size-[400px] rounded-full bg-pink-100/30 blur-[130px]" />


        <div className="relative mx-auto grid max-w-6xl items-center gap-20 md:grid-cols-[0.85fr_1.15fr]">


          {/* ===================================================== */}
          {/* LEFT — COPY */}
          {/* ===================================================== */}

          <div>

            {/* Eyebrow */}

            <div className="flex items-center gap-3">

              <div className="size-1.5 rounded-full bg-blue-500" />

              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                Shared goals
              </p>

            </div>


            {/* Heading */}

            <h2 className="mt-7 text-5xl font-semibold leading-[0.95] tracking-[-0.065em] md:text-6xl">

              Dreams feel

              <br />

              <span className="text-neutral-300">
                better together.
              </span>

            </h2>


            {/* Description */}

            <p className="mt-8 max-w-md text-base leading-7 text-neutral-500">

              Create something worth working toward.
              Track your progress, contribute together,
              and watch a shared dream slowly become real.

            </p>


            {/* CTA */}

            <Link
              href="/register"
              className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-black"
            >

              Create your first goal

              <span className="flex size-7 items-center justify-center rounded-full border border-black/[0.08] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">

                <ArrowUpRight size={13} />

              </span>

            </Link>


            {/* Small statement */}

            <div className="mt-14 border-l border-black/[0.08] pl-5">

              <p className="max-w-xs text-xs leading-5 text-neutral-400">

                Every contribution counts.
                Whether it's Rp 10K or Rp 1M,
                you're moving toward the same thing.

              </p>

            </div>

          </div>


          {/* ===================================================== */}
          {/* RIGHT — GOAL UI */}
          {/* ===================================================== */}

          <div className="relative">


            {/* Large ambient */}

            <div className="pointer-events-none absolute -inset-16 rounded-full bg-gradient-to-br from-blue-100/30 via-transparent to-pink-100/30 blur-[90px]" />


            {/* Floating card */}

            <div className="relative rotate-[1deg] rounded-[2.5rem] border border-black/[0.06] bg-white p-2 shadow-[0_40px_100px_rgba(0,0,0,0.10)] transition duration-500 hover:rotate-0">


              <div className="rounded-[2rem] bg-[#f8f8f7] p-5 md:p-7">


                {/* ================================================= */}
                {/* CARD HEADER */}
                {/* ================================================= */}

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                      Shared goal
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                      Japan, together.
                    </h3>

                  </div>


                  {/* Heart */}

                  <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-sm">

                    <Heart
                      size={17}
                      fill="currentColor"
                      className="text-pink-400"
                    />

                  </div>

                </div>


                {/* ================================================= */}
                {/* PROGRESS */}
                {/* ================================================= */}

                <div className="mt-12 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">


                  <div className="flex items-end justify-between">

                    <div>

                      <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                        Saved together
                      </p>

                      <p className="mt-2 text-4xl font-semibold tracking-[-0.06em]">
                        Rp 3.2M
                      </p>

                    </div>


                    <div className="text-right">

                      <p className="text-xl font-semibold tracking-[-0.04em] text-blue-500">
                        64%
                      </p>

                      <p className="mt-1 text-[10px] text-neutral-400">
                        of Rp 5M

                      </p>

                    </div>

                  </div>


                  {/* Progress */}

                  <div className="mt-7 h-2 overflow-hidden rounded-full bg-neutral-100">

                    <div className="relative h-full w-[64%] overflow-hidden rounded-full bg-gradient-to-r from-blue-400 to-pink-400">

                      <div className="absolute inset-y-0 right-0 w-16 bg-white/30 blur-md" />

                    </div>

                  </div>


                  {/* Numbers */}

                  <div className="mt-3 flex justify-between">

                    <span className="text-[10px] text-neutral-400">
                      Rp 0
                    </span>

                    <span className="text-[10px] text-neutral-400">
                      Rp 5M
                    </span>

                  </div>

                </div>


                {/* ================================================= */}
                {/* CONTRIBUTIONS */}
                {/* ================================================= */}

                <div className="mt-3 grid grid-cols-2 gap-3">


                  {/* You */}

                  <div className="rounded-[1.5rem] bg-white p-5">

                    <div className="flex items-center gap-2">

                      <div className="flex size-7 items-center justify-center rounded-full bg-blue-100 text-[9px] font-medium">
                        F
                      </div>

                      <span className="text-[10px] text-neutral-400">
                        You
                      </span>

                    </div>


                    <p className="mt-5 text-xl font-semibold tracking-[-0.04em]">
                      Rp 1.8M
                    </p>

                    <p className="mt-1 text-[10px] text-neutral-400">
                      56% of total
                    </p>

                  </div>


                  {/* Partner */}

                  <div className="rounded-[1.5rem] bg-white p-5">

                    <div className="flex items-center gap-2">

                      <div className="flex size-7 items-center justify-center rounded-full bg-pink-100 text-[9px] font-medium">
                        Y
                      </div>

                      <span className="text-[10px] text-neutral-400">
                        Partner
                      </span>

                    </div>


                    <p className="mt-5 text-xl font-semibold tracking-[-0.04em]">
                      Rp 1.4M
                    </p>

                    <p className="mt-1 text-[10px] text-neutral-400">
                      44% of total
                    </p>

                  </div>

                </div>


                {/* ================================================= */}
                {/* RECENT ACTIVITY */}
                {/* ================================================= */}

                <div className="mt-3 rounded-[1.5rem] bg-[#111111] p-5 text-white">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/35">
                        Recent activity
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        You added Rp 250K
                      </p>

                    </div>


                    <div className="flex size-8 items-center justify-center rounded-full bg-white/[0.08]">

                      <ArrowUpRight
                        size={13}
                        className="text-white/60"
                      />

                    </div>

                  </div>


                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-[10px] text-white/30">
                      Today · 09:42
                    </span>

                    <span className="text-[10px] font-medium text-blue-300">
                      + Rp 250K
                    </span>

                  </div>

                </div>


              </div>

            </div>


            {/* =================================================== */}
            {/* FLOATING BADGE */}
            {/* =================================================== */}

            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.08)] md:flex">

              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-pink-50">

                <Sparkles
                  size={13}
                  className="text-blue-500"
                />

              </div>

              <div>

                <p className="text-[10px] font-medium">
                  Almost there
                </p>

                <p className="mt-0.5 text-[9px] text-neutral-400">
                  36% left to go
                </p>

              </div>

            </div>


            {/* Floating percentage */}

            <div className="absolute -right-4 top-16 hidden rounded-2xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.07)] md:block">

              <p className="text-[9px] uppercase tracking-[0.12em] text-neutral-400">
                This month
              </p>

              <p className="mt-1 text-sm font-semibold">
                + Rp 650K
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* DAILY CHECK-IN */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-[#111111] px-6 py-20 text-white">


        {/* ======================================================= */}
        {/* AMBIENT */}
        {/* ======================================================= */}

        <div className="pointer-events-none absolute left-[-120px] top-[-120px] size-[420px] rounded-full bg-blue-500/[0.08] blur-[130px]" />

        <div className="pointer-events-none absolute bottom-[-160px] right-[-100px] size-[450px] rounded-full bg-pink-500/[0.07] blur-[130px]" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-[100px]" />


        <div className="relative mx-auto grid max-w-6xl items-center gap-20 md:grid-cols-[1.15fr_0.85fr]">


          {/* ===================================================== */}
          {/* LEFT — CHECK-IN UI */}
          {/* ===================================================== */}

          <div className="relative">


            {/* Outer glow */}

            <div className="pointer-events-none absolute -inset-10 rounded-[4rem] bg-gradient-to-br from-blue-500/[0.08] via-transparent to-pink-500/[0.08] blur-[70px]" />


            {/* Main card */}

            <div className="relative rounded-[2.5rem] border border-white/[0.08] bg-white/[0.035] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">


              <div className="rounded-[2rem] bg-[#171717] p-6 md:p-8">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                      Partner's check-in
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                      Thursday, August 14
                    </h3>

                  </div>


                  {/* Mood */}

                  <div className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.06] text-3xl">

                    😊

                  </div>

                </div>


                {/* ================================================= */}
                {/* MOOD MESSAGE */}
                {/* ================================================= */}

                <div className="mt-10">

                  <p className="text-xs text-white/35">
                    I'M FEELING
                  </p>

                  <p className="mt-2 text-lg font-medium text-white/85">
                    Good, calm, and happy today.
                  </p>

                </div>


                {/* ================================================= */}
                {/* ENERGY + STRESS */}
                {/* ================================================= */}

                <div className="mt-8 grid grid-cols-2 gap-3">


                  {/* Energy */}

                  <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.035] p-5">

                    <div className="flex items-center justify-between">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                        Energy
                      </p>

                      <span className="text-xs text-blue-300">
                        8/10
                      </span>

                    </div>


                    <div className="mt-5 flex items-end gap-1">

                      {[2, 4, 5, 6, 8, 7, 8, 8, 8, 8].map(
                        (height, index) => (

                          <div
                            key={index}
                            className="flex-1 rounded-full bg-white/[0.08]"
                          >

                            <div
                              className="w-full rounded-full bg-blue-400/60"
                              style={{
                                height: `${height * 3}px`,
                              }}
                            />

                          </div>

                        )
                      )}

                    </div>

                  </div>


                  {/* Stress */}

                  <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.035] p-5">

                    <div className="flex items-center justify-between">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                        Stress
                      </p>

                      <span className="text-xs text-pink-300">
                        3/10
                      </span>

                    </div>


                    <div className="mt-5 flex items-end gap-1">

                      {[7, 6, 5, 5, 4, 4, 3, 3, 3, 3].map(
                        (height, index) => (

                          <div
                            key={index}
                            className="flex-1 rounded-full bg-white/[0.08]"
                          >

                            <div
                              className="w-full rounded-full bg-pink-400/50"
                              style={{
                                height: `${height * 3}px`,
                              }}
                            />

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>


                {/* ================================================= */}
                {/* LIKED TODAY */}
                {/* ================================================= */}

                <div className="mt-3 rounded-[1.5rem] border border-white/[0.06] bg-gradient-to-br from-blue-500/[0.07] to-transparent p-5">

                  <div className="flex items-center gap-2">

                    <div className="flex size-7 items-center justify-center rounded-full bg-blue-400/10">

                      <Heart
                        size={12}
                        fill="currentColor"
                        className="text-blue-300"
                      />

                    </div>

                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">
                      Liked today
                    </p>

                  </div>


                  <p className="mt-4 text-sm leading-6 text-white/75">
                    "You called me after work."
                  </p>

                </div>


                {/* ================================================= */}
                {/* NEEDS */}
                {/* ================================================= */}

                <div className="mt-3 rounded-[1.5rem] border border-white/[0.06] bg-gradient-to-br from-pink-500/[0.07] to-transparent p-5">

                  <div className="flex items-center gap-2">

                    <div className="flex size-7 items-center justify-center rounded-full bg-pink-400/10">

                      <Heart
                        size={12}
                        className="text-pink-300"
                      />

                    </div>

                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">
                      Need from you
                    </p>

                  </div>


                  <p className="mt-4 text-sm leading-6 text-white/75">
                    "Just some reassurance tonight."
                  </p>

                </div>


                {/* ================================================= */}
                {/* FOOTER */}
                {/* ================================================= */}

                <div className="mt-6 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <div className="flex size-7 items-center justify-center rounded-full bg-blue-400/10 text-[9px] text-blue-200">
                      F
                    </div>

                    <div className="flex size-7 items-center justify-center rounded-full bg-pink-400/10 text-[9px] text-pink-200">
                      Y
                    </div>

                    <span className="ml-1 text-[10px] text-white/25">
                      Connected
                    </span>

                  </div>


                  <span className="text-[10px] text-white/20">
                    Updated 09:42
                  </span>

                </div>


              </div>

            </div>


            {/* =================================================== */}
            {/* FLOATING BADGE */}
            {/* =================================================== */}

            <div className="absolute -bottom-6 -right-5 hidden items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#1b1b1b] px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] md:flex">

              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/10 to-pink-400/10">

                <Heart
                  size={13}
                  fill="currentColor"
                  className="text-pink-300"
                />

              </div>

              <div>

                <p className="text-[10px] font-medium">
                  Both checked in
                </p>

                <p className="mt-0.5 text-[9px] text-white/30">
                  You're connected today
                </p>

              </div>

            </div>


          </div>


          {/* ===================================================== */}
          {/* RIGHT — COPY */}
          {/* ===================================================== */}

          <div>


            {/* Eyebrow */}

            <div className="flex items-center gap-3">

              <div className="size-1.5 rounded-full bg-pink-400" />

              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
                Daily check-in
              </p>

            </div>


            {/* Heading */}

            <h2 className="mt-7 text-5xl font-semibold leading-[0.95] tracking-[-0.065em] md:text-6xl">

              Know how they

              <br />

              <span className="text-white/25">
                really feel.
              </span>

            </h2>


            {/* Description */}

            <p className="mt-8 max-w-md text-base leading-7 text-white/45">

              Sometimes "I'm fine" isn't enough.
              Duora gives both of you a simple,
              private space to say what's actually
              going on.

            </p>


            {/* Small feature list */}

            <div className="mt-10 space-y-5">


              <div className="flex gap-4">

                <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08]">

                  <span className="text-[10px] text-white/50">
                    01
                  </span>

                </div>

                <div>

                  <p className="text-sm font-medium text-white/80">
                    Check in without pressure.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    A few simple questions are enough.
                  </p>

                </div>

              </div>


              <div className="flex gap-4">

                <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08]">

                  <span className="text-[10px] text-white/50">
                    02
                  </span>

                </div>

                <div>

                  <p className="text-sm font-medium text-white/80">
                    Understand the little things.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    Mood, energy, stress, likes, and needs.
                  </p>

                </div>

              </div>


              <div className="flex gap-4">

                <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08]">

                  <span className="text-[10px] text-white/50">
                    03
                  </span>

                </div>

                <div>

                  <p className="text-sm font-medium text-white/80">
                    Stay connected every day.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/30">
                    Even when life gets busy.
                  </p>

                </div>

              </div>


            </div>


            {/* Bottom quote */}

            <div className="mt-12 border-l border-white/[0.1] pl-5">

              <p className="max-w-sm text-xs leading-6 text-white/25">

                "The little things become easier
                to understand when you make
                space for them."

              </p>

            </div>


          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* COUPLE PLANNER */}
      {/* ========================================================= */}

      <section
        id="how-it-works"
        className="relative overflow-hidden px-6 py-20"
      >

        {/* ======================================================= */}
        {/* AMBIENT */}
        {/* ======================================================= */}

        <div className="pointer-events-none absolute right-[-180px] top-[10%] size-[420px] rounded-full bg-pink-100/40 blur-[130px]" />

        <div className="pointer-events-none absolute bottom-[-180px] left-[-120px] size-[400px] rounded-full bg-blue-100/30 blur-[130px]" />


        <div className="relative mx-auto max-w-6xl">


          {/* ===================================================== */}
          {/* HEADER */}
          {/* ===================================================== */}

          <div className="max-w-4xl">

            <div className="flex items-center gap-3">

              <div className="size-1.5 rounded-full bg-pink-500" />

              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                Couple planner
              </p>

            </div>


            <h2 className="mt-7 text-5xl font-semibold leading-[0.95] tracking-[-0.065em] md:text-7xl">

              Make memories

              <br />

              <span className="text-neutral-300">
                before they happen.
              </span>

            </h2>


            <p className="mt-8 max-w-xl text-base leading-7 text-neutral-500 md:text-lg">

              Keep the moments that matter close.
              From simple date nights to trips you've
              been waiting for.

            </p>

          </div>


          {/* ===================================================== */}
          {/* PLANNER UI */}
          {/* ===================================================== */}

          <div className="mt-20 grid gap-4 md:grid-cols-[0.85fr_1.15fr]">


            {/* =================================================== */}
            {/* MINI CALENDAR */}
            {/* =================================================== */}

            <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.06] bg-[#111111] p-7 text-white shadow-[0_25px_70px_rgba(0,0,0,0.10)] md:p-9">


              {/* Ambient */}

              <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-pink-500/[0.10] blur-[90px]" />

              <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-blue-500/[0.08] blur-[90px]" />


              <div className="relative">


                {/* Header */}

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Your month
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                      August 2026
                    </h3>

                  </div>


                  <div className="flex items-center gap-1">

                    <button className="flex size-8 items-center justify-center rounded-full bg-white/[0.06] text-white/40 transition hover:bg-white/[0.1] hover:text-white">
                      ←
                    </button>

                    <button className="flex size-8 items-center justify-center rounded-full bg-white/[0.06] text-white/40 transition hover:bg-white/[0.1] hover:text-white">
                      →
                    </button>

                  </div>

                </div>


                {/* Calendar */}

                <div className="mt-10">

                  {/* Week days */}

                  <div className="grid grid-cols-7 gap-1 text-center">

                    {[
                      'S',
                      'M',
                      'T',
                      'W',
                      'T',
                      'F',
                      'S',
                    ].map((day, index) => (

                      <span
                        key={`${day}-${index}`}
                        className="py-2 text-[9px] font-medium text-white/25"
                      >
                        {day}
                      </span>

                    ))}

                  </div>


                  {/* Dates */}

                  <div className="mt-1 grid grid-cols-7 gap-y-2 text-center">

                    {[
                      '',
                      '',
                      '',
                      '',
                      '',
                      '1',
                      '2',
                      '3',
                      '4',
                      '5',
                      '6',
                      '7',
                      '8',
                      '9',
                      '10',
                      '11',
                      '12',
                      '13',
                      '14',
                      '15',
                      '16',
                      '17',
                      '18',
                      '19',
                      '20',
                      '21',
                      '22',
                      '23',
                      '24',
                      '25',
                      '26',
                      '27',
                      '28',
                      '29',
                      '30',
                      '31',
                    ].map((date, index) => {

                      const isEvent =
                        date === '20' ||
                        date === '24' ||
                        date === '31'

                      const isToday = date === '14'

                      return (

                        <div
                          key={`${date}-${index}`}
                          className="flex justify-center"
                        >

                          <div
                            className={`
                        relative flex size-8 items-center justify-center
                        rounded-full text-[10px]
                        transition
                        ${isToday
                                ? 'bg-white text-black font-semibold'
                                : isEvent
                                  ? 'bg-white/[0.08] text-white'
                                  : 'text-white/45'
                              }
                      `}
                          >

                            {date}

                            {isEvent && !isToday && (

                              <span className="absolute bottom-1 size-1 rounded-full bg-pink-400" />

                            )}

                          </div>

                        </div>

                      )

                    })}

                  </div>

                </div>


                {/* Calendar footer */}

                <div className="mt-10 flex items-center gap-3 border-t border-white/[0.07] pt-5">

                  <div className="flex -space-x-2">

                    <div className="flex size-7 items-center justify-center rounded-full border-2 border-[#111111] bg-blue-400/20 text-[9px]">
                      F
                    </div>

                    <div className="flex size-7 items-center justify-center rounded-full border-2 border-[#111111] bg-pink-400/20 text-[9px]">
                      Y
                    </div>

                  </div>

                  <p className="text-[10px] text-white/30">
                    4 moments planned this month
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================== */}
            {/* UPCOMING EVENTS */}
            {/* =================================================== */}

            <div className="rounded-[2rem] border border-black/[0.06] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.05)]">


              <div className="rounded-[1.7rem] bg-[#f8f8f7] p-5 md:p-7">


                {/* Header */}

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                      Upcoming moments
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                      Things to look forward to.
                    </h3>

                  </div>


                  <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">

                    <CalendarDays
                      size={16}
                      className="text-neutral-500"
                    />

                  </div>

                </div>


                {/* Events */}

                <div className="mt-8 space-y-2">


                  <PlannerEvent
                    day="20"
                    month="AUG"
                    title="Anniversary Dinner"
                    time="19:00"
                    accent="pink"
                  />


                  <PlannerEvent
                    day="24"
                    month="AUG"
                    title="Movie Night"
                    time="20:00"
                    accent="blue"
                  />


                  <PlannerEvent
                    day="31"
                    month="AUG"
                    title="Weekend Getaway"
                    time="09:00"
                    accent="pink"
                  />


                  <PlannerEvent
                    day="12"
                    month="SEP"
                    title="Our Little Date"
                    time="18:30"
                    accent="blue"
                  />

                </div>


                {/* Bottom */}

                <div className="mt-4 flex items-center justify-between rounded-[1.4rem] bg-white p-4">

                  <div>

                    <p className="text-[10px] text-neutral-400">
                      This month
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      4 moments together
                    </p>

                  </div>


                  <Link
                    href="/register"
                    className="flex size-9 items-center justify-center rounded-full bg-black text-white transition hover:bg-neutral-800"
                  >

                    <ArrowUpRight size={14} />

                  </Link>

                </div>

              </div>

            </div>

          </div>


          {/* ===================================================== */}
          {/* BOTTOM STATEMENT */}
          {/* ===================================================== */}

          <div className="mt-14 flex flex-col gap-4 border-t border-black/[0.06] pt-6 md:flex-row md:items-center md:justify-between">

            <p className="text-xs text-neutral-400">
              Big plans or tiny moments — they all belong here.
            </p>


            <div className="flex items-center gap-2">

              <span className="size-1.5 rounded-full bg-pink-400" />

              <span className="text-xs font-medium text-neutral-400">
                4 moments planned
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="px-6 pb-8 pt-20 md:pt-28">

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[3rem] bg-[#111111] px-6 py-28 text-center text-white md:px-10 md:py-36">


          {/* ===================================================== */}
          {/* AMBIENT */}
          {/* ===================================================== */}

          <div className="pointer-events-none absolute left-1/2 top-[-180px] size-[500px] -translate-x-1/2 rounded-full bg-blue-500/[0.10] blur-[130px]" />

          <div className="pointer-events-none absolute bottom-[-220px] left-[20%] size-[400px] rounded-full bg-pink-500/[0.07] blur-[130px]" />

          <div className="pointer-events-none absolute bottom-[-220px] right-[15%] size-[350px] rounded-full bg-blue-500/[0.06] blur-[120px]" />


          {/* ===================================================== */}
          {/* CONTENT */}
          {/* ===================================================== */}

          <div className="relative">


            {/* Heart */}

            <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">

              <Heart
                size={18}
                fill="currentColor"
                className="text-pink-400"
              />

            </div>


            {/* Eyebrow */}

            <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
              Built for the two of you
            </p>


            {/* Heading */}

            <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.065em] md:text-7xl">

              Your relationship deserves

              <br />

              <span className="text-white/30">
                a place of its own.
              </span>

            </h2>


            {/* Description */}

            <p className="mx-auto mt-8 max-w-lg text-sm leading-6 text-white/40 md:text-base">

              Save together. Make plans.
              Check in. Grow closer.

              <br className="hidden md:block" />

              One quiet space for everything that matters.

            </p>


            {/* CTA */}

            <Link
              href="/register"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black shadow-[0_10px_40px_rgba(255,255,255,0.08)] transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-100"
            >

              Start with Duora

              <span className="flex size-6 items-center justify-center rounded-full bg-black text-white transition duration-300 group-hover:translate-x-0.5">

                <ArrowRight size={12} />

              </span>

            </Link>


            {/* Tiny reassurance */}

            <p className="mt-5 text-[10px] text-white/20">
              Free to start · Built for two
            </p>

          </div>


          {/* ===================================================== */}
          {/* DECORATIVE LINE */}
          {/* ===================================================== */}

          <div className="pointer-events-none absolute bottom-10 left-1/2 hidden w-[70%] -translate-x-1/2 md:block">

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="px-6 pb-10 pt-10">

        <div className="mx-auto max-w-6xl">


          {/* ===================================================== */}
          {/* FOOTER TOP */}
          {/* ===================================================== */}

          <div className="flex flex-col gap-10 border-b border-black/[0.06] pb-10 md:flex-row md:items-start md:justify-between">


            {/* Brand */}

            <div className="max-w-xs">

              <Link
                href="/"
                className="inline-flex items-center gap-2"
              >

                <Image
                  src={duoraLogo}
                  alt="Duora logo"
                  width={28}
                  height={28}
                  className="rounded-full"
                />

                <span className="text-lg font-bold uppercase tracking-[-0.04em]">
                  duora
                </span>

              </Link>


              <p className="mt-4 text-xs leading-5 text-neutral-400">

                A little space for everything
                you build together.

              </p>

            </div>


            {/* Navigation */}

            <div className="grid grid-cols-2 gap-x-16 gap-y-8 text-xs md:grid-cols-3 md:gap-x-20">


              {/* Product */}

              <div>

                <p className="mb-4 font-medium text-neutral-900">
                  Product
                </p>

                <div className="space-y-3">

                  <a
                    href="#features"
                    className="block text-neutral-400 transition hover:text-black"
                  >
                    Features
                  </a>

                  <a
                    href="#how-it-works"
                    className="block text-neutral-400 transition hover:text-black"
                  >
                    Planner
                  </a>

                  <a
                    href="#features"
                    className="block text-neutral-400 transition hover:text-black"
                  >
                    Shared goals
                  </a>

                </div>

              </div>


              {/* Company */}

              <div>

                <p className="mb-4 font-medium text-neutral-900">
                  Duora
                </p>

                <div className="space-y-3">

                  <a
                    href="#together"
                    className="block text-neutral-400 transition hover:text-black"
                  >
                    About
                  </a>

                  <a
                    href="#how-it-works"
                    className="block text-neutral-400 transition hover:text-black"
                  >
                    How it works
                  </a>

                  <Link
                    href="/login"
                    className="block text-neutral-400 transition hover:text-black"
                  >
                    Sign in
                  </Link>

                </div>

              </div>


              {/* Get Started */}

              <div>

                <p className="mb-4 font-medium text-neutral-900">
                  Get started
                </p>

                <div className="space-y-3">

                  <Link
                    href="/register"
                    className="block text-neutral-400 transition hover:text-black"
                  >
                    Create account
                  </Link>

                  <Link
                    href="/login"
                    className="block text-neutral-400 transition hover:text-black"
                  >
                    Sign in
                  </Link>

                </div>

              </div>


            </div>

          </div>


          {/* ===================================================== */}
          {/* FOOTER BOTTOM */}
          {/* ===================================================== */}

          <div className="flex flex-col gap-4 pt-7 text-[10px] text-neutral-400 md:flex-row md:items-center md:justify-between">

            <p>
              © 2026 Duora. All rights reserved.
            </p>


            <div className="flex items-center gap-5">

              <span>
                Made for two.
              </span>

              <span className="text-pink-400">
                ♥
              </span>

            </div>

          </div>

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

function PlannerEvent({
  day,
  month,
  title,
  time,
  accent,
}: {
  day: string
  month: string
  title: string
  time: string
  accent: 'blue' | 'pink'
}) {
  return (
    <div className="group flex items-center gap-4 rounded-[1.4rem] border border-black/[0.04] bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]">

      {/* Date */}

      <div
        className={`
          flex size-12 shrink-0 flex-col items-center justify-center rounded-xl
          ${accent === 'pink'
            ? 'bg-pink-50'
            : 'bg-blue-50'
          }
        `}
      >

        <span className="text-[8px] font-medium text-neutral-400">
          {month}
        </span>

        <span className="text-base font-semibold tracking-[-0.03em]">
          {day}
        </span>

      </div>


      {/* Event */}

      <div className="min-w-0">

        <h4 className="truncate text-sm font-medium tracking-[-0.01em]">
          {title}
        </h4>

        <div className="mt-1 flex items-center gap-1.5">

          <span className="size-1 rounded-full bg-neutral-300" />

          <p className="text-[10px] text-neutral-400">
            {time}
          </p>

        </div>

      </div>


      {/* Arrow */}

      <div className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-300 transition duration-300 group-hover:bg-black group-hover:text-white">

        <ArrowUpRight size={12} />

      </div>

    </div>
  )
}