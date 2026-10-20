'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Award, Loader2 } from 'lucide-react'
import Modal from './modal'
import ChemistryIcon from './chemistry-icon'
import ChemistryShareView from './chemistry-share-view'
import { BurstSparkles, Sparkle } from './ornaments'
import { useDrawChemistry } from '../queries'

interface Props {
  open: boolean
  onClose: () => void
  winnerName: string
  answer: string
  names: [string, string]
  nextLabel: string
  allSolved: boolean
  isNextPending: boolean
  isEndPending: boolean
  onNext: () => void
  onEnd: () => void
}

export default function ResultModal({ open, onClose, winnerName, answer, names, nextLabel, allSolved, isNextPending, isEndPending, onNext, onEnd }: Props) {
  const { data: chem, refetch } = useDrawChemistry()
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    if (!open) return
    setShowCard(false)
    refetch()
  }, [open, refetch])

  return (
    <Modal open={open} onClose={onClose} label="Tebakan berhasil" decoration={showCard ? null : <BurstSparkles />}>
      {showCard ? (
        <div className="p-6 pt-5">
          <button type="button" onClick={() => setShowCard(false)} className="mb-4 flex items-center gap-1 text-xs font-medium text-description hover:text-secondary">
            <ArrowLeft size={14} />
            Kembali
          </button>
          <ChemistryShareView names={names} />
        </div>
      ) : (
        <div className="relative px-6 pb-6 pt-10 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 size-48 -translate-x-1/2 -translate-y-1/3 rounded-full bg-pink-500/20 blur-[70px]" />
          <Sparkle className="absolute left-6 top-8 size-3 animate-twinkle text-amber-300/70 motion-reduce:animate-none" />
          <Sparkle className="absolute right-14 top-14 size-2.5 animate-twinkle text-blue-300/70 motion-reduce:animate-none" style={{ animationDelay: '1s' }} />

          <div className="relative mx-auto flex size-20 animate-heartbeat items-center justify-center motion-reduce:animate-none">
            <ChemistryIcon size={72} />
          </div>

          <p className="relative mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-description">Berhasil menebak</p>
          <h2 className="relative mt-1 text-xl font-semibold tracking-[-0.03em] text-secondary">{winnerName} benar!</h2>
          <p className="relative mt-1 text-sm text-description">
            Jawabannya <span className="font-semibold capitalize text-secondary">{answer}</span>
          </p>

          <div className="relative mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-white/[0.06] bg-subprimary px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-description">Poin</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-emerald-400">+20</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-subprimary px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-description">Total Chemistry</p>
              <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-secondary">{chem ? chem.total_points.toLocaleString('id-ID') : '—'}</p>
            </div>
          </div>

          {allSolved ? (
            <div className="relative mt-5 rounded-2xl bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400">🎉 Semua kata sudah kalian selesaikan! Tunggu kata baru ya.</div>
          ) : (
            <button
              type="button"
              onClick={onNext}
              disabled={isNextPending}
              className="relative mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-subprimary text-sm font-semibold text-secondary transition hover:bg-subprimary/80 disabled:opacity-50"
            >
              {isNextPending ? <Loader2 size={15} className="animate-spin" /> : nextLabel}
            </button>
          )}

          <div className="relative mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowCard(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-subprimary text-xs font-medium text-secondary transition hover:bg-subprimary/80"
            >
              <Award size={14} />
              Kartu pencapaian
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 items-center justify-center rounded-full border border-white/[0.08] bg-subprimary text-xs font-medium text-secondary transition hover:bg-subprimary/80"
            >
              Lihat gambar
            </button>
          </div>

          <button type="button" onClick={onEnd} disabled={isEndPending} className="relative mt-4 text-xs font-medium text-description hover:text-secondary">
            Selesai bermain
          </button>
        </div>
      )}
    </Modal>
  )
}