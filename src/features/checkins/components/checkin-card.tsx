'use client'

import {
  Brain,
  Heart,
  HandHeart,
  Zap,
  MessageCircle,
} from 'lucide-react'

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
  }
> = {
  happy: {
    image: happyEmot,
    label: 'Happy',
    background: 'bg-[#FFF8E7]',
    border: 'border-[#FFD166]/35',
    glow: 'bg-[#FFD166]/20',
    text: 'text-[#D98200]',
  },

  neutral: {
    image: neutralEmot,
    label: 'Neutral',
    background: 'bg-[#F5F5F7]',
    border: 'border-neutral-200',
    glow: 'bg-neutral-200/40',
    text: 'text-neutral-600',
  },

  sad: {
    image: sadEmot,
    label: 'Sad',
    background: 'bg-[#F0F4FF]',
    border: 'border-[#5A7FBF]/25',
    glow: 'bg-[#5A7FBF]/15',
    text: 'text-[#4A5FA8]',
  },

  tired: {
    image: tiredEmot,
    label: 'Tired',
    background: 'bg-[#F5F2FA]',
    border: 'border-[#9B8AC4]/30',
    glow: 'bg-[#9B8AC4]/15',
    text: 'text-[#7A6FB0]',
  },

  stressed: {
    image: stressedEmot,
    label: 'Stressed',
    background: 'bg-[#FFF1F1]',
    border: 'border-[#D62E2E]/25',
    glow: 'bg-[#D62E2E]/12',
    text: 'text-[#B0201F]',
  },
}

const detailConfig = [
  {
    key: 'liked_today',
    label: 'Liked today',
    icon: Heart,
    iconClass: 'text-[#FF3B5C]',
    bgClass: 'bg-[#FF6B8A]/10',
  },
  {
    key: 'disliked_today',
    label: "Didn't like today",
    icon: MessageCircle,
    iconClass: 'text-[#D62E2E]',
    bgClass: 'bg-[#D62E2E]/10',
  },
  {
    key: 'needs_from_partner',
    label: 'Needs from partner',
    icon: HandHeart,
    iconClass: 'text-[#007AFF]',
    bgClass: 'bg-[#007AFF]/10',
  },
  {
    key: 'note',
    label: 'Note',
    icon: MessageCircle,
    iconClass: 'text-[#8E8E93]',
    bgClass: 'bg-black/[0.04]',
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
        rounded-[26px]
        border border-black/[0.05]
        bg-white
        shadow-[0_18px_45px_-28px_rgba(0,0,0,0.18)]
        sm:rounded-[30px]
      "
    >
      {/* ===================================================== */}
      {/* MOOD AMBIENT */}
      {/* ===================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-20
          -top-20
          size-52
          rounded-full
          blur-[80px]
          ${mood.glow}
        `}
      />

      <div
        className={`
          pointer-events-none
          absolute
          -bottom-24
          -left-20
          size-44
          rounded-full
          blur-[80px]
          opacity-60
          ${mood.glow}
        `}
      />

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <div className="relative p-5 sm:p-7">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between gap-4">

          {/* User */}

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <div className="flex size-8 shrink-0 items-center justify-center rounded-[11px] bg-neutral-900 text-white shadow-sm">

                <Heart
                  size={13}
                  strokeWidth={2.3}
                  fill="currentColor"
                />

              </div>

              <div className="min-w-0">

                <p className="truncate text-[14px] font-semibold tracking-[-0.02em] text-neutral-900 sm:text-[15px]">
                  {name}
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-neutral-400 sm:text-[11px]">
                  {date.toLocaleDateString(
                    'id-ID',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    },
                  )}
                </p>

              </div>

            </div>

          </div>


          {/* Mood */}

          <div
            className={`
              relative
              flex
              shrink-0
              items-center
              gap-2
              overflow-hidden
              rounded-[16px]
              border
              px-2.5
              py-1.5
              ${mood.background}
              ${mood.border}
            `}
          >

            <div
              className={`
                pointer-events-none
                absolute
                -right-4
                -top-5
                size-10
                rounded-full
                blur-xl
                ${mood.glow}
              `}
            />

            <img
              src={mood.image.src}
              alt={mood.label}
              className="
                relative
                size-7
                object-contain
                sm:size-8
              "
            />

            <span
              className={`
                relative
                text-[10px]
                font-semibold
                sm:text-[11px]
                ${mood.text}
              `}
            >
              {mood.label}
            </span>

          </div>

        </div>


        {/* ================================================= */}
        {/* MOOD INTRO */}
        {/* ================================================= */}

        <div className="mt-6">

          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
            Today's check-in
          </p>

          <h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.035em] text-neutral-800 sm:text-[19px]">
            A little window into their day.
          </h2>

        </div>


        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">

          <StatCard
            icon={
              <Zap
                size={14}
                strokeWidth={2.5}
                className="text-[#FF9500]"
              />
            }
            label="Energy"
            value={checkin.energy}
            progressClass="bg-[#FF9500]"
          />

          <StatCard
            icon={
              <Brain
                size={14}
                strokeWidth={2.5}
                className="text-[#AF52DE]"
              />
            }
            label="Stress"
            value={checkin.stress}
            progressClass="bg-[#AF52DE]"
          />

        </div>


        {/* ================================================= */}
        {/* REFLECTIONS */}
        {/* ================================================= */}

        {details.length > 0 && (

          <div className="mt-6">

            <div className="mb-3 flex items-center gap-2">

              <div className="h-px flex-1 bg-black/[0.05]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Reflection
              </span>

              <div className="h-px flex-1 bg-black/[0.05]" />

            </div>


            <div className="space-y-2.5">

              {details.map((detail) => {

                const Icon = detail.icon

                return (
                  <div
                    key={detail.key}
                    className="
                      group
                      rounded-[18px]
                      border
                      border-black/[0.04]
                      bg-neutral-50/70
                      p-3.5
                      transition-all
                      duration-200
                      hover:border-black/[0.06]
                      hover:bg-neutral-50
                    "
                  >

                    <div className="flex items-start gap-3">

                      {/* Icon */}

                      <div
                        className={`
                          flex
                          size-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-[11px]
                          ${detail.bgClass}
                        `}
                      >

                        <Icon
                          size={14}
                          strokeWidth={2.25}
                          className={detail.iconClass}
                        />

                      </div>


                      {/* Content */}

                      <div className="min-w-0 flex-1">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-neutral-400">
                          {detail.label}
                        </p>

                        <p className="mt-1.5 break-words text-[12.5px] leading-[1.65] text-neutral-700 sm:text-[13px]">
                          {String(detail.value)}
                        </p>

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="mt-6 flex items-center justify-center gap-1.5">

          <Heart
            size={10}
            strokeWidth={2}
            className="text-pink-300"
            fill="currentColor"
          />

          <p className="text-[9px] font-medium text-neutral-300">
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
  icon,
  label,
  value,
  progressClass,
}: {
  icon: React.ReactNode
  label: string
  value: number
  progressClass: string
}) {
  const percentage =
    Math.min(Math.max(value, 0), 10) * 10

  return (
    <div
      className="
        rounded-[18px]
        border border-black/[0.04]
        bg-neutral-50/80
        p-3.5
        sm:p-4
      "
    >

      <div className="flex items-center justify-between gap-2">

        <div className="flex items-center gap-1.5">

          {icon}

          <p className="text-[10px] font-medium text-neutral-400 sm:text-[11px]">
            {label}
          </p>

        </div>

        <span className="text-[11px] font-semibold tabular-nums text-neutral-500">
          {value}
          <span className="font-medium text-neutral-300">
            /10
          </span>
        </span>

      </div>


      {/* Progress */}

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200/70">

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