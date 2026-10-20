'use client'

import { useFormatter, useTimeZone, useTranslations } from 'next-intl'

import { addDays, parseDateOnly, toDateKey, zonedNow } from '@/lib/date'

interface DateSeparatorProps {
  date: string
}

export default function DateSeparator({ date }: DateSeparatorProps) {
  const t = useTranslations('common.relative')
  const format = useFormatter()
  const timeZone = useTimeZone()

  const target = new Date(date)

  // Semua perbandingan memakai tanggal di timezone user
  const dayKey = zonedNow(timeZone, target).dateKey
  const todayKey = zonedNow(timeZone).dateKey
  const yesterdayKey = toDateKey(addDays(parseDateOnly(todayKey), -1))

  let label: string

  if (dayKey === todayKey) {
    label = t('today')
  } else if (dayKey === yesterdayKey) {
    label = t('yesterday')
  } else {
    label = format.dateTime(target, {
      day: 'numeric',
      month: 'long',
      year: dayKey.slice(0, 4) !== todayKey.slice(0, 4) ? 'numeric' : undefined,
    })
  }

  return (
    <div className="flex items-center justify-center py-3">
      <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[10px] font-medium text-description">
        {label}
      </span>
    </div>
  )
}