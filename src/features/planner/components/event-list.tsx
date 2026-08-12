'use client'

import { CalendarDays, Sparkles } from 'lucide-react'

import { usePlannerEvents } from '../queries'
import EventCard from './event-card'

interface EventListProps {
  relationshipId: string
}

export default function EventList({
  relationshipId,
}: EventListProps) {
  const {
    data: events,
    isLoading,
    error,
  } = usePlannerEvents(relationshipId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-[26px] border border-black/[0.05] bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="h-3 w-20 rounded-full bg-[#E5E5EA]" />
                <div className="h-5 w-48 rounded-lg bg-[#E5E5EA]" />
              </div>

              <div className="h-9 w-9 rounded-full bg-[#F2F2F7]" />
            </div>

            <div className="mt-6 flex gap-3">
              <div className="h-8 w-24 rounded-xl bg-[#F2F2F7]" />
              <div className="h-8 w-20 rounded-xl bg-[#F2F2F7]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[24px] border border-[#FF3B30]/10 bg-[#FF3B30]/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#FF3B30]/10">
            <CalendarDays
              size={16}
              strokeWidth={2.25}
              className="text-[#FF3B30]"
            />
          </div>

          <div>
            <p className="text-[13px] font-semibold text-[#1C1C1E]">
              Couldn't load your plans
            </p>

            <p className="mt-1 text-[12px] leading-relaxed text-[#8E8E93]">
              {error.message}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!events?.length) {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_30px_-18px_rgba(0,0,0,0.12)]">
        {/* Ambient decoration */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#007AFF]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#FF6B8A]/[0.06] blur-3xl" />

        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#FF6B8A]/10 to-[#007AFF]/10">
          <CalendarDays
            size={22}
            strokeWidth={1.8}
            className="text-[#007AFF]"
          />
        </div>

        <h3 className="relative mt-5 text-[16px] font-semibold tracking-[-0.01em] text-[#1C1C1E]">
          Nothing planned yet
        </h3>

        <p className="relative mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-[#8E8E93]">
          Create your first plan and give yourselves something
          beautiful to look forward to.
        </p>

        <div className="relative mt-5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#8E8E93]">
          <Sparkles
            size={12}
            className="text-[#FF6B8A]"
          />

          <span>Make memories together</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  )
}