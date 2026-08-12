import { createClient } from '@/lib/supabase/client'

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
    throw new Error(error.message)
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
    throw new Error(error.message)
  }

  return data
}

export async function logout() {
  const supabase = createClient()

  const { error } =
    await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}