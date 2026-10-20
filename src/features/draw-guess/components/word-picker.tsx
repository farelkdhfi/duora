'use client'

import { Loader2 } from 'lucide-react'
import { useChooseDrawWord, useDrawChoices } from '../queries'
import { Sparkle } from './ornaments'
import type { DrawDifficulty } from '../types'

const LABEL: Record<DrawDifficulty, { text: string; cls: string }> = {
  easy: { text: 'Mudah', cls: 'bg-emerald-500/10 text-emerald-400' },
  medium: { text: 'Sedang', cls: 'bg-amber-500/10 text-amber-400' },
  hard: { text: 'Sulit', cls: 'bg-rose-500/10 text-rose-400' },
}

export default function WordPicker({ roundId }: { roundId: string }) {
  const { data: choices, isLoading } = useDrawChoices(roundId, true)
  const choose = useChooseDrawWord()

  if (isLoading || !choices) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="animate-spin text-description" />
      </div>
    )
  }

  return (
    <div className="relative mx-auto w-full max-w-sm text-center">
      <div className="pointer-events-none absolute left-1/2 top-0 size-56 -translate-x-1/2 -translate-y-1/3 rounded-full bg-pink-500/10 blur-[90px]" />
      <Sparkle className="absolute -left-1 top-0 size-3 animate-twinkle text-pink-300/70 motion-reduce:animate-none" />
      <Sparkle className="absolute -right-1 top-6 size-4 animate-twinkle text-blue-300/70 motion-reduce:animate-none" style={{ animationDelay: '1s' }} />

      <p className="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-description">Giliranmu menggambar</p>
      <h2 className="relative mt-2 text-2xl font-semibold tracking-[-0.03em] text-secondary">Pilih satu kata</h2>
      <p className="relative mx-auto mt-2 max-w-xs text-xs leading-5 text-description">Pasanganmu tidak bisa melihat pilihan ini. Waktu 60 detik mulai setelah kamu memilih.</p>

      <div className="relative mt-7 grid gap-3">
        {choices.map((c, i) => (
          <button
            key={c.word_id}
            type="button"
            disabled={choose.isPending}
            onClick={() => choose.mutate({ roundId, wordId: c.word_id })}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-subprimary px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-subprimary/80 disabled:opacity-50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-semibold text-description">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate text-base font-semibold capitalize text-secondary">{c.word}</span>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${LABEL[c.difficulty].cls}`}>{LABEL[c.difficulty].text}</span>
          </button>
        ))}
      </div>

      {choose.isError && <p className="relative mt-3 text-xs text-rose-500">Gagal memilih kata. Coba lagi.</p>}
    </div>
  )
}