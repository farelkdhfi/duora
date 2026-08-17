'use client'

interface AiTypingIndicatorProps {
  isFinalVerdict?: boolean
}

export default function AiTypingIndicator({
  isFinalVerdict = false,
}: AiTypingIndicatorProps) {
  return (
    <div className="px-4 py-3 sm:px-6 sm:py-4">
      <div
        className={`
          mx-auto
          flex
          w-full
          max-w-2xl
          items-center
          justify-center
          gap-3
          rounded-[1.25rem]
          border
          px-4
          py-3
          ${
            isFinalVerdict
              ? 'border-black/[0.055] bg-neutral-50/80'
              : 'border-black/[0.04] bg-neutral-50/50'
          }
        `}
      >
        {/* animated indicator */}

        <div className="flex items-center gap-1">
          <span
            className={`
              size-1.5
              animate-bounce
              rounded-full
              [animation-delay:-0.3s]
              ${
                isFinalVerdict
                  ? 'bg-neutral-900/45'
                  : 'bg-neutral-400'
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
                  ? 'bg-neutral-900/45'
                  : 'bg-neutral-400'
              }
            `}
          />

          <span
            className={`
              size-1.5
              animate-bounce
              ${
                isFinalVerdict
                  ? 'bg-neutral-900/45'
                  : 'bg-neutral-400'
              }
              rounded-full
            `}
          />
        </div>

        <p
          className={`
            text-[10.5px]
            font-medium
            tracking-[-0.005em]
            ${
              isFinalVerdict
                ? 'text-neutral-600'
                : 'text-neutral-400'
            }
          `}
        >
          {isFinalVerdict
            ? 'Preparing final verdict'
            : 'AI is analyzing'}
        </p>
      </div>
    </div>
  )
}