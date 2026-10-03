'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'

import { dailyCheckinSchema, type DailyCheckinFormValues } from '../schemas'
import { useTodayCheckin, useUpsertCheckin, useCheckinEditCountToday } from '../queries'
import { useMySubscription } from '@/features/subscription/queries'

import MoodSelector from './mood-selector'
import SliderSection from './slider-section'
import type { Mood } from '../types'

interface CheckinFormProps {
  relationshipId: string
  date: string
}

const textareaClass = 'mt-3 min-h-28 w-full resize-none rounded-[1.15rem] border border-black/[0.045] bg-white px-4 py-3.5 text-[13px] leading-6 text-neutral-800 outline-none transition-all duration-200 placeholder:text-neutral-300 hover:border-black/[0.08] focus:border-black/[0.10] focus:ring-4 focus:ring-black/[0.025]'

const moodTheme: Record<Mood, { accent: string; glow: string }> = {
  happy: { accent: 'bg-pink-400', glow: 'bg-pink-400/[0.08]' },
  neutral: { accent: 'bg-neutral-900', glow: 'bg-blue-400/[0.06]' },
  sad: { accent: 'bg-blue-400', glow: 'bg-blue-400/[0.08]' },
  tired: { accent: 'bg-indigo-400', glow: 'bg-indigo-400/[0.07]' },
  stressed: { accent: 'bg-rose-400', glow: 'bg-rose-400/[0.08]' },
}

function ActionButton({ title, active, onClick }: { title: string; active?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-11 flex-1 items-center justify-center rounded-full border px-3 text-[10px] font-semibold tracking-[-0.01em] transition-all duration-200 ${active ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm' : 'border-black/[0.055] bg-white text-neutral-500 hover:border-black/[0.09] hover:bg-neutral-50 hover:text-neutral-900'}`}>
      {title}
    </button>
  )
}

function Modal({ title, description, onClose, children }: { title: string; description?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/20 p-3 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-black/[0.06] bg-[#fafaf9] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.28)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-5 border-b border-black/[0.045] px-5 py-5 sm:px-6">
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.025em] text-neutral-900">{title}</p>
            {description && <p className="mt-1 text-[11px] leading-5 text-neutral-400">{description}</p>}
          </div>

          <button type="button" onClick={onClose} aria-label="Close modal" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/[0.05] bg-white text-neutral-400 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900">
            <X className="size-3.5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="max-h-[75dvh] overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function CheckinForm({ relationshipId, date }: CheckinFormProps) {
  const [activeModal, setActiveModal] = useState<'wellbeing' | 'reflection' | null>(null)

  const { data, isLoading } = useTodayCheckin(relationshipId, date)
  const { data: subscription } = useMySubscription()
  const { data: editCountToday } = useCheckinEditCountToday(relationshipId, date)

  const mutation = useUpsertCheckin()
  const existing = data?.[0]

  const maxEditsPerDay = subscription ? subscription.max_mood_edits_per_day : 3
  const isLimitReached = maxEditsPerDay !== null && (editCountToday ?? 0) >= maxEditsPerDay

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
      needsFromPartner: existing?.needs_from_partner ?? '',
      note: existing?.note ?? '',
    },
  })

  useEffect(() => {
    if (!existing) return

    reset({
      mood: existing.mood,
      energy: existing.energy,
      stress: existing.stress,
      likedToday: existing.liked_today ?? '',
      dislikedToday: existing.disliked_today ?? '',
      needsFromPartner: existing.needs_from_partner ?? '',
      note: existing.note ?? '',
    })
  }, [existing, reset])

  const mood = watch('mood')
  const energy = watch('energy')
  const stress = watch('stress')

  const theme = moodTheme[mood] ?? moodTheme.neutral

  if (isLoading) {
    return (
      <div className="min-h-dvh animate-pulse px-5 py-8 sm:px-8">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center">
          <div className="mx-auto h-3 w-24 rounded-full bg-neutral-100" />
          <div className="mx-auto mt-3 h-9 w-64 rounded-xl bg-neutral-100" />
          <div className="mt-10 h-[330px] rounded-[2rem] bg-neutral-100 sm:h-[380px]" />
          <div className="mx-auto mt-6 h-12 w-full rounded-full bg-neutral-100" />
        </div>
      </div>
    )
  }

  function onSubmit(values: DailyCheckinFormValues) {
    if (isLimitReached) return

    mutation.mutate(
      { relationshipId, date, values },
      {
        onSuccess: (saved) => {
          reset({
            mood: saved.mood,
            energy: saved.energy,
            stress: saved.stress,
            likedToday: saved.liked_today ?? '',
            dislikedToday: saved.disliked_today ?? '',
            needsFromPartner: saved.needs_from_partner ?? '',
            note: saved.note ?? '',
          })
        },
      },
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="relative min-h-dvh w-full overflow-x-hidden">
        <div className={`pointer-events-none absolute left-1/2 top-0 size-80 -translate-x-1/2 rounded-full blur-[110px] transition-all duration-700 ${theme.glow}`} />

        <div className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-7 sm:px-8 sm:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Daily check-in</p>
              <h1 className="mt-2 text-[25px] font-medium leading-tight tracking-[-0.045em] text-neutral-950 sm:text-[29px]">How do you feel today?</h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {existing && (
                <div className="rounded-full bg-neutral-100 px-3 py-1.5">
                  <span className="text-[9px] font-semibold text-neutral-400">Updated</span>
                </div>
              )}

              <Link href="/dashboard" aria-label="Back to dashboard" className="flex size-9 items-center justify-center rounded-full border border-black/[0.05] bg-neutral-800 text-white shadow-sm transition-all duration-200 hover:border-black/[0.08] hover:bg-neutral-50 hover:text-neutral-900 active:scale-95">
                <X className="size-4" strokeWidth={1.8} />
              </Link>
            </div>
          </div>

          {maxEditsPerDay !== null && (
            <div className="mt-5 flex items-center justify-between px-1">
              <p className={`text-[10px] font-medium ${isLimitReached ? 'text-amber-500' : 'text-neutral-300'}`}>
                {isLimitReached ? 'Mood update limit reached' : `${editCountToday ?? 0}/${maxEditsPerDay} mood changes today`}
              </p>
            </div>
          )}

          <div className="flex flex-1 flex-col justify-center py-5 sm:py-7">
            <div className="flex min-h-[360px] flex-1 items-center justify-center sm:min-h-[410px]">
              <MoodSelector value={mood} onChange={(value) => setValue('mood', value, { shouldDirty: true, shouldValidate: true })} />
            </div>

            {errors.mood && <p className="mt-2 text-center text-[11px] font-medium text-rose-500">{errors.mood.message}</p>}

            <div className="mt-7 grid grid-cols-3 gap-2">
              <ActionButton title="View history" onClick={() => { window.location.href = '/check-in/history' }} />
              <ActionButton title="How are you doing?" active={activeModal === 'wellbeing'} onClick={() => setActiveModal('wellbeing')} />
              <ActionButton title="Reflection" active={activeModal === 'reflection'} onClick={() => setActiveModal('reflection')} />
            </div>
          </div>

          {mutation.error && (
            <div className="mb-4 rounded-[1.15rem] border border-rose-100 bg-rose-50/70 px-4 py-3">
              <p className="text-[11px] font-medium leading-5 text-rose-500">{mutation.error.message}</p>
            </div>
          )}

          <div className="mt-auto">
            <button type="submit" disabled={mutation.isPending || isLimitReached} className="flex h-13 w-full items-center justify-center rounded-full bg-neutral-800 px-5 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_16px_35px_-18px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50">
              {mutation.isPending ? (
                <>
                  <span className="mr-2 size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : isLimitReached ? (
                'Batas harian tercapai'
              ) : (
                existing ? 'Update Check-in' : 'Save Check-in'
              )}
            </button>
          </div>
        </div>
      </form>

      {activeModal === 'wellbeing' && (
        <Modal title="How are you doing?" description="Take a moment to check in with your energy and stress." onClose={() => setActiveModal(null)}>
          <div className="space-y-7">
            <SliderSection label="Energy" value={energy} minLabel="Exhausted" maxLabel="Energetic" register={register} name="energy" error={errors.energy?.message} />
            <div className="h-px bg-black/[0.045]" />
            <SliderSection label="Stress" value={stress} minLabel="Relaxed" maxLabel="Very stressed" register={register} name="stress" error={errors.stress?.message} />
          </div>
        </Modal>
      )}

      {activeModal === 'reflection' && (
        <Modal title="A little reflection" description="A few thoughts can help you and your partner understand each other better." onClose={() => setActiveModal(null)}>
          <div className="space-y-5">
            <div>
              <p className="text-[12px] font-semibold text-neutral-800">What did you like today?</p>
              <textarea id="likedToday" {...register('likedToday')} placeholder="Something your partner did, something that made you smile..." className={textareaClass} />
              {errors.likedToday && <p className="mt-2 px-1 text-[11px] font-medium text-rose-500">{errors.likedToday.message}</p>}
            </div>

            <div>
              <p className="text-[12px] font-semibold text-neutral-800">What didn't you like today?</p>
              <textarea id="dislikedToday" {...register('dislikedToday')} placeholder="Something that bothered you or felt difficult..." className={textareaClass} />
              {errors.dislikedToday && <p className="mt-2 px-1 text-[11px] font-medium text-rose-500">{errors.dislikedToday.message}</p>}
            </div>

            <div>
              <p className="text-[12px] font-semibold text-neutral-800">What do you need from your partner?</p>
              <textarea id="needsFromPartner" {...register('needsFromPartner')} placeholder="Maybe you need space, attention, encouragement..." className={textareaClass} />
              {errors.needsFromPartner && <p className="mt-2 px-1 text-[11px] font-medium text-rose-500">{errors.needsFromPartner.message}</p>}
            </div>

            <div>
              <p className="text-[12px] font-semibold text-neutral-800">Anything else?</p>
              <textarea id="note" {...register('note')} placeholder="Write anything else that's on your mind..." className={textareaClass} />
              {errors.note && <p className="mt-2 px-1 text-[11px] font-medium text-rose-500">{errors.note.message}</p>}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}