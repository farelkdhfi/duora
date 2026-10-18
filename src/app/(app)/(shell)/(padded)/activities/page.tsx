'use client'

import { useTranslations } from 'next-intl'

import ActivityFeed from '@/features/activities/components/activity-feed'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import Header from '@/components/layout/header'

export default function ActivitiesPage() {
  const t = useTranslations('activities.page')

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
          {t('noRelationship')}
        </p>
      </div>
    )
  }

  const relationshipId = data.relationship.id

  return (
    <div>
      {/* HEADER */}
      <Header
        title={t('title')}
        description={t('description')}
      />

      {/* ACTIVITY FEED */}
      <section className="mt-6 overflow-hidden rounded-[2rem] border border-black/[0.05] bg-subprimary sm:mt-8">
        <ActivityFeed relationshipId={relationshipId} />
      </section>
    </div>
  )
}