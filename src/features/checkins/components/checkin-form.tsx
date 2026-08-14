'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Brain,
  HandHeart,
  Heart,
  MessageCircle,
  Sparkles,
  Zap,
} from 'lucide-react'

import {
  dailyCheckinSchema,
  type DailyCheckinFormValues,
} from '../schemas'

import {
  useTodayCheckin,
  useUpsertCheckin,
} from '../queries'

import MoodSelector from './mood-selector'
import type { Mood } from '../types'

interface CheckinFormProps {
  relationshipId: string
  date: string
}

/* ============================================================= */
/* INPUT */
/* ============================================================= */

const textareaClass = `
  mt-3
  min-h-28
  w-full
  resize-none
  rounded-[1.25rem]
  border
  border-black/[0.055]
  bg-neutral-50/70
  px-4
  py-3.5
  text-[13px]
  leading-6
  text-neutral-800
  outline-none
  transition-all
  duration-200
  placeholder:text-neutral-300
  hover:border-black/[0.08]
  focus:border-black/[0.12]
  focus:bg-white
  focus:ring-4
  focus:ring-black/[0.025]
`

/* ============================================================= */
/* MOOD THEME */
/* ============================================================= */

const moodTheme: Record<
  Mood,
  {
    accent: string
    glow: string
    iconWrap: string
    iconColor: string
    badge: string
    button: string
  }
> = {
  happy: {
    accent:
      'bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400',

    glow:
      'bg-orange-300/[0.10]',

    iconWrap:
      'bg-gradient-to-br from-amber-100 to-orange-100',

    iconColor:
      'text-orange-500',

    badge:
      'border-orange-100 bg-orange-50 text-orange-600',

    button:
      'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500',
  },

  neutral: {
    accent:
      'bg-gradient-to-r from-blue-300 via-indigo-300 to-pink-300',

    glow:
      'bg-blue-300/[0.08]',

    iconWrap:
      'bg-gradient-to-br from-blue-50 to-pink-50',

    iconColor:
      'text-blue-500',

    badge:
      'border-blue-100 bg-blue-50 text-blue-600',

    button:
      'bg-neutral-900 hover:bg-neutral-800',
  },

  sad: {
    accent:
      'bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-600',

    glow:
      'bg-indigo-400/[0.10]',

    iconWrap:
      'bg-gradient-to-br from-blue-100 to-indigo-100',

    iconColor:
      'text-indigo-500',

    badge:
      'border-indigo-100 bg-indigo-50 text-indigo-600',

    button:
      'bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800',
  },

  tired: {
    accent:
      'bg-gradient-to-r from-violet-300 via-violet-400 to-indigo-500',

    glow:
      'bg-violet-400/[0.10]',

    iconWrap:
      'bg-gradient-to-br from-violet-100 to-indigo-100',

    iconColor:
      'text-violet-500',

    badge:
      'border-violet-100 bg-violet-50 text-violet-600',

    button:
      'bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700',
  },

  stressed: {
    accent:
      'bg-gradient-to-r from-rose-400 via-red-500 to-red-700',

    glow:
      'bg-rose-400/[0.10]',

    iconWrap:
      'bg-gradient-to-br from-rose-100 to-red-100',

    iconColor:
      'text-rose-500',

    badge:
      'border-rose-100 bg-rose-50 text-rose-600',

    button:
      'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700',
  },
}

/* ============================================================= */
/* SECTION ICON */
/* ============================================================= */

function SectionIcon({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`
        flex
        size-9
        shrink-0
        items-center
        justify-center
        rounded-xl
        ${className}
      `}
    >
      {children}
    </div>
  )
}

/* ============================================================= */
/* SECTION HEADER */
/* ============================================================= */

function SectionHeader({
  icon,
  iconClassName,
  title,
  description,
}: {
  icon: React.ReactNode
  iconClassName?: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">

      <SectionIcon className={iconClassName}>
        {icon}
      </SectionIcon>

      <div className="min-w-0">

        <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-neutral-800">
          {title}
        </h3>

        <p className="mt-0.5 text-[11px] leading-5 text-neutral-400">
          {description}
        </p>

      </div>

    </div>
  )
}

/* ============================================================= */
/* SLIDER */
/* ============================================================= */

function SliderSection({
  icon,
  label,
  value,
  minLabel,
  maxLabel,
  register,
  name,
  error,
}: {
  icon: React.ReactNode
  label: string
  value: number
  minLabel: string
  maxLabel: string
  register: ReturnType<
    typeof useForm<DailyCheckinFormValues>
  >['register']
  name: 'energy' | 'stress'
  error?: string
}) {
  const percentage =
    ((value - 1) / 9) * 100

  return (
    <div>

      {/* Header */}

      <div className="flex items-center justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">

            {icon}

          </div>

          <div className="min-w-0">

            <p className="text-[13px] font-semibold text-neutral-800">
              {label}
            </p>

            <p className="mt-0.5 text-[10px] text-neutral-400">
              Rate from 1 to 10
            </p>

          </div>

        </div>


        {/* Value */}

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900">

          <span className="text-[12px] font-bold tabular-nums text-white">
            {value}
          </span>

        </div>

      </div>


      {/* Slider */}

      <div className="relative mt-5">

        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-neutral-200">

          <div
            className="h-full rounded-full bg-neutral-900 transition-all duration-200"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

        <input
          {...register(name, {
            valueAsNumber: true,
          })}
          type="range"
          min="1"
          max="10"
          step="1"
          className="
            relative
            z-10
            h-6
            w-full
            cursor-pointer
            appearance-none
            bg-transparent
            accent-neutral-900

            [&::-webkit-slider-runnable-track]:h-1.5
            [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-runnable-track]:bg-transparent

            [&::-webkit-slider-thumb]:mt-[-7px]
            [&::-webkit-slider-thumb]:size-5
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border
            [&::-webkit-slider-thumb]:border-black/[0.08]
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_3px_10px_rgba(0,0,0,0.16)]
          "
        />

      </div>


      {/* Labels */}

      <div className="mt-1 flex items-center justify-between">

        <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-neutral-300">
          {minLabel}
        </span>

        <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-neutral-300">
          {maxLabel}
        </span>

      </div>


      {error && (
        <p className="mt-2 text-[11px] font-medium text-rose-500">
          {error}
        </p>
      )}

    </div>
  )
}

/* ============================================================= */
/* MAIN */
/* ============================================================= */

export default function CheckinForm({
  relationshipId,
  date,
}: CheckinFormProps) {

  const {
    data,
    isLoading,
  } = useTodayCheckin(
    relationshipId,
    date,
  )

  const mutation = useUpsertCheckin()

  const existing = data?.[0]

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {
      errors,
    },
  } = useForm<DailyCheckinFormValues>({
    resolver: zodResolver(
      dailyCheckinSchema,
    ),

    defaultValues: {
      mood:
        existing?.mood ??
        'neutral',

      energy:
        existing?.energy ??
        5,

      stress:
        existing?.stress ??
        5,

      likedToday:
        existing?.liked_today ??
        '',

      dislikedToday:
        existing?.disliked_today ??
        '',

      needsFromPartner:
        existing?.needs_from_partner ??
        '',

      note:
        existing?.note ??
        '',
    },
  })

  const mood = watch('mood')
  const energy = watch('energy')
  const stress = watch('stress')

  const theme =
    moodTheme[mood] ??
    moodTheme.neutral


  /* =========================================================== */
  /* LOADING */
  /* =========================================================== */

  if (isLoading) {
    return (
      <div className="animate-pulse">

        <div className="overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white p-6 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.15)] sm:p-8">

          <div className="flex items-center gap-3">

            <div className="size-11 rounded-2xl bg-neutral-100" />

            <div className="space-y-2">

              <div className="h-2.5 w-24 rounded-full bg-neutral-100" />

              <div className="h-5 w-48 rounded-full bg-neutral-100" />

            </div>

          </div>


          <div className="mt-9 grid grid-cols-3 gap-2">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 rounded-2xl bg-neutral-100"
              />
            ))}

          </div>


          <div className="mt-8 rounded-[1.5rem] bg-neutral-100 p-6">

            <div className="h-4 w-32 rounded-full bg-neutral-200" />

            <div className="mt-6 h-2 rounded-full bg-neutral-200" />

            <div className="mt-7 h-2 rounded-full bg-neutral-200" />

          </div>


          <div className="mt-8 space-y-4">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 rounded-[1.5rem] bg-neutral-100"
              />
            ))}

          </div>

        </div>

      </div>
    )
  }


  /* =========================================================== */
  /* SUBMIT */
  /* =========================================================== */

  function onSubmit(
    values: DailyCheckinFormValues,
  ) {

    mutation.mutate(
      {
        relationshipId,
        date,
        values,
      },
      {
        onSuccess: (saved) => {

          reset({
            mood:
              saved.mood,

            energy:
              saved.energy,

            stress:
              saved.stress,

            likedToday:
              saved.liked_today ??
              '',

            dislikedToday:
              saved.disliked_today ??
              '',

            needsFromPartner:
              saved.needs_from_partner ??
              '',

            note:
              saved.note ??
              '',
          })

        },
      },
    )
  }


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        relative
        mx-auto
        w-full
        overflow-hidden
        rounded-[2rem]
        border
        border-black/[0.05]
        bg-white
        shadow-[0_25px_70px_-35px_rgba(0,0,0,0.18)]
      "
    >

      {/* ===================================================== */}
      {/* ACCENT */}
      {/* ===================================================== */}

      <div
        className={`
          h-1
          transition-all
          duration-500
          ${theme.accent}
        `}
      />


      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">

        <div
          className={`
            pointer-events-none
            absolute
            -right-24
            -top-24
            size-64
            rounded-full
            blur-[100px]
            transition-colors
            duration-700
            ${theme.glow}
          `}
        />


        <div className="relative flex items-start justify-between gap-5">

          <div className="flex items-start gap-3.5">

            <div
              className={`
                flex
                size-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                transition-colors
                duration-500
                ${theme.iconWrap}
              `}
            >

              <Heart
                size={19}
                strokeWidth={2}
                className={theme.iconColor}
                fill="currentColor"
              />

            </div>


            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-neutral-300">
                Daily check-in
              </p>

              <h1 className="mt-1.5 text-xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-2xl">
                How are you feeling?
              </h1>

              <p className="mt-2 max-w-lg text-[12px] leading-5 text-neutral-400 sm:text-[13px]">
                Take a small moment for yourself.
                Your partner will be able to understand
                how you're doing today.
              </p>

            </div>

          </div>


          {existing && (
            <div
              className={`
                hidden
                shrink-0
                rounded-full
                border
                px-3
                py-1.5
                sm:block
                ${theme.badge}
              `}
            >
              <span className="text-[10px] font-semibold">
                Updated
              </span>
            </div>
          )}

        </div>


        {/* =================================================== */}
        {/* MOOD */}
        {/* =================================================== */}

        <section className="mt-9">

          <div className="mb-4">

            <p className="text-[13px] font-semibold tracking-[-0.01em] text-neutral-800">
              Your mood
            </p>

            <p className="mt-0.5 text-[11px] text-neutral-400">
              Choose the feeling that fits you best today.
            </p>

          </div>


          <div className="rounded-[1.5rem] border border-black/[0.04] bg-neutral-50/60 p-3 sm:p-4">

            <MoodSelector
              value={mood}
              onChange={(value) =>
                setValue(
                  'mood',
                  value,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                )
              }
            />

          </div>


          {errors.mood && (
            <p className="mt-2 text-[11px] font-medium text-rose-500">
              {errors.mood.message}
            </p>
          )}

        </section>


        {/* =================================================== */}
        {/* DIVIDER */}
        {/* =================================================== */}

        <div className="my-9 h-px bg-black/[0.045]" />


        {/* =================================================== */}
        {/* ENERGY / STRESS */}
        {/* =================================================== */}

        <section>

          <div className="mb-5">

            <p className="text-[13px] font-semibold tracking-[-0.01em] text-neutral-800">
              How are you doing?
            </p>

            <p className="mt-0.5 text-[11px] text-neutral-400">
              Be honest. There is no right score.
            </p>

          </div>


          <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.04] bg-neutral-50/60">

            <div className="p-5 sm:p-6">

              <SliderSection
                icon={
                  <Zap
                    size={15}
                    strokeWidth={2.3}
                    className="text-amber-500"
                  />
                }
                label="Energy"
                value={energy}
                minLabel="Exhausted"
                maxLabel="Energetic"
                register={register}
                name="energy"
                error={errors.energy?.message}
              />

            </div>


            <div className="mx-5 h-px bg-black/[0.045] sm:mx-6" />


            <div className="p-5 sm:p-6">

              <SliderSection
                icon={
                  <Brain
                    size={15}
                    strokeWidth={2.3}
                    className="text-violet-500"
                  />
                }
                label="Stress"
                value={stress}
                minLabel="Relaxed"
                maxLabel="Very stressed"
                register={register}
                name="stress"
                error={errors.stress?.message}
              />

            </div>

          </div>

        </section>


        {/* =================================================== */}
        {/* DIVIDER */}
        {/* =================================================== */}

        <div className="my-9 h-px bg-black/[0.045]" />


        {/* =================================================== */}
        {/* REFLECTION */}
        {/* =================================================== */}

        <section>

          <div className="mb-6">

            <div className="flex items-center gap-2">

              <Sparkles
                size={14}
                className="text-neutral-400"
              />

              <p className="text-[13px] font-semibold tracking-[-0.01em] text-neutral-800">
                A little reflection
              </p>

            </div>

            <p className="mt-1 text-[11px] text-neutral-400">
              Share what matters. Even a few words are enough.
            </p>

          </div>


          <div className="space-y-5">

            {/* ================================================= */}
            {/* LIKED */}
            {/* ================================================= */}

            <div>

              <SectionHeader
                icon={
                  <Heart
                    size={15}
                    strokeWidth={2.2}
                    className="text-pink-500"
                  />
                }
                iconClassName="bg-pink-50"
                title="What did you like today?"
                description="Something that made you happy."
              />


              <textarea
                id="likedToday"
                {...register('likedToday')}
                placeholder="Something your partner did, something that made you smile..."
                className={textareaClass}
              />


              {errors.likedToday && (
                <p className="mt-2 px-1 text-[11px] font-medium text-rose-500">
                  {errors.likedToday.message}
                </p>
              )}

            </div>


            {/* ================================================= */}
            {/* DISLIKED */}
            {/* ================================================= */}

            <div>

              <SectionHeader
                icon={
                  <MessageCircle
                    size={15}
                    strokeWidth={2.2}
                    className="text-neutral-500"
                  />
                }
                iconClassName="bg-neutral-100"
                title="What didn't you like today?"
                description="Something that could have been better."
              />


              <textarea
                id="dislikedToday"
                {...register('dislikedToday')}
                placeholder="Something that bothered you or felt difficult..."
                className={textareaClass}
              />


              {errors.dislikedToday && (
                <p className="mt-2 px-1 text-[11px] font-medium text-rose-500">
                  {errors.dislikedToday.message}
                </p>
              )}

            </div>


            {/* ================================================= */}
            {/* NEEDS */}
            {/* ================================================= */}

            <div>

              <SectionHeader
                icon={
                  <HandHeart
                    size={15}
                    strokeWidth={2.2}
                    className="text-blue-500"
                  />
                }
                iconClassName="bg-blue-50"
                title="What do you need from your partner?"
                description="Tell them how they can be there for you."
              />


              <textarea
                id="needsFromPartner"
                {...register('needsFromPartner')}
                placeholder="Maybe you need space, attention, encouragement..."
                className={textareaClass}
              />


              {errors.needsFromPartner && (
                <p className="mt-2 px-1 text-[11px] font-medium text-rose-500">
                  {errors.needsFromPartner.message}
                </p>
              )}

            </div>


            {/* ================================================= */}
            {/* NOTE */}
            {/* ================================================= */}

            <div>

              <SectionHeader
                icon={
                  <Sparkles
                    size={15}
                    strokeWidth={2.2}
                    className="text-violet-500"
                  />
                }
                iconClassName="bg-violet-50"
                title="Anything else?"
                description="Anything you want your partner to know."
              />


              <textarea
                id="note"
                {...register('note')}
                placeholder="Write anything else that's on your mind..."
                className={textareaClass}
              />


              {errors.note && (
                <p className="mt-2 px-1 text-[11px] font-medium text-rose-500">
                  {errors.note.message}
                </p>
              )}

            </div>

          </div>

        </section>


        {/* =================================================== */}
        {/* ERROR */}
        {/* =================================================== */}

        {mutation.error && (

          <div className="mt-7 rounded-[1.25rem] border border-rose-100 bg-rose-50/60 px-4 py-3.5">

            <p className="text-[11px] font-medium leading-5 text-rose-500">
              {mutation.error.message}
            </p>

          </div>

        )}


        {/* =================================================== */}
        {/* SUBMIT */}
        {/* =================================================== */}

        <div className="mt-8 sm:mt-9">

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`
              group
              relative
              flex
              h-13
              w-full
              items-center
              justify-center
              overflow-hidden
              rounded-[1.25rem]
              px-5
              text-[12px]
              font-semibold
              text-white
              shadow-[0_15px_35px_-15px_rgba(0,0,0,0.35)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]
              active:translate-y-0
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${theme.button}
            `}
          >

            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.10] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />


            <span className="relative flex items-center gap-2">

              {mutation.isPending ? (

                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Saving your check-in...

                </>

              ) : (

                <>
                  {existing
                    ? 'Update Check-in'
                    : 'Save Check-in'}

                  <span className="flex size-6 items-center justify-center rounded-full bg-white/10">

                    <Heart
                      size={12}
                      fill="currentColor"
                      strokeWidth={2}
                    />

                  </span>

                </>

              )}

            </span>

          </button>


          <div className="mt-4 flex items-center justify-center gap-1.5">

            <Sparkles
              size={10}
              className="text-neutral-300"
            />

            <p className="text-center text-[10px] leading-5 text-neutral-300">
              A small check-in can make a big difference
              in understanding each other.
            </p>

          </div>

        </div>

      </div>

    </form>
  )
}