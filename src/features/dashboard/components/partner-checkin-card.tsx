import Link from 'next/link'
import {
  ArrowUpRight,
  Brain,
  HandHeart,
  Heart,
  Zap,
} from 'lucide-react'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import sadEmot from '@/assets/emoticon/sad-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'

import type {
  DailyCheckin,
  Mood,
} from '@/features/checkins/types'

interface PartnerCheckinCardProps {
  checkin: DailyCheckin | null
  partnerName: string
}

const moodInfo: Record<
  Mood,
  {
    image: typeof happyEmot
    label: string
    background: string
    text: string
  }
> = {
  happy: {
    image: happyEmot,
    label: 'Feeling good',
    background: 'bg-emerald-50',
    text: 'text-emerald-600',
  },

  neutral: {
    image: neutralEmot,
    label: 'Okay',
    background: 'bg-neutral-100',
    text: 'text-neutral-500',
  },

  sad: {
    image: sadEmot,
    label: 'Feeling low',
    background: 'bg-blue-50',
    text: 'text-blue-500',
  },

  tired: {
    image: tiredEmot,
    label: 'Tired',
    background: 'bg-violet-50',
    text: 'text-violet-500',
  },

  stressed: {
    image: stressedEmot,
    label: 'Stressed',
    background: 'bg-rose-50',
    text: 'text-rose-500',
  },
}

/**
 * Mood-based ambient theme for the whole card.
 * Mirrors the palette used in the check-in form so both surfaces
 * feel consistent: warm/happy, cool/sad, muted/tired, red/stressed.
 */
const moodCardTheme: Record<
  Mood,
  {
    ambientTop: string
    ambientBottom: string
    headerIconWrap: string
    headerIconColor: string
    needsBorder: string
    needsBg: string
    needsIconBg: string
    needsIconColor: string
  }
> = {
  happy: {
    ambientTop: 'bg-[#FFD166]/25',
    ambientBottom: 'bg-[#FF9F43]/20',
    headerIconWrap: 'bg-gradient-to-br from-[#FFD166]/30 to-[#FF9F43]/20',
    headerIconColor: 'text-[#FF9500]',
    needsBorder: 'border-amber-100/60',
    needsBg: 'bg-gradient-to-br from-amber-50/60 to-orange-50/40',
    needsIconBg: 'bg-white/80',
    needsIconColor: 'text-amber-500',
  },
  neutral: {
    ambientTop: 'bg-pink-100/40',
    ambientBottom: 'bg-blue-100/30',
    headerIconWrap: 'bg-gradient-to-br from-pink-50 to-blue-50',
    headerIconColor: 'text-pink-500',
    needsBorder: 'border-blue-100/60',
    needsBg: 'bg-gradient-to-br from-blue-50/60 to-pink-50/40',
    needsIconBg: 'bg-white/80',
    needsIconColor: 'text-blue-500',
  },
  sad: {
    ambientTop: 'bg-[#5A7FBF]/20',
    ambientBottom: 'bg-[#3A4A8F]/15',
    headerIconWrap: 'bg-gradient-to-br from-[#5A7FBF]/25 to-[#3A4A8F]/20',
    headerIconColor: 'text-[#4A5FA8]',
    needsBorder: 'border-indigo-100/60',
    needsBg: 'bg-gradient-to-br from-indigo-50/60 to-blue-50/40',
    needsIconBg: 'bg-white/80',
    needsIconColor: 'text-indigo-500',
  },
  tired: {
    ambientTop: 'bg-[#9B8AC4]/20',
    ambientBottom: 'bg-[#5E6096]/15',
    headerIconWrap: 'bg-gradient-to-br from-[#9B8AC4]/25 to-[#5E6096]/20',
    headerIconColor: 'text-[#7A6FB0]',
    needsBorder: 'border-violet-100/60',
    needsBg: 'bg-gradient-to-br from-violet-50/60 to-purple-50/40',
    needsIconBg: 'bg-white/80',
    needsIconColor: 'text-violet-500',
  },
  stressed: {
    ambientTop: 'bg-[#D62E2E]/20',
    ambientBottom: 'bg-[#7A1414]/15',
    headerIconWrap: 'bg-gradient-to-br from-[#D62E2E]/25 to-[#7A1414]/20',
    headerIconColor: 'text-[#D62E2E]',
    needsBorder: 'border-rose-100/60',
    needsBg: 'bg-gradient-to-br from-rose-50/70 to-red-50/40',
    needsIconBg: 'bg-white/80',
    needsIconColor: 'text-rose-500',
  },
}

/* ============================================================= */
/* CARD SHELL */
/* ============================================================= */

function CardShell({
  theme,
  children,
}: {
  theme: (typeof moodCardTheme)[Mood]
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 p-6 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.15)] backdrop-blur-xl">
      {/* Ambient */}

      <div
        className={`pointer-events-none absolute -right-16 -top-16 size-36 rounded-full blur-3xl transition-colors duration-500 ${theme.ambientTop}`}
      />

      <div
        className={`pointer-events-none absolute -bottom-16 -left-16 size-36 rounded-full blur-3xl transition-colors duration-500 ${theme.ambientBottom}`}
      />

      <div className="relative">
        {children}
      </div>
    </div>
  )
}

/* ============================================================= */
/* HEADER */
/* ============================================================= */

function HeaderRow({
  theme,
}: {
  theme: (typeof moodCardTheme)[Mood]
}) {
  return (
    <div className="flex items-start justify-between">
      <div
        className={`flex size-10 items-center justify-center rounded-[14px] transition-colors duration-500 ${theme.headerIconWrap}`}
      >
        <Heart
          size={17}
          strokeWidth={2.2}
          className={`transition-colors duration-500 ${theme.headerIconColor}`}
          fill="currentColor"
        />
      </div>

      <Link
        href="/check-in"
        aria-label="Open daily check-in"
        className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-200 hover:bg-neutral-900 hover:text-white"
      >
        <ArrowUpRight
          size={15}
          strokeWidth={2.3}
        />
      </Link>
    </div>
  )
}

/* ============================================================= */
/* STAT TILE */
/* ============================================================= */

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-black/[0.03] bg-neutral-50/80 p-3.5">
      <div className="flex items-center gap-1.5">
        {icon}

        <p className="text-[11px] font-medium text-neutral-400">
          {label}
        </p>
      </div>

      <p className="mt-1.5 text-[17px] font-semibold tracking-[-0.02em] text-neutral-800">
        {value}

        <span className="text-[12px] font-medium text-neutral-400">
          /10
        </span>
      </p>
    </div>
  )
}

/* ============================================================= */
/* MAIN COMPONENT */
/* ============================================================= */

export default function PartnerCheckinCard({
  checkin,
  partnerName,
}: PartnerCheckinCardProps) {
  /* =========================================================== */
  /* EMPTY STATE */
  /* =========================================================== */

  if (!checkin) {
    const theme = moodCardTheme.neutral

    return (
      <CardShell theme={theme}>
        <HeaderRow theme={theme} />

        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
            Partner check-in
          </p>

          <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
            {partnerName}
            {' '}
            hasn't checked in.
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-400">
            Maybe they need a little space,
            or maybe a little love. ❤️
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-pink-50">
            <Heart
              size={12}
              className="text-pink-400"
              fill="currentColor"
            />
          </div>

          <p className="text-[11px] text-neutral-400">
            Give them a little moment.
          </p>
        </div>
      </CardShell>
    )
  }

  /* =========================================================== */
  /* CHECK-IN DATA */
  /* =========================================================== */

  const mood = moodInfo[checkin.mood]
  const theme = moodCardTheme[checkin.mood] ?? moodCardTheme.neutral

  /* =========================================================== */
  /* CHECK-IN CARD */
  /* =========================================================== */

  return (
    <CardShell theme={theme}>
      <HeaderRow theme={theme} />

      {/* ======================================================= */}
      {/* PARTNER + MOOD */}
      {/* ======================================================= */}

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
            Partner check-in
          </p>

          <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
            {partnerName}
          </h2>

          <p className="mt-1 text-xs text-neutral-400">
            Shared how they're feeling today.
          </p>
        </div>

        {/* Mood */}

        <div
          className={`
            flex shrink-0 flex-col items-center
            rounded-[1.25rem] px-3.5 py-2.5
            transition-colors duration-500
            ${mood.background}
          `}
        >
          <img
            src={mood.image.src}
            alt={mood.label}
            className="h-20 w-20 object-contain"
          />

          <span
            className={`
              mt-1.5 text-base font-semibold
              ${mood.text}
            `}
          >
            {mood.label}
          </span>
        </div>
      </div>

      {/* ======================================================= */}
      {/* ENERGY + STRESS */}
      {/* ======================================================= */}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatTile
          icon={
            <Zap
              size={13}
              strokeWidth={2.5}
              className="text-amber-500"
            />
          }
          label="Energy"
          value={checkin.energy}
        />

        <StatTile
          icon={
            <Brain
              size={13}
              strokeWidth={2.5}
              className="text-violet-500"
            />
          }
          label="Stress"
          value={checkin.stress}
        />
      </div>

      {/* ======================================================= */}
      {/* NEEDS FROM PARTNER */}
      {/* ======================================================= */}

      {checkin.needs_from_partner && (
        <div
          className={`mt-3 rounded-2xl border p-4 transition-colors duration-500 ${theme.needsBorder} ${theme.needsBg}`}
        >
          <div className="flex items-center gap-1.5">
            <div
              className={`flex size-6 items-center justify-center rounded-lg transition-colors duration-500 ${theme.needsIconBg}`}
            >
              <HandHeart
                size={13}
                strokeWidth={2.4}
                className={`transition-colors duration-500 ${theme.needsIconColor}`}
              />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
              Needs from you
            </p>
          </div>

          <p className="mt-2 text-[13px] leading-5 text-neutral-700">
            {checkin.needs_from_partner}
          </p>
        </div>
      )}
    </CardShell>
  )
}