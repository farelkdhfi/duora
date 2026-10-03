'use client'

import { useState } from 'react'
import { ChevronDown, History } from 'lucide-react'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import sadEmot from '@/assets/emoticon/sad-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'

import { useCheckinHistoryEntries } from '../queries'
import { CheckinHistoryModal } from './checkin-history-modal'

import type { DailyCheckin, Mood } from '../types'

interface CheckinCardProps {
  checkin: DailyCheckin
  name: string
}

const moodInfo: Record<Mood, { image: typeof happyEmot; label: string; background: string; border: string; glow: string; text: string; accent: string }> = {
  happy: {
    image: happyEmot,
    label: 'Happy',
    background: 'bg-amber-50/80',
    border: 'border-amber-200/50',
    glow: 'bg-amber-300/[0.12]',
    text: 'text-amber-700',
    accent: 'bg-amber-400',
  },
  neutral: {
    image: neutralEmot,
    label: 'Neutral',
    background: 'bg-neutral-100/80',
    border: 'border-neutral-200/70',
    glow: 'bg-neutral-300/[0.12]',
    text: 'text-neutral-600',
    accent: 'bg-neutral-500',
  },
  sad: {
    image: sadEmot,
    label: 'Sad',
    background: 'bg-blue-50/80',
    border: 'border-blue-200/50',
    glow: 'bg-blue-400/[0.10]',
    text: 'text-blue-700',
    accent: 'bg-blue-500',
  },
  tired: {
    image: tiredEmot,
    label: 'Tired',
    background: 'bg-violet-50/80',
    border: 'border-violet-200/50',
    glow: 'bg-violet-400/[0.10]',
    text: 'text-violet-700',
    accent: 'bg-violet-500',
  },
  stressed: {
    image: stressedEmot,
    label: 'Stressed',
    background: 'bg-rose-50/80',
    border: 'border-rose-200/50',
    glow: 'bg-rose-400/[0.10]',
    text: 'text-rose-700',
    accent: 'bg-rose-500',
  },
}

const detailConfig = [
  {
    key: 'liked_today',
    label: 'Liked today',
  },
  {
    key: 'disliked_today',
    label: "Didn't like today",
  },
  {
    key: 'needs_from_partner',
    label: 'Needs from partner',
  },
  {
    key: 'note',
    label: 'Note',
  },
] as const

export default function CheckinCard({ checkin, name }: CheckinCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const { data: historyEntries } = useCheckinHistoryEntries(checkin.id)
  const historyCount = historyEntries?.length ?? 0
  const hasMultipleChanges = historyCount > 1

  const mood = moodInfo[checkin.mood] ?? moodInfo.neutral

  const date = new Date(`${checkin.checkin_date}T00:00:00`)

  const details = detailConfig
    .map((detail) => {
      const value = checkin[detail.key as keyof DailyCheckin]

      return {
        ...detail,
        value,
      }
    })
    .filter((detail) => Boolean(detail.value))

  return (
    <>
      <article className="relative w-full overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white shadow-[0_25px_70px_-40px_rgba(0,0,0,0.22)] transition-shadow duration-300 hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.28)] sm:rounded-[2rem]">

        <div className={`pointer-events-none absolute -right-24 -top-24 size-64 rounded-full blur-[110px] ${mood.glow}`} />

        <div className="relative p-5 sm:p-7 lg:p-8">
          {/* COLLAPSED HEADER */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="group flex w-full items-center gap-4 text-left"
            aria-expanded={isExpanded}
          >
            {/* Mood */}
            <div className={``}>
              <img src={mood.image.src} alt="" className="size-20 object-contain sm:size-9" />
            </div>

            {/* Name + date */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[14px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[15px]">
                  {name}
                </h2>

                <span className={`shrink-0 text-[9px] font-semibold ${mood.text}`}>
                  {mood.label}
                </span>
              </div>

              <time
                dateTime={checkin.checkin_date}
                className="mt-1 block text-[10px] font-medium text-neutral-400 sm:text-[11px]"
              >
                {date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            </div>

            {/* Expand */}
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden text-[10px] font-medium text-neutral-400 transition-colors group-hover:text-neutral-600 sm:block">
                {isExpanded ? 'Tutup' : 'Lihat selengkapnya'}
              </span>

              <div className="flex size-8 items-center justify-center rounded-full border border-black/20 bg-neutral-50 text-neutral-700 transition-all duration-300 group-hover:bg-neutral-100 group-hover:text-neutral-600">
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </button>

          {/* EXPANDED CONTENT */}
          <div className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${isExpanded ? 'mt-7 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}`}>
            <div className="min-h-0 overflow-hidden">
              {/* Stats */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <StatCard label="Energy" value={checkin.energy} progressClass="bg-neutral-900" />
                <StatCard label="Stress" value={checkin.stress} progressClass="bg-neutral-400" />
              </div>

              {/* Reflections */}
              {details.length > 0 && (
                <section className="mt-8">
                  <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                    <p className="text-[11px] font-semibold tracking-[-0.01em] text-neutral-700">
                      Reflection
                    </p>

                    <span className="text-[9px] uppercase tracking-[0.14em] text-neutral-300">
                      {details.length} {details.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>

                  <div className="divide-y divide-black/[0.045]">
                    {details.map((detail) => (
                      <div key={detail.key} className="py-4 first:pt-4 last:pb-1 sm:py-5">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                          {detail.label}
                        </p>

                        <p className="mt-2 break-words text-[12.5px] leading-[1.7] text-neutral-600 sm:text-[13px]">
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
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-neutral-100 py-3 text-sm text-black transition"
                  >
                    Lihat riwayat ({historyCount}x)
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
    <div className="rounded-[1.25rem] border border-black/[0.045] bg-neutral-50/70 px-4 py-4 sm:px-5 sm:py-[18px]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {label}
        </p>

        <p className="text-[13px] font-semibold tabular-nums tracking-[-0.02em] text-neutral-700">
          {value}
          <span className="ml-0.5 text-[10px] font-medium text-neutral-300">
            /10
          </span>
        </p>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-200/80">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}