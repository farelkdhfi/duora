'use client'

import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  ListChecks,
  Loader2,
  Smile,
  StickyNote,
  Target,
  Wallet,
} from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'

import { getActivityErrorKey } from '../errors'

import { useRupiah } from '@/lib/use-rupiah'

import { useRelationshipActivities } from '../queries'
import type { Activity, ActivityType } from '../types'

interface ActivityFeedProps {
  relationshipId: string
}

// Teks tiap aktivitas ada di messages: t(`types.${type}`)
const activityConfig: Record<
  ActivityType,
  {
    icon: React.ElementType
    color: string
    bg: string
  }
> = {
  goal_created: { icon: Target, color: 'text-pink-500', bg: 'bg-primary' },
  goal_updated: { icon: Target, color: 'text-blue-500', bg: 'bg-primary' },
  goal_deleted: { icon: Target, color: 'text-description', bg: 'bg-primary' },
  saving_added: { icon: Wallet, color: 'text-emerald-500', bg: 'bg-primary' },
  saving_deleted: { icon: Wallet, color: 'text-description', bg: 'bg-primary' },
  checkin_added: { icon: Smile, color: 'text-amber-500', bg: 'bg-primary' },
  checkin_updated: { icon: Smile, color: 'text-amber-400', bg: 'bg-primary' },
  plan_created: { icon: CalendarCheck, color: 'text-blue-500', bg: 'bg-primary' },
  plan_updated: { icon: CalendarCheck, color: 'text-blue-400', bg: 'bg-primary' },
  plan_deleted: { icon: CalendarCheck, color: 'text-description', bg: 'bg-primary' },
  checklist_completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-primary' },
  checklist_uncompleted: { icon: Circle, color: 'text-description', bg: 'bg-primary' },
  note_created: { icon: StickyNote, color: 'text-pink-500', bg: 'bg-primary' },
  note_updated: { icon: StickyNote, color: 'text-blue-500', bg: 'bg-primary' },
  note_deleted: { icon: StickyNote, color: 'text-description', bg: 'bg-primary' },
}

function str(value: unknown) {
  return value == null ? '' : String(value)
}

/* -------------------------------------------------------------------------- */
/* ACTIVITY ITEM                                                              */
/* -------------------------------------------------------------------------- */

function ActivityItem({
  activity,
  isLast,
}: {
  activity: Activity
  isLast: boolean
}) {
  const t = useTranslations('activities')
  const format = useFormatter()
  const { rupiah } = useRupiah()

  const config = activityConfig[activity.type]
  const Icon = config.icon

  const actorName =
    activity.actor.display_name ??
    activity.actor.username ??
    t('feed.someone')

  const metadata = activity.metadata

  // Semua placeholder disiapkan sekali, tiap pesan cuma pakai yang dibutuhkan
  const values = {
    goal: str(metadata.goal_title),
    plan: str(metadata.plan_title),
    note: str(metadata.note_title),
    item: str(metadata.checklist_title),
    amount:
      metadata.amount == null ? '' : rupiah(Number(metadata.amount)),
  }

  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()

    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return t('time.justNow')
    if (diffMinutes < 60) return t('time.minutesAgo', { count: diffMinutes })
    if (diffHours < 24) return t('time.hoursAgo', { count: diffHours })
    if (diffDays < 7) return t('time.daysAgo', { count: diffDays })

    return format.dateTime(date, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="group relative flex gap-4">
      {/* TIMELINE */}

      <div className="relative flex w-9 shrink-0 justify-center">
        {!isLast && (
          <div className="absolute left-1/2 top-9 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-white/15 to-white/5" />
        )}

        <div className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] ${config.bg}`}>
          <Icon size={15} strokeWidth={2} className={config.color} />
        </div>
      </div>

      {/* CONTENT */}

      <div className={`min-w-0 flex-1 pb-5 ${!isLast ? 'border-b border-white/10' : ''}`}>
        <div className="-mx-2 rounded-xl px-2 py-1.5 transition-colors duration-200 group-hover:bg-white/5">
          <div className="flex items-start gap-4">
            <p className="min-w-0 flex-1 text-[12.5px] leading-[1.65] tracking-[-0.01em] text-secondary/70">
              <span className="font-semibold text-secondary">{actorName}</span>{' '}
              {t(`types.${activity.type}`, values)}
            </p>

            <span className="shrink-0 pt-0.5 text-[10px] font-medium tracking-[-0.01em] text-description">
              {formatRelativeTime(activity.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SKELETON                                                                   */
/* -------------------------------------------------------------------------- */

function ActivityFeedSkeleton() {
  return (
    <div className="p-5 sm:p-6">
      <div className="space-y-0">
        {[1, 2, 3, 4, 5].map((item, index) => (
          <div key={item} className="relative flex gap-4">
            {/* ICON */}

            <div className="relative flex w-9 shrink-0 justify-center">
              {index !== 4 && (
                <div className="absolute left-1/2 top-9 bottom-0 w-px -translate-x-1/2 bg-white/10" />
              )}

              <div className="relative z-10 size-9 rounded-xl bg-white/10 animate-pulse" />
            </div>

            {/* CONTENT */}

            <div className={`min-w-0 flex-1 pb-5 ${index !== 4 ? 'border-b border-white/10' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2 py-1">
                  <div className="h-2.5 w-[78%] animate-pulse rounded-full bg-white/10" />
                  <div className="h-2.5 w-[42%] animate-pulse rounded-full bg-white/10" />
                </div>

                <div className="h-2.5 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* EMPTY STATE                                                                */
/* -------------------------------------------------------------------------- */

function ActivityEmptyState() {
  const t = useTranslations('activities.feed')

  return (
    <div className="px-6 py-14">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-primary shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="absolute -right-4 -top-4 size-10 rounded-full bg-pink-500/20 blur-xl" />

          <div className="absolute -bottom-4 -left-4 size-10 rounded-full bg-blue-500/20 blur-xl" />

          <ListChecks size={19} strokeWidth={1.7} className="relative text-description" />
        </div>

        <h3 className="mt-5 text-[13px] font-semibold tracking-[-0.025em] text-secondary">
          {t('emptyTitle')}
        </h3>

        <p className="mt-2 max-w-[250px] text-[11.5px] leading-5 tracking-[-0.005em] text-description">
          {t('emptyDescription')}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

export default function ActivityFeed({
  relationshipId,
}: ActivityFeedProps) {
  const t = useTranslations('activities.feed')
  const te = useTranslations('activities.errors')

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRelationshipActivities(relationshipId)

  const activities = data?.pages.flat() ?? []

  /* LOADING */

  if (isLoading) {
    return <ActivityFeedSkeleton />
  }

  /* ERROR */

  if (error) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary">
          <Circle size={16} className="text-description" />
        </div>

        <p className="mt-3 text-[12px] leading-5 text-description">
          {te(getActivityErrorKey(error))}
        </p>
      </div>
    )
  }

  /* EMPTY */

  if (!activities.length) {
    return <ActivityEmptyState />
  }

  /* LIST */

  return (
    <div className="p-5 sm:p-6">
      <div className="space-y-0">
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isLast={index === activities.length - 1}
          />
        ))}
      </div>

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-primary py-2.5 text-[11px] font-semibold tracking-[-0.01em] text-description shadow-[0_3px_12px_rgba(0,0,0,0.025)] transition-all duration-200 hover:border-white/20 hover:bg-white/5 hover:text-secondary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFetchingNextPage ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              {t('loadingMore')}
            </>
          ) : (
            t('loadMore')
          )}
        </button>
      )}
    </div>
  )
}