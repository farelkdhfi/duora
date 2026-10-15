'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, Search } from 'lucide-react'
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'

interface RelationshipHeaderProps {
  userName: string
  partnerName: string
  userAvatarUrl?: string | null
  partnerAvatarUrl?: string | null
  connectedAt?: string | null
  /** Dipanggil saat tombol notifikasi diklik */
  onNotificationClick?: () => void
  /** Dipanggil saat tombol search diklik */
  onSearchClick?: () => void
  /** Jumlah notifikasi belum dibaca (menampilkan titik penanda jika > 0) */
  unreadCount?: number
}

type SlideKey = 'names' | 'days'

/** Durasi tiap slide (ms) */
const SLIDE_DURATION = 4800
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const firstName = (name: string) => name.trim().split(/\s+/)[0] || ''

/* ============================================================= */
/* MAIN HEADER */
/* ============================================================= */

export default function RelationshipHeader({
  userName,
  partnerName,
  userAvatarUrl,
  partnerAvatarUrl,
  connectedAt,
  onNotificationClick,
  onSearchClick,
  unreadCount = 0,
}: RelationshipHeaderProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  const userFirst = firstName(userName)
  const partnerFirst = firstName(partnerName)

  const daysTogether = useMemo(() => {
    if (!connectedAt) return null
    const start = new Date(connectedAt).getTime()
    if (Number.isNaN(start)) return null
    return Math.max(1, Math.floor((Date.now() - start) / 86_400_000))
  }, [connectedAt])

  const sinceLabel = useMemo(() => {
    if (!connectedAt) return null
    const date = new Date(connectedAt)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [connectedAt])

  const slides = useMemo<SlideKey[]>(
    () => (daysTogether ? ['names', 'days'] : ['names']),
    [daysTogether],
  )

  const current = slides[index % slides.length]

  // Auto rotate (nama <-> total hari)
  useEffect(() => {
    if (slides.length < 2) return
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [index, slides.length])

  const slideVariants = useMemo<Variants>(() => {
    if (reduced) {
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    }
    return {
      hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
      show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.55, ease: EASE },
      },
      exit: {
        opacity: 0,
        y: -10,
        filter: 'blur(6px)',
        transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
      },
    }
  }, [reduced])

  return (
    <header className="relative flex h-17 w-full items-center justify-between gap-3 bg-transparent px-4 sm:px-6">
      {/* LEFT — AVATARS + TEXT */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex shrink-0 -space-x-2.5">
          <div className="relative z-10 size-9 overflow-hidden rounded-full ring-2 ring-[#0a0a0c]">
            <Avatar name={userName} url={userAvatarUrl} tone="blue" />
          </div>
          <div className="relative z-20 size-9 overflow-hidden rounded-full ring-2 ring-[#0a0a0c]">
            <Avatar name={partnerName} url={partnerAvatarUrl} tone="pink" />
          </div>
        </div>

        {/* Text bergantian */}
        <div className="relative h-9 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              variants={slideVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex h-full min-w-0 flex-col justify-center"
            >
              {current === 'names' ? (
                <p className="flex items-baseline gap-1.5 text-sm font-semibold capitalize tracking-[-0.02em] text-neutral-50 sm:text-base">
                  <span className="max-w-[90px] truncate sm:max-w-[130px]">
                    {userFirst}
                  </span>
                  <span className="text-pink-300">&amp;</span>
                  <span className="max-w-[90px] truncate sm:max-w-[130px]">
                    {partnerFirst}
                  </span>
                </p>
              ) : (
                <>
                  <p className="flex items-baseline gap-1.5 whitespace-nowrap text-sm font-semibold leading-tight tracking-[-0.02em] text-neutral-50 sm:text-base">
                    <span className="tabular-nums">
                      <CountUp value={daysTogether ?? 0} />
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                      days together
                    </span>
                  </p>
                  {sinceLabel && (
                    <p className="mt-0.5 whitespace-nowrap text-[10px] leading-none text-neutral-500">
                      Since {sinceLabel}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT — SEARCH + NOTIFICATION */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search"
          className="flex size-9 items-center justify-center rounded-full border border-white/10 text-neutral-200 transition-colors hover:bg-white/10 active:scale-95"
        >
          <Search className="size-[18px]" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={onNotificationClick}
          aria-label={
            unreadCount > 0
              ? `Notifikasi, ${unreadCount} belum dibaca`
              : 'Notifikasi'
          }
          className="relative flex size-9 items-center justify-center rounded-full border border-white/10 text-neutral-200 transition-colors hover:bg-white/10 active:scale-95"
        >
          <Bell className="size-[18px]" strokeWidth={1.75} />

          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 block size-2 rounded-full bg-pink-400 ring-2 ring-[#0a0a0c]" />
          )}
        </button>
      </div>
    </header>
  )
}

/* ============================================================= */
/* COUNT UP */
/* ============================================================= */

function CountUp({ value }: { value: number }) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }

    const controls = animate(0, value, {
      duration: 1.2,
      delay: 0.15,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })

    return () => controls.stop()
  }, [value, reduced])

  return <>{display.toLocaleString('en-US')}</>
}

/* ============================================================= */
/* AVATAR */
/* ============================================================= */

function Avatar({
  name,
  url,
  tone,
}: {
  name: string
  url?: string | null
  tone: 'blue' | 'pink'
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        draggable={false}
        className="h-full w-full object-cover"
      />
    )
  }

  const initial = name.trim().slice(0, 1).toUpperCase() || '?'
  const isPink = tone === 'pink'

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-linear-to-br ${
        isPink ? 'from-[#ffd6e5] to-[#f7b6d0]' : 'from-[#d4e5ff] to-[#a9c8f5]'
      }`}
    >
      <span
        className={`text-sm font-semibold tracking-[-0.05em] ${
          isPink ? 'text-[#b8527d]' : 'text-[#4c78b8]'
        }`}
      >
        {initial}
      </span>
    </div>
  )
}