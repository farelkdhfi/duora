'use client'

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

/* ============================================================= */
/* MOOD */
/* ============================================================= */

const moodInfo: Record<
  Mood,
  {
    image: typeof happyEmot
    label: string
    badge: string
    text: string
  }
> = {
  happy: {
    image: happyEmot,
    label: 'Feeling good',
    badge: 'bg-emerald-50',
    text: 'text-emerald-600',
  },

  neutral: {
    image: neutralEmot,
    label: 'Okay',
    badge: 'bg-neutral-100',
    text: 'text-neutral-500',
  },

  sad: {
    image: sadEmot,
    label: 'Feeling low',
    badge: 'bg-blue-50',
    text: 'text-blue-500',
  },

  tired: {
    image: tiredEmot,
    label: 'Tired',
    badge: 'bg-violet-50',
    text: 'text-violet-500',
  },

  stressed: {
    image: stressedEmot,
    label: 'Stressed',
    badge: 'bg-rose-50',
    text: 'text-rose-500',
  },
}

/* ============================================================= */
/* CARD */
/* ============================================================= */

function CardShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[1.5rem]
        border border-black/[0.06]
        bg-white
      "
    >
      <div className="relative p-5 sm:p-6">
        {children}
      </div>
    </div>
  )
}

/* ============================================================= */
/* HEADER */
/* ============================================================= */

function HeaderRow() {
  return (
    <div className="flex items-center justify-between">

      <div
        className="
          flex size-9
          items-center justify-center
          rounded-xl
          bg-neutral-900
          text-white
        "
      >
        <Heart
          size={15}
          strokeWidth={2.2}
          fill="currentColor"
        />
      </div>

      <Link
        href="/check-in"
        aria-label="Open daily check-in"
        className="
          flex size-8
          items-center justify-center
          rounded-full
          bg-neutral-100
          text-neutral-400
          transition-all
          duration-200
          hover:bg-neutral-900
          hover:text-white
        "
      >
        <ArrowUpRight
          size={14}
          strokeWidth={2.3}
        />
      </Link>

    </div>
  )
}

/* ============================================================= */
/* STAT */
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
    <div
      className="
        rounded-xl
        border border-black/[0.05]
        bg-neutral-50/70
        px-3.5
        py-3
      "
    >
      <div className="flex items-center gap-1.5">

        {icon}

        <span className="text-[10px] font-medium text-neutral-400">
          {label}
        </span>

      </div>

      <p className="mt-1.5 text-base font-semibold tracking-[-0.02em] text-neutral-800">
        {value}
        <span className="ml-0.5 text-[11px] font-medium text-neutral-300">
          /10
        </span>
      </p>
    </div>
  )
}

/* ============================================================= */
/* MAIN */
/* ============================================================= */

export default function PartnerCheckinCard({
  checkin,
  partnerName,
}: PartnerCheckinCardProps) {

  /* =========================================================== */
  /* EMPTY */
  /* =========================================================== */

  if (!checkin) {
    return (
      <CardShell>

        <HeaderRow />

        <div className="mt-6">

          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
            Partner check-in
          </p>

          <h2 className="mt-2 text-lg font-semibold tracking-[-0.035em] text-neutral-900">
            {partnerName} hasn't checked in.
          </h2>

          <p className="mt-2 max-w-sm text-[13px] leading-5 text-neutral-400">
            Maybe they need a little space,
            or maybe a little love.
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

          <p className="text-[10px] text-neutral-400">
            Give them a little moment.
          </p>

        </div>

      </CardShell>
    )
  }

  /* =========================================================== */
  /* DATA */
  /* =========================================================== */

  const mood = moodInfo[checkin.mood]

  /* =========================================================== */
  /* CARD */
  /* =========================================================== */

  return (
    <CardShell>

      <HeaderRow />


      {/* ===================================================== */}
      {/* PARTNER */}
      {/* ===================================================== */}

      <div className="mt-6">

        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
          Partner check-in
        </p>

        <div className="mt-1.5 flex items-center justify-between gap-4">

          <div className="min-w-0">

            <h2 className="truncate text-lg font-semibold tracking-[-0.035em] text-neutral-900">
              {partnerName}
            </h2>

            <p className="mt-1 text-[11px] text-neutral-400">
              Shared how they're feeling today.
            </p>

          </div>


          {/* MOOD */}

          <div>



            <img
              src={mood.image.src}
              alt={mood.label}
              className="size-23 object-contain"
            />
            <div className={`
              flex w-fit mx-auto
              items-center
              rounded-full
              justify-center
              px-2
              py-1.5
              mt-2
              ${mood.badge}
            `}>
              <p
                className={`
                text-[17px]
                font-semibold text-center
                ${mood.text}
              `}
              >
                {mood.label}
              </p>

            </div>


          </div>

        </div>

      </div>


      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <div className="mt-5 grid grid-cols-2 gap-2.5">

        <StatTile
          icon={
            <Zap
              size={12}
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
              size={12}
              strokeWidth={2.5}
              className="text-violet-500"
            />
          }
          label="Stress"
          value={checkin.stress}
        />

      </div>


      {/* ===================================================== */}
      {/* NEEDS */}
      {/* ===================================================== */}

      {checkin.needs_from_partner && (
        <div className="mt-3 rounded-xl border border-black/[0.05] bg-neutral-50/70 p-3.5">

          <div className="flex items-center gap-2">

            <div
              className="
                flex size-7
                items-center justify-center
                rounded-lg
                bg-white
                shadow-[0_1px_4px_rgba(0,0,0,0.04)]
              "
            >
              <HandHeart
                size={13}
                strokeWidth={2.2}
                className="text-pink-400"
              />
            </div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Needs from you
            </p>

          </div>

          <p className="mt-2.5 text-[12px] leading-5 text-neutral-700">
            {checkin.needs_from_partner}
          </p>

        </div>
      )}

    </CardShell>
  )
}