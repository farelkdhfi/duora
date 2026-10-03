'use client'

import { Heart } from 'lucide-react'

import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { useGetMyProfile } from '@/features/profiles/queries'
import CheckinForm from '@/features/checkins/components/checkin-form'
import { useCheckinRealtime } from '@/features/checkins/use-checkin-realtime'
import CheckinSkeleton from '@/features/checkins/components/checkin-skeleton'

export default function CheckInPage() {
  const { data, isLoading } = useMyRelationshipDetails()
  const { isLoading: profileLoading } = useGetMyProfile()

  const relationship = data?.relationship
  const relationshipId = relationship?.id

  useCheckinRealtime({ relationshipId: relationshipId ?? '' })

  const today = (() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  })()

  if (isLoading || profileLoading) {
    return <CheckinSkeleton />
  }

  if (!relationshipId) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />

        <div className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white/80 p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-100/40 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 sm:size-12">
              <Heart size={19} strokeWidth={1.8} className="text-pink-500" fill="currentColor" />
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-neutral-800 sm:text-xl">
              Connect with your partner
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-neutral-400 sm:text-sm">
              Connect your relationship first to start checking in with each other.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <CheckinForm relationshipId={relationshipId} date={today} />
}