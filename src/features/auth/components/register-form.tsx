'use client'

import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'

import {
  registerSchema,
  type RegisterFormValues,
} from '../schemas'

import { register as registerUser } from '../api'


const inputClass =
  'mt-2 h-12 w-full rounded-2xl border border-neutral-200/80 bg-white/80 px-4 pl-11 text-[14px] text-neutral-800 placeholder:text-neutral-400 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/5'


export default function RegisterForm() {

  const router = useRouter()
  const supabase = createClient()

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false)


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })


  const registerMutation = useMutation({

    mutationFn: registerUser,

    onSuccess: (data) => {

      if (data.session) {
        router.replace('/dashboard')
        router.refresh()
      }

    },

  })


  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values)
  }


  async function handleGoogleSignUp() {

    setIsGoogleLoading(true)

    const { error } =
      await supabase.auth.signInWithOAuth({

        provider: 'google',

        options: {
          redirectTo:
            `${window.location.origin}/auth/callback`,
        },

      })


    if (error) {

      console.error(
        'Google sign up error:',
        error,
      )

      setIsGoogleLoading(false)

    }

  }


  return (
    <div className="space-y-5">


      {/* ======================================================= */}
      {/* FORM */}
      {/* ======================================================= */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >


        {/* ===================================================== */}
        {/* USERNAME */}
        {/* ===================================================== */}

        <div>

          <label
            htmlFor="username"
            className="block text-[13px] font-medium text-neutral-600"
          >
            Username
          </label>


          <div className="relative">

            <User
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
            />


            <input
              id="username"
              {...register('username')}
              type="text"
              placeholder="farel"
              className={inputClass}
            />

          </div>


          {errors.username && (
            <p className="mt-1.5 text-[13px] font-medium text-rose-500">
              {errors.username.message}
            </p>
          )}

        </div>


        {/* ===================================================== */}
        {/* DISPLAY NAME */}
        {/* ===================================================== */}

        <div>

          <label
            htmlFor="displayName"
            className="block text-[13px] font-medium text-neutral-600"
          >
            Display Name
          </label>


          <div className="relative">

            <UserRound
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
            />


            <input
              id="displayName"
              {...register('displayName')}
              type="text"
              placeholder="Farel Kadhafi"
              className={inputClass}
            />

          </div>


          {errors.displayName && (
            <p className="mt-1.5 text-[13px] font-medium text-rose-500">
              {errors.displayName.message}
            </p>
          )}

        </div>


        {/* ===================================================== */}
        {/* EMAIL */}
        {/* ===================================================== */}

        <div>

          <label
            htmlFor="email"
            className="block text-[13px] font-medium text-neutral-600"
          >
            Email
          </label>


          <div className="relative">

            <Mail
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
            />


            <input
              id="email"
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className={inputClass}
            />

          </div>


          {errors.email && (
            <p className="mt-1.5 text-[13px] font-medium text-rose-500">
              {errors.email.message}
            </p>
          )}

        </div>


        {/* ===================================================== */}
        {/* PASSWORD */}
        {/* ===================================================== */}

        <div>

          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-neutral-600"
          >
            Password
          </label>


          <div className="relative">

            <LockKeyhole
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
            />


            <input
              id="password"
              {...register('password')}
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              placeholder="••••••••"
              className={`${inputClass} pr-11`}
            />


            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value,
                )
              }
              className="absolute right-3 top-1/2 mt-[4px] flex size-8 -translate-y-1/2 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >

              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}

            </button>

          </div>


          {errors.password && (
            <p className="mt-1.5 text-[13px] font-medium text-rose-500">
              {errors.password.message}
            </p>
          )}

        </div>


        {/* ===================================================== */}
        {/* CONFIRM PASSWORD */}
        {/* ===================================================== */}

        <div>

          <label
            htmlFor="confirmPassword"
            className="block text-[13px] font-medium text-neutral-600"
          >
            Confirm Password
          </label>


          <div className="relative">

            <LockKeyhole
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
            />


            <input
              id="confirmPassword"
              {...register('confirmPassword')}
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              placeholder="••••••••"
              className={`${inputClass} pr-11`}
            />


            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (value) => !value,
                )
              }
              className="absolute right-3 top-1/2 mt-[4px] flex size-8 -translate-y-1/2 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >

              {showConfirmPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}

            </button>

          </div>


          {errors.confirmPassword && (
            <p className="mt-1.5 text-[13px] font-medium text-rose-500">
              {errors.confirmPassword.message}
            </p>
          )}

        </div>


        {/* ===================================================== */}
        {/* ERROR */}
        {/* ===================================================== */}

        {registerMutation.error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3">

            <p className="text-[13px] font-medium leading-5 text-rose-600">
              {registerMutation.error.message}
            </p>

          </div>
        )}


        {/* ===================================================== */}
        {/* SUBMIT */}
        {/* ===================================================== */}

        <button
          type="submit"
          disabled={
            registerMutation.isPending ||
            isGoogleLoading
          }
          className="group relative w-full overflow-hidden rounded-2xl bg-[#111111] py-3.5 text-[14px] font-semibold text-white shadow-[0_8px_25px_-8px_rgba(0,0,0,0.5)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.55)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-pink-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />


          <span className="relative">

            {registerMutation.isPending
              ? 'Creating account…'
              : 'Create account'}

          </span>

        </button>

      </form>


      {/* ======================================================= */}
      {/* DIVIDER */}
      {/* ======================================================= */}

      <div className="flex items-center gap-3">

        <div className="h-px flex-1 bg-neutral-200" />

        <span className="text-[12px] font-medium text-neutral-400">
          or
        </span>

        <div className="h-px flex-1 bg-neutral-200" />

      </div>


      {/* ======================================================= */}
      {/* GOOGLE */}
      {/* ======================================================= */}

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={
          isGoogleLoading ||
          registerMutation.isPending
        }
        className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-neutral-200/80 bg-white text-[14px] font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
      >

        <svg
          width="18"
          height="18"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >

          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />

          <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
          />

          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />

          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
          />

        </svg>


        <span>

          {isGoogleLoading
            ? 'Connecting…'
            : 'Continue with Google'}

        </span>

      </button>

    </div>
  )
}