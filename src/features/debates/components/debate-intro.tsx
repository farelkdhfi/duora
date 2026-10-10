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

interface DebateIntroProps {
  title: string
  partnerAName: string
  partnerBName: string
  partnerAAvatarUrl?: string | null
  partnerBAvatarUrl?: string | null
  personaName: string
  personaImage: StaticImageData
  onComplete: () => void
}

type Side = 'left' | 'right'
type Step = 0 | 1 | 2 // 0 = pasangan, 1 = mediator, 2 = keluar

/* ===================================================== */
/* TIMING (ms) */
/* ===================================================== */

const PARTNERS_MS = 2900
const MEDIATOR_MS = 2500
const EXIT_MS = 500

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const sideAccent: Record<Side, { ring: string; dot: string }> = {
  left: { ring: 'ring-[#b8967a]/70', dot: 'bg-[#b8967a]' },
  right: { ring: 'ring-[#8fa3b5]/80', dot: 'bg-[#8fa3b5]' },
}

const eyebrow =
  'text-[9px] font-semibold uppercase tracking-[0.24em] text-neutral-400'

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

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.12 },
  }),
}

const slideIn: Variants = {
  hidden: (side: Side) => ({
    opacity: 0,
    x: side === 'left' ? -24 : 24,
  }),
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.15 },
  },
}

const grow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.9, ease: EASE, delay: 0.45 },
  },
}

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE },
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
          'relative size-[76px] rounded-full shadow-[0_18px_40px_-18px_rgba(0,0,0,0.2)] ring-[1.5px] ring-offset-[5px] ring-offset-[#f7f6f2] sm:size-[92px]',
          accent.ring,
        ].join(' ')}
      >
        <div className="relative size-full overflow-hidden rounded-full bg-[#f3eee6]">
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

      <p className="mt-4 max-w-[110px] truncate text-[12px] font-medium tracking-[-0.01em] text-neutral-800 sm:text-[13px]">
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
      <motion.p variants={rise} custom={0} className={eyebrow}>
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
        custom={4}
        className="mt-11 h-px w-8 bg-black/15"
      />

      <motion.p
        variants={rise}
        custom={5}
        className={`mt-6 ${eyebrow}`}
      >
        Topic
      </motion.p>

      <motion.h1
        variants={rise}
        custom={6}
        className="mt-3 line-clamp-3 max-w-[440px] text-balance font-serif text-[26px] leading-[1.2] tracking-[-0.025em] text-neutral-900 sm:text-[36px]"
      >
        {title}
      </motion.h1>
    </motion.section>
  )
}

/* ===================================================== */
/* SECTION 2 - AI MEDIATOR + PERSONA */
/* ===================================================== */

function MediatorSection({
  personaName,
  personaImage,
}: Pick<DebateIntroProps, 'personaName' | 'personaImage'>) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex w-full max-w-xl flex-col items-center text-center"
    >
      <div className="relative">
        {/* glow (hanya fade, tanpa animasi blur) */}
        <motion.span
          aria-hidden
          variants={fade}
          className="pointer-events-none absolute left-1/2 top-1/2 size-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eadfd2]/70 blur-[56px] sm:size-[230px]"
        />

        <motion.div variants={pop} className="relative">
          {/* ring berdenyut pelan */}
          <motion.span
            aria-hidden
            className="absolute -inset-3 rounded-full border border-black/[0.05]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.2, 0.7] }}
            transition={{
              duration: 3.2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />

          <div className="relative flex size-[104px] items-center justify-center rounded-full border border-black/[0.055] bg-[#f8f4ed] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] sm:size-[124px]">
            <span className="absolute inset-3 rounded-full bg-white/85" />

            <span className="relative block size-[56px] sm:size-[68px]">
              <Image
                src={personaImage}
                alt=""
                fill
                sizes="68px"
                className="object-contain"
              />
            </span>
          </div>
        </motion.div>
      </div>

      <motion.p
        variants={rise}
        custom={2}
        className={`mt-9 ${eyebrow}`}
      >
        Your mediator
      </motion.p>

      <motion.h2
        variants={rise}
        custom={3}
        className="mt-3 font-serif text-[34px] leading-none tracking-[-0.03em] text-neutral-900 sm:text-[44px]"
      >
        {personaName}
      </motion.h2>

      <motion.div
        variants={rise}
        custom={5}
        className="mt-10 flex items-center gap-2.5"
      >
        <span className="size-1 rounded-full bg-neutral-300" />

        <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-300">
          Find a place in the middle
        </span>

        <span className="size-1 rounded-full bg-neutral-300" />
      </motion.div>
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
          className="h-[5px] rounded-full bg-neutral-900"
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
          'fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f7f6f2] px-6',
          isExit ? 'pointer-events-none' : '',
        ].join(' ')}
      >
        {/* AMBIENT */}

        <div className="pointer-events-none absolute left-[16%] top-[26%] size-40 rounded-full bg-pink-300/[0.10] blur-[80px] sm:size-56" />

        <div className="pointer-events-none absolute bottom-[20%] right-[16%] size-40 rounded-full bg-blue-300/[0.09] blur-[80px] sm:size-56" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eadfce]/[0.10] blur-[90px]" />

        {/* WORDMARK */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute inset-x-0 top-[calc(2rem_+_env(safe-area-inset-top))] text-center text-[9px] font-semibold uppercase tracking-[0.3em] text-neutral-400 sm:top-[calc(2.5rem_+_env(safe-area-inset-top))]"
        >
          Duora
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