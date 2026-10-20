'use client'

import { useEffect } from 'react'
import { Lightbulb } from 'lucide-react'
import { useDrawClue } from '../queries'

export default function ClueDisplay({ roundId }: { roundId: string }) {
  const { data: clue, refetch } = useDrawClue(roundId, true)

  // refetch tepat saat clue kedua seharusnya terbuka
  useEffect(() => {
    if (clue?.next_hint_in_ms == null) return
    const id = window.setTimeout(() => refetch(), clue.next_hint_in_ms + 300)
    return () => window.clearTimeout(id)
  }, [clue?.next_hint_in_ms, clue?.hint_level, refetch])

  if (!clue) return null

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-primary/80 p-4 text-center backdrop-blur">
      <p className="flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-description">
        <Lightbulb size={12} className="text-amber-300" />
        Clue
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {clue.pattern.split('').map((ch, i) =>
          ch === ' ' ? (
            <span key={i} className="w-3" />
          ) : (
            <span
              key={i}
              className={`flex size-8 items-center justify-center rounded-lg border text-base font-semibold uppercase ${ch === '_' ? 'border-white/[0.08] bg-subprimary text-transparent' : 'animate-pop border-pink-500/30 bg-pink-500/10 text-pink-400'}`}
            >
              {ch === '_' ? '·' : ch}
            </span>
          ),
        )}
      </div>

      <p className="mt-3 text-[11px] text-description">
        {clue.next_hint_in_ms != null ? 'Satu huruf lagi akan terbuka setelah 30 detik.' : 'Semua clue sudah terbuka.'}
      </p>
    </div>
  )
}