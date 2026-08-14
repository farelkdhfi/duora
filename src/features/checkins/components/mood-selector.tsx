'use client'

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
  background: string
  border: string
  glow: string
  dot: string
  text: string
}[] = [
  {
    value: 'happy',
    image: happyEmot,
    label: 'Happy',
    background: 'bg-[#FFF8E7]',
    border: 'border-[#FFD166]/40',
    glow: 'bg-[#FFD166]/20',
    dot: 'bg-[#FFB020]',
    text: 'text-[#D98200]',
  },
  {
    value: 'neutral',
    image: neutralEmot,
    label: 'Neutral',
    background: 'bg-[#F5F5F7]',
    border: 'border-neutral-300/70',
    glow: 'bg-neutral-200/50',
    dot: 'bg-neutral-500',
    text: 'text-neutral-700',
  },
  {
    value: 'sad',
    image: sadEmot,
    label: 'Sad',
    background: 'bg-[#F0F4FF]',
    border: 'border-[#5A7FBF]/30',
    glow: 'bg-[#5A7FBF]/15',
    dot: 'bg-[#4A5FA8]',
    text: 'text-[#4A5FA8]',
  },
  {
    value: 'tired',
    image: tiredEmot,
    label: 'Tired',
    background: 'bg-[#F5F2FA]',
    border: 'border-[#9B8AC4]/35',
    glow: 'bg-[#9B8AC4]/15',
    dot: 'bg-[#7A6FB0]',
    text: 'text-[#7A6FB0]',
  },
  {
    value: 'stressed',
    image: stressedEmot,
    label: 'Stressed',
    background: 'bg-[#FFF1F1]',
    border: 'border-[#D62E2E]/25',
    glow: 'bg-[#D62E2E]/12',
    dot: 'bg-[#D62E2E]',
    text: 'text-[#B0201F]',
  },
]

export default function MoodSelector({
  value,
  onChange,
}: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {moods.map((mood) => {
        const selected = value === mood.value

        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            aria-pressed={selected}
            className={[
              'group relative flex min-h-[92px] flex-col items-center justify-center overflow-hidden rounded-[18px] px-2 py-3 sm:min-h-[112px] sm:rounded-[22px] sm:px-3 sm:py-4',
              'transition-all duration-300',
              'active:scale-[0.97]',
              'focus:outline-none focus-visible:ring-4 focus-visible:ring-black/[0.05]',

              selected
                ? [
                    'border',
                    mood.border,
                    mood.background,
                    'shadow-[0_10px_25px_-15px_rgba(0,0,0,0.2)]',
                    '-translate-y-0.5',
                  ].join(' ')
                : [
                    'border border-black/[0.05]',
                    'bg-white',
                    'hover:-translate-y-0.5',
                    'hover:border-black/[0.08]',
                    'hover:bg-neutral-50/60',
                    'hover:shadow-[0_8px_20px_-14px_rgba(0,0,0,0.18)]',
                  ].join(' '),
            ].join(' ')}
          >
            {/* Ambient glow */}

            {selected && (
              <div
                className={`pointer-events-none absolute -right-5 -top-5 size-16 rounded-full blur-2xl ${mood.glow}`}
              />
            )}

            {/* Emoji */}

            <div className="relative flex h-11 items-center justify-center sm:h-14">
              <img
                src={mood.image.src}
                alt={mood.label}
                className={[
                  'object-contain transition-all duration-300',
                  selected
                    ? 'h-11 w-11 sm:h-14 sm:w-14'
                    : 'h-8 w-8 opacity-80 grayscale-[15%] sm:h-10 sm:w-10',
                  !selected && 'group-hover:scale-110 group-hover:opacity-100',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </div>

            {/* Label */}

            <span
              className={[
                'relative mt-1.5 text-center text-[10px] leading-tight transition-all duration-300 sm:mt-2 sm:text-[11px]',
                selected
                  ? `font-semibold ${mood.text}`
                  : 'font-medium text-neutral-400 group-hover:text-neutral-600',
              ].join(' ')}
            >
              {mood.label}
            </span>

            {/* Selected indicator */}

            <span
              className={[
                'mt-2 h-1 rounded-full transition-all duration-300',
                selected
                  ? `w-4 ${mood.dot} opacity-100`
                  : 'w-0 opacity-0',
              ].join(' ')}
            />
          </button>
        )
      })}
    </div>
  )
}