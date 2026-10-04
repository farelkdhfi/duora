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
import DashboardSkeleton from '@/features/dashboard/components/dashboard-skeleton'
import DashboardGreeting from '@/features/dashboard/components/dashboard-greeting'
import EmptyPlannerCard from '@/features/dashboard/components/empty-planner-card'

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

  if (
    isLoading ||
    relationshipLoading
  ) {
    return (
      <DashboardSkeleton />
    )
  }

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

  if (!relationshipId) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="relative mx-auto">
          <DashboardGreeting
            name={
              user?.display_name ??
              'there'
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
        <section className="">
          <RelationshipCard
            userName={user?.display_name ?? 'You'}
            partnerName={partner?.display_name ?? 'Partner'}
            userAvatarUrl={user?.avatar_url}
            partnerAvatarUrl={partner?.avatar_url}
            connectedAt={data?.relationship?.started_at}
          />
        </section>

        <div className='p-4 sm:p-0'>
          <section className="mt-3">
            <div className="mb-4 flex items-center gap-4">
              <div className="shrink-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Your space
                </p>

                <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                  Growing together
                </h2>
              </div>

              <div className="h-px flex-1 bg-neutral-300 rounded-full" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <PartnerCheckinCard
                userCheckin={yourCheckin ?? null}
                partnerCheckin={partnerCheckin}
                userName={user?.display_name ?? 'You'}
                partnerName={partner?.display_name ?? 'Partner'}
              />

              <GoalListSummary
                relationshipId={
                  relationshipId
                }
              />

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
            </div>
          </section>

          
        </div>
      </div>
    </main>
  )
}