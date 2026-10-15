'use client'

import { ChartBarDecreasing } from 'lucide-react'

import DebateList from '@/features/debates/components/debate-list'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import HeaderWithoutShell from '@/components/layout/header-without-shell'

export default function DebatesPage() {
  const { data, isLoading } = useMyRelationshipDetails()

  if (isLoading) {
    return (
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-pink-300/[0.08] blur-[80px]" />
        <div className="pointer-events-none absolute -left-20 top-1/3 size-48 rounded-full bg-blue-300/[0.06] blur-[80px]" />

        <div className="animate-pulse">
          <div className="h-3 w-24 rounded-full bg-white/[0.06]" />
          <div className="mt-3 h-8 w-48 rounded-xl bg-white/[0.06]" />
          <div className="mt-6 h-40 rounded-[2rem] bg-white/[0.06]" />
          <div className="mt-3 h-40 rounded-[2rem] bg-white/[0.06]" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/10 bg-primary text-description shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)]">
            <ChartBarDecreasing size={18} strokeWidth={1.6} />
          </div>

          <p className="mt-4 text-sm text-description">
            You need to connect with your partner first.
          </p>
        </div>
      </div>
    )
  }

  const relationshipId = data.relationship.id

  return (
    <div className="relative flex min-h-full flex-col bg-primary overflow-hidden p-4 sm:p-5 md:p-6">
      <div className="relative flex flex-1 flex-col">
        <HeaderWithoutShell title='AI Debates' text='Resolve disagreements' />
        <section className="mt-6 flex flex-1 flex-col sm:mt-8">
          <DebateList relationshipId={relationshipId} />
        </section>
      </div>
    </div>
  )
}