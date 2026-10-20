// Semua Date yang dibuat helper ini berbasis UTC dan "buta timezone".
// WAJIB diformat dengan { timeZone: 'UTC' }, pakai spread ...UTC.
export const UTC = { timeZone: 'UTC' } as const

/** 'YYYY-MM-DD' (atau ISO penuh) -> tengah malam UTC di tanggal itu */
export function parseDateOnly(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00Z`)
}

/** Date UTC -> 'YYYY-MM-DD' */
export function toDateKey(date: Date) {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + amount)
  return next
}

/** Awal minggu (Senin) */
export function startOfWeek(date: Date) {
  return addDays(date, -((date.getUTCDay() + 6) % 7))
}

/** Jam dinding (09:30) tanpa tanggal -> Date UTC acuan */
export function wallClock(hours: number, minutes = 0) {
  return new Date(Date.UTC(2000, 0, 1, hours, minutes))
}

/** Tanggal kalender (tahun, bulan 0-11, hari) -> Date UTC */
export function calendarDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day))
}

/** "Sekarang" menurut timezone tertentu: tanggal 'YYYY-MM-DD' + menit sejak 00:00 */
export function zonedNow(timeZone?: string, now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '00'

  return {
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
  }
}

export function isSameZonedDay(a: string, b: string, timeZone?: string) {
  return (
    zonedNow(timeZone, new Date(a)).dateKey ===
    zonedNow(timeZone, new Date(b)).dateKey
  )
}