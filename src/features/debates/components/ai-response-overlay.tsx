'use client'

import { useEffect } from 'react'
import { Loader2, X } from 'lucide-react'

import type { DebateMessage } from '../types'
import DebateMessageBubble from './debate-message-bubble'

interface AiResponseOverlayProps {
  message?: DebateMessage
  isProcessing: boolean
  isPendingVerdict: boolean
  personaName: string
  requesterName?: string | null
  onClose: () => void
}

export default function AiResponseOverlay({
  message,
  isProcessing,
  isPendingVerdict,
  personaName,
  requesterName,
  onClose,
}: AiResponseOverlayProps) {
  useEffect(() => {
    if (!isProcessing && !message) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isProcessing, message])

  const isResolution = Boolean(message?.is_final_verdict || isPendingVerdict)

  const title = isResolution ? 'Finding your middle ground' : 'Listening to both sides'

  const subtitle = isProcessing
    ? isPendingVerdict
      ? 'Duora is carefully preparing your resolution.'
      : requesterName
        ? `${requesterName} invited Duora into the discussion.`
        : 'Duora is reading both perspectives.'
    : isResolution
      ? 'Here is what Duora found after hearing both sides.'
      : 'A thought from your mediator.'

  return (
    <div className="fixed inset-0 z-[200] flex h-[100dvh] min-h-[100dvh] flex-col overflow-hidden bg-[#f7f6f2]">
      {/* AMBIENT */}

      <div className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-pink-300/[0.12] blur-[120px]" />

      <div className="pointer-events-none absolute -left-32 top-1/3 size-[380px] rounded-full bg-blue-300/[0.10] blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-40 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-[#eadfce]/[0.16] blur-[120px]" />

      {/* HEADER */}

      <header className="relative z-20 flex shrink-0 items-center justify-between px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 sm:py-7">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-neutral-300 sm:text-[9px]">
            {isResolution ? 'Duora Resolution' : 'Duora AI'}
          </p>

          <p className="mt-1 text-[10px] text-neutral-400 sm:text-[11px]">
            {personaName} mediator
          </p>
        </div>

        {!isProcessing && message && (
          <button type="button" onClick={onClose} aria-label="Close AI response" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.055] bg-white/80 text-neutral-400 shadow-[0_8px_25px_rgba(0,0,0,0.04)] backdrop-blur-xl transition hover:bg-neutral-900 hover:text-white">
            <X size={14} strokeWidth={1.8} />
          </button>
        )}
      </header>

      {/* SCROLLABLE CONTENT */}

      <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-4 [-webkit-overflow-scrolling:touch] sm:px-8 sm:pb-10 sm:pt-6">
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center">
          {/* AI ORB + INTRO */}

          <div className="flex flex-col items-center text-center">
            <div className="relative flex size-[68px] shrink-0 items-center justify-center rounded-full border border-black/[0.055] bg-[#f8f4ed] shadow-[0_22px_70px_rgba(0,0,0,0.09)] transition-all duration-700 sm:size-[92px]">
              <div className={`absolute -inset-3 rounded-full border border-black/[0.035] transition-all duration-700 ${isProcessing ? 'scale-110 opacity-100' : 'scale-100 opacity-50'}`} />

              <div className={`absolute inset-3 rounded-full bg-white/80 ${isProcessing ? 'animate-[debate-ai-pulse_1.8s_ease-in-out_infinite]' : ''}`} />

              {isProcessing ? (
                <Loader2 size={20} strokeWidth={1.5} className="relative z-10 animate-spin text-neutral-500" />
              ) : (
                <span className="relative z-10 text-2xl text-neutral-500">
                  {isResolution ? '♡' : '✦'}
                </span>
              )}
            </div>

            <p className="mt-4 text-[8px] font-semibold uppercase tracking-[0.2em] text-neutral-300 sm:mt-5 sm:text-[9px]">
              {isProcessing ? 'Duora is thinking' : isResolution ? 'Resolution' : 'Duora AI'}
            </p>

            <h1 className="mt-2 max-w-[300px] text-[21px] font-semibold leading-[1.15] tracking-[-0.05em] text-neutral-900 sm:max-w-md sm:text-[28px]">
              {isProcessing ? title : isResolution ? 'A calmer place to meet in the middle.' : 'Here is what Duora heard.'}
            </h1>

            <p className="mt-2 max-w-[300px] text-[10px] leading-5 text-neutral-400 sm:max-w-md sm:text-[11px]">
              {subtitle}
            </p>

            {isProcessing && (
              <div className="mt-5 flex items-center gap-1.5 pb-4">
                <span className="size-1.5 animate-pulse rounded-full bg-neutral-300" />
                <span className="size-1.5 animate-pulse rounded-full bg-neutral-300 [animation-delay:150ms]" />
                <span className="size-1.5 animate-pulse rounded-full bg-neutral-300 [animation-delay:300ms]" />
              </div>
            )}
          </div>

          {/* RESPONSE */}

          {!isProcessing && message && (
            <div className="mt-7 w-full min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-500 sm:mt-10">
              <DebateMessageBubble message={message} currentUserId="" variant={isResolution ? 'resolution' : 'mediator'} />
            </div>
          )}

          {/* MOBILE EXTRA SPACE */}

          {!isProcessing && message && <div className="h-4 shrink-0 sm:h-0" />}
        </div>
      </main>

      {/* FOOTER */}

      {!isProcessing && message && (
        <footer className="relative z-20 shrink-0 border-t border-black/[0.025] bg-[#f7f6f2]/90 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:border-t-0 sm:bg-transparent sm:px-8 sm:pb-8 sm:pt-3">
          <div className="flex justify-center">
            <button type="button" onClick={onClose} className="rounded-full border border-black/[0.055] bg-white/80 px-5 py-2.5 text-[9px] font-semibold text-neutral-500 shadow-[0_8px_25px_rgba(0,0,0,0.04)] backdrop-blur-xl transition hover:bg-neutral-900 hover:text-white sm:px-6 sm:py-3 sm:text-[10px]">
              Back to discussion
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}