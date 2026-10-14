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
    <section
      className="relative overflow-hidden rounded-b-[2rem] border border-white/[0.08] bg-[#0a0a0c] px-4 py-5 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.7)] sm:rounded-[1.5rem] sm:px-6 sm:py-6"
    >
      {/* BACKGROUND */}
      <BackgroundOrnaments />

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
                    className="relative block h-1.5 overflow-hidden rounded-full bg-white/20"
                    animate={{ width: active ? 32 : 6 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    {active && (
                      <motion.span
                        key={index}
                        className="absolute inset-0 origin-left rounded-full bg-white"
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
/* BACKGROUND ORNAMENTS (LOVE + BUBBLE)                          */
/* ============================================================= */

interface OrnamentConfig {
  id: string
  type: 'heart' | 'bubble'
  /** posisi horizontal (%) */
  left: number
  /** posisi vertikal (%) — dipakai saat reduced motion (statis) */
  top: number
  /** ukuran (px) */
  size: number
  /** durasi 1x naik (detik) */
  duration: number
  /** delay awal (detik) */
  delay: number
  /** jarak goyang kiri-kanan (px) */
  drift: number
  /** opacity maksimum */
  opacity: number
  color: string
  /** blur untuk efek depth (px) */
  blur?: number
}

/** Jarak naik ornamen (px) — sedikit lebih tinggi dari tinggi card */
const RISE = 290

const PINK = '#f9a8d4'
const LILAC = '#c4a1ee'
const BLUE = '#9dc1f7'

/**
 * Data statis (tanpa Math.random) supaya aman dari hydration mismatch.
 * Posisi lebih banyak di sisi kiri/kanan agar area avatar tetap bersih.
 */
const ORNAMENTS: OrnamentConfig[] = [
  // ---- Hearts ----
  { id: 'h1', type: 'heart', left: 6, top: 62, size: 11, duration: 12, delay: 0, drift: 7, opacity: 0.4, color: PINK },
  { id: 'h2', type: 'heart', left: 18, top: 28, size: 8, duration: 15, delay: 4.5, drift: 9, opacity: 0.28, color: LILAC, blur: 0.6 },
  { id: 'h3', type: 'heart', left: 31, top: 78, size: 7, duration: 14, delay: 8, drift: 6, opacity: 0.22, color: PINK, blur: 1 },
  { id: 'h4', type: 'heart', left: 70, top: 70, size: 9, duration: 13, delay: 2, drift: 8, opacity: 0.3, color: LILAC, blur: 0.6 },
  { id: 'h5', type: 'heart', left: 84, top: 34, size: 12, duration: 11, delay: 6, drift: 7, opacity: 0.4, color: PINK },
  { id: 'h6', type: 'heart', left: 93, top: 80, size: 8, duration: 16, delay: 9.5, drift: 6, opacity: 0.26, color: BLUE, blur: 0.8 },
  { id: 'h7', type: 'heart', left: 50, top: 88, size: 6, duration: 17, delay: 11, drift: 10, opacity: 0.16, color: PINK, blur: 1.2 },

  // ---- Bubbles ----
  { id: 'b1', type: 'bubble', left: 12, top: 74, size: 14, duration: 13, delay: 1.5, drift: 8, opacity: 0.55, color: BLUE },
  { id: 'b2', type: 'bubble', left: 24, top: 46, size: 7, duration: 16, delay: 5.5, drift: 6, opacity: 0.4, color: LILAC, blur: 0.5 },
  { id: 'b3', type: 'bubble', left: 40, top: 84, size: 10, duration: 15, delay: 9, drift: 9, opacity: 0.28, color: PINK, blur: 0.8 },
  { id: 'b4', type: 'bubble', left: 62, top: 60, size: 6, duration: 14, delay: 3, drift: 7, opacity: 0.32, color: BLUE, blur: 0.6 },
  { id: 'b5', type: 'bubble', left: 77, top: 82, size: 16, duration: 12, delay: 7, drift: 10, opacity: 0.5, color: LILAC },
  { id: 'b6', type: 'bubble', left: 89, top: 52, size: 8, duration: 17, delay: 0.8, drift: 6, opacity: 0.38, color: PINK, blur: 0.4 },
  { id: 'b7', type: 'bubble', left: 3, top: 36, size: 9, duration: 18, delay: 10, drift: 7, opacity: 0.3, color: BLUE, blur: 0.8 },
]

function BackgroundOrnaments() {
  const reduced = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
     
      <div className='absolute -bottom-10 -left-10 w-30 h-30 bg-blue-400/20 blur-[60px] rounded-full'></div>
      <div className='absolute -bottom-10 -right-10 w-30 h-30 bg-pink-400/20 blur-[60px] rounded-full'></div>


      {/* Floating hearts & bubbles */}
      {ORNAMENTS.map((o) => (
        <FloatingOrnament key={o.id} o={o} reduced={!!reduced} />
      ))}
    </div>
  )
}

function FloatingOrnament({
  o,
  reduced,
}: {
  o: OrnamentConfig
  reduced: boolean
}) {
  const shape =
    o.type === 'heart' ? (
      <OrnamentHeart size={o.size} color={o.color} />
    ) : (
      <OrnamentBubble size={o.size} color={o.color} />
    )

  const filter = o.blur ? `blur(${o.blur}px)` : undefined

  // Reduced motion: tampil statis & lebih redup
  if (reduced) {
    return (
      <span
        className="absolute"
        style={{
          left: `${o.left}%`,
          top: `${o.top}%`,
          opacity: o.opacity * 0.6,
          filter,
        }}
      >
        {shape}
      </span>
    )
  }

  return (
    <motion.span
      className="absolute will-change-transform"
      style={{ left: `${o.left}%`, bottom: -24, filter }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        y: [0, -RISE],
        x: [-o.drift, o.drift],
        rotate: o.type === 'heart' ? [-14, 14] : 0,
        scale: o.type === 'bubble' ? [0.92, 1.08] : [0.95, 1.05],
        opacity: [0, o.opacity, o.opacity, 0],
      }}
      transition={{
        // naik linear terus-menerus
        y: {
          duration: o.duration,
          delay: o.delay,
          repeat: Infinity,
          ease: 'linear',
        },
        // goyang kiri-kanan halus
        x: {
          duration: o.duration / 3,
          delay: o.delay,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
        rotate: {
          duration: o.duration / 3,
          delay: o.delay,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
        scale: {
          duration: o.duration / 4,
          delay: o.delay,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
        // fade in di awal, fade out di akhir
        opacity: {
          duration: o.duration,
          delay: o.delay,
          repeat: Infinity,
          ease: 'linear',
          times: [0, 0.18, 0.78, 1],
        },
      }}
    >
      {shape}
    </motion.span>
  )
}

function OrnamentHeart({ size, color }: { size: number; color: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      style={{ color, filter: `drop-shadow(0 0 5px ${color}66)` }}
    >
      <path
        d="M24 37C21.5 34.9 10 27.5 10 18.5C10 13.8 13.2 10.5 17.5 10.5C20.3 10.5 22.6 12 24 14.3C25.4 12 27.7 10.5 30.5 10.5C34.8 10.5 38 13.8 38 18.5C38 27.5 26.5 34.9 24 37Z"
        fill="currentColor"
      />
    </svg>
  )
}

function OrnamentBubble({ size, color }: { size: number; color: string }) {
  return (
    <span
      className="block rounded-full"
      style={{
        width: size,
        height: size,
        border: '1px solid rgba(255,255,255,0.22)',
        background:
          'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.09) 35%, rgba(255,255,255,0.02) 70%)',
        boxShadow: `inset 0 0 6px rgba(255,255,255,0.08), 0 0 10px ${color}33`,
      }}
    />
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
            className="h-[64px] w-[170px] rounded-full bg-linear-to-r from-[#7fa8f0]/45 via-[#b98be0]/40 to-[#f08ab4]/45 blur-2xl sm:h-[72px] sm:w-[190px]"
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
                className="ring-[3px] ring-[#0d0d11]"
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
              className="flex size-7 items-center justify-center rounded-full bg-black shadow-[0_6px_16px_-6px_rgba(200,90,140,0.6)] ring-2 ring-[#0d0d11] sm:size-8"
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
        <p className="flex max-w-[260px] items-baseline justify-center gap-1.5 text-lg capitalize font-semibold tracking-[-0.03em] text-neutral-50 sm:max-w-[300px] sm:text-[18px]">
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
        <div className="size-6 overflow-hidden rounded-full bg-[#0d0d11] ring-2 ring-[#0d0d11] shadow-[0_4px_12px_-4px_rgba(90,130,210,0.6)]">
          <Avatar
            name={userName}
            url={userAvatarUrl}
            tone="blue"
            initialClassName="text-[11px]"
          />
        </div>
        <div className="size-6 overflow-hidden rounded-full bg-[#0d0d11] ring-2 ring-[#0d0d11] shadow-[0_4px_12px_-4px_rgba(200,90,140,0.6)]">
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

        <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-400">
          days together
        </span>
      </motion.div>

      {/* Meta */}
      <motion.div variants={item} className="mt-3 flex flex-col items-center">
        <div className="h-px w-12 bg-linear-to-r from-transparent via-[#b78ad0]/50 to-transparent" />
        {sinceLabel && (
          <p className="mt-0.5 text-[10px] text-neutral-500">
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
      {/* Avatar */}
      <div className="absolute inset-[2px] rounded-full bg-[#0d0d11] p-[2px]">
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