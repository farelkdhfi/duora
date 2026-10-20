'use client'

import { useState } from 'react'
import { Check, Eye, Loader2, Pencil, X } from 'lucide-react'
import DrawCanvas from './draw-canvas'
import GuessPanel from './guess-panel'
import WordPicker from './word-picker'
import ClueDisplay from './clue-display'
import ResultModal from './result-modal'
import { OrbitRing } from './ornaments'
import { useEndDrawSession, useExpireDrawRound, useNextDrawRound } from '../queries'
import { useRoundTimer } from '../use-round-timer'
import type { DrawRound } from '../types'

interface Props {
  round: DrawRound
  myId: string
  names: [string, string]
  nameOf: (id: string) => string
}

const ROUND_SECONDS = 60

function TimerRing({ seconds, percent, danger }: { seconds: number; percent: number; danger: boolean }) {
  const r = 20
  const c = 2 * Math.PI * r

  return (
    <div className={`relative flex size-14 shrink-0 items-center justify-center ${danger ? 'animate-pulse' : ''}`}>
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="3" className="stroke-subprimary" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          className={`transition-[stroke-dashoffset] duration-300 ${danger ? 'stroke-rose-400' : 'stroke-secondary'}`}
        />
      </svg>
      <span className="text-sm font-semibold tabular-nums text-secondary">{seconds}</span>
    </div>
  )
}

export default function GameScreen({ round, myId, names, nameOf }: Props) {
  const expire = useExpireDrawRound()
  const next = useNextDrawRound()
  const end = useEndDrawSession()
  const [dismissedId, setDismissedId] = useState<string | null>(null)

  const isDrawing = round.status === 'drawing'
  const isGuessed = round.status === 'guessed'
  const isFinished = isGuessed || round.status === 'timeout'

  const { remainingMs, remainingSeconds } = useRoundTimer({
    endsAt: round.ends_at,
    serverNow: round.server_now,
    enabled: isDrawing,
    onExpire: () => expire.mutate(round.round_id),
  })

  const drawerName = round.is_drawer ? 'Kamu' : nameOf(round.drawer_id)
  const allSolved = !!next.error?.message.includes('ALL_WORDS_SOLVED')
  const winnerName = round.guessed_by === myId ? 'Kamu' : nameOf(round.guessed_by ?? '')
  const nextLabel = `Ronde berikutnya (${round.is_drawer ? nameOf('') || 'pasanganmu' : 'kamu'} menggambar)`

  /* ---------- memilih kata ---------- */
  if (round.status === 'choosing') {
    return round.is_drawer ? (
      <WordPicker roundId={round.round_id} />
    ) : (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="relative flex size-28 items-center justify-center">
          <OrbitRing className="absolute inset-0 size-full animate-orbit text-pink-300/40 motion-reduce:animate-none" />
          <Loader2 className="animate-spin text-description" />
        </div>
        <p className="mt-4 text-sm text-description">{drawerName} sedang memilih kata...</p>
      </div>
    )
  }

  /* ---------- menggambar / hasil ---------- */
  const percent = remainingMs === null ? 100 : (remainingMs / (ROUND_SECONDS * 1000)) * 100

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div className="min-w-0 space-y-4">
        {/* header */}
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/[0.08] bg-primary/80 p-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-subprimary text-pink-400">
              {round.is_drawer ? <Pencil size={18} /> : <Eye size={18} />}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-description">Ronde {round.round_number}</p>
              {isDrawing && round.is_drawer && round.secret_word ? (
                <p className="mt-0.5 truncate text-lg font-semibold capitalize tracking-[-0.03em] text-secondary">Gambar: {round.secret_word}</p>
              ) : (
                <p className="mt-0.5 truncate text-sm font-medium text-secondary">{round.is_drawer ? 'Kamu menggambar' : `${drawerName} sedang menggambar`}</p>
              )}
            </div>
          </div>

          {isDrawing && <TimerRing seconds={remainingSeconds ?? ROUND_SECONDS} percent={percent} danger={percent < 25} />}

          {isFinished && (
            <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${isGuessed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-subprimary text-description'}`}>
              {isGuessed ? 'Selesai' : 'Waktu habis'}
            </span>
          )}
        </div>

        <DrawCanvas roundId={round.round_id} isDrawer={round.is_drawer} locked={!isDrawing} />
      </div>

      <aside className="min-w-0 space-y-4 lg:sticky lg:top-6">
        {isDrawing ? (
          <>
            {!round.is_drawer && <ClueDisplay roundId={round.round_id} />}
            <GuessPanel roundId={round.round_id} canGuess={!round.is_drawer} myId={myId} nameOf={nameOf} />
          </>
        ) : (
          <div className={`rounded-3xl border p-6 text-center backdrop-blur ${isGuessed ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-white/[0.08] bg-primary/80'}`}>
            <div className={`mx-auto flex size-11 animate-pop items-center justify-center rounded-full ${isGuessed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-subprimary text-description'}`}>
              {isGuessed ? <Check size={20} /> : <X size={20} />}
            </div>

            <p className="mt-3 text-base font-semibold tracking-[-0.03em] text-secondary">
              {isGuessed ? `${winnerName} berhasil menebak! +20 Chemistry` : 'Waktu habis'}
            </p>

            <p className="mt-1 text-sm text-description">
              Jawabannya: <span className="font-semibold capitalize text-secondary">{round.secret_word}</span>
            </p>

            {allSolved ? (
              <div className="mt-5 rounded-2xl bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400">🎉 Semua kata sudah kalian selesaikan! Tunggu kata baru ya.</div>
            ) : (
              <button
                type="button"
                onClick={() => next.mutate(round.session_id)}
                disabled={next.isPending}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-subprimary text-sm font-semibold text-secondary transition hover:bg-subprimary/80 disabled:opacity-50"
              >
                {next.isPending ? <Loader2 size={15} className="animate-spin" /> : nextLabel}
              </button>
            )}

            <button type="button" onClick={() => end.mutate()} disabled={end.isPending} className="mt-3 text-xs font-medium text-description hover:text-secondary">
              Selesai bermain
            </button>
          </div>
        )}
      </aside>

      <ResultModal
        open={isGuessed && dismissedId !== round.round_id}
        onClose={() => setDismissedId(round.round_id)}
        winnerName={winnerName}
        answer={round.secret_word ?? ''}
        names={names}
        nextLabel={nextLabel}
        allSolved={allSolved}
        isNextPending={next.isPending}
        isEndPending={end.isPending}
        onNext={() => next.mutate(round.session_id)}
        onEnd={() => end.mutate()}
      />
    </div>
  )
}