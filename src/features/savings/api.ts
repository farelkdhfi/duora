import { createClient } from '@/lib/supabase/client'
import { SavingTransactionWithProfile } from './types'

export interface SavingWithProfile {
  id: string
  relationship_id: string
  goal_id: string
  user_id: string
  amount: number
  note: string | null
  created_at: string
  profile: {
    display_name: string | null
    username: string | null
    avatar_url: string | null
  } | null
}

export async function getGoalSavings(
  goalId: string,
): Promise<SavingWithProfile[]> {
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

  return (data ?? []).map((row) => ({
    ...row,
    profile: Array.isArray(row.profile)
      ? row.profile[0] ?? null
      : row.profile,
  })) as SavingWithProfile[]
}

export async function getGoalsWithSavingsSummary(
  relationshipId: string,
) {
  const supabase = createClient()

  const {
    data: goals,
    error: goalsError,
  } = await supabase
    .from('goals')
    .select('*')
    .eq('relationship_id', relationshipId)
    .order('created_at', { ascending: false })

  if (goalsError) {
    throw new Error(goalsError.message)
  }

  if (goals.length === 0) {
    return []
  }

  const goalIds = goals.map((g) => g.id)

  const {
    data: savings,
    error: savingsError,
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
    .in('goal_id', goalIds)

  if (savingsError) {
    throw new Error(savingsError.message)
  }

  const normalizedSavings = savings.map((s) => ({
    ...s,
    profile: Array.isArray(s.profile)
      ? s.profile[0] ?? null
      : s.profile,
  })) as SavingTransactionWithProfile[]

  return goals.map((goal) => ({
    ...goal,
    savings: normalizedSavings.filter((s) => s.goal_id === goal.id),
  }))
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