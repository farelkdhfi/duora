'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type PanInfo,
  type Variants,
} from 'framer-motion'
import duoraLogo from '@/assets/logo.png'
import hero1 from '@/assets/hero/hero1.png'
import hero2 from '@/assets/hero/hero2.png'

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const AUTOPLAY_MS = 4500 // jeda antar slide otomatis
const SLIDE_OFFSET = 64 // jarak geser slide saat masuk/keluar (px)
const SWIPE_DISTANCE = 60 // minimal jarak drag agar dianggap swipe (px)
const SWIPE_VELOCITY = 400 // atau minimal kecepatan flick (px/s)
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* -------------------------------------------------------------------------- */
/*  Slides                                                                    */
/* -------------------------------------------------------------------------- */

const Accent = ({ children }: { children: ReactNode }) => (
  <span className="text-[#AD72C0]">{children}</span>
)

type Slide = {
  id: string
  image: StaticImageData
  alt: string
  title: ReactNode[] // satu item = satu baris judul
  description: ReactNode
}

const slides: Slide[] = [
  {
    id: 'love-lives-here',
    image: hero1,
    alt: 'Two fluffy cat characters staying connected through Duora',
    title: ['Love', <>lives <Accent>here.</Accent></>],
    description: (
      <>
        Tempat nyaman untuk tetap dekat 
        <br className="hidden min-[360px]:block" />
        dan saling terhubung, meski 
        <br />
        terpisah jarak.
      </>
    ),
  },
  {
    id: 'assistant',
    image: hero2,
    alt: 'Duora AI assistant helping a couple with their relationship',
    title: ['Assistant', <>your <Accent>relationship</Accent></>],
    description: (
      <>
        Tanya apa pun tentang hubungan
        <br className="hidden min-[360px]:block" />
        kalian, Duora AI memahami 
        <br />
        konteksnya.
      </>
    ),
  },
]

/* -------------------------------------------------------------------------- */
/*  Motion variants                                                           */
/* -------------------------------------------------------------------------- */

// Wrapper slide: geser mengikuti arah swipe, lalu anak-anaknya muncul berurutan.
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? SLIDE_OFFSET : direction < 0 ? -SLIDE_OFFSET : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { duration: 0.7, ease: EASE },
      opacity: { duration: 0.45, ease: 'easeOut' },
      delayChildren: 0.06,
      staggerChildren: 0.09,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -SLIDE_OFFSET : SLIDE_OFFSET,
    opacity: 0,
    transition: { duration: 0.35, ease: EASE },
  }),
}

// Ilustrasi: zoom-in halus.
const imageVariants: Variants = {
  enter: { opacity: 0, scale: 0.92 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE },
  },
}

// Judul & deskripsi: naik pelan + blur hilang.
const textVariants: Variants = {
  enter: { opacity: 0, y: 16, filter: 'blur(6px)' },
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: EASE },
  },
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  // [index slide aktif, arah transisi: 1 = maju, -1 = mundur, 0 = awal]
  const [[index, direction], setPage] = useState<[number, number]>([0, 0])
  const [paused, setPaused] = useState(false)

  const slide = slides[index]
  const lastIndex = slides.length - 1

  const goTo = useCallback((next: number) => {
    setPage((prev) =>
      next === prev[0] ? prev : [next, next > prev[0] ? 1 : -1],
    )
  }, [])

  // Auto swipe (looping). Timer di-reset setiap slide berganti,
  // dan berhenti sementara saat user sedang drag.
  useEffect(() => {
    if (paused) return

    const timer = window.setTimeout(() => {
      setPage(([current]) => [(current + 1) % slides.length, 1])
    }, AUTOPLAY_MS)

    return () => window.clearTimeout(timer)
  }, [index, paused])

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setPaused(false)

    const swipedLeft =
      info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY
    const swipedRight =
      info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY

    if (swipedLeft && index < lastIndex) goTo(index + 1)
    else if (swipedRight && index > 0) goTo(index - 1)
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-white text-black">
        {/* Preload gambar slide berikutnya supaya transisi tidak kedip */}
        <div aria-hidden className="hidden">
          {slides.slice(1).map((s) => (
            <Image key={s.id} src={s.image} alt="" priority sizes="100vw" />
          ))}
        </div>

        {/* Main mobile layout */}
        <section className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5 sm:px-8">
          {/* Logo */}
          <header className="flex shrink-0 items-center justify-center pt-5 sm:pt-12">
            <Link href="/" aria-label="Duora home" className="flex items-center">
              <Image
                src={duoraLogo}
                alt=""
                width={28}
                height={28}
                priority
                className="h-7 w-7 object-contain"
              />

              <span className="text-[20px] font-bold tracking-tight text-[#999999]">
                DUORA
              </span>
            </Link>
          </header>

          {/* Onboarding carousel (ilustrasi + headline + deskripsi) */}
          <div
            className="relative -mx-5 grid flex-1 overflow-hidden sm:-mx-8"
            aria-roledescription="carousel"
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setPaused(true)}
                onDragEnd={handleDragEnd}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
                className="col-start-1 row-start-1 flex cursor-grab select-none flex-col active:cursor-grabbing"
              >
                {/* Hero illustration — full bleed */}
                <motion.div
                  variants={imageVariants}
                  className="relative flex min-h-[330px] flex-1 items-center justify-center pt-5 sm:min-h-[380px]"
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    priority={index === 0}
                    sizes="100vw"
                    draggable={false}
                    className="pointer-events-none h-full max-h-[440px] w-full object-contain object-center"
                  />
                </motion.div>

                {/* Headline and description */}
                <div className="mt-5 flex shrink-0 flex-col items-center px-5 text-center sm:px-8">
                  <h1 className="text-[36px] font-semibold leading-[0.94] tracking-[-1.3px]">
                    {slide.title.map((line, i) => (
                      <motion.span
                        key={i}
                        variants={textVariants}
                        className="block"
                      >
                        {line}
                      </motion.span>
                    ))}
                  </h1>

                  <motion.p
                    variants={textVariants}
                    className="mt-4 min-h-[45px] max-w-[320px] text-balance text-[14px] font-normal leading-[15px] text-[#666666]"
                  >
                    {slide.description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Onboarding indicator */}
          <div
            className="mt-5 flex shrink-0 items-center justify-center"
            role="group"
            aria-label={`Page ${index + 1} of ${slides.length}`}
          >
            {slides.map((s, i) => {
              const active = i === index

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to page ${i + 1}`}
                  aria-current={active ? 'step' : undefined}
                  className="rounded-full p-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <motion.span
                    className="block h-2 rounded-full"
                    initial={false}
                    animate={{
                      width: active ? 24 : 8,
                      backgroundColor: active ? '#000000' : '#A6A6A6',
                    }}
                    transition={{
                      width: { type: 'spring', stiffness: 380, damping: 32 },
                      backgroundColor: { duration: 0.3 },
                    }}
                  />
                </button>
              )
            })}
          </div>

          {/* Primary action */}
          <footer className="mt-5 shrink-0 pb-[max(28px,env(safe-area-inset-bottom))]">
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center rounded-full bg-neutral-800 px-6 text-[14px] font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
            >
              Start your LDR
            </Link>
          </footer>
        </section>
      </main>
    </MotionConfig>
  )
}