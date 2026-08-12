'use client'

import { useState } from 'react'
import { Plus, X, CalendarDays } from 'lucide-react'

import { useMyRelationshipDetails } from '@/features/relationship/queries'
import EventList from '@/features/planner/components/event-list'
import CreateEventForm from '@/features/planner/components/create-event-form'
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
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">

        {/* Ambient */}

        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />


        <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/80 p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl">

          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-100/50 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-100/40 blur-3xl" />


          <div className="relative">

            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">
              <CalendarDays
                size={21}
                strokeWidth={1.8}
                className="text-blue-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-neutral-800">
              Connect with your partner
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-400">
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

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50">
              <CalendarDays
                size={15}
                strokeWidth={2}
                className="text-blue-500"
              />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
              Together
            </p>

          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-neutral-800 sm:text-4xl">
            Couple Planner
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">
            Plan the moments you want to remember.
          </p>

        </div>


        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="group flex h-11 items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0"
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

      <section className="mt-8">

        <div className="mb-4">

          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
            Upcoming
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
            What's coming up
          </h2>

        </div>

        <EventList relationshipId={relationshipId} />

      </section>


      {/* ===================================================== */}
      {/* CREATE EVENT MODAL */}
      {/* ===================================================== */}

      {showCreate && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/20 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCreate(false)
            }
          }}
        >

          <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.3)] backdrop-blur-xl">

            {/* Ambient */}

            <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-blue-100/40 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-pink-100/30 blur-3xl" />


            <div className="relative p-6 md:p-7">

              {/* ================================================= */}
              {/* MODAL HEADER */}
              {/* ================================================= */}

              <div className="flex items-start justify-between">

                <div className="flex items-start gap-3">

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-blue-50 to-pink-50">
                    <CalendarDays
                      size={17}
                      strokeWidth={2}
                      className="text-blue-500"
                    />
                  </div>

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
                      Together
                    </p>

                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
                      Create an event
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-neutral-400">
                      Add something worth looking forward
                      to together.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  aria-label="Close"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
                >
                  <X size={15} strokeWidth={2.3} />
                </button>

              </div>


              {/* ================================================= */}
              {/* FORM */}
              {/* ================================================= */}

              <div className="mt-7">
                <CreateEventForm
                  relationshipId={relationshipId}
                  onSuccess={() => setShowCreate(false)}
                />
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}