'use client'

import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
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

type Step = 1 | 2 | 3 | 4 | 5 | 6

const totalSteps = 6

export default function RegisterForm() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>(1)

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false)

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
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

  async function handleNext() {
    if (step === 1) {
      setStep(2)
      return
    }

    const fieldsByStep: Record<
      Exclude<Step, 1>,
      keyof RegisterFormValues | (keyof RegisterFormValues)[]
    > = {
      2: 'username',
      3: 'displayName',
      4: 'email',
      5: 'password',
      6: 'confirmPassword',
    }

    const fields = fieldsByStep[step]

    const valid = await trigger(fields)

    if (!valid) {
      return
    }

    if (step < totalSteps) {
      setStep((current) => (current + 1) as Step)
    }
  }

  function handleBack() {
    if (step === 1) {
      return
    }

    setStep((current) => (current - 1) as Step)
  }

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

  const stepTitles = {
    1: {
      title: 'How do you want to join?',
      description:
        'Choose the easiest way to create your Duora space.',
    },

    2: {
      title: 'Choose your username.',
      description:
        'This is how you will be recognized inside Duora.',
    },

    3: {
      title: 'What should we call you?',
      description:
        'Use your name or anything you want your partner to see.',
    },

    4: {
      title: 'What’s your email?',
      description:
        'We’ll use this email to secure your account.',
    },

    5: {
      title: 'Create your password.',
      description:
        'Choose something secure that you can remember.',
    },

    6: {
      title: 'One last thing.',
      description:
        'Confirm your password and your Duora account is ready.',
    },
  }

  const currentTitle = stepTitles[step]

  return (
    <div className="space-y-6">

      {/* ===================================================== */}
      {/* PROGRESS */}
      {/* ===================================================== */}

      {step > 1 && (
        <div className="flex items-center gap-2">

          {Array.from({ length: 5 }).map((_, index) => {
            const current = index + 2

            return (
              <div
                key={current}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  step >= current
                    ? 'bg-gradient-to-r from-pink-300 to-blue-300'
                    : 'bg-neutral-200'
                }`}
              />
            )
          })}

        </div>
      )}

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className='mt-30'>
        <h3 className="mt-2 text-sm font-semibold leading-[1] tracking-[-0.055em] text-neutral-900 md:text-[28px]">
          {currentTitle.title}
        </h3>

        <p className="mt-3 max-w-sm text-[13px] leading-5 text-neutral-400">
          {currentTitle.description}
        </p>

      </div>

      {/* ===================================================== */}
      {/* STEP 1 — METHOD */}
      {/* ===================================================== */}

      {step === 1 && (
        <div className="space-y-3">

          {/* GOOGLE */}

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-neutral-200/80 bg-white text-sm font-medium text-neutral-700 shadow-lg transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* DIVIDER */}

          <div className="flex items-center gap-3 py-1">

            <div className="h-px flex-1 bg-neutral-200" />

            <span className="text-[12px] font-medium text-neutral-400">
              or
            </span>

            <div className="h-px flex-1 bg-neutral-200" />

          </div>

          {/* MANUAL */}

          <button
            type="button"
            onClick={handleNext}
            disabled={isGoogleLoading}
            className="flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-black/5 bg-white py-3.5 text-sm font-semibold text-black shadow-lg transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>
              Sign up with email
            </span>

            <ArrowRight size={14} />

          </button>

        </div>
      )}

      {/* ===================================================== */}
      {/* FORM */}
      {/* ===================================================== */}

      {step > 1 && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* ================================================= */}
          {/* USERNAME */}
          {/* ================================================= */}

          {step === 2 && (
            <div>

              <div className="relative">

                <User
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="username"
                  autoFocus
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
          )}

          {/* ================================================= */}
          {/* DISPLAY NAME */}
          {/* ================================================= */}

          {step === 3 && (
            <div>

              <div className="relative">

                <UserRound
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="displayName"
                  autoFocus
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
          )}

          {/* ================================================= */}
          {/* EMAIL */}
          {/* ================================================= */}

          {step === 4 && (
            <div>

              <div className="relative">

                <Mail
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="email"
                  autoFocus
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
          )}

          {/* ================================================= */}
          {/* PASSWORD */}
          {/* ================================================= */}

          {step === 5 && (
            <div>

              <div className="relative">

                <LockKeyhole
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="password"
                  autoFocus
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
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
          )}

          {/* ================================================= */}
          {/* CONFIRM PASSWORD */}
          {/* ================================================= */}

          {step === 6 && (
            <div>

              <div className="relative">

                <LockKeyhole
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 mt-[4px] -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="confirmPassword"
                  autoFocus
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
          )}

          {/* ================================================= */}
          {/* SERVER ERROR */}
          {/* ================================================= */}

          {registerMutation.error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3">

              <p className="text-[13px] font-medium leading-5 text-rose-600">
                {registerMutation.error.message}
              </p>

            </div>
          )}

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div className="flex items-center gap-3">

            {/* BACK */}

            <button
              type="button"
              onClick={handleBack}
              disabled={registerMutation.isPending}
              className="flex size-12 shrink-0 items-center justify-center rounded-full border border-black/5 bg-white text-neutral-500 shadow-lg transition hover:bg-neutral-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Go back"
            >

              <ArrowLeft size={16} />

            </button>

            {/* CONTINUE */}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={registerMutation.isPending}
                className="flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full border border-black/5 bg-white text-sm font-semibold text-black shadow-lg transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <span>
                  Continue
                </span>

                <ArrowRight size={14} />

              </button>
            ) : (

              /* CREATE ACCOUNT */

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full border border-black/5 bg-white text-sm font-semibold text-black shadow-lg transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {registerMutation.isPending ? (
                  <span>
                    Creating account…
                  </span>
                ) : (
                  <>
                    <span>
                      Create account
                    </span>

                    <ArrowRight size={14} />
                  </>
                )}

              </button>

            )}

          </div>

        </form>
      )}

      {/* ===================================================== */}
      {/* STEP INDICATOR */}
      {/* ===================================================== */}

      {step > 1 && (
        <div className="flex items-center justify-center gap-2">

          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {step - 1} / 5
          </span>

        </div>
      )}

    </div>
  )
}