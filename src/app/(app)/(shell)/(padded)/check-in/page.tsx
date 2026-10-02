'use client'

import { useMemo } from 'react'

import { Heart } from 'lucide-react'

import { useMyRelationshipDetails } from '@/features/relationship/queries'

import { useGetMyProfile } from '@/features/profiles/queries'

import CheckinForm from '@/features/checkins/components/checkin-form'

import CheckinCard from '@/features/checkins/components/checkin-card'

import { useCheckinHistory } from '@/features/checkins/queries'

import { useCheckinRealtime } from '@/features/checkins/use-checkin-realtime'
import Header from '@/components/layout/header'
import CheckinSkeleton from '@/features/checkins/components/checkin-skeleton'

export default function CheckInPage() {
  const { data, isLoading } = useMyRelationshipDetails()
  const { data: myProfile, isLoading: profileLoading } = useGetMyProfile()

  const relationship = data?.relationship
  const relationshipId = relationship?.id

  useCheckinRealtime({ relationshipId: relationshipId ?? '' })

  const today = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }, [])

  const { data: history, isLoading: historyLoading } = useCheckinHistory(
    relationshipId ?? '',
  )

  const allCheckins = history ?? []
  const members = data?.members ?? []

  const getDisplayName = (userId: string) => {
    if (userId === myProfile?.id) {
      return myProfile?.display_name ?? 'You'
    }

    const member = members.find((m: { user_id: string }) => m.user_id === userId)
    return member?.display_name ?? 'Your partner'
  }

  const myCheckins = allCheckins.filter(
    (checkin) => checkin.user_id === myProfile?.id,
  )
  const partnerCheckins = allCheckins.filter(
    (checkin) => checkin.user_id !== myProfile?.id,
  )

  return (
    <div className="relative">

      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <Header title='Daily Check-in' description='A small moment to understand each other.' icon={Heart} />

      {isLoading || profileLoading ? (
        <CheckinSkeleton />
      ) : !relationshipId ? (
        <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">

          {/* Ambient */}

          <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

          <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />


          <div className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white/80 p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8">

            <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-100/50 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-100/40 blur-3xl" />


            <div className="relative">

              <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 sm:size-12">
                <Heart
                  size={19}
                  strokeWidth={1.8}
                  className="text-pink-500"
                  fill="currentColor"
                />
              </div>

              <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-neutral-800 sm:text-xl">
                Connect with your partner
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-neutral-400 sm:text-sm">
                Connect your relationship first to start
                checking in with each other.
              </p>

            </div>

          </div>

        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:mt-8 lg:grid-cols-2 lg:items-start">

          <section>
            <CheckinForm relationshipId={relationshipId} date={today} />
          </section>

          <section>

            <div className="mb-4">

              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                History
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
                Check-ins
              </h2>

              <p className="mt-1 text-[13px] leading-6 text-neutral-400 sm:text-sm">
                See how you and your partner are feeling.
              </p>

            </div>

            {historyLoading ? (

              <div className="flex items-center gap-3 py-8 text-sm text-neutral-400">
                <span className="size-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-400" />
                Loading...
              </div>

            ) : allCheckins.length === 0 ? (

              <div className="relative overflow-hidden rounded-[1.5rem] border border-dashed border-black/[0.08] bg-white/60 p-7 text-center backdrop-blur-xl sm:rounded-[1.75rem] sm:p-10">
                <p className="text-sm text-neutral-400">
                  No check-ins yet.
                </p>
              </div>

            ) : (

              <div className="space-y-6 sm:space-y-8">

                {myCheckins.length > 0 && (

                  <div className="space-y-3.5 sm:space-y-4">

                    <div className="flex items-center gap-3">

                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                        You
                      </span>

                      <div className="h-px flex-1 bg-black/[0.05]" />

                    </div>

                    {myCheckins.slice(0, 7).map((checkin) => (
                      <CheckinCard
                        key={checkin.id}
                        checkin={checkin}
                        name={getDisplayName(checkin.user_id)}
                      />
                    ))}

                  </div>

                )}

                {partnerCheckins.length > 0 && (

                  <div className="space-y-3.5 sm:space-y-4">

                    <div className="flex items-center gap-3">

                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                        Partner
                      </span>

                      <div className="h-px flex-1 bg-black/[0.05]" />

                    </div>

                    {partnerCheckins.slice(0, 7).map((checkin) => (
                      <CheckinCard
                        key={checkin.id}
                        checkin={checkin}
                        name={getDisplayName(checkin.user_id)}
                      />
                    ))}

                  </div>

                )}

              </div>

            )}

          </section>

        </div>
      )}
    </div>
  )
}