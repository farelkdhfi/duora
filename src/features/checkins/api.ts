import { createClient } from '@/lib/supabase/client'

import type {
  DailyCheckin,
  DailyCheckinHistoryEntry,
} from './types'

import type {
  DailyCheckinFormValues,
} from './schemas'

export async function getTodayCheckin(
  relationshipId: string,
  date: string,
) {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq(
      'relationship_id',
      relationshipId,
    )
    .eq(
      'checkin_date',
      date,
    )

  if (error) {
    throw new Error(error.message)
  }

  return data as DailyCheckin[]
}

export async function getCheckinHistory(
  relationshipId: string,
) {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq(
      'relationship_id',
      relationshipId,
    )
    .order('checkin_date', {
      ascending: false,
    })
    .limit(30)

  if (error) {
    throw new Error(error.message)
  }

  return data as DailyCheckin[]
}

export async function upsertCheckin({
  relationshipId,
  date,
  values,
}: {
  relationshipId: string
  date: string
  values: DailyCheckinFormValues
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
    .from('daily_checkins')
    .upsert(
      {
        relationship_id:
          relationshipId,

        user_id: user.id,

        checkin_date: date,

        mood: values.mood,

        energy: values.energy,

        stress: values.stress,

        liked_today:
          values.likedToday ||
          null,

        disliked_today:
          values.dislikedToday ||
          null,

        needs_from_partner:
          values.needsFromPartner ||
          null,

        note:
          values.note ||
          null,
      },
      {
        onConflict:
          'user_id,checkin_date',
      },
    )
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as DailyCheckin
}

export async function getCheckinEditCountToday(
  relationshipId: string,
  date: string
): Promise<number> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('get_checkin_edit_count_today', {
    p_relationship_id: relationshipId,
    p_date: date,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data as number
}

export async function getCheckinHistoryEntries(
  checkinId: string,
): Promise<DailyCheckinHistoryEntry[]> {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('daily_checkin_history')
    .select('*')
    .eq('checkin_id', checkinId)
    .order('changed_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data as DailyCheckinHistoryEntry[]
}