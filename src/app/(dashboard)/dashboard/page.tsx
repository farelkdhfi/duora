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
import WaitingForPartner from '@/features/dashboard/components/waiting-for-partner'


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

  const memberCount = data?.members?.length ?? 0
  const isWaitingForPartner = !!relationshipId && memberCount < 2


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
      <main className="relative min-h-screen overflow-hidden">
        <div className="relative mx-auto">
          <DashboardGreeting
            name={
              user?.display_name ??
              'thereeee'
            }
          />


          <div className="mt-10 overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/80 shadow-md shadow-black/10 backdrop-blur-xl">

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

              <div className="relative hidden overflow-hidden bg-neutral-900 md:block">

                <div className="absolute -right-20 -top-20 size-60 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-pink-500/20 blur-3xl" />

                {/* Big background heart icon */}
                <Heart
                  size={220}
                  className="pointer-events-none absolute -right-10 -bottom-10 text-neutral-400/10"
                  fill="currentColor"
                />


                <div className="relative flex h-full items-center justify-center p-10">

                  <div className="text-center">

                    <p className="text-2xl font-semibold tracking-[-0.03em] text-white">
                      A space made
                      for two.
                    </p>

                    <p className="mt-3 max-w-[240px] text-sm leading-6 text-neutral-400">
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

  if (isWaitingForPartner) {
    return (
      <WaitingForPartner
        relationshipName={data.relationship.name}
        inviteCode={data.relationship.invite_code}
        userName={user?.display_name ?? 'there'}
      />
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

            <div
              className="
    group
    relative
    overflow-hidden
    rounded-[1.75rem]
    border
    border-black/[0.05]
    bg-white
    p-6
    shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)]
    transition-all
    duration-300
    hover:shadow-[0_18px_45px_-24px_rgba(0,0,0,0.18)]
    sm:p-7
  "
            >
              {/* ================================================== */}
              {/* AMBIENT */}
              {/* ================================================== */}

              <div
                className="
      pointer-events-none
      absolute
      -right-12
      -top-12
      size-32
      rounded-full
      bg-pink-100/50
      blur-3xl
      transition-transform
      duration-500
      group-hover:scale-110
    "
              />

              <div
                className="
      pointer-events-none
      absolute
      -bottom-16
      -left-12
      size-28
      rounded-full
      bg-blue-100/25
      blur-3xl
    "
              />


              {/* ================================================== */}
              {/* CONTENT */}
              {/* ================================================== */}

              <div className="relative">

                {/* Icon */}

                <div
                  className="
        flex
        size-10
        items-center
        justify-center
        rounded-[13px]
        border
        border-pink-100/70
        bg-gradient-to-br
        from-blue-50
        to-pink-50
        shadow-[0_5px_15px_-8px_rgba(236,72,153,0.25)]
      "
                >
                  <Heart
                    size={16}
                    strokeWidth={0}
                    fill="currentColor"
                    className="text-pink-500"
                  />
                </div>


                {/* Label */}

                <div className="mt-5 flex items-center gap-2">

                  <span
                    className="
          size-1.5
          rounded-full
          bg-pink-400
        "
                  />

                  <p
                    className="
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.14em]
          text-neutral-300
        "
                  >
                    A little reminder
                  </p>

                </div>


                {/* Title */}

                <p
                  className="
        mt-2
        text-[16px]
        font-semibold
        tracking-[-0.025em]
        text-neutral-800
      "
                >
                  Keep choosing each other.
                </p>


                {/* Description */}

                <p
                  className="
        mt-2
        max-w-md
        text-[12px]
        leading-relaxed
        text-neutral-400
      "
                >
                  Small moments every day make a
                  stronger relationship.
                </p>


                {/* Bottom accent */}



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
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[1.75rem]
        border
        border-black/[0.06]
        bg-neutral-900
        p-6
        shadow-[0_18px_45px_-25px_rgba(0,0,0,0.35)]
        sm:p-7
      "
    >

      {/* ================================================== */}
      {/* AMBIENT */}
      {/* ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          size-40
          rounded-full
          bg-pink-500/[0.08]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-16
          size-40
          rounded-full
          bg-blue-500/[0.06]
          blur-3xl
        "
      />


      {/* ================================================== */}
      {/* BIG HEART */}
      {/* ================================================== */}

      <Heart
        size={180}
        strokeWidth={1}
        className="
          pointer-events-none
          absolute
          -bottom-12
          -right-10
          rotate-[-12deg]
          text-white/[0.035]
          transition-transform
          duration-500
          group-hover:scale-105
        "
        fill="currentColor"
      />


      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <div className="relative">

        {/* Header */}

        <div className="flex items-start justify-between">

          <div
            className={`
              flex
              size-10
              items-center
              justify-center
              rounded-[13px]
              border
              transition-colors
              duration-300
              ${hasCheckedIn
                ? 'border-emerald-400/10 bg-emerald-400/10 text-emerald-400'
                : 'border-pink-400/10 bg-pink-400/10 text-pink-400'
              }
            `}
          >

            <CheckCircle2
              size={17}
              strokeWidth={2.2}
            />

          </div>


          {/* Status */}

          <div
            className={`
              flex
              items-center
              gap-1.5
              rounded-full
              border
              px-2.5
              py-1
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.12em]
              ${hasCheckedIn
                ? 'border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-400/80'
                : 'border-white/[0.06] bg-white/[0.04] text-neutral-500'
              }
            `}
          >

            <span
              className={`
                size-1.5
                rounded-full
                ${hasCheckedIn
                  ? 'bg-emerald-400'
                  : 'bg-neutral-600'
                }
              `}
            />

            {hasCheckedIn
              ? 'Completed'
              : 'Today'}

          </div>

        </div>


        {/* Label */}

        <p
          className="
            mt-6
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-neutral-500
          "
        >
          Your check-in
        </p>


        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        {hasCheckedIn ? (

          <div className="mt-2.5">

            <p
              className="
                text-[17px]
                font-semibold
                tracking-[-0.025em]
                text-white
              "
            >
              You're checked in
            </p>

            <p
              className="
                mt-1.5
                max-w-[280px]
                text-[12px]
                leading-relaxed
                text-neutral-400
              "
            >
              Thanks for sharing how you're
              feeling today.
            </p>

          </div>

        ) : (

          <div className="mt-2.5">

            <p
              className="
                text-[17px]
                font-semibold
                tracking-[-0.025em]
                text-white
              "
            >
              How are you feeling?
            </p>

            <p
              className="
                mt-1.5
                max-w-[280px]
                text-[12px]
                leading-relaxed
                text-neutral-400
              "
            >
              Take a small moment to check
              in with yourself today.
            </p>

          </div>

        )}


        {/* ================================================= */}
        {/* BOTTOM */}
        {/* ================================================= */}

        <div className="mt-6 flex items-center gap-2">

          <div
            className="
              flex
              size-6
              items-center
              justify-center
              rounded-full
              bg-white/[0.05]
            "
          >
            <Heart
              size={11}
              strokeWidth={0}
              fill="currentColor"
              className="text-pink-400"
            />
          </div>

          <p className="text-[10px] text-neutral-500">
            A little moment for yourself.
          </p>

        </div>

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
  const isBlue = accent === 'blue'

  const theme = isBlue
    ? {
      icon:
        'bg-blue-50 text-blue-500 border-blue-100/60',
      glow: 'bg-blue-100/30',
      dot: 'bg-blue-400',
    }
    : {
      icon:
        'bg-pink-50 text-pink-500 border-pink-100/60',
      glow: 'bg-pink-100/30',
      dot: 'bg-pink-400',
    }

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[1.5rem]
        border
        border-black/[0.05]
        bg-white
        p-5
        shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_18px_45px_-24px_rgba(0,0,0,0.18)]
      "
    >

      {/* ================================================== */}
      {/* AMBIENT */}
      {/* ================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-10
          -top-10
          size-24
          rounded-full
          blur-3xl
          transition-opacity
          duration-300
          group-hover:opacity-100
          opacity-70
          ${theme.glow}
        `}
      />


      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <div className="relative">

        {/* Icon */}

        <div
          className={`
            flex
            size-9
            items-center
            justify-center
            rounded-[11px]
            border
            transition-transform
            duration-300
            group-hover:scale-105
            ${theme.icon}
          `}
        >
          <Icon
            size={15}
            strokeWidth={2.3}
          />
        </div>


        {/* Label */}

        <div className="mt-4 flex items-center gap-1.5">

          <span
            className={`
              size-1.5
              rounded-full
              ${theme.dot}
            `}
          />

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-neutral-400
            "
          >
            {label}
          </p>

        </div>


        {/* Value */}

        <p
          className="
            mt-1.5
            text-[15px]
            font-semibold
            tracking-[-0.025em]
            text-neutral-800
          "
        >
          {value}
        </p>

      </div>
    </div>
  )
}