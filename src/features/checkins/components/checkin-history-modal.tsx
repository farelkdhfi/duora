// checkin/components/checkin-history-modal.tsx

'use client'

import { useState } from 'react'
import { X, Clock, ChevronDown } from 'lucide-react'
import { useCheckinHistoryEntries } from '../queries'
import type { Mood } from '../types'

interface CheckinHistoryModalProps {
  checkinId: string
  displayName: string
  onClose: () => void
}

const moodLabel: Record<Mood, string> = {
  happy: 'Bahagia',
  neutral: 'Biasa aja',
  sad: 'Sedih',
  tired: 'Capek',
  stressed: 'Stres',
}

const moodEmoji: Record<Mood, string> = {
  happy: '😄',
  neutral: '😐',
  sad: '😢',
  tired: '😴',
  stressed: '😩',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
              Riwayat perubahan
            </p>
            <h3 className="mt-1 text-base font-semibold text-neutral-800">
              {displayName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-black/[0.03] hover:text-neutral-700"
          >
            <X size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-neutral-400">
            <span className="size-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-400" />
            Memuat riwayat...
          </div>
        ) : !entries || entries.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-400">
            Belum ada riwayat perubahan.
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const isLatest = index === entries.length - 1
              const isExpanded = expandedId === entry.id

              const time = new Date(entry.changed_at).toLocaleTimeString('id-ID', {
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

              return (
                <div
                  key={entry.id}
                  className={`overflow-hidden rounded-xl border transition-all ${
                    isLatest
                      ? 'border-pink-200 bg-pink-50/50'
                      : 'border-black/[0.05] bg-neutral-50'
                  }`}
                >
                  {/* Header - selalu tampil, bisa diklik kalau ada detail */}
                  <button
                    type="button"
                    onClick={() => hasDetails && toggleExpand(entry.id)}
                    disabled={!hasDetails}
                    className={`flex w-full items-center justify-between p-4 text-left ${
                      hasDetails ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{moodEmoji[entry.mood]}</span>
                      <span className="text-sm font-medium text-neutral-700">
                        {moodLabel[entry.mood]}
                      </span>
                      {isLatest && (
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-semibold text-pink-600">
                          Terbaru
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                        <Clock size={10} />
                        {time}
                      </div>

                      {hasDetails && (
                        <ChevronDown
                          size={14}
                          className={`text-neutral-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                  </button>

                  {/* Stats - selalu tampil */}
                  <div className="flex gap-3 px-4 pb-3 text-[11px] text-neutral-500">
                    <span>Energi: {entry.energy}/10</span>
                    <span>Stres: {entry.stress}/10</span>
                  </div>

                  {/* Detail lengkap - hanya tampil kalau di-expand */}
                  {isExpanded && hasDetails && (
                    <div className="space-y-3 border-t border-black/[0.05] bg-white/60 px-4 py-3">
                      {details.map((detail) => (
                        <div key={detail.key}>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                            {detail.label}
                          </p>
                          <p className="mt-1 break-words text-[12px] leading-[1.6] text-neutral-600">
                            {String(detail.value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {!hasDetails && (
                    <p className="px-4 pb-3 text-[10px] italic text-neutral-300">
                      Tidak ada catatan tambahan
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <p className="mt-4 text-center text-[10px] text-neutral-300">
          {entries?.length ?? 0} kali perubahan hari ini
        </p>
      </div>
    </div>
  )
}