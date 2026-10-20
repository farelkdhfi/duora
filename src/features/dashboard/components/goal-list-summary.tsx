'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, Target } from 'lucide-react'

import DarkCardShell from '@/components/ui/dark-card-shell'
import { getSavingErrorKey } from '@/features/savings/errors'
import { useGoalsWithSavingsSummary } from '@/features/savings/queries'
import { useRupiah } from '@/lib/use-rupiah'

interface GoalListProps {
  relationshipId: string
}

const openButtonClass =
  'flex size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/10 text-neutral-300 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900'

const panelClass =
  'relative mt-4 flex-1  px-3'

function CardHeader({ withLink = false }: { withLink?: boolean }) {
  const t = useTranslations('dashboard.goals')

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <h2 className="break-words text-sm font-medium text-neutral-50">
          {t('title')}
        </h2>
      </div>

      {withLink && (
        <Link href="/goals" aria-label={t('open')} className={openButtonClass}>
          <ArrowUpRight size={14} strokeWidth={2.2} />
        </Link>
      )}
    </div>
  )
}

export default function GoalListSummary({ relationshipId }: GoalListProps) {
  const t = useTranslations('dashboard.goals')
  const te = useTranslations('savings.errors')
  const { rupiahCompact } = useRupiah()

  const {
    data: goals,
    isLoading,
    error,
  } = useGoalsWithSavingsSummary(relationshipId)

  if (isLoading) {
    return (
      <DarkCardShell variant="sky" compact>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="h-4 w-24 animate-pulse rounded-lg bg-white/[0.08]" />
          </div>

          <div className="size-8 shrink-0 animate-pulse rounded-full bg-white/[0.05]" />
        </div>

        <div className={`${panelClass} animate-pulse py-4`}>
          <div className="h-3 w-16 rounded-full bg-white/[0.08]" />
          <div className="mt-3 h-6 w-24 rounded-lg bg-white/[0.08]" />
          <div className="mt-2.5 h-3 w-20 rounded-full bg-white/[0.05]" />
        </div>
      </DarkCardShell>
    )
  }

  if (error) {
    return (
      <DarkCardShell variant="sky" compact>
        <h3 className="break-words text-sm font-medium leading-snug tracking-[-0.04em] text-neutral-50">
          {t('loadError')}
        </h3>

        <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
          {te(getSavingErrorKey(error))}
        </p>
      </DarkCardShell>
    )
  }

  if (!goals?.length) {
    return (
      <DarkCardShell variant="sky" compact>
        <CardHeader />

        <div
          className={`${panelClass} flex flex-col items-center justify-center py-5 text-center`}
        >
          <div className="relative flex size-12 items-center justify-center">
            <svg
              className="pointer-events-none absolute inset-0 size-full"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="22" stroke="#ffffff" strokeOpacity=".1" />
              <circle
                cx="32"
                cy="32"
                r="27"
                stroke="#8fc2ff"
                strokeOpacity=".35"
                strokeDasharray="2 6"
              />
              <circle cx="14" cy="25" r="1.7" fill="#8fc2ff" fillOpacity=".7" />
              <circle cx="49" cy="40" r="1.7" fill="#7ee0f2" fillOpacity=".7" />
            </svg>

            <Target
              size={17}
              strokeWidth={1.4}
              className="relative text-neutral-400"
            />
          </div>

          <h3 className="mt-3 text-[13px] font-medium tracking-[-0.03em] text-neutral-50">
            {t('emptyTitle')}
          </h3>

          <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
            {t('emptyDescription')}
          </p>
        </div>
      </DarkCardShell>
    )
  }

  const totalSavings = goals.reduce(
    (goalSum, goal) =>
      goalSum +
      goal.savings.reduce((sum, saving) => sum + saving.amount, 0),
    0,
  )

  return (
    <DarkCardShell variant="sky" compact>
      <CardHeader withLink />

      <div className={`${panelClass} flex flex-col justify-center py-4`}>
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">
          {t('totalSavings')}
        </p>

        <p className="mt-1.5 break-words text-xl font-semibold tracking-[-0.04em] text-neutral-50">
          {rupiahCompact(totalSavings)}
        </p>

        <p className="mt-1.5 text-[10px] text-neutral-500">
          {t('acrossGoals', { count: goals.length })}
        </p>
      </div>
    </DarkCardShell>
  )
}