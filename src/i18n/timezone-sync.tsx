'use client'

import { useEffect } from 'react'
import { useTimeZone } from 'next-intl'

import { setTimeZone } from '@/i18n/actions'

// Menyamakan timezone yang dipakai server dengan timezone browser.
// Nggak render apa-apa. Kalau user pindah zona waktu, otomatis ke-update
// di kunjungan berikutnya.
export function TimezoneSync() {
  const current = useTimeZone()

  useEffect(() => {
    const browser = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (browser && browser !== current) {
      void setTimeZone(browser)
    }
  }, [current])

  return null
}