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
    label: (m) => `created a new goal "${m.goal_title}"`,
  },

  goal_updated: {
    icon: Target,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: (m) => `updated the goal "${m.goal_title}"`,
  },

  goal_deleted: {
    icon: Target,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) => `deleted the goal "${m.goal_title}"`,
  },

  saving_added: {
    icon: Wallet,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    label: (m) =>
      `saved Rp ${Number(m.amount).toLocaleString(
        'id-ID',
      )} for "${m.goal_title}"`,
  },

  saving_deleted: {
    icon: Wallet,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) =>
      `deleted savings of Rp ${Number(m.amount).toLocaleString(
        'id-ID',
      )} from "${m.goal_title}"`,
  },

  checkin_added: {
    icon: Smile,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    label: () => `completed today's mood check-in`,
  },

  checkin_updated: {
    icon: Smile,
    color: 'text-amber-400',
    bg: 'bg-amber-50',
    label: () => `updated their mood check-in`,
  },

  plan_created: {
    icon: CalendarCheck,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: (m) => `created a plan "${m.plan_title}"`,
  },

  plan_updated: {
    icon: CalendarCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-50',
    label: (m) => `updated the plan "${m.plan_title}"`,
  },

  plan_deleted: {
    icon: CalendarCheck,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) => `deleted the plan "${m.plan_title}"`,
  },

  checklist_completed: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    label: (m) =>
      `completed "${m.checklist_title}" in the goal "${m.goal_title}"`,
  },

  checklist_uncompleted: {
    icon: Circle,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) =>
      `unchecked "${m.checklist_title}" in the goal "${m.goal_title}"`,
  },

  note_created: {
    icon: StickyNote,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    label: (m) => `created a note "${m.note_title}"`,
  },

  note_updated: {
    icon: StickyNote,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: (m) => `updated the note "${m.note_title}"`,
  },

  note_deleted: {
    icon: StickyNote,
    color: 'text-neutral-400',
    bg: 'bg-neutral-100',
    label: (m) => `deleted the note "${m.note_title}"`,
  },
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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
  const config = activityConfig[activity.type]
  const Icon = config.icon

  const actorName =
    activity.actor.display_name ??
    activity.actor.username ??
    'Someone'

  return (
    <div className="group relative flex gap-4">
      {/* TIMELINE */}

      <div className="relative flex w-9 shrink-0 justify-center">
        {!isLast && (
          <div
            className="
              absolute
              left-1/2
              top-9
              bottom-0
              w-px
              -translate-x-1/2
              bg-gradient-to-b
              from-neutral-200
              to-neutral-100
            "
          />
        )}

        <div
          className={`
            relative
            z-10
            flex
            size-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-white
            shadow-[0_4px_14px_rgba(0,0,0,0.06)]
            transition-all
            duration-300
            group-hover:-translate-y-0.5
            group-hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]
            ${config.bg}
          `}
        >
          <Icon
            size={15}
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
          ${!isLast
            ? 'border-b border-black/[0.035]'
            : ''
          }
        `}
      >
        <div
          className="
            -mx-2
            rounded-xl
            px-2
            py-1.5
            transition-colors
            duration-200
            group-hover:bg-neutral-50/70
          "
        >
          <div className="flex items-start gap-4">
            <p
              className="
                min-w-0
                flex-1
                text-[12.5px]
                leading-[1.65]
                tracking-[-0.01em]
                text-neutral-500
              "
            >
              <span className="font-semibold text-neutral-900">
                {actorName}
              </span>{' '}
              {config.label(activity.metadata)}
            </p>

            <span
              className="
                shrink-0
                pt-0.5
                text-[10px]
                font-medium
                tracking-[-0.01em]
                text-neutral-300
              "
            >
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
          <div
            key={item}
            className="relative flex gap-4"
          >
            {/* ICON */}

            <div className="relative flex w-9 shrink-0 justify-center">
              {index !== 4 && (
                <div
                  className="
                    absolute
                    left-1/2
                    top-9
                    bottom-0
                    w-px
                    -translate-x-1/2
                    bg-neutral-100
                  "
                />
              )}

              <div
                className="
                  relative
                  z-10
                  size-9
                  rounded-xl
                  bg-neutral-100
                  animate-pulse
                "
              />
            </div>

            {/* CONTENT */}

            <div
              className={`
                min-w-0
                flex-1
                pb-5
                ${index !== 4
                  ? 'border-b border-black/[0.035]'
                  : ''
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2 py-1">
                  <div className="h-2.5 w-[78%] animate-pulse rounded-full bg-neutral-100" />
                  <div className="h-2.5 w-[42%] animate-pulse rounded-full bg-neutral-100" />
                </div>

                <div className="h-2.5 w-10 shrink-0 animate-pulse rounded-full bg-neutral-100" />
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
  return (
    <div className="px-6 py-14">
      <div className="flex flex-col items-center text-center">
        <div
          className="
            relative
            flex
            size-14
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            border
            border-black/[0.04]
            bg-neutral-50
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          "
        >
          <div
            className="
              absolute
              -right-4
              -top-4
              size-10
              rounded-full
              bg-pink-100
              blur-xl
            "
          />

          <div
            className="
              absolute
              -bottom-4
              -left-4
              size-10
              rounded-full
              bg-blue-100
              blur-xl
            "
          />

          <ListChecks
            size={19}
            strokeWidth={1.7}
            className="relative text-neutral-400"
          />
        </div>

        <h3
          className="
            mt-5
            text-[13px]
            font-semibold
            tracking-[-0.025em]
            text-neutral-800
          "
        >
          No activity yet
        </h3>

        <p
          className="
            mt-2
            max-w-[250px]
            text-[11.5px]
            leading-5
            tracking-[-0.005em]
            text-neutral-400
          "
        >
          All activities from you and your partner
          will appear here.
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
        <div
          className="
            mx-auto
            flex
            size-10
            items-center
            justify-center
            rounded-xl
            bg-neutral-50
          "
        >
          <Circle
            size={16}
            className="text-neutral-300"
          />
        </div>

        <p
          className="
            mt-3
            text-[12px]
            leading-5
            text-neutral-400
          "
        >
          {error.message}
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
            isLast={
              index === activities.length - 1
            }
          />
        ))}
      </div>

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-black/[0.055]
            bg-white
            py-2.5
            text-[11px]
            font-semibold
            tracking-[-0.01em]
            text-neutral-500
            shadow-[0_3px_12px_rgba(0,0,0,0.025)]
            transition-all
            duration-200
            hover:border-black/[0.08]
            hover:bg-neutral-50
            hover:text-neutral-700
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isFetchingNextPage ? (
            <>
              <Loader2
                size={13}
                className="animate-spin"
              />
              Loading activities...
            </>
          ) : (
            'Load more'
          )}
        </button>
      )}
    </div>
  )
}