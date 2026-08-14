import { createClient } from '@/lib/supabase/client'

import type {
  CreateGoalFormValues,
} from './schemas'

export async function getGoals(
  relationshipId: string,
) {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('goals')
    .select('*')
    .eq('relationship_id', relationshipId)
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getGoal(
  goalId: string,
) {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createGoal({
  relationshipId,
  values,
}: {
  relationshipId: string
  values: CreateGoalFormValues
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
    .from('goals')
    .insert({
      relationship_id: relationshipId,
      created_by: user.id,

      title: values.title,
      description:
        values.description || null,

      category: values.category,

      target_amount:
        values.targetAmount ?? null,

      deadline:
        values.deadline || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getGoalContributions(goalId: string) {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('goal_contributions')
    .select('*')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function addGoalContribution({
  goalId,
  amount,
  note,
}: {
  goalId: string
  amount: number
  note?: string
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const {
    data,
    error,
  } = await supabase
    .from('goal_contributions')
    .insert({
      goal_id: goalId,
      contributed_by: user.id,
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

export async function getGoalsWithContributionSummary(
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
    data: contributions,
    error: contribError,
  } = await supabase
    .from('goal_contributions')
    .select('id, goal_id, contributed_by, amount, note, created_at')
    .in('goal_id', goalIds)

  if (contribError) {
    throw new Error(contribError.message)
  }

  return goals.map((goal) => ({
    ...goal,
    contributions: contributions.filter(
      (c) => c.goal_id === goal.id,
    ),
  }))
}