'use client'

import { useCallback, useEffect, useState, useTransition, type ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type PanInfo,
  type Variants,
} from 'framer-motion'
import logo from '@/assets/logo-white.png'
import hero1 from '@/assets/landingpage/hero-mobile-1.png'
import hero2 from '@/assets/landingpage/hero-mobile-2-2.png'
import heroDesktop1 from '@/assets/landingpage/hero-desktop.png'
import heroDesktop2 from '@/assets/landingpage/hero-desktop-2.png'
import heroBg from '@/assets/landingpage/hero-bg-mobile.png'
import heroBg2 from '@/assets/landingpage/hero-bg-mobile-2.png'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const AUTOPLAY_MS = 4500 // jeda antar slide otomatis
const SLIDE_OFFSET = 64 // jarak geser slide saat masuk/keluar (px)
const SWIPE_DISTANCE = 60 // minimal jarak drag agar dianggap swipe (px)
const SWIPE_VELOCITY = 400 // atau minimal kecepatan flick (px/s)
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// Gradient pojok kiri atas khusus desktop, satu per slide.
const DESKTOP_CORNER_GRADIENTS = [
  // Slide 1: ungu
  'radial-gradient(40% 50% at 0% 0%, rgba(173,114,192,0.18) 0%, rgba(173,114,192,0) 70%)',
  // Slide 2: biru
  'radial-gradient(40% 50% at 0% 0%, rgba(107,155,194,0.18) 0%, rgba(107,155,194,0) 70%)',
]

/* -------------------------------------------------------------------------- */
/*  Slides                                                                    */
/* -------------------------------------------------------------------------- */

const Accent = ({ children }: { children: ReactNode }) => (
  <span className="text-[#AD72C0]">{children}</span>
)

const Accent2 = ({ children }: { children: ReactNode }) => (
  <span className="text-[#6b9bc2]">{children}</span>
)

type Slide = {
  id: string
  image: StaticImageData // mobile
  imageDesktop: StaticImageData // desktop
  alt: string
  title: ReactNode[] // satu item = satu baris judul
  description: ReactNode
}

const slides: Slide[] = [
  {
    id: 'love-lives-here',
    image: hero1,
    imageDesktop: heroDesktop1,
    alt: 'Two fluffy cat characters staying connected through Duora',
    title: ['Love', <>lives <Accent>here.</Accent></>],
    description: (
      <>
        Tempat nyaman untuk tetap dekat
        <br className="hidden min-[360px]:block lg:hidden" />
        dan saling terhubung, meski
        <br className="lg:hidden" />
        terpisah jarak.
      </>
    ),
  },
  {
    id: 'assistant',
    image: hero2,
    imageDesktop: heroDesktop2,
    alt: 'Duora AI assistant helping a couple with their relationship',
    title: ['Assistant', <>your <Accent2>relationship</Accent2></>],
    description: (
      <>
        Tanya apa pun tentang hubungan
        <br className="hidden min-[360px]:block lg:hidden" />
        kalian, Duora AI memahami
        <br className="lg:hidden" />
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

  const router = useRouter()
  const [isNavigating, startTransition] = useTransition()

  const handleStart = () => {
    startTransition(() => {
      router.push('/login')
    })
  }

  // prefetch supaya navigasi terasa lebih cepat
  useEffect(() => {
    router.prefetch('/login')
  }, [router])

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
      <main className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-primary text-white">
        {/* Preload gambar slide berikutnya supaya transisi tidak kedip */}
        <div aria-hidden className="hidden">
          {slides.slice(1).map((s) => (
            <span key={s.id}>
              <Image src={s.image} alt="" priority sizes="100vw" />
              <Image src={s.imageDesktop} alt="" priority sizes="50vw" />
            </span>
          ))}
        </div>

        {/* Background mobile (gambar) */}
        {index === 0 && (
          <Image
            src={heroBg}
            alt=""
            aria-hidden="true"
            priority
            sizes="100vw"
            className="pointer-events-none absolute left-0 top-0 z-0 h-auto w-full object-contain lg:hidden"
          />
        )}

        {index === 1 && (
          <Image
            src={heroBg2}
            alt=""
            aria-hidden="true"
            priority
            sizes="100vw"
            className="pointer-events-none absolute left-0 top-0 z-0 h-auto w-full object-contain lg:hidden"
          />
        )}

        {/* Background desktop: gradient pojok kiri atas (crossfade antar slide) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
        >
          {DESKTOP_CORNER_GRADIENTS.map((gradient, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{ background: gradient }}
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Main layout */}
        <section className="z-10 mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5 sm:px-8 lg:max-w-[1320px] lg:px-12 xl:px-16">
          {/* Logo */}
          <header className="mt-8 flex shrink-0 items-center justify-center lg:mt-10 lg:justify-start lg:gap-2.5">
            <Link href="/" aria-label="Duora home" className="flex items-center lg:gap-2.5">
              <Image
                src={logo}
                alt=""
                width={28}
                height={28}
                priority
                className="h-5 w-5 object-contain lg:h-7 lg:w-7"
              />

              <span className="text-[15px] font-semibold text-white lg:text-[20px] lg:tracking-wide">
                DUORA
              </span>
            </Link>
          </header>

          {/* Onboarding carousel */}
          <div
            className="relative -mx-5 grid flex-1 overflow-hidden sm:-mx-8 lg:mx-0"
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
                className="relative z-10 col-start-1 row-start-1 flex cursor-grab select-none flex-col active:cursor-grabbing lg:grid lg:grid-cols-[1fr_1.15fr] lg:content-center lg:items-center lg:gap-10 xl:gap-16"
              >
                {/* Hero illustration */}
                <motion.div
                  variants={imageVariants}
                  className="relative flex min-h-[330px] flex-1 items-center justify-center pt-5 sm:min-h-[380px] lg:order-2 lg:h-[520px] lg:min-h-0 lg:flex-none lg:pt-0 xl:h-[620px]"
                >
                  {/* Mobile image */}
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    priority={index === 0}
                    sizes="100vw"
                    draggable={false}
                    className="pointer-events-none h-full max-h-[440px] w-full object-contain object-center lg:hidden"
                  />

                  {/* Desktop image */}
                  <Image
                    src={slide.imageDesktop}
                    alt={slide.alt}
                    priority={index === 0}
                    sizes="(min-width: 1024px) 55vw, 0px"
                    draggable={false}
                    className="pointer-events-none hidden h-full w-full object-contain object-center lg:block"
                  />
                </motion.div>

                {/* Headline and description */}
                <div className="mt-5 flex shrink-0 flex-col items-center px-5 text-center sm:px-8 lg:order-1 lg:mt-0 lg:items-start lg:px-0 lg:text-left">
                  <h1 className="text-[36px] font-semibold leading-[0.94] tracking-[-1.3px] lg:text-[76px] lg:leading-[0.95] lg:tracking-[-3px] xl:text-[92px] xl:tracking-[-3.5px]">
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
                    className="mt-4 min-h-[45px] max-w-[320px] text-balance text-[14px] font-normal leading-[15px] text-description lg:mt-8 lg:min-h-0 lg:max-w-[460px] lg:text-[18px] lg:leading-[1.65] xl:text-[20px]"
                  >
                    {slide.description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Onboarding indicator */}
          <div
            className="mt-5 flex shrink-0 items-center justify-center lg:mt-2 lg:justify-start"
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
                  className="rounded-full p-[3px] lg:first:pl-0"
                >
                  <motion.span
                    className="block h-1 rounded-full"
                    initial={false}
                    animate={{
                      width: active ? 24 : 8,
                      backgroundColor: active ? '#fff' : '#444444',
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
          <footer className="mt-5 shrink-0 pb-[max(28px,env(safe-area-inset-bottom))] lg:mt-6 lg:pb-14">
            <button
              type="button"
              onClick={handleStart}
              disabled={isNavigating}
              aria-busy={isNavigating}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-[14px] font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:scale-100 lg:h-14 lg:w-auto lg:min-w-[260px] lg:px-10 lg:text-[16px]"
            >
              {isNavigating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                'Start your LDR'
              )}
            </button>
          </footer>
        </section>
      </main>
    </MotionConfig>
  )
}