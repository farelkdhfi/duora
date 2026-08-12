'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { registerSchema, type RegisterFormValues } from '../schemas'

import { register as registerUser } from '../api'

const inputClass =
  'mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-neutral-800 placeholder:text-neutral-400 shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none transition focus:border-neutral-900/20 focus:ring-4 focus:ring-neutral-900/5'

export default function RegisterForm() {
  const router = useRouter()

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="username" className="block text-[13px] font-medium text-neutral-600">
          Username
        </label>
        <input
          id="username"
          {...register('username')}
          placeholder="farel"
          className={inputClass}
        />
        {errors.username && (
          <p className="mt-1.5 text-[13px] font-medium text-rose-500">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="displayName" className="block text-[13px] font-medium text-neutral-600">
          Display Name
        </label>
        <input
          id="displayName"
          {...register('displayName')}
          placeholder="Farel Kadhafi"
          className={inputClass}
        />
        {errors.displayName && (
          <p className="mt-1.5 text-[13px] font-medium text-rose-500">
            {errors.displayName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-[13px] font-medium text-neutral-600">
          Email
        </label>
        <input
          id="email"
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className={inputClass}
        />
        {errors.email && (
          <p className="mt-1.5 text-[13px] font-medium text-rose-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-[13px] font-medium text-neutral-600">
          Password
        </label>
        <input
          id="password"
          {...register('password')}
          type="password"
          placeholder="••••••••"
          className={inputClass}
        />
        {errors.password && (
          <p className="mt-1.5 text-[13px] font-medium text-rose-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-neutral-600">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          {...register('confirmPassword')}
          type="password"
          placeholder="••••••••"
          className={inputClass}
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-[13px] font-medium text-rose-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {registerMutation.error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-600">
          {registerMutation.error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full rounded-2xl bg-neutral-900 py-3.5 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_20px_-6px_rgba(0,0,0,0.35)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {registerMutation.isPending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}