// app/(app)/(shell)/draw-guess/page.tsx  (sesuaikan dengan struktur foldermu)
'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Loader2, Sparkles, X } from 'lucide-react'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { useGetMyProfile } from '@/features/profiles/queries'
import { useCurrentRound, useDrawChemistry } from '@/features/draw-guess/queries'
import { useDrawRealtime } from '@/features/draw-guess/use-draw-realtime'
import DrawLobby from '@/features/draw-guess/components/lobby'
import GameScreen from '@/features/draw-guess/components/game-screen'
import ChemistryPanel from '@/features/draw-guess/components/chemistry-panel'
import { PageOrnaments } from '@/features/draw-guess/components/ornaments'

export default function DrawGuessPage() {
  const { data: details, isLoading: loadingRel } = useMyRelationshipDetails()
  const { data: profile, isLoading: loadingProfile } = useGetMyProfile()

  const relationshipId = details?.relationship.id
  useDrawRealtime(relationshipId)

  const { data: round, isLoading: loadingRound } = useCurrentRound()
  const { data: chem } = useDrawChemistry()

  // saat game berjalan layout rata atas, selain itu dipusatkan di tengah layar
  const inGame = !!round && round.status !== 'choosing'

  let content: ReactNode

  if (loadingRel || loadingProfile || loadingRound) {
    content = (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-description" />
      </div>
    )
  } else if (!details || !profile) {
    content = <p className="py-16 text-center text-sm text-description">Kamu belum terhubung dengan pasangan.</p>
  } else {
    const members = details.members ?? []
    const nameOf = (id: string) =>
      members.find((m: { user_id: string }) => m.user_id === id)?.display_name ?? 'Pasanganmu'
    const myName = members.find((m: { user_id: string }) => m.user_id === profile.id)?.display_name ?? 'Kamu'
    const partnerName = members.find((m: { user_id: string }) => m.user_id !== profile.id)?.display_name ?? 'Pasangan'

    content = round ? (
      <GameScreen round={round} myId={profile.id} names={[myName, partnerName]} nameOf={nameOf} />
    ) : (
      <div className={`mx-auto grid w-full max-w-3xl grid-cols-[minmax(0,1fr)] gap-4 ${chem ? 'md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]' : ''}`}>
        <DrawLobby hasPartner={members.length >= 2} />
        <ChemistryPanel names={[myName, partnerName]} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden bg-primary">
      <PageOrnaments />

      <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col gap-6 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-subprimary">
              <Sparkles size={18} className="animate-wiggle text-pink-400 motion-reduce:animate-none" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-[-0.03em] text-secondary">Draw &amp; Guess</h1>
              <p className="truncate text-xs text-description">Gambar, tebak, tambah chemistry</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            aria-label="Kembali ke dashboard"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-subprimary text-description transition duration-300 hover:rotate-90 hover:text-secondary"
          >
            <X size={18} />
          </Link>
        </header>

        <main className={`w-full ${inGame ? '' : 'my-auto'}`}>{content}</main>
      </div>
    </div>
  )
}