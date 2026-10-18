'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { useGetMyProfile } from '@/features/profiles/queries'
import CheckinCard from '@/features/checkins/components/checkin-card'
import { useCheckinHistory } from '@/features/checkins/queries'
import { useCheckinRealtime } from '@/features/checkins/use-checkin-realtime'
import CheckinHistorySkeleton from '@/features/checkins/components/checkin-history-skeleton'

type Filter = 'all' | 'you' | 'partner'

export default function CheckinHistoryPage() {
  const t = useTranslations('checkins.history')

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
      return myProfile?.display_name ?? t('fallbackYou')
    }

    const member = members.find((m: { user_id: string }) => m.user_id === userId)

    return member?.display_name ?? t('fallbackPartner')
  }

  const filterOptions: { value: Filter; label: string; count: number }[] = [
    {
      value: 'all',
      label: t('filters.all'),
      count: allCheckins.length,
    },
    {
      value: 'you',
      label: t('filters.you'),
      count: myCheckins.length,
    },
    {
      value: 'partner',
      label: t('filters.partner'),
      count: partnerCheckins.length,
    },
  ]

  if (isLoading || profileLoading) {
    return <CheckinHistorySkeleton />
  }

  if (!relationshipId) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="text-center">
          <p className="text-sm font-medium text-description">{t('noRelationship')}</p>
          <Link href="/check-in" className="mt-4 inline-flex text-xs font-semibold text-secondary underline underline-offset-4">
            {t('backToCheckin')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-7 sm:px-8 sm:py-10">
      <div className="mb-7 sm:mb-9">
        <Link href="/check-in" className="mb-6 inline-flex items-center gap-2 text-[11px] font-semibold text-description transition-colors hover:text-secondary">
          <ArrowLeft size={14} strokeWidth={1.8} />
          {t('backToCheckin')}
        </Link>

        <h1 className=" text-[26px] font-medium tracking-[-0.045em] text-secondary sm:text-[32px]">
          {t('title')}
        </h1>

        <p className="mt-2 max-w-md text-[13px] leading-6 text-description sm:text-sm">
          {t('description')}
        </p>
      </div>

      {!historyLoading && allCheckins.length > 0 && (
        <div className="mb-7 flex  sm:justify-start">
          <div className="inline-flex rounded-full border border-white/[0.06] bg-primary/70 p-1 shadow-[0_10px_35px_-25px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            {filterOptions.map((option) => {
              const isActive = filter === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`flex min-w-[76px] items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 sm:min-w-[88px] sm:px-4 ${isActive ? 'bg-subprimary text-secondary shadow-sm' : 'text-description hover:bg-subprimary/50 hover:text-secondary'}`}
                >
                  <span>{option.label}</span>
                  <span className={`tabular-nums text-[9px] ${isActive ? 'text-secondary/50' : 'text-description'}`}>
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
          <div className="flex items-center gap-3 text-sm text-description">
            <span className="size-4 animate-spin rounded-full border-2 border-white/[0.12] border-t-description" />
            {t('loading')}
          </div>
        </div>
      ) : allCheckins.length === 0 ? (
        <div className="relative overflow-hidden rounded-[1.5rem] border border-dashed border-white/[0.08] bg-primary/60 p-8 text-center backdrop-blur-xl sm:rounded-[1.75rem] sm:p-12">
          <p className="text-sm text-description">{t('emptyTitle')}</p>

          <Link href="/check-in" className="mt-4 inline-flex rounded-full bg-subprimary px-5 py-2.5 text-[11px] font-semibold text-secondary transition-colors hover:bg-subprimary/80">
            {t('emptyCta')}
          </Link>
        </div>
      ) : filteredCheckins.length === 0 ? (
        <div className="rounded-[1.5rem] border border-white/[0.06] bg-primary/60 px-6 py-12 text-center backdrop-blur-xl sm:rounded-[1.75rem]">
          <p className="text-sm text-description">
            {filter === 'you' ? t('emptyFilter.you') : t('emptyFilter.partner')}
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