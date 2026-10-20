// app/(app)/(shell)/draw-guess/page.tsx  (sesuaikan dengan struktur foldermu)
'use client'

import { Loader2 } from 'lucide-react'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { useGetMyProfile } from '@/features/profiles/queries'
import { useCurrentRound, useDrawChemistry } from '@/features/draw-guess/queries'
import { useDrawRealtime } from '@/features/draw-guess/use-draw-realtime'
import DrawLobby from '@/features/draw-guess/components/lobby'
import GameScreen from '@/features/draw-guess/components/game-screen'

export default function DrawGuessPage() {
  const { data: details, isLoading: loadingRel } = useMyRelationshipDetails()
  const { data: profile, isLoading: loadingProfile } = useGetMyProfile()

  const relationshipId = details?.relationship.id
  useDrawRealtime(relationshipId)

  const { data: round, isLoading: loadingRound } = useCurrentRound()
  const { data: chem } = useDrawChemistry()

  if (loadingRel || loadingProfile || loadingRound) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-neutral-300" />
      </div>
    )
  }

  if (!details || !profile) {
    return <p className="py-16 text-center text-sm text-neutral-400">Kamu belum terhubung dengan pasangan.</p>
  }

  const members = details.members ?? []
  const nameOf = (id: string) =>
    members.find((m: { user_id: string }) => m.user_id === id)?.display_name ?? 'Pasanganmu'

  return (
    <div className="mx-auto max-w-xl px-1 py-6">
      {chem && (
        <p className="mb-4 text-center text-xs font-medium text-neutral-400">
          💞 {chem.total_points} Chemistry · {chem.correct_count} tebakan benar
        </p>
      )}

      {round ? (
        <GameScreen round={round} myId={profile.id} nameOf={nameOf} />
      ) : (
        <DrawLobby hasPartner={members.length >= 2} />
      )}
    </div>
  )
}