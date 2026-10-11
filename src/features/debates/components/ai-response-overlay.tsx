'use client'

import { memo, useEffect } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { X } from 'lucide-react'

import type { AiPersona, DebateMessage } from '../types'
import DebateMessageBubble from './debate-message-bubble'

interface AiResponseOverlayProps {
  message?: DebateMessage
  isProcessing: boolean
  isPendingVerdict: boolean
  persona: AiPersona
  personaName: string
  personaImage: StaticImageData
  requesterName?: string | null
  onClose: () => void
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const eyebrow =
  'text-[9px] font-semibold uppercase tracking-[0.24em] text-neutral-500'

/* ===================================================== */
/* STUDIO BACKDROP (sama dengan debate-intro section 2)  */
/* ===================================================== */

const HORIZON = 46

/* wall = warna kertas backdrop, shade = versi lebih gelap untuk cove & bayangan */
const personaTheme: Record<
  AiPersona,
  { wall: string; shade: string }
> = {
  formal: { wall: '244, 245, 244', shade: '165, 170, 168' },
  lembut: { wall: '255, 220, 235', shade: '225, 130, 175' },
  kasar: { wall: '255, 195, 195', shade: '210, 100, 100' },
  lebay: { wall: '190, 220, 255', shade: '90, 145, 210' },
}

type Stop = [position: number, alpha: number]

const rgba = (rgb: string, alpha: number) =>
  `rgba(${rgb}, ${alpha})`

const vertical = (rgb: string, stops: Stop[], offset = 0) =>
  `linear-gradient(to bottom, ${stops
    .map(
      ([position, alpha]) =>
        `${rgba(rgb, alpha)} ${position + offset}%`,
    )
    .join(', ')})`

const WALL_TO_FLOOR: Stop[] = [
  [0, 0.92], [12, 0.9], [24, 0.84], [36, 0.7], [47, 0.5],
  [57, 0.32], [67, 0.18], [78, 0.08], [90, 0.02], [100, 0],
]

const CEILING_FALLOFF: Stop[] = [
  [0, 0.12], [8, 0.08], [16, 0.045], [26, 0.015], [34, 0],
]

const COVE: Stop[] = [
  [-26, 0], [-18, 0.025], [-10, 0.065], [-3, 0.1],
  [3, 0.11], [10, 0.08], [18, 0.04], [27, 0],
]

const KEY_LIGHT =
  'radial-gradient(ellipse 72% 42% at 50% 30%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.34) 28%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.04) 80%, rgba(255,255,255,0) 100%)'

const buildBackdrop = ({
  wall,
  shade,
}: {
  wall: string
  shade: string
}) =>
  [
    vertical(shade, COVE, HORIZON),
    vertical(shade, CEILING_FALLOFF),
    KEY_LIGHT,
    vertical(wall, WALL_TO_FLOOR),
  ].join(', ')

const SIDE_LIGHT =
  'linear-gradient(112deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.2) 26%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 68%)'

const LIGHT_CONE =
  'conic-gradient(from 0deg at -10% -16%, rgba(255,255,255,0) 104deg, rgba(255,255,255,0.05) 114deg, rgba(255,255,255,0.13) 124deg, rgba(255,255,255,0.22) 134deg, rgba(255,255,255,0.26) 141deg, rgba(255,255,255,0.21) 149deg, rgba(255,255,255,0.11) 160deg, rgba(255,255,255,0.04) 171deg, rgba(255,255,255,0) 182deg)'

const FADE_BEFORE_FLOOR =
  'linear-gradient(to bottom, #000 0%, #000 40%, transparent 80%)'

const LIGHT_FALLOFF =
  'linear-gradient(292deg, rgba(24,24,32,0.05) 0%, rgba(24,24,32,0.022) 30%, rgba(24,24,32,0) 55%)'

const VIGNETTE =
  'radial-gradient(ellipse 85% 75% at 50% 44%, rgba(24,24,32,0) 50%, rgba(24,24,32,0.026) 78%, rgba(24,24,32,0.052) 100%)'

const SOFT_SHADOW =
  'radial-gradient(ellipse closest-side, rgba(24,24,32,0.075) 0%, rgba(24,24,32,0.04) 45%, rgba(24,24,32,0.012) 78%, rgba(24,24,32,0) 100%)'

const CONTACT_SHADOW =
  'radial-gradient(ellipse closest-side, rgba(24,24,32,0.15) 0%, rgba(24,24,32,0.07) 48%, rgba(24,24,32,0.015) 80%, rgba(24,24,32,0) 100%)'

/* bayangan berwarna persona di lantai, ikut posisi gambar */
const floorTint = (shade: string) =>
  `radial-gradient(ellipse closest-side, ${rgba(shade, 0.22)} 0%, ${rgba(shade, 0.1)} 45%, ${rgba(shade, 0.03)} 78%, ${rgba(shade, 0)} 100%)`

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`

/* konten yang discroll memudar halus saat lewat di bawah header */
const TOP_FADE =
  'linear-gradient(to bottom, transparent 0px, #000 64px)'

const StudioBackdrop = memo(function StudioBackdrop({
  persona,
}: {
  persona: AiPersona
}) {
  const theme = personaTheme[persona] ?? personaTheme.formal

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#fafaf9]"
    >
      {/* dinding + cove + lantai */}
      <div
        className="absolute inset-0"
        style={{ background: buildBackdrop(theme) }}
      />

      {/* cahaya studio dari kiri atas */}
      <div
        className="absolute inset-0"
        style={{
          background: `${LIGHT_CONE}, ${SIDE_LIGHT}`,
          maskImage: FADE_BEFORE_FLOOR,
          WebkitMaskImage: FADE_BEFORE_FLOOR,
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `${VIGNETTE}, ${LIGHT_FALLOFF}`,
        }}
      />

      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  )
})

/* ===================================================== */
/* MAIN */
/* ===================================================== */

export default function AiResponseOverlay({
  message,
  isProcessing,
  isPendingVerdict,
  persona,
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

  const theme = personaTheme[persona] ?? personaTheme.formal

  const isResolution = Boolean(
    message?.is_final_verdict || isPendingVerdict,
  )

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
        className="fixed inset-0 z-[200] flex h-[100dvh] min-h-[100dvh] flex-col overflow-hidden bg-[#fafaf9]"
      >
        {/* STUDIO BACKDROP */}

        <StudioBackdrop persona={persona} />

        {/* HEADER (melayang di atas konten) */}

        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 sm:pt-7">
          <div className="flex items-center gap-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Duora
            </p>

            {isResolution && (
              <>
                <span className="h-3 w-px bg-black/10" />

                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-500">
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
              className="pointer-events-auto flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.055] bg-white/80 text-neutral-500 shadow-[0_8px_25px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-colors hover:bg-neutral-900 hover:text-white"
            >
              <X size={14} strokeWidth={1.8} />
            </motion.button>
          )}
        </header>

        {/* SCROLLABLE CONTENT */}

        <main
          className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain [-webkit-overflow-scrolling:touch]"
          style={{
            maskImage: TOP_FADE,
            WebkitMaskImage: TOP_FADE,
          }}
        >
          {/* STAGE: gambar persona duduk di lantai studio */}

          <div
            className={[
              'relative flex w-full flex-col items-center justify-end pt-[calc(4rem_+_env(safe-area-inset-top))] transition-[height] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
              canClose ? 'h-[36dvh]' : 'h-[58dvh]',
            ].join(' ')}
          >
            <div
              className={[
                'relative shrink-0 transition-[width,height] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                canClose
                  ? 'size-[min(22dvh,170px)]'
                  : 'size-[min(40dvh,320px)]',
              ].join(' ')}
            >
              {/* bayangan lantai (ukuran ikut gambar) */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-0"
              >
                <div
                  className="absolute left-1/2 top-full h-[40%] w-[170%] -translate-x-1/2 -translate-y-1/2"
                  style={{ background: floorTint(theme.shade) }}
                />

                <div
                  className="absolute left-1/2 top-full h-[35%] w-[150%] -translate-x-1/2 -translate-y-1/2"
                  style={{ background: SOFT_SHADOW }}
                />

                <div
                  className="absolute left-1/2 top-full h-[12%] w-[75%] -translate-x-1/2 -translate-y-1/2"
                  style={{ background: CONTACT_SHADOW }}
                />
              </motion.div>

              {/* gambar persona */}
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.1, ease: EASE }}
                className="absolute inset-0"
              >
                <motion.div
                  animate={{
                    y: canClose ? [0, -4, 0] : [0, -8, 0],
                  }}
                  transition={{
                    duration: canClose ? 4.5 : 3,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                  className="relative size-full"
                >
                  <Image
                    src={personaImage}
                    alt=""
                    fill
                    sizes="250px"
                    className="object-contain"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* TEKS + RESPON */}

          <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-5 pt-6 text-center sm:px-8 sm:pt-8">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
              className={eyebrow}
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
                <h1 className="mt-3 max-w-[320px] text-balance text-[26px] font-medium leading-[1.15] tracking-[-0.04em] text-neutral-900 sm:max-w-md sm:text-[34px]">
                  {title}
                </h1>

                <p className="mt-3 max-w-[300px] text-[11px] leading-5 text-neutral-500 sm:max-w-md sm:text-[12px]">
                  {subtitle}
                </p>

                {isProcessing && (
                  <div
                    aria-hidden
                    className="mt-6 flex items-center gap-1.5"
                  >
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

            {/* RESPONSE */}

            {!isProcessing && message && (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: EASE,
                  delay: 0.2,
                }}
                className="mt-8 w-full min-w-0 text-left sm:mt-10"
              >
                <DebateMessageBubble
                  message={message}
                  currentUserId=""
                  persona={persona}
                  variant={isResolution ? 'resolution' : 'mediator'}
                />
              </motion.div>
            )}

            <div className="h-8 shrink-0" />
          </div>
        </main>

        {/* FOOTER */}

        {canClose && (
          <motion.footer
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            className="relative z-20 shrink-0 bg-[#fafaf9]/70 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:bg-transparent sm:px-8 sm:pb-8 sm:pt-3 sm:backdrop-blur-none"
          >
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/[0.055] bg-white/80 px-5 py-2.5 text-[10px] font-semibold text-neutral-600 shadow-[0_8px_25px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-colors hover:bg-neutral-900 hover:text-white sm:px-6 sm:py-3"
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