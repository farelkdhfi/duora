'use client'

import { memo, useEffect, useState } from 'react'
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

const emotVariants: Record<Mood, typeof happyEmot1[]> = {
  happy: happyEmotVariants,
  neutral: neutralEmotVariants,
  sad: sadEmotVariants,
  tired: tiredEmotVariants,
  stressed: stressedEmotVariants,
}

const moodLabel: Record<Mood, string> = {
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  tired: 'Tired',
  stressed: 'Stressed',
}

/* -------------------------------------------------------------------------- */
/* STUDIO BACKDROP                                                            */
/* Sama dengan halaman check-in: dinding berwarna -> cove -> lantai putih.    */
/* Setiap sisi kartu (kamu / partner) punya "studio" sendiri sesuai mood.     */
/* -------------------------------------------------------------------------- */

// Titik dinding menyatu dengan lantai (% tinggi kartu).
// Naikkan/turunkan agar pas dengan "kaki" karakter.
const HORIZON = 62

type ThemeKey = Mood | 'empty'

// wall  = warna kertas backdrop
// shade = hue yang sama tapi lebih gelap, untuk falloff cahaya dan cove
const moodTheme: Record<ThemeKey, { wall: string; shade: string }> = {
  happy: { wall: '255, 220, 235', shade: '225, 130, 175' },
  neutral: { wall: '236, 238, 237', shade: '170, 175, 173' },
  sad: { wall: '190, 220, 255', shade: '90, 145, 210' },
  tired: { wall: '220, 200, 250', shade: '150, 115, 200' },
  stressed: { wall: '255, 195, 195', shade: '210, 100, 100' },
  empty: { wall: '244, 244, 243', shade: '175, 178, 176' },
}

const THEME_KEYS = Object.keys(moodTheme) as ThemeKey[]

type Stop = [position: number, alpha: number]

const rgba = (rgb: string, alpha: number) => `rgba(${rgb}, ${alpha})`

const vertical = (rgb: string, stops: Stop[], offset = 0) =>
  `linear-gradient(to bottom, ${stops.map(([position, alpha]) => `${rgba(rgb, alpha)} ${position + offset}%`).join(', ')})`

// Warna dinding memudar pelan ke lantai putih, tanpa garis potong.
const WALL_TO_FLOOR: Stop[] = [
  [0, 0.94], [10, 0.92], [20, 0.88], [30, 0.8], [40, 0.68],
  [50, 0.54], [58, 0.4], [65, 0.26], [72, 0.14], [78, 0.05], [84, 0],
]

// Cahaya meredup ke arah plafon.
const CEILING_FALLOFF: Stop[] = [[0, 0.12], [8, 0.08], [16, 0.045], [26, 0.015], [34, 0]]

// Cove: pita bayangan lembut tempat dinding melengkung ke lantai (relatif ke HORIZON).
const COVE: Stop[] = [[-26, 0], [-18, 0.025], [-10, 0.065], [-3, 0.1], [3, 0.11], [10, 0.08], [18, 0.04], [27, 0]]

// Bloom key light di dinding, tepat di atas karakter (cx = posisi horizontal %).
const keyLight = (cx: number) =>
  `radial-gradient(ellipse 36% 52% at ${cx}% 34%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.34) 28%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.04) 80%, rgba(255,255,255,0) 100%)`

// Bayangan lantai berwarna di bawah karakter.
const floorShade = (rgb: string, cx: number) =>
  `radial-gradient(ellipse 30% 14% at ${cx}% ${HORIZON + 6}%, ${rgba(rgb, 0.2)} 0%, ${rgba(rgb, 0.1)} 40%, ${rgba(rgb, 0.03)} 75%, ${rgba(rgb, 0)} 100%)`

const buildMoodBackdrop = ({ wall, shade }: { wall: string; shade: string }, cx: number) =>
  [
    floorShade(shade, cx),
    vertical(shade, COVE, HORIZON),
    vertical(shade, CEILING_FALLOFF),
    keyLight(cx),
    vertical(wall, WALL_TO_FLOOR),
  ].join(', ')

const buildBackdrops = (cx: number) =>
  Object.fromEntries(
    THEME_KEYS.map((key) => [key, buildMoodBackdrop(moodTheme[key], cx)]),
  ) as Record<ThemeKey, string>

// Dihitung sekali saja di level module.
const BACKDROPS = {
  left: buildBackdrops(25),
  right: buildBackdrops(75),
}

// Sisi kanan di-crossfade ke sisi kiri supaya tidak ada garis pemisah keras.
const RIGHT_BLEND = 'linear-gradient(to right, transparent 38%, #000 62%)'

// Cahaya studio miring dari kiri atas.
const SIDE_LIGHT = 'linear-gradient(112deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.2) 26%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 68%)'

const LIGHT_CONE = 'conic-gradient(from 0deg at -10% -16%, rgba(255,255,255,0) 104deg, rgba(255,255,255,0.05) 114deg, rgba(255,255,255,0.13) 124deg, rgba(255,255,255,0.22) 134deg, rgba(255,255,255,0.26) 141deg, rgba(255,255,255,0.21) 149deg, rgba(255,255,255,0.11) 160deg, rgba(255,255,255,0.04) 171deg, rgba(255,255,255,0) 182deg)'

const FADE_BEFORE_FLOOR = 'linear-gradient(to bottom, #000 0%, #000 40%, transparent 80%)'

const LIGHT_FALLOFF = 'linear-gradient(292deg, rgba(24,24,32,0.05) 0%, rgba(24,24,32,0.022) 30%, rgba(24,24,32,0) 55%)'
const VIGNETTE = 'radial-gradient(ellipse 85% 75% at 50% 44%, rgba(24,24,32,0) 50%, rgba(24,24,32,0.026) 78%, rgba(24,24,32,0.052) 100%)'

const SOFT_SHADOW = 'radial-gradient(ellipse closest-side, rgba(24,24,32,0.075) 0%, rgba(24,24,32,0.04) 45%, rgba(24,24,32,0.012) 78%, rgba(24,24,32,0) 100%)'
const CONTACT_SHADOW = 'radial-gradient(ellipse closest-side, rgba(24,24,32,0.3) 0%, rgba(24,24,32,0.14) 48%, rgba(24,24,32,0.03) 80%, rgba(24,24,32,0) 100%)'

// Film grain halus: menyamarkan banding gradient dan memberi kesan matte.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`

const StudioWall = memo(function StudioWall({
  mood,
  side,
}: {
  mood?: Mood
  side: 'left' | 'right'
}) {
  const active: ThemeKey = mood && mood in moodTheme ? mood : 'empty'
  const mask = side === 'right' ? RIGHT_BLEND : undefined

  return (
    <div
      className="absolute inset-0"
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      {THEME_KEYS.map((key) => (
        <div
          key={key}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ background: BACKDROPS[side][key], opacity: key === active ? 1 : 0 }}
        />
      ))}
    </div>
  )
})

const CardStudio = memo(function CardStudio({
  userMood,
  partnerMood,
}: {
  userMood?: Mood
  partnerMood?: Mood
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      {/* DINDING + COVE + LANTAI: kiri = kamu, kanan = partner */}
      <StudioWall mood={userMood} side="left" />
      <StudioWall mood={partnerMood} side="right" />

      {/* CAHAYA STUDIO MIRING (memudar sebelum lantai) */}
      <div
        className="absolute inset-0"
        style={{
          background: `${LIGHT_CONE}, ${SIDE_LIGHT}`,
          maskImage: FADE_BEFORE_FLOOR,
          WebkitMaskImage: FADE_BEFORE_FLOOR,
        }}
      />

      {/* FALLOFF + VIGNETTE */}
      <div className="absolute inset-0" style={{ background: `${VIGNETTE}, ${LIGHT_FALLOFF}` }} />

      {/* FILM GRAIN */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: GRAIN }} />

      {/* GARIS PEMISAH TENGAH: putih, nyambung dari tepi atas sampai tepi bawah kartu.
          Ada outline + glow tipis supaya tetap kelihatan di area lantai yang putih. */}
      <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-white" />
    </div>
  )
})

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
    <div className="relative isolate overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.18)]">
      <CardStudio userMood={userMood} partnerMood={partnerMood} />

      {/* padding bawah ekstra supaya ada ruang "lantai" di bawah karakter */}
      <div className="relative p-5 pb-7 sm:p-6 sm:pb-8">
        {children}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* BAYANGAN LANTAI                                                            */
/* 3 lapis: halo berwarna, penumbra lembut, dan contact shadow yang rapat.    */
/* Sedikit digeser ke kanan karena cahaya datang dari kiri atas.              */
/* -------------------------------------------------------------------------- */

function FloorShadow({ shade }: { shade: string }) {
  const layers = [
    {
      width: 124,
      height: 30,
      dx: 9,
      background: `radial-gradient(ellipse closest-side, ${rgba(shade, 0.26)} 0%, ${rgba(shade, 0.12)} 45%, ${rgba(shade, 0.03)} 78%, ${rgba(shade, 0)} 100%)`,
    },
    { width: 96, height: 20, dx: 6, background: SOFT_SHADOW },
    { width: 50, height: 10, dx: 2, background: CONTACT_SHADOW },
  ]

  return (
    <>
      {layers.map(({ width, height, dx, background }) => (
        <div
          key={width}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2"
          style={{
            width,
            height,
            background,
            // pusat elips tepat di tepi bawah kotak karakter (ubah bottom untuk menyesuaikan dengan kaki)
            transform: `translate(calc(-50% + ${dx}px), 50%)`,
          }}
        />
      ))}
    </>
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

  const animatedEmot = variants[emotIndex] ?? variants[0]
  const { shade } = moodTheme[checkin.mood]

  return (
    <div className="relative flex min-h-[132px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] px-4 py-4">
      <p className="relative mb-2 text-[11px] font-medium tracking-[-0.02em] text-neutral-600">
        {role}
      </p>

      <div className="relative flex size-[80px] items-center justify-center">
        <FloorShadow shade={shade} />

        <img
          key={`${checkin.id}-${checkin.mood}-${emotIndex}`}
          src={animatedEmot.src}
          alt={`${moodLabel[checkin.mood]} mood`}
          className={`relative z-10 size-56 object-contain drop-shadow-[0_6px_6px_rgba(24,24,32,0.08)] transition-opacity duration-350 ${isFading ? 'opacity-0' : 'opacity-100'}`}
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
            <h2 className="text-sm font-medium tracking-[-0.055em] text-neutral-800">
              How are you two?
            </h2>

            <p className="mt-1 text-[11px] text-neutral-500">
              A little glimpse of today.
            </p>
          </div>

          <Link
            href="/check-in"
            aria-label="Open check-in"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-neutral-500 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-neutral-900 hover:text-white"
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