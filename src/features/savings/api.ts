import { createClient } from '@/lib/supabase/client'

export async function getGoalSavings(
  goalId: string,
) {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('savings')
    .select(`
      id,
      relationship_id,
      goal_id,
      user_id,
      amount,
      note,
      created_at,
      profile:profiles!savings_user_id_fkey (
        display_name,
        username,
        avatar_url
      )
    `)
    .eq('goal_id', goalId)
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createSaving({
  relationshipId,
  goalId,
  amount,
  note,
}: {
  relationshipId: string
  goalId: string
  amount: number
  note?: string
}) {
  const supabase = createClient()

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const {
    data,
    error,
  } = await supabase
    .from('savings')
    .insert({
      relationship_id: relationshipId,
      goal_id: goalId,
      user_id: user.id,
      amount,
      note: note || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}