import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  Plane,
  Sparkles,
  X,
} from 'lucide-react'

import Image from 'next/image'
import heroImage from '@/assets/heo/heroImage2.jpg'
import duoraLogo from '@/assets/duora-logo3.png'

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafaf9] text-[#111111]">

      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <nav className="fixed inset-x-0 top-0 z-50 px-4">
        <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-black/[0.06] bg-white/35 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.035)] backdrop-blur-2xl">

          <Link
            href="/"
            className="flex items-center gap-1.5"
          >
            <Image
              src={duoraLogo}
              alt="Duora logo"
              width={27}
              height={27}
              className="rounded-full"
            />

            <span className="text-lg font-bold uppercase tracking-[-0.05em]">
              duora
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-neutral-500 md:flex">

            <a
              href="#why"
              className="transition hover:text-black"
            >
              Why Duora
            </a>

            <a
              href="#connection"
              className="transition hover:text-black"
            >
              Connection
            </a>

            <a
              href="#moments"
              className="transition hover:text-black"
            >
              Moments
            </a>

            <a
              href="#pricing"
              className="transition hover:text-black"
            >
              Pricing
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

      <section className="relative min-h-screen overflow-hidden px-6 pb-16 pt-35">

        <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl flex-col justify-center">

          <div className="max-w-4xl">

            <h1 className="text-[clamp(3.2rem,8vw,7.2rem)] font-semibold leading-[0.88] tracking-[-0.075em]">

              Love doesn't have
              <br />

              to feel{' '}

              <span className="bg-gradient-to-r from-pink-300 to-neutral-400 bg-clip-text text-transparent">
                far away.
              </span>

            </h1>

          </div>


          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_0.7fr] md:items-end">

            <div>

              <p className="max-w-xl text-base leading-7 text-neutral-500 md:text-lg md:leading-8">
                Duora gives couples living apart one quiet place
                to stay connected, make plans, and have something
                to look forward to together.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/register"
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-neutral-800"
                >
                  Start your LDR

                  <span className="rounded-full bg-white p-1 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight
                      size={13}
                      className="text-black"
                    />
                  </span>
                </Link>

                <a
                  href="#why"
                  className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-neutral-500 transition hover:text-black"
                >
                  Discover Duora
                  <ArrowDownIcon />
                </a>

              </div>

            </div>


            <div className="relative md:pb-1">

              <div className="absolute -left-4 top-1/2 hidden h-px w-10 bg-black/[0.08] md:block" />

              <div className="md:pl-10">

                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  Distance
                </p>

                <p className="mt-2 text-2xl font-medium tracking-[-0.05em]">
                  1,247 km
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
                  <span>Jakarta</span>
                  <span className="h-px w-8 bg-neutral-200" />
                  <span>Bandung</span>
                </div>

              </div>

            </div>

          </div>


          <div className="relative mt-16 overflow-hidden rounded-[2rem] shadow-xl shadow-blue-200/40 md:mt-20 md:rounded-[2.5rem]">

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            <Image
              src={heroImage}
              alt="Long distance couple"
              width={1600}
              height={900}
              priority
              className="h-[420px] w-full object-cover md:h-[560px]"
            />

            <div className="absolute bottom-6 left-6 z-20 max-w-sm text-white md:bottom-10 md:left-10">

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/55">
                Somewhere between here & there
              </p>

              <p className="mt-2 text-xl font-medium tracking-[-0.04em] md:text-2xl">
                The distance is real.
                <br />
                So is what you have.
              </p>

            </div>

            <div className="absolute bottom-6 right-6 z-20 hidden text-right md:bottom-10 md:right-10 md:block">

              <Heart
                size={17}
                fill="currentColor"
                className="ml-auto text-white/80"
              />

              <p className="mt-2 text-[9px] text-white/50">
                Made for two
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* STORY */}
      {/* ========================================================= */}

      <section
        id="why"
        className="relative px-6 py-28 md:py-36"
      >

        <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-pink-200/20 blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-250px] right-[-150px] size-[500px] rounded-full bg-blue-200/20 blur-[150px]" />

        <div className="relative mx-auto max-w-6xl">

          <div className="grid gap-16 md:grid-cols-[0.65fr_1.35fr]">

            <div>

              <div className="sticky top-32">

                <div className="flex items-center gap-3">

                  <div className="size-1.5 rounded-full bg-black" />

                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    Why Duora
                  </p>

                </div>

                <p className="mt-5 text-xs leading-5 text-neutral-400">
                  Built around the moments
                  that make distance easier.
                </p>

              </div>

            </div>


            <div>

              <h2 className="max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.06em] md:text-5xl">

                When you can't share
                the same place, you start
                caring more about the
                <span className="text-neutral-300">
                  {' '}little things.
                </span>

              </h2>


              <div className="mt-12 max-w-2xl space-y-7 text-sm leading-7 text-neutral-500 md:text-base md:leading-8">

                <p>
                  The quick check-in before work.
                  The late night call.
                  Knowing when the next visit is.
                  Having something small to look forward to.
                </p>

                <p>
                  Duora brings those moments together
                  without turning your relationship into
                  another productivity dashboard.
                </p>

              </div>


              <div className="mt-14 border-t border-black/[0.07]">

                <StoryRow
                  number="01"
                  icon={<Plane size={16} />}
                  title="Know when you'll meet again."
                  description="Keep the next visit, countdown, and travel fund in one quiet place."
                />

                <StoryRow
                  number="02"
                  icon={<Heart size={16} />}
                  title="Be part of each other's day."
                  description="A simple space to share how you're feeling and what's happening."
                />

                <StoryRow
                  number="03"
                  icon={<CalendarDays size={16} />}
                  title="Always have something ahead."
                  description="Plan calls, movie nights, birthdays, and little moments together."
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* NEXT VISIT */}
      {/* ========================================================= */}

      <section className="relative px-6 py-28 md:py-36">

        <div className="pointer-events-none absolute left-[-180px] top-[20%] size-[500px] rounded-full bg-blue-200/20 blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[-180px] size-[500px] rounded-full bg-pink-200/25 blur-[150px]" />

        <div className="relative mx-auto max-w-6xl">

          <div className="grid gap-16 md:grid-cols-2 md:items-center">

            <div>

              <div className="flex items-center gap-3">

                <div className="size-1.5 rounded-full bg-blue-400" />

                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                  The next visit
                </p>

              </div>

              <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.065em] md:text-5xl">

                Give the distance
                <span className="text-neutral-300">
                  {' '}an end date.
                </span>

              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-neutral-500 md:text-base md:leading-8">
                Distance feels different when you know
                when it ends. Set the date, watch the countdown,
                and slowly get closer.
              </p>

              <Link
                href="/register"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-medium"
              >
                Plan your next visit

                <span className="flex size-8 items-center justify-center rounded-full border border-black/[0.08] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight size={13} />
                </span>

              </Link>

            </div>


            <div className="relative">

              <div className="pointer-events-none absolute -inset-16 rounded-full bg-gradient-to-br from-blue-200/25 via-transparent to-pink-200/25 blur-[80px]" />

              <div className="relative">

                <div className="flex items-end justify-between border-b border-black/[0.08] pb-5">

                  <div>

                    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                      Finally, together
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                      September 1
                    </h3>

                  </div>

                  <Plane
                    size={18}
                    className="mb-1 text-blue-400"
                  />

                </div>


                <div className="py-10">

                  <div className="flex items-end gap-4">

                    <div>

                      <span className="text-7xl font-semibold tracking-[-0.08em] md:text-8xl">
                        18
                      </span>

                      <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                        days left
                      </p>

                    </div>

                    <span className="mb-10 text-2xl text-neutral-200">
                      /
                    </span>

                    <div className="mb-1">

                      <p className="text-sm font-medium">
                        Jakarta
                      </p>

                      <div className="my-2 h-px w-16 bg-gradient-to-r from-blue-300 to-pink-300" />

                      <p className="text-sm font-medium">
                        Bandung
                      </p>

                    </div>

                  </div>


                  <div className="mt-10">

                    <div className="h-px w-full bg-neutral-200">

                      <div className="relative h-px w-[72%] bg-gradient-to-r from-blue-400 to-pink-400">

                        <div className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-pink-400 ring-4 ring-pink-100/50" />

                      </div>

                    </div>

                    <div className="mt-3 flex justify-between text-[9px] text-neutral-400">

                      <span>July 14</span>
                      <span>72% of the wait is over</span>
                      <span>Sep 1</span>

                    </div>

                  </div>

                </div>


                <div className="grid grid-cols-2 border-t border-black/[0.08] pt-5">

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.15em] text-neutral-400">
                      Visit fund
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      Rp 3.2M saved
                    </p>

                  </div>

                  <div className="border-l border-black/[0.08] pl-5">

                    <p className="text-[9px] uppercase tracking-[0.15em] text-neutral-400">
                      Departure
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      19:00
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* TRANSITION */}
      {/* ========================================================= */}

      <section className="relative h-24">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-200/20 blur-[130px]" />

      </section>


      {/* ========================================================= */}
      {/* DAILY CONNECTION */}
      {/* ========================================================= */}

      <section
        id="connection"
        className="relative px-6 py-28 md:py-36"
      >

        <div className="pointer-events-none absolute left-[-180px] top-[-180px] size-[520px] rounded-full bg-blue-200/20 blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[-180px] size-[520px] rounded-full bg-pink-200/25 blur-[150px]" />

        <div className="relative mx-auto max-w-6xl">

          <div className="grid gap-16 md:grid-cols-[0.7fr_1.3fr]">

            <div>

              <div className="sticky top-32">

                <div className="flex items-center gap-3">

                  <div className="size-1.5 rounded-full bg-pink-400" />

                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    Everyday connection
                  </p>

                </div>

                <p className="mt-6 max-w-xs text-sm leading-6 text-neutral-400">
                  Distance isn't only about the days
                  you spend apart. It's about all the
                  ordinary moments in between.
                </p>

                <div className="mt-12 hidden items-center gap-3 md:flex">

                  <div className="h-px w-8 bg-black/[0.08]" />

                  <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-300">
                    02 / 04
                  </span>

                </div>

              </div>

            </div>


            <div>

              <h2 className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.065em] md:text-6xl">

                Know their day.
                <br />

                <span className="text-neutral-300">
                  Feel a little closer.
                </span>

              </h2>

              <p className="mt-7 max-w-xl text-sm leading-7 text-neutral-500 md:text-base md:leading-8">
                A quick check-in can say more than a long conversation.
                Duora gives both of you a simple way to share what's
                going on — without needing to always find the right words.
              </p>


              <div className="relative mt-14 rounded-[2rem] border border-black/[0.06] bg-white">

                <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-pink-100/60 blur-[90px]" />

                <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-blue-100/60 blur-[90px]" />

                <div className="relative p-6 md:p-8">

                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-5">

                    <div>

                      <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                        Thursday
                      </p>

                      <p className="mt-2 text-xl font-medium tracking-[-0.03em]">
                        Feeling good today.
                      </p>

                    </div>

                    <span className="text-[9px] text-neutral-300">
                      12 min ago
                    </span>

                  </div>


                  <div className="py-10">

                    <div className="flex h-28 items-end gap-1.5 md:h-36">

                      {[3, 5, 4, 6, 7, 6, 8, 8, 7, 9, 8, 9].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-full bg-gradient-to-t from-blue-200 via-purple-200 to-pink-300"
                            style={{
                              height: `${height * 8}px`,
                              opacity: 0.35 + index * 0.035,
                            }}
                          />
                        ),
                      )}

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-[9px] uppercase tracking-[0.16em] text-neutral-300">
                        Morning
                      </span>

                      <span className="text-[9px] uppercase tracking-[0.16em] text-neutral-300">
                        Evening
                      </span>

                    </div>

                  </div>


                  <div className="grid border-t border-black/[0.06] md:grid-cols-2">

                    <div className="py-7 md:pr-8">

                      <div className="flex items-center justify-between">

                        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                          Made their day
                        </p>

                        <Heart
                          size={14}
                          className="text-pink-400"
                          fill="currentColor"
                        />

                      </div>

                      <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-600">
                        You called me before going to sleep.
                      </p>

                      <p className="mt-3 text-[9px] text-neutral-300">
                        A small moment that stayed.
                      </p>

                    </div>


                    <div className="border-t border-black/[0.06] py-7 md:border-l md:border-t-0 md:pl-8">

                      <div className="flex items-center justify-between">

                        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                          From them
                        </p>

                        <MessageIcon />

                      </div>

                      <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-600">
                        Can we talk for a little while tonight?
                      </p>

                      <p className="mt-3 text-[9px] text-neutral-300">
                        Waiting for your reply.
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              <div className="mt-14 flex flex-col gap-6 border-t border-black/[0.07] pt-7 sm:flex-row sm:items-center sm:justify-between">

                <p className="max-w-md text-sm leading-6 text-neutral-400">
                  Not every connection needs a conversation.
                  Sometimes knowing how they feel is enough.
                </p>

                <div className="flex shrink-0 items-center gap-3">

                  <div className="flex -space-x-2">

                    <div className="flex size-9 items-center justify-center rounded-full border-2 border-[#fafaf9] bg-blue-100 text-[9px] font-medium text-neutral-600">
                      F
                    </div>

                    <div className="flex size-9 items-center justify-center rounded-full border-2 border-[#fafaf9] bg-pink-100 text-[9px] font-medium text-neutral-600">
                      Y
                    </div>

                  </div>

                  <div>

                    <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-neutral-400">
                      Connected
                    </p>

                    <p className="mt-1 text-[10px] text-neutral-300">
                      Two people. One private space.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* MOMENTS */}
      {/* ========================================================= */}

      <section
        id="moments"
        className="relative px-6 py-28 md:py-36"
      >

        <div className="pointer-events-none absolute left-1/2 top-[-200px] size-[600px] -translate-x-1/2 rounded-full bg-pink-200/20 blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-180px] left-[-120px] size-[450px] rounded-full bg-blue-200/20 blur-[140px]" />

        <div className="relative mx-auto max-w-6xl">

          <div className="grid gap-14 md:grid-cols-[0.75fr_1.25fr]">

            <div>

              <div className="flex items-center gap-3">

                <div className="size-1.5 rounded-full bg-pink-400" />

                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Shared moments
                </p>

              </div>

              <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.065em] md:text-5xl">

                Make plans
                <br />

                <span className="text-neutral-300">
                  worth waiting for.
                </span>

              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-neutral-500">
                Movie nights. Long calls. Birthdays.
                Your next dinner together.
                Keep the little plans alive until they happen.
              </p>

            </div>


            <div className="relative">

              <div className="absolute bottom-3 left-[19px] top-3 w-px bg-gradient-to-b from-pink-200 via-neutral-200 to-blue-200" />

              <MomentItem
                date="20"
                month="AUG"
                title="Movie night"
                time="20:00"
                description="A quiet night together, even from different cities."
                icon={<Clock3 size={14} />}
              />

              <MomentItem
                date="24"
                month="AUG"
                title="Late night call"
                time="22:00"
                description="No agenda. Just time for the two of you."
                icon={<Heart size={14} />}
              />

              <MomentItem
                date="31"
                month="AUG"
                title="Virtual dinner"
                time="19:00"
                description="Same dinner, different table."
                icon={<CalendarDays size={14} />}
              />

              <MomentItem
                date="01"
                month="SEP"
                title="Finally together"
                time="19:00"
                description="The moment you've been counting down to."
                icon={<Plane size={14} />}
                active
              />

            </div>

          </div>


          <div className="mt-28 border-t border-black/[0.07] pt-8">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <p className="max-w-md text-sm leading-6 text-neutral-400">
                Because being apart shouldn't mean
                living completely separate lives.
              </p>

              <div className="flex items-center gap-3">

                <div className="flex -space-x-2">

                  <div className="flex size-8 items-center justify-center rounded-full border-2 border-[#fafaf9] bg-blue-100 text-[9px]">
                    F
                  </div>

                  <div className="flex size-8 items-center justify-center rounded-full border-2 border-[#fafaf9] bg-pink-100 text-[9px]">
                    Y
                  </div>

                </div>

                <span className="text-[10px] text-neutral-400">
                  Two people. One private space.
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* PRICING */}
      {/* ========================================================= */}

      <section
        id="pricing"
        className="relative overflow-hidden px-6 py-28 md:py-36"
      >

        {/* soft atmosphere */}

        <div className="pointer-events-none absolute left-1/2 top-[-180px] size-[550px] -translate-x-1/2 rounded-full bg-pink-200/20 blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-220px] right-[-150px] size-[500px] rounded-full bg-blue-200/20 blur-[150px]" />

        <div className="relative mx-auto max-w-6xl">

          {/* section heading */}

          <div className="grid gap-10 md:grid-cols-[0.65fr_1.35fr]">

            <div>

              <div className="sticky top-32">

                <div className="flex items-center gap-3">

                  <div className="size-1.5 rounded-full bg-pink-400" />

                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    Simple pricing
                  </p>

                </div>

                <p className="mt-5 max-w-xs text-xs leading-5 text-neutral-400">
                  Start with the essentials.
                  Upgrade when you want more
                  ways to make your distance feel closer.
                </p>

              </div>

            </div>


            <div>

              <h2 className="max-w-3xl text-4xl font-semibold leading-[0.96] tracking-[-0.065em] md:text-6xl">

                Keep the important
                <br />

                <span className="text-neutral-300">
                  things between you.
                </span>

              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-500 md:text-base md:leading-8">
                Duora stays free for the things you need every day.
                When you want more room for your shared memories,
                plans, and conversations, Duora+ gives you more.
              </p>

            </div>

          </div>


          {/* pricing cards */}

          <div className="mt-16 grid gap-5 lg:grid-cols-2">

            {/* FREE */}

            <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.07] bg-white">

              <div className="p-7 md:p-9">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                      Free
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
                      Start together
                    </h3>

                  </div>

                  <div className="flex size-9 items-center justify-center rounded-full border border-black/[0.06] bg-[#fafaf9]">
                    <Heart
                      size={15}
                      className="text-neutral-400"
                    />
                  </div>

                </div>


                <div className="mt-9">

                  <div className="flex items-end gap-2">

                    <span className="text-4xl font-semibold tracking-[-0.06em]">
                      Rp 0
                    </span>

                    <span className="mb-1 text-xs text-neutral-400">
                      / month
                    </span>

                  </div>

                  <p className="mt-2 text-xs text-neutral-400">
                    Everything you need to begin your LDR.
                  </p>

                </div>


                <Link
                  href="/register"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-[#fafaf9] px-5 py-3 text-sm font-medium transition hover:border-black/15 hover:bg-white"
                >
                  Get started

                  <ArrowRight size={14} />
                </Link>

              </div>


              <div className="border-t border-black/[0.06] px-7 py-7 md:px-9">

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  Included
                </p>

                <div className="mt-5 space-y-4">

                  <PricingFeature
                    label="Couple Goals"
                  />

                  <PricingFeature
                    label="Notes"
                  />

                  <PricingFeature
                    label="Planner"
                  />

                  <PricingFeature
                    label="Daily Check-in Mood"
                    detail="3× / day"
                  />

                  <PricingFeature
                    label="AI Debates"
                    detail="3 messages"
                  />

                  <PricingFeature
                    label="LDR Wrapped"
                    detail="Default template"
                  />

                  <PricingFeature
                    label="Meeting Countdown"
                    detail="1 countdown"
                  />

                </div>

              </div>

            </div>


            {/* PREMIUM */}

            <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.08] bg-[#171717] text-white shadow-[0_25px_80px_rgba(0,0,0,0.10)]">

              {/* subtle glow */}

              <div className="pointer-events-none absolute right-[-120px] top-[-140px] size-[380px] rounded-full bg-pink-400/15 blur-[110px]" />

              <div className="pointer-events-none absolute bottom-[-160px] left-[-100px] size-[350px] rounded-full bg-blue-400/10 blur-[100px]" />


              <div className="relative p-7 md:p-9">

                <div className="flex items-start justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/45">
                        Duora+
                      </p>

                      <span className="rounded-full border border-pink-300/20 bg-pink-300/10 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.12em] text-pink-200">
                        More together
                      </span>

                    </div>

                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
                      Make more memories
                    </h3>

                  </div>

                  <div className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                    <Sparkles
                      size={15}
                      className="text-pink-200"
                    />
                  </div>

                </div>


                <div className="mt-9">

                  <div className="flex items-end gap-3">

                    <span className="text-4xl font-semibold tracking-[-0.06em]">
                      Rp 25.999
                    </span>

                    <span className="mb-1 text-xs text-white/35">
                      / month
                    </span>

                  </div>

                  <div className="mt-2 flex items-center gap-2">

                    <span className="text-xs text-white/30 line-through">
                      Rp 50.000
                    </span>

                    <span className="rounded-full bg-pink-300/10 px-2 py-1 text-[8px] font-medium text-pink-200">
                      Intro price
                    </span>

                  </div>

                </div>


                <Link
                  href="/register"
                  className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-neutral-100"
                >
                  Get Duora+

                  <span className="flex size-5 items-center justify-center rounded-full bg-black text-white transition group-hover:translate-x-0.5">
                    <ArrowRight size={11} />
                  </span>
                </Link>

              </div>


              <div className="relative border-t border-white/[0.08] px-7 py-7 md:px-9">

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Everything in Free, plus
                </p>

                <div className="mt-5 space-y-4">

                  <PricingFeature
                    dark
                    label="Couple Goals"
                  />

                  <PricingFeature
                    dark
                    label="Notes"
                  />

                  <PricingFeature
                    dark
                    label="Planner"
                  />

                  <PricingFeature
                    dark
                    label="Daily Check-in Mood"
                    detail="Unlimited"
                    highlighted
                  />

                  <PricingFeature
                    dark
                    label="AI Debates"
                    detail="15 messages"
                    highlighted
                  />

                  <PricingFeature
                    dark
                    label="LDR Wrapped"
                    detail="Custom templates"
                    highlighted
                  />

                  <PricingFeature
                    dark
                    label="Meeting Countdown"
                    detail="Unlimited"
                    highlighted
                  />

                </div>

              </div>

            </div>

          </div>


          {/* pricing note */}

          <div className="mt-8 flex flex-col gap-3 border-t border-black/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">

            <p className="max-w-xl text-[10px] leading-5 text-neutral-400">
              Free gives you the core Duora experience.
              Duora+ expands the limits for couples who want more.
            </p>

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-neutral-300">

              <span className="size-1 rounded-full bg-pink-300" />

              Private for two

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FINAL CTA — ENVELOPE */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden px-6 pb-8 pt-12 md:pt-20">

        <div className="relative mx-auto max-w-6xl">

          <div className="relative overflow-hidden rounded-[2.5rem] border border-black/[0.07] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.06)]">

            <div className="pointer-events-none absolute left-1/2 top-[-240px] size-[600px] -translate-x-1/2 rounded-full bg-pink-100/50 blur-[140px]" />

            <div className="pointer-events-none absolute bottom-[-250px] left-[10%] size-[450px] rounded-full bg-blue-100/50 blur-[140px]" />


            <div className="pointer-events-none absolute inset-x-0 top-0 h-[180px] overflow-hidden md:h-[220px]">

              <div className="absolute left-1/2 top-[-125px] size-[350px] -translate-x-1/2 rotate-45 border-b border-r border-black/[0.06] bg-[#fafaf9] md:top-[-155px] md:size-[430px]" />

            </div>


            <div className="relative z-10 px-6 py-24 text-center md:px-10 md:py-32">

              <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-black/[0.07] bg-[#fafaf9]">

                <Heart
                  size={17}
                  fill="currentColor"
                  className="text-pink-400"
                />

              </div>

              <p className="mt-7 text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                For couples living apart
              </p>

              <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-[-0.065em] md:text-6xl">

                The miles are there.
                <br />

                <span className="text-neutral-300">
                  So is your love.
                </span>

              </h2>

              <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-neutral-400">
                Keep your days connected.
                Plan what comes next.
                Make the distance feel a little smaller.
              </p>

              <Link
                href="/register"
                className="group mt-9 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                Start your LDR with Duora

                <span className="flex size-6 items-center justify-center rounded-full bg-white text-black transition group-hover:translate-x-0.5">
                  <ArrowRight size={12} />
                </span>

              </Link>

              <p className="mt-5 text-[9px] text-neutral-300">
                Free to start · Private for two · Built for long distance
              </p>

            </div>


            <div className="pointer-events-none absolute bottom-[-115px] left-1/2 size-[320px] -translate-x-1/2 rotate-45 border-l border-t border-black/[0.06] bg-[#fafaf9] md:bottom-[-145px] md:size-[400px]" />

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="px-6 pb-8 pt-12">

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col gap-10 border-b border-black/[0.06] pb-10 md:flex-row md:items-start md:justify-between">

            <div className="max-w-xs">

              <Link
                href="/"
                className="inline-flex items-center gap-1.5"
              >

                <Image
                  src={duoraLogo}
                  alt="Duora logo"
                  width={27}
                  height={27}
                  className="rounded-full"
                />

                <span className="text-lg font-bold uppercase tracking-[-0.05em]">
                  duora
                </span>

              </Link>

              <p className="mt-4 text-xs leading-5 text-neutral-400">
                A private space for couples
                loving from a distance.
              </p>

            </div>


            <div className="grid grid-cols-3 gap-x-10 text-xs md:gap-x-20">

              <FooterColumn
                title="Product"
                links={[
                  ['Why Duora', '#why'],
                  ['Connection', '#connection'],
                  ['Moments', '#moments'],
                  ['Pricing', '#pricing'],
                ]}
              />

              <FooterColumn
                title="Duora"
                links={[
                  ['Stay connected', '#connection'],
                  ['Next visit', '#moments'],
                  ['Pricing', '#pricing'],
                  ['Sign in', '/login'],
                ]}
              />

              <FooterColumn
                title="Get started"
                links={[
                  ['Create account', '/register'],
                  ['Sign in', '/login'],
                ]}
              />

            </div>

          </div>


          <div className="flex flex-col gap-3 pt-6 text-[9px] text-neutral-400 md:flex-row md:items-center md:justify-between">

            <p>
              © 2026 Duora. All rights reserved.
            </p>

            <div className="flex items-center gap-4">

              <span>
                Made for the miles between you.
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
/* PRICING FEATURE */
/* ============================================================= */

function PricingFeature({
  label,
  detail,
  dark = false,
  highlighted = false,
}: {
  label: string
  detail?: string
  dark?: boolean
  highlighted?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="flex min-w-0 items-center gap-3">

        <div
          className={`flex size-5 shrink-0 items-center justify-center rounded-full ${dark
            ? highlighted
              ? 'bg-pink-300/10 text-pink-200'
              : 'bg-white/[0.07] text-white/70'
            : 'bg-[#fafaf9] text-neutral-500'
            }`}
        >
          <Check size={11} strokeWidth={1.8} />
        </div>

        <span
          className={`text-xs ${dark
            ? highlighted
              ? 'text-white'
              : 'text-white/75'
            : 'text-neutral-600'
            }`}
        >
          {label}
        </span>

      </div>


      {detail && (
        <span
          className={`shrink-0 text-[9px] ${dark
            ? highlighted
              ? 'text-pink-200/80'
              : 'text-white/35'
            : 'text-neutral-400'
            }`}
        >
          {detail}
        </span>
      )}

    </div>
  )
}


/* ============================================================= */
/* STORY ROW */
/* ============================================================= */

function StoryRow({
  number,
  icon,
  title,
  description,
}: {
  number: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group flex gap-5 border-b border-black/[0.07] py-7">

      <span className="pt-1 text-[9px] text-neutral-300">
        {number}
      </span>

      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white text-neutral-500 transition group-hover:border-pink-200 group-hover:text-pink-400">
        {icon}
      </div>

      <div className="max-w-lg">

        <h3 className="text-sm font-medium tracking-[-0.02em]">
          {title}
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-neutral-400">
          {description}
        </p>

      </div>

    </div>
  )
}


/* ============================================================= */
/* MOMENT ITEM */
/* ============================================================= */

function MomentItem({
  date,
  month,
  title,
  time,
  description,
  icon,
  active = false,
}: {
  date: string
  month: string
  title: string
  time: string
  description: string
  icon: React.ReactNode
  active?: boolean
}) {
  return (
    <div className="group relative flex gap-7 pb-9 last:pb-0">

      <div
        className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border ${active
          ? 'border-pink-200 bg-pink-50 text-pink-400'
          : 'border-black/[0.07] bg-[#fafaf9] text-neutral-400'
          }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1 border-b border-black/[0.06] pb-8 last:border-0">

        <div className="flex items-start justify-between gap-5">

          <div>

            <div className="flex items-center gap-2">

              <span className="text-[9px] font-medium tracking-[0.15em] text-neutral-400">
                {month}
              </span>

              <span className="text-sm font-semibold">
                {date}
              </span>

            </div>

            <h3 className="mt-2 text-base font-medium tracking-[-0.03em]">
              {title}
            </h3>

            <p className="mt-1.5 max-w-md text-xs leading-5 text-neutral-400">
              {description}
            </p>

          </div>

          <span className="shrink-0 pt-1 text-[9px] text-neutral-400">
            {time}
          </span>

        </div>

      </div>

    </div>
  )
}


/* ============================================================= */
/* FOOTER COLUMN */
/* ============================================================= */

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: [string, string][]
}) {
  return (
    <div>

      <p className="mb-4 font-medium text-neutral-900">
        {title}
      </p>

      <div className="space-y-2.5">

        {links.map(([label, href]) => {

          if (href.startsWith('#')) {
            return (
              <a
                key={label}
                href={href}
                className="block text-neutral-400 transition hover:text-black"
              >
                {label}
              </a>
            )
          }

          return (
            <Link
              key={label}
              href={href}
              className="block text-neutral-400 transition hover:text-black"
            >
              {label}
            </Link>
          )
        })}

      </div>

    </div>
  )
}


/* ============================================================= */
/* SMALL ICONS */
/* ============================================================= */

function ArrowDownIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 2.5V10.5M6.5 10.5L3.5 7.5M6.5 10.5L9.5 7.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}


function MessageIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 3.25C2.5 2.836 2.836 2.5 3.25 2.5H9.75C10.164 2.5 10.5 2.836 10.5 3.25V8.25C10.5 8.664 10.164 9 9.75 9H6L3.5 10.5V9H3.25C2.836 9 2.5 8.664 2.5 8.25V3.25Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}