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

/**
 * Pengaturan tinggi container & lantai.
 * - CARD_HEIGHT : tinggi total tiap container (px)
 * - HORIZON     : posisi garis horizon dalam % dari atas.
 *                 Makin kecil = lantai hitam makin tinggi.
 * - FLOOR_PX    : tinggi lantai hasil perhitungan, dipakai buat
 *                 menaruh karakter tepat di garis horizon.
 */
const CARD_HEIGHT = 200
const HORIZON = 58
const FLOOR_PX = Math.round(CARD_HEIGHT * (1 - HORIZON / 100))

function MoodCard({
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

  const mood = checkin?.mood
  const variants = checkin ? emotVariants[checkin.mood] : []

  useEffect(() => {
    if (!checkin || variants.length <= 1) return

    let swapTimeout: number | undefined

    const interval = window.setInterval(() => {
      setIsFading(true)

      swapTimeout = window.setTimeout(() => {
        setEmotIndex((current) => (current + 1) % variants.length)
        setIsFading(false)
      }, 100)
    }, 2500)

    return () => {
      window.clearInterval(interval)
      if (swapTimeout) window.clearTimeout(swapTimeout)
    }
  }, [checkin, variants.length])

  useEffect(() => {
    setEmotIndex(0)
    setIsFading(false)
  }, [checkin?.mood])

  const animatedEmot = variants[emotIndex] ?? variants[0]

  return (
    <div
      className="relative isolate flex-1 overflow-hidden rounded-[2rem] bg-black shadow-[0_20px_60px_-35px_rgba(0,0,0,0.6)]"
      style={{ height: CARD_HEIGHT }}
    >
      {/* backdrop sendiri per container: gradient di atas, lantai hitam di bawah horizon */}
      <StudioBackdrop mood={[mood, mood]} horizon={HORIZON} />

      {/* konten di area gradient (di atas lantai) */}
      <div
        className="absolute inset-x-0 top-0 flex items-end justify-center"
        style={{ bottom: FLOOR_PX }}
      >
        {!checkin ? (
          <Link
            href={isUser ? '/check-in' : '#'}
            className="group relative mb-6 flex flex-col items-center justify-center"
          >
            <div className="relative flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] backdrop-blur-sm">
              <Heart size={16} strokeWidth={1.6} className="text-pink-300" />
            </div>

            <div className="relative mt-2 flex items-center gap-1 text-[10px] text-neutral-400">
              <span>{isUser ? 'Check in' : 'Not yet'}</span>

              {isUser && (
                <ArrowUpRight
                  size={10}
                  strokeWidth={1.8}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              )}
            </div>
          </Link>
        ) : (
          // kaki karakter sedikit masuk ke lantai supaya terlihat berdiri di atasnya
          <div className="relative -mb-3 flex size-40 items-end justify-center">
            <StudioFloorShadow mood={checkin.mood} />

            <img
              key={`${checkin.id}-${checkin.mood}-${emotIndex}`}
              src={animatedEmot.src}
              alt={`${moodLabel[checkin.mood]} mood`}
              className={`relative z-10 size-25 object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)] transition-opacity duration-300 ${
                isFading ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>
        )}
      </div>

      {/* label ditaruh di lantai hitam */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center gap-0.5"
        style={{ height: FLOOR_PX }}
      >
        <p className="text-[11px] font-medium tracking-[-0.02em] text-neutral-200">
          {role}
        </p>

        {checkin && (
          <p className="text-[9px] text-neutral-500">
            {moodLabel[checkin.mood]}
          </p>
        )}
      </div>
    </div>
  )
}

export default function PartnerCheckinCard({
  userCheckin,
  partnerCheckin,
}: PartnerCheckinCardProps) {
  return (
    <div className="flex gap-3">
      <MoodCard role="You" checkin={userCheckin} isUser />
      <MoodCard role="Partner" checkin={partnerCheckin} />
    </div>
  )
}