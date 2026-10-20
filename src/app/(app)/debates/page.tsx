'use client'

import { ChartBarDecreasing } from 'lucide-react'
import { useTranslations } from 'next-intl'

import DebateList from '@/features/debates/components/debate-list'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import HeaderWithoutShell from '@/components/layout/header-without-shell'

export default function DebatesPage() {
  const t = useTranslations('debates.page')

  const { data, isLoading } = useMyRelationshipDetails()

  if (isLoading) {
    return (
      <div className="relative flex min-h-full flex-col overflow-hidden bg-primary p-4 sm:p-5 md:p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-pink-300/[0.08] blur-[80px]" />
        <div className="pointer-events-none absolute -left-20 top-1/3 size-48 rounded-full bg-blue-300/[0.06] blur-[80px]" />

        <div className="relative flex flex-1 animate-pulse flex-col">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="h-2.5 w-20 rounded-full bg-subprimary" />

              <div className="mt-3 h-7 w-64 max-w-full rounded-lg bg-subprimary" />
            </div>

            <div className="size-10 shrink-0 rounded-full bg-subprimary" />
          </div>

          <section className="mt-6 flex flex-1 flex-col sm:mt-8">

            {/* ================================================= */}
            {/* FILTER */}
            {/* ================================================= */}

            <div className="flex">
              <div className="inline-flex gap-1 rounded-full border border-white/[0.06] bg-primary p-1">
                <div className="h-9 w-14 rounded-full bg-subprimary" />
                <div className="h-9 w-16 rounded-full bg-subprimary/50" />
                <div className="h-9 w-24 rounded-full bg-subprimary/50" />
                <div className="h-9 w-20 rounded-full bg-subprimary/50" />
              </div>
            </div>

            {/* ================================================= */}
            {/* META */}
            {/* ================================================= */}

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="h-3 w-36 rounded-full bg-subprimary" />

              <div className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-primary p-1">
                <div className="size-8 rounded-full bg-subprimary" />
                <div className="size-8 rounded-full bg-subprimary/50" />
              </div>
            </div>

            {/* ================================================= */}
            {/* CAROUSEL */}
            {/* ================================================= */}

            <div className="mt-12 flex gap-4 overflow-hidden">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="relative flex h-[22rem] w-[80%] shrink-0 flex-col items-center justify-center rounded-[2rem] border border-white/[0.06] bg-subprimary"
                >
                  <div className="absolute right-4 top-4 size-8 rounded-full bg-primary/60" />

                  <div className="size-32 rounded-full bg-primary/60" />

                  <div className="mt-8 h-5 w-12 rounded-full bg-primary/60" />

                  <div className="mt-5 h-3 w-40 rounded-full bg-primary/60" />

                  <div className="mt-4 h-3 w-24 rounded-full bg-primary/60" />
                </div>
              ))}
            </div>

            {/* ================================================= */}
            {/* DOTS */}
            {/* ================================================= */}

            <div className="mt-6 flex items-center justify-center gap-1.5">
              <div className="h-1.5 w-6 rounded-full bg-subprimary" />
              <div className="size-1.5 rounded-full bg-subprimary" />
              <div className="size-1.5 rounded-full bg-subprimary" />
            </div>

            {/* ================================================= */}
            {/* CREATE BUTTON */}
            {/* ================================================= */}

            <div className="mx-auto mt-6 h-12 w-40 rounded-full bg-subprimary" />

          </section>
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
            {t('noRelationship')}
          </p>
        </div>
      </div>
    )
  }

  const relationshipId = data.relationship.id

  return (
    <div className="relative flex min-h-full flex-col bg-primary overflow-hidden p-4 sm:p-5 md:p-6">
      <div className="relative flex flex-1 flex-col">
        <HeaderWithoutShell title={t('title')} text={t('subtitle')} />
        <section className="mt-6 flex flex-1 flex-col sm:mt-8">
          <DebateList relationshipId={relationshipId} />
        </section>
      </div>
    </div>
  )
}