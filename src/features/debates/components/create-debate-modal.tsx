'use client'

import { memo, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image, { type StaticImageData } from 'next/image'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'

import { useCreateDebate } from '../queries'
import { AiPersona } from '../types'

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

const STEP_TITLE: Record<1 | 2, string> = {
  1: 'Apa topik yang ingin dibahas?',
  2: 'Choose your mediator',
}

// Sama dengan textareaClass di check-in form, disesuaikan buat <input>
const inputClass =
  'h-14 w-full rounded-[1.15rem] border border-black/[0.045] bg-white/80 px-4 text-[15px] font-medium tracking-[-0.02em] text-neutral-800 outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-neutral-300 hover:border-black/[0.08] focus:border-black/[0.10] focus:ring-4 focus:ring-black/[0.025]'

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
/*  Studio backdrop                                                           */
/* -------------------------------------------------------------------------- */

const HORIZON = 60

// wall  = warna kertas backdrop (atas)
// shade = hue yang sama tapi lebih gelap, buat falloff cahaya & cove
const personaTheme: Record<AiPersona, { wall: string; shade: string }> = {
  formal: { wall: '208, 212, 218', shade: '118, 124, 134' }, // putih → abu
  lembut: { wall: '255, 208, 226', shade: '226, 120, 168' }, // putih → pink
  kasar: { wall: '255, 196, 192', shade: '214, 84, 84' }, // putih → merah
  lebay: { wall: '192, 218, 255', shade: '84, 140, 214' }, // putih → biru
}

const PERSONA_KEYS = Object.keys(personaTheme) as AiPersona[]

type Stop = [position: number, alpha: number]

const rgba = (rgb: string, alpha: number) => `rgba(${rgb}, ${alpha})`

const vertical = (rgb: string, stops: Stop[], offset = 0) =>
  `linear-gradient(to bottom, ${stops
    .map(([position, alpha]) => `${rgba(rgb, alpha)} ${position + offset}%`)
    .join(', ')})`

// Warna dinding yang memudar pelan ke lantai (hampir putih), tanpa garis potong.
const WALL_TO_FLOOR: Stop[] = [
  [0, 0.92], [12, 0.9], [24, 0.84], [36, 0.7], [47, 0.5],
  [57, 0.32], [67, 0.18], [78, 0.08], [90, 0.02], [100, 0],
]

// Cahaya meredup ke arah langit-langit.
const CEILING_FALLOFF: Stop[] = [[0, 0.12], [8, 0.08], [16, 0.045], [26, 0.015], [34, 0]]

// Cove: pita shade lembut tempat dinding "melengkung" ke lantai.
const COVE: Stop[] = [[-26, 0], [-18, 0.025], [-10, 0.065], [-3, 0.1], [3, 0.11], [10, 0.08], [18, 0.04], [27, 0]]

// Bloom key light di dinding.
const KEY_LIGHT = 'radial-gradient(ellipse 72% 42% at 50% 30%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.34) 28%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.04) 80%, rgba(255,255,255,0) 100%)'

// Bayangan lantai berwarna di bawah persona.
const floorShade = (rgb: string) =>
  `radial-gradient(ellipse 520px 120px at 50% ${HORIZON + 3}%, ${rgba(rgb, 0.2)} 0%, ${rgba(rgb, 0.1)} 40%, ${rgba(rgb, 0.03)} 75%, ${rgba(rgb, 0)} 100%)`

const buildBackdrop = ({ wall, shade }: { wall: string; shade: string }) =>
  [
    floorShade(shade),
    vertical(shade, COVE, HORIZON),
    vertical(shade, CEILING_FALLOFF),
    KEY_LIGHT,
    vertical(wall, WALL_TO_FLOOR),
  ].join(', ')

// Lampu studio dari kiri atas: side-light lebar + cone tipis.
const SIDE_LIGHT = 'linear-gradient(112deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.2) 26%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 68%)'

const LIGHT_CONE = 'conic-gradient(from 0deg at -10% -16%, rgba(255,255,255,0) 104deg, rgba(255,255,255,0.05) 114deg, rgba(255,255,255,0.13) 124deg, rgba(255,255,255,0.22) 134deg, rgba(255,255,255,0.26) 141deg, rgba(255,255,255,0.21) 149deg, rgba(255,255,255,0.11) 160deg, rgba(255,255,255,0.04) 171deg, rgba(255,255,255,0) 182deg)'

const FADE_BEFORE_FLOOR = 'linear-gradient(to bottom, #000 0%, #000 40%, transparent 80%)'

const LIGHT_FALLOFF = 'linear-gradient(292deg, rgba(24,24,32,0.05) 0%, rgba(24,24,32,0.022) 30%, rgba(24,24,32,0) 55%)'
const VIGNETTE = 'radial-gradient(ellipse 85% 75% at 50% 44%, rgba(24,24,32,0) 50%, rgba(24,24,32,0.026) 78%, rgba(24,24,32,0.052) 100%)'

const SOFT_SHADOW = 'radial-gradient(ellipse closest-side, rgba(24,24,32,0.075) 0%, rgba(24,24,32,0.04) 45%, rgba(24,24,32,0.012) 78%, rgba(24,24,32,0) 100%)'
const CONTACT_SHADOW = 'radial-gradient(ellipse closest-side, rgba(24,24,32,0.15) 0%, rgba(24,24,32,0.07) 48%, rgba(24,24,32,0.015) 80%, rgba(24,24,32,0) 100%)'

// Film grain: nyembunyiin banding gradient + feel matte/fotografis.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`

const StudioBackdrop = memo(function StudioBackdrop({
  persona,
}: {
  persona: AiPersona
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#fafaf9]"
    >
      {/* WALL + COVE + FLOOR: satu permukaan, cross-fade antar persona */}
      {PERSONA_KEYS.map((key) => (
        <div
          key={key}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{
            background: buildBackdrop(personaTheme[key]),
            opacity: key === persona ? 1 : 0,
          }}
        />
      ))}

      {/* ANGLED STUDIO LIGHT (fade out sebelum lantai) */}
      <div
        className="absolute inset-0"
        style={{
          background: `${LIGHT_CONE}, ${SIDE_LIGHT}`,
          maskImage: FADE_BEFORE_FLOOR,
          WebkitMaskImage: FADE_BEFORE_FLOOR,
        }}
      />

      {/* LIGHT FALLOFF + VIGNETTE */}
      <div
        className="absolute inset-0"
        style={{ background: `${VIGNETTE}, ${LIGHT_FALLOFF}` }}
      />

      {/* FILM GRAIN */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  )
})

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

  return (
    <div className="w-full">
      {/* Stage: tinggi tetap (bukan vh), jadi kalau layar pendek yang di-scroll adalah halamannya */}
      <div className="relative h-[360px] w-full select-none sm:h-[410px]">
        {/* Bayangan lantai (diam, biar kerasa persona "berdiri" di studio) */}
        <div
          className="pointer-events-none absolute bottom-[3%] left-1/2 h-24 w-[min(88vw,560px)] -translate-x-1/2 translate-y-1/2"
          style={{ background: SOFT_SHADOW }}
        />
        <div
          className="pointer-events-none absolute bottom-[3%] left-1/2 h-9 w-[min(52vw,300px)] -translate-x-1/2 translate-y-1/2"
          style={{ background: CONTACT_SHADOW }}
        />

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
              <p className="text-[24px] font-medium leading-tight tracking-[-0.045em] text-neutral-950 sm:text-[28px]">
                {persona.label}
              </p>
              <p className="mt-1 text-[12px] text-neutral-500">
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
                    ? 'bg-neutral-900'
                    : 'bg-neutral-900/20 hover:bg-neutral-900/40'
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
          className="fixed inset-0 z-[100] isolate overflow-hidden bg-[#fafaf9]"
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
            <StudioBackdrop persona={activePersona.value} />
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
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
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
                      className="mt-2 text-[25px] font-medium leading-tight tracking-[-0.045em] text-neutral-950 sm:text-[29px]"
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
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.05] bg-neutral-800 text-white shadow-sm transition-all duration-200 hover:bg-white hover:text-neutral-900 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                >
                  <X className="size-4" strokeWidth={1.8} />
                </button>
              </header>

              {/* Caption (gaya "Unlimited mood changes today" di check-in) */}
              <div className="mt-5 min-h-[15px] px-1">
                <AnimatePresence mode="wait" initial={false}>
                  {step === 2 && (
                    <motion.p
                      key="persona-hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[10px] font-medium text-neutral-400"
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
                  className="flex h-13 w-full items-center justify-center rounded-full bg-neutral-800 px-5 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_16px_35px_-18px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
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
                        <>
                          Continue
                        </>
                      ) : isPending ? (
                        <>
                          <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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