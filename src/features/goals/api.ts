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

export async function updateGoal({
  goalId,
  values,
}: {
  goalId: string
  values: CreateGoalFormValues
}) {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('goals')
    .update({
      title: values.title,
      description:
        values.description || null,

      category: values.category,

      target_amount:
        values.targetAmount ?? null,

      deadline:
        values.deadline || null,
    })
    .eq('id', goalId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteGoal(
  goalId: string,
) {
  const supabase = createClient()

  const {
    error,
  } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)

  if (error) {
    throw new Error(error.message)
  }

  return goalId
}