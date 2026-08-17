'use client'

import { ChartBarDecreasing } from 'lucide-react'

import DebateList from '@/features/debates/components/debate-list'
import { useMyRelationshipDetails } from '@/features/relationship/queries'

export default function DebatesPage() {
  const { data, isLoading } = useMyRelationshipDetails()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-3 w-24 rounded-full bg-neutral-100" />
        <div className="mt-3 h-8 w-48 rounded-xl bg-neutral-100" />
        <div className="mt-6 h-64 rounded-[2rem] bg-neutral-100" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-neutral-400">
          You need to connect with your partner first.
        </p>
      </div>
    )
  }

  const relationshipId = data.relationship.id

  return (
  <div>
    {/* HEADER */}
    <div>
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-pink-50 sm:size-8">
          <ChartBarDecreasing
            size={13}
            className="text-blue-500 sm:hidden"
          />
          <ChartBarDecreasing
            size={15}
            className="hidden text-blue-500 sm:block"
          />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
          Mediator
        </p>
      </div>

      <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-neutral-800 sm:mt-4 sm:text-3xl lg:text-4xl">
        AI Debate
      </h1>

      <p className="mt-2 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
        Discuss things you disagree on with the help of a neutral AI mediator.
      </p>
    </div>

    {/* CONTENT */}
    <section className="mt-6 sm:mt-8">
      <DebateList relationshipId={relationshipId} />
    </section>
  </div>
)
}