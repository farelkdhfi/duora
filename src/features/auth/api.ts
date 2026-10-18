import { createClient } from '@/lib/supabase/client'

import { AuthApiError, toAuthError } from './errors'
import type {
  LoginFormValues,
  RegisterFormValues,
} from './schemas'

export async function login({
  email,
  password,
}: LoginFormValues) {
  const supabase = createClient()

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) {
    throw toAuthError(error)
  }

  return data
}

export async function register({
  username,
  displayName,
  email,
  password,
}: RegisterFormValues) {
  const supabase = createClient()

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,

      options: {
        data: {
          username,
          display_name: displayName,
        },
      },
    })

  if (error) {
    throw toAuthError(error)
  }

  // Kalau email confirmation aktif, Supabase nggak ngasih error untuk
  // email yang sudah terdaftar (anti user-enumeration). Tandanya:
  // user ada tapi identities kosong.
  if (data.user && data.user.identities?.length === 0) {
    throw new AuthApiError('emailTaken')
  }

  return data
}

export async function logout() {
  const supabase = createClient()

  const { error } =
    await supabase.auth.signOut()

  if (error) {
    throw toAuthError(error)
  }
}