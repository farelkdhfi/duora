'use client'

import type { AiPersona, DebateMessage } from '../types'

interface DebateMessageBubbleProps {
  message: DebateMessage
  currentUserId: string
  persona?: AiPersona
  variant?: 'stage' | 'mediator' | 'resolution' | 'history'
}

/* Warna kartu resolution per persona (AI response biasa tetap putih) */
const resolutionTone: Record<
  AiPersona,
  { card: string; glow: string; accent: string }
> = {
  formal: {
    card: 'bg-neutral-800 shadow-[0_24px_70px_rgba(0,0,0,0.14)]',
    glow: 'bg-white/[0.05]',
    accent: 'text-amber-300/70',
  },
  lembut: {
    card: 'bg-[#C8808E] shadow-lg',
    glow: 'bg-white/[0.18]',
    accent: 'text-white/85',
  },
  kasar: {
    card: 'bg-[#C13131] shadow-lg',
    glow: 'bg-white/[0.18]',
    accent: 'text-white/85',
  },
  lebay: {
    card: 'bg-[#9CB8D9] shadow-lg',
    glow: 'bg-white/[0.18]',
    accent: 'text-white/85',
  },
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString(
    'id-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}

function renderListItem(item: unknown): string {
  if (typeof item === 'string') {
    return item
  }

  if (item && typeof item === 'object') {
    const obj = item as Record<string, unknown>

    const values = Object.values(obj)
      .filter((value) => typeof value === 'string')
      .join(': ')

    return values || JSON.stringify(item)
  }

  return String(item)
}

/* ===================================================== */
/* AI MEDIATOR */
/* ===================================================== */

function MediatorCard({
  message,
  resolution = false,
  persona,
}: {
  message: DebateMessage
  resolution?: boolean
  persona?: AiPersona
}) {
  const analysis = message.ai_analysis

  const tone =
    resolutionTone[persona ?? 'formal'] ??
    resolutionTone.formal

  return (
    <article
      className={[
        'relative overflow-hidden rounded-[1.9rem] border',
        resolution
          ? `${tone.card} text-white`
          : 'border-black/[0.055] bg-white text-neutral-900 shadow-[0_15px_50px_rgba(0,0,0,0.055)]',
      ].join(' ')}
    >
      {/* AMBIENT */}

      {!resolution && (
        <>
          <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-blue-300/[0.07] blur-[65px]" />

          <div className="pointer-events-none absolute -left-20 bottom-0 size-40 rounded-full bg-pink-300/[0.06] blur-[65px]" />
        </>
      )}

      {resolution && (
        <div
          className={`pointer-events-none absolute left-1/2 top-0 size-64 -translate-x-1/2 rounded-full blur-[80px] ${tone.glow}`}
        />
      )}

      <div className="relative p-5 sm:p-6">
        {/* TOP */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={[
                'flex size-8 items-center justify-center rounded-full',
                resolution
                  ? 'bg-white/[0.16]'
                  : 'bg-[#f7f2eb]',
              ].join(' ')}
            >
              <span
                className={
                  resolution
                    ? 'text-sm text-white/90'
                    : 'text-sm text-neutral-500'
                }
              >
                {resolution ? '♡' : '✦'}
              </span>
            </div>
          </div>

          <span
            className={[
              'text-[8.5px]',
              resolution
                ? 'text-white/60'
                : 'text-neutral-300',
            ].join(' ')}
          >
            {formatTime(message.created_at)}
          </span>
        </div>

        {/* MAIN STATEMENT */}

        <p
          className={[
            'tracking-[-0.012em]',
            resolution
              ? 'mt-7 text-[14px] leading-[1.9] text-white/95'
              : 'mt-6 text-[13px] leading-[1.8] text-neutral-600',
          ].join(' ')}
        >
          {analysis?.summary ??
            message.content}
        </p>

        {/* STRONGER ARGUMENT */}

        {resolution &&
          analysis?.stronger_argument && (
            <div className="mt-7 border-t border-white/20 pt-6">
              <p
                className={`text-[8px] font-semibold uppercase tracking-[0.17em] ${tone.accent}`}
              >
                Stronger argument
              </p>

              <p className="mt-2.5 text-[11.5px] leading-6 text-white/85">
                {analysis.stronger_argument}
              </p>
            </div>
          )}

        {/* FACTS */}

        {Boolean(analysis?.facts?.length) && (
          <div
            className={[
              'mt-7',
              resolution
                ? 'border-t border-white/15 pt-6'
                : 'border-t border-black/[0.045] pt-6',
            ].join(' ')}
          >
            <p
              className={[
                'text-[8px] font-semibold uppercase tracking-[0.17em]',
                resolution
                  ? 'text-white/70'
                  : 'text-neutral-300',
              ].join(' ')}
            >
              Facts
            </p>

            <ul className="mt-3 space-y-2.5">
              {analysis!.facts.map(
                (fact, index) => (
                  <li
                    key={index}
                    className={[
                      'pl-3 text-[11px] leading-5',
                      resolution
                        ? 'border-l border-white/30 text-white/85'
                        : 'border-l border-neutral-200 text-neutral-500',
                    ].join(' ')}
                  >
                    {renderListItem(fact)}
                  </li>
                ),
              )}
            </ul>
          </div>
        )}

        {/* OPINIONS */}

        {Boolean(analysis?.opinions?.length) && (
          <div
            className={[
              'mt-6',
              analysis?.facts?.length
                ? resolution
                  ? 'border-t border-white/15 pt-6'
                  : 'border-t border-black/[0.045] pt-6'
                : '',
            ].join(' ')}
          >
            <p
              className={[
                'text-[8px] font-semibold uppercase tracking-[0.17em]',
                resolution
                  ? 'text-white/70'
                  : 'text-neutral-300',
              ].join(' ')}
            >
              Perspectives
            </p>

            <ul className="mt-3 space-y-2.5">
              {analysis!.opinions.map(
                (opinion, index) => (
                  <li
                    key={index}
                    className={[
                      'pl-3 text-[11px] leading-5',
                      resolution
                        ? 'border-l border-white/30 text-white/85'
                        : 'border-l border-pink-300/30 text-neutral-500',
                    ].join(' ')}
                  >
                    {renderListItem(opinion)}
                  </li>
                ),
              )}
            </ul>
          </div>
        )}

        {/* COMMON GROUND */}

        {analysis?.common_ground && (
          <div
            className={[
              'mt-7 rounded-[1.35rem] border p-4.5',
              resolution
                ? 'border-white/20 bg-white/[0.12]'
                : 'border-black/[0.045] bg-[#f8f7f3]',
            ].join(' ')}
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  'text-sm',
                  resolution
                    ? 'text-white/80'
                    : 'text-neutral-400',
                ].join(' ')}
              >
                ♡
              </span>

              <p
                className={[
                  'text-[8px] font-semibold uppercase tracking-[0.17em]',
                  resolution
                    ? 'text-white/75'
                    : 'text-neutral-300',
                ].join(' ')}
              >
                Common ground
              </p>
            </div>

            <p
              className={[
                'mt-2.5 text-[11.5px] leading-5',
                resolution
                  ? 'text-white/90'
                  : 'text-neutral-500',
              ].join(' ')}
            >
              {analysis.common_ground}
            </p>
          </div>
        )}
      </div>
    </article>
  )
}

/* ===================================================== */
/* HISTORY THOUGHT */
/* ===================================================== */

function HistoryThought({
  message,
  currentUserId,
}: {
  message: DebateMessage
  currentUserId: string
}) {
  const isOwnMessage =
    message.sender_id === currentUserId

  const senderName =
    message.profiles?.display_name ??
    message.profiles?.username ??
    'Someone'

  return (
    <div
      className={[
        'group relative py-3',
        isOwnMessage
          ? 'pl-8'
          : 'pr-8',
      ].join(' ')}
    >
      <div
        className={[
          'rounded-[1.35rem] border px-4 py-3.5 transition-all duration-200',
          isOwnMessage
            ? 'border-black/[0.055] bg-neutral-900 text-white'
            : 'border-black/[0.045] bg-white text-neutral-800',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-3">
          <p
            className={[
              'text-[8px] font-semibold uppercase tracking-[0.13em]',
              isOwnMessage
                ? 'text-white/35'
                : 'text-neutral-300',
            ].join(' ')}
          >
            {senderName}
          </p>

          <span
            className={[
              'text-[8px]',
              isOwnMessage
                ? 'text-white/25'
                : 'text-neutral-300',
            ].join(' ')}
          >
            {formatTime(
              message.created_at,
            )}
          </span>
        </div>

        <p
          className={[
            'mt-2.5 whitespace-pre-line break-words text-[11.5px] leading-[1.7]',
            isOwnMessage
              ? 'text-white/[0.72]'
              : 'text-neutral-600',
          ].join(' ')}
        >
          {message.content}
        </p>
      </div>
    </div>
  )
}

/* ===================================================== */
/* EXPORT */
/* ===================================================== */

export default function DebateMessageBubble({
  message,
  currentUserId,
  persona,
  variant = 'stage',
}: DebateMessageBubbleProps) {
  if (message.role === 'ai') {
    return (
      <MediatorCard
        message={message}
        persona={persona}
        resolution={
          variant === 'resolution' ||
          Boolean(message.is_final_verdict)
        }
      />
    )
  }

  if (variant === 'history') {
    return (
      <HistoryThought
        message={message}
        currentUserId={currentUserId}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <HistoryThought
        message={message}
        currentUserId={currentUserId}
      />
    </div>
  )
}