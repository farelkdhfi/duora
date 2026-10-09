'use client'

import Image from 'next/image'
import Link from 'next/link'
import duoraLogo from '@/assets/logo.png'
import heroImage from '@/assets/hero/hero1.png'

export default function LandingPage() {
  return (
    <main className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-white text-black">
      {/* Main mobile layout */}
      <section className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5 sm:px-8">
        {/* Logo */}
        <header className="flex shrink-0 items-center justify-center pt-5 sm:pt-12">
          <Link
            href="/"
            aria-label="Duora home"
            className="flex items-center"
          >
            <Image
              src={duoraLogo}
              alt=""
              width={28}
              height={28}
              priority
              className="h-7 w-7 object-contain"
            />

            <span className="text-[20px] font-bold tracking-tight text-[#999999]">
              DUORA
            </span>
          </Link>
        </header>

        {/* Hero illustration — full bleed */}
        <div className="relative -mx-5 flex min-h-[330px] flex-1 items-center justify-center pt-5 sm:-mx-8 sm:min-h-[380px]">
          <Image
            src={heroImage}
            alt="Two fluffy cat characters staying connected through Duora"
            priority
            sizes="100vw"
            className="h-full max-h-[440px] w-full object-contain object-center"
          />
        </div>

        {/* Headline and description */}
        <div className="flex shrink-0 flex-col items-center text-center mt-5">
          <h1 className="text-[36px] font-semibold leading-[0.94] tracking-[-1.3px]">
            Love
            <br />
            lives <span className="text-[#AD72C0]">here.</span>
          </h1>

          <p className="mt-4 max-w-[320px] text-[14px] font-normal leading-[15px] text-[#666666]">
            A quiet place for two people to stay
            <br className="hidden min-[360px]:block" />
            close, even when distance puts
            <br />
            them in different places.
          </p>
        </div>

        {/* Onboarding indicator */}
        <div
          className="mt-5 flex shrink-0 items-center justify-center gap-1.5"
          aria-label="Page 1 of 2"
        >
          <span
            className="h-[8px] w-[8px] rounded-full bg-black"
            aria-current="step"
          />
          <span className="h-[8px] w-[8px] rounded-full bg-[#A6A6A6]" />
        </div>

        {/* Primary action */}
        <footer className="mt-5 shrink-0 pb-[max(28px,env(safe-area-inset-bottom))]">
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-full bg-neutral-800 px-6 text-[14px] font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
          >
            Start your LDR
          </Link>
        </footer>
      </section>
    </main>
  )
}