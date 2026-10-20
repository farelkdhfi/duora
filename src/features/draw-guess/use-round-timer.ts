'use client'

import { useEffect, useRef, useState } from 'react'

interface Options {
  endsAt: string | null
  serverNow: string | undefined
  enabled: boolean
  onExpire: () => void
}

export function useRoundTimer({ endsAt, serverNow, enabled, onExpire }: Options) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null)
  const expiredForRef = useRef<string | null>(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  // selisih jam server dan jam device, dihitung sekali setiap data ronde baru diterima
  const offsetRef = useRef(0)
  useEffect(() => {
    if (serverNow) offsetRef.current = Date.parse(serverNow) - Date.now()
  }, [serverNow])

  useEffect(() => {
    if (!enabled || !endsAt) {
      setRemainingMs(null)
      return
    }

    const end = Date.parse(endsAt)

    const tick = () => {
      const left = end - (Date.now() + offsetRef.current)
      setRemainingMs(Math.max(left, 0))

      if (left <= 0 && expiredForRef.current !== endsAt) {
        expiredForRef.current = endsAt
        onExpireRef.current()
      }
    }

    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [endsAt, enabled])

  return {
    remainingMs,
    remainingSeconds: remainingMs === null ? null : Math.ceil(remainingMs / 1000),
  }
}