'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

import happyEmot from '@/assets/emoticon/happy-fluffy.png'
import neutralEmot from '@/assets/emoticon/neutral-fluffy.png'
import sadEmot from '@/assets/emoticon/sad-fluffy.png'
import tiredEmot from '@/assets/emoticon/tired-fluffy.png'
import stressedEmot from '@/assets/emoticon/stressed-fluffy.png'

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
    background: 'bg-amber-50/80',
    border: 'border-amber-200/50',
    text: 'text-amber-700',
    glow: 'bg-amber-300/[0.10]',
  },
  neutral: {
    image: neutralEmot,
    label: 'Biasa aja',
    background: 'bg-neutral-100/80',
    border: 'border-neutral-200/70',
    text: 'text-neutral-600',
    glow: 'bg-neutral-300/[0.10]',
  },
  sad: {
    image: sadEmot,
    label: 'Sedih',
    background: 'bg-blue-50/80',
    border: 'border-blue-200/50',
    text: 'text-blue-700',
    glow: 'bg-blue-400/[0.08]',
  },
  tired: {
    image: tiredEmot,
    label: 'Capek',
    background: 'bg-violet-50/80',
    border: 'border-violet-200/50',
    text: 'text-violet-700',
    glow: 'bg-violet-400/[0.08]',
  },
  stressed: {
    image: stressedEmot,
    label: 'Stres',
    background: 'bg-rose-50/80',
    border: 'border-rose-200/50',
    text: 'text-rose-700',
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

  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-md sm:p-6"> <div className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-black/[0.06] bg-[#fafaf9] shadow-[0_35px_100px_-35px_rgba(0,0,0,0.35)] sm:rounded-[2.25rem]"> <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-pink-300/[0.08] blur-[100px]" /> <div className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-blue-300/[0.06] blur-[110px]" />
    {/* HEADER */}
    <div className="relative shrink-0 border-b border-black/[0.05] px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
            Check-in history
          </p>

          <h3 className="mt-1.5 text-[20px] font-semibold tracking-[-0.045em] text-neutral-900 sm:text-[22px]">
            Perjalanan mood {displayName}
          </h3>

          <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
            Lihat perubahan check-in yang tersimpan hari ini.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white text-neutral-400 shadow-[0_5px_20px_-12px_rgba(0,0,0,0.25)] transition-all hover:bg-neutral-50 hover:text-neutral-700"
          aria-label="Tutup"
        >
          <X size={15} strokeWidth={1.8} />
        </button>
      </div>

      {entries && entries.length > 0 && (
        <div className="mt-5 flex items-center gap-2">
          <span className="rounded-full border border-black/[0.05] bg-white px-3 py-1.5 text-[9px] font-semibold text-neutral-500 shadow-[0_5px_20px_-15px_rgba(0,0,0,0.25)]">
            {entries.length} perubahan
          </span>

          <span className="text-[9px] text-neutral-300">
            •
          </span>

          <span className="text-[9px] font-medium text-neutral-400">
            Hari ini
          </span>
        </div>
      )}
    </div>

    {/* CONTENT */}
    <div className="relative min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
      {isLoading ? (
        <div className="flex min-h-48 flex-col items-center justify-center">
          <span className="size-7 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-700" />
          <p className="mt-3 text-[11px] font-medium text-neutral-400">
            Memuat riwayat...
          </p>
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full border border-black/[0.05] bg-white text-neutral-300 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)]">
            <span className="text-xl">—</span>
          </div>

          <p className="mt-4 text-[12px] font-semibold text-neutral-600">
            Belum ada riwayat
          </p>

          <p className="mt-1 max-w-[240px] text-[10px] leading-relaxed text-neutral-400">
            Perubahan pada check-in ini akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute bottom-6 left-[18px] top-6 w-px bg-black/[0.06]" />

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
                  <div className={`absolute left-0 top-5 z-10 flex size-9 items-center justify-center rounded-full border ${isLatest ? 'border-white bg-white shadow-[0_5px_20px_-8px_rgba(0,0,0,0.3)]' : 'border-black/[0.05] bg-[#fafaf9]'}`}>
                    <div className={`size-2 rounded-full ${isLatest ? 'bg-neutral-900' : 'bg-neutral-300'}`} />
                  </div>

                  <div className={`relative overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${isLatest ? 'border-black/[0.07] bg-white shadow-[0_18px_50px_-30px_rgba(0,0,0,0.28)]' : 'border-black/[0.045] bg-white/60'}`}>
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
                            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[8px] font-semibold text-white">
                              Terbaru
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[9px] font-medium text-neutral-400">
                            {time}
                          </span>

                          <span className="text-[9px] text-neutral-200">
                            •
                          </span>

                          <span className="text-[9px] font-medium text-neutral-400">
                            Energi {entry.energy}/10
                          </span>

                          <span className="hidden text-[9px] text-neutral-200 sm:inline">
                            •
                          </span>

                          <span className="hidden text-[9px] font-medium text-neutral-400 sm:inline">
                            Stres {entry.stress}/10
                          </span>
                        </div>
                      </div>

                      {hasDetails && (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/[0.05] bg-neutral-50 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700">
                          <ChevronDown
                            size={13}
                            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      )}
                    </button>

                    {isExpanded && hasDetails && (
                      <div className="border-t border-black/[0.045] px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
                        <div className="divide-y divide-black/[0.045]">
                          {details.map((detail) => (
                            <div key={detail.key} className="py-3 first:pt-3 last:pb-0">
                              <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                                {detail.label}
                              </p>

                              <p className="mt-1.5 break-words text-[11.5px] leading-[1.7] text-neutral-600">
                                {String(detail.value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!hasDetails && (
                      <div className="px-4 pb-4 sm:px-5">
                        <p className="text-[9px] text-neutral-300">
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
      <div className="relative shrink-0 border-t border-black/[0.045] px-5 py-4 sm:px-7">
        <p className="text-center text-[9px] font-medium tracking-wide text-neutral-300">
          Riwayat perubahan check-in hari ini
        </p>
      </div>
    )}
  </div>
  </div>

  )
}
