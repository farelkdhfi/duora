'use client'

import { useEffect, useRef, useState } from 'react'
import type { StaticImageData } from 'next/image'

/* sesuaikan 2 path ini dengan struktur folder lu */
import AiResponseOverlay from '@/features/debates/components/ai-response-overlay'
import type { AiPersona, DebateMessage } from '@/features/debates/types'

import lembutAi from '@/assets/ai-persona/lembut-ai.png'
import formalAi from '@/assets/ai-persona/formal-ai.png'
import nyeletukAi from '@/assets/ai-persona/nyeletuk-ai.png'
import lebayAi from '@/assets/ai-persona/lebay-ai.png'

/* ---------- data palsu ---------- */

const personas: Record<
  AiPersona,
  { name: string; image: StaticImageData }
> = {
  formal: { name: 'Formal', image: formalAi },
  lembut: { name: 'Lembut', image: lembutAi },
  kasar: { name: 'Nyeletuk', image: nyeletukAi },
  lebay: { name: 'Lebay', image: lebayAi },
}

/* kalau DebateMessageBubble butuh field lain, tambahkan di sini */
const mockMessage = (overrides: Record<string, unknown>) =>
  ({
    id: 'preview-message',
    role: 'ai',
    sender_id: null,
    created_at: '2026-01-01T09:41:00.000Z',
    is_final_verdict: false,
    content: '',
    ...overrides,
  }) as unknown as DebateMessage

const commentMessage = mockMessage({
  id: 'preview-comment',
  content:
    'Aku dengar dua-duanya. Kamu merasa kurang didengar, dan pasanganmu merasa terus disalahkan.\n\nCoba mulai dari satu hal kecil: apa yang paling kamu butuhkan malam ini?',
})

const verdictMessage = mockMessage({
  id: 'preview-verdict',
  is_final_verdict: true,
  content: 'Fallback kalau summary kosong.',
  ai_analysis: {
    summary:
      'Setelah mendengar kedua sisi, kalian sebenarnya sama-sama ingin dihargai. Hanya caranya yang berbeda.',
    stronger_argument:
      'Kebutuhan untuk didengar tanpa dipotong lebih mendesak daripada soal jadwal.',
    facts: [
      'Pembagian tugas belum pernah ditulis bersama.',
      'Obrolan malam sering terpotong notifikasi HP.',
    ],
    opinions: [
      'Kamu merasa usahamu kurang terlihat.',
      'Pasanganmu merasa terus disalahkan.',
    ],
    common_ground:
      'Kalian berdua ingin rumah yang tenang dan saling menghargai.',
  },
})

/* ---------- skenario ---------- */

type Scenario =
  | 'loading-comment'
  | 'loading-verdict'
  | 'comment'
  | 'verdict'

const scenarios: Array<{ value: Scenario; label: string }> = [
  { value: 'loading-comment', label: 'Loading komentar' },
  { value: 'loading-verdict', label: 'Loading putusan' },
  { value: 'comment', label: 'Komentar' },
  { value: 'verdict', label: 'Putusan akhir' },
]

const chip = (active: boolean) =>
  [
    'rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors',
    active
      ? 'bg-neutral-900 text-white'
      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
  ].join(' ')

export default function OverlayPreviewPage() {
  const [persona, setPersona] = useState<AiPersona>('lembut')
  const [scenario, setScenario] = useState<Scenario>('loading-comment')
  const [withRequester, setWithRequester] = useState(true)
  const [open, setOpen] = useState(true)
  const [panelOpen, setPanelOpen] = useState(true)
  const [replayKey, setReplayKey] = useState(0)

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  /* simulasi alur asli: loading 4 detik, lalu respons muncul */
  const playFlow = (result: 'comment' | 'verdict') => {
    if (timer.current) clearTimeout(timer.current)

    setOpen(true)
    setReplayKey((key) => key + 1)
    setScenario(
      result === 'verdict' ? 'loading-verdict' : 'loading-comment',
    )

    timer.current = setTimeout(() => setScenario(result), 4000)
  }

  if (process.env.NODE_ENV === 'production') return null

  const isProcessing = scenario.startsWith('loading')
  const isPendingVerdict = scenario === 'loading-verdict'

  const message = isProcessing
    ? undefined
    : scenario === 'verdict'
      ? verdictMessage
      : commentMessage

  const current = personas[persona]

  return (
    <>
      {open && (
        <AiResponseOverlay
          key={replayKey}
          message={message}
          isProcessing={isProcessing}
          isPendingVerdict={isPendingVerdict}
          persona={persona}
          personaName={current.name}
          personaImage={current.image}
          requesterName={withRequester ? 'Rina' : null}
          onClose={() => setOpen(false)}
        />
      )}

      {/* PANEL KONTROL (di atas overlay) */}
      <div className="fixed bottom-3 left-3 z-[300] max-w-[calc(100vw-1.5rem)]">
        {panelOpen ? (
          <div className="w-[300px] max-w-full space-y-3 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-neutral-800">
                Preview overlay (mock, tanpa AI)
              </p>

              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="text-[11px] text-neutral-400 hover:text-neutral-800"
              >
                Tutup
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(personas) as AiPersona[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPersona(key)}
                  className={chip(persona === key)}
                >
                  {personas[key].name}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {scenarios.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setOpen(true)
                    setScenario(item.value)
                  }}
                  className={chip(scenario === item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => playFlow('comment')}
                className={chip(false)}
              >
                ▶ Putar alur komentar
              </button>

              <button
                type="button"
                onClick={() => playFlow('verdict')}
                className={chip(false)}
              >
                ▶ Putar alur putusan
              </button>
            </div>

            <label className="flex items-center gap-2 text-[11px] text-neutral-600">
              <input
                type="checkbox"
                checked={withRequester}
                onChange={(e) => setWithRequester(e.target.checked)}
              />
              Tampilkan nama peminta AI (subtitle loading)
            </label>

            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className={chip(true)}
              >
                Buka overlay lagi
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="rounded-full bg-neutral-900 px-3.5 py-2 text-[11px] font-medium text-white shadow-lg"
          >
            Kontrol
          </button>
        )}
      </div>
    </>
  )
}