'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react'

import logo from '@/assets/logo.png'

import {
  createRelationshipSchema,
  getMinStartedAt,
  joinRelationshipSchema,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  type CreateRelationshipFormValues,
  type JoinRelationshipFormValues,
} from '../schemas'

import { createRelationship, joinRelationship } from '../api'
import { relationshipKeys } from '../queries'

type Mode = 'create' | 'join'
type Step = 'welcome' | 'choose' | 'name' | 'date' | 'join'

// Buat    : welcome -> pilih -> nama -> tanggal
// Gabung  : welcome -> pilih -> kode undangan
const FLOWS: Record<Mode, Step[]> = {
  create: ['welcome', 'choose', 'name', 'date'],
  join: ['welcome', 'choose', 'join'],
}

const CHOICES: {
  value: Mode
  title: string
  description: string
  icon: typeof Check
}[] = [
    {
      value: 'create',
      title: 'Buat hubungan baru',
      description: 'Mulai ruang baru dan undang pasanganmu.',
      icon: Check,
    },
    {
      value: 'join',
      title: 'Gabung dengan kode',
      description:
        'Masukan kode dari pasangan.',
      icon: Check,
    },
  ]

const inputBase =
  'w-full border-0 border-b-2 border-neutral-200 bg-transparent px-0 py-3 text-lg font-medium tracking-[-0.01em] text-neutral-900 outline-none transition-colors placeholder:text-neutral-300 focus:border-neutral-900'

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
}

// Posisi dibuat tetap (bukan random) supaya aman dari hydration mismatch
const PARTICLES: Particle[] = [
  { kind: 'bubble', left: 55, top: 80, size: 40, color: 'bg-blue-100/70 border-blue-200', delay: 0.8, duration: 7, rise: 180, sway: -14 },
  { kind: 'heart', left: 12, top: 14, size: 20, color: 'text-blue-400/80', delay: 2.2, duration: 5.8, rise: 120, sway: 8 },
  { kind: 'bubble', left: 24, top: 62, size: 14, color: 'bg-pink-100 border-pink-200', delay: 1.3, duration: 5.2, rise: 150, sway: -6 },
  { kind: 'heart', left: 48, top: 90, size: 24, color: 'text-pink-300', delay: 0.9, duration: 6.2, rise: 200, sway: 12 },
  { kind: 'bubble', left: 70, top: 10, size: 18, color: 'bg-pink-200/60 border-pink-300/70', delay: 2.5, duration: 5.6, rise: 100, sway: 8 },
  { kind: 'heart', left: 82, top: 48, size: 14, color: 'text-pink-300', delay: 0.1, duration: 5.4, rise: 140, sway: -8 },
  { kind: 'bubble', left: 5, top: 50, size: 26, color: 'bg-blue-200/60 border-blue-300/70', delay: 1.7, duration: 6.8, rise: 150, sway: 10 },
]

// Hanya animasi opacity + transform supaya ringan (tanpa blur / filter)
function FloatingParticle({ particle: p }: { particle: Particle }) {
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
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 0.9, 0.9, 0],
        x: [0, p.sway, 0],
        y: [0, -p.rise],
      }}
      transition={{
        opacity: {
          duration: p.duration,
          times: [0, 0.2, 0.75, 1],
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
      }}
    >
      {p.kind === 'heart' ? (
        <Heart
          size={p.size}
          fill="currentColor"
          strokeWidth={0}
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
      className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-neutral-50 px-6"
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
          <Image src={logo} alt="Duora" priority className="h-30 w-auto" />
        </motion.div>
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Onboarding                                                                 */
/* -------------------------------------------------------------------------- */

export default function RelationshipOnboarding() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [mode, setMode] = useState<Mode | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  const steps = FLOWS[mode ?? 'create']
  const step = steps[stepIndex]

  // Dipanggil WelcomeIntro setelah animasinya selesai
  const goToChoose = useCallback(() => setStepIndex(1), [])

  /* ---------------------------------- Forms --------------------------------- */

  const createForm = useForm<CreateRelationshipFormValues>({
    resolver: zodResolver(createRelationshipSchema),
    defaultValues: { relationshipName: '', startedAt: '' },
  })

  const joinForm = useForm<JoinRelationshipFormValues>({
    resolver: zodResolver(joinRelationshipSchema),
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
  const errorMessage =
    step === 'join'
      ? joinMutation.error?.message
      : step === 'date'
        ? createMutation.error?.message
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
    <main className="relative min-h-dvh overflow-hidden bg-neutral-50">
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
                <h1 className="text-lg font-semibold tracking-[-0.02em] text-neutral-900">
                  Mau mulai dari mana?
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Duora hanya bisa digunakan jika kamu dan pasanganmu sudah
                  terhubung.
                </p>

                <div
                  role="radiogroup"
                  aria-label="Pengaturan hubungan"
                  className="mt-8 space-y-3"
                >
                  {CHOICES.map(({ value, title, description, icon: Icon }) => {
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
                        className={`flex w-full items-center gap-4 rounded-full p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${selected
                            ? 'border-none shadow-lg shadow-[#6374be4b] bg-white'
                            : 'border-neutral-200 bg-white/60 hover:border-neutral-300'
                          }`}
                      >
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${selected
                              ? 'bg-linear-to-tl from-pink-400/40 to-blue-400 text-white'
                              : 'bg-neutral-100 text-neutral-500'
                            }`}
                        >
                          <Icon size={15} />
                        </span>

                        <span>
                          <span className="block text-sm font-semibold text-neutral-900">
                            {title}
                          </span>
                          <span className="mt-1 block text-xs leading-6 text-neutral-500">
                            {description}
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
                <h1 className="text-lg font-semibold tracking-[-0.02em] text-neutral-900">
                  Apa nama hubungan kalian?
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Pilih nama yang kalian berdua suka. Bisa diubah nanti.
                </p>

                <div className="mt-8">
                  <label htmlFor="relationshipName" className="sr-only">
                    Nama hubungan
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
                    <p className="text-sm text-rose-500">
                      {createForm.formState.errors.relationshipName?.message}
                    </p>

                    <p className="shrink-0 text-sm text-neutral-400">
                      {nameLength}/{NAME_MAX_LENGTH}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-neutral-400">
                    Minimal {NAME_MIN_LENGTH} karakter, maksimal{' '}
                    {NAME_MAX_LENGTH} karakter.
                  </p>
                </div>
              </div>
            )}

            {step === 'date' && (
              <div>
                <h1 className="text-lg font-semibold tracking-[-0.02em] text-neutral-900">
                  Kapan kalian mulai berpacaran?
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Tanggal ini dipakai untuk menghitung hari kalian bersama.
                </p>

                <div className="mt-8">
                  <label htmlFor="startedAt" className="sr-only">
                    Tanggal jadian
                  </label>

                  <input
                    id="startedAt"
                    {...createForm.register('startedAt')}
                    type="date"
                    min={getMinStartedAt()}
                    className={inputBase}
                  />

                  {createForm.formState.errors.startedAt && (
                    <p className="mt-2 text-sm text-rose-500">
                      {createForm.formState.errors.startedAt.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 'join' && (
              <div>
                <h1 className="text-lg font-semibold tracking-[-0.02em] text-neutral-900">
                  Masukkan kode undangan
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Minta pasanganmu kode 8 karakter dari akun Duora miliknya.
                </p>

                <div className="mt-8">
                  <label htmlFor="inviteCode" className="sr-only">
                    Kode undangan
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
                    <p className="mt-2 text-sm text-rose-500">
                      {joinForm.formState.errors.inviteCode.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {errorMessage && (
              <p
                role="alert"
                className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600"
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
                  aria-label="Kembali"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={18} />
                </button>
              )}

              <button
                type="submit"
                disabled={buttonDisabled}
                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-800 text-neutral-100 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
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