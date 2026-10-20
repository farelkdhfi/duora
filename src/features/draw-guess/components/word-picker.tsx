'use client'

import { Loader2 } from 'lucide-react'
import { useChooseDrawWord, useDrawChoices } from '../queries'
import type { DrawDifficulty } from '../types'

const LABEL: Record<DrawDifficulty, { text: string; cls: string }> = {
  easy: { text: 'Mudah', cls: 'bg-emerald-50 text-emerald-600' },
  medium: { text: 'Sedang', cls: 'bg-amber-50 text-amber-600' },
  hard: { text: 'Sulit', cls: 'bg-rose-50 text-rose-600' },
}

export default function WordPicker({ roundId }: { roundId: string }) {
  const { data: choices, isLoading } = useDrawChoices(roundId, true)
  const choose = useChooseDrawWord()

  if (isLoading || !choices) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="animate-spin text-neutral-300" />
      </div>
    )
  }

  return (
    <div className="rounded-[2rem] border border-black/[0.06] bg-white p-6 text-center shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Giliranmu menggambar</p>
      <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em]">Pilih satu kata</h2>
      <p className="mt-1 text-xs text-neutral-400">Pasanganmu tidak bisa melihat pilihan ini. Waktu 60 detik mulai setelah kamu memilih.</p>

      <div className="mt-5 grid gap-3">
        {choices.map((c) => (
          <button
            key={c.word_id}
            type="button"
            disabled={choose.isPending}
            onClick={() => choose.mutate({ roundId, wordId: c.word_id })}
            className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-neutral-50 px-5 py-4 text-left transition hover:border-neutral-300 hover:bg-white disabled:opacity-50"
          >
            <span className="text-base font-semibold capitalize">{c.word}</span>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${LABEL[c.difficulty].cls}`}>
              {LABEL[c.difficulty].text}
            </span>
          </button>
        ))}
      </div>

      {choose.isError && <p className="mt-3 text-xs text-rose-500">Gagal memilih kata. Coba lagi.</p>}
    </div>
  )
}