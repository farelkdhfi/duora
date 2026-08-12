import { createClient } from '@/lib/supabase/client'

import type {
  CreatePlannerEventFormValues,
} from './schemas'

export async function getPlannerEvents(
  relationshipId: string,
) {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('planner_events')
    .select('*')
    .eq(
      'relationship_id',
      relationshipId,
    )
    .order('event_date', {
      ascending: true,
    })
    .order('start_time', {
      ascending: true,
    })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createPlannerEvent({
  relationshipId,
  values,
}: {
  relationshipId: string
  values: CreatePlannerEventFormValues
}) {
  const supabase = createClient()

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error(
      'Not authenticated',
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('planner_events')
    .insert({
      relationship_id:
        relationshipId,

      created_by: user.id,

      title: values.title,

      description:
        values.description ||
        null,

      category:
        values.category,

      event_date:
        values.eventDate,

      start_time:
        values.isAllDay
          ? null
          : values.startTime ||
            null,

      end_time:
        values.isAllDay
          ? null
          : values.endTime ||
            null,

      is_all_day:
        values.isAllDay,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deletePlannerEvent(
  eventId: string,
) {
  const supabase = createClient()

  const { error } =
    await supabase
      .from('planner_events')
      .delete()
      .eq('id', eventId)

  if (error) {
    throw new Error(error.message)
  }
}