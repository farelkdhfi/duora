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
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-neutral-400">
          Memuat...
        </p>
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