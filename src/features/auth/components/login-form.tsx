'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'

import {
  loginSchema,
  type LoginFormValues,
} from '../schemas'

import { login } from '../api'


const inputClass =
  'mt-2 h-12 w-full rounded-2xl border border-neutral-200/80 bg-white/80 px-4 pl-11 text-[14px] text-neutral-800 placeholder:text-neutral-400 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/5'


export default function LoginForm() {

  const router = useRouter()

  const [showPassword, setShowPassword] =
    useState(false)


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })


  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: () => {
      router.replace('/dashboard')
      router.refresh()
    },
  })


  function onSubmit(
    values: LoginFormValues,
  ) {
    loginMutation.mutate(values)
  }


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >

      {/* ======================================================= */}
      {/* EMAIL */}
      {/* ======================================================= */}

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


      {/* ======================================================= */}
      {/* PASSWORD */}
      {/* ======================================================= */}

      <div>

        <div className="flex items-center justify-between">

          <label
            htmlFor="password"
            className="block text-[13px] font-medium text-neutral-600"
          >
            Password
          </label>

        </div>


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


      {/* ======================================================= */}
      {/* ERROR */}
      {/* ======================================================= */}

      {loginMutation.error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3">

          <p className="text-[13px] font-medium leading-5 text-rose-600">
            {loginMutation.error.message}
          </p>

        </div>
      )}


      {/* ======================================================= */}
      {/* SUBMIT */}
      {/* ======================================================= */}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="group relative w-full overflow-hidden rounded-2xl bg-[#111111] py-3.5 text-[14px] font-semibold text-white shadow-[0_8px_25px_-8px_rgba(0,0,0,0.5)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.55)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
      >

        {/* subtle gradient hover */}

        <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-pink-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />


        <span className="relative">
          {loginMutation.isPending
            ? 'Signing in…'
            : 'Sign in'}
        </span>

      </button>

    </form>
  )
}