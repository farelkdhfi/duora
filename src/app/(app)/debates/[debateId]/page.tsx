'use client'

import { use, useEffect, useState } from 'react'

import DebateRoom from '@/features/debates/components/debate-room'
import { useMyRelationshipDetails } from '@/features/relationship/queries'
import { createClient } from '@/lib/supabase/client'

export default function DebateDetailPage({
  params,
}: {
  params: Promise<{ debateId: string }>
}) {
  const { debateId } = use(params)

  const { data: relationship } =
    useMyRelationshipDetails()

  const [userId, setUserId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  if (!relationship || !userId) {
    return (
      <div className="flex min-h-dvh animate-pulse flex-col bg-primary px-4 pb-6 pt-6 sm:px-6">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center gap-4">
          <div className="size-5 shrink-0 rounded-full bg-subprimary" />

          <div className="h-5 w-16 rounded-full bg-subprimary" />
        </div>

        {/* ================================================= */}
        {/* MEDIATOR */}
        {/* ================================================= */}

        <div className="mt-10 flex flex-col items-center">
          <div className="size-36 rounded-full bg-subprimary sm:size-40" />

          <div className="mt-5 h-4 w-32 rounded-full bg-subprimary" />

          <div className="mt-2.5 h-3 w-48 rounded-full bg-subprimary" />
        </div>

        {/* ================================================= */}
        {/* PARTICIPANTS */}
        {/* ================================================= */}

        <div className="mt-8 flex items-start justify-between px-2">
          <div className="flex flex-col items-center">
            <div className="size-20 rounded-full bg-subprimary" />

            <div className="mt-4 h-3.5 w-10 rounded-full bg-subprimary" />

            <div className="mt-3 size-1 rounded-full bg-subprimary" />
          </div>

          <div className="mt-9 size-1 rounded-full bg-subprimary" />

          <div className="flex flex-col items-center">
            <div className="size-20 rounded-full bg-subprimary" />

            <div className="mt-4 h-3.5 w-20 rounded-full bg-subprimary" />
          </div>
        </div>

        {/* ================================================= */}
        {/* MESSAGE CARD */}
        {/* ================================================= */}

        <div className="mt-10 rounded-[1.75rem] border border-white/[0.06] bg-subprimary p-5">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-10 rounded-full bg-primary/60" />

            <div className="h-2.5 w-10 rounded-full bg-primary/60" />
          </div>

          <div className="mt-6 h-4 w-8 rounded-full bg-primary/60" />

          <div className="mt-12 h-2.5 w-32 rounded-full bg-primary/60" />
        </div>

        {/* ================================================= */}
        {/* HINT */}
        {/* ================================================= */}

        <div className="mx-auto mt-8 h-3 w-52 rounded-full bg-subprimary" />

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="mt-auto flex justify-center pt-10">
          <div className="h-2.5 w-44 rounded-full bg-subprimary" />
        </div>

      </div>
    )
  }

  return (
    <DebateRoom
      debateId={debateId}
      relationshipId={relationship.relationship.id}
      currentUserId={userId}
      members={relationship.members}
    />
  )
}