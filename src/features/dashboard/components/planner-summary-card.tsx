'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import Link from 'next/link'
import { useFormatter, useTimeZone, useTranslations } from 'next-intl'
import { ArrowUpRight, CalendarDays, History, Plus } from 'lucide-react'

import { parseDateOnly, UTC, wallClock, zonedNow } from '@/lib/date'

/**
 * Bentuk data dari tabel planner_events.
 * Kalau kamu sudah punya type-nya di '@/features/planner/types', ganti dengan import itu.
 */
export interface PlannerEvent {
  id: string
  title: string
  description?: string | null
  category?: string | null
  event_date: string
  start_time?: string | null
  end_time?: string | null
  is_all_day?: boolean | null
}

interface PlannerSummaryCardProps {
  events: PlannerEvent[] | undefined
}

/** Jumlah bulet di selector (selalu tampil, ada plan atau tidak). */
const MAX_UPCOMING = 5

/** Jumlah plan lewat yang ditampilkan di filter Past. */
const MAX_PAST = 3

/** number = index event mendatang, 'past' = filter riwayat. */
type View = number | 'past'

const DAY_MS = 86_400_000

/** Selisih hari kalender (dateKey - todayKey), keduanya YYYY-MM-DD */
function daysUntil(dateKey: string, todayKey: string) {
  return Math.round(
    (parseDateOnly(dateKey).getTime() - parseDateOnly(todayKey).getTime()) /
    DAY_MS,
  )
}

/** Helper yang butuh teks/format locale dikumpulkan di sini. */
function usePlannerFormat() {
  const t = useTranslations('dashboard.planner')
  const tc = useTranslations('common')
  const tCat = useTranslations('planner.categories')
  const format = useFormatter()
  const timeZone = useTimeZone()

  // "Hari ini" menurut timezone user
  const todayKey = zonedNow(timeZone).dateKey

  /** "oct" / "okt" */
  const monthShort = (dateKey: string) =>
    format
      .dateTime(parseDateOnly(dateKey), { month: 'short', ...UTC })
      .toLowerCase()

  const dayOfMonth = (dateKey: string) => parseDateOnly(dateKey).getUTCDate()

  const relativeLabel = (dateKey: string) => {
    const diff = daysUntil(dateKey, todayKey)
    if (diff === 0) return tc('relative.today')
    if (diff === 1) return tc('relative.tomorrow')
    if (diff === -1) return tc('relative.yesterday')
    if (diff > 1) return tc('relative.inDays', { count: diff })
    return tc('relative.daysAgo', { count: -diff })
  }

  /** "oct 10" / "10 okt", plus " '25" kalau beda tahun dengan sekarang. */
  const shortDate = (dateKey: string) => {
    const date = parseDateOnly(dateKey)
    const label = format
      .dateTime(date, { day: 'numeric', month: 'short', ...UTC })
      .toLowerCase()
    const year = date.getUTCFullYear()
    const sameYear = year === Number(todayKey.slice(0, 4))

    return sameYear ? label : `${label} '${String(year).slice(2)}`
  }

  /** "13:30:00" -> "1:30 PM" (en) / "13.30" (id) */
  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    return format.dateTime(wallClock(h, m || 0), {
      hour: 'numeric',
      minute: '2-digit',
      ...UTC,
    })
  }

  const timeLabel = (event: PlannerEvent) => {
    if (event.is_all_day || !event.start_time) return t('allDay')

    const start = formatTime(event.start_time)
    return event.end_time ? `${start} – ${formatTime(event.end_time)}` : start
  }

  const categoryLabel = (category?: string | null) => {
    if (!category) return ''

    const key = category as Parameters<typeof tCat>[0]

    return tCat.has(key) ? tCat(key) : category.replace(/[_-]+/g, ' ')
  }

  return {
    monthShort,
    dayOfMonth,
    relativeLabel,
    shortDate,
    timeLabel,
    categoryLabel,
  }
}

/** true setelah komponen mount, dipakai untuk efek fade-in. */
function useMounted() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return ready
}

/* ========================================================= */
/* DETAIL EVENT MENDATANG */
/* ========================================================= */

function EventDetail({ event }: { event: PlannerEvent }) {
  const t = useTranslations('dashboard.planner')
  const { monthShort, dayOfMonth, relativeLabel, timeLabel, categoryLabel } =
    usePlannerFormat()
  const ready = useMounted()

  const month = monthShort(event.event_date)
  const category = categoryLabel(event.category)

  return (
    <div
      role="tabpanel"
      className={`flex items-stretch gap-3 transition-all duration-300 ease-out ${ready ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
    >
      {/* tile tanggal */}
      <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.12] to-black shadow-[0_10px_24px_-16px_rgba(0,0,0,0.9)]">
        <p className="text-[10px] leading-none tracking-[0.02em] text-neutral-300">
          {month}
        </p>
        <p className="mt-0.5 text-2xl font-semibold leading-none tracking-[-0.04em] text-white">
          {dayOfMonth(event.event_date)}
        </p>
      </div>

      {/* kategori, judul, deskripsi */}
      <div className="min-w-0 flex-1 self-center">
        <p className="truncate text-[10px] capitalize text-neutral-400">
          {category ? `${category} · ` : ''}
          {relativeLabel(event.event_date)}
        </p>

        <h3 className="mt-0.5 line-clamp-2 break-words text-base font-medium leading-tight tracking-[-0.03em] text-neutral-50">
          {event.title}
        </h3>

        {event.description && (
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-neutral-400">
            {event.description}
          </p>
        )}
      </div>

      {/* panah + waktu */}
      <div className="flex shrink-0 flex-col items-end justify-between">
        <Link
          href="/planner"
          aria-label={t('open')}
          className="flex size-7 items-center justify-center rounded-full border border-white/[0.08] text-neutral-300 transition-all duration-300 hover:bg-white hover:text-neutral-900"
        >
          <ArrowUpRight size={13} strokeWidth={2} />
        </Link>

        <span className="inline-flex h-7 items-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-3 text-[10px] font-medium text-neutral-200">
          {timeLabel(event)}
        </span>
      </div>
    </div>
  )
}

/* ========================================================= */
/* RIWAYAT (PAST): tanggal + judul saja */
/* ========================================================= */

function PastList({ events }: { events: PlannerEvent[] }) {
  const { shortDate } = usePlannerFormat()
  const ready = useMounted()

  return (
    <ul
      role="tabpanel"
      className={`transition-all duration-300 ease-out ${ready ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
    >
      {events.map((event) => (
        <li
          key={event.id}
          className="flex items-center gap-3 border-b border-white/[0.06] py-2 first:pt-0 last:border-b-0 last:pb-0"
        >
          <span className="w-[4.5rem] shrink-0 text-[11px] tabular-nums text-neutral-500">
            {shortDate(event.event_date)}
          </span>

          <span className="min-w-0 flex-1 truncate text-[13px] text-neutral-200">
            {event.title}
          </span>
        </li>
      ))}
    </ul>
  )
}

/* ========================================================= */
/* EMPTY STATE */
/* ========================================================= */

function EmptyState({ hasAny }: { hasAny: boolean }) {
  const t = useTranslations('dashboard.planner')

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-16 shrink-0 items-center justify-center">
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="22" stroke="#ffffff" strokeOpacity=".1" />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#f3b6cd"
            strokeOpacity=".35"
            strokeDasharray="2 6"
          />
          <circle cx="12" cy="24" r="1.7" fill="#f3b6cd" fillOpacity=".7" />
          <circle cx="52" cy="42" r="1.7" fill="#cfb4f0" fillOpacity=".7" />
        </svg>

        <CalendarDays
          size={18}
          strokeWidth={1.4}
          className="relative text-neutral-400"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm  text-neutral-50">
          {hasAny ? t('emptyUpcomingTitle') : t('emptyTitle')}
        </h3>
        <p className="mt-0.5 text-[11px] text-neutral-400">
          {hasAny ? t('emptyUpcomingDescription') : t('emptyDescription')}
        </p>
      </div>

      <Link
        href="/planner"
        className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 text-[10px] font-semibold text-neutral-200 transition-all duration-300 hover:bg-white hover:text-neutral-900"
      >
        <Plus size={11} strokeWidth={2.2} />
        {t('addPlan')}
      </Link>
    </div>
  )
}

/* ========================================================= */
/* KOMPONEN UTAMA */
/* ========================================================= */

const activeClass =
  'bg-pink-200 text-black shadow-[0_0_14px_rgba(168,85,247,0.45)]'

export default function PlannerSummaryCard({ events }: PlannerSummaryCardProps) {
  const t = useTranslations('dashboard.planner')
  const timeZone = useTimeZone()

  const [view, setView] = useState<View>(0)

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const { upcoming, past, total } = useMemo(() => {
    const todayKey = zonedNow(timeZone).dateKey

    const all = events ?? []

    return {
      // dari API sudah urut dari yang paling dekat
      upcoming: all
        .filter((event) => event.event_date >= todayKey)
        .slice(0, MAX_UPCOMING),
      // plan lewat: yang paling baru dulu
      past: all
        .filter((event) => event.event_date < todayKey)
        .reverse()
        .slice(0, MAX_PAST),
      total: all.length,
    }
  }, [events, timeZone])

  // selalu MAX_UPCOMING slot; slot tanpa plan = null
  const slots = Array.from(
    { length: MAX_UPCOMING },
    (_, i) => upcoming[i] ?? null,
  )

  // urutan tab untuk navigasi keyboard: bulet 1..n lalu Past
  const order: View[] = [
    ...upcoming.map((_, i) => i),
    ...(past.length > 0 ? (['past'] as const) : []),
  ]

  // view yang benar-benar aktif (jaga-jaga data berubah setelah refetch)
  let activeView: View | null
  if (view === 'past') {
    activeView = past.length > 0 ? 'past' : upcoming.length > 0 ? 0 : null
  } else {
    activeView = upcoming.length > 0 ? Math.min(view, upcoming.length - 1) : null
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (order.length === 0) return

    const pos = activeView === null ? 0 : Math.max(0, order.indexOf(activeView))
    let nextPos = pos

    if (e.key === 'ArrowRight') nextPos = Math.min(pos + 1, order.length - 1)
    else if (e.key === 'ArrowLeft') nextPos = Math.max(pos - 1, 0)
    else if (e.key === 'Home') nextPos = 0
    else if (e.key === 'End') nextPos = order.length - 1
    else return

    e.preventDefault()
    setView(order[nextPos])
    tabRefs.current[nextPos]?.focus()
  }

  const pastActive = activeView === 'past'

  return (
    <div className="w-full bg-neutral-800 p-3 rounded-2xl">
      {/* ===== Selector: bulet 1..5 + filter Past, satu baris ===== */}
      <div
        role="tablist"
        aria-label={t('plansLabel')}
        onKeyDown={handleKeyDown}
        className="flex items-center"
      >
        {slots.map((event, i) => {
          const isActive = activeView === i

          return (
            <Fragment key={event?.id ?? `empty-${i}`}>
              {event ? (
                <button
                  ref={(node) => {
                    tabRefs.current[i] = node
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={t('tabLabel', { number: i + 1, title: event.title })}
                  title={event.title}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setView(i)}
                  className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/30 ${isActive
                    ? ` ${activeClass}`
                    : 'border border-white/[0.08] bg-black text-neutral-200 hover:border-white/20 hover:bg-neutral-900'
                    }`}
                >
                  {i + 1}
                </button>
              ) : (
                <button
                  type="button"
                  role="tab"
                  disabled
                  aria-selected={false}
                  aria-label={t('tabEmptyLabel', { number: i + 1 })}
                  title={t('noPlan')}
                  tabIndex={-1}
                  className="relative z-10 flex size-7 shrink-0 cursor-default items-center justify-center rounded-full border border-dashed border-white/[0.08] bg-black text-xs font-medium text-neutral-600"
                >
                  {i + 1}
                </button>
              )}

              {i < slots.length - 1 && (
                <span
                  aria-hidden
                  className={`h-px flex-1 transition-colors duration-500 ${typeof activeView === 'number' && i < activeView
                    ? 'bg-purple-400/60'
                    : 'bg-white/10'
                    }`}
                />
              )}
            </Fragment>
          )
        })}

        {/* pemisah + filter Past */}
        <span aria-hidden className="mx-2.5 h-4 w-px shrink-0 bg-white/10" />

        <button
          ref={(node) => {
            if (past.length > 0) tabRefs.current[upcoming.length] = node
          }}
          type="button"
          role="tab"
          disabled={past.length === 0}
          aria-selected={pastActive}
          aria-label={t('pastPlans')}
          title={past.length > 0 ? t('pastPlans') : t('noHistory')}
          tabIndex={pastActive ? 0 : -1}
          onClick={() => setView('past')}
          className={`relative z-10 inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/30 ${past.length === 0
            ? 'cursor-default border border-dashed border-white/[0.08] bg-black text-neutral-600'
            : pastActive
              ? activeClass
              : 'border border-white/[0.08] bg-black text-neutral-300 hover:border-white/20 hover:bg-neutral-900'
            }`}
        >
          <History size={11} strokeWidth={2} />
          {t('past')}
        </button>
      </div>

      {/* ===== Konten ===== */}
      <div className="mt-4">
        {pastActive ? (
          <PastList events={past} />
        ) : typeof activeView === 'number' ? (
          <EventDetail key={upcoming[activeView].id} event={upcoming[activeView]} />
        ) : (
          <EmptyState hasAny={total > 0} />
        )}
      </div>
    </div>
  )
}