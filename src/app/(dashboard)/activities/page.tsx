'use client'

import { ListChecks } from 'lucide-react'

import ActivityFeed from '@/features/activities/components/activity-feed'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import Header from '@/components/layout/header'

export default function ActivitiesPage() {
  const { data, isLoading } = useMyRelationshipDetails()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-3 w-24 rounded-full bg-neutral-100" />
        <div className="mt-3 h-8 w-48 rounded-xl bg-neutral-100" />
        <div className="mt-6 h-96 rounded-[2rem] bg-neutral-100" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-neutral-400">
          Kamu perlu terhubung dengan pasangan dulu.
        </p>
      </div>
    )
  }

  const relationshipId = data.relationship.id

  return (
    <div>
      {/* HEADER */}
      <Header 
      title='Activities'
      description='See the little moments and activities you share together.'
      icon={ListChecks}
      />

      {/* ACTIVITY FEED */}
      <section className="mt-6 overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_15px_50px_-30px_rgba(0,0,0,0.15)] sm:mt-8">
        <ActivityFeed relationshipId={relationshipId} />
      </section>
    </div>
  )
}