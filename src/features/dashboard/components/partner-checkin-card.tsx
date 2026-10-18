'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
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
  checkins: DailyCheckin[] | undefined
  userId: string | undefined
}

/* ========================================================= */
/* DATA & KONSTANTA */
/* ========================================================= */

const emotVariants: Record<Mood, (typeof happyEmot1)[]> = {
  happy: [happyEmot1, happyEmot2, happyEmot3],
  neutral: [neutralEmot1, neutralEmot2, neutralEmot3],
  sad: [sadEmot1, sadEmot2, sadEmot3],
  tired: [tiredEmot1, tiredEmot2, tiredEmot3],
  stressed: [stressedEmot1, stressedEmot2, stressedEmot3],
}


/** Warna per mood: accent dipakai bar & ring, glow dipakai di belakang avatar. */
const moodTheme: Record<Mood, { accent: string; glow: string }> = {
  neutral: { accent: '#ffffff', glow: 'rgba(255,255,255,0.20)' },
  happy: { accent: '#f472b6', glow: 'rgba(244,114,182,0.34)' },
  stressed: { accent: '#ef4444', glow: 'rgba(239,68,68,0.38)' },
  tired: { accent: '#a855f7', glow: 'rgba(168,85,247,0.36)' },
  sad: { accent: '#3b82f6', glow: 'rgba(59,130,246,0.34)' },
}

const emptyTheme = { accent: '#52525b', glow: 'rgba(255,255,255,0.05)' }

const getTheme = (mood?: Mood) => (mood ? moodTheme[mood] : emptyTheme)

/** Skala energy & stress. Ubah kalau form check-in kamu bukan 1-10. */
const MAX_SCORE = 10

/** Hari yang ditampilkan: Now + 6 hari ke belakang = seminggu terakhir. */
const DAYS = 7
const MAX_INDEX = DAYS - 1

/* Geometri dial (px).
 * Lingkaran besar tapi hanya puncaknya yang kelihatan, jadi busurnya landai.
 * Kecilkan WHEEL_SIZE kalau mau busur lebih melengkung,
 * besarkan kalau mau lebih datar. */
const WHEEL_SIZE = 700
const RADIUS = WHEEL_SIZE / 2
const RING = 22
const ITEM_GAP = 58 // jarak antar hari sepanjang busur (px)
const STEP_DEG = (ITEM_GAP / RADIUS) * (180 / Math.PI)
const PX_PER_STEP = ITEM_GAP // geser 58px = pindah 1 hari
const WHEEL_TOP = 26 // jarak puncak ring dari atas area dial
const VIEW_HEIGHT = 100 // tinggi area dial yang kelihatan
const LABEL_RADIUS = RADIUS + 14
const DOT_RADIUS = RADIUS - RING / 2
const GRADIENT_HALF = 180 // setengah lebar bagian ring yang kelihatan


const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/** YYYY-MM-DD memakai tanggal lokal (bukan UTC) supaya tidak geser hari di WIB. */
function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

type DayEntry = {
  key: string
  label: string
  fullLabel: string
  user: DailyCheckin | null
  partner: DailyCheckin | null
}

/* ========================================================= */
/* KOMPONEN KECIL */
/* ========================================================= */

function StatBar({
  label,
  value,
  color,
}: {
  label: string
  value: number | null
  color: string
}) {
  const pct = value == null ? 0 : clamp((value / MAX_SCORE) * 100, 0, 100)

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between leading-none">
        <span className="text-[11px] text-neutral-200">{label}</span>
      </div>

      <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            transition:
              'width 600ms cubic-bezier(0.22,1,0.36,1), background-color 600ms',
          }}
        />
      </div>
    </div>
  )
}

function Stats({
  checkin,
  color,
}: {
  checkin: DailyCheckin | null
  color: string
}) {

  const t = useTranslations('dashboard.checkin')

  return (
    <div className="flex h-[4.5rem] flex-col justify-center gap-4 sm:h-24">
      <StatBar label={t('stats.energy')} value={checkin?.energy ?? null} color={color} />
      <StatBar label={t('stats.stress')} value={checkin?.stress ?? null} color={color} />
    </div>
  )
}

function MoodAvatar({ mood }: { mood: Mood }) {
  const t = useTranslations('dashboard.checkin')
  const tm = useTranslations('checkins.moods')
  const variants = emotVariants[mood]
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [ready, setReady] = useState(false)

  // efek "pop-in" waktu avatar baru muncul (pindah hari / ganti mood)
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  // ganti-ganti varian tiap 2.5 detik
  useEffect(() => {
    if (variants.length <= 1) return

    let swapTimeout: number | undefined

    const interval = window.setInterval(() => {
      setFading(true)

      swapTimeout = window.setTimeout(() => {
        setIndex((current) => (current + 1) % variants.length)
        setFading(false)
      }, 150)
    }, 2500)

    return () => {
      window.clearInterval(interval)
      if (swapTimeout) window.clearTimeout(swapTimeout)
    }
  }, [variants.length])

  const emot = variants[index] ?? variants[0]
  const visible = ready && !fading

  return (
    <img
      src={emot.src}
      alt={t('moodAlt', { mood: tm(mood) })}
      draggable={false}
      className={`relative z-10 size-[4.5rem] object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.4)] transition-all duration-300 sm:size-24 ${visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
    />
  )
}

function EmptyAvatar({ href, label }: { href?: string; label: string }) {
  const content = (
    <>
      <div className="flex size-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] backdrop-blur-sm">
        <Heart size={16} strokeWidth={1.6} className="text-pink-300" />
      </div>

      <div className="mt-2 flex items-center gap-1 text-[10px] text-neutral-400">
        <span>{label}</span>

        {href && (
          <ArrowUpRight
            size={10}
            strokeWidth={1.8}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        )}
      </div>
    </>
  )

  const className =
    'group relative z-10 flex flex-col items-center justify-center'

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  )
}

function PersonColumn({
  role,
  checkin,
  href,
  emptyLabel,
}: {
  role: string
  checkin: DailyCheckin | null
  href?: string
  emptyLabel: string
}) {
  const tm = useTranslations('checkins.moods')
  const theme = getTheme(checkin?.mood)

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex size-[4.5rem] items-center justify-center sm:size-24">
        {/* glow di belakang avatar */}
        <div
          className="pointer-events-none absolute inset-0 m-auto size-28 rounded-full blur-2xl transition-colors duration-700"
          style={{ backgroundColor: theme.glow }}
        />

        {checkin ? (
          <MoodAvatar key={`${checkin.id}-${checkin.mood}`} mood={checkin.mood} />
        ) : (
          <EmptyAvatar href={href} label={emptyLabel} />
        )}
      </div>

      <p className="mt-1 text-[12px] font-medium tracking-[-0.02em] text-neutral-100">
        {role}
      </p>

      <p className="h-3 text-[9px] leading-3 text-neutral-500">
        {checkin ? tm(checkin.mood) : ''}
      </p>
    </div>
  )
}

/* ========================================================= */
/* KOMPONEN UTAMA */
/* ========================================================= */

export default function PartnerCheckinCard({
  checkins,
  userId,
}: PartnerCheckinCardProps) {
  const t = useTranslations('dashboard.checkin')
  const tp = useTranslations('dashboard.people')
  const tc = useTranslations('common')
  const format = useFormatter()

  // position: 0 = Now, 6 = 6 hari lalu. Float saat di-drag, integer saat snap.
  const [position, setPosition] = useState(0)
  const [dragging, setDragging] = useState(false)

  const dragRef = useRef<{
    startX: number
    startPos: number
    moved: boolean
  } | null>(null)
  const suppressClickRef = useRef(false)

  const days = useMemo<DayEntry[]>(() => {
    const today = new Date()

    return Array.from({ length: DAYS }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const key = toDateKey(date)

      const ofDay = (checkins ?? []).filter((c) => c.checkin_date === key)

      return {
        key,
        label: i === 0 ? t('now') : format.dateTime(date, { weekday: 'short' }).toLowerCase(),
        fullLabel: format.dateTime(date, { weekday: 'long', month: 'short', day: 'numeric' }),
        user: userId ? (ofDay.find((c) => c.user_id === userId) ?? null) : null,
        partner: userId
          ? (ofDay.find((c) => c.user_id !== userId) ?? null)
          : null,
      }
    })
  }, [checkins, userId, format, t])

  const selectedIndex = Math.round(position)
  const selected = days[selectedIndex]

  const userTheme = getTheme(selected.user?.mood)
  const partnerTheme = getTheme(selected.partner?.mood)

  /* ---------- drag ---------- */

  useEffect(() => {
    if (!dragging) return

    const handleMove = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return

      const dx = e.clientX - drag.startX
      if (Math.abs(dx) > 4) drag.moved = true

      // geser ke kanan = mundur ke hari yang lebih lama
      setPosition(clamp(drag.startPos + dx / PX_PER_STEP, 0, MAX_INDEX))
    }

    const handleUp = () => {
      if (dragRef.current?.moved) {
        suppressClickRef.current = true
        window.setTimeout(() => {
          suppressClickRef.current = false
        }, 50)
      }

      dragRef.current = null
      setPosition((p) => Math.round(p))
      setDragging(false)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [dragging])

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return

    dragRef.current = {
      startX: e.clientX,
      startPos: position,
      moved: false,
    }
    setDragging(true)
  }

  const handleSelect = (index: number) => {
    if (suppressClickRef.current) return
    setPosition(index)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setPosition((p) => clamp(Math.round(p) + 1, 0, MAX_INDEX))
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setPosition((p) => clamp(Math.round(p) - 1, 0, MAX_INDEX))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setPosition(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setPosition(MAX_INDEX)
    }
  }

  const subtitle =
    selectedIndex === 0
      ? tc('relative.today')
      : selectedIndex === 1
        ? tc('relative.yesterday')
        : tc('relative.daysAgo', { count: selectedIndex })

  const itemTransition = dragging
    ? ''
    : 'transition-[opacity,height] duration-300'

  return (
    <div className="relative isolate">
      {/* ===== Avatar + stats ===== */}
      <div className="relative grid grid-cols-[4.75rem_1fr_1fr_4.75rem] items-start gap-2 sm:grid-cols-[7rem_1fr_1fr_7rem]">
        <Stats checkin={selected.user} color={userTheme.accent} />

        <PersonColumn
          role={tp('you')}
          checkin={selected.user}
          href={selectedIndex === 0 ? '/check-in' : undefined}
          emptyLabel={selectedIndex === 0 ? t('checkInCta') : t('noCheckin')}
        />

        <PersonColumn
          role={tp('partner')}
          checkin={selected.partner}
          emptyLabel={selectedIndex === 0 ? t('notYet') : t('noCheckin')}
        />

        <Stats checkin={selected.partner} color={partnerTheme.accent} />
      </div>

      {/* ===== Dial busur landai ===== */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={t('sliderLabel')}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={MAX_INDEX}
        aria-valuenow={selectedIndex}
        aria-valuetext={selected.fullLabel}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className={`relative mt-1 w-full touch-pan-y select-none overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-white/20 ${dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        style={{ height: VIEW_HEIGHT }}
      >
        {/* ring statis: gradient dari warna mood kamu -> warna mood partner */}
        <svg
          aria-hidden
          className="pointer-events-none absolute"
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          style={{ left: '50%', marginLeft: -RADIUS, top: WHEEL_TOP }}
        >
          <defs>
            <linearGradient
              id="checkin-ring-gradient"
              gradientUnits="userSpaceOnUse"
              x1={RADIUS - GRADIENT_HALF}
              y1={0}
              x2={RADIUS + GRADIENT_HALF}
              y2={0}
            >
              <stop
                offset="0%"
                style={{
                  stopColor: userTheme.accent,
                  transition: 'stop-color 600ms',
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: partnerTheme.accent,
                  transition: 'stop-color 600ms',
                }}
              />
            </linearGradient>
          </defs>

          <circle
            cx={RADIUS}
            cy={RADIUS}
            r={RADIUS - RING / 2}
            fill="none"
            stroke="url(#checkin-ring-gradient)"
            strokeWidth={RING}
            strokeOpacity={0.9}
          />
          {/* redam sedikit biar nggak terlalu terang */}
          <circle
            cx={RADIUS}
            cy={RADIUS}
            r={RADIUS - RING / 2}
            fill="none"
            stroke="#000"
            strokeWidth={RING}
            strokeOpacity={0.25}
          />
          <circle
            cx={RADIUS}
            cy={RADIUS}
            r={RADIUS - 0.5}
            fill="none"
            stroke="#fff"
            strokeOpacity={0.1}
          />
          <circle
            cx={RADIUS}
            cy={RADIUS}
            r={RADIUS - RING + 0.5}
            fill="none"
            stroke="#fff"
            strokeOpacity={0.06}
          />
        </svg>

        {/* teks tengah: tanggal hari yang dipilih */}
        <div className="pointer-events-none absolute inset-x-0 top-[60px] text-center">
          <p className="text-[12px] font-medium tracking-[-0.01em] text-neutral-200">
            {selected.fullLabel}
          </p>
          <p className="mt-0.5 text-[10px] text-neutral-500">{subtitle}</p>
        </div>

        {/* lapisan yang berputar: titik hari + label */}
        <div
          className={`absolute ${dragging
            ? ''
            : 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
            }`}
          style={{
            left: '50%',
            marginLeft: -RADIUS,
            top: WHEEL_TOP,
            width: WHEEL_SIZE,
            height: WHEEL_SIZE,
            transform: `rotate(${position * STEP_DEG}deg)`,
          }}
        >
          {days.map((day, i) => {
            const base = -i * STEP_DEG
            const dist = Math.abs(i - position)
            const closeness = Math.max(0, 1 - dist)
            const isActive = i === selectedIndex

            return (
              <div key={day.key}>
                {/* titik / pill penanda di ring */}
                <span
                  aria-hidden
                  className={`absolute left-1/2 top-1/2 rounded-full bg-white ${itemTransition}`}
                  style={{
                    width: 5,
                    height: 5 + 13 * closeness,
                    opacity: 0.3 + 0.7 * closeness,
                    transform: `translate(-50%, -50%) rotate(${base}deg) translateY(-${DOT_RADIUS}px)`,
                  }}
                />

                {/* label hari, miring mengikuti busur */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleSelect(i)}
                  className={`absolute left-1/2 top-1/2 whitespace-nowrap px-2 py-1 transition-colors ${isActive
                    ? 'text-[13px] font-medium text-white'
                    : 'text-[11px] text-neutral-400 hover:text-neutral-200'
                    }`}
                  style={{
                    opacity: Math.max(0.25, 1 - dist * 0.28),
                    transform: `translate(-50%, -50%) rotate(${base}deg) translateY(-${LABEL_RADIUS}px)`,
                  }}
                >
                  {day.label}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}