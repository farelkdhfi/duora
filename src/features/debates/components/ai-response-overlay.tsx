'use client'

import { useEffect } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { X } from 'lucide-react'

import type { DebateMessage } from '../types'
import DebateMessageBubble from './debate-message-bubble'

interface AiResponseOverlayProps {
  message?: DebateMessage
  isProcessing: boolean
  isPendingVerdict: boolean
  personaName: string
  personaImage: StaticImageData
  requesterName?: string | null
  onClose: () => void
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const eyebrow =
  'text-[9px] font-semibold uppercase tracking-[0.24em] text-neutral-400'

export default function AiResponseOverlay({
  message,
  isProcessing,
  isPendingVerdict,
  personaName,
  personaImage,
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

  const processingTitle = isResolution
    ? 'Finding your middle ground'
    : 'Listening to both sides'

  const subtitle = isProcessing
    ? isPendingVerdict
      ? 'Duora is carefully preparing your resolution.'
      : requesterName
        ? `${requesterName} invited Duora into the discussion.`
        : 'Duora is reading both perspectives.'
    : isResolution
      ? 'Here is what Duora found after hearing both sides.'
      : 'A thought from your mediator.'

  const title = isProcessing
    ? processingTitle
    : isResolution
      ? 'A calmer place to meet in the middle.'
      : 'Here is what Duora heard.'

  /* key untuk transisi teks hero saat state berganti */
  const heroKey = `${isProcessing ? 'processing' : 'done'}-${isResolution ? 'resolution' : 'comment'}`

  const canClose = !isProcessing && Boolean(message)

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed inset-0 z-[200] flex h-[100dvh] min-h-[100dvh] flex-col overflow-hidden bg-[#f7f6f2]"
      >
        {/* AMBIENT */}

        <div className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-pink-300/[0.12] blur-[120px]" />

        <div className="pointer-events-none absolute -left-32 top-1/3 size-[380px] rounded-full bg-blue-300/[0.10] blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-40 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-[#eadfce]/[0.16] blur-[120px]" />

        {/* HEADER */}

        <header className="relative z-20 flex shrink-0 items-center justify-between px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 sm:py-7">
          <div className="flex items-center gap-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Duora
            </p>

            {isResolution && (
              <>
                <span className="h-3 w-px bg-black/10" />

                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Resolution
                </p>
              </>
            )}
          </div>

          {canClose && (
            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Close AI response"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.055] bg-white/80 text-neutral-400 shadow-[0_8px_25px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-colors hover:bg-neutral-900 hover:text-white"
            >
              <X size={14} strokeWidth={1.8} />
            </motion.button>
          )}
        </header>

        {/* SCROLLABLE CONTENT */}

        <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-4 [-webkit-overflow-scrolling:touch] sm:px-8 sm:pb-10 sm:pt-6">
          <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center">
            {/* MEDIATOR */}

            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {/* glow */}
                <span
                  aria-hidden
                  className={[
                    'pointer-events-none absolute left-1/2 top-1/2 size-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[56px] transition-colors duration-1000 sm:size-[210px]',
                    isResolution ? 'bg-[#e8d5be]/80' : 'bg-[#eadfd2]/70',
                  ].join(' ')}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="relative"
                >
                  {/* ring */}
                  <motion.span
                    aria-hidden
                    className="absolute -inset-3 rounded-full border border-black/[0.05]"
                    animate={
                      isProcessing
                        ? { scale: [1, 1.12, 1], opacity: [0.7, 0.2, 0.7] }
                        : { scale: 1, opacity: 0.45 }
                    }
                    transition={
                      isProcessing
                        ? { duration: 3, ease: 'easeInOut', repeat: Infinity }
                        : { duration: 0.8, ease: EASE }
                    }
                  />

                  <motion.div
                    animate={{ scale: isProcessing ? 1.04 : 1 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="relative flex size-[88px] items-center justify-center rounded-full border border-black/[0.055] bg-[#f8f4ed] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] sm:size-[104px]"
                  >
                    <span className="absolute inset-2.5 rounded-full bg-white/85" />

                    <motion.span
                      className="relative block size-[46px] sm:size-[56px]"
                      animate={
                        isProcessing ? { scale: [1, 1.07, 1] } : { scale: 1 }
                      }
                      transition={
                        isProcessing
                          ? { duration: 2.2, ease: 'easeInOut', repeat: Infinity }
                          : { duration: 0.6, ease: EASE }
                      }
                    >
                      <Image
                        src={personaImage}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    </motion.span>
                  </motion.div>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                className={`mt-7 sm:mt-8 ${eyebrow}`}
              >
                {personaName} mediator
              </motion.p>

              {/* HERO TEXT (berganti halus saat state berubah) */}

              <AnimatePresence mode="wait">
                <motion.div
                  key={heroKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="flex flex-col items-center"
                >
                  <h1 className="mt-3 max-w-[320px] text-balance font-serif text-[26px] leading-[1.18] tracking-[-0.025em] text-neutral-900 sm:max-w-md sm:text-[34px]">
                    {title}
                  </h1>

                  <p className="mt-3 max-w-[300px] text-[11px] leading-5 text-neutral-400 sm:max-w-md sm:text-[12px]">
                    {subtitle}
                  </p>

                  {isProcessing && (
                    <div aria-hidden className="mt-6 flex items-center gap-1.5">
                      {[0, 1, 2].map((index) => (
                        <motion.span
                          key={index}
                          className="size-1 rounded-full bg-neutral-400"
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{
                            duration: 1.4,
                            ease: 'easeInOut',
                            repeat: Infinity,
                            delay: index * 0.18,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RESPONSE */}

            {!isProcessing && message && (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                className="mt-8 w-full min-w-0 sm:mt-10"
              >
                <DebateMessageBubble
                  message={message}
                  currentUserId=""
                  variant={isResolution ? 'resolution' : 'mediator'}
                />
              </motion.div>
            )}

            {/* MOBILE EXTRA SPACE */}

            {!isProcessing && message && <div className="h-4 shrink-0 sm:h-0" />}
          </div>
        </main>

        {/* FOOTER */}

        {canClose && (
          <motion.footer
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            className="relative z-20 shrink-0 border-t border-black/[0.025] bg-[#f7f6f2]/90 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:border-t-0 sm:bg-transparent sm:px-8 sm:pb-8 sm:pt-3"
          >
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/[0.055] bg-white/80 px-5 py-2.5 text-[10px] font-semibold text-neutral-500 shadow-[0_8px_25px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-colors hover:bg-neutral-900 hover:text-white sm:px-6 sm:py-3"
              >
                Back to discussion
              </button>
            </div>
          </motion.footer>
        )}
      </motion.div>
    </MotionConfig>
  )
}