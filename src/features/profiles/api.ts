import { createClient } from '@/lib/supabase/client'

import { ProfileApiError, toProfileError } from './errors'

export async function getMyProfile() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ProfileApiError('notAuthenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    throw toProfileError(error)
  }

  return data
}

export async function updateMyProfile(payload: {
  display_name?: string
  username?: string
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ProfileApiError('notAuthenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    throw toProfileError(error)
  }

  return data
}

export async function updateMyAvatar(file: File) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ProfileApiError('notAuthenticated')
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw toProfileError(uploadError)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath)

  const { data, error } = await supabase
    .from('profiles')
    .update({
      avatar_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    throw toProfileError(error)
  }

  return data
}