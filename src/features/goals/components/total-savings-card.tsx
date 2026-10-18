'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
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
  { pos: 'right-[34%] top-5', size: 13, delay: 0, duration: 5.5, tone: 'text-white/40' },
  { pos: 'right-[10%] bottom-7', size: 18, delay: 1.1, duration: 6.5, tone: 'text-pink-200/70' },
  { pos: 'right-5 top-9', size: 11, delay: 2.2, duration: 5, tone: 'text-sky-200/70' },
  { pos: 'right-[26%] bottom-4', size: 10, delay: 0.6, duration: 7, tone: 'text-white/30' },
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
  const t = useTranslations('goals.summary')
  
  const locale = useLocale()

  const currencyFormatter = useMemo(() => new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0
  }), [locale])

  const formattedTotalSavings = currencyFormatter.format(totalSavings)
  const parts = currencyFormatter.formatToParts(totalSavings)
  const symbol = parts.find((p) => p.type === 'currency')?.value ?? 'Rp'
  const amount = parts
    .filter((p) => p.type !== 'currency' && p.type !== 'literal')
    .map((p) => p.value)
    .join('')

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050507] p-6 shadow-[0_30px_40px_-25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] md:p-8">
      {/* Highlight tipis di atas kartu */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/[0.03] to-transparent" />

      {/* Accent gradient: biru pastel di pojok kanan atas */}
      <motion.div
        className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full bg-sky-200/30 blur-[56px]"
        {...play({ x: [0, -10, 0], y: [0, 8, 0], scale: [1, 1.1, 1] }, loop(10))}
      />

      {/* Accent gradient: pink pastel di pojok kiri bawah */}
      <motion.div
        className="pointer-events-none absolute -bottom-14 -left-14 size-40 rounded-full bg-pink-200/30 blur-[56px]"
        {...play({ x: [0, 10, 0], y: [0, -8, 0], scale: [1, 1.1, 1] }, loop(12, 1))}
      />

      {/* Garis putus-putus yang mengalir */}
      <svg
        className="pointer-events-none absolute -bottom-10 left-6 h-28 w-60 text-pink-200/40"
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
              opacity: [0.45, 1, 0.45],
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
          className={`pointer-events-none absolute ${s.pos} text-sky-100`}
          aria-hidden="true"
          {...play(
            { scale: [0.5, 1.15, 0.5], rotate: [0, 90, 180], opacity: [0.15, 0.9, 0.15] },
            loop(3.2, s.delay),
          )}
        >
          <Sparkle size={s.size} fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}

      {/* Kilau yang menyapu kartu */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent via-white/10 to-transparent"
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
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 shadow-[0_6px_18px_rgba(0,0,0,0.4)] backdrop-blur-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-pink-200/15 text-pink-200 ring-1 ring-pink-200/25">
              <PiggyBank size={13} strokeWidth={1.8} />
            </span>
            <span className="text-[11px] font-medium tracking-wide text-white/80">
              {t('label')}
            </span>
          </span>

          <p
            className="mt-4 flex items-baseline gap-1.5 text-white [text-shadow:0_2px_20px_rgba(251,207,232,0.3)]"
            aria-label={formattedTotalSavings}
          >
            <span className="text-[16px] font-semibold text-white/70 md:text-[18px]">
              {symbol}
            </span>
            <span className="text-[34px] font-semibold leading-none tracking-[-0.045em] md:text-[44px]">
              {amount}
            </span>
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex size-1.5">
              <motion.span
                className="absolute inset-0 rounded-full bg-pink-200"
                initial={{ opacity: 0 }}
                {...play(
                  { scale: [1, 2.8], opacity: [0.7, 0] },
                  loop(2.2, 0, 'easeOut'),
                )}
              />
              <span className="relative size-1.5 rounded-full bg-pink-200" />
            </span>
            <p className="text-[12px] text-white/60">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Centerpiece */}
        <div className="relative hidden size-32 shrink-0 sm:block" aria-hidden="true">
          {/* Ring luar berputar */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-white/30"
            {...play({ rotate: 360 }, loop(30, 0, 'linear'))}
          >
            <span className="absolute -top-1.5 left-1/2 -ml-1.5 size-3 rounded-full bg-pink-200 shadow-[0_0_0_3px_rgba(255,255,255,0.12),0_0_12px_rgba(251,207,232,0.6)]" />
          </motion.div>

          {/* Ring dalam berputar terbalik */}
          <motion.div
            className="absolute inset-4 rounded-full border border-white/20"
            {...play({ rotate: -360 }, loop(20, 0, 'linear'))}
          >
            <span className="absolute -bottom-1 left-1/2 -ml-1 size-2 rounded-full bg-sky-200 shadow-[0_0_10px_rgba(186,230,253,0.6)]" />
          </motion.div>

          {/* Piggy bergoyang */}
          <motion.div
            className="absolute inset-8 flex items-center justify-center rounded-full border border-white/10 bg-white/[0.07] shadow-[0_14px_34px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm"
            {...play({ y: [0, -5, 0], rotate: [-3, 3, -3] }, loop(4))}
          >
            <PiggyBank size={26} strokeWidth={1.5} className="text-pink-200" />
          </motion.div>

          {/* Koin jatuh ke piggy */}
          <div className="absolute inset-x-0 top-1 z-20 flex justify-center">
            <motion.span
              className="size-3.5 rounded-full bg-linear-to-br from-amber-200 to-amber-400 shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.6),0_2px_8px_rgba(245,158,11,0.5)]"
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
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050507] p-6 shadow-[0_30px_40px_-25px_rgba(0,0,0,0.8)] md:p-8">
      <div className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full bg-sky-200/20 blur-[56px]" />
      <div className="pointer-events-none absolute -bottom-14 -left-14 size-40 rounded-full bg-pink-200/20 blur-[56px]" />

      <div className="relative flex min-h-[138px] animate-pulse items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="h-7 w-32 rounded-full bg-white/10" />
          <div className="h-10 w-56 rounded-xl bg-white/10" />
          <div className="h-2.5 w-44 rounded-full bg-white/[0.08]" />
        </div>
        <div className="hidden size-32 shrink-0 rounded-full bg-white/[0.08] sm:block" />
      </div>
    </div>
  )
}