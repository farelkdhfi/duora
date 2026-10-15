'use client'

import { useState } from 'react'
import { Plus, CalendarDays } from 'lucide-react'

import { useMyRelationshipDetails } from '@/features/relationship/queries'
import EventList from '@/features/planner/components/event-list'
import CreateEventFormModal from '@/features/planner/components/create-event-form-modal'
import { usePlannerRealtime } from '@/features/planner/use-planner-realtime'
import Header from '@/components/layout/header'
import PlannerSkeleton from '@/features/planner/components/planner-skeleton'

export default function PlannerPage() {
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading } = useMyRelationshipDetails()

  const relationshipId = data?.relationship?.id

  usePlannerRealtime({
    relationshipId: relationshipId ?? '',
  })

  if (isLoading) {
    return <PlannerSkeleton />
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
              <CalendarDays size={19} strokeWidth={1.8} className="text-blue-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-neutral-800 sm:text-xl">
              Connect with your partner
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-neutral-400 sm:text-sm">
              Connect your relationship first to start planning meaningful moments together.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="relative">
        <Header
          title="planner"
          description="Plan the moments you want to remember."
        />

        <button
          type="button"
          onClick={() => setShowCreate(true)}
          aria-label="Create event"
          className="absolute right-0 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-800 text-white shadow-sm transition-all hover:border-black/[0.1] hover:bg-neutral-50 hover:text-black active:scale-95 sm:size-10 sm:rounded-[13px]"
        >
          <Plus size={18} strokeWidth={1.8} />
        </button>
      </div>

      <section className="mt-6 sm:mt-8">
        <EventList relationshipId={relationshipId} />
      </section>

      <CreateEventFormModal
        relationshipId={relationshipId}
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  )
}