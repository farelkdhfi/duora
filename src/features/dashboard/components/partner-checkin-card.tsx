'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Heart } from 'lucide-react'

import happyEmot1 from '@/assets/emoticon/happy-fluffy.webp'
import happyEmot2 from '@/assets/emoticon/happy-fluffy-2.webp'
import happyEmot3 from '@/assets/emoticon/happy-fluffy-3.webp'

import neutralEmot1 from '@/assets/emoticon/neutral-fluffy.webp'
import neutralEmot2 from '@/assets/emoticon/neutral-fluffy-2.webp'
import neutralEmot3 from '@/assets/emoticon/neutral-fluffy-3.webp'

import sadEmot1 from '@/assets/emoticon/sad-fluffy.webp'
import sadEmot2 from '@/assets/emoticon/sad-fluffy-2.webp'
import sadEmot3 from '@/assets/emoticon/sad-fluffy-3.webp'

import tiredEmot1 from '@/assets/emoticon/tired-fluffy.webp'
import tiredEmot2 from '@/assets/emoticon/tired-fluffy-2.webp'
import tiredEmot3 from '@/assets/emoticon/tired-fluffy-3.webp'

import stressedEmot1 from '@/assets/emoticon/stressed-fluffy.webp'
import stressedEmot2 from '@/assets/emoticon/stressed-fluffy-2.webp'
import stressedEmot3 from '@/assets/emoticon/stressed-fluffy-3.webp'

import type { DailyCheckin, Mood } from '@/features/checkins/types'

interface PartnerCheckinCardProps {
  userCheckin: DailyCheckin | null
  partnerCheckin: DailyCheckin | null
  userName: string
  partnerName: string
}

const happyEmotVariants = [
  happyEmot1,
  happyEmot2,
  happyEmot3,
]

const neutralEmotVariants = [
  neutralEmot1,
  neutralEmot2,
  neutralEmot3,
]

const sadEmotVariants = [
  sadEmot1,
  sadEmot2,
  sadEmot3,
]

const tiredEmotVariants = [
  tiredEmot1,
  tiredEmot2,
  tiredEmot3,
]

const stressedEmotVariants = [
  stressedEmot1,
  stressedEmot2,
  stressedEmot3,
]

const moodInfo: Record<
  Mood,
  {
    image: typeof happyEmot1
    badge: string
    text: string
    glow: string
  }
> = {
  happy: {
    image: happyEmot1,
    badge: 'bg-emerald-50/80',
    text: 'text-emerald-600',
    glow: 'bg-emerald-100/40',
  },

  neutral: {
    image: neutralEmot1,
    badge: 'bg-neutral-100/80',
    text: 'text-neutral-500',
    glow: 'bg-neutral-100/50',
  },

  sad: {
    image: sadEmot1,
    badge: 'bg-blue-50/80',
    text: 'text-blue-500',
    glow: 'bg-blue-100/40',
  },

  tired: {
    image: tiredEmot1,
    badge: 'bg-violet-50/80',
    text: 'text-violet-500',
    glow: 'bg-violet-100/35',
  },

  stressed: {
    image: stressedEmot1,
    badge: 'bg-rose-50/80',
    text: 'text-rose-500',
    glow: 'bg-rose-100/35',
  },
}

const emotVariants: Record<Mood, typeof happyEmot1[]> = {
  happy: happyEmotVariants,
  neutral: neutralEmotVariants,
  sad: sadEmotVariants,
  tired: tiredEmotVariants,
  stressed: stressedEmotVariants,
}

function CardShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.045] bg-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.18)]">
      <svg
        className="pointer-events-none absolute -right-20 -top-28 h-[330px] w-[430px] opacity-[0.8]"
        viewBox="0 0 430 330"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M450 42C390 5 313 12 276 66C241 116 263 157 221 190C185 218 116 196 83 239C55 275 79 314 121 342"
          stroke="#e9a8bd"
          strokeOpacity=".28"
          strokeWidth="1.2"
        />

        <path
          d="M456 66C394 31 331 42 302 87C275 129 294 160 260 185C220 214 157 202 120 238C91 266 102 301 135 326"
          stroke="#9eb9df"
          strokeOpacity=".3"
          strokeWidth="1.2"
        />

        <path
          d="M442 91C399 66 352 69 328 104C306 137 318 159 293 181C263 207 212 207 180 232C150 255 151 287 174 311"
          stroke="#e9a8bd"
          strokeOpacity=".18"
          strokeWidth="1"
          strokeDasharray="2 7"
        />

        <circle
          cx="335"
          cy="102"
          r="3"
          fill="#9eb9df"
          fillOpacity=".55"
        />

        <circle
          cx="276"
          cy="184"
          r="2.5"
          fill="#e9a8bd"
          fillOpacity=".6"
        />

        <circle
          cx="175"
          cy="232"
          r="2"
          fill="#9eb9df"
          fillOpacity=".5"
        />
      </svg>

      <svg
        className="pointer-events-none absolute -bottom-28 -left-20 h-[220px] w-[300px] opacity-[0.65]"
        viewBox="0 0 300 220"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-20 181C37 153 72 161 103 189C134 217 170 229 209 203C246 178 253 135 316 111"
          stroke="#9eb9df"
          strokeOpacity=".22"
          strokeWidth="1.1"
        />

        <path
          d="M-17 157C36 135 73 140 104 166C136 193 171 204 207 180C242 156 252 117 311 94"
          stroke="#e9a8bd"
          strokeOpacity=".22"
          strokeWidth="1.1"
        />

        <circle
          cx="103"
          cy="166"
          r="2.5"
          fill="#e9a8bd"
          fillOpacity=".55"
        />

        <circle
          cx="207"
          cy="180"
          r="2"
          fill="#9eb9df"
          fillOpacity=".55"
        />
      </svg>

      <svg
        className="pointer-events-none absolute right-8 top-8 size-16 opacity-[0.45]"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r="23"
          stroke="#171717"
          strokeOpacity=".07"
        />

        <circle
          cx="32"
          cy="32"
          r="17"
          stroke="#e9a8bd"
          strokeOpacity=".3"
          strokeDasharray="2 6"
        />

        <circle
          cx="32"
          cy="32"
          r="10"
          stroke="#9eb9df"
          strokeOpacity=".28"
        />

        <circle
          cx="48"
          cy="21"
          r="2"
          fill="#e9a8bd"
        />

        <circle
          cx="20"
          cy="46"
          r="1.7"
          fill="#9eb9df"
        />
      </svg>

      <div className="relative p-5 sm:p-6">
        {children}
      </div>
    </div>
  )
}

function MoodItem({
  role,
  checkin,
  isUser,
}: {
  role: 'You' | 'Partner'
  checkin: DailyCheckin | null
  isUser?: boolean
}) {
  const [emotIndex, setEmotIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  const variants = checkin
    ? emotVariants[checkin.mood]
    : []

  useEffect(() => {
    if (!checkin || variants.length <= 1) return

    const interval = window.setInterval(() => {
      setIsFading(true)

      window.setTimeout(() => {
        setEmotIndex((current) => (current + 1) % variants.length)
        setIsFading(false)
      }, 100)
    }, 2500)

    return () => {
      window.clearInterval(interval)
    }
  }, [checkin, variants.length])

  useEffect(() => {
    setEmotIndex(0)
    setIsFading(false)
  }, [checkin?.mood])

  if (!checkin) {
    return (
      <Link
        href={isUser ? '/check-in' : '#'}
        className="group relative flex min-h-[132px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[1.5rem]"
      >
        <svg
          className="pointer-events-none absolute -right-6 -top-6 size-20 opacity-50"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="40"
            cy="40"
            r="27"
            stroke="#e9a8bd"
            strokeOpacity=".2"
          />

          <circle
            cx="40"
            cy="40"
            r="20"
            stroke="#9eb9df"
            strokeOpacity=".18"
            strokeDasharray="2 6"
          />
        </svg>

        <div className="relative flex size-12 items-center justify-center rounded-full border border-black/[0.04] bg-white shadow-[0_8px_20px_-14px_rgba(0,0,0,0.25)]">
          <Heart
            size={16}
            strokeWidth={1.6}
            className="text-pink-300"
          />
        </div>

        <p className="relative mt-3 text-[11px] font-medium tracking-[-0.02em] text-neutral-500">
          {role}
        </p>

        <div className="relative mt-1 flex items-center gap-1 text-[9px] text-neutral-300">
          <span>{isUser ? 'Check in' : 'Not yet'}</span>

          {isUser && (
            <ArrowUpRight
              size={10}
              strokeWidth={1.8}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )}
        </div>
      </Link>
    )
  }

  const mood = moodInfo[checkin.mood]
  const animatedEmot = variants[emotIndex] ?? variants[0]

  return (
    <div className="relative flex min-h-[132px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] px-4 py-4">
      <div
        className={`absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${mood.glow}`}
      />

      <p className="relative mb-2 text-[11px] font-medium tracking-[-0.02em] text-neutral-600">
        {role}
      </p>

      <div className="relative flex size-[80px] items-center justify-center">
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#171717"
            strokeOpacity=".045"
          />

          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e9a8bd"
            strokeOpacity=".16"
            strokeDasharray="2 8"
          />

          <circle
            cx="14"
            cy="30"
            r="2"
            fill="#e9a8bd"
            fillOpacity=".55"
          />

          <circle
            cx="83"
            cy="68"
            r="1.8"
            fill="#9eb9df"
            fillOpacity=".6"
          />
        </svg>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-full bg-black/40 blur-[7px]" />

        <img
          key={`${checkin.id}-${checkin.mood}-${emotIndex}`}
          src={animatedEmot.src}
          alt={`${mood.text} mood`}
          className={`relative z-10 size-56 object-contain drop-shadow-[0_10px_8px_rgba(0,0,0,0.10)] transition-opacity duration-350 ${isFading ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
    </div>
  )
}

export default function PartnerCheckinCard({
  userCheckin,
  partnerCheckin,
  userName,
  partnerName,
}: PartnerCheckinCardProps) {
  return (
    <CardShell>
      <div className="relative">
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium tracking-[-0.055em] text-neutral-800">
              How are you two?
            </h2>

            <p className="mt-1 text-[11px] text-neutral-400">
              A little glimpse of today.
            </p>
          </div>

          <Link href="/check-in" aria-label="Open check-in" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-neutral-500 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-neutral-900 hover:text-white">
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </Link>
        </div>
      </div>

      <div className="relative mt-5 flex gap-2.5">
        <div className="pointer-events-none absolute bottom-4 left-1/2 top-4 z-10 w-[1px] rounded-full bg-neutral-400" />

        <MoodItem
          role="You"
          checkin={userCheckin}
          isUser
        />

        <MoodItem
          role="Partner"
          checkin={partnerCheckin}
        />
      </div>
    </CardShell>
  )
}