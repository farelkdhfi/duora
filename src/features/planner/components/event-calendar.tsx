'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react'
import { useFormatter, useTimeZone, useTranslations } from 'next-intl'

import {
  addDays,
  calendarDate,
  parseDateOnly,
  startOfWeek,
  toDateKey,
  UTC,
  zonedNow,
} from '@/lib/date'

interface EventCalendarProps {
  /** Tanggal terpilih, format `YYYY-MM-DD` */
  selectedDate: string
  onSelectDate: (dateKey: string) => void
  /** Set berisi tanggal yang punya plan, format `YYYY-MM-DD` */
  eventDates?: Set<string>
}

const EMPTY_DATES = new Set<string>()

/** 6 baris x 7 kolom supaya tinggi kalender bulanan tidak loncat */
const TOTAL_CELLS = 42

/** Senin acuan untuk bikin label nama hari (1 Jan 2024 = Senin) */
const REFERENCE_MONDAY = calendarDate(2024, 0, 1)

/* ========================================================= */
/* HELPERS */
/* ========================================================= */

/**
 * Date -> `YYYY-MM-DD` memakai tanggal lokal mesin.
 * Dipertahankan supaya import lama nggak error. Untuk kode baru pakai
 * `zonedNow(timeZone).dateKey` atau `toDateKey` dari '@/lib/date'.
 */
export function formatDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const navButtonClass =
  'flex size-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/10 text-neutral-200 backdrop-blur-sm transition hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'

/* ========================================================= */
/* CALENDAR */
/* ========================================================= */

export default function EventCalendar({
  selectedDate,
  onSelectDate,
  eventDates = EMPTY_DATES,
}: EventCalendarProps) {
  const t = useTranslations('planner.calendar')
  const format = useFormatter()
  const timeZone = useTimeZone()

  // "Hari ini" menurut timezone user
  const todayKey = zonedNow(timeZone).dateKey

  // Semua Date di bawah ini berbasis UTC (tanggal murni, tanpa jam)
  const parsed = parseDateOnly(selectedDate)
  const selected = Number.isNaN(parsed.getTime())
    ? parseDateOnly(todayKey)
    : parsed

  const [monthOpen, setMonthOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() =>
    calendarDate(selected.getUTCFullYear(), selected.getUTCMonth(), 1),
  )

  /* ---------- label (ikut locale) ---------- */

  const monthTitle = (date: Date) =>
    format.dateTime(date, { month: 'long', year: 'numeric', ...UTC })

  const longLabel = (date: Date) =>
    format.dateTime(date, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      ...UTC,
    })

  const weekdayLabels = Array.from({ length: 7 }, (_, i) =>
    format.dateTime(addDays(REFERENCE_MONDAY, i), {
      weekday: 'short',
      ...UTC,
    }),
  )

  const dayAriaLabel = (date: Date, hasEvent: boolean) =>
    hasEvent
      ? t('dayLabelWithPlans', { date: longLabel(date) })
      : t('dayLabel', { date: longLabel(date) })

  /* ---------- strip mingguan ---------- */

  const weekStart = startOfWeek(selected)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  /* ---------- kalender bulanan ---------- */

  const monthCells = useMemo(() => {
    const year = viewMonth.getUTCFullYear()
    const month = viewMonth.getUTCMonth()
    const offset = (calendarDate(year, month, 1).getUTCDay() + 6) % 7
    const daysInMonth = calendarDate(year, month + 1, 0).getUTCDate()

    const cells: (Date | null)[] = [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) =>
        calendarDate(year, month, i + 1),
      ),
    ]

    while (cells.length < TOTAL_CELLS) cells.push(null)

    return cells
  }, [viewMonth])

  /* ---------- aksi ---------- */

  function toggleMonth() {
    if (!monthOpen) {
      setViewMonth(
        calendarDate(selected.getUTCFullYear(), selected.getUTCMonth(), 1),
      )
    }
    setMonthOpen((open) => !open)
  }

  function goPrevious() {
    if (monthOpen) {
      setViewMonth((m) =>
        calendarDate(m.getUTCFullYear(), m.getUTCMonth() - 1, 1),
      )
    } else {
      onSelectDate(toDateKey(addDays(selected, -7)))
    }
  }

  function goNext() {
    if (monthOpen) {
      setViewMonth((m) =>
        calendarDate(m.getUTCFullYear(), m.getUTCMonth() + 1, 1),
      )
    } else {
      onSelectDate(toDateKey(addDays(selected, 7)))
    }
  }

  function goToday() {
    onSelectDate(todayKey)
    setMonthOpen(false)
  }

  function pickDate(date: Date) {
    onSelectDate(toDateKey(date))
    setMonthOpen(false)
  }

  const title = monthTitle(monthOpen ? viewMonth : selected)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleMonth}
          aria-expanded={monthOpen}
          aria-label={t('toggleMonthView')}
          className="flex items-center gap-1.5 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <h3 className="text-lg font-semibold tracking-[-0.03em] text-neutral-50">
            {title}
          </h3>

          <ChevronsUpDown size={14} className="text-neutral-500" />
        </button>

        <div className="flex items-center gap-1">
          {selectedDate !== todayKey && (
            <button
              type="button"
              onClick={goToday}
              className="mr-1 h-8 rounded-full border border-white/[0.08] bg-white/10 px-3 text-[11px] font-medium text-neutral-200 transition hover:bg-white hover:text-neutral-900"
            >
              {t('today')}
            </button>
          )}

          <button
            type="button"
            onClick={goPrevious}
            aria-label={monthOpen ? t('previousMonth') : t('previousWeek')}
            className={navButtonClass}
          >
            <ChevronLeft size={14} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label={monthOpen ? t('nextMonth') : t('nextWeek')}
            className={navButtonClass}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Strip mingguan / kalender bulanan */}
      {monthOpen ? (
        <div className="mt-4">
          <div className="grid grid-cols-7 text-center">
            {weekdayLabels.map((day, index) => (
              <span key={index} className="py-1.5 text-[11px] text-neutral-500">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-y-1">
            {monthCells.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="h-10" />

              const key = toDateKey(date)
              const isSelected = key === selectedDate
              const isToday = key === todayKey
              const hasEvent = eventDates.has(key)

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => pickDate(date)}
                  aria-pressed={isSelected}
                  aria-label={dayAriaLabel(date, hasEvent)}
                  className={`mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-xl text-[13px] tabular-nums transition-colors ${
                    isSelected
                      ? 'bg-white/[0.12] font-semibold text-white ring-1 ring-inset ring-white/[0.14]'
                      : isToday
                        ? 'font-semibold text-pink-300 hover:bg-white/[0.06]'
                        : 'text-neutral-200 hover:bg-white/[0.06]'
                  }`}
                >
                  {date.getUTCDate()}
                  <span
                    className={`mt-0.5 size-1 rounded-full ${
                      hasEvent ? 'bg-pink-300' : 'bg-transparent'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-7 gap-1">
          {weekDays.map((date, index) => {
            const key = toDateKey(date)
            const isSelected = key === selectedDate
            const isToday = key === todayKey
            const hasEvent = eventDates.has(key)

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectDate(key)}
                aria-pressed={isSelected}
                aria-label={dayAriaLabel(date, hasEvent)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                  isSelected
                    ? 'bg-white/[0.12] ring-1 ring-inset ring-white/[0.14]'
                    : 'hover:bg-white/[0.05]'
                }`}
              >
                <span
                  className={`text-[11px] ${
                    isSelected ? 'text-neutral-200' : 'text-neutral-500'
                  }`}
                >
                  {weekdayLabels[index]}
                </span>

                <span
                  className={`text-[15px] font-semibold tabular-nums ${
                    isToday && !isSelected ? 'text-pink-300' : 'text-neutral-50'
                  }`}
                >
                  {date.getUTCDate()}
                </span>

                <span
                  className={`size-1 rounded-full ${
                    hasEvent ? 'bg-pink-300' : 'bg-transparent'
                  }`}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ========================================================= */
/* SKELETON */
/* ========================================================= */

export function EventCalendarSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-36 rounded-lg bg-white/[0.08]" />

        <div className="flex items-center gap-1">
          <div className="size-8 rounded-full bg-white/[0.06]" />
          <div className="size-8 rounded-full bg-white/[0.06]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="h-[4.5rem] rounded-2xl bg-white/[0.05]" />
        ))}
      </div>
    </div>
  )
}