'use client'

import { useState } from 'react'
import { Plus, CalendarDays } from 'lucide-react'

import { useMyRelationshipDetails } from '@/features/relationship/queries'
import EventList from '@/features/planner/components/event-list'
import CreateEventFormModal from '@/features/planner/components/create-event-form-modal'
import { usePlannerRealtime } from '@/features/planner/use-planner-realtime'

export default function PlannerPage() {
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading } = useMyRelationshipDetails()

  const relationshipId = data?.relationship?.id

  usePlannerRealtime({
    relationshipId: relationshipId ?? '',
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">
            <CalendarDays
              size={17}
              className="animate-pulse text-blue-500"
            />
          </div>

          <p className="text-sm text-neutral-400">
            Loading your plans...
          </p>
        </div>
      </div>
    )
  }

  if (!relationshipId) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">

        {/* Ambient */}

        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />


        <div className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white/80 p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8">

          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-100/50 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-100/40 blur-3xl" />


          <div className="relative">

            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 sm:size-12">
              <CalendarDays
                size={19}
                strokeWidth={1.8}
                className="text-blue-500"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-neutral-800 sm:text-xl">
              Connect with your partner
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-neutral-400 sm:text-sm">
              Connect your relationship first to start
              planning meaningful moments together.
            </p>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="relative">

      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">

        <div>

          <div className="flex items-center gap-2">

            <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50 sm:size-8">
              <CalendarDays
                size={13}
                strokeWidth={2}
                className="text-blue-500 sm:hidden"
              />
              <CalendarDays
                size={15}
                strokeWidth={2}
                className="hidden text-blue-500 sm:block"
              />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
              Together
            </p>

          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-800 sm:mt-4 sm:text-3xl lg:text-4xl">
            Couple Planner
          </h1>

          <p className="mt-2 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
            Plan the moments you want to remember.
          </p>

        </div>


        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0 sm:w-auto"
        >
          <Plus
            size={16}
            strokeWidth={2.4}
            className="transition-transform duration-200 group-hover:rotate-90"
          />

          Add event
        </button>

      </div>


      {/* =================================================== */}
      {/* EVENTS */}
      {/* =================================================== */}

      <section className="mt-6 sm:mt-8">

        <div className="mb-4">

          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
            Upcoming
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-neutral-800 sm:text-lg">
            What's coming up
          </h2>

        </div>

        <EventList relationshipId={relationshipId} />

      </section>


      {/* ===================================================== */}
      {/* CREATE EVENT MODAL */}
      {/* ===================================================== */}

      <CreateEventFormModal
        relationshipId={relationshipId}
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

    </div>
  )
}