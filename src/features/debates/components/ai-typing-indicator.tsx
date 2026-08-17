'use client'

import { Sparkles } from 'lucide-react'

interface AiTypingIndicatorProps {
  isFinalVerdict?: boolean
}

export default function AiTypingIndicator({
  isFinalVerdict = false,
}: AiTypingIndicatorProps) {
  return (
    <div className="flex justify-center px-2 py-3">
      <div
        className={`
          flex
          w-full
          max-w-lg
          items-center
          gap-3
          overflow-hidden
          rounded-[1.5rem]
          border
          p-4
          ${
            isFinalVerdict
              ? 'border-neutral-900/10 bg-neutral-950'
              : 'border-blue-100 bg-blue-50/60'
          }
        `}
      >
        <div
          className={`
            flex
            size-7
            shrink-0
            items-center
            justify-center
            rounded-full
            ${
              isFinalVerdict
                ? 'bg-white/10'
                : 'bg-blue-100'
            }
          `}
        >
          <Sparkles
            size={13}
            strokeWidth={2}
            className={`
              ${
                isFinalVerdict
                  ? 'text-white/80'
                  : 'text-blue-500'
              }
              animate-pulse
            `}
          />
        </div>

        <div className="min-w-0">
          <p
            className={`
              text-[11px]
              font-semibold
              ${
                isFinalVerdict
                  ? 'text-white'
                  : 'text-neutral-800'
              }
            `}
          >
            {isFinalVerdict
              ? 'Menyusun kesimpulan akhir...'
              : 'AI Mediator sedang menganalisis...'}
          </p>

          <div className="mt-1.5 flex items-center gap-1">
            <span
              className={`
                size-1.5
                animate-bounce
                rounded-full
                [animation-delay:-0.3s]
                ${
                  isFinalVerdict
                    ? 'bg-white/50'
                    : 'bg-blue-400'
                }
              `}
            />

            <span
              className={`
                size-1.5
                animate-bounce
                rounded-full
                [animation-delay:-0.15s]
                ${
                  isFinalVerdict
                    ? 'bg-white/50'
                    : 'bg-blue-400'
                }
              `}
            />

            <span
              className={`
                size-1.5
                animate-bounce
                rounded-full
                ${
                  isFinalVerdict
                    ? 'bg-white/50'
                    : 'bg-blue-400'
                }
              `}
            />
          </div>
        </div>
      </div>
    </div>
  )
}