import happyEmot from '@/assets/emoticon/happy-emot.png'
import Image from 'next/image'

export default function PartnerCharacter({
  name,
  image,
  avatarUrl,
  latestMessage,
  previousCount,
  side,
  onPocketClick,
  isActive,
}: {
  name: string
  image: typeof happyEmot
  avatarUrl?: string | null
  latestMessage?: {
    content: string
    created_at: string
  }
  previousCount: number
  side: 'left' | 'right'
  onPocketClick: () => void
  isActive: boolean
}) {
  const isLeft = side === 'left'

  return (
    <section
      className={[
        'relative flex min-w-0 w-full flex-col items-center',
        'md:items-center',
        isLeft ? 'md:items-end' : 'md:items-start',
      ].join(' ')}
    >
      {/* LATEST THOUGHT */}

      <div
        className={[
          'w-full max-w-[310px] px-1 sm:px-0',
          isLeft
            ? 'md:mr-0 md:ml-auto'
            : 'md:ml-0 md:mr-auto',

          // MOBILE:
          // Partner (right) -> bubble di paling atas
          // You (left) -> bubble tetap di bawah
          !isLeft
            ? 'order-1 mb-6 sm:mb-7 md:order-3 md:mb-0 md:mt-12'
            : 'order-3 mt-10 sm:mt-12 md:order-3 md:mt-12',
        ].join(' ')}
      >
        {latestMessage ? (
          <div
            className={[
              'relative overflow-hidden rounded-[1.45rem] border border-black/[0.055] bg-white px-4 py-3.5 shadow-[0_15px_45px_rgba(0,0,0,0.045)] transition-all duration-500 sm:rounded-[1.7rem] sm:px-5 sm:py-4',
              isActive
                ? 'translate-y-0 opacity-100'
                : 'opacity-90',
            ].join(' ')}
          >
            <div
              className={[
                'absolute top-0 h-[2px] w-10 rounded-full sm:w-12',
                isLeft
                  ? 'left-4 bg-pink-300/60 sm:left-5'
                  : 'right-4 bg-blue-300/60 sm:right-5',
              ].join(' ')}
            />

            <p className="whitespace-pre-line break-words text-[12px] leading-[1.65] tracking-[-0.008em] text-neutral-700 sm:text-[12.5px] sm:leading-[1.7]">
              {latestMessage.content}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="truncate text-[7px] font-semibold uppercase tracking-[0.12em] text-neutral-300 sm:text-[8px] sm:tracking-[0.14em]">
                Latest thought
              </span>

              <span className="shrink-0 text-[7px] text-neutral-300 sm:text-[8px]">
                {new Date(
                  latestMessage.created_at,
                ).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.45rem] border border-dashed border-black/[0.07] bg-white/45 px-4 py-4 text-center sm:rounded-[1.7rem] sm:px-5 sm:py-5">
            <p className="text-[9px] leading-5 text-neutral-300 sm:text-[10px]">
              Waiting for their first thought.
            </p>
          </div>
        )}
      </div>

      {/* NAME */}

      <div
        className={[
          'flex max-w-full items-center gap-2 sm:mb-4',
          // Partner: bubble -> name -> image
          // You: image -> bubble, tetapi name tetap sebelum image
          !isLeft
            ? 'order-2 mb-3 md:order-1'
            : 'order-1 mb-3 md:order-1',
          isLeft
            ? 'md:flex-row-reverse'
            : 'md:flex-row',
        ].join(' ')}
      >
        <span className="max-w-[180px] truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400 sm:text-[10px] sm:tracking-[0.16em]">
          {name}
        </span>
      </div>

      {/* CHARACTER */}

      <div
        className={[
          'relative',
          !isLeft
            ? 'order-3 md:order-2'
            : 'order-2 md:order-2',
        ].join(' ')}
      >
        <div
          className={[
            'absolute -inset-4 rounded-full blur-3xl transition-all duration-700 sm:-inset-5',
            isLeft
              ? 'bg-pink-300/[0.16]'
              : 'bg-blue-300/[0.15]',
            isActive
              ? 'scale-110 opacity-100'
              : 'scale-90 opacity-50',
          ].join(' ')}
        />

        <div
          className={[
            'relative flex size-[78px] items-center justify-center rounded-full border border-black/[0.045] bg-white shadow-[0_16px_35px_rgba(0,0,0,0.07)]',
            'xs:size-[86px] sm:size-[108px]',
            isActive
              ? 'animate-[debate-breathe_4s_ease-in-out_infinite]'
              : '',
          ].join(' ')}
        >
          <div className="absolute inset-[4px] rounded-full bg-[#f8f7f3] sm:inset-[5px]" />

          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="relative z-10 size-[70px] rounded-full object-cover xs:size-[78px] sm:size-[98px]"
            />
          ) : (
            <Image
              src={image}
              alt={name}
              width={82}
              height={82}
              className="relative z-10 size-[60px] object-contain xs:size-[66px] sm:size-[82px]"
            />
          )}
        </div>

        {/* MEMORY POCKET */}

        <button
          type="button"
          onClick={onPocketClick}
          disabled={previousCount === 0}
          aria-label={`Open ${name}'s previous thoughts`}
          className={[
            'group absolute -bottom-3 z-22 flex min-w-[62px] items-center justify-center gap-1 rounded-[1rem] border border-black/[0.06] bg-white px-2.5 py-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.07)] transition-all duration-300 sm:-bottom-4 sm:min-w-[68px] sm:gap-1.5 sm:rounded-[1.2rem] sm:px-3 sm:py-2',
            isLeft
              ? '-right-3 sm:-right-4'
              : '-left-3 sm:-left-4',
            previousCount > 0
              ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,0.1)]'
              : 'cursor-default opacity-45',
          ].join(' ')}
        >
          <span className="text-[11px] font-semibold tracking-[-0.03em] text-neutral-800 sm:text-[12px]">
            {previousCount}
          </span>

          <span className="text-[7px] font-medium uppercase tracking-[0.1em] text-neutral-400 sm:text-[8px] sm:tracking-[0.12em]">
            saved
          </span>
        </button>
      </div>
    </section>
  )
}