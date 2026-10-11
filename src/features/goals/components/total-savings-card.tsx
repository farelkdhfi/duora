'use client'

import { Heart, PiggyBank, Sparkle } from 'lucide-react'
import {
  motion,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from 'framer-motion'

interface TotalSavingsCardProps {
  /** Total tabungan dalam angka (Rupiah) */
  totalSavings: number
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

/* ========================================================= */
/* MOTION HELPERS */
/* ========================================================= */

/** Transition loop tanpa henti */
const loop = (
  duration: number,
  delay = 0,
  ease: Transition['ease'] = 'easeInOut',
): Transition => ({ duration, delay, ease, repeat: Infinity })

/** Mengembalikan props animasi, atau objek kosong kalau user pilih reduce motion */
function useLoop() {
  const reduce = useReducedMotion()
  return (animate: TargetAndTransition, transition: Transition) =>
    reduce ? {} : { animate, transition }
}

/* ========================================================= */
/* ORNAMENT DATA */
/* ========================================================= */

const HEARTS = [
  { pos: 'right-[34%] top-5', size: 13, delay: 0, duration: 5.5, tone: 'text-white/80' },
  { pos: 'right-[10%] bottom-7', size: 18, delay: 1.1, duration: 6.5, tone: 'text-pink-200' },
  { pos: 'right-5 top-9', size: 11, delay: 2.2, duration: 5, tone: 'text-sky-200' },
  { pos: 'right-[26%] bottom-4', size: 10, delay: 0.6, duration: 7, tone: 'text-white/70' },
]

const SPARKLES = [
  { pos: 'right-[44%] top-8', size: 10, delay: 0 },
  { pos: 'right-[6%] top-1/2', size: 12, delay: 0.9 },
  { pos: 'right-[30%] bottom-10', size: 9, delay: 1.8 },
]

/* ========================================================= */
/* CARD */
/* ========================================================= */

export default function TotalSavingsCard({
  totalSavings,
}: TotalSavingsCardProps) {
  const play = useLoop()

  const formattedTotalSavings = currencyFormatter.format(totalSavings)
  const parts = currencyFormatter.formatToParts(totalSavings)
  const symbol = parts.find((p) => p.type === 'currency')?.value ?? 'Rp'
  const amount = parts
    .filter((p) => p.type !== 'currency' && p.type !== 'literal')
    .map((p) => p.value)
    .join('')

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-linear-to-br from-[#c38cb0] via-[#89a3cd] to-[#7493c5] p-6 shadow-[0_30px_30px_-25px_rgba(139,92,246,0.6),inset_0_1px_0_rgba(255,255,255,0.5)] md:p-8">
      {/* Highlight lembut di atas kartu */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/15 to-transparent" />

      {/* Blob blur yang melayang */}
      <motion.div
        className="pointer-events-none absolute -right-16 -top-20 size-60 rounded-full bg-sky-300/50 blur-[70px]"
        {...play({ x: [0, -24, 0], y: [0, 18, 0], scale: [1, 1.15, 1] }, loop(10))}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 left-1/4 size-56 rounded-full bg-pink-300/60 blur-[80px]"
        {...play({ x: [0, 28, 0], y: [0, -16, 0], scale: [1, 1.1, 1] }, loop(13, 1))}
      />
      <motion.div
        className="pointer-events-none absolute -left-16 top-1/3 size-36 rounded-full bg-violet-300/50 blur-[60px]"
        {...play({ x: [0, 20, 0], y: [0, 14, 0] }, loop(11, 2))}
      />

      {/* Garis putus-putus yang mengalir */}
      <svg
        className="pointer-events-none absolute -bottom-10 left-6 h-28 w-60 text-white/50"
        viewBox="0 0 240 112"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M0 96C48 22 128 12 240 66"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 8"
          {...play({ strokeDashoffset: [0, -48] }, loop(5, 0, 'linear'))}
        />
      </svg>

      {/* Hati mengambang */}
      {HEARTS.map((h, i) => (
        <motion.span
          key={`heart-${i}`}
          className={`pointer-events-none absolute ${h.pos} ${h.tone}`}
          aria-hidden="true"
          {...play(
            {
              y: [0, -14, 0],
              x: [0, 5, 0],
              rotate: [-8, 8, -8],
              opacity: [0.55, 1, 0.55],
            },
            loop(h.duration, h.delay),
          )}
        >
          <Heart size={h.size} fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}

      {/* Sparkle berkedip */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={`sparkle-${i}`}
          className={`pointer-events-none absolute ${s.pos} text-amber-200`}
          aria-hidden="true"
          {...play(
            { scale: [0.5, 1.15, 0.5], rotate: [0, 90, 180], opacity: [0.2, 1, 0.2] },
            loop(3.2, s.delay),
          )}
        >
          <Sparkle size={s.size} fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}

      {/* Kilau yang menyapu kartu */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent via-white/35 to-transparent"
        style={{ skewX: -20 }}
        initial={{ x: '-150%' }}
        aria-hidden="true"
        {...play(
          { x: '520%' },
          { duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 5 },
        )}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-[138px] items-center justify-between gap-6">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 py-1 pl-1 pr-3 shadow-[0_6px_18px_rgba(109,40,217,0.18)] backdrop-blur-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-white text-pink-500 shadow-sm">
              <PiggyBank size={13} strokeWidth={1.8} />
            </span>
            <span className="text-[11px] font-medium tracking-wide text-white [text-shadow:0_1px_2px_rgba(157,23,77,0.35)]">
              Total savings
            </span>
          </span>

          <p
            className="mt-4 flex items-baseline gap-1.5 text-white [text-shadow:0_2px_14px_rgba(157,23,77,0.35)]"
            aria-label={formattedTotalSavings}
          >
            <span className="text-[16px] font-semibold text-white/90 md:text-[18px]">
              {symbol}
            </span>
            <span className="text-[34px] font-semibold leading-none tracking-[-0.045em] md:text-[44px]">
              {amount}
            </span>
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex size-1.5">
              <motion.span
                className="absolute inset-0 rounded-full bg-white"
                initial={{ opacity: 0 }}
                {...play(
                  { scale: [1, 2.8], opacity: [0.7, 0] },
                  loop(2.2, 0, 'easeOut'),
                )}
              />
              <span className="relative size-1.5 rounded-full bg-white" />
            </span>
            <p className="text-[12px] text-white/90 [text-shadow:0_1px_2px_rgba(109,40,217,0.35)]">
              Saved together across all goals
            </p>
          </div>
        </div>

        {/* Centerpiece */}
        <div className="relative hidden size-32 shrink-0 sm:block" aria-hidden="true">
          {/* Ring luar berputar */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-white/60"
            {...play({ rotate: 360 }, loop(30, 0, 'linear'))}
          >
            <span className="absolute -top-1.5 left-1/2 -ml-1.5 size-3 rounded-full bg-pink-200 shadow-[0_0_0_3px_rgba(255,255,255,0.45)]" />
          </motion.div>

          {/* Ring dalam berputar terbalik */}
          <motion.div
            className="absolute inset-4 rounded-full border border-white/40"
            {...play({ rotate: -360 }, loop(20, 0, 'linear'))}
          >
            <span className="absolute -bottom-1 left-1/2 -ml-1 size-2 rounded-full bg-sky-200" />
          </motion.div>

          {/* Piggy bergoyang */}
          <motion.div
            className="absolute inset-8 flex items-center justify-center rounded-full bg-white/90 shadow-[0_14px_34px_rgba(109,40,217,0.3),inset_0_1px_0_#fff] backdrop-blur-sm"
            {...play({ y: [0, -5, 0], rotate: [-3, 3, -3] }, loop(4))}
          >
            <PiggyBank size={26} strokeWidth={1.5} className="text-pink-500" />
          </motion.div>

          {/* Koin jatuh ke piggy */}
          <div className="absolute inset-x-0 top-1 z-20 flex justify-center">
            <motion.span
              className="size-3.5 rounded-full bg-linear-to-br from-amber-200 to-amber-400 shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.6),0_2px_6px_rgba(245,158,11,0.45)]"
              initial={{ opacity: 0 }}
              {...play(
                {
                  y: [-8, -8, 24, 28],
                  opacity: [0, 1, 1, 0],
                  scale: [1, 1, 1, 0.4],
                },
                {
                  duration: 2.6,
                  times: [0, 0.15, 0.75, 1],
                  ease: 'easeIn',
                  repeat: Infinity,
                  repeatDelay: 1.4,
                },
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ========================================================= */
/* SKELETON */
/* ========================================================= */

export function TotalSavingsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/40 bg-linear-to-br from-[#cd67ab] via-[#89a3cd] to-[#7493c5]  p-6 shadow-[0_30px_70px_-25px_rgba(139,92,246,0.4)] md:p-8">
      <div className="flex min-h-[138px] animate-pulse items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="h-7 w-32 rounded-full bg-white/30" />
          <div className="h-10 w-56 rounded-xl bg-white/30" />
          <div className="h-2.5 w-44 rounded-full bg-white/25" />
        </div>
        <div className="hidden size-32 shrink-0 rounded-full bg-white/25 sm:block" />
      </div>
    </div>
  )
}