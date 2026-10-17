'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image, { type StaticImageData } from 'next/image'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { X } from 'lucide-react'

import { useCreateDebate } from '../queries'
import { AiPersona } from '../types'
import StudioBackdrop, {
  CONTACT_SHADOW,
  SOFT_SHADOW,
  floorTint,
  getPersonaTheme,
} from '@/components/ui/studio-backdrop-debate'

import lembutAi from '@/assets/ai-persona/lembut-ai.png'
import formalAi from '@/assets/ai-persona/formal-ai.png'
import nyeletukAi from '@/assets/ai-persona/nyeletuk-ai.png'
import lebayAi from '@/assets/ai-persona/lebay-ai.png'

interface CreateDebateModalProps {
  relationshipId: string
  open: boolean
  onClose: () => void
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const IMAGE_SIZES = '(max-width: 640px) 84vw, 480px'

/* Posisi garis lantai backdrop (% tinggi layar) */
const HORIZON = 60

const STEP_TITLE: Record<1 | 2, string> = {
  1: 'Apa topik yang ingin dibahas?',
  2: 'Choose your mediator',
}

// Input versi dark theme
const inputClass =
  'h-14 w-full rounded-[1.15rem] border border-white/10 bg-white/[0.04] px-4 text-[15px] font-medium tracking-[-0.02em] text-secondary outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-description/50 hover:border-white/20 focus:border-white/25 focus:ring-4 focus:ring-white/[0.05]'

const personaOptions: {
  value: AiPersona
  label: string
  description: string
  image: StaticImageData
}[] = [
  {
    value: 'formal',
    label: 'Formal',
    description: 'Neutral & structured',
    image: formalAi,
  },
  {
    value: 'lembut',
    label: 'Lembut',
    description: 'Calm & empathetic',
    image: lembutAi,
  },
  {
    value: 'kasar',
    label: 'Nyeletuk',
    description: 'Casual & witty',
    image: nyeletukAi,
  },
  {
    value: 'lebay',
    label: 'Lebay',
    description: 'Expressive & dramatic',
    image: lebayAi,
  },
]

const wrapIndex = (index: number) =>
  ((index % personaOptions.length) + personaOptions.length) %
  personaOptions.length

/* -------------------------------------------------------------------------- */
/*  Motion variants                                                           */
/* -------------------------------------------------------------------------- */

const stepVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 56, filter: 'blur(8px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, x: dir * -56, filter: 'blur(8px)' }),
}

const personaImageVariants: Variants = {
  enter: (dir: number) => ({
    x: dir * 240,
    opacity: 0,
    scale: 0.78,
    filter: 'blur(12px)',
  }),
  center: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({
    x: dir * -240,
    opacity: 0,
    scale: 0.78,
    filter: 'blur(12px)',
  }),
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Persona stage (cuma 1 persona kelihatan, ukuran besar)                     */
/* -------------------------------------------------------------------------- */

function PersonaStage({
  index,
  direction,
  onPaginate,
  onSelectIndex,
}: {
  index: number
  direction: number
  onPaginate: (direction: number) => void
  onSelectIndex: (index: number) => void
}) {
  const persona = personaOptions[index]
  const theme = getPersonaTheme(persona.value)

  return (
    <div className="w-full">
      {/* Stage: tinggi tetap (bukan vh), jadi kalau layar pendek yang di-scroll adalah halamannya */}
      <div className="relative h-[360px] w-full select-none sm:h-[410px]">
        {/* Bayangan lantai (diam, biar kerasa persona "berdiri" di studio) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          {/* tint warna persona: fade saat persona berganti */}
          <motion.div
            key={persona.value}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute bottom-[3%] left-1/2 h-24 w-[min(120vw,560px)] -translate-x-1/2 translate-y-1/2"
            style={{ background: floorTint(theme.shade) }}
          />

          <div
            className="absolute bottom-[3%] left-1/2 h-24 w-[min(88vw,560px)] -translate-x-1/2 translate-y-1/2"
            style={{ background: SOFT_SHADOW }}
          />

          <div
            className="absolute bottom-[3%] left-1/2 h-9 w-[min(52vw,300px)] -translate-x-1/2 translate-y-1/2"
            style={{ background: CONTACT_SHADOW }}
          />
        </div>

        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            key={persona.value}
            custom={direction}
            variants={personaImageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 220, damping: 28 },
              scale: { type: 'spring', stiffness: 220, damping: 28 },
              opacity: { duration: 0.35 },
              filter: { duration: 0.35 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.45}
            whileDrag={{ scale: 1.03 }}
            onDragEnd={(_, { offset, velocity }) => {
              const shouldSwipe =
                Math.abs(offset.x) > 80 ||
                (Math.abs(offset.x) > 25 && Math.abs(velocity.x) > 500)

              if (!shouldSwipe) return

              onPaginate(offset.x < 0 ? 1 : -1)
            }}
            // touch-pan-y: swipe vertikal = scroll layar, swipe horizontal = ganti persona
            className="absolute inset-0 flex cursor-grab touch-pan-y items-center justify-center active:cursor-grabbing"
          >
            <div className="relative size-60">
              <Image
                src={persona.image}
                alt={persona.label}
                fill
                sizes={IMAGE_SIZES}
                draggable={false}
                className="pointer-events-none object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Info + dots */}
      <div className="mt-2 text-center">
        <div className="min-h-[64px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={persona.value}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <p className="text-[24px] font-medium leading-tight tracking-[-0.045em] text-secondary sm:text-[28px]">
                {persona.label}
              </p>
              <p className="mt-1 text-[12px] text-description">
                {persona.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="mt-3 flex justify-center">
          {personaOptions.map((option, i) => (
            <button
              key={option.value}
              type="button"
              aria-label={`Select ${option.label}`}
              onClick={() => onSelectIndex(i)}
              className="flex h-5 items-center px-[3px]"
            >
              <motion.span
                initial={false}
                animate={{ width: i === index ? 22 : 6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`block h-1.5 rounded-full transition-colors duration-300 ${
                  i === index
                    ? 'bg-secondary'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Modal                                                                     */
/* -------------------------------------------------------------------------- */

export default function CreateDebateModal({
  relationshipId,
  open,
  onClose,
}: CreateDebateModalProps) {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  const [stepDirection, setStepDirection] = useState(1)
  const [personaIndex, setPersonaIndex] = useState(0)
  const [personaDirection, setPersonaDirection] = useState(1)

  const createDebateMutation = useCreateDebate(relationshipId)
  const isPending = createDebateMutation.isPending

  const activePersona = personaOptions[personaIndex]
  const hasTitle = title.trim().length > 0

  const resetState = () => {
    setTitle('')
    setStep(1)
    setStepDirection(1)
    setPersonaIndex(0)
    setPersonaDirection(1)
  }

  const closeModal = useCallback(() => {
    if (isPending) return

    onClose()
  }, [isPending, onClose])

  const paginate = useCallback((direction: number) => {
    setPersonaDirection(direction)
    setPersonaIndex((current) => wrapIndex(current + direction))
  }, [])

  const selectIndex = (nextIndex: number) => {
    if (nextIndex === personaIndex) return

    setPersonaDirection(nextIndex > personaIndex ? 1 : -1)
    setPersonaIndex(nextIndex)
  }

  const goNext = () => {
    if (!hasTitle) return

    setStepDirection(1)
    setStep(2)
  }

  const handleCreate = () => {
    if (!hasTitle || isPending) return

    createDebateMutation.mutate(
      {
        relationshipId,
        title: title.trim(),
        aiPersona: activePersona.value,
      },
      {
        onSuccess: (newDebate) => {
          router.push(`/debates/${newDebate.id}`)
        },
      },
    )
  }

  // Lock scroll body selama modal terbuka
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Keyboard: Esc = tutup, ← → = ganti persona (step 2)
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
        return
      }

      if (step !== 2) return

      if (event.key === 'ArrowLeft') paginate(-1)
      if (event.key === 'ArrowRight') paginate(1)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, step, closeModal, paginate])

  return (
    <AnimatePresence onExitComplete={resetState}>
      {open && (
        <motion.div
          key="create-debate-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Create debate"
          className="fixed inset-0 z-[100] isolate overflow-hidden bg-primary"
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* Step 1: polos. Step 2: studio backdrop fade-in sesuai persona.
              Backdrop di luar area scroll, jadi tetap diam waktu layar di-scroll. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            initial={false}
            animate={{ opacity: step === 2 ? 1 : 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <StudioBackdrop
              persona={activePersona.value}
              horizon={HORIZON}
            />
          </motion.div>

          {/* Preload semua gambar persona biar pas swipe nggak pop-in */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 size-px overflow-hidden opacity-0"
          >
            {personaOptions.map((persona) => (
              <div key={persona.value} className="relative size-px">
                <Image
                  src={persona.image}
                  alt=""
                  fill
                  sizes={IMAGE_SIZES}
                  loading="eager"
                />
              </div>
            ))}
          </div>

          {/* Area scroll: SELURUH layar yang scroll kalau konten nggak muat */}
          <div className="relative z-10 h-full overflow-y-auto overflow-x-hidden overscroll-contain">
            <div className="mx-auto flex min-h-full w-full max-w-xl flex-col px-5 py-7 sm:px-8 sm:py-10">
              {/* Header */}
              <header className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-description">
                    New debate
                  </p>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.h1
                      key={step}
                      id="create-debate-heading"
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="mt-2 text-[25px] font-medium leading-tight tracking-[-0.045em] text-secondary sm:text-[29px]"
                    >
                      {STEP_TITLE[step]}
                    </motion.h1>
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isPending}
                  aria-label="Close create debate modal"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-primary/80 text-description shadow-[0_8px_25px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-200 hover:bg-white hover:text-neutral-900 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                >
                  <X className="size-4" strokeWidth={1.8} />
                </button>
              </header>

              {/* Caption */}
              <div className="mt-5 min-h-[15px] px-1">
                <AnimatePresence mode="wait" initial={false}>
                  {step === 2 && (
                    <motion.p
                      key="persona-hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[10px] font-medium text-description"
                    >
                      Geser untuk mengubah persona
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Content */}
              <main className="flex flex-1 flex-col justify-center py-5 sm:py-7">
                <AnimatePresence
                  mode="wait"
                  custom={stepDirection}
                  initial={false}
                >
                  {step === 1 ? (
                    <motion.div
                      key="step-1"
                      custom={stepDirection}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.38, ease: EASE }}
                      className="w-full"
                    >
                      <Reveal delay={0.1}>
                        <input
                          id="debate-title"
                          aria-labelledby="create-debate-heading"
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                              event.preventDefault()
                              goNext()
                            }
                          }}
                          placeholder="Contoh: Tahun baruan enaknya ke mana?"
                          autoFocus
                          autoComplete="off"
                          className={inputClass}
                        />
                      </Reveal>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step-2"
                      custom={stepDirection}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.38, ease: EASE }}
                      className="w-full"
                    >
                      <Reveal delay={0.1}>
                        <PersonaStage
                          index={personaIndex}
                          direction={personaDirection}
                          onPaginate={paginate}
                          onSelectIndex={selectIndex}
                        />
                      </Reveal>
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              {/* Footer */}
              <footer className="mt-auto">
                <button
                  type="button"
                  onClick={step === 1 ? goNext : handleCreate}
                  disabled={step === 1 ? !hasTitle : isPending}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-subprimary px-5 text-sm font-semibold tracking-[-0.01em] text-secondary shadow-[0_16px_35px_-18px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={step}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2"
                    >
                      {step === 1 ? (
                        'Continue'
                      ) : isPending ? (
                        <>
                          <span className="size-3.5 animate-spin rounded-full border-2 border-neutral-900/25 border-t-neutral-900" />
                          Creating...
                        </>
                      ) : (
                        'Start debate'
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </footer>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}