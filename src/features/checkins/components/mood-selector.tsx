'use client'

import { useRef, useState } from 'react'

import type { Mood } from '../types'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import sadEmot from '@/assets/emoticon/sad-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'

interface MoodSelectorProps {
  value: Mood
  onChange: (mood: Mood) => void
}

const moods: {
  value: Mood
  image: typeof happyEmot
  label: string
  accent: string
  glow: string
}[] = [
  {
    value: 'happy',
    image: happyEmot,
    label: 'Happy',
    accent: 'bg-pink-400',
    glow: 'bg-pink-400/[0.12]',
  },
  {
    value: 'neutral',
    image: neutralEmot,
    label: 'Neutral',
    accent: 'bg-neutral-400',
    glow: 'bg-neutral-400/[0.08]',
  },
  {
    value: 'sad',
    image: sadEmot,
    label: 'Sad',
    accent: 'bg-blue-400',
    glow: 'bg-blue-400/[0.11]',
  },
  {
    value: 'tired',
    image: tiredEmot,
    label: 'Tired',
    accent: 'bg-indigo-400',
    glow: 'bg-indigo-400/[0.10]',
  },
  {
    value: 'stressed',
    image: stressedEmot,
    label: 'Stressed',
    accent: 'bg-rose-400',
    glow: 'bg-rose-400/[0.10]',
  },
]

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const activeIndex = moods.findIndex((mood) => mood.value === value)
  const currentMood = moods[activeIndex] ?? moods[0]

  const startX = useRef(0)
  const [dragging, setDragging] = useState(false)

  const changeMood = (direction: 1 | -1) => {
    const nextIndex = activeIndex + direction

    if (nextIndex < 0 || nextIndex >= moods.length) return

    onChange(moods[nextIndex].value)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
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
    <div className="w-full">
      <div role="group" aria-label="Mood selector" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={handlePointerCancel} className={`relative flex min-h-[330px] w-full touch-pan-y select-none items-center justify-center overflow-hidden outline-none sm:min-h-[380px] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
        <div className={`relative flex flex-col items-center justify-center transition-transform duration-200 ${dragging ? 'scale-[0.96]' : 'scale-100'}`}>
          <div className="flex size-56 items-center justify-center sm:size-64">
            <img src={currentMood.image.src} alt={currentMood.label} draggable={false} className="h-56 w-56 object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.10)] transition-all duration-500 sm:h-56 sm:w-56" />
          </div>

          <span className="mt-2 text-[30px] font-medium tracking-[-0.055em] text-neutral-900 sm:text-[34px]">
            {currentMood.label}
          </span>

          <span className="mt-2 text-[11px] font-medium tracking-[-0.01em] text-neutral-400">
            Swipe to change
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-1.5">
        {moods.map((mood, index) => {
          const selected = index === activeIndex

          return (
            <button key={mood.value} type="button" aria-label={`Select ${mood.label}`} onClick={() => onChange(mood.value)} className={`h-1.5 rounded-full transition-all duration-300 ${selected ? `w-6 ${mood.accent}` : 'w-1.5 bg-neutral-200 hover:bg-neutral-300'}`} />
          )
        })}
      </div>
    </div>
  )
}