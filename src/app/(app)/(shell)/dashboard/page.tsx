'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'

import {
  useMyRelationship,
  useMyRelationshipDetails,
} from '@/features/relationship/queries'

import RelationshipCard from '@/features/dashboard/components/relationship-card'
import PlannerSummaryCard from '@/features/dashboard/components/planner-summary-card'
import PartnerCheckinCard from '@/features/dashboard/components/partner-checkin-card'
import GoalListSummary from '@/features/dashboard/components/goal-list-summary'
import LatestDebateCard from '@/features/dashboard/components/latest-debate-card'
import LatestQnaCard from '@/features/dashboard/components/latest-qna-card'
import { usePlannerEvents } from '@/features/planner/queries'
import {
  useCheckinHistory,
  useGetPartnerName,
} from '@/features/checkins/queries'
import { useGetMyProfile } from '@/features/profiles/queries'
import WaitingForPartner from '@/features/dashboard/components/waiting-for-partner'
import DashboardSkeleton from '@/features/dashboard/components/dashboard-skeleton'

/**
 * Header section yang dipakai ulang.
 * - href    : kalau diisi, tombol panah muncul di kanan
 * - divider : kalau true, garis horizontal full width muncul di bawah teks
 *
 * Semua warna header ada di sini, jadi kalau tema halamanmu gelap
 * cukup ubah satu tempat ini.
 */
function SectionHeader({
  title,
  href,
  linkLabel,
  divider,
}: {
  title: string
  href?: string
  linkLabel?: string
  divider?: boolean
}) {
  return (
    <div className="mb-3 flex">
      <div className="flex items-center justify-between gap-4 px-1 w-full">
        <h2 className="text-sm font-medium text-white">
          {title}
        </h2>

        {href && (
          <Link
            href={href}
            aria-label={linkLabel ?? title}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200/5 bg-neutral-800 text-neutral-white transition-all duration-300 hover:bg-neutral-900 hover:text-white"
          >
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </Link>
        )}
      </div>

      {divider && <div className="mt-2 h-px w-full bg-neutral-200/15" />}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()

  const { data, isLoading } = useMyRelationshipDetails()

  const { data: user } = useGetMyProfile()

  const { data: partner } = useGetPartnerName()

  const {
    data: relationship,
    error: relationshipError,
    isLoading: relationshipLoading,
  } = useMyRelationship()

  const relationshipId = data?.relationship?.id

  const memberCount = data?.members?.length ?? 0
  const isWaitingForPartner = !!relationshipId && memberCount < 2

  const { data: events } = usePlannerEvents(relationshipId ?? '')

  const { data: checkins } = useCheckinHistory(relationshipId ?? '')

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
    checkins?.find((checkin) => checkin.user_id !== user?.id) ?? null

  const upcomingEvent = events?.find(
    (event) => event.event_date >= new Date().toISOString().slice(0, 10),
  )

  const yourCheckin = checkins?.find((checkin) => checkin.user_id === user?.id)

  if (isLoading || relationshipLoading) {
    return <DashboardSkeleton />
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
        <section>
          <RelationshipCard
            userName={user?.display_name ?? 'You'}
            partnerName={partner?.display_name ?? 'Partner'}
            userAvatarUrl={user?.avatar_url}
            partnerAvatarUrl={partner?.avatar_url}
            connectedAt={data?.relationship?.started_at}
          />
        </section>

        <div className="p-2 sm:p-0">
          {/* Check-in: header + tombol panah ada di sini (parent) */}
          <section className="mt-5">
            <SectionHeader
              title="How are you two?"
              href="/check-in"
              linkLabel="Open check-in"
            />

            <PartnerCheckinCard
              userCheckin={yourCheckin ?? null}
              partnerCheckin={partnerCheckin}
              userName={user?.display_name ?? 'You'}
              partnerName={partner?.display_name ?? 'Partner'}
            />
          </section>

          {/* Workspaces: header + garis full width, tanpa tombol panah */}
          <section className="mt-6">
            <SectionHeader title="Your workspaces" divider />

            <div className="grid grid-cols-2 gap-2 sm:gap-5">
              {/* Goals & Planner: sejajar horizontal */}
              <GoalListSummary relationshipId={relationshipId} />

              <PlannerSummaryCard
                title={upcomingEvent?.title}
                date={upcomingEvent?.event_date}
                startTime={upcomingEvent?.start_time}
                description={upcomingEvent?.description}
              />

              {/* AI Debates & Q&A: sejajar horizontal */}
              <LatestDebateCard relationshipId={relationshipId} />

              <LatestQnaCard />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}