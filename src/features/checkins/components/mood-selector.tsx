'use client'

import { useEffect, useRef, useState } from 'react'

import type { Mood } from '../types'

import happyEmot from '@/assets/emoticon/happy-fluffy.webp'
import neutralEmot from '@/assets/emoticon/neutral-fluffy.webp'
import sadEmot from '@/assets/emoticon/sad-fluffy.webp'
import tiredEmot from '@/assets/emoticon/tired-fluffy.webp'
import stressedEmot from '@/assets/emoticon/stressed-fluffy.webp'

interface MoodSelectorProps {
  value: Mood
  onChange: (mood: Mood) => void
}

const moods: {
  value: Mood
  image: typeof happyEmot
  label: string
  accent: string
}[] = [
  {
    value: 'happy',
    image: happyEmot,
    label: 'Happy',
    accent: 'bg-pink-400',
  },
  {
    value: 'neutral',
    image: neutralEmot,
    label: 'Neutral',
    accent: 'bg-neutral-400',
  },
  {
    value: 'sad',
    image: sadEmot,
    label: 'Sad',
    accent: 'bg-blue-400',
  },
  {
    value: 'tired',
    image: tiredEmot,
    label: 'Tired',
    accent: 'bg-indigo-400',
  },
  {
    value: 'stressed',
    image: stressedEmot,
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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(
    () => new Set(),
  )

  /*
   * Preload semua gambar mood ketika component pertama kali muncul.
   *
   * Ini penting terutama saat production/deploy karena browser mungkin
   * belum pernah mengambil file .webp dari server/CDN.
   */
  useEffect(() => {
    let mounted = true

    moods.forEach((mood) => {
      const image = new Image()

      image.src = mood.image.src

      const markAsLoaded = () => {
        if (!mounted) return

        setLoadedImages((previous) => {
          if (previous.has(mood.value)) {
            return previous
          }

          const next = new Set(previous)
          next.add(mood.value)

          return next
        })
      }

      image.onload = markAsLoaded
      image.onerror = markAsLoaded

      // Kalau browser sudah punya gambar di cache
      if (image.complete) {
        markAsLoaded()
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  const currentImageLoaded = loadedImages.has(currentMood.value)

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

            {/* Character */}
            <img
              src={currentMood.image.src}
              alt={currentMood.label}
              draggable={false}
              onLoad={() => {
                setLoadedImages((previous) => {
                  if (previous.has(currentMood.value)) {
                    return previous
                  }

                  const next = new Set(previous)
                  next.add(currentMood.value)

                  return next
                })
              }}
              className={`relative z-10 h-56 w-56 object-contain transition-all duration-500 ease-out sm:h-60 sm:w-60 ${
                dragging
                  ? 'translate-y-2'
                  : '-translate-y-2'
              } ${
                currentImageLoaded
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            />
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