import Link from 'next/link'
import Image from 'next/image'

import RegisterForm from '@/features/auth/components/register-form'
import duoraLogo from '@/assets/logo-white.png'

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-primary text-secondary">

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

              Make the
              <br />

              <span className="text-[#6b9bc2]">distance</span>

              <br />

              <span className="text-[#6b9bc2]">feel closer.</span>

            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-[#8f8588]">
              Create your private space for two people to stay connected,
              share little moments, and make distance feel closer.
            </p>

            <div className="mt-8 flex items-center gap-3">

              <span className="size-1.5 rounded-full bg-pink-300" />

              <span className="h-px w-10 bg-gradient-to-r from-pink-200 to-blue-200" />

              <span className="size-1.5 rounded-full bg-blue-300" />

            </div>

          </div>

          {/* REGISTER */}
          <div className="w-full max-w-[430px] justify-self-center lg:justify-self-end">

            <div className="mb-8">

              {/* MOBILE LOGO */}
              <div className="flex items-center justify-center lg:hidden">

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
                <span>create your space.</span>
              </h2>

            </div>

            <div className="relative">

              <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-pink-200/20 via-white/5 to-blue-200/20 blur-[60px] lg:-inset-10 lg:from-pink-200/35 lg:via-white/10 lg:to-blue-200/35 opacity-40" />

              <div className="relative">
                <RegisterForm />
              </div>

              <p className="mt-4 text-center text-[12px] leading-5 text-description">
                By continuing, you agree to Duora{' '}
                <Link
                  href="/terms"
                  className="text-neutral-300"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/policy"
                  className="text-neutral-300"
                >
                  Privacy Policy
                </Link>
                . Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-neutral-300 hover:text-blue-500 hover:decoration-blue-400"
                >
                  Sign in
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