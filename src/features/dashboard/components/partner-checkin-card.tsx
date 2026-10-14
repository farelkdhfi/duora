'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Heart } from 'lucide-react'

import { StudioBackdrop, StudioFloorShadow } from '@/components/ui/studio-backdrop'

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

const emotVariants: Record<Mood, typeof happyEmot1[]> = {
  happy: [happyEmot1, happyEmot2, happyEmot3],
  neutral: [neutralEmot1, neutralEmot2, neutralEmot3],
  sad: [sadEmot1, sadEmot2, sadEmot3],
  tired: [tiredEmot1, tiredEmot2, tiredEmot3],
  stressed: [stressedEmot1, stressedEmot2, stressedEmot3],
}

const moodLabel: Record<Mood, string> = {
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  tired: 'Tired',
  stressed: 'Stressed',
}

function CardShell({
  children,
  userMood,
  partnerMood,
}: {
  children: React.ReactNode
  userMood?: Mood
  partnerMood?: Mood
}) {
  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#0a0a0c] shadow-[0_20px_60px_-35px_rgba(0,0,0,0.6)]">
      {/* split: kiri = kamu, kanan = partner. horizon 62 supaya pas dengan kaki karakter */}
      <StudioBackdrop mood={[userMood, partnerMood]} horizon={62} />

      {/* padding bawah ekstra supaya ada ruang "lantai" di bawah karakter */}
      <div className="relative p-5 pb-7 sm:p-6 sm:pb-8">
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

        <div className="relative flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] backdrop-blur-sm">
          <Heart
            size={16}
            strokeWidth={1.6}
            className="text-pink-300"
          />
        </div>

        <p className="relative mt-3 text-[11px] font-medium tracking-[-0.02em] text-neutral-300">
          {role}
        </p>

        <div className="relative mt-1 flex items-center gap-1 text-[9px] text-neutral-500">
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

  const animatedEmot = variants[emotIndex] ?? variants[0]

  return (
    <div className="relative flex min-h-[132px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] px-4 py-4">
      <p className="relative mb-2 text-[11px] font-medium tracking-[-0.02em] text-neutral-300">
        {role}
      </p>

      <div className="relative flex size-[80px] items-center justify-center">
        <StudioFloorShadow mood={checkin.mood} />

        <img
          key={`${checkin.id}-${checkin.mood}-${emotIndex}`}
          src={animatedEmot.src}
          alt={`${moodLabel[checkin.mood]} mood`}
          className={`relative z-10 size-56 object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)] transition-opacity duration-350 ${isFading ? 'opacity-0' : 'opacity-100'}`}
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
    <CardShell
      userMood={userCheckin?.mood}
      partnerMood={partnerCheckin?.mood}
    >
      <div className="relative">
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium tracking-[-0.055em] text-neutral-50">
              How are you two?
            </h2>

            <p className="mt-1 text-[11px] text-neutral-400">
              A little glimpse of today.
            </p>
          </div>

          <Link
            href="/check-in"
            aria-label="Open check-in"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/10 text-neutral-300 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900"
          >
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </Link>
        </div>
      </div>

      <div className="relative mt-5 flex gap-2.5">
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