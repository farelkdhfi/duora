'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { useGetMyProfile } from '@/features/profiles/queries'
import CheckinCard from '@/features/checkins/components/checkin-card'
import { useCheckinHistory } from '@/features/checkins/queries'
import { useCheckinRealtime } from '@/features/checkins/use-checkin-realtime'
import CheckinSkeleton from '@/features/checkins/components/checkin-skeleton'

type Filter = 'all' | 'you' | 'partner'

export default function CheckinHistoryPage() {
  const [filter, setFilter] = useState<Filter>('all')

  const { data, isLoading } = useMyRelationshipDetails()
  const { data: myProfile, isLoading: profileLoading } = useGetMyProfile()

  const relationshipId = data?.relationship?.id

  useCheckinRealtime({ relationshipId: relationshipId ?? '' })

  const { data: history, isLoading: historyLoading } = useCheckinHistory(relationshipId ?? '')

  const allCheckins = history ?? []
  const members = data?.members ?? []

  const myCheckins = useMemo(() => allCheckins.filter((checkin) => checkin.user_id === myProfile?.id), [allCheckins, myProfile?.id])

  const partnerCheckins = useMemo(() => allCheckins.filter((checkin) => checkin.user_id !== myProfile?.id), [allCheckins, myProfile?.id])

  const filteredCheckins = useMemo(() => {
    if (filter === 'you') return myCheckins
    if (filter === 'partner') return partnerCheckins
    return allCheckins
  }, [filter, allCheckins, myCheckins, partnerCheckins])

  const getDisplayName = (userId: string) => {
    if (userId === myProfile?.id) {
      return myProfile?.display_name ?? 'You'
    }

    const member = members.find((m: { user_id: string }) => m.user_id === userId)

    return member?.display_name ?? 'Your partner'
  }

  const filterOptions: { value: Filter; label: string; count: number }[] = [
    {
      value: 'all',
      label: 'All',
      count: allCheckins.length,
    },
    {
      value: 'you',
      label: 'You',
      count: myCheckins.length,
    },
    {
      value: 'partner',
      label: 'Partner',
      count: partnerCheckins.length,
    },
  ]

  if (isLoading || profileLoading) {
    return <CheckinSkeleton />
  }

  if (!relationshipId) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-600">Connect with your partner first.</p>
          <Link href="/check-in" className="mt-4 inline-flex text-xs font-semibold text-neutral-900 underline underline-offset-4">
            Back to check-in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-7 sm:px-8 sm:py-10">
      <div className="mb-7 sm:mb-9">
        <Link href="/check-in" className="mb-6 inline-flex items-center gap-2 text-[11px] font-semibold text-neutral-400 transition-colors hover:text-neutral-800">
          <ArrowLeft size={14} strokeWidth={1.8} />
          Back to check-in
        </Link>

        <h1 className=" text-[26px] font-medium tracking-[-0.045em] text-neutral-950 sm:text-[32px]">
          Check-in history
        </h1>

        <p className="mt-2 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
          A quiet look at how you and your partner have been feeling.
        </p>
      </div>

      {!historyLoading && allCheckins.length > 0 && (
        <div className="mb-7 flex  sm:justify-start">
          <div className="inline-flex rounded-full border border-black/[0.06] bg-white/70 p-1 shadow-[0_10px_35px_-25px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            {filterOptions.map((option) => {
              const isActive = filter === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`flex min-w-[76px] items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 sm:min-w-[88px] sm:px-4 ${isActive ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:bg-neutral-100/80 hover:text-neutral-700'}`}
                >
                  <span>{option.label}</span>
                  <span className={`tabular-nums text-[9px] ${isActive ? 'text-white/50' : 'text-neutral-300'}`}>
                    {option.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {historyLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <span className="size-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-500" />
            Loading history...
          </div>
        </div>
      ) : allCheckins.length === 0 ? (
        <div className="relative overflow-hidden rounded-[1.5rem] border border-dashed border-black/[0.08] bg-white/60 p-8 text-center backdrop-blur-xl sm:rounded-[1.75rem] sm:p-12">
          <p className="text-sm text-neutral-400">No check-ins yet.</p>

          <Link href="/check-in" className="mt-4 inline-flex rounded-full bg-[#111111] px-5 py-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-neutral-800">
            Create your first check-in
          </Link>
        </div>
      ) : filteredCheckins.length === 0 ? (
        <div className="rounded-[1.5rem] border border-black/[0.05] bg-white/60 px-6 py-12 text-center backdrop-blur-xl sm:rounded-[1.75rem]">
          <p className="text-sm text-neutral-400">
            No check-ins from {filter === 'you' ? 'you' : 'your partner'} yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {filteredCheckins.map((checkin) => (
            <CheckinCard key={checkin.id} checkin={checkin} name={getDisplayName(checkin.user_id)} />
          ))}
        </div>
      )}
    </div>
  )
}