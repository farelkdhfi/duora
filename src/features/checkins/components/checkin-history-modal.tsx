'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

import happyEmot from '@/assets/emoticon/happy-fluffy.webp'
import neutralEmot from '@/assets/emoticon/neutral-fluffy.webp'
import sadEmot from '@/assets/emoticon/sad-fluffy.webp'
import tiredEmot from '@/assets/emoticon/tired-fluffy.webp'
import stressedEmot from '@/assets/emoticon/stressed-fluffy.webp'

import { useCheckinHistoryEntries } from '../queries'
import type { Mood } from '../types'

interface CheckinHistoryModalProps {
  checkinId: string
  displayName: string
  onClose: () => void
}

const moodInfo: Record<Mood, { image: typeof happyEmot; label: string; background: string; border: string; text: string; glow: string }> = {
  happy: {
    image: happyEmot,
    label: 'Bahagia',
    background: 'bg-pink-500/10',
    border: 'border-pink-400/20',
    text: 'text-pink-400',
    glow: 'bg-pink-300/[0.10]',
  },
  neutral: {
    image: neutralEmot,
    label: 'Biasa aja',
    background: 'bg-subprimary/80',
    border: 'border-white/[0.08]',
    text: 'text-description',
    glow: 'bg-neutral-300/[0.10]',
  },
  sad: {
    image: sadEmot,
    label: 'Sedih',
    background: 'bg-blue-500/10',
    border: 'border-blue-400/20',
    text: 'text-blue-400',
    glow: 'bg-blue-400/[0.08]',
  },
  tired: {
    image: tiredEmot,
    label: 'Capek',
    background: 'bg-violet-500/10',
    border: 'border-violet-400/20',
    text: 'text-violet-400',
    glow: 'bg-violet-400/[0.08]',
  },
  stressed: {
    image: stressedEmot,
    label: 'Stres',
    background: 'bg-rose-500/10',
    border: 'border-rose-400/20',
    text: 'text-rose-400',
    glow: 'bg-rose-400/[0.08]',
  },
}

const detailConfig = [
  { key: 'liked_today', label: 'Yang disukai hari ini' },
  { key: 'disliked_today', label: 'Yang tidak disukai hari ini' },
  { key: 'needs_from_partner', label: 'Butuh dari pasangan' },
  { key: 'note', label: 'Catatan' },
] as const

export function CheckinHistoryModal({
  checkinId,
  displayName,
  onClose,
}: CheckinHistoryModalProps) {
  const { data: entries, isLoading } = useCheckinHistoryEntries(checkinId)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md sm:p-6">
      <div className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-white/[0.06] bg-primary shadow-[0_35px_100px_-35px_rgba(0,0,0,0.35)] sm:rounded-[2.25rem]">
        <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-pink-300/[0.08] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-blue-300/[0.06] blur-[110px]" />

        {/* HEADER */}
        <div className="relative shrink-0 border-b border-white/[0.06] px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-description">
                Check-in history
              </p>

              <h3 className="mt-1.5 text-[20px] font-semibold tracking-[-0.045em] text-secondary sm:text-[22px]">
                Perjalanan mood {displayName}
              </h3>

              <p className="mt-1 text-[11px] leading-relaxed text-description">
                Lihat perubahan check-in yang tersimpan hari ini.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-subprimary text-description shadow-[0_5px_20px_-12px_rgba(0,0,0,0.25)] transition-all hover:bg-subprimary/80 hover:text-secondary"
              aria-label="Tutup"
            >
              <X size={15} strokeWidth={1.8} />
            </button>
          </div>

          {entries && entries.length > 0 && (
            <div className="mt-5 flex items-center gap-2">
              <span className="rounded-full border border-white/[0.06] bg-subprimary px-3 py-1.5 text-[9px] font-semibold text-description shadow-[0_5px_20px_-15px_rgba(0,0,0,0.25)]">
                {entries.length} perubahan
              </span>

              <span className="text-[9px] text-description">
                •
              </span>

              <span className="text-[9px] font-medium text-description">
                Hari ini
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="relative min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {isLoading ? (
            <div className="flex min-h-48 flex-col items-center justify-center">
              <span className="size-7 animate-spin rounded-full border-2 border-white/[0.12] border-t-secondary" />
              <p className="mt-3 text-[11px] font-medium text-description">
                Memuat riwayat...
              </p>
            </div>
          ) : !entries || entries.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full border border-white/[0.06] bg-subprimary text-description shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)]">
                <span className="text-xl">—</span>
              </div>

              <p className="mt-4 text-[12px] font-semibold text-secondary">
                Belum ada riwayat
              </p>

              <p className="mt-1 max-w-[240px] text-[10px] leading-relaxed text-description">
                Perubahan pada check-in ini akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute bottom-6 left-[18px] top-6 w-px bg-white/[0.06]" />

              <div className="space-y-3">
                {entries.map((entry, index) => {
                  const isLatest = index === entries.length - 1
                  const isExpanded = expandedId === entry.id

                  const date = new Date(entry.changed_at)

                  const time = date.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  const details = detailConfig
                    .map((detail) => ({
                      ...detail,
                      value: entry[detail.key as keyof typeof entry],
                    }))
                    .filter((detail) => Boolean(detail.value))

                  const hasDetails = details.length > 0
                  const mood = moodInfo[entry.mood] ?? moodInfo.neutral

                  return (
                    <div key={entry.id} className="relative pl-10">
                      {/* TIMELINE DOT */}
                      <div className={`absolute left-0 top-5 z-10 flex size-9 items-center justify-center rounded-full border ${isLatest ? 'border-white/[0.12] bg-subprimary shadow-[0_5px_20px_-8px_rgba(0,0,0,0.3)]' : 'border-white/[0.06] bg-primary'}`}>
                        <div className={`size-2 rounded-full ${isLatest ? 'bg-secondary' : 'bg-description/50'}`} />
                      </div>

                      <div className={`relative overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${isLatest ? 'border-white/[0.08] bg-subprimary shadow-[0_18px_50px_-30px_rgba(0,0,0,0.28)]' : 'border-white/[0.05] bg-subprimary/60'}`}>
                        <div className={`pointer-events-none absolute -right-12 -top-12 size-32 rounded-full blur-[55px] ${mood.glow}`} />

                        <button
                          type="button"
                          onClick={() => hasDetails && toggleExpand(entry.id)}
                          disabled={!hasDetails}
                          className={`relative flex w-full items-center gap-3.5 px-4 py-4 text-left sm:px-5 ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <div className={`flex size-11 shrink-0 items-center justify-center rounded-[1rem] border ${mood.background} ${mood.border}`}>
                            <img src={mood.image.src} alt="" className="size-8 object-contain" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={`text-[12px] font-semibold ${mood.text}`}>
                                {mood.label}
                              </p>

                              {isLatest && (
                                <span className="rounded-full bg-secondary px-2 py-0.5 text-[8px] font-semibold text-primary">
                                  Terbaru
                                </span>
                              )}
                            </div>

                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-[9px] font-medium text-description">
                                {time}
                              </span>

                              <span className="text-[9px] text-description/50">
                                •
                              </span>

                              <span className="text-[9px] font-medium text-description">
                                Energi {entry.energy}/10
                              </span>

                              <span className="hidden text-[9px] text-description/50 sm:inline">
                                •
                              </span>

                              <span className="hidden text-[9px] font-medium text-description sm:inline">
                                Stres {entry.stress}/10
                              </span>
                            </div>
                          </div>

                          {hasDetails && (
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-primary text-description transition-colors hover:bg-primary/80 hover:text-secondary">
                              <ChevronDown
                                size={13}
                                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                          )}
                        </button>

                        {isExpanded && hasDetails && (
                          <div className="border-t border-white/[0.05] px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
                            <div className="divide-y divide-white/[0.05]">
                              {details.map((detail) => (
                                <div key={detail.key} className="py-3 first:pt-3 last:pb-0">
                                  <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-description">
                                    {detail.label}
                                  </p>

                                  <p className="mt-1.5 break-words text-[11.5px] leading-[1.7] text-description">
                                    {String(detail.value)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {!hasDetails && (
                          <div className="px-4 pb-4 sm:px-5">
                            <p className="text-[9px] text-description">
                              Tidak ada catatan tambahan
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {!isLoading && entries && entries.length > 0 && (
          <div className="relative shrink-0 border-t border-white/[0.05] px-5 py-4 sm:px-7">
            <p className="text-center text-[9px] font-medium tracking-wide text-description">
              Riwayat perubahan check-in hari ini
            </p>
          </div>
        )}
      </div>
    </div>
  )
}