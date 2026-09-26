import Link from 'next/link'
import Image from 'next/image'

import LoginForm from '@/features/auth/components/login-form'
import duoraLogo from '@/assets/duora-logo3.png'

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafaf9] text-[#111111]">

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[260px] top-[18%] size-[520px] rounded-full bg-pink-200/20 blur-[150px]" />
        <div className="absolute -right-[260px] bottom-[5%] size-[520px] rounded-full bg-blue-200/20 blur-[150px]" />
        <div className="absolute left-[45%] top-[25%] size-[260px] rounded-full bg-white/70 blur-[120px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 lg:px-10">

        <div className="grid w-full gap-16 lg:grid-cols-[1fr_0.72fr] lg:items-center">

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

            <h1 className="mt-7 max-w-3xl text-[clamp(4rem,6vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
              Keep the
              <br />
              <span className="text-neutral-300">
                distance close.
              </span>
            </h1>

            <p className="mt-8 max-w-md text-sm leading-7 text-neutral-400">
              A private space for two people to stay connected,
              share little moments, and make distance feel closer.
            </p>

          </div>

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

              <h2 className="mt-3 text-center text-3xl font-semibold leading-[0.95] tracking-[-0.065em] md:text-4xl">
                Welcome
                <span className="text-neutral-400">
                  {' '}back.
                </span>
              </h2>

            </div>

            <div className="relative">

              <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-pink-100/30 via-transparent to-blue-100/30 blur-[60px]" />

              <LoginForm />

              <p className="mt-4 text-center text-[12px] leading-5 text-neutral-600">
                By continuing, you agree to Duora{' '}
                <Link
                  href="/terms"
                  className="text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition hover:text-black hover:decoration-black"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/policy"
                  className="text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition hover:text-black hover:decoration-black"
                >
                  Privacy Policy
                </Link>
                . Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-2 transition hover:text-black hover:decoration-black"
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