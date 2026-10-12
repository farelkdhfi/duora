'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import EmptyPlannerCard from '@/features/dashboard/components/empty-planner-card'

export default function DashboardPage() {
  const router = useRouter()

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

  // Pengaman di sisi client: proxy sudah menangani redirect di server,
  // ini untuk kasus relationship hilang saat dashboard sedang terbuka.
  const hasNoRelationship =
    !isLoading &&
    !relationshipLoading &&
    !relationshipError &&
    !relationshipId

  useEffect(() => {
    if (hasNoRelationship) {
      router.replace('/onboarding')
    }
  }, [hasNoRelationship, router])

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

  // Sedang diarahkan ke /onboarding oleh useEffect di atas
  if (!relationshipId) {
    return <DashboardSkeleton />
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

                <h2 className="mt-1 text-base font-semibold tracking-[-0.03em]">
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