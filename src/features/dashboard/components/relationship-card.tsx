'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'

interface RelationshipCardProps {
  userName: string
  partnerName: string
  userAvatarUrl?: string | null
  partnerAvatarUrl?: string | null
  connectedAt?: string | null
}

type SlideKey = 'together' | 'days'

/** Durasi tiap slide (ms) */
const SLIDE_DURATION = 5200
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ============================================================= */
/* MOTION VARIANTS */
/* ============================================================= */

function useMotionVariants() {
  const reduced = useReducedMotion()

  return useMemo<{ slide: Variants; item: Variants }>(() => {
    if (reduced) {
      return {
        slide: {
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.4 } },
          exit: { opacity: 0, transition: { duration: 0.25 } },
        },
        item: {
          hidden: { opacity: 1 },
          show: { opacity: 1 },
        },
      }
    }

    return {
      slide: {
        hidden: { opacity: 0, y: 16, scale: 0.97, filter: 'blur(10px)' },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            duration: 0.75,
            ease: EASE,
            when: 'beforeChildren',
            staggerChildren: 0.1,
          },
        },
        exit: {
          opacity: 0,
          y: -16,
          scale: 1.02,
          filter: 'blur(10px)',
          transition: { duration: 0.5, ease: [0.4, 0, 1, 1] },
        },
      },
      item: {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      },
    }
  }, [reduced])
}

/* ============================================================= */
/* MAIN CARD */
/* ============================================================= */

export default function RelationshipCard({
  userName,
  partnerName,
  userAvatarUrl,
  partnerAvatarUrl,
  connectedAt,
}: RelationshipCardProps) {
  const { slide: slideVariants } = useMotionVariants()
  const [index, setIndex] = useState(0)

  const daysTogether = useMemo(() => {
    if (!connectedAt) return null
    const start = new Date(connectedAt).getTime()
    if (Number.isNaN(start)) return null
    return Math.max(1, Math.floor((Date.now() - start) / 86_400_000))
  }, [connectedAt])

  const sinceLabel = useMemo(() => {
    if (!connectedAt) return null
    const date = new Date(connectedAt)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [connectedAt])

  const slides = useMemo<SlideKey[]>(
    () => (daysTogether ? ['together', 'days'] : ['together']),
    [daysTogether],
  )

  const current = slides[index % slides.length]

  // Auto rotate
  useEffect(() => {
    if (slides.length < 2) return
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [index, slides.length])

  return (
    <section className="relative overflow-hidden rounded-b-[2rem] border border-black/20 bg-[#9CB8D9] px-4 py-5 shadow-[0_24px_60px_-36px_rgba(180,110,160,0.35)] sm:rounded-[1.5rem] sm:px-6 sm:py-6">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Flowing lines */}
        <svg
          className="absolute inset-0 h-full w-full opacity-70"
          viewBox="0 0 900 500"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="rc-wave"
              x1="0"
              y1="0"
              x2="900"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7fa8f0" stopOpacity="0" />
              <stop offset=".25" stopColor="#7fa8f0" stopOpacity=".35" />
              <stop offset=".5" stopColor="#f08ab4" stopOpacity=".45" />
              <stop offset=".75" stopColor="#b98be0" stopOpacity=".35" />
              <stop offset="1" stopColor="#f08ab4" stopOpacity="0" />
            </linearGradient>

            <filter id="rc-blur" x="-20%" y="-100%" width="140%" height="300%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <path
            d="M-80 145C90 65 170 90 300 150C430 210 520 220 650 145C760 82 850 95 980 145"
            stroke="url(#rc-wave)"
            strokeWidth="34"
            strokeOpacity=".18"
            filter="url(#rc-blur)"
          />
          <path
            d="M-80 250C70 195 165 200 290 250C410 300 500 315 625 250C750 185 850 200 980 250"
            stroke="url(#rc-wave)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M-80 385C70 325 170 340 300 395C420 445 520 450 650 385C770 325 850 335 980 390"
            stroke="url(#rc-wave)"
            strokeWidth="18"
            strokeOpacity=".12"
            filter="url(#rc-blur)"
          />
        </svg>

        {/* Minimal grain */}
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(rgba(60,30,80,0.9)_0.6px,transparent_0.6px)] [background-size:7px_7px]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10">

        {/* STAGE */}
        <div className="relative h-[152px] sm:h-[160px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={slideVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {current === 'together' ? (
                <TogetherSlide
                  userName={userName}
                  partnerName={partnerName}
                  userAvatarUrl={userAvatarUrl}
                  partnerAvatarUrl={partnerAvatarUrl}
                />
              ) : (
                <DaysSlide
                  days={daysTogether ?? 0}
                  userName={userName}
                  partnerName={partnerName}
                  userAvatarUrl={userAvatarUrl}
                  partnerAvatarUrl={partnerAvatarUrl}
                  sinceLabel={sinceLabel}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* INDICATORS */}
        {slides.length > 1 && (
          <div className="mt-1 flex items-center justify-center gap-1.5">
            {slides.map((s, i) => {
              const active = i === index % slides.length

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={
                    s === 'together' ? 'Show couple' : 'Show days together'
                  }
                  aria-current={active}
                  className="py-1.5"
                >
                  <motion.span
                    className="relative block h-1.5 overflow-hidden rounded-full bg-white"
                    animate={{ width: active ? 32 : 6 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    {active && (
                      <motion.span
                        key={index}
                        className="absolute inset-0 origin-left rounded-full bg-pink-200"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: SLIDE_DURATION / 1000,
                          ease: 'linear',
                        }}
                      />
                    )}
                  </motion.span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

/* ============================================================= */
/* SLIDE 1 — TOGETHER (USER + PARTNER)                           */
/* ============================================================= */

function TogetherSlide({
  userName,
  partnerName,
  userAvatarUrl,
  partnerAvatarUrl,
}: {
  userName: string
  partnerName: string
  userAvatarUrl?: string | null
  partnerAvatarUrl?: string | null
}) {
  const { item } = useMotionVariants()
  const reduced = useReducedMotion()
  const offset = reduced ? 0 : 40

  return (
    <>
      <div className="relative flex items-center justify-center">
        {/* Shared halo (menyatukan dua avatar) */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: reduced ? 0 : 0.35 }}
        >
          <motion.div
            className="h-[64px] w-[170px] rounded-full bg-linear-to-r from-[#a9c8ff]/70 via-[#dcb6f2]/60 to-[#ffb3d0]/70 blur-2xl sm:h-[72px] sm:w-[190px]"
            animate={
              reduced
                ? undefined
                : { opacity: [0.55, 0.95, 0.55], scale: [1, 1.1, 1] }
            }
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Avatars */}
        <div className="relative flex items-center justify-center -space-x-3.5 sm:-space-x-4">
          {/* USER — masuk dari kiri */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: -offset, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.05 }}
          >
            <motion.div
              animate={reduced ? undefined : { y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <RingAvatar name={userName} url={userAvatarUrl} tone="blue" />
            </motion.div>
          </motion.div>

          {/* PARTNER — masuk dari kanan */}
          <motion.div
            className="relative z-20"
            initial={{ opacity: 0, x: offset, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.05 }}
          >
            <motion.div
              animate={reduced ? undefined : { y: [0, -3, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.8,
              }}
            >
              <RingAvatar
                name={partnerName}
                url={partnerAvatarUrl}
                tone="pink"
                className="ring-[3px] ring-white"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Heart di titik pertemuan */}
        <div className="absolute -bottom-0.5 left-1/2 z-30 -translate-x-1/2">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 18,
              delay: reduced ? 0 : 0.7,
            }}
          >
            <motion.div
              className="flex size-7 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_-6px_rgba(200,90,140,0.55)] ring-1 ring-black/5 sm:size-8"
              animate={
                reduced ? undefined : { scale: [1, 1.14, 1, 1.1, 1] }
              }
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: 'easeInOut',
                delay: 1.6,
              }}
            >
              <RelationshipHeart className="size-4" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Names */}
      <motion.div variants={item} className="mt-4 flex flex-col items-center">
        <p className="flex max-w-[260px] items-baseline justify-center gap-1.5 text-[16px] font-semibold tracking-[-0.03em] text-white sm:max-w-[300px] sm:text-[18px]">
          <span className="min-w-0 max-w-[100px] truncate sm:max-w-[120px]">
            {userName}
          </span>
          <span className="bg-pink-200 bg-clip-text text-transparent">
            &amp;
          </span>
          <span className="min-w-0 max-w-[100px] truncate sm:max-w-[120px]">
            {partnerName}
          </span>
        </p>
      </motion.div>
    </>
  )
}

/* ============================================================= */
/* SLIDE 2 — DAYS TOGETHER */
/* ============================================================= */

function DaysSlide({
  days,
  userName,
  partnerName,
  userAvatarUrl,
  partnerAvatarUrl,
  sinceLabel,
}: {
  days: number
  userName: string
  partnerName: string
  userAvatarUrl?: string | null
  partnerAvatarUrl?: string | null
  sinceLabel: string | null
}) {
  const { item } = useMotionVariants()

  return (
    <>
      {/* Overlapping mini avatars */}
      <motion.div variants={item} className="flex -space-x-2">
        <div className="size-6 overflow-hidden rounded-full bg-white ring-2 ring-white shadow-[0_4px_12px_-4px_rgba(90,110,170,0.5)]">
          <Avatar
            name={userName}
            url={userAvatarUrl}
            tone="blue"
            initialClassName="text-[11px]"
          />
        </div>
        <div className="size-6 overflow-hidden rounded-full bg-white ring-2 ring-white shadow-[0_4px_12px_-4px_rgba(200,90,140,0.5)]">
          <Avatar
            name={partnerName}
            url={partnerAvatarUrl}
            tone="pink"
            initialClassName="text-[11px]"
          />
        </div>
      </motion.div>

      {/* Counter */}
      <motion.div variants={item} className="mt-2.5 flex flex-col items-center">
        <span className="bg-white px-3 bg-clip-text text-[40px] font-semibold leading-none tracking-[-0.06em] tabular-nums text-transparent sm:text-[48px]">
          <CountUp value={days} />
        </span>

        <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-200">
          days together
        </span>
      </motion.div>

      {/* Meta */}
      <motion.div variants={item} className="mt-3 flex flex-col items-center">
        <div className="h-px w-12 bg-linear-to-r from-transparent via-[#b78ad0]/40 to-transparent" />
        {sinceLabel && (
          <p className="mt-0.5 text-[10px] text-neutral-100">
            Since {sinceLabel}
          </p>
        )}
      </motion.div>
    </>
  )
}

/* ============================================================= */
/* COUNT UP */
/* ============================================================= */

function CountUp({ value }: { value: number }) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }

    const controls = animate(0, value, {
      duration: 1.6,
      delay: 0.3,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })

    return () => controls.stop()
  }, [value, reduced])

  return <>{display.toLocaleString('en-US')}</>
}

/* ============================================================= */
/* RING AVATAR (dengan ring gradient) */
/* ============================================================= */

function RingAvatar({
  name,
  url,
  tone,
  className = '',
}: {
  name: string
  url?: string | null
  tone: 'blue' | 'pink'
  className?: string
}) {
  const isPink = tone === 'pink'

  return (
    <div className="relative size-[64px] sm:size-[76px]">
      {/* Gradient ring */}
      <div
        className={`absolute inset-0 rounded-full ${className} ${
          isPink
            ? 'bg-linear-to-br from-[#ffc2d9] via-[#e58fb4] to-[#c9a6ee] shadow-[0_10px_22px_-10px_rgba(214,100,150,0.55)]'
            : 'bg-linear-to-br from-[#b4d3ff] via-[#7fa8f0] to-[#b9a6ee] shadow-[0_10px_22px_-10px_rgba(90,130,210,0.55)]'
        }`}
      />

      {/* Avatar */}
      <div className="absolute inset-[2px] rounded-full bg-white p-[2px]">
        <div className="h-full w-full overflow-hidden rounded-full">
          <Avatar name={name} url={url} tone={tone} />
        </div>
      </div>
    </div>
  )
}

/* ============================================================= */
/* AVATAR */
/* ============================================================= */

function Avatar({
  name,
  url,
  tone,
  initialClassName = 'text-[24px] sm:text-[28px]',
}: {
  name: string
  url?: string | null
  tone: 'blue' | 'pink'
  initialClassName?: string
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        draggable={false}
        className="h-full w-full object-cover"
      />
    )
  }

  const initial = name.trim().slice(0, 1).toUpperCase() || '?'
  const isPink = tone === 'pink'

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-linear-to-br ${
        isPink ? 'from-[#ffd6e5] to-[#f7b6d0]' : 'from-[#d4e5ff] to-[#a9c8f5]'
      }`}
    >
      <span
        className={`font-semibold tracking-[-0.05em] ${initialClassName} ${
          isPink ? 'text-[#b8527d]' : 'text-[#4c78b8]'
        }`}
      >
        {initial}
      </span>
    </div>
  )
}

/* ============================================================= */
/* RELATIONSHIP HEART */
/* ============================================================= */

function RelationshipHeart({ className = 'size-6' }: { className?: string }) {
  const gradientId = `relationship-heart-${useId().replace(/:/g, '')}`

  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={gradientId}
          x1="9"
          y1="10"
          x2="39"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff8db8" />
          <stop offset=".5" stopColor="#c692e6" />
          <stop offset="1" stopColor="#7fb2f5" />
        </linearGradient>
      </defs>

      <path
        d="M24 37C21.5 34.9 10 27.5 10 18.5C10 13.8 13.2 10.5 17.5 10.5C20.3 10.5 22.6 12 24 14.3C25.4 12 27.7 10.5 30.5 10.5C34.8 10.5 38 13.8 38 18.5C38 27.5 26.5 34.9 24 37Z"
        fill={`url(#${gradientId})`}
      />

      <path
        d="M15 17C15.5 14.5 17.2 13.5 19 13.8"
        stroke="white"
        strokeOpacity=".75"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}