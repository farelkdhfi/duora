'use client'

import { useEffect, useRef, useState } from 'react'

import type { Mood } from '../types'

import happyEmot1 from '@/assets/emoticon/happy-fluffy.webp'
import happyEmot2 from '@/assets/emoticon/happy-fluffy-2.webp'
import happyEmot3 from '@/assets/emoticon/happy-fluffy-3.webp'

import neutralEmot1 from '@/assets/emoticon/neutral-fluffy.webp'
import neutralEmot2 from '@/assets/emoticon/neutral-fluffy-2.webp'
import neutralEmot3 from '@/assets/emoticon/neutral-fluffy-3.webp'

import sadEmot1 from '@/assets/emoticon/sad-fluffy.webp'
import sadEmot2 from '@/assets/emoticon/sad-fluffy-2.webp'
import sadEmot3 from '@/assets/emoticon/sad-fluffy-3.webp'

import tiredEmot1 from '@/assets/emoticon/tired-fluffy.webp'
import tiredEmot2 from '@/assets/emoticon/tired-fluffy-2.webp'
import tiredEmot3 from '@/assets/emoticon/tired-fluffy-3.webp'

import stressedEmot1 from '@/assets/emoticon/stressed-fluffy.webp'
import stressedEmot2 from '@/assets/emoticon/stressed-fluffy-2.webp'
import stressedEmot3 from '@/assets/emoticon/stressed-fluffy-3.webp'

interface MoodSelectorProps {
  value: Mood
  onChange: (mood: Mood) => void
}

const moods: {
  value: Mood
  images: typeof happyEmot1[]
  label: string
  accent: string
}[] = [
  {
    value: 'happy',
    images: [happyEmot1, happyEmot2, happyEmot3],
    label: 'Happy',
    accent: 'bg-pink-400',
  },
  {
    value: 'neutral',
    images: [neutralEmot1, neutralEmot2, neutralEmot3],
    label: 'Neutral',
    accent: 'bg-neutral-400',
  },
  {
    value: 'sad',
    images: [sadEmot1, sadEmot2, sadEmot3],
    label: 'Sad',
    accent: 'bg-blue-400',
  },
  {
    value: 'tired',
    images: [tiredEmot1, tiredEmot2, tiredEmot3],
    label: 'Tired',
    accent: 'bg-indigo-400',
  },
  {
    value: 'stressed',
    images: [stressedEmot1, stressedEmot2, stressedEmot3],
    label: 'Stressed',
    accent: 'bg-rose-400',
  },
]

export default function MoodSelector({
  value,
  onChange,
}: MoodSelectorProps) {
  const activeIndex = moods.findIndex((mood) => mood.value === value)
  const currentMood = moods[activeIndex] ?? moods[0]

  const startX = useRef(0)

  const [dragging, setDragging] = useState(false)
  const [currentVariant, setCurrentVariant] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(
    () => new Set(),
  )

  /*
   * Reset variasi ketika mood berubah.
   * Jadi setiap mood selalu dimulai dari variasi pertama.
   */
  useEffect(() => {
    setCurrentVariant(0)
  }, [value])

  /*
   * Automatic dissolve animation.
   *
   * Setiap 2.8 detik pindah ke variasi berikutnya.
   * CSS opacity transition membuat pergantiannya terlihat seperti dissolve.
   */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentVariant((previous) => (previous + 1) % currentMood.images.length)
    }, 2800)

    return () => {
      window.clearInterval(interval)
    }
  }, [currentMood.images.length, value])

  /*
   * Preload semua variasi gambar.
   */
  useEffect(() => {
    let mounted = true

    moods.forEach((mood) => {
      mood.images.forEach((image) => {
        const preloadImage = new Image()

        preloadImage.src = image.src

        const markAsLoaded = () => {
          if (!mounted) return

          setLoadedImages((previous) => {
            if (previous.has(image.src)) {
              return previous
            }

            const next = new Set(previous)
            next.add(image.src)

            return next
          })
        }

        preloadImage.onload = markAsLoaded
        preloadImage.onerror = markAsLoaded

        if (preloadImage.complete) {
          markAsLoaded()
        }
      })
    })

    return () => {
      mounted = false
    }
  }, [])

  const currentImage = currentMood.images[currentVariant]
  const nextImage =
    currentMood.images[(currentVariant + 1) % currentMood.images.length]

  const currentImageLoaded = loadedImages.has(currentImage.src)

  const changeMood = (direction: 1 | -1) => {
    const nextIndex = activeIndex + direction

    if (nextIndex < 0 || nextIndex >= moods.length) return

    onChange(moods[nextIndex].value)
  }

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    startX.current = event.clientX
    setDragging(true)

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!dragging) return

    const distance = event.clientX - startX.current
    const threshold = 45

    if (Math.abs(distance) >= threshold) {
      changeMood(distance < 0 ? 1 : -1)
    }

    setDragging(false)
  }

  const handlePointerCancel = () => {
    setDragging(false)
  }

  return (
    <div className="relative w-full overflow-visible">
      <div
        role="group"
        aria-label="Mood selector"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`relative flex min-h-[360px] w-full touch-pan-y select-none items-center justify-center overflow-visible outline-none sm:min-h-[410px] ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          className={`relative flex flex-col items-center justify-center transition-transform duration-300 ease-out ${
            dragging ? 'scale-[0.97]' : 'scale-100'
          }`}
        >
          <div className="relative flex h-[270px] w-64 items-center justify-center sm:h-[300px] sm:w-72">
            {/* Shadow */}
            <div
              className={`pointer-events-none absolute bottom-[20px] left-1/2 z-0 h-[18px] w-[145px] -translate-x-1/2 rounded-[50%] bg-black/[0.16] blur-[14px] transition-all duration-500 sm:bottom-[20px] sm:h-[21px] sm:w-[170px] ${
                dragging
                  ? 'scale-x-75 opacity-50'
                  : 'scale-x-100 opacity-100'
              }`}
            />

            {/* Loading indicator */}
            {!currentImageLoaded && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-700" />
              </div>
            )}

            {/* Mood images */}
            <div
              className={`relative z-10 h-56 w-56 transition-transform duration-500 ease-out sm:h-60 sm:w-60 ${
                dragging
                  ? 'translate-y-2'
                  : '-translate-y-2'
              }`}
            >
              {/* Current image */}
              <img
                src={currentImage.src}
                alt={currentMood.label}
                draggable={false}
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-[900ms] ease-in-out ${
                  currentImageLoaded
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
              />

              {/* Next image preload / dissolve layer */}
              <img
                key={`${currentMood.value}-${currentVariant}-next`}
                src={nextImage.src}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain opacity-0"
              />
            </div>
          </div>

          <span className="mt-0 text-[30px] font-medium tracking-[-0.055em] text-neutral-900 sm:text-[34px]">
            {currentMood.label}
          </span>

          <span className="mt-2 text-[11px] font-medium tracking-[-0.01em] text-neutral-400">
            Swipe to change
          </span>
        </div>
      </div>

      {/* Mood indicators */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {moods.map((mood, index) => {
          const selected = index === activeIndex

          return (
            <button
              key={mood.value}
              type="button"
              aria-label={`Select ${mood.label}`}
              aria-pressed={selected}
              onClick={() => onChange(mood.value)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selected
                  ? `w-6 ${mood.accent}`
                  : 'w-1.5 bg-neutral-300/70 hover:bg-neutral-400'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}