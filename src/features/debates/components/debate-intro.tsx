'use client'

import { useEffect, useRef, useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from 'framer-motion'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import type { AiPersona } from '../types'
import StudioBackdrop, {
  CONTACT_SHADOW,
  SOFT_SHADOW,
  floorTint,
  getPersonaTheme,
} from '@/components/ui/studio-backdrop-debate'

interface DebateIntroProps {
  title: string
  partnerAName: string
  partnerBName: string
  partnerAAvatarUrl?: string | null
  partnerBAvatarUrl?: string | null
  persona: AiPersona
  personaName: string
  personaImage: StaticImageData
  onComplete: () => void
}

type Side = 'left' | 'right'
type Step = 0 | 1 | 2 // 0 = pasangan, 1 = mediator, 2 = keluar

/* ===================================================== */
/* TIMING (ms) */
/* ===================================================== */

const PARTNERS_MS = 3800
const MEDIATOR_MS = 3000
const EXIT_MS = 500

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* Avatar masuk dari samping: jarak (px) dan jeda per sisi (detik) */
const SLIDE_DISTANCE = 160
const AVATAR_DELAY: Record<Side, number> = {
  left: 0.15,
  right: 0.7,
}

const sideAccent: Record<Side, { ring: string; dot: string }> = {
  left: { ring: 'ring-[#b8967a]/70', dot: 'bg-[#b8967a]' },
  right: { ring: 'ring-[#8fa3b5]/80', dot: 'bg-[#8fa3b5]' },
}

const eyebrow =
  'text-[9px] font-semibold uppercase tracking-[0.24em] text-description'

/* Titik pertemuan dinding dan lantai (% tinggi layar).
   Dipakai untuk posisi gambar persona + diteruskan ke StudioBackdrop
   supaya glow cove sejajar dengan garis lantai. */
const HORIZON = 58

/* ===================================================== */
/* VARIANTS */
/* ===================================================== */

const sectionVariants: Variants = {
  hidden: {},
  show: {},
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.4, ease: EASE },
  },
}

/* custom = delay dalam detik */
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay },
  }),
}

/* avatar datang dari samping, kiri dulu baru kanan */
const slideIn: Variants = {
  hidden: (side: Side) => ({
    opacity: 0,
    x: side === 'left' ? -SLIDE_DISTANCE : SLIDE_DISTANCE,
  }),
  show: (side: Side) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: EASE,
      delay: AVATAR_DELAY[side],
    },
  }),
}

const grow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.9, ease: EASE, delay: 1.2 },
  },
}

const stageIn: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.1, ease: EASE },
  },
}

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
}

/* ===================================================== */
/* SECTION 1 - PASANGAN + TOPIK */
/* ===================================================== */

function PartnerBadge({
  name,
  avatarUrl,
  fallback,
  side,
}: {
  name: string
  avatarUrl?: string | null
  fallback: StaticImageData
  side: Side
}) {
  const accent = sideAccent[side]

  return (
    <motion.div
      custom={side}
      variants={slideIn}
      className="flex flex-col items-center"
    >
      <div
        className={[
          'relative size-[76px] rounded-full shadow-[0_18px_40px_-18px_rgba(0,0,0,0.2)] ring-[1.5px] ring-offset-[5px] ring-offset-primary sm:size-[92px]',
          accent.ring,
        ].join(' ')}
      >
        <div className="relative size-full overflow-hidden rounded-full bg-primary">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              unoptimized
              sizes="92px"
              className="object-cover"
            />
          ) : (
            <Image
              src={fallback}
              alt={name}
              fill
              sizes="92px"
              className="object-contain p-3.5"
            />
          )}
        </div>
      </div>

      <p className="mt-4 max-w-[110px] truncate text-[12px] font-medium tracking-[-0.01em] text-secondary sm:text-[13px]">
        {name}
      </p>

      <span className={`mt-2 size-1 rounded-full ${accent.dot}`} />
    </motion.div>
  )
}

function PartnersSection({
  title,
  partnerAName,
  partnerBName,
  partnerAAvatarUrl,
  partnerBAvatarUrl,
}: Pick<
  DebateIntroProps,
  | 'title'
  | 'partnerAName'
  | 'partnerBName'
  | 'partnerAAvatarUrl'
  | 'partnerBAvatarUrl'
>) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex w-full max-w-xl flex-col items-center text-center"
    >
      <motion.p variants={rise} custom={0.05} className={eyebrow}>
        Two perspectives
      </motion.p>

      <div className="mt-9 flex items-start justify-center gap-4 sm:gap-7">
        <PartnerBadge
          name={partnerAName}
          avatarUrl={partnerAAvatarUrl}
          fallback={happyEmot}
          side="left"
        />

        <motion.span
          aria-hidden
          variants={grow}
          className="mt-[38px] h-px w-9 shrink-0 origin-center bg-gradient-to-r from-[#b8967a]/60 via-black/10 to-[#8fa3b5]/70 sm:mt-[46px] sm:w-16"
        />

        <PartnerBadge
          name={partnerBName}
          avatarUrl={partnerBAvatarUrl}
          fallback={neutralEmot}
          side="right"
        />
      </div>

      <motion.span
        aria-hidden
        variants={rise}
        custom={1.5}
        className="mt-11 h-px w-8 bg-black/15"
      />

      <motion.p
        variants={rise}
        custom={1.55}
        className={`mt-6 ${eyebrow}`}
      >
        Topic
      </motion.p>

      <motion.h1
        variants={rise}
        custom={1.7}
        className="mt-3 line-clamp-3 max-w-[440px] text-balance text-[26px] leading-[1.2] tracking-[-0.025em] text-secondary sm:text-[36px]"
      >
        {title}
      </motion.h1>
    </motion.section>
  )
}

/* ===================================================== */
/* SECTION 2 - AI MEDIATOR (studio style)                */
/* ===================================================== */

function MediatorSection({
  persona,
  personaName,
  personaImage,
}: Pick<
  DebateIntroProps,
  'persona' | 'personaName' | 'personaImage'
>) {
  const theme = getPersonaTheme(persona)

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="absolute inset-0"
    >
      {/* bayangan lantai di bawah gambar (sama seperti AI overlay) */}
      <motion.div
        aria-hidden
        variants={fade}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute left-1/2 h-24 w-[min(120vw,560px)] -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${HORIZON + 1}%`,
            background: floorTint(theme.shade),
          }}
        />

        <div
          className="absolute left-1/2 h-28 w-[min(86vw,460px)] -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${HORIZON + 1}%`,
            background: SOFT_SHADOW,
          }}
        />

        <div
          className="absolute left-1/2 h-10 w-[min(48vw,230px)] -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${HORIZON + 1}%`,
            background: CONTACT_SHADOW,
          }}
        />
      </motion.div>

      {/* gambar persona: bagian bawahnya duduk di garis horizon */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-full"
        style={{ top: `${HORIZON}%` }}
      >
        <motion.div variants={stageIn}>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 4,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            className="relative size-60"
          >
            <Image
              src={personaImage}
              alt=""
              fill
              sizes="320px"
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* teks di area lantai */}
      <div
        className="absolute inset-x-0 flex flex-col items-center px-6 text-center"
        style={{ top: `${HORIZON + 6}%` }}
      >
        <motion.p variants={rise} custom={0.45} className={eyebrow}>
          Your mediator
        </motion.p>

        <motion.h2
          variants={rise}
          custom={0.6}
          className="mt-3 text-[34px] font-medium leading-none tracking-[-0.045em] text-secondary sm:text-[44px]"
        >
          {personaName}
        </motion.h2>

        <motion.div
          variants={rise}
          custom={0.9}
          className="mt-6 flex items-center gap-2.5"
        >
          <span className="size-1 rounded-full bg-neutral-300" />

          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-description">
            Find a place in the middle
          </span>

          <span className="size-1 rounded-full bg-neutral-300" />
        </motion.div>
      </div>
    </motion.section>
  )
}

/* ===================================================== */
/* STEP INDICATOR */
/* ===================================================== */

function StepDots({ current }: { current: 0 | 1 }) {
  return (
    <div aria-hidden className="flex items-center gap-1.5">
      {[0, 1].map((index) => (
        <motion.span
          key={index}
          initial={false}
          animate={{
            width: index === current ? 20 : 5,
            opacity: index === current ? 0.6 : 0.2,
          }}
          transition={{ duration: 0.6, ease: EASE }}
          className="h-[5px] rounded-full bg-secondary"
        />
      ))}
    </div>
  )
}

/* ===================================================== */
/* MAIN */
/* ===================================================== */

export default function DebateIntro({
  title,
  partnerAName,
  partnerBName,
  partnerAAvatarUrl,
  partnerBAvatarUrl,
  persona,
  personaName,
  personaImage,
  onComplete,
}: DebateIntroProps) {
  const [step, setStep] = useState<Step>(0)

  /* simpan callback di ref supaya timer tidak ke-reset saat parent re-render */
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const toMediator = window.setTimeout(
      () => setStep(1),
      PARTNERS_MS,
    )

    const toExit = window.setTimeout(
      () => setStep(2),
      PARTNERS_MS + MEDIATOR_MS,
    )

    const done = window.setTimeout(
      () => onCompleteRef.current(),
      PARTNERS_MS + MEDIATOR_MS + EXIT_MS,
    )

    return () => {
      window.clearTimeout(toMediator)
      window.clearTimeout(toExit)
      window.clearTimeout(done)
    }
  }, [])

  const isExit = step === 2

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={false}
        animate={{ opacity: isExit ? 0 : 1 }}
        transition={{ duration: EXIT_MS / 1000, ease: 'easeInOut' }}
        className={[
          'fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-primary px-6',
          isExit ? 'pointer-events-none' : '',
        ].join(' ')}
      >
        {/* STUDIO BACKDROP (muncul pelan saat masuk section mediator) */}

        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: step === 0 ? 0 : 1 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-0"
        >
          <StudioBackdrop persona={persona} horizon={HORIZON} />
        </motion.div>

        {/* WORDMARK */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute inset-x-0 top-[calc(2rem_+_env(safe-area-inset-top))] text-center text-[9px] font-semibold uppercase tracking-[0.3em] text-description sm:top-[calc(2.5rem_+_env(safe-area-inset-top))]"
        >
          DUONEAR
        </motion.p>

        {/* SECTIONS */}

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <PartnersSection
              key="partners"
              title={title}
              partnerAName={partnerAName}
              partnerBName={partnerBName}
              partnerAAvatarUrl={partnerAAvatarUrl}
              partnerBAvatarUrl={partnerBAvatarUrl}
            />
          ) : (
            <MediatorSection
              key="mediator"
              persona={persona}
              personaName={personaName}
              personaImage={personaImage}
            />
          )}
        </AnimatePresence>

        {/* STEP INDICATOR */}

        <div className="absolute inset-x-0 bottom-[calc(2rem_+_env(safe-area-inset-bottom))] flex justify-center sm:bottom-[calc(2.5rem_+_env(safe-area-inset-bottom))]">
          <StepDots current={step === 0 ? 0 : 1} />
        </div>
      </motion.div>
    </MotionConfig>
  )
}