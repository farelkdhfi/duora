'use client'

import { useFormatter } from 'next-intl'

/** Mata uang app fix IDR; format (pemisah ribuan) ikut locale aktif. */
export function useRupiah() {
  const format = useFormatter()

  const rupiah = (amount: number) =>
    format.number(amount, {
      style: 'currency',
      currency: 'IDR',
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
    })

  /** 1_000_000 -> "Rp1M" (en) / "Rp1 jt" (id) */
  const rupiahCompact = (amount: number) =>
    format.number(amount, {
      style: 'currency',
      currency: 'IDR',
      currencyDisplay: 'narrowSymbol',
      notation: 'compact',
      maximumFractionDigits: 0,
    })

  return { rupiah, rupiahCompact }
}