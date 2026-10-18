'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { createDailyCheckinSchema, type DailyCheckinFormValues } from '../schemas'
import { useTodayCheckin, useUpsertCheckin, useCheckinEditCountToday } from '../queries'
import { getCheckinErrorKey } from '../errors'
import { useMySubscription } from '@/features/subscription/queries'

import MoodSelector from './mood-selector'
import SliderSection from './slider-section'
import { StudioBackdrop } from '@/components/ui/studio-backdrop'

interface CheckinFormProps {
  relationshipId: string
  date: string
}

const textareaClass = 'mt-3 min-h-28 w-full resize-none rounded-[1.15rem] border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-[13px] leading-6 text-neutral-100 outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-neutral-500 hover:border-white/[0.14] focus:border-white/[0.2] focus:ring-4 focus:ring-white/[0.05]'

function ActionButton({ title, active, onClick }: { title: string; active?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-11 flex-1 items-center justify-center rounded-full border px-3 text-[10px] font-semibold tracking-[-0.01em] transition-all duration-200 ${active ? 'border-white bg-white text-neutral-900 shadow-sm' : 'border-white/[0.08] bg-white/[0.06] text-neutral-400 backdrop-blur-sm hover:border-white/[0.16] hover:bg-white/[0.12] hover:text-white'}`}>
      {title}
    </button>
  )
}

function Modal({ title, description, onClose, children }: { title: string; description?: string; onClose: () => void; children: React.ReactNode }) {
  const tc = useTranslations('common')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#141416] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-5 border-b border-white/[0.06] px-5 py-5 sm:px-6">
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.025em] text-neutral-100">{title}</p>
            {description && <p className="mt-1 text-[11px] leading-5 text-neutral-500">{description}</p>}
          </div>

          <button type="button" onClick={onClose} aria-label={tc('close')} className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] text-neutral-400 transition-all duration-200 hover:bg-white/[0.12] hover:text-white">
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
  const t = useTranslations('checkins.form')
  const tv = useTranslations('checkins.validation')
  const te = useTranslations('checkins.errors')

  const [activeModal, setActiveModal] = useState<'wellbeing' | 'reflection' | null>(null)

  const schema = useMemo(() => createDailyCheckinSchema(tv), [tv])

  const { data, isLoading } = useTodayCheckin(relationshipId, date)
  const { data: subscription } = useMySubscription()
  const { data: editCountToday } = useCheckinEditCountToday(relationshipId, date)

  const mutation = useUpsertCheckin()
  const existing = data?.[0]

  const maxEditsPerDay = subscription
    ? subscription.max_mood_edits_per_day
    : 3

  const editCount = editCountToday ?? 0
  const isUnlimitedMood = maxEditsPerDay === null
  const isLimitReached = !isUnlimitedMood && editCount >= maxEditsPerDay

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DailyCheckinFormValues>({
    resolver: zodResolver(schema),
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

  if (isLoading) {
    return (
      <div className="min-h-dvh animate-pulse bg-[#0a0a0c] px-5 py-8 sm:px-8">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center">
          <div className="mx-auto h-3 w-24 rounded-full bg-neutral-800" />
          <div className="mx-auto mt-3 h-9 w-64 rounded-xl bg-neutral-800" />
          <div className="mt-10 h-[330px] rounded-[2rem] bg-neutral-800 sm:h-[380px]" />
          <div className="mx-auto mt-6 h-12 w-full rounded-full bg-neutral-800" />
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
      <form onSubmit={handleSubmit(onSubmit)} className="relative min-h-dvh w-full overflow-x-clip bg-[#0a0a0c] transition-colors duration-700">
        <StudioBackdrop mood={mood} />

        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-7 sm:px-8 sm:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{t('eyebrow')}</p>
              <h1 className="mt-2 text-[25px] font-medium leading-tight tracking-[-0.045em] text-neutral-50 sm:text-[29px]">
                {t('title')}
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {existing && (
                <div className="rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  <span className="text-[9px] font-semibold text-neutral-300">{t('updated')}</span>
                </div>
              )}

              <Link href="/dashboard" aria-label={t('backToDashboard')} className="flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/10 text-white shadow-sm transition-all duration-200 hover:bg-white hover:text-neutral-900 active:scale-95">
                <X className="size-4" strokeWidth={1.8} />
              </Link>
            </div>
          </div>

          {isUnlimitedMood ? (
            <div className="mt-5 flex items-center justify-between px-1">
              <p className="text-[10px] font-medium text-neutral-400">
                {t('unlimited')}
              </p>
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-between px-1">
              <p className={`text-[10px] font-medium ${isLimitReached ? 'text-amber-500' : 'text-neutral-400'}`}>
                {isLimitReached
                  ? t('limitReached')
                  : t('editCount', { used: editCount, max: maxEditsPerDay })}
              </p>
            </div>
          )}

          <div className="flex flex-1 flex-col justify-center py-5 sm:py-7">
            <div className="relative flex min-h-[360px] flex-1 items-center justify-center sm:min-h-[410px]">
              <MoodSelector
                disabled={isLimitReached}
                value={mood}
                onChange={(value) => setValue('mood', value, { shouldDirty: true, shouldValidate: true })}
              />
            </div>

            {errors.mood && <p className="mt-2 text-center text-[11px] font-medium text-rose-400">{errors.mood.message}</p>}

            <div className="mt-7 grid grid-cols-3 gap-2">
              <ActionButton title={t('actions.history')} onClick={() => { window.location.href = '/check-in/history' }} />
              <ActionButton title={t('actions.wellbeing')} active={activeModal === 'wellbeing'} onClick={() => setActiveModal('wellbeing')} />
              <ActionButton title={t('actions.reflection')} active={activeModal === 'reflection'} onClick={() => setActiveModal('reflection')} />
            </div>
          </div>

          {mutation.error && (
            <div className="mb-4 rounded-[1.15rem] border border-rose-500/20 bg-rose-500/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-medium leading-5 text-rose-400">
                {te(getCheckinErrorKey(mutation.error))}
              </p>
            </div>
          )}

          <div className="mt-auto">
            <button type="submit" disabled={mutation.isPending || isLimitReached} className="flex h-13 w-full items-center justify-center rounded-full bg-subprimary px-5 text-sm font-semibold tracking-[-0.01em] text-secondary shadow-[0_16px_35px_-18px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50">
              {mutation.isPending ? (
                <>
                  <span className="mr-2 size-3.5 animate-spin rounded-full border-2 border-neutral-900/30 border-t-neutral-900" />
                  {t('saving')}
                </>
              ) : isLimitReached ? (
                t('submitLimit')
              ) : (
                existing ? t('update') : t('save')
              )}
            </button>
          </div>
        </div>
      </form>

      {activeModal === 'wellbeing' && (
        <Modal title={t('wellbeing.title')} description={t('wellbeing.description')} onClose={() => setActiveModal(null)}>
          <div className="space-y-7">
            <SliderSection label={t('wellbeing.energy')} value={energy} minLabel={t('wellbeing.energyMin')} maxLabel={t('wellbeing.energyMax')} register={register} name="energy" error={errors.energy?.message} />
            <div className="h-px bg-white/[0.06]" />
            <SliderSection label={t('wellbeing.stress')} value={stress} minLabel={t('wellbeing.stressMin')} maxLabel={t('wellbeing.stressMax')} register={register} name="stress" error={errors.stress?.message} />
          </div>
        </Modal>
      )}

      {activeModal === 'reflection' && (
        <Modal title={t('reflection.title')} description={t('reflection.description')} onClose={() => setActiveModal(null)}>
          <div className="space-y-5">
            <div>
              <p className="text-[12px] font-semibold text-neutral-100">{t('reflection.liked')}</p>
              <textarea id="likedToday" {...register('likedToday')} placeholder={t('reflection.likedPlaceholder')} className={textareaClass} />
              {errors.likedToday && <p className="mt-2 px-1 text-[11px] font-medium text-rose-400">{errors.likedToday.message}</p>}
            </div>

            <div>
              <p className="text-[12px] font-semibold text-neutral-100">{t('reflection.disliked')}</p>
              <textarea id="dislikedToday" {...register('dislikedToday')} placeholder={t('reflection.dislikedPlaceholder')} className={textareaClass} />
              {errors.dislikedToday && <p className="mt-2 px-1 text-[11px] font-medium text-rose-400">{errors.dislikedToday.message}</p>}
            </div>

            <div>
              <p className="text-[12px] font-semibold text-neutral-100">{t('reflection.needs')}</p>
              <textarea id="needsFromPartner" {...register('needsFromPartner')} placeholder={t('reflection.needsPlaceholder')} className={textareaClass} />
              {errors.needsFromPartner && <p className="mt-2 px-1 text-[11px] font-medium text-rose-400">{errors.needsFromPartner.message}</p>}
            </div>

            <div>
              <p className="text-[12px] font-semibold text-neutral-100">{t('reflection.note')}</p>
              <textarea id="note" {...register('note')} placeholder={t('reflection.notePlaceholder')} className={textareaClass} />
              {errors.note && <p className="mt-2 px-1 text-[11px] font-medium text-rose-400">{errors.note.message}</p>}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}