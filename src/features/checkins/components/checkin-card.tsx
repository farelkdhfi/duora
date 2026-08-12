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
    bg: string
  }
> = {
  happy: {
    image: happyEmot,
    label: 'Happy',
    bg: 'bg-[#34C759]/10',
  },
  neutral: {
    image: neutralEmot,
    label: 'Neutral',
    bg: 'bg-black/[0.04]',
  },
  sad: {
    image: sadEmot,
    label: 'Sad',
    bg: 'bg-[#007AFF]/10',
  },
  tired: {
    image: tiredEmot,
    label: 'Tired',
    bg: 'bg-[#AF52DE]/10',
  },
  stressed: {
    image: stressedEmot,
    label: 'Stressed',
    bg: 'bg-[#FF3B30]/10',
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
    icon: Heart,
    iconClass: 'text-[#FF3B30]',
    bgClass: 'bg-[#FF3B30]/10',
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
  const mood = moodInfo[checkin.mood]

  const date = new Date(
    `${checkin.checkin_date}T00:00:00`,
  )

  return (
    <article className="w-full max-w-xl overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] sm:p-7">
      {/* Top subtle line */}
      <div className="pointer-events-none absolute" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold tracking-[-0.01em] text-[#1C1C1E]">
            {name}
          </p>

          <p className="mt-0.5 text-[13px] text-[#8E8E93]">
            {date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Mood */}
        <div
          className={[
            'flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2',
            mood.bg,
          ].join(' ')}
        >
          <img
            src={mood.image.src}
            alt={mood.label}
            className="h-7 w-7 object-contain"
          />

          <span className="text-[12px] font-semibold text-[#1C1C1E]">
            {mood.label}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
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
        />
      </div>

      {/* Details */}
      <div className="mt-6 border-t border-black/[0.05]">
        {detailConfig
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
          .map((detail) => {
            const Icon = detail.icon

            return (
              <div
                key={detail.key}
                className="border-b border-black/[0.05] py-4 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                      detail.bgClass,
                    ].join(' ')}
                  >
                    <Icon
                      size={14}
                      strokeWidth={2.25}
                      className={detail.iconClass}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8E8E93]">
                      {detail.label}
                    </p>

                    <p className="mt-1.5 text-[14px] leading-relaxed text-[#1C1C1E]">
                      {String(detail.value)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </article>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl bg-[#F7F7F9] p-4">
      <div className="flex items-center gap-1.5">
        {icon}

        <p className="text-[12px] font-medium text-[#8E8E93]">
          {label}
        </p>
      </div>

      <p className="mt-1.5 text-[22px] font-semibold tracking-[-0.02em] tabular-nums text-[#1C1C1E]">
        {value}
        <span className="ml-0.5 text-[13px] font-medium text-[#8E8E93]">
          /10
        </span>
      </p>
    </div>
  )
}