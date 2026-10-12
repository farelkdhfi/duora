'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, KeyRound, Sparkles } from 'lucide-react'

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
  icon: typeof Sparkles
}[] = [
    {
      value: 'create',
      title: 'Buat hubungan baru',
      description: 'Mulai ruang baru dan undang pasanganmu.',
      icon: Sparkles,
    },
    {
      value: 'join',
      title: 'Gabung dengan kode',
      description:
        'Pasanganmu sudah membuatnya? Masukkan kode undangan darinya.',
      icon: KeyRound,
    },
  ]

const inputBase =
  'w-full border-0 border-b-2 border-neutral-200 bg-transparent px-0 py-3 text-lg font-medium tracking-[-0.01em] text-neutral-900 outline-none transition-colors placeholder:text-neutral-300 focus:border-neutral-900'

export default function RelationshipOnboarding() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [mode, setMode] = useState<Mode | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  const steps = FLOWS[mode ?? 'create']
  const step = steps[stepIndex]

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

  const back = () => setStepIndex((i) => Math.max(i - 1, 0))

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

  /* ------------------------------ Button label ------------------------------ */

  const buttonLabel = (() => {
    if (step === 'date') return isPending ? 'Membuat...' : 'Buat hubungan'
    if (step === 'join') return isPending ? 'Bergabung...' : 'Gabung sekarang'
    return 'Lanjutkan'
  })()

  const buttonDisabled = isPending || (step === 'choose' && !mode)

  // Progress hanya menghitung step setelah welcome
  const progressSteps = steps.slice(1)
  const progressIndex = stepIndex - 1

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

      {/* Soft background glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-[28rem] rounded-full bg-blue-200/40 blur-3xl" />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-6"
      >
        {/* Top bar: tombol kembali + progress */}
        <header className="flex h-20 items-center gap-4">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={back}
              disabled={isPending}
              aria-label="Kembali"
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:opacity-40"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="size-10 shrink-0" />
          )}

          {stepIndex > 0 && (
            <div
              className="flex flex-1 gap-1.5"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={progressSteps.length}
              aria-valuenow={progressIndex + 1}
            >
              {progressSteps.map((s, i) => (
                <div
                  key={s}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200"
                >
                  <div
                    className={`h-full rounded-full bg-neutral-900 transition-all duration-500 ${i <= progressIndex ? 'w-full' : 'w-0'
                      }`}
                  />
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Isi step */}
        <section className="flex flex-1 flex-col justify-center pb-8">
          <div
            key={step}
            className="onboarding-step animate-[onboarding-step-in_0.35s_ease-out]"
          >
            {step === 'welcome' && (
              <div className="flex flex-col items-center text-center">
                <Image
                  src={logo}
                  alt="Duora"
                  priority
                  className="mb-8 h-20 w-auto"
                />

                <h1 className="text-lg font-semibold tracking-[-0.02em] text-neutral-900">
                  Selamat datang di Duora
                </h1>

                <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
                  Ruang yang dibuat untuk berdua. Simpan, rencanakan, dan
                  saling memahami sedikit lebih baik.
                </p>
              </div>
            )}

            {step === 'choose' && (
              <div>
                <h1 className="text-lg font-semibold tracking-[-0.02em] text-neutral-900">
                  Mau mulai dari mana?
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Duora paling berguna kalau kamu dan pasanganmu sudah
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
                        className={`flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${selected
                          ? 'border-neutral-900 bg-white'
                          : 'border-neutral-200 bg-white/60 hover:border-neutral-300'
                          }`}
                      >
                        <span
                          className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors ${selected
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-500'
                            }`}
                        >
                          <Icon size={20} />
                        </span>

                        <span>
                          <span className="block text-base font-semibold text-neutral-900">
                            {title}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-neutral-500">
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
                    Minimal {NAME_MIN_LENGTH} karakter, maksimal {NAME_MAX_LENGTH} karakter.
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

        {/* Tombol aksi di bawah */}
        <footer className="pb-8 pt-2">
          <button
            type="submit"
            disabled={buttonDisabled}
            className="w-full rounded-full bg-neutral-800 h-12 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {buttonLabel}
          </button>
        </footer>
      </form>
    </main>
  )
}