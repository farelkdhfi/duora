'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'

import logo from '@/assets/logo-white.png'

import {
  createJoinRelationshipSchema,
  createRelationshipSchema,
  getMaxStartedAt,
  getMinStartedAt,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  type CreateRelationshipFormValues,
  type JoinRelationshipFormValues,
} from '../schemas'

import { createRelationship, joinRelationship } from '../api'
import { getRelationshipErrorKey } from '../errors'
import { relationshipKeys } from '../queries'

type Mode = 'create' | 'join'
type Step = 'welcome' | 'choose' | 'name' | 'date' | 'join'

// Buat    : welcome -> pilih -> nama -> tanggal
// Gabung  : welcome -> pilih -> kode undangan
const FLOWS: Record<Mode, Step[]> = {
  create: ['welcome', 'choose', 'name', 'date'],
  join: ['welcome', 'choose', 'join'],
}

// Teks diambil dari messages: t(`choices.${value}.title|description`)
const CHOICES: {
  value: Mode
  icon: typeof Check
}[] = [
    { value: 'create', icon: Check },
    { value: 'join', icon: Check },
  ]

const inputBase =
  'w-full border-0 border-b border-neutral-500 bg-transparent px-0 py-3 text-lg font-medium tracking-[-0.01em] text-white outline-none transition-colors placeholder:text-neutral-600'

/* -------------------------------------------------------------------------- */
/* Welcome intro: logo + teks + bubble & love                                 */
/* -------------------------------------------------------------------------- */

// Lama animasi masuk logo + teks (ms)
const WELCOME_ENTER = 1200
// Lama welcome bertahan SETELAH animasi masuk selesai (ms)
const WELCOME_HOLD = 3000
// Lama fade out sebelum pindah ke step berikutnya (ms)
const WELCOME_EXIT = 500

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Particle = {
  kind: 'bubble' | 'heart'
  left: number // posisi horizontal (%)
  top: number // posisi vertikal awal (%)
  size: number // px
  color: string // class warna tailwind
  delay: number // detik
  duration: number // detik
  rise: number // jarak naik (px)
  sway: number // geser kiri/kanan (px)
  tilt?: number // rotasi heart (deg)
  filled?: boolean // heart diisi tipis atau outline saja
}

// Posisi dibuat tetap (bukan random) supaya aman dari hydration mismatch
// Palet disesuaikan untuk background gelap: rose lembut + putih transparan
const PARTICLES: Particle[] = [
  {
    kind: 'bubble',
    left: 55,
    top: 80,
    size: 36,
    color: 'border-white/15 bg-white/[0.03] shadow-[inset_0_0_10px_rgba(255,255,255,0.08)]',
    delay: 0.8,
    duration: 9,
    rise: 180,
    sway: -14,
  },
  {
    kind: 'heart',
    left: 12,
    top: 22,
    size: 18,
    color: 'text-rose-300/60',
    delay: 2.2,
    duration: 8,
    rise: 120,
    sway: 8,
    tilt: -12,
  },
  {
    kind: 'bubble',
    left: 24,
    top: 62,
    size: 12,
    color: 'border-rose-200/20 bg-rose-200/[0.04] shadow-[inset_0_0_6px_rgba(251,207,232,0.12)]',
    delay: 1.3,
    duration: 7.5,
    rise: 150,
    sway: -6,
  },
  {
    kind: 'heart',
    left: 48,
    top: 90,
    size: 22,
    color: 'text-rose-200/50',
    delay: 0.9,
    duration: 9,
    rise: 200,
    sway: 12,
    tilt: 10,
    filled: true,
  },
  {
    kind: 'bubble',
    left: 70,
    top: 14,
    size: 16,
    color: 'border-white/10 bg-white/[0.02]',
    delay: 2.5,
    duration: 8,
    rise: 100,
    sway: 8,
  },
  {
    kind: 'heart',
    left: 82,
    top: 52,
    size: 14,
    color: 'text-pink-300/55',
    delay: 0.1,
    duration: 7.8,
    rise: 140,
    sway: -8,
    tilt: 14,
  },
  {
    kind: 'bubble',
    left: 5,
    top: 50,
    size: 24,
    color: 'border-rose-200/15 bg-rose-200/[0.03] shadow-[inset_0_0_8px_rgba(251,207,232,0.1)]',
    delay: 1.7,
    duration: 9.5,
    rise: 150,
    sway: 10,
  },
  {
    kind: 'heart',
    left: 90,
    top: 78,
    size: 12,
    color: 'text-white/35',
    delay: 3.1,
    duration: 8.6,
    rise: 130,
    sway: -10,
    tilt: -8,
  },
]

// Hanya animasi opacity + transform supaya ringan (tanpa blur / filter)
function FloatingParticle({ particle: p }: { particle: Particle }) {
  const tilt = p.tilt ?? 0

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute will-change-transform"
      style={{
        left: `${p.left}%`,
        top: `${p.top}%`,
        width: p.size,
        height: p.size,
      }}
      initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.85, 0.85, 0],
        x: [0, p.sway, 0],
        y: [0, -p.rise],
        rotate: p.kind === 'heart' ? [0, tilt, 0] : 0,
      }}
      transition={{
        opacity: {
          duration: p.duration,
          times: [0, 0.25, 0.7, 1],
          repeat: Infinity,
          delay: p.delay,
          ease: 'linear',
        },
        x: {
          duration: p.duration,
          times: [0, 0.5, 1],
          repeat: Infinity,
          delay: p.delay,
          ease: 'easeInOut',
        },
        y: {
          duration: p.duration,
          repeat: Infinity,
          delay: p.delay,
          ease: 'easeInOut',
        },
        rotate: {
          duration: p.duration,
          times: [0, 0.5, 1],
          repeat: Infinity,
          delay: p.delay,
          ease: 'easeInOut',
        },
      }}
    >
      {p.kind === 'heart' ? (
        <Heart
          size={p.size}
          strokeWidth={1.25}
          fill={p.filled ? 'currentColor' : 'none'}
          fillOpacity={p.filled ? 0.18 : 0}
          className={p.color}
        />
      ) : (
        <span className={`block size-full rounded-full border ${p.color}`} />
      )}
    </motion.span>
  )
}

function WelcomeIntro({ onDone }: { onDone: () => void }) {
  const reduceMotion = useReducedMotion()
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const toExit = setTimeout(
      () => setLeaving(true),
      WELCOME_ENTER + WELCOME_HOLD,
    )
    const done = setTimeout(
      onDone,
      WELCOME_ENTER + WELCOME_HOLD + WELCOME_EXIT,
    )

    return () => {
      clearTimeout(toExit)
      clearTimeout(done)
    }
  }, [onDone])

  const logoMotion = reduceMotion
    ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6 },
    }
    : {
      initial: { opacity: 0, scale: 0.9, y: 8 },
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.7, ease: EASE },
    }

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-primary px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: WELCOME_EXIT / 1000, ease: 'easeIn' }}
    >
      {/* Bubble & love di latar belakang (dimatikan kalau reduced motion) */}
      {!reduceMotion &&
        PARTICLES.map((particle, i) => (
          <FloatingParticle key={i} particle={particle} />
        ))}

      <div className="relative flex flex-col items-center text-center">
        <motion.div {...logoMotion}>
          <Image src={logo} alt="Duora" priority className="h-30 w-auto grayscale brightness-200" />
        </motion.div>
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Onboarding                                                                 */
/* -------------------------------------------------------------------------- */

export default function RelationshipOnboarding() {
  const t = useTranslations('relationship.onboarding')
  const tv = useTranslations('relationship.validation')
  const te = useTranslations('relationship.errors')
  const tc = useTranslations('common')

  const router = useRouter()
  const queryClient = useQueryClient()

  const [mode, setMode] = useState<Mode | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  const steps = FLOWS[mode ?? 'create']
  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  // Dipanggil WelcomeIntro setelah animasinya selesai
  const goToChoose = useCallback(() => setStepIndex(1), [])

  /* ---------------------------------- Forms --------------------------------- */

  const createSchema = useMemo(() => createRelationshipSchema(tv), [tv])
  const joinSchema = useMemo(() => createJoinRelationshipSchema(tv), [tv])

  const createForm = useForm<CreateRelationshipFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { relationshipName: '', startedAt: '' },
  })

  const joinForm = useForm<JoinRelationshipFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: { inviteCode: '' },
  })

  const nameValue = createForm.watch('relationshipName')
  const nameLength = (nameValue ?? '').length

  /* -------------------------------- Mutations ------------------------------- */

  // Setelah berhasil: refresh cache, lalu masuk ke dashboard
  const finish = async () => {
    await queryClient.refetchQueries({ queryKey: relationshipKeys.all })
    router.replace('/dashboard')
    router.refresh()
  }

  const createMutation = useMutation({
    mutationFn: createRelationship,
    onSuccess: finish,
  })

  const joinMutation = useMutation({
    mutationFn: ({ inviteCode }: JoinRelationshipFormValues) =>
      joinRelationship(inviteCode),
    onSuccess: finish,
  })

  const isPending = createMutation.isPending || joinMutation.isPending

  const activeError =
    step === 'join'
      ? joinMutation.error
      : step === 'date'
        ? createMutation.error
        : null

  const errorMessage = activeError
    ? te(getRelationshipErrorKey(activeError))
    : undefined

  /* ------------------------------- Navigation ------------------------------- */

  const next = () =>
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))

  // Minimal kembali ke step 1 (pilihan), tidak pernah kembali ke welcome
  const back = () => setStepIndex((i) => Math.max(i - 1, 1))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isPending) return

    switch (step) {
      case 'welcome':
        return next()

      case 'choose':
        if (mode) next()
        return

      case 'name':
        if (await createForm.trigger('relationshipName')) next()
        return

      case 'date':
        return createForm.handleSubmit((values) =>
          createMutation.mutate(values),
        )()

      case 'join':
        return joinForm.handleSubmit((values) =>
          joinMutation.mutate(values),
        )()
    }
  }

  const buttonDisabled = isPending || (step === 'choose' && !mode)

  // Tombol kembali tidak tampil di step pilihan (step pertama setelah welcome)
  const showBack = stepIndex > 1

  /* --------------------------------- Render --------------------------------- */

  return (
    <main className="relative min-h-dvh overflow-hidden bg-primary">
      <style>{`
        @keyframes onboarding-step-in {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .onboarding-step { animation: none !important; }
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-6"
      >
        {/* Isi step */}
        <section className="flex flex-1 flex-col justify-center py-8">
          {/* Welcome punya animasinya sendiri, jadi tidak pakai slide-in */}
          <div
            key={step}
            className={
              step === 'welcome'
                ? ''
                : 'onboarding-step animate-[onboarding-step-in_0.35s_ease-out]'
            }
          >
            {step === 'welcome' && <WelcomeIntro onDone={goToChoose} />}

            {step === 'choose' && (
              <div>
                <h1 className="text-lg font-semibold tracking-[-0.02em] text-white">
                  {t('choose.title')}
                </h1>

                <p className="mt-2 text-sm leading-6 text-description">
                  {t('choose.description')}
                </p>

                <div
                  role="radiogroup"
                  aria-label={t('choose.groupLabel')}
                  className="mt-8 space-y-3"
                >
                  {CHOICES.map(({ value, icon: Icon }) => {
                    const selected = mode === value

                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setMode(value)
                          createMutation.reset()
                          joinMutation.reset()
                        }}
                        className={`flex w-full items-center gap-4 rounded-full p-3 text-left  ${selected
                            ? 'border-none bg-black'
                            : 'border-neutral-200 bg-black hover:border-neutral-300'
                          }`}
                      >
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${selected
                              ? 'border border-pink-200 text-white'
                              : 'bg-black text-neutral-500'
                            }`}
                        >
                          <Icon size={15} />
                        </span>

                        <span>
                          <span className="block text-sm font-semibold text-white">
                            {t(`choices.${value}.title`)}
                          </span>
                          <span className="mt-1 block text-xs leading-6 text-description">
                            {t(`choices.${value}.description`)}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 'name' && (
              <div>
                <h1 className="text-lg font-semibold tracking-[-0.02em] text-white">
                  {t('name.title')}
                </h1>

                <p className="mt-2 text-sm leading-6 text-description">
                  {t('name.description')}
                </p>

                <div className="mt-8">
                  <label htmlFor="relationshipName" className="sr-only">
                    {t('name.label')}
                  </label>

                  <input
                    id="relationshipName"
                    {...createForm.register('relationshipName')}
                    placeholder="Mia & Rio"
                    maxLength={NAME_MAX_LENGTH}
                    autoComplete="off"
                    autoFocus
                    className={inputBase}
                  />

                  <div className="mt-2 flex items-start justify-between gap-4">
                    <p className="text-sm text-red-800">
                      {createForm.formState.errors.relationshipName?.message}
                    </p>

                    <p className="shrink-0 text-sm text-description">
                      {nameLength}/{NAME_MAX_LENGTH}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-description">
                    {t('name.hint', {
                      min: NAME_MIN_LENGTH,
                      max: NAME_MAX_LENGTH,
                    })}
                  </p>
                </div>
              </div>
            )}

            {step === 'date' && (
              <div>
                <h1 className="text-lg font-semibold tracking-[-0.02em] text-white">
                  {t('date.title')}
                </h1>

                <p className="mt-2 text-sm leading-6 text-description">
                  {t('date.description')}
                </p>

                <div className="mt-8">
                  <label htmlFor="startedAt" className="sr-only">
                    {t('date.label')}
                  </label>

                  <input
                    id="startedAt"
                    {...createForm.register('startedAt')}
                    type="date"
                    min={getMinStartedAt()}
                    max={getMaxStartedAt()}
                    className={`${inputBase} [color-scheme:dark]`}
                  />

                  {createForm.formState.errors.startedAt && (
                    <p className="mt-2 text-sm text-red-800">
                      {createForm.formState.errors.startedAt.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 'join' && (
              <div>
                <h1 className="text-lg font-semibold tracking-[-0.02em] text-white">
                  {t('join.title')}
                </h1>

                <p className="mt-2 text-sm leading-6 text-description">
                  {t('join.description')}
                </p>

                <div className="mt-8">
                  <label htmlFor="inviteCode" className="sr-only">
                    {t('join.label')}
                  </label>

                  <input
                    id="inviteCode"
                    {...joinForm.register('inviteCode')}
                    placeholder="A83KD92F"
                    maxLength={8}
                    autoComplete="off"
                    autoFocus
                    className={`${inputBase} text-center uppercase tracking-[0.3em] placeholder:tracking-normal`}
                  />

                  {joinForm.formState.errors.inviteCode && (
                    <p className="mt-2 text-sm text-red-800">
                      {joinForm.formState.errors.inviteCode.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {errorMessage && (
              <p
                role="alert"
                className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-red-800"
              >
                {errorMessage}
              </p>
            )}
          </div>
        </section>

        {/* Tombol aksi di bawah: kembali + lanjutkan sejajar (disembunyikan di welcome) */}
        {step !== 'welcome' && (
          <footer className="pb-8 pt-2">
            <div className="flex items-center justify-center gap-3">
              {showBack && (
                <button
                  type="button"
                  onClick={back}
                  disabled={isPending}
                  aria-label={tc('back')}
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-600 text-neutral-600 transition-colors  disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={18} />
                </button>
              )}

              <button
                type="submit"
                disabled={buttonDisabled}
                aria-label={isLastStep ? t('submit') : t('next')}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors  disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </footer>
        )}
      </form>
    </main>
  )
}