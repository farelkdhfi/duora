import { createClient } from '@/lib/supabase/client'
import type { Activity } from './types'

export async function getRelationshipActivities({
  relationshipId,
  before,
  limit = 30,
}: {
  relationshipId: string
  before?: string
  limit?: number
}): Promise<Activity[]> {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase.rpc(
    'get_relationship_activities',
    {
      p_relationship_id: relationshipId,
      p_limit: limit,
      p_before: before ?? null,
    },
  )

  if (error) {
    throw new Error(error.message)
  }

  return (data as Activity[]) ?? []
}