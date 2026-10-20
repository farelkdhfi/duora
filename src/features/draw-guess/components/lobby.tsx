'use client'

import { Lightbulb, Loader2, Pencil, Sparkles, Timer } from 'lucide-react'
import { useStartDrawSession, useDrawChemistry } from '../queries'
import { Sparkle, Squiggle } from './ornaments'

const STEPS = [
  { icon: Pencil, label: 'Pilih kata & gambar' },
  { icon: Timer, label: 'Waktu 60 detik' },
  { icon: Lightbulb, label: 'Pasangan menebak' },
]

export default function DrawLobby({ hasPartner }: { hasPartner: boolean }) {
  const { data: chem } = useDrawChemistry()
  const start = useStartDrawSession()

  const allSolved =
    (chem && chem.words_total > 0 && chem.words_remaining === 0) ||
    start.error?.message.includes('ALL_WORDS_SOLVED')

  const solvedPercent = chem && chem.words_total > 0 ? ((chem.words_total - chem.words_remaining) / chem.words_total) * 100 : 0

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-primary/80 p-7 backdrop-blur sm:p-8">
      <div className="pointer-events-none absolute -left-10 -top-10 size-40 rounded-full bg-blue-500/10 blur-[70px]" />
      <Sparkle className="absolute right-6 top-6 size-4 animate-twinkle text-pink-300/70 motion-reduce:animate-none" />
      <Sparkle className="absolute right-12 top-14 size-2.5 animate-twinkle text-amber-300/70 motion-reduce:animate-none" style={{ animationDelay: '1s' }} />
      <Squiggle className="absolute bottom-5 right-6 w-16 text-pink-300/30" />

      <div className="relative flex size-16 items-center justify-center rounded-3xl border border-white/[0.06] bg-gradient-to-br from-pink-500/15 to-blue-500/15">
        <Sparkles size={26} className="animate-wiggle text-pink-400 motion-reduce:animate-none" />
      </div>

      <h2 className="relative mt-6 text-2xl font-semibold tracking-[-0.04em] text-secondary">Gantian menggambar, saling menebak</h2>
      <p className="relative mt-2 text-sm leading-6 text-description">
        Setiap tebakan benar menambah <span className="font-semibold text-secondary">+20 Chemistry</span> untuk kalian berdua.
      </p>

      <div className="relative mt-6 grid grid-cols-3 gap-2">
        {STEPS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-subprimary px-2 py-3 text-center">
            <Icon size={16} className="text-pink-400" />
            <p className="text-[11px] font-medium leading-4 text-description">{label}</p>
          </div>
        ))}
      </div>

      {chem && chem.words_total > 0 && (
        <div className="relative mt-6">
          <div className="h-1.5 overflow-hidden rounded-full bg-subprimary">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-blue-400 transition-[width] duration-500" style={{ width: `${solvedPercent}%` }} />
          </div>
          <p className="mt-2 text-xs text-description">
            {chem.words_remaining} dari {chem.words_total} kata belum terselesaikan
          </p>
        </div>
      )}

      {allSolved ? (
        <div className="relative mt-6 rounded-2xl bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400">🎉 Semua kata sudah kalian selesaikan! Tunggu kata baru ya.</div>
      ) : !hasPartner ? (
        <div className="relative mt-6 rounded-2xl bg-amber-500/10 p-4 text-xs text-amber-400">Game ini butuh pasanganmu sudah bergabung.</div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => start.mutate()}
            disabled={start.isPending}
            className="relative mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-subprimary text-sm font-semibold text-secondary transition hover:bg-subprimary/80 disabled:opacity-50"
          >
            {start.isPending ? <Loader2 size={15} className="animate-spin" /> : 'Mulai Main'}
          </button>

          {start.isError && !allSolved && <p className="relative mt-3 text-xs text-rose-500">Gagal memulai game. Coba lagi.</p>}
        </>
      )}
    </div>
  )
}