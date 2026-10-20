'use client'

import { Check, Clock, Loader2, X } from 'lucide-react'
import DrawCanvas from './draw-canvas'
import GuessPanel from './guess-panel'
import WordPicker from './word-picker'
import { useEndDrawSession, useExpireDrawRound, useNextDrawRound } from '../queries'
import { useRoundTimer } from '../use-round-timer'
import type { DrawRound } from '../types'

interface Props {
  round: DrawRound
  myId: string
  nameOf: (id: string) => string
}

const ROUND_SECONDS = 60

export default function GameScreen({ round, myId, nameOf }: Props) {
  const expire = useExpireDrawRound()
  const next = useNextDrawRound()
  const end = useEndDrawSession()

  const isDrawing = round.status === 'drawing'
  const isFinished = round.status === 'guessed' || round.status === 'timeout'

  const { remainingMs, remainingSeconds } = useRoundTimer({
    endsAt: round.ends_at,
    serverNow: round.server_now,
    enabled: isDrawing,
    onExpire: () => expire.mutate(round.round_id),
  })

  const drawerName = round.is_drawer ? 'Kamu' : nameOf(round.drawer_id)
  const allSolved = next.error?.message.includes('ALL_WORDS_SOLVED')

  /* ---------- memilih kata ---------- */
  if (round.status === 'choosing') {
    return round.is_drawer ? (
      <WordPicker roundId={round.round_id} />
    ) : (
      <div className="rounded-[2rem] border border-black/[0.06] bg-white p-10 text-center shadow-sm">
        <Loader2 className="mx-auto animate-spin text-neutral-300" />
        <p className="mt-4 text-sm text-neutral-500">{drawerName} sedang memilih kata...</p>
      </div>
    )
  }

  /* ---------- menggambar / hasil ---------- */
  const percent = remainingMs === null ? 100 : (remainingMs / (ROUND_SECONDS * 1000)) * 100

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Ronde {round.round_number}
            </p>
            {isDrawing && round.is_drawer && round.secret_word ? (
              <p className="mt-1 text-lg font-semibold capitalize tracking-[-0.03em]">
                Gambar: {round.secret_word}
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium text-neutral-700">
                {round.is_drawer ? 'Kamu menggambar' : `${drawerName} sedang menggambar`}
              </p>
            )}
          </div>

          {isDrawing && (
            <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-neutral-700">
              <Clock size={14} />
              {remainingSeconds ?? ROUND_SECONDS}s
            </div>
          )}
        </div>

        {isDrawing && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${
                percent < 25 ? 'bg-rose-400' : 'bg-neutral-900'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>

      <DrawCanvas roundId={round.round_id} isDrawer={round.is_drawer} locked={!isDrawing} />

      {isDrawing && (
        <GuessPanel roundId={round.round_id} canGuess={!round.is_drawer} myId={myId} nameOf={nameOf} />
      )}

      {/* hasil ronde */}
      {isFinished && (
        <div
          className={`rounded-[2rem] border p-6 text-center shadow-sm ${
            round.status === 'guessed' ? 'border-emerald-100 bg-emerald-50/60' : 'border-black/[0.06] bg-white'
          }`}
        >
          <div
            className={`mx-auto flex size-11 items-center justify-center rounded-full ${
              round.status === 'guessed' ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-400'
            }`}
          >
            {round.status === 'guessed' ? <Check size={20} /> : <X size={20} />}
          </div>

          <p className="mt-3 text-base font-semibold tracking-[-0.03em]">
            {round.status === 'guessed'
              ? `${round.guessed_by === myId ? 'Kamu' : nameOf(round.guessed_by ?? '')} berhasil menebak! +20 Chemistry`
              : 'Waktu habis'}
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Jawabannya: <span className="font-semibold capitalize text-neutral-800">{round.secret_word}</span>
          </p>

          {allSolved ? (
            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-600">
              🎉 Semua kata sudah kalian selesaikan! Tunggu kata baru ya.
            </div>
          ) : (
            <button
              type="button"
              onClick={() => next.mutate(round.session_id)}
              disabled={next.isPending}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
            >
              {next.isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                `Ronde berikutnya (${round.is_drawer ? nameOf('') || 'pasanganmu' : 'kamu'} menggambar)`
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => end.mutate()}
            disabled={end.isPending}
            className="mt-3 text-xs font-medium text-neutral-400 hover:text-neutral-600"
          >
            Selesai bermain
          </button>
        </div>
      )}
    </div>
  )
}