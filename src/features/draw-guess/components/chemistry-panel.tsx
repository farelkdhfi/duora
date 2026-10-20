'use client'

import { useState } from 'react'
import { Award } from 'lucide-react'
import ChemistryIcon from './chemistry-icon'
import ChemistryShareView from './chemistry-share-view'
import Modal from './modal'
import { Sparkle } from './ornaments'
import { useDrawChemistry } from '../queries'

export default function ChemistryPanel({ names }: { names: [string, string] }) {
  const { data: chem } = useDrawChemistry()
  const [open, setOpen] = useState(false)

  if (!chem) return null

  return (
    <>
      <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-primary/80 p-6 backdrop-blur">
        <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-pink-500/10 blur-[60px]" />
        <Sparkle className="absolute right-5 top-5 size-3 animate-twinkle text-amber-300/70 motion-reduce:animate-none" />
        <Sparkle className="absolute bottom-24 right-8 size-2.5 animate-twinkle text-blue-300/60 motion-reduce:animate-none" style={{ animationDelay: '1.2s' }} />

        <div className="relative flex items-center gap-4">
          <div className="animate-heartbeat motion-reduce:animate-none">
            <ChemistryIcon size={56} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-description">Total Chemistry</p>
            <p className="text-3xl font-semibold tracking-[-0.05em] text-secondary">{chem.total_points.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-subprimary px-4 py-3">
          <p className="text-xs text-description">Tebakan benar</p>
          <p className="text-sm font-semibold text-secondary">{chem.correct_count}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-subprimary text-sm font-medium text-secondary transition hover:bg-subprimary/80"
        >
          <Award size={14} />
          Lihat kartu pencapaian
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} label="Kartu pencapaian">
        <div className="p-6">
          <ChemistryShareView names={names} />
        </div>
      </Modal>
    </>
  )
}