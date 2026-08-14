'use client'

import { useState } from 'react'
import { Check, Copy, Lock, Sparkles } from 'lucide-react'

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

          <p className="mt-3 max-w-md mx-auto text-sm leading-6 text-neutral-500">
            You&apos;re all set, {userName}. Share
            this code with your partner so they
            can join and your space comes to life.
          </p>

          <div className="mt-7 flex items-center justify-center gap-2 rounded-xl border border-black/[0.05] bg-white px-4 py-3 mx-auto max-w-xs">
            <span className="text-lg font-semibold tracking-[0.2em] text-neutral-900">
              {inviteCode}
            </span>

            <button
              type="button"
              onClick={handleCopy}
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
            Waiting for your partner to join...
          </p>
        </div>
      </div>
    </main>
  )
}