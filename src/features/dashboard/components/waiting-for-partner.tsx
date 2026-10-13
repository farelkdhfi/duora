'use client'

import { useState } from 'react'
import { Check, Copy, Lock } from 'lucide-react'

export default function WaitingForPartner({
  relationshipName,
  inviteCode,
  userName,
}: {
  relationshipName: string
  inviteCode: string
  userName: string
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />

      <div className="relative mx-auto max-w-2xl">
        <div className="mt-10 overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/80 p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:p-10">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">
            <Lock size={22} className="text-pink-500" />
          </div>

          <h2 className="text-2xl font-semibold tracking-[-0.04em]">
            {relationshipName}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
            Bagikan kode undangan ini kepada pasanganmu untuk mulai membangun ruang bersama di Duora.
          </p>

          <div className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-black/[0.05] bg-white px-4 py-3">
            <span className="text-lg font-semibold tracking-[0.2em] text-neutral-900">
              {inviteCode}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Kode berhasil disalin' : 'Salin kode undangan'}
              className="ml-2 flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-700"
            >
              {copied ? (
                <Check size={15} className="text-emerald-500" />
              ) : (
                <Copy size={15} />
              )}
            </button>
          </div>

          <p className="mt-5 text-xs text-neutral-400">
            {copied
              ? 'Kode undangan berhasil disalin!'
              : 'Menunggu pasanganmu bergabung...'}
          </p>
        </div>
      </div>
    </main>
  )
}