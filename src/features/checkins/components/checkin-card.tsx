'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'

import happyEmot from '@/assets/emoticon/happy-fluffy.webp'
import neutralEmot from '@/assets/emoticon/neutral-fluffy.webp'
import sadEmot from '@/assets/emoticon/sad-fluffy.webp'
import tiredEmot from '@/assets/emoticon/tired-fluffy.webp'
import stressedEmot from '@/assets/emoticon/stressed-fluffy.webp'

import { useCheckinHistoryEntries } from '../queries'
import { CheckinHistoryModal } from './checkin-history-modal'

import type { DailyCheckin, Mood } from '../types'

interface CheckinCardProps {
  checkin: DailyCheckin
  name: string
}

// Label mood diambil dari messages: tm(mood)
const moodInfo: Record<
  Mood,
  {
    image: typeof happyEmot
    background: string
    border: string
    glow: string
    text: string
    accent: string
  }
> = {
  happy: {
    image: happyEmot,
    background: 'bg-pink-500/10',
    border: 'border-pink-400/20',
    glow: 'bg-pink-300/[0.12]',
    text: 'text-pink-400',
    accent: 'bg-pink-400',
  },
  neutral: {
    image: neutralEmot,
    background: 'bg-subprimary/80',
    border: 'border-white/[0.08]',
    glow: 'bg-neutral-300/[0.12]',
    text: 'text-description',
    accent: 'bg-neutral-500',
  },
  sad: {
    image: sadEmot,
    background: 'bg-blue-500/10',
    border: 'border-blue-400/20',
    glow: 'bg-blue-400/[0.10]',
    text: 'text-blue-400',
    accent: 'bg-blue-500',
  },
  tired: {
    image: tiredEmot,
    background: 'bg-violet-500/10',
    border: 'border-violet-400/20',
    glow: 'bg-violet-400/[0.10]',
    text: 'text-violet-400',
    accent: 'bg-violet-500',
  },
  stressed: {
    image: stressedEmot,
    background: 'bg-red-500/10',
    border: 'border-red-400/20',
    glow: 'bg-red-400/[0.10]',
    text: 'text-red-400',
    accent: 'bg-red-500',
  },
}

// Label tiap kolom ada di messages: td(key)
const detailKeys = [
  'liked_today',
  'disliked_today',
  'needs_from_partner',
  'note',
] as const

export default function CheckinCard({
  checkin,
  name,
}: CheckinCardProps) {
  const t = useTranslations('checkins.card')
  const td = useTranslations('checkins.details')
  const tm = useTranslations('checkins.moods')
  const format = useFormatter()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const { data: historyEntries } = useCheckinHistoryEntries(checkin.id)

  const historyCount = historyEntries?.length ?? 0
  const hasMultipleChanges = historyCount > 1

  const moodKey: Mood = checkin.mood in moodInfo ? checkin.mood : 'neutral'
  const mood = moodInfo[moodKey]

  /*
   * Reset loading state whenever the mood changes.
   */
  useEffect(() => {
    setImageLoaded(false)

    const image = new Image()

    image.src = mood.image.src

    const handleLoad = () => {
      setImageLoaded(true)
    }

    image.onload = handleLoad

    /*
     * If the image is already cached by the browser,
     * complete can already be true immediately.
     */
    if (image.complete) {
      setImageLoaded(true)
    }

    return () => {
      image.onload = null
    }
  }, [mood.image.src])

  // checkin_date itu tanggal murni (YYYY-MM-DD): parse & format sebagai UTC
  // supaya tanggalnya nggak geser karena timezone.
  const dateLabel = format.dateTime(
    new Date(`${checkin.checkin_date}T00:00:00Z`),
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    },
  )

  const details = detailKeys
    .map((key) => ({
      key,
      value: checkin[key],
    }))
    .filter((detail) => Boolean(detail.value))

  return (
    <>
      <article className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-primary shadow-[0_25px_70px_-40px_rgba(0,0,0,0.22)] transition-shadow duration-300 hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.28)] sm:rounded-[2rem]">
        <div className={`pointer-events-none absolute -right-24 -top-24 size-64 rounded-full blur-[110px] ${mood.glow}`} />

        <div className="relative p-5 sm:p-7 lg:p-8">
          {/* COLLAPSED HEADER */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="group flex w-full items-center gap-4 text-left"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? t('collapse') : t('expand')}
          >
            {/* Mood */}
            <div className="relative flex size-20 shrink-0 items-center justify-center sm:size-9">
              {/* Loading */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-4 animate-spin rounded-full border-2 border-white/[0.12] border-t-description" />
                </div>
              )}

              {/* Mood Image */}
              <img
                src={mood.image.src}
                alt=""
                draggable={false}
                onLoad={() => setImageLoaded(true)}
                className={`size-20 object-contain brightness-110 transition-all duration-300 sm:size-9 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
              />
            </div>

            {/* Name + date */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[14px] font-semibold tracking-[-0.03em] text-secondary sm:text-[15px]">
                  {name}
                </h2>

                <span className={`shrink-0 text-[9px] font-semibold ${mood.text}`}>
                  {tm(moodKey)}
                </span>
              </div>

              <time
                dateTime={checkin.checkin_date}
                className="mt-1 block text-[10px] font-medium text-description sm:text-[11px]"
              >
                {dateLabel}
              </time>
            </div>

            {/* Expand */}
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden text-[10px] font-medium text-description transition-colors group-hover:text-secondary sm:block">
                {isExpanded ? t('collapse') : t('expand')}
              </span>

              <div className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-subprimary text-secondary transition-all duration-300 group-hover:bg-subprimary/80 group-hover:text-description">
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </button>

          {/* EXPANDED CONTENT */}
          <div
            className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${isExpanded ? 'mt-7 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}`}
          >
            <div className="min-h-0 overflow-hidden">
              {/* Stats */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <StatCard
                  label={t('energy')}
                  value={checkin.energy}
                  progressClass="bg-secondary"
                />

                <StatCard
                  label={t('stress')}
                  value={checkin.stress}
                  progressClass="bg-description"
                />
              </div>

              {/* Reflections */}
              {details.length > 0 && (
                <section className="mt-8">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <p className="text-[11px] font-semibold tracking-[-0.01em] text-secondary">
                      {t('reflection')}
                    </p>

                    <span className="text-[9px] uppercase tracking-[0.14em] text-description">
                      {t('entries', { count: details.length })}
                    </span>
                  </div>

                  <div className="divide-y divide-white/[0.05]">
                    {details.map((detail) => (
                      <div
                        key={detail.key}
                        className="py-4 first:pt-4 last:pb-1 sm:py-5"
                      >
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-description">
                          {td(detail.key)}
                        </p>

                        <p className="mt-2 break-words text-[12.5px] leading-[1.7] text-description sm:text-[13px]">
                          {String(detail.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* History */}
              {hasMultipleChanges && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-subprimary py-3 text-sm text-secondary transition"
                  >
                    {t('viewHistory', { count: historyCount })}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {isHistoryOpen && (
        <CheckinHistoryModal
          checkinId={checkin.id}
          displayName={name}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </>
  )
}

/* ============================================================= */
/* STAT CARD */
/* ============================================================= */

function StatCard({
  label,
  value,
  progressClass,
}: {
  label: string
  value: number
  progressClass: string
}) {
  const percentage = Math.min(Math.max(value, 0), 10) * 10

  return (
    <div className="rounded-[1.25rem] border border-white/[0.06] bg-subprimary/70 px-4 py-4 sm:px-5 sm:py-[18px]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-description">
          {label}
        </p>

        <p className="text-[13px] font-semibold tabular-nums tracking-[-0.02em] text-secondary">
          {value}
          <span className="ml-0.5 text-[10px] font-medium text-description">
            /10
          </span>
        </p>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-primary">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}