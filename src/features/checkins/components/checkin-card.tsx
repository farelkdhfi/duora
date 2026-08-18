'use client'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import sadEmot from '@/assets/emoticon/sad-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'

import type {
  DailyCheckin,
  Mood,
} from '../types'

interface CheckinCardProps {
  checkin: DailyCheckin
  name: string
}

const moodInfo: Record<
  Mood,
  {
    image: typeof happyEmot
    label: string
    background: string
    border: string
    glow: string
    text: string
    accent: string
  }
> = {
  happy: {
    image: happyEmot,
    label: 'Happy',
    background: 'bg-amber-50/80',
    border: 'border-amber-200/50',
    glow: 'bg-amber-300/[0.12]',
    text: 'text-amber-700',
    accent: 'bg-amber-400',
  },

  neutral: {
    image: neutralEmot,
    label: 'Neutral',
    background: 'bg-neutral-100/80',
    border: 'border-neutral-200/70',
    glow: 'bg-neutral-300/[0.12]',
    text: 'text-neutral-600',
    accent: 'bg-neutral-500',
  },

  sad: {
    image: sadEmot,
    label: 'Sad',
    background: 'bg-blue-50/80',
    border: 'border-blue-200/50',
    glow: 'bg-blue-400/[0.10]',
    text: 'text-blue-700',
    accent: 'bg-blue-500',
  },

  tired: {
    image: tiredEmot,
    label: 'Tired',
    background: 'bg-violet-50/80',
    border: 'border-violet-200/50',
    glow: 'bg-violet-400/[0.10]',
    text: 'text-violet-700',
    accent: 'bg-violet-500',
  },

  stressed: {
    image: stressedEmot,
    label: 'Stressed',
    background: 'bg-rose-50/80',
    border: 'border-rose-200/50',
    glow: 'bg-rose-400/[0.10]',
    text: 'text-rose-700',
    accent: 'bg-rose-500',
  },
}

const detailConfig = [
  {
    key: 'liked_today',
    label: 'Liked today',
  },
  {
    key: 'disliked_today',
    label: "Didn't like today",
  },
  {
    key: 'needs_from_partner',
    label: 'Needs from partner',
  },
  {
    key: 'note',
    label: 'Note',
  },
] as const

export default function CheckinCard({
  checkin,
  name,
}: CheckinCardProps) {
  const mood =
    moodInfo[checkin.mood] ??
    moodInfo.neutral

  const date = new Date(
    `${checkin.checkin_date}T00:00:00`,
  )

  const details = detailConfig
    .map((detail) => {
      const value =
        checkin[
          detail.key as keyof DailyCheckin
        ]

      return {
        ...detail,
        value,
      }
    })
    .filter((detail) => Boolean(detail.value))

  return (
    <article
      className="
        relative
        w-full
        overflow-hidden
        rounded-[1.75rem]
        border border-black/[0.05]
        bg-white
        shadow-[0_25px_70px_-40px_rgba(0,0,0,0.22)]
        transition-shadow
        duration-300
        hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.28)]
        sm:rounded-[2rem]
      "
    >
      {/* Mood accent */}

      <div
        className={`
          absolute
          inset-x-0
          top-0
          h-1
          ${mood.accent}
        `}
      />

      {/* Ambient glow */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-24
          -top-24
          size-64
          rounded-full
          blur-[110px]
          ${mood.glow}
        `}
      />

      <div className="relative p-5 sm:p-7 lg:p-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div className="min-w-0">

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
              Daily check-in
            </p>

            <div className="mt-2 flex items-baseline gap-2.5">
              <h2
                className="
                  truncate
                  text-[18px]
                  font-semibold
                  tracking-[-0.04em]
                  text-neutral-900
                  sm:text-xl
                "
              >
                {name}
              </h2>

              <span className="shrink-0 text-[10px] text-neutral-300">
                /
              </span>

              <time
                dateTime={checkin.checkin_date}
                className="shrink-0 text-[10px] font-medium text-neutral-400 sm:text-[11px]"
              >
                {date.toLocaleDateString(
                  'id-ID',
                  {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  },
                )}
              </time>
            </div>

          </div>


          {/* Mood */}

          <div
            className={`
              flex
              w-fit
              items-center
              gap-2.5
              rounded-full
              border
              px-3
              py-1.5
              ${mood.background}
              ${mood.border}
            `}
          >
            <img
              src={mood.image.src}
              alt=""
              className="size-6 object-contain"
            />

            <span
              className={`
                text-[10px]
                font-semibold
                ${mood.text}
              `}
            >
              {mood.label}
            </span>
          </div>
        </header>


        {/* ================================================= */}
        {/* INTRO */}
        {/* ================================================= */}

        <div className="mt-8 sm:mt-9">

          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
            A glimpse into their day
          </p>

          <p
            className="
              mt-2
              max-w-lg
              text-[15px]
              leading-6
              tracking-[-0.02em]
              text-neutral-500
              sm:text-[16px]
            "
          >
            Here's how they were feeling,
            and what was on their mind today.
          </p>

        </div>


        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div
          className="
            mt-7
            grid
            grid-cols-1
            gap-2.5
            sm:grid-cols-2
          "
        >
          <StatCard
            label="Energy"
            value={checkin.energy}
            progressClass="bg-neutral-900"
          />

          <StatCard
            label="Stress"
            value={checkin.stress}
            progressClass="bg-neutral-400"
          />
        </div>


        {/* ================================================= */}
        {/* REFLECTIONS */}
        {/* ================================================= */}

        {details.length > 0 && (
          <section className="mt-8">

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-black/[0.05]
                pb-3
              "
            >
              <p className="text-[11px] font-semibold tracking-[-0.01em] text-neutral-700">
                Reflection
              </p>

              <span className="text-[9px] uppercase tracking-[0.14em] text-neutral-300">
                {details.length}{' '}
                {details.length === 1
                  ? 'entry'
                  : 'entries'}
              </span>
            </div>


            <div className="divide-y divide-black/[0.045]">

              {details.map((detail) => (
                <div
                  key={detail.key}
                  className="
                    py-4
                    first:pt-4
                    last:pb-1
                    sm:py-5
                  "
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                    {detail.label}
                  </p>

                  <p
                    className="
                      mt-2
                      break-words
                      text-[12.5px]
                      leading-[1.7]
                      text-neutral-600
                      sm:text-[13px]
                    "
                  >
                    {String(detail.value)}
                  </p>
                </div>
              ))}

            </div>

          </section>
        )}


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div
          className="
            mt-7
            border-t
            border-black/[0.045]
            pt-4
          "
        >
          <p className="text-center text-[9px] font-medium tracking-[0.01em] text-neutral-300">
            Understanding each other, one day at a time.
          </p>
        </div>

      </div>
    </article>
  )
}


/* ============================================================= */
/* STAT CARD */
/* ============================================================= */

function StatCard({
  label,
  value,
  progressClass,
}: {
  label: string
  value: number
  progressClass: string
}) {
  const percentage =
    Math.min(Math.max(value, 0), 10) * 10

  return (
    <div
      className="
        rounded-[1.25rem]
        border
        border-black/[0.045]
        bg-neutral-50/70
        px-4
        py-4
        sm:px-5
        sm:py-[18px]
      "
    >
      <div className="flex items-center justify-between gap-4">

        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {label}
        </p>

        <p className="text-[13px] font-semibold tabular-nums tracking-[-0.02em] text-neutral-700">
          {value}
          <span className="ml-0.5 text-[10px] font-medium text-neutral-300">
            /10
          </span>
        </p>

      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-200/80">
        <div
          className={`
            h-full
            rounded-full
            transition-all
            duration-500
            ${progressClass}
          `}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  )
}