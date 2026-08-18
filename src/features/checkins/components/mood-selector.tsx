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
  accent: string
  glow: string
}[] = [
  {
    value: 'happy',
    image: happyEmot,
    label: 'Happy',
    accent: 'bg-pink-400',
    glow: 'bg-pink-400/[0.10]',
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
    glow: 'bg-blue-400/[0.10]',
  },
  {
    value: 'tired',
    image: tiredEmot,
    label: 'Tired',
    accent: 'bg-indigo-400',
    glow: 'bg-indigo-400/[0.09]',
  },
  {
    value: 'stressed',
    image: stressedEmot,
    label: 'Stressed',
    accent: 'bg-rose-400',
    glow: 'bg-rose-400/[0.09]',
  },
]

export default function MoodSelector({
  value,
  onChange,
}: MoodSelectorProps) {
  return (
    <div
      className="
        grid
        grid-cols-3
        gap-2

        sm:grid-cols-5
        sm:gap-2.5

        lg:gap-3
      "
    >
      {moods.map((mood) => {
        const selected = value === mood.value

        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            aria-pressed={selected}
            className={`
              group
              relative
              flex
              min-h-[100px]
              w-full
              flex-col
              items-center
              justify-center
              overflow-hidden
              rounded-[1.15rem]
              border
              px-2
              py-3
              outline-none
              transition-all
              duration-300

              sm:min-h-[112px]
              sm:rounded-[1.25rem]
              sm:px-3
              sm:py-4

              lg:min-h-[118px]

              focus-visible:ring-4
              focus-visible:ring-black/[0.04]

              active:scale-[0.98]

              ${
                selected
                  ? `
                    border-black/[0.09]
                    bg-white
                    shadow-[0_12px_30px_-18px_rgba(0,0,0,0.25)]
                    -translate-y-0.5
                  `
                  : `
                    border-black/[0.04]
                    bg-white/60

                    hover:-translate-y-0.5
                    hover:border-black/[0.07]
                    hover:bg-white
                    hover:shadow-[0_10px_25px_-18px_rgba(0,0,0,0.20)]
                  `
              }
            `}
          >
            {/* ================================================= */}
            {/* AMBIENT */}
            {/* ================================================= */}

            {selected && (
              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-8
                  -top-8
                  size-20
                  rounded-full
                  blur-[28px]
                  ${mood.glow}
                `}
              />
            )}

            {/* ================================================= */}
            {/* EMOTICON */}
            {/* ================================================= */}

            <div
              className="
                relative
                flex
                h-11
                items-center
                justify-center

                sm:h-14
              "
            >
              <img
                src={mood.image.src}
                alt={mood.label}
                className={`
                  object-contain
                  transition-all
                  duration-300

                  ${
                    selected
                      ? `
                        h-11
                        w-11
                        sm:h-14
                        sm:w-14
                      `
                      : `
                        h-9
                        w-9
                        opacity-65
                        grayscale-[20%]

                        sm:h-11
                        sm:w-11

                        group-hover:scale-105
                        group-hover:opacity-90
                      `
                  }
                `}
              />
            </div>

            {/* ================================================= */}
            {/* LABEL */}
            {/* ================================================= */}

            <span
              className={`
                relative
                mt-2
                text-center
                text-[9px]
                leading-none
                tracking-[-0.01em]
                transition-colors
                duration-200

                sm:mt-2.5
                sm:text-[10px]

                ${
                  selected
                    ? 'font-semibold text-neutral-800'
                    : 'font-medium text-neutral-400 group-hover:text-neutral-600'
                }
              `}
            >
              {mood.label}
            </span>

            {/* ================================================= */}
            {/* SELECTED INDICATOR */}
            {/* ================================================= */}

            <span
              className={`
                relative
                mt-2.5
                size-1
                rounded-full
                transition-all
                duration-300

                ${
                  selected
                    ? `${mood.accent} opacity-100`
                    : 'scale-0 opacity-0'
                }
              `}
            />
          </button>
        )
      })}
    </div>
  )
}