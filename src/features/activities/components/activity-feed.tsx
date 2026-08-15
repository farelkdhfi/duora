'use client'

import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Heart,
  ListChecks,
  Loader2,
  Smile,
  StickyNote,
  Target,
  Wallet,
} from 'lucide-react'

import { useRelationshipActivities } from '../queries'
import type { Activity, ActivityType } from '../types'

interface ActivityFeedProps {
  relationshipId: string
}

const activityConfig: Record<
  ActivityType,
  {
    icon: React.ElementType
    color: string
    bg: string
    label: (metadata: Record<string, unknown>) => string
  }
> = {
  goal_created: {
    icon: Target,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    label: (m) =>
      `membuat goal baru "${m.goal_title}"`,
  },
  goal_updated: {
    icon: Target,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: (m) =>
      `memperbarui goal "${m.goal_title}"`,
  },
  goal_deleted: {
    icon: Target,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) =>
      `menghapus goal "${m.goal_title}"`,
  },
  saving_added: {
    icon: Wallet,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    label: (m) =>
      `menabung Rp ${Number(
        m.amount,
      ).toLocaleString('id-ID')} untuk "${m.goal_title}"`,
  },
  saving_deleted: {
    icon: Wallet,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) =>
      `menghapus tabungan Rp ${Number(
        m.amount,
      ).toLocaleString('id-ID')} dari "${m.goal_title}"`,
  },
  checkin_added: {
    icon: Smile,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    label: () => `melakukan mood check-in hari ini`,
  },
  checkin_updated: {
    icon: Smile,
    color: 'text-amber-400',
    bg: 'bg-amber-50',
    label: () => `memperbarui mood check-in`,
  },
  plan_created: {
    icon: CalendarCheck,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: (m) =>
      `membuat rencana "${m.plan_title}"`,
  },
  plan_updated: {
    icon: CalendarCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-50',
    label: (m) =>
      `memperbarui rencana "${m.plan_title}"`,
  },
  plan_deleted: {
    icon: CalendarCheck,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) =>
      `menghapus rencana "${m.plan_title}"`,
  },
  checklist_completed: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    label: (m) =>
      `menyelesaikan "${m.checklist_title}" di goal "${m.goal_title}"`,
  },
  checklist_uncompleted: {
    icon: Circle,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) =>
      `membatalkan "${m.checklist_title}" di goal "${m.goal_title}"`,
  },
  note_created: {
    icon: StickyNote,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    label: (m) =>
      `membuat catatan "${m.note_title}"`,
  },
  note_updated: {
    icon: StickyNote,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: (m) =>
      `memperbarui catatan "${m.note_title}"`,
  },
  note_deleted: {
    icon: StickyNote,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) =>
      `menghapus catatan "${m.note_title}"`,
  },
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Baru saja'
  if (diffMinutes < 60) return `${diffMinutes}m lalu`
  if (diffHours < 24) return `${diffHours}j lalu`
  if (diffDays < 7) return `${diffDays}h lalu`

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ActivityItem({
  activity,
  isLast,
}: {
  activity: Activity
  isLast: boolean
}) {
  const config = activityConfig[activity.type]
  const Icon = config.icon

  const actorName =
    activity.actor.display_name ??
    activity.actor.username ??
    'Seseorang'

  return (
    <div className="group relative flex gap-3.5">
      {/* TIMELINE */}

      <div className="relative flex w-9 shrink-0 justify-center">
        {!isLast && (
          <div
            className="
              absolute
              left-1/2
              top-9
              h-[calc(100%+4px)]
              w-px
              -translate-x-1/2
              bg-neutral-100
            "
          />
        )}

        <div
          className={`
            relative
            z-10
            flex
            size-9
            items-center
            justify-center
            rounded-full
            border
            border-white
            shadow-[0_2px_8px_rgba(0,0,0,0.06)]
            ${config.bg}
          `}
        >
          <Icon
            size={14}
            strokeWidth={2}
            className={config.color}
          />
        </div>
      </div>

      {/* CONTENT */}

      <div
        className={`
          min-w-0
          flex-1
          pb-5
          ${!isLast ? 'border-b border-black/[0.035]' : ''}
        `}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-[13px] leading-5 text-neutral-700">
            <span className="font-semibold text-neutral-900">
              {actorName}
            </span>{' '}
            {config.label(activity.metadata)}
          </p>

          <span className="shrink-0 text-[10px] text-neutral-400">
            {formatRelativeTime(activity.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ActivityFeed({
  relationshipId,
}: ActivityFeedProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRelationshipActivities(relationshipId)

  const activities =
    data?.pages.flat() ?? []

  /* LOADING */

  if (isLoading) {
    return (
      <div className="p-5 sm:p-6">
        <div className="animate-pulse space-y-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
            >
              <div className="size-9 shrink-0 rounded-full bg-neutral-100" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-48 rounded-full bg-neutral-100" />
                <div className="h-2.5 w-24 rounded-full bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ERROR */

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-[13px] text-neutral-400">
          {error.message}
        </p>
      </div>
    )
  }

  /* EMPTY */

  if (!activities.length) {
    return (
      <div className="px-6 py-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-50">
            <ListChecks
              size={18}
              strokeWidth={1.8}
              className="text-neutral-300"
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold tracking-[-0.02em] text-neutral-800">
            Belum ada aktivitas
          </h3>

          <p className="mt-2 max-w-[240px] text-[12px] leading-5 text-neutral-400">
            Semua kegiatan kamu dan pasangan
            akan muncul di sini.
          </p>
        </div>
      </div>
    )
  }

  /* LIST */

  return (
    <div className="p-5 sm:p-6">
      <div className="space-y-1">
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
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-black/[0.06]
            py-2.5
            text-[12px]
            font-medium
            text-neutral-500
            transition
            hover:bg-neutral-50
            disabled:opacity-50
          "
        >
          {isFetchingNextPage ? (
            <>
              <Loader2
                size={13}
                className="animate-spin"
              />
              Memuat...
            </>
          ) : (
            'Muat lebih banyak'
          )}
        </button>
      )}
    </div>
  )
}