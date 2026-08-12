import { createClient } from '@/lib/supabase/client'

export async function getChecklist(
  goalId: string,
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('goal_checklists')
    .select('*')
    .eq('goal_id', goalId)
    .order('position', {
      ascending: true,
    })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createChecklistItem({
  goalId,
  title,
}: {
  goalId: string
  title: string
}) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('goal_checklists')
    .insert({
      goal_id: goalId,
      title,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function toggleChecklistItem({
  id,
  isCompleted,
}: {
  id: string
  isCompleted: boolean
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

  const { data, error } = await supabase
    .from('goal_checklists')
    .update({
      is_completed: isCompleted,
      completed_by: isCompleted
        ? user.id
        : null,
      completed_at: isCompleted
        ? new Date().toISOString()
        : null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteChecklistItem(
  id: string,
) {
  const supabase = createClient()

  const { error } = await supabase
    .from('goal_checklists')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}