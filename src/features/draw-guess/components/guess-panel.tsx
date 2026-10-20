'use client'

import { useEffect, useState } from 'react'
import { Loader2, MessageCircle, Send } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { drawKeys, useRoundGuesses, useSubmitDrawGuess } from '../queries'

interface Props {
  roundId: string
  canGuess: boolean
  myId: string
  nameOf: (id: string) => string
}

type Feedback = { type: 'wrong' | 'closed'; key: number } | null

export default function GuessPanel({ roundId, canGuess, myId, nameOf }: Props) {
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const qc = useQueryClient()
  const { data: guesses } = useRoundGuesses(roundId)
  const submit = useSubmitDrawGuess()

  // pesan hilang sendiri setelah 2,5 detik
  useEffect(() => {
    if (!feedback) return
    const id = window.setTimeout(() => setFeedback(null), 2500)
    return () => window.clearTimeout(id)
  }, [feedback])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const guess = text.trim()
    if (!guess) return

    submit.mutate(
      { roundId, guess },
      {
        onSuccess: (result) => {
          setText('')
          qc.invalidateQueries({ queryKey: drawKeys.guesses(roundId) })

          if (result === 'wrong') {
            setFeedback({ type: 'wrong', key: Date.now() })
          } else if (result === 'timeout' || result === 'closed') {
            setFeedback({ type: 'closed', key: Date.now() })
          }
        },
      },
    )
  }

  return (
    <div className="space-y-3 rounded-3xl border border-white/[0.08] bg-primary/80 p-4 backdrop-blur">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-description">
        <MessageCircle size={12} />
        Tebakan
      </p>

      {canGuess ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tebak gambarnya..."
              maxLength={100}
              autoComplete="off"
              className={`h-12 min-w-0 flex-1 rounded-2xl border bg-subprimary px-4 text-sm text-secondary outline-none transition placeholder:text-description ${feedback?.type === 'wrong' ? 'border-rose-300' : 'border-white/[0.08] focus:border-white/30'}`}
            />
            <button
              type="submit"
              disabled={submit.isPending || !text.trim()}
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.12] bg-subprimary text-secondary transition hover:bg-subprimary/80 disabled:opacity-40"
            >
              {submit.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>

          {feedback?.type === 'wrong' && (
            <p key={feedback.key} role="status" className="animate-pop rounded-xl bg-rose-500/10 px-3 py-2 text-center text-xs font-medium text-rose-400">
              Tebakanmu belum tepat. Coba lagi ya! 💪
            </p>
          )}

          {feedback?.type === 'closed' && (
            <p key={feedback.key} role="status" className="animate-pop rounded-xl bg-subprimary px-3 py-2 text-center text-xs font-medium text-description">
              Ronde ini sudah selesai.
            </p>
          )}

          {submit.isError && <p className="text-center text-xs text-rose-500">Gagal mengirim tebakan. Coba lagi.</p>}
        </form>
      ) : (
        <p className="rounded-2xl bg-subprimary px-4 py-3 text-center text-xs text-description">Pasanganmu sedang menebak gambarmu...</p>
      )}

      {guesses && guesses.length > 0 ? (
        <ul className="max-h-48 space-y-1.5 overflow-y-auto">
          {guesses.map((g) => {
            const who = g.user_id === myId ? 'Kamu' : nameOf(g.user_id)
            return (
              <li key={g.id} className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-xs ${g.is_correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-subprimary text-description'}`}>
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${g.is_correct ? 'bg-emerald-500/20' : 'bg-white/[0.06] text-secondary'}`}>
                  {who.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">{g.guess_text}</span>
                <span className="shrink-0 text-[10px] opacity-70">{who}</span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="py-2 text-center text-[11px] text-description">Belum ada tebakan.</p>
      )}
    </div>
  )
}