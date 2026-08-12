'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Heart,
  Brain,
  Zap,
  HandHeart,
  MessageCircle,
  Sparkles,
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

const textareaClass =
  'min-h-24 w-full resize-none rounded-[18px] border border-black/[0.06] bg-[#F7F7F9] px-4 py-3.5 text-[14px] leading-relaxed text-[#1C1C1E] placeholder:text-[#AEAEB2] outline-none transition-all duration-200 focus:border-[#007AFF]/30 focus:bg-white focus:ring-4 focus:ring-[#007AFF]/[0.06]'

/**
 * Mood-based theme tokens.
 * Each mood maps to:
 * - topBar: gradient for the thin accent bar at the top of the card
 * - glow: soft radial glow color behind the header (rgba)
 * - iconWrap: gradient background behind the header heart icon
 * - iconColor: color of the header heart icon
 * - button: gradient for the submit button
 * - buttonShadow: shadow color tuned to the button gradient
 * - ring: focus ring / accent color used sparingly for emphasis
 */
const moodTheme: Record<
  Mood,
  {
    topBar: string
    glow: string
    iconWrap: string
    iconColor: string
    button: string
    buttonShadow: string
    ring: string
  }
> = {
  happy: {
    topBar: 'bg-gradient-to-r from-[#FFD166] via-[#FF9F43] to-[#FF6B8A]',
    glow: 'bg-[#FFB020]/[0.10]',
    iconWrap: 'bg-gradient-to-br from-[#FFD166]/20 to-[#FF9F43]/20',
    iconColor: 'text-[#FF9500]',
    button:
      'bg-gradient-to-r from-[#FF9F43] to-[#FF6B8A] hover:from-[#FF8F2A] hover:to-[#FF5578]',
    buttonShadow:
      'shadow-[0_1px_2px_rgba(0,0,0,0.12),0_10px_28px_-8px_rgba(255,140,60,0.55)]',
    ring: 'focus:ring-[#FF9500]/[0.10] focus:border-[#FF9500]/30',
  },
  neutral: {
    topBar: 'bg-gradient-to-r from-[#FF6B8A] via-[#FF6B8A] to-[#007AFF]',
    glow: 'bg-[#007AFF]/[0.06]',
    iconWrap: 'bg-gradient-to-br from-[#FF6B8A]/10 to-[#007AFF]/10',
    iconColor: 'text-[#FF3B5C]',
    button:
      'bg-[#1C1C1E] hover:bg-black',
    buttonShadow:
      'shadow-[0_1px_2px_rgba(0,0,0,0.12),0_10px_24px_-8px_rgba(0,0,0,0.35)]',
    ring: 'focus:ring-[#007AFF]/[0.06] focus:border-[#007AFF]/30',
  },
  sad: {
    topBar: 'bg-gradient-to-r from-[#5A7FBF] via-[#5B6BAE] to-[#3A4A8F]',
    glow: 'bg-[#4A5FA8]/[0.10]',
    iconWrap: 'bg-gradient-to-br from-[#5A7FBF]/20 to-[#3A4A8F]/20',
    iconColor: 'text-[#4A5FA8]',
    button:
      'bg-gradient-to-r from-[#4A5FA8] to-[#2E3A6E] hover:from-[#40548F] hover:to-[#242E5A]',
    buttonShadow:
      'shadow-[0_1px_2px_rgba(0,0,0,0.12),0_10px_28px_-8px_rgba(58,74,143,0.5)]',
    ring: 'focus:ring-[#4A5FA8]/[0.10] focus:border-[#4A5FA8]/30',
  },
  tired: {
    topBar: 'bg-gradient-to-r from-[#9B8AC4] via-[#8177B5] to-[#5E6096]',
    glow: 'bg-[#8177B5]/[0.10]',
    iconWrap: 'bg-gradient-to-br from-[#9B8AC4]/20 to-[#5E6096]/20',
    iconColor: 'text-[#7A6FB0]',
    button:
      'bg-gradient-to-r from-[#8177B5] to-[#5E6096] hover:from-[#726899] hover:to-[#4F5180]',
    buttonShadow:
      'shadow-[0_1px_2px_rgba(0,0,0,0.12),0_10px_28px_-8px_rgba(94,96,150,0.5)]',
    ring: 'focus:ring-[#8177B5]/[0.10] focus:border-[#8177B5]/30',
  },
  stressed: {
    topBar: 'bg-gradient-to-r from-[#B0201F] via-[#D62E2E] to-[#7A1414]',
    glow: 'bg-[#D62E2E]/[0.12]',
    iconWrap: 'bg-gradient-to-br from-[#D62E2E]/20 to-[#7A1414]/20',
    iconColor: 'text-[#D62E2E]',
    button:
      'bg-gradient-to-r from-[#D62E2E] to-[#7A1414] hover:from-[#C22525] hover:to-[#650F0F]',
    buttonShadow:
      'shadow-[0_1px_2px_rgba(0,0,0,0.12),0_10px_28px_-8px_rgba(214,46,46,0.55)]',
    ring: 'focus:ring-[#D62E2E]/[0.10] focus:border-[#D62E2E]/30',
  },
}

function SectionIcon({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${className}`}
    >
      {children}
    </div>
  )
}

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
  register: any
  name: 'energy' | 'stress'
  error?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SectionIcon className="bg-[#F2F2F7]">
            {icon}
          </SectionIcon>

          <div>
            <p className="text-[13px] font-semibold text-[#1C1C1E]">
              {label}
            </p>

            <p className="mt-0.5 text-[11px] text-[#8E8E93]">
              Rate it from 1 to 10
            </p>
          </div>
        </div>

        <div className="rounded-full bg-[#1C1C1E] px-3 py-1 text-[12px] font-semibold tabular-nums text-white">
          {value}/10
        </div>
      </div>

      <input
        {...register(name, {
          valueAsNumber: true,
        })}
        type="range"
        min="1"
        max="10"
        step="1"
        className="mt-5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#E5E5EA] accent-[#007AFF] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black/[0.06] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.16)]"
      />

      <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-[0.08em] text-[#AEAEB2]">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>

      {error && (
        <p className="mt-2 text-[12px] font-medium text-[#FF3B30]">
          {error}
        </p>
      )}
    </div>
  )
}

export default function CheckinForm({
  relationshipId,
  date,
}: CheckinFormProps) {
  const { data, isLoading } = useTodayCheckin(
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
    formState: { errors },
  } = useForm<DailyCheckinFormValues>({
    resolver: zodResolver(dailyCheckinSchema),

    defaultValues: {
      mood: existing?.mood ?? 'neutral',
      energy: existing?.energy ?? 5,
      stress: existing?.stress ?? 5,
      likedToday: existing?.liked_today ?? '',
      dislikedToday: existing?.disliked_today ?? '',
      needsFromPartner:
        existing?.needs_from_partner ?? '',
      note: existing?.note ?? '',
    },
  })

  const mood = watch('mood')
  const energy = watch('energy')
  const stress = watch('stress')

  const theme = moodTheme[mood] ?? moodTheme.neutral

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-[14px] text-[#8E8E93]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E5E5EA] border-t-[#007AFF]" />
          Loading your check-in...
        </div>
      </div>
    )
  }

  function onSubmit(values: DailyCheckinFormValues) {
    mutation.mutate(
      {
        relationshipId,
        date,
        values,
      },
      {
        onSuccess: (saved) => {
          reset({
            mood: saved.mood,
            energy: saved.energy,
            stress: saved.stress,
            likedToday:
              saved.liked_today ?? '',
            dislikedToday:
              saved.disliked_today ?? '',
            needsFromPartner:
              saved.needs_from_partner ?? '',
            note: saved.note ?? '',
          })
        },
      },
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`relative mx-auto w-full overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_50px_-24px_rgba(0,0,0,0.16)]`}
    >
      {/* Top accent — shifts gradient based on mood */}
      <div
        className={`h-[3px] transition-colors duration-500 ${theme.topBar}`}
      />

      <div className="p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="relative">
          <div
            className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-colors duration-500 ${theme.glow}`}
          />

          <div className="relative flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] transition-colors duration-500 ${theme.iconWrap}`}
            >
              <Heart
                size={21}
                strokeWidth={2}
                className={`transition-colors duration-500 ${theme.iconColor}`}
              />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8E8E93]">
                Daily check-in
              </p>

              <h2 className="mt-1 text-[23px] font-semibold tracking-[-0.025em] text-[#1C1C1E]">
                How are you feeling?
              </h2>

              <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-[#8E8E93]">
                A small moment to understand yourself
                and let your partner in.
              </p>
            </div>
          </div>
        </div>

        {/* Mood */}
        <div className="mt-9">
          <div className="mb-4">
            <p className="text-[13px] font-semibold text-[#1C1C1E]">
              Your mood
            </p>

            <p className="mt-0.5 text-[12px] text-[#8E8E93]">
              Choose what feels closest to you today.
            </p>
          </div>

          <MoodSelector
            value={mood}
            onChange={(value) =>
              setValue('mood', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />

          {errors.mood && (
            <p className="mt-2 text-[12px] font-medium text-[#FF3B30]">
              {errors.mood.message}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-9 h-px bg-black/[0.05]" />

        {/* Energy + Stress */}
        <div>
          <div className="mb-5">
            <p className="text-[13px] font-semibold text-[#1C1C1E]">
              How are you doing?
            </p>

            <p className="mt-0.5 text-[12px] text-[#8E8E93]">
              Give yourself an honest rating.
            </p>
          </div>

          <div className="space-y-7 rounded-[24px] bg-[#F7F7F9] p-5 sm:p-6">
            <SliderSection
              icon={
                <Zap
                  size={16}
                  strokeWidth={2.25}
                  className="text-[#FF9500]"
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

            <div className="h-px bg-black/[0.05]" />

            <SliderSection
              icon={
                <Brain
                  size={16}
                  strokeWidth={2.25}
                  className="text-[#AF52DE]"
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

        {/* Divider */}
        <div className="my-9 h-px bg-black/[0.05]" />

        {/* Reflection */}
        <div>
          <div className="mb-5">
            <p className="text-[13px] font-semibold text-[#1C1C1E]">
              A little reflection
            </p>

            <p className="mt-0.5 text-[12px] text-[#8E8E93]">
              Share what matters. There is no right answer.
            </p>
          </div>

          <div className="space-y-6">
            {/* Liked */}
            <div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <SectionIcon className="bg-[#FF6B8A]/10">
                  <Heart
                    size={15}
                    strokeWidth={2.25}
                    className="text-[#FF3B5C]"
                  />
                </SectionIcon>

                <div>
                  <label
                    htmlFor="likedToday"
                    className="text-[13px] font-semibold text-[#1C1C1E]"
                  >
                    What did you like today?
                  </label>
                </div>
              </div>

              <textarea
                id="likedToday"
                {...register('likedToday')}
                placeholder="Something your partner did, something that made you happy..."
                className={`${textareaClass} ${theme.ring}`}
              />

              {errors.likedToday && (
                <p className="mt-2 text-[12px] font-medium text-[#FF3B30]">
                  {errors.likedToday.message}
                </p>
              )}
            </div>

            {/* Disliked */}
            <div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <SectionIcon className="bg-[#F2F2F7]">
                  <MessageCircle
                    size={15}
                    strokeWidth={2.25}
                    className="text-[#8E8E93]"
                  />
                </SectionIcon>

                <label
                  htmlFor="dislikedToday"
                  className="text-[13px] font-semibold text-[#1C1C1E]"
                >
                  What didn't you like today?
                </label>
              </div>

              <textarea
                id="dislikedToday"
                {...register('dislikedToday')}
                placeholder="Something that bothered you or could have been better..."
                className={`${textareaClass} ${theme.ring}`}
              />

              {errors.dislikedToday && (
                <p className="mt-2 text-[12px] font-medium text-[#FF3B30]">
                  {errors.dislikedToday.message}
                </p>
              )}
            </div>

            {/* Needs */}
            <div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <SectionIcon className="bg-[#007AFF]/10">
                  <HandHeart
                    size={15}
                    strokeWidth={2.25}
                    className="text-[#007AFF]"
                  />
                </SectionIcon>

                <label
                  htmlFor="needsFromPartner"
                  className="text-[13px] font-semibold text-[#1C1C1E]"
                >
                  What do you need from your partner?
                </label>
              </div>

              <textarea
                id="needsFromPartner"
                {...register('needsFromPartner')}
                placeholder="Maybe you need space, attention, encouragement..."
                className={`${textareaClass} ${theme.ring}`}
              />

              {errors.needsFromPartner && (
                <p className="mt-2 text-[12px] font-medium text-[#FF3B30]">
                  {errors.needsFromPartner.message}
                </p>
              )}
            </div>

            {/* Note */}
            <div>
              <div className="mb-2.5 flex items-center gap-2.5">
                <SectionIcon className="bg-[#AF52DE]/10">
                  <Sparkles
                    size={15}
                    strokeWidth={2.25}
                    className="text-[#AF52DE]"
                  />
                </SectionIcon>

                <label
                  htmlFor="note"
                  className="text-[13px] font-semibold text-[#1C1C1E]"
                >
                  Anything else?
                </label>
              </div>

              <textarea
                id="note"
                {...register('note')}
                placeholder="Anything else you want your partner to know..."
                className={`${textareaClass} ${theme.ring}`}
              />

              {errors.note && (
                <p className="mt-2 text-[12px] font-medium text-[#FF3B30]">
                  {errors.note.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {mutation.error && (
          <div className="mt-8 rounded-[18px] border border-[#FF3B30]/10 bg-[#FF3B30]/[0.04] px-4 py-3.5">
            <p className="text-[13px] font-medium text-[#FF3B30]">
              {mutation.error.message}
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="mt-9">
          <button
            type="submit"
            disabled={mutation.isPending}
            className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[18px] py-3.5 text-[14px] font-semibold text-white transition-all duration-500 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${theme.button} ${theme.buttonShadow}`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.08] to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <span className="relative">
              {mutation.isPending
                ? 'Saving your check-in...'
                : existing
                  ? 'Update Check-in'
                  : 'Save Check-in'}
            </span>
          </button>

          <p className="mt-3 text-center text-[11px] text-[#AEAEB2]">
            Your check-in helps you both understand each other better.
          </p>
        </div>
      </div>
    </form>
  )
}