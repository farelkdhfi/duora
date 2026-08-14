import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Heart,
  Sparkles,
} from 'lucide-react'

import LoginForm from '@/features/auth/components/login-form'
import duoraLogo from '@/assets/duora-logo3.png'

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa] text-[#111111]">


      {/* ========================================================= */}
      {/* AMBIENT BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Blue */}

        <div className="absolute -left-[180px] top-[10%] size-[500px] rounded-full bg-blue-300/[0.13] blur-[150px]" />


        {/* Pink */}

        <div className="absolute -right-[180px] bottom-[5%] size-[500px] rounded-full bg-pink-300/[0.12] blur-[150px]" />


        {/* Center */}

        <div className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[120px]" />

      </div>


      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <nav className="relative z-20 px-6 py-5">

        <div className="mx-auto flex max-w-7xl items-center justify-between">


          {/* Logo */}

          <Link
            href="/"
            className="group flex items-center gap-2"
          >

            <Image
              src={duoraLogo}
              alt="Duora"
              width={30}
              height={30}
              className="rounded-full"
            />

            <span className="text-lg font-bold uppercase tracking-[-0.05em]">
              duora
            </span>

          </Link>


          {/* Back */}

          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-medium text-neutral-400 transition hover:text-black"
          >

            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to website

          </Link>

        </div>

      </nav>


      {/* ========================================================= */}
      {/* MAIN */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center px-6 pb-16 pt-8">


        <div className="grid w-full items-center gap-20 lg:grid-cols-[1fr_460px]">


          {/* ===================================================== */}
          {/* LEFT */}
          {/* ===================================================== */}

          <div className="hidden lg:block">


            {/* Eyebrow */}

            <div className="flex items-center gap-3">

              <div className="flex size-8 items-center justify-center rounded-full border border-black/[0.06] bg-white/70 shadow-sm">

                <Sparkles
                  size={13}
                  className="text-blue-500"
                />

              </div>

              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                A space made for two
              </p>

            </div>


            {/* Heading */}

            <h1 className="mt-8 max-w-3xl text-6xl font-semibold leading-[0.92] tracking-[-0.075em] xl:text-7xl">

              Everything you

              <br />

              <span className="text-neutral-300">
                build together.
              </span>

            </h1>


            {/* Description */}

            <p className="mt-8 max-w-lg text-base leading-7 text-neutral-500">

              Your goals, plans, savings, and little
              everyday moments — all in one quiet
              space made for your relationship.

            </p>


            {/* Minimal visual */}

            <div className="relative mt-14 max-w-lg">


              {/* Glow */}

              <div className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-r from-blue-200/20 via-transparent to-pink-200/20 blur-[70px]" />


              <div className="relative flex items-center gap-5">


                {/* Avatars */}

                <div className="flex -space-x-3">

                  <div className="flex size-12 items-center justify-center rounded-full border-[3px] border-[#fafafa] bg-blue-100 text-xs font-medium text-blue-600 shadow-sm">
                    F
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-full border-[3px] border-[#fafafa] bg-pink-100 text-xs font-medium text-pink-600 shadow-sm">
                    Y
                  </div>

                </div>


                {/* Connection */}

                <div className="h-px w-12 bg-gradient-to-r from-blue-200 to-pink-200" />


                {/* Heart */}

                <div className="flex size-10 items-center justify-center rounded-full border border-black/[0.05] bg-white shadow-sm">

                  <Heart
                    size={15}
                    fill="currentColor"
                    className="text-pink-400"
                  />

                </div>


                <div>

                  <p className="text-xs font-medium">
                    Growing together
                  </p>

                  <p className="mt-1 text-[10px] text-neutral-400">
                    One day at a time.
                  </p>

                </div>

              </div>

            </div>


            {/* Bottom quote */}

            <div className="mt-16 border-l border-black/[0.08] pl-5">

              <p className="max-w-md text-xs leading-6 text-neutral-400">

                “The best relationships are built
                from the little things you choose
                to remember.”

              </p>

            </div>


          </div>


          {/* ===================================================== */}
          {/* RIGHT — LOGIN */}
          {/* ===================================================== */}

          <div className="w-full max-w-[420px] justify-self-center lg:justify-self-end">


            {/* ================================================= */}
            {/* MOBILE BRAND */}
            {/* ================================================= */}

            <div className="mb-10 text-center lg:hidden">

              <Image
                src={duoraLogo}
                alt="Duora"
                width={48}
                height={48}
                className="mx-auto rounded-[1rem]"
              />

              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                A space made for two
              </p>

            </div>


            {/* ================================================= */}
            {/* HEADING */}
            {/* ================================================= */}

            <div className="mb-7">


              <h2 className="text-4xl font-semibold tracking-[-0.06em]">
                Welcome back.
              </h2>


              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Sign in and continue where
                you left off.
              </p>

            </div>


            {/* ================================================= */}
            {/* LOGIN CARD */}
            {/* ================================================= */}

            <div className="relative">


              {/* Glow */}

              <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-blue-200/20 via-transparent to-pink-200/20 blur-3xl" />


              {/* Card */}

              <div className="relative rounded-[2rem] border border-black/[0.06] bg-white/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.07)] backdrop-blur-xl sm:p-8">

                <LoginForm />

              </div>

            </div>


            {/* ================================================= */}
            {/* REGISTER */}
            {/* ================================================= */}

            <p className="mt-7 text-center text-xs text-neutral-400">

              Don't have an account?

              {' '}

              <Link
                href="/register"
                className="font-medium text-black transition hover:text-blue-500"
              >
                Create one
              </Link>

            </p>


            {/* ================================================= */}
            {/* TRUST */}
            {/* ================================================= */}

            <div className="mt-8 flex items-center justify-center gap-3 text-[10px] text-neutral-300">

              <span className="flex items-center gap-1.5">

                <span className="size-1.5 rounded-full bg-emerald-400/60" />

                Secure sign in

              </span>

              <span>
                ·
              </span>

              <span>
                Built for two
              </span>

            </div>


          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* DECORATIVE DOTS */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute left-[7%] top-[45%] size-1.5 rounded-full bg-blue-400/40" />

      <div className="pointer-events-none absolute right-[8%] top-[28%] size-1.5 rounded-full bg-pink-400/40" />

    </main>
  )
}