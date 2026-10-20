'use client'

import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { drawKeys, useRoundGuesses, useSubmitDrawGuess } from '../queries'

interface Props {
  roundId: string
  canGuess: boolean
  myId: string
  nameOf: (id: string) => string
}

export default function GuessPanel({ roundId, canGuess, myId, nameOf }: Props) {
  const [text, setText] = useState('')
  const qc = useQueryClient()
  const { data: guesses } = useRoundGuesses(roundId)
  const submit = useSubmitDrawGuess()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const guess = text.trim()
    if (!guess) return

    submit.mutate(
      { roundId, guess },
      {
        onSuccess: () => {
          setText('')
          qc.invalidateQueries({ queryKey: drawKeys.guesses(roundId) })
        },
      },
    )
  }

  return (
    <div className="space-y-3">
      {canGuess && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tebak gambarnya..."
            maxLength={100}
            autoComplete="off"
            className="h-12 min-w-0 flex-1 rounded-2xl border border-black/[0.08] bg-white px-4 text-sm outline-none focus:border-neutral-400"
          />
          <button
            type="submit"
            disabled={submit.isPending || !text.trim()}
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white disabled:opacity-40"
          >
            {submit.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      )}

      {guesses && guesses.length > 0 && (
        <ul className="max-h-40 space-y-1.5 overflow-y-auto">
          {guesses.map((g) => (
            <li
              key={g.id}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs ${
                g.is_correct ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-50 text-neutral-500'
              }`}
            >
              <span className="font-medium">{g.user_id === myId ? 'Kamu' : nameOf(g.user_id)}</span>
              <span className="truncate pl-3">{g.guess_text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}