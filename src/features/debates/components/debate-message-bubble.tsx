'use client'

import {
  Award,
  CheckCircle2,
  Lightbulb,
  MessageCircleQuestion,
  Sparkles,
} from 'lucide-react'

import type { DebateMessage } from '../types'

interface DebateMessageBubbleProps {
  message: DebateMessage
  currentUserId: string
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
      .filter((v) => typeof v === 'string')
      .join(': ')

    return values || JSON.stringify(item)
  }

  return String(item)
}

export default function DebateMessageBubble({
  message,
  currentUserId,
}: DebateMessageBubbleProps) {
  /* ===================================================== */
  /* AI MESSAGE */
  /* ===================================================== */

  if (message.role === 'ai') {
    const analysis = message.ai_analysis

    return (
      <div className="flex justify-center px-2 py-3">
        <div
          className={`
            w-full
            max-w-lg
            overflow-hidden
            rounded-[1.5rem]
            border
            ${message.is_final_verdict
              ? 'border-neutral-900/10 bg-neutral-950 text-white'
              : 'border-blue-100 bg-blue-50/60'
            }
            p-4
            sm:p-5
          `}
        >
          {/* HEADER */}

          <div className="flex items-center gap-2">
            <div
              className={`
                flex
                size-7
                shrink-0
                items-center
                justify-center
                rounded-full
                ${message.is_final_verdict
                  ? 'bg-white/10'
                  : 'bg-blue-100'
                }
              `}
            >
              <Sparkles
                size={13}
                strokeWidth={2}
                className={
                  message.is_final_verdict
                    ? 'text-white/80'
                    : 'text-blue-500'
                }
              />
            </div>

            <div className="min-w-0">
              <p
                className={`
                  text-[11px]
                  font-semibold
                  ${message.is_final_verdict
                    ? 'text-white'
                    : 'text-neutral-800'
                  }
                `}
              >
                {message.is_final_verdict
                  ? 'Kesimpulan AI Mediator'
                  : 'AI Mediator'}
              </p>

              <p
                className={`
                  text-[9px]
                  ${message.is_final_verdict
                    ? 'text-white/40'
                    : 'text-neutral-400'
                  }
                `}
              >
                {formatTime(message.created_at)}
              </p>
            </div>
          </div>

          {/* SUMMARY */}

          <p
            className={`
              mt-3
              text-[13px]
              leading-6
              ${message.is_final_verdict
                ? 'text-white/80'
                : 'text-neutral-700'
              }
            `}
          >
            {analysis?.summary ?? message.content}
          </p>

          {/* STRONGER ARGUMENT BADGE (khusus final verdict) */}

          {message.is_final_verdict &&
            analysis?.stronger_argument && (
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3.5">
                <div className="flex items-center gap-1.5">
                  <Award
                    size={13}
                    strokeWidth={2}
                    className="text-amber-400"
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-400">
                    Argumen lebih logis
                  </span>
                </div>

                <p className="mt-2 text-[12.5px] leading-6 text-white/85">
                  {analysis.stronger_argument}
                </p>
              </div>
            )}

          {/* FACTS */}

          {Boolean(analysis?.facts?.length) && (
            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  size={12}
                  strokeWidth={2}
                  className={
                    message.is_final_verdict
                      ? 'text-emerald-400'
                      : 'text-emerald-500'
                  }
                />

                {message.ai_provider && (
                  <span
                    className={`
      ml-auto
      shrink-0
      rounded-full
      px-2
      py-0.5
      text-[8px]
      font-medium
      uppercase
      tracking-wide
      ${message.is_final_verdict
                        ? 'bg-white/10 text-white/40'
                        : 'bg-white text-neutral-400'
                      }
    `}
                  >
                    {message.ai_provider}
                  </span>
                )}

                <span
                  className={`
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    ${message.is_final_verdict
                      ? 'text-white/50'
                      : 'text-neutral-400'
                    }
                  `}
                >
                  Fakta
                </span>
              </div>

              <ul className="mt-1.5 space-y-1">
                {analysis!.facts.map((fact, i) => (
                  <li
                    key={i}
                    className={`
            text-[12px]
            leading-5
            ${message.is_final_verdict
                        ? 'text-white/70'
                        : 'text-neutral-600'
                      }
          `}
                  >
                    • {renderListItem(fact)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* OPINIONS */}

          {Boolean(analysis?.opinions?.length) && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <MessageCircleQuestion
                  size={12}
                  strokeWidth={2}
                  className={
                    message.is_final_verdict
                      ? 'text-pink-400'
                      : 'text-pink-500'
                  }
                />

                <span
                  className={`
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    ${message.is_final_verdict
                      ? 'text-white/50'
                      : 'text-neutral-400'
                    }
                  `}
                >
                  Opini
                </span>
              </div>

              <ul className="mt-1.5 space-y-1">
                {analysis!.opinions.map((opinion, i) => (
                  <li
                    key={i}
                    className={`
            text-[12px]
            leading-5
            ${message.is_final_verdict
                        ? 'text-white/70'
                        : 'text-neutral-600'
                      }
          `}
                  >
                    • {renderListItem(opinion)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* COMMON GROUND */}

          {analysis?.common_ground && (
            <div
              className={`
                mt-4
                flex
                items-start
                gap-2
                rounded-xl
                p-3
                ${message.is_final_verdict
                  ? 'bg-white/5'
                  : 'bg-white'
                }
              `}
            >
              <Lightbulb
                size={13}
                strokeWidth={2}
                className={`
                  mt-0.5
                  shrink-0
                  ${message.is_final_verdict
                    ? 'text-amber-300'
                    : 'text-amber-500'
                  }
                `}
              />

              <p
                className={`
                  text-[12px]
                  leading-5
                  ${message.is_final_verdict
                    ? 'text-white/70'
                    : 'text-neutral-600'
                  }
                `}
              >
                {analysis.common_ground}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ===================================================== */
  /* USER MESSAGE */
  /* ===================================================== */

  const isOwnMessage =
    message.sender_id === currentUserId

  const senderName =
    message.profiles?.display_name ??
    message.profiles?.username ??
    'Seseorang'

  return (
    <div
      className={`
        flex
        px-2
        py-1.5
        ${isOwnMessage ? 'justify-end' : 'justify-start'}
      `}
    >
      <div
        className={`
          max-w-[75%]
          rounded-2xl
          px-4
          py-2.5
          ${isOwnMessage
            ? 'rounded-br-md bg-neutral-900 text-white'
            : 'rounded-bl-md bg-neutral-100 text-neutral-900'
          }
        `}
      >
        {!isOwnMessage && (
          <p className="mb-0.5 text-[10px] font-semibold text-neutral-400">
            {senderName}
          </p>
        )}

        <p className="whitespace-pre-line break-words text-[13px] leading-5">
          {message.content}
        </p>

        <p
          className={`
            mt-1
            text-right
            text-[9px]
            ${isOwnMessage ? 'text-white/40' : 'text-neutral-400'}
          `}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}