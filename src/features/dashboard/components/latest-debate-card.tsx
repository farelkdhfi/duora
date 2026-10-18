'use client'

import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
import { ArrowUpRight, Scale } from 'lucide-react'

import DarkCardShell from '@/components/ui/dark-card-shell'
import { useDebates } from '@/features/debates/queries'

interface LatestDebateCardProps {
  relationshipId: string
}

const openButtonClass =
  'flex size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/10 text-neutral-300 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900'

const panelClass =
  'relative mt-4 flex-1 px-3'

const STATUS_KEYS = ['active', 'pending_verdict', 'resolved'] as const
type StatusKey = (typeof STATUS_KEYS)[number]

const isStatusKey = (value: string): value is StatusKey =>
  (STATUS_KEYS as readonly string[]).includes(value)

function CardHeader() {
  const t = useTranslations('dashboard.debates')

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <h2 className="break-words text-sm font-medium text-neutral-50">
          {t('title')}
        </h2>
      </div>

      <Link
        href="/debates"
        aria-label={t('open')}
        className={openButtonClass}
      >
        <ArrowUpRight size={14} strokeWidth={2.2} />
      </Link>
    </div>
  )
}

export default function LatestDebateCard({
  relationshipId,
}: LatestDebateCardProps) {
  const t = useTranslations('dashboard.debates')
  const format = useFormatter()

  const { data: debates, isLoading, error } = useDebates(relationshipId)

  if (isLoading) {
    return (
      <DarkCardShell variant="white" compact>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="h-4 w-24 animate-pulse rounded-lg bg-white/[0.08]" />
          </div>

          <div className="size-8 shrink-0 animate-pulse rounded-full bg-white/[0.05]" />
        </div>

        <div className={`${panelClass} animate-pulse py-3`}>
          <div className="h-3 w-full rounded-full bg-white/[0.08]" />
          <div className="mt-2 h-3 w-2/3 rounded-full bg-white/[0.08]" />
          <div className="mt-3 h-3 w-16 rounded-full bg-white/[0.05]" />
        </div>
      </DarkCardShell>
    )
  }

  if (error) {
    // TODO i18n: error.message masih mentah, diganti error bertipe di Fase 6 (debates/api.ts)
    return (
      <DarkCardShell variant="white" compact>
        <h3 className="break-words text-sm font-medium leading-snug tracking-[-0.04em] text-neutral-50">
          {t('loadError')}
        </h3>

        <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
          {error.message}
        </p>
      </DarkCardShell>
    )
  }

  // getDebates sudah diurutkan created_at desc, jadi index 0 = terbaru
  const latest = debates?.[0]

  if (!latest) {
    return (
      <DarkCardShell variant="white" compact>
        <CardHeader />

        <div
          className={`${panelClass} flex flex-col items-center justify-center py-5 text-center`}
        >
          <Scale
            size={17}
            strokeWidth={1.4}
            className="text-neutral-400"
          />

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

  return (
    <DarkCardShell variant="white" compact>
      <CardHeader />

      <Link
        href={`/debates/${latest.id}`}
        className={`${panelClass} group flex flex-col justify-between py-3`}
      >
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 min-w-0 text-[13px] font-medium leading-snug tracking-[-0.035em] text-neutral-50">
              {latest.title}
            </h3>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            {isStatusKey(latest.status)
              ? t(`status.${latest.status}`)
              : latest.status}
          </span>

          <span className="text-[10px] tabular-nums text-neutral-500">
            {format.dateTime(new Date(latest.created_at), {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </Link>
    </DarkCardShell>
  )
}