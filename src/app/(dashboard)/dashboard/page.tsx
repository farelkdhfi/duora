'use client'

import {
  CalendarDays,
  CheckCircle2,
  Heart,
  Sparkles,
} from 'lucide-react'

import {
  useMyRelationship,
  useMyRelationshipDetails,
} from '@/features/relationship/queries'

import RelationshipOnboarding from '@/features/relationship/components/relationship-onboarding'
import RelationshipCard from '@/features/dashboard/components/relationship-card'
import PlannerSummaryCard from '@/features/dashboard/components/planner-summary-card'
import PartnerCheckinCard from '@/features/dashboard/components/partner-checkin-card'
import GoalListSummary from '@/features/dashboard/components/goal-list-summary'
import { usePlannerEvents } from '@/features/planner/queries'
import {
  useCheckinHistory,
  useGetPartnerName,
} from '@/features/checkins/queries'
import { useGetMyProfile } from '@/features/profiles/queries'


export default function DashboardPage() {

  const {
    data,
    isLoading,
  } = useMyRelationshipDetails()


  const {
    data: user,
  } = useGetMyProfile()


  const {
    data: partner,
  } = useGetPartnerName()

  console.log(data);


  const {
    data: relationship,
    error: relationshipError,
    isLoading: relationshipLoading,
  } = useMyRelationship()


  const relationshipId =
    data?.relationship?.id


  const {
    data: events,
  } = usePlannerEvents(
    relationshipId ?? '',
  )


  const {
    data: checkins,
  } = useCheckinHistory(
    relationshipId ?? '',
  )


  /* ========================================================= */
  /* DERIVED DATA */
  /* ========================================================= */

  const partnerCheckin =
    checkins?.find(
      (checkin) =>
        checkin.user_id !== user?.id,
    ) ?? null


  const upcomingEvent =
    events?.find(
      (event) =>
        event.event_date >=
        new Date()
          .toISOString()
          .slice(0, 10),
    )


  const yourCheckin =
    checkins?.find(
      (checkin) =>
        checkin.user_id === user?.id,
    )


  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (
    isLoading ||
    relationshipLoading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">

            <Heart
              size={17}
              className="animate-pulse text-pink-500"
              fill="currentColor"
            />

          </div>

          <p className="text-sm text-neutral-400">
            Loading your space...
          </p>

        </div>

      </main>
    )
  }


  /* ========================================================= */
  /* ERROR */
  /* ========================================================= */

  if (relationshipError) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">

        <div className="max-w-md rounded-3xl border border-rose-100 bg-rose-50/60 p-6 text-center">

          <p className="text-sm font-medium text-rose-600">
            {relationshipError.message}
          </p>

        </div>

      </main>
    )
  }


  /* ========================================================= */
  /* NO RELATIONSHIP */
  /* ========================================================= */

  if (!relationshipId) {
    return (
      <main className="relative min-h-screen overflow-hidden px-6 py-10">

        {/* Ambient */}

        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />


        <div className="relative mx-auto max-w-5xl">

          <DashboardGreeting
            name={
              data?.user?.display_name ??
              'there'
            }
          />


          <div className="mt-10 overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/80 shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl">

            <div className="grid md:grid-cols-[1fr_0.8fr]">

              {/* Left */}

              <div className="p-8 sm:p-10">

                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">

                  <Heart
                    size={21}
                    className="text-pink-500"
                    fill="currentColor"
                  />

                </div>


                <h2 className="text-2xl font-semibold tracking-[-0.04em]">

                  Connect with
                  your partner.

                </h2>


                <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">

                  Duora works best when the two
                  of you are connected. Create or
                  join a relationship to start
                  building your space together.

                </p>


                <div className="mt-7">

                  <RelationshipOnboarding />

                </div>

              </div>


              {/* Right */}

              <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-50/70 via-white to-pink-50/70 md:block">

                <div className="absolute -right-20 -top-20 size-60 rounded-full bg-blue-200/30 blur-3xl" />

                <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-pink-200/30 blur-3xl" />


                <div className="relative flex h-full items-center justify-center p-10">

                  <div className="text-center">

                    <div className="mx-auto flex size-20 items-center justify-center rounded-[2rem] border border-white bg-white/70 shadow-sm backdrop-blur">

                      <Heart
                        size={28}
                        className="text-pink-400"
                        fill="currentColor"
                      />

                    </div>


                    <p className="mt-6 text-sm font-medium">
                      A space made for two.
                    </p>

                    <p className="mt-2 max-w-[220px] text-xs leading-5 text-neutral-400">
                      Save, plan, and understand
                      each other a little better.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>
    )
  }


  /* ========================================================= */
  /* DASHBOARD */
  /* ========================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto">

        {/* =================================================== */}
        {/* HEADER */}
        {/* =================================================== */}

        <DashboardGreeting
          name={
            user?.display_name ??
            'there'
          }
        />

        {/* =================================================== */}
        {/* RELATIONSHIP */}
        {/* =================================================== */}

        <section className="mt-8">

          <RelationshipCard
            userName={user?.display_name ?? 'You'}
            partnerName={partner?.display_name ?? 'Partner'}
            userAvatarUrl={user?.avatar_url}
            partnerAvatarUrl={partner?.avatar_url}
            connectedAt={data?.relationship?.started_at}
          />

        </section>


        {/* =================================================== */}
        {/* MAIN CARDS */}
        {/* =================================================== */}

        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                Your space
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                Growing together
              </h2>

            </div>


            <Sparkles
              size={18}
              className="text-blue-300"
            />

          </div>


          <div className="grid gap-5 md:grid-cols-2">


            {/* Partner check-in */}

            <PartnerCheckinCard
              checkin={partnerCheckin}
              partnerName={
                partner?.display_name ??
                'Your partner'
              }
            />


            {/* Goals */}

            <GoalListSummary
              relationshipId={
                relationshipId
              }
            />


            {/* Planner */}

            {upcomingEvent ? (

              <PlannerSummaryCard
                title={upcomingEvent.title}
                date={upcomingEvent.event_date}
                startTime={upcomingEvent.start_time}
                description={
                  upcomingEvent.description
                }
              />

            ) : (

              <EmptyPlannerCard />

            )}


            {/* Your check-in */}

            <YourCheckinCard
              hasCheckedIn={!!yourCheckin}
            />

          </div>

        </section>


        {/* =================================================== */}
        {/* TODAY */}
        {/* =================================================== */}

        <section className="mt-10">

          <div className="mb-4">

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
              Today
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em]">
              Little things matter.
            </h2>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* Relationship message */}

            <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl">

              <div className="absolute -right-10 -top-10 size-28 rounded-full bg-pink-100/60 blur-2xl" />


              <div className="relative">

                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50">

                  <Heart
                    size={16}
                    className="text-pink-500"
                    fill="currentColor"
                  />

                </div>


                <p className="mt-5 text-sm font-medium">
                  Keep choosing each other.
                </p>


                <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">

                  Small moments every day
                  make a stronger relationship.

                </p>

              </div>

            </div>


            {/* Quick stats */}

            <div className="grid grid-cols-2 gap-4">

              <MiniStatCard
                icon={CheckCircle2}
                label="Your check-in"
                value={
                  yourCheckin
                    ? 'Completed'
                    : 'Not yet'
                }
                accent="blue"
              />


              <MiniStatCard
                icon={CalendarDays}
                label="Next plan"
                value={
                  upcomingEvent
                    ? 'Scheduled'
                    : 'Nothing yet'
                }
                accent="pink"
              />

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}


/* ============================================================= */
/* DASHBOARD GREETING */
/* ============================================================= */

function DashboardGreeting({
  name,
}: {
  name: string
}) {
  return (
    <header>

      <p className="text-sm text-neutral-400">
        Welcome back,
      </p>


      <div className="mt-1 flex items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">

            {name}.

          </h1>


          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">

            Everything you build together,
            in one place.

          </p>

        </div>



        <Heart
          size={18}
          className="text-black"
          fill="currentColor"
        />


      </div>

    </header>
  )
}


/* ============================================================= */
/* EMPTY PLANNER */
/* ============================================================= */

function EmptyPlannerCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl">

      <div className="absolute -right-10 -top-10 size-28 rounded-full bg-blue-100/60 blur-2xl" />


      <div className="relative">

        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">

          <CalendarDays size={17} />

        </div>


        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-300">
          Next plan
        </p>


        <h2 className="mt-2 text-base font-semibold">
          No upcoming plans
        </h2>


        <p className="mt-1 text-sm leading-5 text-neutral-400">
          Time to plan something together.
        </p>

      </div>

    </div>
  )
}


/* ============================================================= */
/* YOUR CHECK-IN */
/* ============================================================= */

function YourCheckinCard({
  hasCheckedIn,
}: {
  hasCheckedIn: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl">

      <div className="relative">

        <div className="flex size-9 items-center justify-center rounded-xl bg-pink-50 text-pink-500">

          <CheckCircle2 size={17} />

        </div>


        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-300">
          Your check-in
        </p>


        {hasCheckedIn ? (

          <div className="mt-2">

            <p className="text-base font-semibold">
              You're checked in ❤️
            </p>

            <p className="mt-1 text-sm text-neutral-400">
              Thanks for sharing how you're feeling today.
            </p>

          </div>

        ) : (

          <div className="mt-2">

            <p className="text-base font-semibold">
              How are you feeling?
            </p>

            <p className="mt-1 text-sm text-neutral-400">
              Take a moment to check in with yourself.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}


/* ============================================================= */
/* MINI STAT */
/* ============================================================= */

function MiniStatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof CheckCircle2
  label: string
  value: string
  accent: 'blue' | 'pink'
}) {

  const iconClass =
    accent === 'blue'
      ? 'bg-blue-50 text-blue-500'
      : 'bg-pink-50 text-pink-500'


  return (
    <div className="rounded-[1.5rem] border border-black/[0.05] bg-white/80 p-5 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl">

      <div
        className={`flex size-8 items-center justify-center rounded-xl ${iconClass}`}
      >

        <Icon size={15} />

      </div>


      <p className="mt-4 text-[11px] text-neutral-400">
        {label}
      </p>


      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>

    </div>
  )
}