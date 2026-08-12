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
}[] = [
  {
    value: 'happy',
    image: happyEmot,
    label: 'Happy',
  },
  {
    value: 'neutral',
    image: neutralEmot,
    label: 'Neutral',
  },
  {
    value: 'sad',
    image: sadEmot,
    label: 'Sad',
  },
  {
    value: 'tired',
    image: tiredEmot,
    label: 'Tired',
  },
  {
    value: 'stressed',
    image: stressedEmot,
    label: 'Stressed',
  },
]

export default function MoodSelector({
  value,
  onChange,
}: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2.5">
      {moods.map((mood) => {
        const selected = value === mood.value

        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            aria-pressed={selected}
            className={[
              'group relative flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl p-3',
              '',
              'active:scale-[0.97]',
              selected
                ? [
                    'border-none',
                  ].join(' ')
                : [
                    'border border-neutral-200',
                    'bg-white',
                    'hover:-translate-y-0.5',
                    'hover:border-neutral-300',
                    'hover:bg-neutral-50/70',
                    'hover:shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)]',
                  ].join(' '),
            ].join(' ')}
          >
            {/* Selected indicator */}
            {selected && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-neutral-900" />
            )}

            <img
              src={mood.image.src}
              alt={mood.label}
              className={[
                'h-9 w-9 object-contain',
                'transition-transform duration-200',
                selected
                  ? 'scale-180'
                  : ' grayscale-30 group-hover:scale-105',
              ].join(' ')}
            />

            <span
              className={[
                'text-[11px] font-medium',
                selected
                  ? 'text-neutral-900 text-sm mt-4'
                  : 'text-neutral-400',
              ].join(' ')}
            >
              {mood.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}