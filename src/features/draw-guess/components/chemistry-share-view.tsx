'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, Loader2, Share2 } from 'lucide-react'
import ChemistryShareCard from './chemistry-share-card'
import { useDrawChemistry } from '../queries'

export default function ChemistryShareView({ names }: { names: [string, string] }) {
  const { data: chem } = useDrawChemistry()
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)

  if (!chem) return null

  async function makeBlob(): Promise<Blob | null> {
    if (!cardRef.current) return null
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
    return (await fetch(dataUrl)).blob()
  }

  async function handleDownload() {
    setBusy(true)
    try {
      const blob = await makeBlob()
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'duonear-chemistry.png'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setBusy(false)
    }
  }

  async function handleShare() {
    setBusy(true)
    try {
      const blob = await makeBlob()
      if (!blob) return
      const file = new File([blob], 'duonear-chemistry.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Chemistry kami di DUONEAR' })
      } else {
        await handleDownload()
      }
    } catch {
      // user membatalkan share
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-description">Kartu pencapaian</p>
        <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-secondary">Bagikan chemistry kalian</h2>
      </div>

      {/* preview diperkecil dengan scale; capture tetap memakai ukuran asli */}
      <div className="mx-auto h-[432px] w-[243px] overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_0_40px_-12px_rgba(244,114,182,0.35)]">
        <div className="origin-top-left scale-[0.45]">
          <ChemistryShareCard ref={cardRef} totalPoints={chem.total_points} correctCount={chem.correct_count} names={names} />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-subprimary text-sm font-medium text-secondary hover:bg-subprimary/80 disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Download
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-subprimary text-sm font-semibold text-secondary hover:bg-subprimary/80 disabled:opacity-50"
        >
          <Share2 size={14} />
          Share
        </button>
      </div>
    </div>
  )
}